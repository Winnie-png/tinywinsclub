import { motion } from "framer-motion";
import { getWeeklyStats, getMoodDistribution, formatDayLabel } from "@/lib/analytics";
import type { Win } from "@/lib/storage";
import { TrendingUp, Calendar, Target } from "lucide-react";

interface WeeklyStatsProps {
  wins: Win[];
}

export function WeeklyStats({ wins }: WeeklyStatsProps) {
  const stats = getWeeklyStats(wins);
  const moodDist = getMoodDistribution(wins.slice(0, 30)); // Last 30 wins

  const maxDayWins = Math.max(...stats.days.map((d) => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-cozy p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-display font-bold text-foreground">Weekly Summary</h3>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-lavender/50 to-lavender/30 rounded-2xl p-3 text-center"
        >
          <p className="text-2xl font-bold text-foreground">{stats.totalWins}</p>
          <p className="text-xs text-muted-foreground">This Week</p>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-mint/50 to-mint/30 rounded-2xl p-3 text-center"
        >
          <p className="text-2xl font-bold text-foreground">{stats.averagePerDay}</p>
          <p className="text-xs text-muted-foreground">Avg/Day</p>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-peach/50 to-peach/30 rounded-2xl p-3 text-center"
        >
          <p className="text-2xl font-bold text-foreground">
            {stats.topMood?.emoji || "—"}
          </p>
          <p className="text-xs text-muted-foreground">Top Mood</p>
        </motion.div>
      </div>

      {/* Daily Chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Wins per day</p>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {stats.days.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ height: 0 }}
              animate={{ height: `${(day.count / maxDayWins) * 100}%` }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.5, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-end"
            >
              {/* Bar */}
              <motion.div
                className={`w-full rounded-t-lg ${
                  day.count > 0
                    ? "bg-gradient-to-t from-primary to-primary/70"
                    : "bg-muted/50"
                }`}
                style={{ 
                  minHeight: day.count > 0 ? "16px" : "4px",
                  height: `${Math.max((day.count / maxDayWins) * 80, 4)}px`
                }}
                whileHover={{ scale: 1.1 }}
              />
              {/* Count */}
              {day.count > 0 && (
                <span className="text-xs font-semibold text-foreground mt-1">
                  {day.count}
                </span>
              )}
              {/* Day label */}
              <span className="text-[10px] text-muted-foreground mt-1">
                {formatDayLabel(day.date)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mood Distribution */}
      {moodDist.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Mood trends</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {moodDist.slice(0, 5).map((mood, index) => (
              <motion.div
                key={mood.emoji}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1"
              >
                <span className="text-lg">{mood.emoji}</span>
                <span className="text-xs text-muted-foreground">{mood.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
