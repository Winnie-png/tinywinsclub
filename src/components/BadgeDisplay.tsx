import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getEarnedBadges, getNextBadges, rarityColors, calculateStreak } from "@/lib/badges";
import type { Win } from "@/lib/storage";
import { Flame, Trophy, Lock } from "lucide-react";

interface BadgeDisplayProps {
  wins: Win[];
  showAll?: boolean;
}

export function BadgeDisplay({ wins, showAll = false }: BadgeDisplayProps) {
  const earnedBadges = getEarnedBadges(wins);
  const nextBadges = getNextBadges(wins);
  const streak = calculateStreak(wins);

  const displayBadges = showAll ? earnedBadges : earnedBadges.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Current Streak */}
      {streak > 0 && (
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
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-full border-2
                      ${colors.bg} ${colors.border} ${colors.text}
                      shadow-soft cursor-default
                    `}
                    title={badge.description}
                  >
                    <span className="text-lg">{badge.emoji}</span>
                    <span className="text-xs font-semibold">{badge.name}</span>
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
        </div>
      )}
    </div>
  );
}
