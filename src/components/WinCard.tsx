import { motion } from "framer-motion";
import type { Win } from "@/lib/storage";
import { Trash2, Share2 } from "lucide-react";
import { getMoodTheme } from "@/lib/milestones";

interface WinCardProps {
  win: Win;
  index: number;
  onDelete?: (id: string) => void;
  onShare?: (win: Win) => void;
}

export function WinCard({ win, index, onDelete, onShare }: WinCardProps) {
  const formattedDate = new Date(win.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const theme = getMoodTheme(win.mood);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={`relative p-4 rounded-2xl bg-gradient-to-br ${theme.bg} border border-border/30 shadow-soft hover:shadow-lifted transition-all duration-300 group`}
    >
      {/* Mood Badge */}
      <div className="flex items-start gap-3">
        <motion.div 
          className={`flex-shrink-0 w-12 h-12 rounded-xl ${theme.accent} flex items-center justify-center shadow-md ${theme.glow}`}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-2xl" role="img" aria-label="mood">
            {win.mood}
          </span>
        </motion.div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium leading-relaxed mb-2">
            {win.text}
          </p>
          <p className="text-xs text-muted-foreground">
            {formattedDate}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1">
          {onShare && (
            <motion.button
              onClick={() => onShare(win)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Share win"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={() => onDelete(win.id)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Delete win"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${theme.accent} opacity-10 rounded-bl-3xl rounded-tr-2xl`} />
    </motion.div>
  );
}
