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
        {/* Jar Lid - Muted pastel coral with soft rounded corners */}
        <motion.div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 rounded-2xl shadow-lg z-10 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, hsl(15 60% 75%) 0%, hsl(15 50% 70%) 100%)',
            border: '1.5px solid hsl(15 40% 80% / 0.6)',
            boxShadow: '0 4px 12px -2px hsl(15 50% 50% / 0.2), inset 0 1px 2px hsl(0 0% 100% / 0.3)'
          }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Lid shine highlights */}
          <div className="absolute top-1 left-4 w-6 h-2 bg-white/40 rounded-full blur-[1px]" />
          <div className="absolute top-2 right-5 w-3 h-1.5 bg-white/25 rounded-full" />
        </motion.div>
        
        {/* Jar Body - Enhanced glassmorphism */}
        <div 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-44 h-64 rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(200 30% 98% / 0.85) 0%, hsl(200 20% 95% / 0.6) 50%, hsl(200 30% 98% / 0.85) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid hsl(0 0% 100% / 0.6)',
            boxShadow: `
              0 8px 32px -8px hsl(25 30% 20% / 0.12),
              0 4px 16px -4px hsl(25 30% 20% / 0.08),
              inset 0 1px 1px hsl(0 0% 100% / 0.4),
              inset 0 -2px 8px hsl(200 20% 50% / 0.08)
            `
          }}
        >
          {/* Liquid Fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            {/* Gradient liquid - softer primary tones */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, hsl(var(--primary) / 0.7) 0%, hsl(var(--primary) / 0.5) 50%, hsl(var(--primary) / 0.3) 100%)'
              }}
            />
            
            {/* Bubbles effect */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${6 + i * 2}px`,
                    height: `${6 + i * 2}px`,
                    left: `${15 + i * 13}%`,
                    bottom: `${5 + i * 12}%`,
                    background: 'hsl(0 0% 100% / 0.35)',
                  }}
                  animate={{
                    y: [-3, -12, -3],
                    x: [0, i % 2 === 0 ? 3 : -3, 0],
                    opacity: [0.25, 0.5, 0.25],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2.5 + i * 0.4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Floating Wins with enhanced animation */}
          <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1.5 p-3 pb-4">
            {wins.slice(0, 18).map((win, index) => (
              <motion.span
                key={win.id}
                initial={{ scale: 0, y: 60, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  y: 0, 
                  opacity: 1,
                }}
                transition={{ 
                  delay: 0.5 + index * 0.08, 
                  type: "spring",
                  stiffness: 300,
                  damping: 12
                }}
                className="text-xl drop-shadow-md relative"
              >
                <motion.span
                  animate={{
                    y: [0, -4, 0, 2, 0],
                    x: [0, index % 2 === 0 ? 2 : -2, 0, index % 2 === 0 ? -1 : 1, 0],
                    rotate: [0, index % 2 === 0 ? 3 : -3, 0, index % 2 === 0 ? -2 : 2, 0],
                  }}
                  transition={{
                    duration: 4 + (index % 3) * 0.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {win.mood}
                </motion.span>
              </motion.span>
            ))}
          </div>
          
          {/* Glass Shine Effects - Enhanced for glassmorphism */}
          <div 
            className="absolute top-5 left-3 w-4 h-24 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsl(0 0% 100% / 0.5) 0%, hsl(0 0% 100% / 0.15) 100%)',
              filter: 'blur(2px)',
            }}
          />
          <div 
            className="absolute top-14 left-6 w-2 h-10 rounded-full pointer-events-none"
            style={{
              background: 'hsl(0 0% 100% / 0.35)',
              filter: 'blur(1px)',
            }}
          />
          <div 
            className="absolute top-3 right-5 w-2.5 h-16 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsl(0 0% 100% / 0.3) 0%, hsl(0 0% 100% / 0.1) 100%)',
              filter: 'blur(1px)',
            }}
          />
          {/* Bottom reflection */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none rounded-b-3xl"
            style={{
              background: 'linear-gradient(0deg, hsl(0 0% 100% / 0.1) 0%, transparent 100%)',
            }}
          />
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
