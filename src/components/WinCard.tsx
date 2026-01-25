import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { Win } from "@/lib/storage";
import { Button } from "@/components/ui/button";

interface WinCardProps {
  win: Win;
  index: number;
  onDelete: (id: string) => void;
}

export function WinCard({ win, index, onDelete }: WinCardProps) {
  const date = new Date(win.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -50 }}
      transition={{ delay: index * 0.05 }}
      className="card-cozy p-4 group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" role="img" aria-label="mood">
          {win.mood}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium leading-relaxed">
            {win.text}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formattedDate} at {formattedTime}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(win.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
          aria-label="Delete win"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
