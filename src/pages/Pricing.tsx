import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, Lightbulb, Crown, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOneTimeClick = () => {
    if (!user) {
      navigate("/auth?redirect=/pricing");
      return;
    }
    window.open("https://paystack.shop/pay/tinywins-pro-access", "_blank", "noopener,noreferrer");
  };

  const handleSubscriptionClick = () => {
    if (!user) {
      navigate("/auth?redirect=/pricing");
      return;
    }
    window.open("https://paystack.shop/pay/tinywins-pro", "_blank", "noopener,noreferrer");
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
              <span className="text-3xl font-display font-bold text-foreground">Only 400 KES</span>
              <span className="text-muted-foreground">(~$3.00 USD) / month</span>
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
              {/* Apple Pay Button */}
              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold rounded-2xl bg-foreground text-background hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleOneTimeClick}
                >
                  <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.72 7.54c-.46.52-1.21.92-1.94.86-.09-.75.27-1.54.7-2.03.46-.53 1.26-.9 1.91-.93.08.78-.22 1.56-.67 2.1zM18.37 8.57c-1.07-.06-1.99.61-2.5.61-.51 0-1.3-.58-2.14-.56-1.1.02-2.12.64-2.68 1.63-1.15 1.99-.3 4.93.82 6.55.54.79 1.19 1.68 2.05 1.65.82-.03 1.13-.53 2.12-.53s1.27.53 2.13.51c.89-.01 1.44-.8 1.98-1.59.62-.91.88-1.79.89-1.83-.02-.01-1.71-.66-1.73-2.61-.01-1.63 1.33-2.41 1.39-2.45-.76-1.12-1.93-1.24-2.33-1.28z"/>
                  </svg>
                  Pay with Apple Pay
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Processed securely via Paystack
                </p>
              </div>

              {/* M-Pesa / Card Button */}
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-display font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-bounce"
                  onClick={handleOneTimeClick}
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Get 30 Days Pro
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/512px-M-PESA_LOGO-01.svg.png" 
                    alt="M-Pesa" 
                    className="h-5 ml-2"
                  />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Best for M-Pesa & Cards
                </p>
              </div>

              {/* Secondary Button - Subscription */}
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-12 text-base font-display font-semibold rounded-2xl border-2 hover:bg-muted/50 transition-all duration-300"
                  onClick={handleSubscriptionClick}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Monthly Subscription
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
