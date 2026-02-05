import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Trophy, Heart, Target } from "lucide-react";

const GOALS = [
  { id: "consistent", label: "Staying consistent", icon: Target },
  { id: "motivated", label: "Feeling motivated", icon: Sparkles },
  { id: "gratitude", label: "Practicing gratitude", icon: Heart },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("user_goals", JSON.stringify(selectedGoals));
    navigate("/auth");
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === step ? "bg-primary" : "bg-muted"
            }`}
            animate={{ scale: i === step ? 1.2 : 1 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
              >
                <Trophy className="h-10 w-10 text-primary" />
              </motion.div>

              <h1 className="text-2xl font-display font-bold text-foreground mb-3">
                Celebrate small wins.
                <br />
                Even on hard days.
              </h1>

              <p className="text-muted-foreground mb-8">
                Tiny Wins helps you notice progress that's easy to miss.
              </p>

              <Button
                size="lg"
                onClick={nextStep}
                className="w-full h-14 text-lg font-display font-semibold rounded-xl btn-bounce"
              >
                Get Started
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="personalization"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-sm"
            >
              <h1 className="text-xl font-display font-bold text-foreground text-center mb-2">
                What do you want help with right now?
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Select all that apply
              </p>

              <div className="space-y-3 mb-8">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  const Icon = goal.icon;
                  return (
                    <motion.button
                      key={goal.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-foreground flex-1 text-left">
                        {goal.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <Button
                size="lg"
                onClick={nextStep}
                className="w-full h-14 text-lg font-display font-semibold rounded-xl btn-bounce"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="howitworks"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-sm"
            >
              <h1 className="text-xl font-display font-bold text-foreground text-center mb-6">
                How Tiny Wins works
              </h1>

              <div className="space-y-4 mb-8">
                {[
                  { emoji: "📝", text: "Log small daily wins" },
                  { emoji: "💭", text: "Add emotions to each win" },
                  { emoji: "🫙", text: "Watch your jar fill over time" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-medium text-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={handleComplete}
                className="w-full h-14 text-lg font-display font-semibold rounded-xl btn-bounce"
              >
                Start logging wins
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip option */}
      {step < 2 && (
        <div className="pb-8 text-center">
          <button
            onClick={handleComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}
