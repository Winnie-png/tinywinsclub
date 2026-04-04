import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Win } from "@/hooks/useWins";
import jarClosed from "@/assets/jar-closed.png";
import jarOpen from "@/assets/jar-open.png";

interface WinJarProps {
  wins: Win[];
  maxWins?: number;
  isLocked?: boolean;
}

export function WinJar({ wins, maxWins = 25, isLocked = false }: WinJarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [burstEmojis, setBurstEmojis] = useState<{ id: number; x: number; y: number; emoji: string; delay: number }[]>([]);
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

  const handleTap = useCallback(() => {
    if (isOpen || isLocked) return;
    setIsOpen(true);

    // Pick random mood emojis from wins for the burst
    const emojis = wins.length > 0
      ? Array.from({ length: 6 }, (_, i) => ({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 100,
          y: -30 + (Math.random() - 0.5) * 40,
          emoji: wins[Math.floor(Math.random() * wins.length)]?.mood || "✨",
          delay: i * 0.04,
        }))
      : [];
    setBurstEmojis(emojis);
    setFloatingEmoji(wins.length > 0 ? wins[0]?.mood || "🌟" : "🌟");

    setTimeout(() => {
      setIsOpen(false);
      setFloatingEmoji(null);
      setTimeout(() => setBurstEmojis([]), 400);
    }, 650);
  }, [isOpen, isLocked, wins]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Pulsing glow when locked */}
      {isLocked && (
        <motion.div
          className="absolute z-0 rounded-full"
          style={{
            width: 200, height: 200, top: 30, left: "50%", marginLeft: -100,
            background: "radial-gradient(circle, hsl(40 90% 55% / 0.25) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Ambient floating mood emojis */}
      {wins.length > 0 && !isLocked && (
        <>
          {wins.slice(0, 4).map((win, i) => (
            <motion.div
              key={`ambient-${i}`}
              className="absolute z-0 text-base"
              style={{
                left: `${i % 2 === 0 ? 8 + i * 6 : 78 - i * 6}%`,
                top: `${5 + i * 18}%`,
              }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5], y: [0, -8, 0] }}
              transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
            >
              {win.mood || "✨"}
            </motion.div>
          ))}
        </>
      )}

      {/* Tap area with jar image */}
      <motion.div
        className={`relative select-none ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
        style={{ width: 220, height: 240, ...(isLocked ? { filter: "saturate(0.4) brightness(0.85)" } : {}) }}
        whileTap={isLocked ? {} : { scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onTap={handleTap}
      >
        {/* Emoji burst on tap */}
        <AnimatePresence>
          {burstEmojis.map((b) => (
            <motion.div
              key={b.id}
              className="absolute z-30 text-xl"
              style={{ left: "50%", top: "8%" }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, x: b.x, y: b.y - 30, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: b.delay, ease: "easeOut" }}
            >
              {b.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Floating emoji on tap */}
        <AnimatePresence>
          {floatingEmoji && (
            <motion.div
              className="absolute z-30 text-3xl"
              style={{ left: "50%", top: "5%" }}
              initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: -55, scale: [0.6, 1.3, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              {floatingEmoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jar image — toggles between closed and open */}
        <AnimatePresence mode="wait">
          <motion.img
            key={isOpen ? "open" : "closed"}
            src={isOpen ? jarOpen : jarClosed}
            alt="Win Jar"
            width={512}
            height={512}
            className="absolute inset-0 w-full h-full object-contain z-[1] pointer-events-none"
            initial={{ scale: 0.97, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0.8 }}
            transition={{ duration: 0.15 }}
          />
        </AnimatePresence>

        {/* Mood emojis inside the jar */}
        <div
          className="absolute z-[2] flex flex-wrap content-end justify-center gap-[3px] pointer-events-none"
          style={{ left: 40, right: 40, top: 90, bottom: 45 }}
        >
          {wins.slice(0, 12).map((win, index) => (
            <motion.span
              key={win.id}
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                delay: 0.4 + index * 0.07,
                type: "spring",
                stiffness: 300,
                damping: 14,
              }}
            >
              <motion.span
                className="inline-block text-[17px] drop-shadow-sm"
                animate={{
                  y: [0, -2, 0, 1.5, 0],
                  rotate: [0, index % 2 === 0 ? 6 : -6, 0],
                }}
                transition={{
                  duration: 3 + (index % 3) * 0.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              >
                {win.mood || "⭐"}
              </motion.span>
            </motion.span>
          ))}
        </div>

        {/* Lock overlay */}
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
      </motion.div>

      {/* Win Counter */}
      <motion.div
        className="mt-3 text-center"
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
