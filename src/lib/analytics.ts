import type { Win } from "./storage";

export interface DayStats {
  date: string;
  count: number;
  moods: string[];
}

export interface WeeklyStats {
  days: DayStats[];
  totalWins: number;
  topMood: { emoji: string; count: number } | null;
  averagePerDay: number;
  streak: number;
}

export function getWeeklyStats(wins: Win[]): WeeklyStats {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const days: DayStats[] = [];
  const moodCounts: Record<string, number> = {};
  let totalWins = 0;

  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split("T")[0];

    const dayWins = wins.filter((w) => {
      const winDate = new Date(w.createdAt);
      winDate.setHours(0, 0, 0, 0);
      return winDate.toISOString().split("T")[0] === dateStr;
    });

    dayWins.forEach((w) => {
      moodCounts[w.mood] = (moodCounts[w.mood] || 0) + 1;
    });

    totalWins += dayWins.length;

    days.push({
      date: dateStr,
      count: dayWins.length,
      moods: dayWins.map((w) => w.mood),
    });
  }

  // Find top mood
  const topMoodEntry = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const topMood = topMoodEntry ? { emoji: topMoodEntry[0], count: topMoodEntry[1] } : null;

  // Calculate streak
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return {
    days,
    totalWins,
    topMood,
    averagePerDay: Math.round((totalWins / 7) * 10) / 10,
    streak,
  };
}

export function getMoodDistribution(wins: Win[]): { emoji: string; count: number; percentage: number }[] {
  const moodCounts: Record<string, number> = {};
  wins.forEach((w) => {
    moodCounts[w.mood] = (moodCounts[w.mood] || 0) + 1;
  });

  const total = wins.length;
  return Object.entries(moodCounts)
    .map(([emoji, count]) => ({
      emoji,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  
  return date.toLocaleDateString("en-US", { weekday: "short" });
}
