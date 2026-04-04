import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Win } from "@/hooks/useWins";

interface WinJarProps {
  wins: Win[];
  maxWins?: number;
  isLocked?: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function WinJar({ wins, maxWins = 25, isLocked = false }: WinJarProps) {
  const fillPercentage = Math.min((wins.length / maxWins) * 100, 100);
  const [isOpen, setIsOpen] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [floatingStar, setFloatingStar] = useState(false);

  const handleTap = useCallback(() => {
    if (isOpen || isLocked) return;
    setIsOpen(true);

    const newSparkles: Sparkle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 80,
      y: -20 + (Math.random() - 0.5) * 40,
      size: 4 + Math.random() * 8,
      delay: i * 0.03,
    }));
    setSparkles(newSparkles);
    setFloatingStar(true);

    setTimeout(() => {
      setIsOpen(false);
      setFloatingStar(false);
      setTimeout(() => setSparkles([]), 400);
    }, 600);
  }, [isOpen, isLocked]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Pulsing glow behind jar when locked */}
      {isLocked && (
        <motion.div
          className="absolute z-0 rounded-full"
          style={{
            width: 200,
            height: 200,
            top: 50,
            left: "50%",
            marginLeft: -100,
            background: "radial-gradient(circle, hsl(40 90% 55% / 0.25) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Ambient sparkles around jar */}
      {wins.length > 0 && !isLocked && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`ambient-${i}`}
              className="absolute z-0"
              style={{
                left: `${i % 2 === 0 ? 10 + i * 5 : 75 - i * 5}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2.5 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="hsl(40 90% 55%)" className="drop-shadow-[0_0_4px_hsl(40_90%_55%/0.6)]">
                <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
              </svg>
            </motion.div>
          ))}
        </>
      )}

      <motion.div
        className={`relative w-56 h-64 select-none ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
        whileTap={isLocked ? {} : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onTap={handleTap}
        style={isLocked ? { filter: "saturate(0.4) brightness(0.85)" } : {}}
      >
        {/* Sparkle burst on tap */}
        <AnimatePresence>
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute z-30"
              style={{ left: "50%", top: "5%" }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, x: s.x, y: s.y - 30, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: s.delay, ease: "easeOut" }}
            >
              <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 24 24" fill="hsl(40 90% 55%)">
                <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Floating star on tap */}
        <AnimatePresence>
          {floatingStar && (
            <motion.div
              className="absolute z-30"
              style={{ left: "50%", top: "10%" }}
              initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.6, 1.2, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="hsl(40 90% 55%)" className="drop-shadow-[0_0_8px_hsl(40_90%_55%/0.8)]">
                <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Golden Lid */}
        <motion.div
          className="absolute z-10"
          style={{
            top: 18,
            left: "50%",
            width: 100,
            marginLeft: -50,
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
            className="relative rounded-full overflow-hidden"
            style={{
              width: 100,
              height: 28,
              background: "linear-gradient(180deg, hsl(40 85% 62%) 0%, hsl(35 80% 52%) 60%, hsl(30 75% 45%) 100%)",
              border: "2px solid hsl(40 70% 68% / 0.6)",
              boxShadow: "0 4px 12px -2px hsl(30 60% 30% / 0.3), inset 0 2px 4px hsl(50 90% 80% / 0.5), inset 0 -1px 3px hsl(30 70% 30% / 0.2)",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                top: 5,
                left: "15%",
                width: "70%",
                height: 6,
                background: "linear-gradient(90deg, transparent, hsl(50 90% 80% / 0.6), transparent)",
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                top: 14,
                left: "20%",
                width: "60%",
                height: 4,
                background: "linear-gradient(90deg, transparent, hsl(40 80% 65% / 0.4), transparent)",
              }}
            />
          </div>
        </motion.div>

        {/* Jar Neck */}
        <div
          className="absolute z-[5]"
          style={{
            top: 36,
            left: "50%",
            width: 92,
            height: 16,
            marginLeft: -46,
            background: "linear-gradient(180deg, hsl(210 50% 88% / 0.7) 0%, hsl(210 45% 85% / 0.5) 100%)",
            borderLeft: "1.5px solid hsl(210 60% 90% / 0.6)",
            borderRight: "1.5px solid hsl(210 60% 90% / 0.6)",
            borderRadius: "0 0 4px 4px",
          }}
        />

        {/* Jar Body */}
        <div
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
          style={{
            top: 46,
            width: 180,
            height: 190,
            borderRadius: "40% 40% 45% 45% / 30% 30% 50% 50%",
            background: "linear-gradient(135deg, hsl(210 55% 92% / 0.75) 0%, hsl(210 40% 88% / 0.5) 30%, hsl(210 50% 90% / 0.65) 60%, hsl(210 55% 92% / 0.75) 100%)",
            border: "2px solid hsl(210 60% 92% / 0.7)",
            boxShadow: `
              0 12px 32px -8px hsl(210 30% 40% / 0.15),
              0 4px 16px -4px hsl(210 30% 40% / 0.1),
              inset 0 2px 4px hsl(0 0% 100% / 0.5),
              inset 0 -4px 12px hsl(210 40% 60% / 0.1)
            `,
          }}
        >
          {/* Golden glow fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{
              background: "linear-gradient(to top, hsl(40 80% 65% / 0.5) 0%, hsl(45 85% 70% / 0.3) 50%, hsl(50 80% 75% / 0.1) 100%)",
              borderRadius: "0 0 45% 45% / 0 0 50% 50%",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3 + (i % 3) * 2,
                  height: 3 + (i % 3) * 2,
                  left: `${10 + i * 10}%`,
                  bottom: `${10 + (i * 7) % 60}%`,
                  background: "hsl(0 0% 100% / 0.6)",
                  boxShadow: "0 0 4px hsl(45 80% 70% / 0.5)",
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Floating mood emojis inside */}
          <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-3 pb-5">
            {wins.slice(0, 14).map((win, index) => (
              <motion.span
                key={win.id}
                initial={{ scale: 0, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{
                  delay: 0.5 + index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                }}
                className="relative"
              >
                <motion.span
                  className="inline-block text-lg drop-shadow-[0_0_4px_hsl(40_85%_55%/0.5)]"
                  animate={{
                    y: [0, -3, 0, 2, 0],
                    rotate: [0, index % 2 === 0 ? 8 : -8, 0],
                  }}
                  transition={{
                    duration: 3.5 + (index % 3) * 0.5,
                    repeat: Infinity,
                    delay: index * 0.25,
                    ease: "easeInOut",
                  }}
                >
                  {win.mood || "⭐"}
                </motion.span>
              </motion.span>
            ))}
          </div>

          {/* Glass shines */}
          <div className="absolute pointer-events-none" style={{ top: "12%", left: "8%", width: 14, height: "45%", borderRadius: "50%", background: "linear-gradient(180deg, hsl(0 0% 100% / 0.55) 0%, hsl(0 0% 100% / 0.1) 100%)", filter: "blur(3px)" }} />
          <div className="absolute pointer-events-none" style={{ top: "30%", left: "16%", width: 7, height: "20%", borderRadius: "50%", background: "hsl(0 0% 100% / 0.4)", filter: "blur(2px)" }} />
          <div className="absolute pointer-events-none" style={{ top: "15%", right: "10%", width: 8, height: "30%", borderRadius: "50%", background: "linear-gradient(180deg, hsl(0 0% 100% / 0.3) 0%, transparent 100%)", filter: "blur(2px)" }} />
        </div>

        {/* Lock overlay when locked */}
        {isLocked && (
          <motion.div
            className="absolute z-20 inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border/50"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-2xl">🔒</span>
            </motion.div>
          </motion.div>
        )}

        {/* Shadow under jar */}
        <div
          className="absolute"
          style={{
            bottom: -4,
            left: "50%",
            width: 120,
            height: 14,
            marginLeft: -60,
            borderRadius: "50%",
            background: "hsl(210 20% 40% / 0.12)",
            filter: "blur(6px)",
          }}
        />
      </motion.div>

      {/* Win Counter */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.p
          className="text-3xl font-display font-bold text-foreground"
          key={wins.length}
          initial={{ scale: 1.3, color: "hsl(40 90% 55%)" }}
          animate={{ scale: 1, color: "hsl(var(--foreground))" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {wins.length}
        </motion.p>
        <p className="text-sm text-muted-foreground font-medium">
          {wins.length === 1 ? "tiny win" : "tiny wins"} collected
        </p>
        {!isLocked && (
          <p className="text-xs text-muted-foreground/60 mt-1">tap the jar ✨</p>
        )}
      </motion.div>
    </div>
  );
}
