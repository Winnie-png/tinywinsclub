import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const confettiColors = [
  "hsl(15, 80%, 65%)",   // primary coral
  "hsl(270, 40%, 85%)",  // lavender
  "hsl(160, 50%, 85%)",  // mint
  "hsl(45, 90%, 65%)",   // celebration yellow
  "hsl(200, 60%, 90%)",  // sky
];

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (trigger) {
      setParticles(Array.from({ length: 30 }, (_, i) => i));
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((i) => {
            const x = Math.random() * 100;
            const delay = Math.random() * 0.3;
            const size = 8 + Math.random() * 8;
            const color = confettiColors[i % confettiColors.length];
            const shape = i % 3; // 0 = circle, 1 = square, 2 = triangle

            return (
              <motion.div
                key={i}
                initial={{ 
                  y: "100vh",
                  x: `${x}vw`,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{ 
                  y: "-20vh",
                  rotate: 360 + Math.random() * 360,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2 + Math.random() * 0.5,
                  delay,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  width: size,
                  height: size,
                  backgroundColor: shape !== 2 ? color : "transparent",
                  borderRadius: shape === 0 ? "50%" : shape === 1 ? "2px" : "0",
                  borderLeft: shape === 2 ? `${size/2}px solid transparent` : undefined,
                  borderRight: shape === 2 ? `${size/2}px solid transparent` : undefined,
                  borderBottom: shape === 2 ? `${size}px solid ${color}` : undefined,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
