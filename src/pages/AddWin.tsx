import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { MoodSelector } from "@/components/MoodSelector";
import { Confetti } from "@/components/Confetti";
import { MilestoneModal } from "@/components/MilestoneModal";
import { PaywallModal } from "@/components/PaywallModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWins } from "@/hooks/useWins";
import { useJars } from "@/hooks/useJars";
import { getRandomAffirmation } from "@/lib/affirmations";
import { getMilestoneMessage, getMoodTheme, Milestone } from "@/lib/milestones";
import { getRecentlyEarnedBadge, Badge } from "@/lib/badges";
import { Send, ArrowLeft, Sparkles, Award, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FREE_WIN_LIMIT = 10;

export default function AddWin() {
  const navigate = useNavigate();
  const { setMood: setThemeMood, theme } = useTheme();
  const { isPro } = useAuth();
  const { jars, activeJarId, setActiveJarId, ensureDefaultJar, loading: jarsLoading } = useJars();
  const { wins, saveWin, loading: winsLoading } = useWins();
  const [text, setText] = useState("");
  const [mood, setMood] = useState("😊");
  const [selectedJarId, setSelectedJarId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const moodTheme = getMoodTheme(mood);
  const currentWinCount = wins.length;
  const hasReachedLimit = !isPro && currentWinCount >= FREE_WIN_LIMIT;

  // Set default selected jar when jars load
  useEffect(() => {
    if (jars.length > 0 && !selectedJarId) {
      setSelectedJarId(activeJarId || jars[0].id);
    }
  }, [jars, activeJarId, selectedJarId]);

  // Update global theme when mood changes
  useEffect(() => {
    setThemeMood(mood);
  }, [mood, setThemeMood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Check win limit for free users
    if (hasReachedLimit) {
      setShowPaywall(true);
      return;
    }

    setIsSubmitting(true);
    const previousCount = wins.length;
    
    // Ensure user has a jar to add wins to
    let jarId = selectedJarId;
    if (!jarId) {
      jarId = await ensureDefaultJar();
    }
    
    // Wait for database confirmation before proceeding
    const savedWin = await saveWin({ text: text.trim(), mood, jarId });
    
    if (!savedWin) {
      // Save failed - error toast already shown by hook
      setIsSubmitting(false);
      return;
    }
    
    const newWinCount = previousCount + 1;
    const milestoneMsg = getMilestoneMessage(newWinCount);
    
    // Check for new badges with updated wins array
    const updatedWins = [savedWin, ...wins];
    const earnedBadge = getRecentlyEarnedBadge(updatedWins, previousCount);
    if (earnedBadge) {
      setNewBadge(earnedBadge);
    }
    
    if (milestoneMsg) {
      setMilestone(milestoneMsg);
      // Show milestone modal after a brief delay
      setTimeout(() => {
        setShowMilestoneModal(true);
      }, 1500);
    }
    
    setAffirmation(getRandomAffirmation());
    setShowConfetti(true);

    // Wait for celebration, then redirect
    setTimeout(() => {
      if (!milestoneMsg) {
        navigate("/jar");
      }
    }, 3000);
  };

  const handleMilestoneClose = () => {
    setShowMilestoneModal(false);
    setTimeout(() => {
      navigate("/jar");
    }, 500);
  };

  const isValid = text.trim().length > 0;

  return (
    <Layout>
      <Confetti trigger={showConfetti} intensity="high" />
      <MilestoneModal 
        milestone={milestone} 
        isOpen={showMilestoneModal} 
        onClose={handleMilestoneClose} 
      />
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Your jar is full!"
        message="You've reached the free limit of 10 wins. Upgrade to Pro to keep collecting your victories."
      />
      
      <div className={`pt-2 page-enter min-h-screen bg-gradient-to-br ${theme.bg} transition-colors duration-500`}>
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              Add a Tiny Win
            </h1>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            What's something good that happened today?
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitting ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="space-y-6"
            >
              {/* Text Input */}
              <motion.div 
                className={`card-cozy p-4 bg-gradient-to-br ${moodTheme.bg}`}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your tiny win
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="I made my bed, had a nice coffee, took a short walk..."
                  className="min-h-[120px] resize-none bg-background/80 border-border/50 rounded-xl text-base focus:ring-2 focus:ring-primary/30 transition-all"
                  maxLength={280}
                />
                <p className="text-xs text-muted-foreground text-right mt-2">
                  {text.length}/280
                </p>
              </motion.div>

              {/* Mood Selector */}
              <motion.div 
                className="card-cozy p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-foreground mb-3 text-center">
                  How does this win make you feel?
                </label>
                <MoodSelector selected={mood} onSelect={setMood} />
              </motion.div>

              {/* Jar Selector - Only show if multiple jars */}
              {jars.length > 1 && (
                <motion.div 
                  className="card-cozy p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-3 text-center">
                    Add to which jar?
                  </label>
                  <Select 
                    value={selectedJarId || ""} 
                    onValueChange={setSelectedJarId}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select a jar" />
                    </SelectTrigger>
                    <SelectContent>
                      {jars.map((jar) => (
                        <SelectItem key={jar.id} value={jar.id}>
                          🫙 {jar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="w-full rounded-full py-6 text-lg gap-2 shadow-lifted btn-bounce"
                >
                  <Send className="h-5 w-5" />
                  Save My Win
                </Button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              className="flex flex-col items-center justify-center py-12"
            >
              {/* Bouncing Mood Emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.3, 0.9, 1.1, 1],
                  rotate: [-180, 20, -10, 5, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  times: [0, 0.4, 0.6, 0.8, 1],
                  ease: "easeOut"
                }}
                className="text-7xl mb-6 drop-shadow-lg"
              >
                {mood}
              </motion.div>
              
              {/* New Badge Alert */}
              {newBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl px-6 py-3 mb-4 flex items-center gap-2"
                >
                  <Award className="h-5 w-5 text-amber-600" />
                  <p className="text-sm font-display font-bold text-amber-800">
                    New Badge: {newBadge.emoji} {newBadge.name}!
                  </p>
                </motion.div>
              )}
              
              {/* Affirmation */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-center text-foreground font-medium max-w-xs leading-relaxed"
              >
                {affirmation}
              </motion.p>
              
              {/* Redirecting indicator */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-sm text-muted-foreground mt-6"
              >
                Taking you to your jar... ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
