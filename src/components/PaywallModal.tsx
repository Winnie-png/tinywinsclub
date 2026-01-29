import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Lock } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function PaywallModal({ 
  isOpen, 
  onClose, 
  title = "Your jar is full!",
  message = "Upgrade to Pro to keep collecting your victories."
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <div className="bg-background rounded-3xl p-6 shadow-2xl border border-border/50 overflow-hidden relative">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Crown className="h-8 w-8 text-amber-500" />
                  </div>
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

                {/* Features preview */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/50 rounded-2xl p-4 mb-6"
                >
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Pro members get:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Unlimited tiny wins storage</li>
                    <li>✓ Advanced progress tracking</li>
                    <li>✓ Personalized insights</li>
                  </ul>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={handleUpgrade}
                    className="w-full h-12 text-base font-display font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade to Pro
                  </Button>
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
