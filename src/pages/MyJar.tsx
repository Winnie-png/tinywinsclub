import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WinJar } from "@/components/WinJar";
import { WinCard } from "@/components/WinCard";
import { WeeklyStats } from "@/components/WeeklyStats";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { ShareableWin } from "@/components/ShareableWin";
import { useWins, Win } from "@/hooks/useWins";
import { getNextMilestone } from "@/lib/milestones";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trophy, Target, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function MyJar() {
  const { wins, loading, deleteWin } = useWins();
  const [selectedWin, setSelectedWin] = useState<Win | null>(null);
  const [showShare, setShowShare] = useState(false);
  const { theme } = useTheme();

  const handleDelete = async (id: string) => {
    await deleteWin(id);
  };

  const handleShare = (win: Win) => {
    setSelectedWin(win);
    setShowShare(true);
  };

  const nextMilestone = getNextMilestone(wins.length);

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
      <div className={`pt-2 page-enter min-h-screen bg-gradient-to-br ${theme.bg} transition-colors duration-500`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-celebration" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              My Win Jar
            </h1>
            <Trophy className="h-5 w-5 text-celebration" />
          </div>
          <p className="text-muted-foreground text-sm">
            All your tiny victories, safe and sound
          </p>
        </motion.div>

        {/* Jar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="flex justify-center mb-8"
        >
          <WinJar wins={wins} />
        </motion.div>

        {/* Badges Preview */}
        {wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <BadgeDisplay wins={wins} />
          </motion.div>
        )}

        {/* Milestone Progress */}
        {nextMilestone && wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-cozy p-4 mb-6 bg-gradient-to-r from-lavender/30 to-mint/30"
          >
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Next milestone: {nextMilestone.count} wins {nextMilestone.emoji}
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-celebration rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(wins.length / nextMilestone.count) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {nextMilestone.count - wins.length} more to go!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly Stats */}
        {wins.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <WeeklyStats wins={wins} />
          </motion.div>
        )}

        {/* Wins List */}
        {wins.length > 0 ? (
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mb-4"
            >
              <h2 className="text-lg font-display font-semibold text-foreground">
                Recent Wins
              </h2>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {wins.length} total
              </span>
            </motion.div>
            <AnimatePresence mode="popLayout">
              {wins.map((win, index) => (
                <WinCard
                  key={win.id}
                  win={win}
                  index={index}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 card-cozy"
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
            >
              🫙
            </motion.div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">
              Your jar is empty
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Start collecting your tiny wins today!
            </p>
            <Button asChild className="rounded-full gap-2 btn-bounce shadow-lifted">
              <Link to="/add">
                <PlusCircle className="h-4 w-4" />
                Add Your First Win
              </Link>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Share Modal */}
      {selectedWin && (
        <ShareableWin
          win={selectedWin}
          isOpen={showShare}
          onClose={() => {
            setShowShare(false);
            setSelectedWin(null);
          }}
        />
      )}
    </Layout>
  );
}
