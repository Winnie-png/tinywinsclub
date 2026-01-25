import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WinJar } from "@/components/WinJar";
import { Button } from "@/components/ui/button";
import { getWins } from "@/lib/storage";
import { PlusCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { Win } from "@/lib/storage";

const Index = () => {
  const [wins, setWins] = useState<Win[]>([]);

  useEffect(() => {
    setWins(getWins());
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center text-center pt-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-display font-bold text-foreground">
              Tiny Wins Club
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Celebrate the little victories that make your day brighter ✨
          </p>
        </motion.div>

        {/* Jar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
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
          <Button asChild size="lg" className="rounded-full px-8 gap-2 shadow-lifted">
            <Link to="/add">
              <PlusCircle className="h-5 w-5" />
              Add a Tiny Win
            </Link>
          </Button>
        </motion.div>

        {/* Encouragement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          {wins.length === 0 
            ? "Your jar is empty. Let's add your first win!"
            : wins.length < 5
            ? "You're off to a great start! Keep collecting wins."
            : "Look at all those wins! You're doing amazing! 🌟"
          }
        </motion.p>
      </div>
    </Layout>
  );
};

export default Index;
