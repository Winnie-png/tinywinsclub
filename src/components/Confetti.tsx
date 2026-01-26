import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
  intensity?: "low" | "medium" | "high";
}

const confettiColors = [
  "hsl(15, 80%, 65%)",   // primary coral
  "hsl(270, 40%, 85%)",  // lavender
  "hsl(160, 50%, 85%)",  // mint
  "hsl(45, 90%, 65%)",   // celebration yellow
  "hsl(200, 60%, 90%)",  // sky
  "hsl(330, 70%, 75%)",  // pink
  "hsl(120, 50%, 70%)",  // green
];

const shapes = ["circle", "square", "star", "heart"] as const;

export function Confetti({ trigger, onComplete, intensity = "high" }: ConfettiProps) {
  const [particles, setParticles] = useState<number[]>([]);

  const particleCount = intensity === "high" ? 50 : intensity === "medium" ? 30 : 15;

  useEffect(() => {
    if (trigger) {
      setParticles(Array.from({ length: particleCount }, (_, i) => i));
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete, particleCount]);

  const getShapeStyle = (shape: typeof shapes[number], size: number, color: string) => {
    switch (shape) {
      case "circle":
        return {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "50%",
        };
      case "square":
        return {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "3px",
        };
      case "star":
        return {
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        };
      case "heart":
        return {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "50% 50% 0 50%",
          transform: "rotate(-45deg)",
        };
      default:
        return {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "50%",
        };
    }
  };

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((i) => {
            const x = 20 + Math.random() * 60; // Keep more centered
            const delay = Math.random() * 0.4;
            const size = 6 + Math.random() * 10;
            const color = confettiColors[i % confettiColors.length];
            const shape = shapes[i % shapes.length];
            const drift = (Math.random() - 0.5) * 200;

            return (
              <motion.div
                key={i}
                initial={{ 
                  y: "50vh",
                  x: `${x}vw`,
                  rotate: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{ 
                  y: "-20vh",
                  x: `calc(${x}vw + ${drift}px)`,
                  rotate: 360 + Math.random() * 720,
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 1],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5 + Math.random() * 0.8,
                  delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  position: "absolute",
                  ...getShapeStyle(shape, size, color),
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
