import { motion } from "framer-motion";

interface MoodSelectorProps {
  selected: string;
  onSelect: (mood: string) => void;
}

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🥳", label: "Excited" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "💪", label: "Strong" },
  { emoji: "🌟", label: "Proud" },
  { emoji: "🥰", label: "Grateful" },
];

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {moods.map((mood) => (
        <motion.button
          key={mood.emoji}
          type="button"
          onClick={() => onSelect(mood.emoji)}
          className={`
            flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors
            ${selected === mood.emoji 
              ? "bg-primary/20 ring-2 ring-primary" 
              : "bg-muted hover:bg-muted/80"
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Select ${mood.label} mood`}
          aria-pressed={selected === mood.emoji}
        >
          <span className="text-2xl" role="img" aria-hidden="true">
            {mood.emoji}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {mood.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
