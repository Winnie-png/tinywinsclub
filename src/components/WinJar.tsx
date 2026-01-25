import { motion } from "framer-motion";
import type { Win } from "@/lib/storage";

interface WinJarProps {
  wins: Win[];
  maxWins?: number;
}

export function WinJar({ wins, maxWins = 20 }: WinJarProps) {
  const fillPercentage = Math.min((wins.length / maxWins) * 100, 100);
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Jar Container */}
      <div className="relative w-48 h-64">
        {/* Jar Lid */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-primary/60 rounded-t-lg shadow-soft z-10" />
        
        {/* Jar Body */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-56 rounded-3xl glass-jar border-2 border-border/30 overflow-hidden shadow-lifted">
          {/* Liquid Fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/70 via-primary/50 to-primary/30 rounded-b-3xl"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Floating Wins */}
          <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-3 pb-4">
            {wins.slice(0, 15).map((win, index) => (
              <motion.span
                key={win.id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="text-lg animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {win.mood}
              </motion.span>
            ))}
          </div>
          
          {/* Glass Shine */}
          <div className="absolute top-4 left-4 w-3 h-16 bg-white/40 rounded-full blur-sm" />
        </div>
      </div>
      
      {/* Win Counter */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-2xl font-display font-bold text-foreground">
          {wins.length}
        </p>
        <p className="text-sm text-muted-foreground">
          {wins.length === 1 ? "tiny win" : "tiny wins"}
        </p>
      </motion.div>
    </div>
  );
}
