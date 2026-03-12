import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WinJar } from "@/components/WinJar";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { StreakDisplay } from "@/components/StreakDisplay";
import { PaywallModal } from "@/components/PaywallModal";
import { Button } from "@/components/ui/button";
import { useWins } from "@/hooks/useWins";
import { calculateStreak } from "@/lib/badges";
import { getNextMilestone } from "@/lib/milestones";
import { PlusCircle, Sparkles, Heart, TrendingUp, Crown, Loader2, AlertTriangle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FREE_WIN_LIMIT = 10;

const Index = () => {
  const { wins, loading } = useWins();
  const { theme } = useTheme();
  const { isPro, proExpiresAt } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  const daysLeft = proExpiresAt
    ? Math.max(0, Math.ceil((new Date(proExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  const showExpiryWarning = isPro && daysLeft !== null && daysLeft <= 3;

  const nextMilestone = getNextMilestone(wins.length);
  const streak = calculateStreak(wins);
  const hasReachedLimit = !isPro && wins.length >= FREE_WIN_LIMIT;

  const handleAddWin = () => {
    if (hasReachedLimit) {
      setShowPaywall(true);
    }
  };

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
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
      />

      <div className={`flex flex-col items-center text-center pt-4 page-enter min-h-screen bg-gradient-to-br ${theme.bg} transition-colors duration-500`}>
        {showExpiryWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-4"
          >
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-sm text-foreground">
                {daysLeft === 0
                  ? "Pro expires today!"
                  : `Pro expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`}
                <Link to="/profile" className="ml-1 text-amber-500 font-semibold underline">
                  Renew
                </Link>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-display font-bold text-foreground">
              Tiny Wins Club
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Celebrate the little victories that make your day brighter ✨
          </p>
        </motion.div>

        {/* Streak Display */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4"
          >
            <StreakDisplay streak={streak} isPro={isPro} />
          </motion.div>
        )}

        {/* Jar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="mb-6"
        >
          <WinJar wins={wins} isLocked={hasReachedLimit} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {hasReachedLimit ? (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button 
                size="lg" 
                className="rounded-full px-10 gap-3 shadow-lifted text-lg h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                onClick={handleAddWin}
              >
                <Crown className="h-6 w-6" strokeWidth={2.5} />
                Unlock More Wins
              </Button>
            </motion.div>
          ) : (
            <Button 
              asChild 
              size="lg" 
              className="rounded-full px-10 gap-3 shadow-lifted btn-bounce text-lg h-14"
            >
              <Link to="/add">
                <PlusCircle className="h-6 w-6" strokeWidth={2.5} />
                Add a Tiny Win
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 mt-6"
        >
          <Button variant="outline" size="sm" asChild className="rounded-full gap-1">
            <Link to="/stats">
              <TrendingUp className="h-4 w-4" />
              Stats
            </Link>
          </Button>
          {!isPro && (
            <Button 
              size="sm" 
              asChild 
              className="rounded-full gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
            >
              <Link to="/pricing">
                <Crown className="h-4 w-4" />
                Unlock Pro
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Free tier win count indicator */}
        {!isPro && wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-4"
          >
            <div className="text-sm text-muted-foreground">
              {wins.length}/{FREE_WIN_LIMIT} free wins used
            </div>
            {/* Progress bar */}
            <div className="w-40 h-2 bg-muted rounded-full mt-2 mx-auto overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: hasReachedLimit
                    ? "linear-gradient(90deg, hsl(40 90% 55%), hsl(25 90% 55%))"
                    : "hsl(var(--primary))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(wins.length / FREE_WIN_LIMIT) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Milestone Teaser */}
        {nextMilestone && wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-lavender/40 to-mint/40 rounded-3xl px-5 py-3 shadow-soft"
          >
            <p className="text-sm text-foreground">
              <span className="font-medium">{nextMilestone.count - wins.length}</span> more wins to {nextMilestone.emoji}
            </p>
          </motion.div>
        )}

        {/* Badge Preview */}
        {wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-6 w-full max-w-sm"
          >
            <BadgeDisplay wins={wins} isPro={isPro} />
          </motion.div>
        )}

        {/* Motivational text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 mb-4 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Heart className="h-4 w-4 text-destructive/60" />
          <p>
            {wins.length === 0 
              ? "Your jar is empty. Let's add your first win!"
              : hasReachedLimit
              ? "You've maxed out! Upgrade to keep the momentum going 🚀"
              : wins.length < 5
              ? "You're off to a great start! Keep collecting wins."
              : "Small wins create big momentum! 🌟"
            }
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
