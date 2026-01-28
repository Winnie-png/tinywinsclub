import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, Lightbulb, Heart } from "lucide-react";
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

  const handleSubscribeClick = () => {
    if (!user) {
      // Redirect to auth with return URL
      navigate("/auth?redirect=/pricing");
      return;
    }
    // User is logged in, open Paystack link
    window.open("https://paystack.shop/pay/tinywins-pro", "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      <div className="pt-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
          >
            <Heart className="h-10 w-10 text-primary" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            Join the Club
          </h1>
          <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Unlock the full power of celebrating your daily victories
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-display font-bold text-foreground">Free</span>
              <span className="text-muted-foreground">forever</span>
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

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-display font-semibold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 btn-bounce"
                onClick={handleSubscribeClick}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start My Membership
              </Button>
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
          ✨ No credit card required • 100% free • Made with love
        </motion.p>
      </div>
    </Layout>
  );
}
