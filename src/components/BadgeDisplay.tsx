import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getEarnedBadges, getNextBadges, rarityColors, calculateStreak } from "@/lib/badges";
import type { Win } from "@/hooks/useWins";
import { Flame, Trophy, Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface BadgeDisplayProps {
  wins: Win[];
  showAll?: boolean;
  isPro?: boolean;
}

const FREE_BADGE_IDS = ["first_win", "five_wins", "ten_wins", "three_day_streak", "early_bird", "night_owl", "mood_variety"];

export function BadgeDisplay({ wins, showAll = false, isPro = false }: BadgeDisplayProps) {
  const earnedBadges = getEarnedBadges(wins);
  const nextBadges = getNextBadges(wins);
  const streak = calculateStreak(wins);

  const displayBadges = showAll ? earnedBadges : earnedBadges.slice(0, 4);

  // For free users, mark pro-only badges
  const isProBadge = (badgeId: string) => !isPro && !FREE_BADGE_IDS.includes(badgeId);

  return (
    <div className="space-y-4">
      {/* Current Streak - only show here if not shown elsewhere */}
      {streak > 0 && showAll && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 mx-auto w-fit"
        >
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-display font-bold text-orange-700">
            {streak} Day Streak! 🔥
          </span>
        </motion.div>
      )}

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-celebration" />
            <h3 className="font-display font-semibold text-foreground text-sm">
              Your Badges ({earnedBadges.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {displayBadges.map((badge, index) => {
                const colors = rarityColors[badge.rarity];
                const locked = isProBadge(badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: locked ? 0.6 : 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-full border-2 relative
                      ${colors.bg} ${colors.border} ${colors.text}
                      shadow-soft cursor-default
                    `}
                    title={badge.description}
                  >
                    <span className="text-lg">{badge.emoji}</span>
                    <span className="text-xs font-semibold">{badge.name}</span>
                    {locked && (
                      <Crown className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {!showAll && earnedBadges.length > 4 && (
              <Badge variant="secondary" className="rounded-full">
                +{earnedBadges.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Next Badges to Earn */}
      {nextBadges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-muted-foreground text-sm">
              Next Badges
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full border-2 border-dashed border-muted bg-muted/30 text-muted-foreground"
                title={badge.description}
              >
                <span className="text-lg grayscale opacity-50">{badge.emoji}</span>
                <span className="text-xs">{badge.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Upgrade motivation for free users */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3"
            >
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                <Crown className="h-3 w-3" />
                Unlock all badges with Pro
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
