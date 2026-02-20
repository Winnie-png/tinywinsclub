import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!paystackSecret) {
    console.error("PAYSTACK_SECRET_KEY not configured");
    return new Response("Server configuration error", { status: 500, headers: corsHeaders });
  }

  const signature = req.headers.get("x-paystack-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 401, headers: corsHeaders });
  }

  const body = await req.text();

  const valid = await verifySignature(paystackSecret, body, signature);
  if (!valid) {
    console.error("Invalid Paystack webhook signature");
    return new Response("Invalid signature", { status: 401, headers: corsHeaders });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  if (event.event === "charge.success") {
    const userId = event.data?.metadata?.user_id;
    if (!userId || typeof userId !== "string") {
      console.error("Missing or invalid user_id in webhook metadata");
      return new Response("Missing user_id", { status: 400, headers: corsHeaders });
    }

    // Validate userId is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error("Invalid user_id format");
      return new Response("Invalid user_id format", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase
      .from("profiles")
      .update({ is_pro: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return new Response("Database error", { status: 500, headers: corsHeaders });
    }

    console.log(`Successfully upgraded user ${userId} to Pro`);
  }

  return new Response("OK", { status: 200, headers: corsHeaders });
});
