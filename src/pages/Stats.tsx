import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WeeklyStats } from "@/components/WeeklyStats";
import { useWins } from "@/hooks/useWins";
import { getMoodDistribution } from "@/lib/analytics";
import { calculateStreak } from "@/lib/badges";
import { TrendingUp, Flame, Award, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Stats() {
  const { wins, loading } = useWins();

  const moodDist = getMoodDistribution(wins);
  const streak = calculateStreak(wins);

  const stats = [
    { label: "Total Wins", value: wins.length, icon: Award, color: "from-lavender to-lavender/50" },
    { label: "Current Streak", value: `${streak} days`, icon: Flame, color: "from-peach to-peach/50" },
    { label: "Unique Moods", value: moodDist.length, icon: TrendingUp, color: "from-mint to-mint/50" },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-2 page-enter">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              Your Stats
            </h1>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            See how you're doing this week
          </p>
        </motion.div>

        {wins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 card-cozy"
          >
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">
              No stats yet
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Add some wins to see your progress!
            </p>
            <Button asChild className="rounded-full gap-2 btn-bounce">
              <Link to="/add">Start Adding Wins</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-center`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2 text-foreground/70" />
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Weekly Stats Component */}
            <WeeklyStats wins={wins} />

            {/* All-time Mood Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-cozy p-5"
            >
              <h3 className="font-display font-bold text-foreground mb-4">
                All-time Mood Distribution
              </h3>
              <div className="space-y-3">
                {moodDist.map((mood, index) => (
                  <motion.div
                    key={mood.emoji}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-2xl w-8">{mood.emoji}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mood.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-celebration rounded-full"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {mood.percentage}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
