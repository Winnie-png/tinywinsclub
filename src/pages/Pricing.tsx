import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, Lightbulb, Crown, CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

const benefits = [
  {
    icon: Sparkles,
    title: "Unlimited tiny wins",
    description: "Capture every victory, no matter how small",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    description: "Visualize your journey with beautiful charts",
  },
  {
    icon: Lightbulb,
    title: "Personalized insights",
    description: "Discover patterns in your happiness",
  },
];

export default function Pricing() {
  const { user, isPro, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  // Handle payment success callback
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Payment successful! Activating Pro...");
      // Poll for pro status update (webhook may take a moment)
      const interval = setInterval(async () => {
        await refreshProfile();
      }, 2000);

      // Stop polling after 30s
      const timeout = setTimeout(() => clearInterval(interval), 30000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [searchParams, refreshProfile]);

  // Redirect once pro is activated
  useEffect(() => {
    if (isPro && searchParams.get("payment") === "success") {
      toast.success("🎉 You're now a Pro member!");
      navigate("/", { replace: true });
    }
  }, [isPro, searchParams, navigate]);

  const initializePayment = async (plan: "one-time" | "subscription") => {
    if (!user) {
      navigate("/auth?redirect=/pricing");
      return;
    }

    setLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: { plan },
      });

      if (error) throw error;
      if (!data?.authorization_url) throw new Error("No payment URL received");

      window.location.href = data.authorization_url;
    } catch (err: any) {
      console.error("Payment init error:", err);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Layout>
      <div className="pt-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-6"
          >
            <Crown className="h-10 w-10 text-amber-500" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Upgrade to Tiny Wins Pro
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Choose Your Plan
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-cozy p-6 mb-6 relative overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex flex-col items-center gap-1 mb-6">
              <span className="text-3xl font-display font-bold text-foreground">Only 10 KES</span>
              <span className="text-muted-foreground">(Test price) / one-time</span>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Payment Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="space-y-4"
            >
              {/* M-Pesa / Card Button */}
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-display font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-bounce"
                  onClick={() => initializePayment("one-time")}
                  disabled={loading !== null}
                >
                  {loading === "one-time" ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Crown className="h-5 w-5 mr-2" />
                  )}
                  Get Pro for 10 KES
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/512px-M-PESA_LOGO-01.svg.png" 
                    alt="M-Pesa" 
                    className="h-5 ml-2"
                  />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Best for M-Pesa & Cards • Secure via Paystack
                </p>
              </div>

              {/* Subscription Button */}
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-12 text-base font-display font-semibold rounded-2xl border-2 hover:bg-muted/50 transition-all duration-300"
                  onClick={() => initializePayment("subscription")}
                  disabled={loading !== null}
                >
                  {loading === "subscription" ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  Monthly Subscription — 10 KES
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Automatic monthly billing. Card only.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground"
        >
          💳 Pay easily with M-Pesa or any major Credit Card globally
        </motion.p>
      </div>
    </Layout>
  );
}
