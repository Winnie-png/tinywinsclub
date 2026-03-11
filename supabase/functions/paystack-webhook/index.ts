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

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error("Invalid user_id format");
      return new Response("Invalid user_id format", { status: 400, headers: corsHeaders });
    }

    // Verify payment amount matches Pro price (40000 kobo = 400 KES)
    const allowedAmounts = [40000];
    const paidAmount = event.data?.amount;
    if (!allowedAmounts.includes(paidAmount)) {
      console.error(`Unexpected payment amount: ${paidAmount} kobo for user ${userId}`);
      return new Response("Invalid payment amount", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Fetch current profile to determine extend vs new
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching profile:", fetchError);
      return new Response("Database error", { status: 500, headers: corsHeaders });
    }

    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    let newExpiresAt: Date;

    if (profile?.is_pro && profile?.pro_expires_at) {
      // Already Pro: extend from current expiration
      const currentExpiry = new Date(profile.pro_expires_at);
      const baseDate = currentExpiry > now ? currentExpiry : now;
      newExpiresAt = new Date(baseDate.getTime() + thirtyDays);
    } else {
      // New Pro: start from now
      newExpiresAt = new Date(now.getTime() + thirtyDays);
    }

    const oldExpiresAt = profile?.pro_expires_at || null;

    const { error } = await supabase
      .from("profiles")
      .update({ is_pro: true, pro_expires_at: newExpiresAt.toISOString() })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return new Response("Database error", { status: 500, headers: corsHeaders });
    }

    // Audit log
    const { error: auditError } = await supabase
      .from("pro_audit_log")
      .insert({
        user_id: userId,
        action: oldExpiresAt ? "extend_pro" : "activate_pro",
        old_expires_at: oldExpiresAt,
        new_expires_at: newExpiresAt.toISOString(),
        payment_reference: event.data?.reference || null,
        amount_kobo: paidAmount,
      });

    if (auditError) {
      console.error("Audit log error (non-fatal):", auditError);
    }

    console.log(`Successfully upgraded user ${userId} to Pro. Expires: ${newExpiresAt.toISOString()} (amount: ${paidAmount} kobo)`);
  } else {
    console.log(`Ignoring unhandled event type: ${event.event}`);
  }

  return new Response("OK", { status: 200, headers: corsHeaders });
});
