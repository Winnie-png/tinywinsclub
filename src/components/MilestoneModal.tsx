import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "./Confetti";
import type { Milestone } from "@/lib/milestones";

interface MilestoneModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MilestoneModal({ milestone, isOpen, onClose }: MilestoneModalProps) {
  if (!milestone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md border-0 bg-transparent shadow-none">
            <Confetti trigger={isOpen} intensity="high" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gradient-to-br from-celebration/20 via-card to-mint/20 rounded-3xl p-8 text-center shadow-lifted border-2 border-celebration/30"
            >
              {/* Animated Trophy */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.3, 1],
                  rotate: [-180, 20, 0]
                }}
                transition={{ 
                  duration: 0.8, 
                  times: [0, 0.6, 1],
                  delay: 0.2 
                }}
                className="text-7xl mb-4 drop-shadow-lg"
              >
                {milestone.emoji}
              </motion.div>

              {/* Stars around the emoji */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0.8],
                      opacity: [0, 1, 0.6]
                    }}
                    transition={{ 
                      delay: 0.5 + i * 0.1, 
                      duration: 0.5 
                    }}
                    className="absolute text-2xl"
                    style={{
                      top: `${20 + (i % 3) * 25}%`,
                      left: `${10 + (i % 2) * 75}%`,
                    }}
                  >
                    ✨
                  </motion.span>
                ))}
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-display font-bold text-foreground mb-2"
              >
                🎉 Milestone Reached! 🎉
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-foreground/80 mb-2"
              >
                {milestone.message}
              </motion.p>

              {/* Win count */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="inline-block bg-gradient-to-r from-primary to-celebration text-white font-bold px-6 py-2 rounded-full text-xl mb-6 shadow-lg"
              >
                {milestone.count} Wins! 🎊
              </motion.div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  onClick={onClose}
                  className="rounded-full px-8 py-3 btn-bounce shadow-soft"
                >
                  Keep Winning! 💪
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
