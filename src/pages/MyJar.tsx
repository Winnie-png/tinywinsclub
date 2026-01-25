import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WinJar } from "@/components/WinJar";
import { WinCard } from "@/components/WinCard";
import { getWins, deleteWin } from "@/lib/storage";
import type { Win } from "@/lib/storage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

export default function MyJar() {
  const [wins, setWins] = useState<Win[]>([]);

  useEffect(() => {
    setWins(getWins());
  }, []);

  const handleDelete = (id: string) => {
    deleteWin(id);
    setWins(getWins());
  };

  return (
    <Layout>
      <div className="pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            My Win Jar 🏆
          </h1>
          <p className="text-muted-foreground text-sm">
            All your tiny victories, safe and sound
          </p>
        </motion.div>

        {/* Jar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <WinJar wins={wins} />
        </motion.div>

        {/* Wins List */}
        {wins.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Recent Wins
              </h2>
              <span className="text-sm text-muted-foreground">
                {wins.length} total
              </span>
            </div>
            <AnimatePresence mode="popLayout">
              {wins.map((win, index) => (
                <WinCard
                  key={win.id}
                  win={win}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-5xl mb-4">🫙</div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">
              Your jar is empty
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Start collecting your tiny wins today!
            </p>
            <Button asChild className="rounded-full gap-2">
              <Link to="/add">
                <PlusCircle className="h-4 w-4" />
                Add Your First Win
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
