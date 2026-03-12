import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Lock, Flame, Trophy, Zap } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function PaywallModal({ 
  isOpen, 
  onClose, 
  title = "🎉 You've reached your free Tiny Wins limit!",
  message = "Unlock Pro for unlimited wins, streaks & badges."
}: PaywallModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <div className="bg-background rounded-3xl p-6 shadow-2xl border border-border/50 overflow-hidden relative">
              {/* Animated glow background */}
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2"
                style={{ background: "radial-gradient(circle, hsl(40 90% 55% / 0.3), transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2"
                style={{ background: "radial-gradient(circle, hsl(25 90% 55% / 0.2), transparent 70%)" }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              
              <div className="relative">
                {/* Animated crown icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="flex justify-center mb-4"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
                    animate={{ boxShadow: ["0 0 20px hsl(40 90% 55% / 0.2)", "0 0 40px hsl(40 90% 55% / 0.4)", "0 0 20px hsl(40 90% 55% / 0.2)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="h-10 w-10 text-amber-500" />
                  </motion.div>
                </motion.div>

                {/* Lock indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex justify-center mb-4"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    <Lock className="h-3 w-3" />
                    Free limit reached
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-display font-bold text-foreground text-center mb-2"
                >
                  {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-muted-foreground text-center mb-6"
                >
                  {message}
                </motion.p>

                {/* Pro features with icons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/50 rounded-2xl p-4 mb-6 space-y-2"
                >
                  <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Pro members unlock:
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span>Unlimited tiny wins storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Flame className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span>Unlimited streak tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span>All badges & celebrations</span>
                  </div>
                </motion.div>

                {/* Bouncing upgrade button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-3"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Button
                      onClick={handleUpgrade}
                      className="w-full h-14 text-base font-display font-bold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg active:scale-95 transition-transform"
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Upgrade to Pro – $6/month
                    </Button>
                  </motion.div>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Maybe later
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
