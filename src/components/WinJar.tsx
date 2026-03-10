import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Win } from "@/hooks/useWins";

interface WinJarProps {
  wins: Win[];
  maxWins?: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function WinJar({ wins, maxWins = 25 }: WinJarProps) {
  const fillPercentage = Math.min((wins.length / maxWins) * 100, 100);
  const [isOpen, setIsOpen] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [floatingStar, setFloatingStar] = useState(false);

  const handleTap = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);

    // Spawn sparkle burst
    const newSparkles: Sparkle[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -20 + (Math.random() - 0.5) * 30,
      size: 4 + Math.random() * 6,
      delay: i * 0.04,
    }));
    setSparkles(newSparkles);
    setFloatingStar(true);

    // Close lid after delay
    setTimeout(() => {
      setIsOpen(false);
      setFloatingStar(false);
      setTimeout(() => setSparkles([]), 400);
    }, 500);
  }, [isOpen]);

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="relative w-52 h-72 cursor-pointer select-none"
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onTap={handleTap}
      >
        {/* Sparkle burst */}
        <AnimatePresence>
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute z-20 rounded-full"
              style={{
                width: s.size,
                height: s.size,
                left: "50%",
                top: "10%",
                background: "hsl(var(--celebration))",
                boxShadow: "0 0 8px 2px hsl(var(--celebration) / 0.6)",
              }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, x: s.x, y: s.y - 30, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: s.delay, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Floating star */}
        <AnimatePresence>
          {floatingStar && (
            <motion.div
              className="absolute z-20 text-2xl"
              style={{ left: "50%", top: "15%" }}
              initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.6, 1.1, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              ⭐
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lid */}
        <motion.div
          className="absolute -top-4 left-1/2 z-10"
          style={{
            width: 112,
            marginLeft: -56,
            transformOrigin: "50% 100%",
          }}
          animate={{ rotateX: isOpen ? -38 : 0 }}
          transition={{
            type: "spring",
            stiffness: isOpen ? 300 : 200,
            damping: isOpen ? 12 : 18,
          }}
        >
          <div
            className="w-28 h-8 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(15 60% 75%) 0%, hsl(15 50% 70%) 100%)",
              border: "1.5px solid hsl(15 40% 80% / 0.6)",
              boxShadow: "0 4px 12px -2px hsl(15 50% 50% / 0.2), inset 0 1px 2px hsl(0 0% 100% / 0.3)",
            }}
          >
            <div className="absolute top-1 left-4 w-6 h-2 bg-white/40 rounded-full blur-[1px]" />
            <div className="absolute top-2 right-5 w-3 h-1.5 bg-white/25 rounded-full" />
          </div>
        </motion.div>

        {/* Jar Body */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-44 h-64 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(200 30% 98% / 0.85) 0%, hsl(200 20% 95% / 0.6) 50%, hsl(200 30% 98% / 0.85) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1.5px solid hsl(0 0% 100% / 0.6)",
            boxShadow: `
              0 8px 32px -8px hsl(25 30% 20% / 0.12),
              0 4px 16px -4px hsl(25 30% 20% / 0.08),
              inset 0 1px 1px hsl(0 0% 100% / 0.4),
              inset 0 -2px 8px hsl(200 20% 50% / 0.08)
            `,
          }}
        >
          {/* Liquid Fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, hsl(var(--primary) / 0.7) 0%, hsl(var(--primary) / 0.5) 50%, hsl(var(--primary) / 0.3) 100%)",
              }}
            />
          </motion.div>

          {/* Glowing star particles */}
          <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1.5 p-3 pb-4">
            {wins.slice(0, 18).map((win, index) => (
              <motion.span
                key={win.id}
                initial={{ scale: 0, y: 60, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{
                  delay: 0.5 + index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                }}
                className="relative text-xl"
                style={{
                  filter: "drop-shadow(0 0 4px hsl(var(--celebration) / 0.5))",
                }}
              >
                <motion.span
                  animate={{
                    y: [0, -4, 0, 2, 0],
                    opacity: [0.85, 1, 0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 4 + (index % 3) * 0.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                  style={{ display: "inline-block" }}
                >
                  {win.mood}
                </motion.span>
              </motion.span>
            ))}
          </div>

          {/* Glass shine effects */}
          <div
            className="absolute top-5 left-3 w-4 h-24 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 100% / 0.5) 0%, hsl(0 0% 100% / 0.15) 100%)",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute top-14 left-6 w-2 h-10 rounded-full pointer-events-none"
            style={{
              background: "hsl(0 0% 100% / 0.35)",
              filter: "blur(1px)",
            }}
          />
          <div
            className="absolute top-3 right-5 w-2.5 h-16 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 100% / 0.3) 0%, hsl(0 0% 100% / 0.1) 100%)",
              filter: "blur(1px)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none rounded-b-3xl"
            style={{
              background: "linear-gradient(0deg, hsl(0 0% 100% / 0.1) 0%, transparent 100%)",
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
        <p className="text-xs text-muted-foreground/60 mt-1">tap the jar ✨</p>
      </motion.div>
    </div>
  );
}
