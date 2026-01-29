import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WinJar } from "@/components/WinJar";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { Button } from "@/components/ui/button";
import { getWins } from "@/lib/storage";
import { getNextMilestone } from "@/lib/milestones";
import { PlusCircle, Sparkles, Heart, TrendingUp, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import type { Win } from "@/lib/storage";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [wins, setWins] = useState<Win[]>([]);
  const { theme } = useTheme();
  const { isPro } = useAuth();

  useEffect(() => {
    setWins(getWins());
  }, []);

  const nextMilestone = getNextMilestone(wins.length);

  return (
    <Layout>
      <div className={`flex flex-col items-center text-center pt-4 page-enter min-h-screen bg-gradient-to-br ${theme.bg} transition-colors duration-500`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
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

        {/* Jar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <WinJar wins={wins} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            asChild 
            size="lg" 
            className="rounded-full px-8 gap-2 shadow-lifted btn-bounce text-lg"
          >
            <Link to="/add">
              <PlusCircle className="h-5 w-5" />
              Add a Tiny Win
            </Link>
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 mt-4"
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
            className="mt-4 text-sm text-muted-foreground"
          >
            {wins.length}/10 free wins used
          </motion.div>
        )}

        {/* Milestone Teaser */}
        {nextMilestone && wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-lavender/40 to-mint/40 rounded-2xl px-4 py-2"
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
            <BadgeDisplay wins={wins} />
          </motion.div>
        )}

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Heart className="h-4 w-4 text-destructive/60" />
          <p>
            {wins.length === 0 
              ? "Your jar is empty. Let's add your first win!"
              : wins.length < 5
              ? "You're off to a great start! Keep collecting wins."
              : "Look at all those wins! You're doing amazing! 🌟"
            }
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
