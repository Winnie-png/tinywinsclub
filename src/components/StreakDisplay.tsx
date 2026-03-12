import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
  isPro?: boolean;
}

export function StreakDisplay({ streak, isPro = false }: StreakDisplayProps) {
  if (streak <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-5 py-2.5 mx-auto w-fit shadow-soft"
    >
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, -5, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame className="h-5 w-5 text-orange-500" />
      </motion.div>
      <motion.span
        className="font-display font-bold text-orange-700"
        key={streak}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {streak} Day Streak! 🔥
      </motion.span>
      {isPro && streak >= 7 && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs"
        >
          ⚡
        </motion.span>
      )}
    </motion.div>
  );
}
