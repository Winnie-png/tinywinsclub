import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WeeklyStats } from "@/components/WeeklyStats";
import { StreakDisplay } from "@/components/StreakDisplay";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Confetti } from "@/components/Confetti";
import { useWins } from "@/hooks/useWins";
import { useAuth } from "@/contexts/AuthContext";
import { getMoodDistribution } from "@/lib/analytics";
import { calculateStreak } from "@/lib/badges";
import { TrendingUp, Flame, Award, Calendar, Loader2, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FREE_WIN_LIMIT = 10;

export default function Stats() {
  const { wins, loading } = useWins();
  const { isPro } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);

  const moodDist = getMoodDistribution(wins);
  const streak = calculateStreak(wins);
  const hasReachedLimit = !isPro && wins.length >= FREE_WIN_LIMIT;

  // Trigger celebration confetti for milestones
  const celebrateMilestone = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const stats = [
    { label: "Total Wins", value: wins.length, icon: Award, color: "from-lavender to-lavender/50", suffix: "" },
    { label: "Current Streak", value: streak, icon: Flame, color: "from-peach to-peach/50", suffix: " days" },
    { label: "Unique Moods", value: moodDist.length, icon: TrendingUp, color: "from-mint to-mint/50", suffix: "" },
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
      <Confetti trigger={showConfetti} intensity="medium" />
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
            {/* Streak Display */}
            {streak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StreakDisplay streak={streak} isPro={isPro} />
              </motion.div>
            )}

            {/* Quick Stats with animated counters */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} rounded-3xl p-5 text-center shadow-soft border-2 border-border/20`}
                    onClick={stat.label === "Total Wins" && wins.length >= 10 ? celebrateMilestone : undefined}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2 text-foreground/70" />
                    <div className="text-xl font-bold text-foreground">
                      {stat.suffix === " days" ? (
                        <><AnimatedCounter value={stat.value} />{stat.suffix}</>
                      ) : (
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Motivational banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-lavender/30 to-mint/30 rounded-2xl px-5 py-3 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-foreground font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                {hasReachedLimit
                  ? "You've hit your free limit! Upgrade to track unlimited stats 🚀"
                  : streak >= 7
                  ? `${streak} days strong! You're building an incredible habit! 💪`
                  : wins.length >= 25
                  ? "Look at that progress! You're on fire! 🔥"
                  : "Small wins create big momentum! Keep going! ✨"
                }
              </div>
            </motion.div>

            {/* Upgrade CTA for free users at limit */}
            {hasReachedLimit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  asChild
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 font-display font-semibold"
                >
                  <Link to="/pricing">
                    <Crown className="h-5 w-5 mr-2" />
                    Unlock Unlimited Stats – $6/month
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Weekly Stats Component */}
            <WeeklyStats wins={wins} />

            {/* All-time Mood Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-cozy p-6"
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
