export interface Milestone {
  count: number;
  message: string;
  emoji: string;
}

export const milestones: Milestone[] = [
  { count: 5, message: "You're on a roll! 5 tiny wins!", emoji: "🎯" },
  { count: 10, message: "Double digits! 10 wins strong!", emoji: "🔥" },
  { count: 25, message: "Quarter century! You're amazing!", emoji: "🏆" },
  { count: 50, message: "50 wins! You're unstoppable!", emoji: "⭐" },
  { count: 100, message: "Triple digits! Legendary!", emoji: "👑" },
];

export const getMilestoneMessage = (count: number): Milestone | null => {
  return milestones.find(m => m.count === count) || null;
};

export const getNextMilestone = (count: number): Milestone | null => {
  return milestones.find(m => m.count > count) || null;
};

// Mood-based color mapping for theming
export const moodColors: Record<string, { bg: string; accent: string; glow: string }> = {
  "😊": { bg: "from-amber-50 to-orange-50", accent: "bg-amber-400", glow: "shadow-amber-200/50" },
  "🥳": { bg: "from-pink-50 to-purple-50", accent: "bg-pink-400", glow: "shadow-pink-200/50" },
  "😌": { bg: "from-sky-50 to-teal-50", accent: "bg-sky-400", glow: "shadow-sky-200/50" },
  "💪": { bg: "from-rose-50 to-red-50", accent: "bg-rose-400", glow: "shadow-rose-200/50" },
  "🌟": { bg: "from-yellow-50 to-amber-50", accent: "bg-yellow-400", glow: "shadow-yellow-200/50" },
  "🥰": { bg: "from-pink-50 to-rose-50", accent: "bg-pink-300", glow: "shadow-pink-200/50" },
};

export const getMoodTheme = (mood: string) => {
  return moodColors[mood] || moodColors["😊"];
};
