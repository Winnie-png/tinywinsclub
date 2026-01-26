import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { getWins } from "@/lib/storage";
import { getEarnedBadges, getNextBadges, rarityColors, calculateStreak, badges } from "@/lib/badges";
import type { Win } from "@/lib/storage";
import { Award, Lock, Flame, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Badges() {
  const [wins, setWins] = useState<Win[]>([]);

  useEffect(() => {
    setWins(getWins());
  }, []);

  const earnedBadges = getEarnedBadges(wins);
  const unearnedBadges = badges.filter((b) => !earnedBadges.some((e) => e.id === b.id));
  const streak = calculateStreak(wins);

  return (
    <Layout>
      <div className="pt-2 page-enter">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-celebration" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              Badges & Streaks
            </h1>
            <Trophy className="h-5 w-5 text-celebration" />
          </div>
          <p className="text-muted-foreground text-sm">
            Collect them all!
          </p>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-cozy p-6 mb-6 bg-gradient-to-br from-peach/50 to-celebration/20 text-center"
        >
          <Flame className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-4xl font-display font-bold text-foreground mb-1">
            {streak}
          </p>
          <p className="text-sm text-muted-foreground">
            {streak === 1 ? "Day Streak" : "Day Streak"} 🔥
          </p>
          {streak === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Add a win today to start a streak!
            </p>
          )}
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-cozy p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Badge Progress</span>
            <span className="text-sm text-muted-foreground">
              {earnedBadges.length} / {badges.length}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-primary to-celebration rounded-full"
            />
          </div>
        </motion.div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-celebration" />
              <h2 className="font-display font-bold text-foreground">
                Earned ({earnedBadges.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {earnedBadges.map((badge, index) => {
                const colors = rarityColors[badge.rarity];
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05, type: "spring" }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`
                      p-4 rounded-2xl border-2 text-center
                      ${colors.bg} ${colors.border}
                    `}
                  >
                    <span className="text-4xl block mb-2">{badge.emoji}</span>
                    <p className={`font-display font-bold text-sm ${colors.text}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                    <span className={`text-[10px] uppercase tracking-wider ${colors.text} opacity-70 mt-2 block`}>
                      {badge.rarity}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Locked Badges */}
        {unearnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display font-bold text-muted-foreground">
                Locked ({unearnedBadges.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {unearnedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.03 }}
                  className="p-4 rounded-2xl border-2 border-dashed border-muted bg-muted/20 text-center opacity-60"
                >
                  <span className="text-4xl block mb-2 grayscale">{badge.emoji}</span>
                  <p className="font-display font-bold text-sm text-muted-foreground">
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {wins.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Button asChild className="rounded-full gap-2 btn-bounce">
              <Link to="/add">Start Earning Badges</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
