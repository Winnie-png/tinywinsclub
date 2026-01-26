import type { Win } from "./storage";

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (wins: Win[]) => boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const badges: Badge[] = [
  {
    id: "first_win",
    name: "First Step",
    description: "Record your very first tiny win",
    emoji: "🌱",
    condition: (wins) => wins.length >= 1,
    rarity: "common",
  },
  {
    id: "five_wins",
    name: "High Five",
    description: "Collect 5 tiny wins",
    emoji: "✋",
    condition: (wins) => wins.length >= 5,
    rarity: "common",
  },
  {
    id: "ten_wins",
    name: "Perfect Ten",
    description: "Collect 10 tiny wins",
    emoji: "🔟",
    condition: (wins) => wins.length >= 10,
    rarity: "rare",
  },
  {
    id: "twenty_five_wins",
    name: "Quarter Century",
    description: "Collect 25 tiny wins",
    emoji: "🏆",
    condition: (wins) => wins.length >= 25,
    rarity: "epic",
  },
  {
    id: "fifty_wins",
    name: "Half Century",
    description: "Collect 50 tiny wins",
    emoji: "👑",
    condition: (wins) => wins.length >= 50,
    rarity: "legendary",
  },
  {
    id: "mood_variety",
    name: "Mood Master",
    description: "Use 5 different mood emojis",
    emoji: "🎭",
    condition: (wins) => {
      const uniqueMoods = new Set(wins.map((w) => w.mood));
      return uniqueMoods.size >= 5;
    },
    rarity: "rare",
  },
  {
    id: "three_day_streak",
    name: "On a Roll",
    description: "Add wins 3 days in a row",
    emoji: "🔥",
    condition: (wins) => calculateStreak(wins) >= 3,
    rarity: "common",
  },
  {
    id: "seven_day_streak",
    name: "Week Warrior",
    description: "Add wins 7 days in a row",
    emoji: "⚡",
    condition: (wins) => calculateStreak(wins) >= 7,
    rarity: "rare",
  },
  {
    id: "fourteen_day_streak",
    name: "Unstoppable",
    description: "Add wins 14 days in a row",
    emoji: "💫",
    condition: (wins) => calculateStreak(wins) >= 14,
    rarity: "epic",
  },
  {
    id: "thirty_day_streak",
    name: "Legend",
    description: "Add wins 30 days in a row",
    emoji: "🌟",
    condition: (wins) => calculateStreak(wins) >= 30,
    rarity: "legendary",
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Add a win before 8 AM",
    emoji: "🐦",
    condition: (wins) => wins.some((w) => new Date(w.createdAt).getHours() < 8),
    rarity: "common",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Add a win after 10 PM",
    emoji: "🦉",
    condition: (wins) => wins.some((w) => new Date(w.createdAt).getHours() >= 22),
    rarity: "common",
  },
  {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Add wins on both Saturday and Sunday",
    emoji: "🎉",
    condition: (wins) => {
      const days = wins.map((w) => new Date(w.createdAt).getDay());
      return days.includes(0) && days.includes(6);
    },
    rarity: "rare",
  },
];

export function calculateStreak(wins: Win[]): number {
  if (wins.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique dates (sorted descending)
  const uniqueDates = [...new Set(
    wins.map((w) => {
      const d = new Date(w.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )].sort((a, b) => b - a);

  if (uniqueDates.length === 0) return 0;

  // Check if streak is active (includes today or yesterday)
  const mostRecent = uniqueDates[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (mostRecent < yesterday.getTime()) {
    return 0; // Streak broken
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = uniqueDates[i - 1] - uniqueDates[i];
    const oneDay = 24 * 60 * 60 * 1000;
    if (diff === oneDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getEarnedBadges(wins: Win[]): Badge[] {
  return badges.filter((badge) => badge.condition(wins));
}

export function getNextBadges(wins: Win[]): Badge[] {
  return badges.filter((badge) => !badge.condition(wins)).slice(0, 3);
}

export function getRecentlyEarnedBadge(wins: Win[], previousCount: number): Badge | null {
  const earned = getEarnedBadges(wins);
  const previousWins = wins.slice(1); // Remove the most recent win
  const previousEarned = getEarnedBadges(previousWins);
  
  const newBadge = earned.find((b) => !previousEarned.some((pb) => pb.id === b.id));
  return newBadge || null;
}

export const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  rare: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  epic: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  legendary: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
};
