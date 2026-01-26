import { motion } from "framer-motion";
import type { Win } from "@/lib/storage";

interface WinJarProps {
  wins: Win[];
  maxWins?: number;
}

export function WinJar({ wins, maxWins = 25 }: WinJarProps) {
  const fillPercentage = Math.min((wins.length / maxWins) * 100, 100);
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Jar Container */}
      <motion.div 
        className="relative w-52 h-72"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Jar Lid */}
        <motion.div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-gradient-to-b from-primary/70 to-primary/50 rounded-t-xl shadow-lg z-10 border-2 border-primary/30"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Lid shine */}
          <div className="absolute top-1 left-3 w-4 h-2 bg-white/40 rounded-full" />
        </motion.div>
        
        {/* Jar Body */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-44 h-64 rounded-3xl glass-jar border-2 border-border/40 overflow-hidden shadow-lifted">
          {/* Liquid Fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            {/* Gradient liquid */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/60 to-primary/40" />
            
            {/* Bubbles effect */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    bottom: `${10 + i * 10}%`,
                  }}
                  animate={{
                    y: [-5, -15, -5],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Floating Wins */}
          <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-3 pb-4">
            {wins.slice(0, 18).map((win, index) => (
              <motion.span
                key={win.id}
                initial={{ scale: 0, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.05, 
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
                className="text-xl drop-shadow-sm"
                style={{ 
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.15}s` 
                }}
              >
                {win.mood}
              </motion.span>
            ))}
          </div>
          
          {/* Glass Shine Effects */}
          <div className="absolute top-6 left-4 w-3 h-20 bg-white/50 rounded-full blur-sm" />
          <div className="absolute top-16 left-6 w-2 h-8 bg-white/30 rounded-full blur-sm" />
          <div className="absolute top-4 right-6 w-2 h-12 bg-white/25 rounded-full blur-sm" />
        </div>
      </motion.div>
      
      {/* Win Counter */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.p 
          className="text-3xl font-display font-bold text-foreground"
          key={wins.length}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {wins.length}
        </motion.p>
        <p className="text-sm text-muted-foreground font-medium">
          {wins.length === 1 ? "tiny win" : "tiny wins"} collected
        </p>
      </motion.div>
    </div>
  );
}
