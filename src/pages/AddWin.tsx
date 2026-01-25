import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { MoodSelector } from "@/components/MoodSelector";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveWin } from "@/lib/storage";
import { getRandomAffirmation } from "@/lib/affirmations";
import { Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddWin() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [mood, setMood] = useState("😊");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [affirmation, setAffirmation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    saveWin({ text: text.trim(), mood });
    setAffirmation(getRandomAffirmation());
    setShowConfetti(true);

    // Wait for celebration, then redirect
    setTimeout(() => {
      navigate("/jar");
    }, 2500);
  };

  const isValid = text.trim().length > 0;

  return (
    <Layout>
      <Confetti trigger={showConfetti} />
      
      <div className="pt-2">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Add a Tiny Win 🎉
          </h1>
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
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Text Input */}
              <div className="card-cozy p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your tiny win
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="I made my bed, had a nice coffee, took a short walk..."
                  className="min-h-[120px] resize-none bg-background border-border/50 rounded-xl text-base"
                  maxLength={280}
                />
                <p className="text-xs text-muted-foreground text-right mt-2">
                  {text.length}/280
                </p>
              </div>

              {/* Mood Selector */}
              <div className="card-cozy p-4">
                <label className="block text-sm font-medium text-foreground mb-3 text-center">
                  How does this win make you feel?
                </label>
                <MoodSelector selected={mood} onSelect={setMood} />
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="w-full rounded-full py-6 text-lg gap-2 shadow-lifted"
                >
                  <Send className="h-5 w-5" />
                  Save My Win
                </Button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-6xl mb-6"
              >
                {mood}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-center text-foreground font-medium max-w-xs"
              >
                {affirmation}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
