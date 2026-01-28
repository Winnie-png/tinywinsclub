import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Crown, Sparkles, Cookie } from "lucide-react";

export default function WelcomePro() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [upgrading, setUpgrading] = useState(true);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const upgradeToPro = async () => {
      if (!user) {
        toast.error("Please sign in to activate your Pro membership");
        navigate("/auth");
        return;
      }

      try {
        const { error } = await supabase
          .from("profiles")
          .update({ is_pro: true })
          .eq("user_id", user.id);

        if (error) throw error;

        await refreshProfile();
        setUpgrading(false);
        setShowConfetti(true);
        toast.success("Pro features unlocked! 🎉");
      } catch (error) {
        console.error("Error upgrading to Pro:", error);
        toast.error("Something went wrong. Please contact support.");
        setUpgrading(false);
      }
    };

    upgradeToPro();
  }, [user, navigate, refreshProfile]);

  if (upgrading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
          />
          <p className="mt-4 text-muted-foreground">Activating your Pro membership...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Confetti trigger={showConfetti} intensity="high" onComplete={() => setShowConfetti(false)} />
      
      <div className="pt-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-celebration/30 via-primary/20 to-mint/30 flex items-center justify-center">
              <Crown className="h-12 w-12 text-primary" />
            </div>
            {/* Sparkles around crown */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="absolute"
                style={{
                  top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Sparkles className="h-4 w-4 text-celebration" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            Welcome to the Club! 🎊
          </h1>
          <p className="text-lg text-muted-foreground max-w-xs mx-auto">
            Your Pro features are now unlocked. Time to celebrate even more wins!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-cozy p-6 mb-6"
        >
          <h2 className="font-display font-semibold text-foreground mb-4 text-center">
            ✨ What's Unlocked
          </h2>
          <ul className="space-y-3">
            {[
              "Unlimited tiny wins storage",
              "Advanced progress tracking",
              "Personalized insights & patterns",
              "Premium celebration animations",
            ].map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 text-foreground/80"
              >
                <span className="text-primary">✓</span>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/jar")}
            className="w-full h-14 text-lg font-display font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 btn-bounce"
          >
            <Cookie className="h-5 w-5 mr-2" />
            Go to My Jar
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
