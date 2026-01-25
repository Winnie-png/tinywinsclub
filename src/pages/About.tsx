import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Heart, Sparkles, Shield, Coffee } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Celebrate Small Wins",
    description: "Every achievement matters, no matter how tiny. We're here to help you notice the good stuff.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your wins stay on your device. No accounts, no tracking, just you and your jar of joy.",
  },
  {
    icon: Coffee,
    title: "Simple & Cozy",
    description: "A warm, welcoming space to pause and appreciate your daily victories.",
  },
];

export default function About() {
  return (
    <Layout>
      <div className="pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            About Tiny Wins Club
          </h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            A cozy corner of the internet for celebrating life's little moments
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cozy p-6 mb-6"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-3">
            Why Tiny Wins? 💭
          </h2>
          <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
            <p>
              We often wait for big achievements to feel proud. But what about the small stuff? 
              Making breakfast, sending that email, going for a walk, or simply getting through a tough day.
            </p>
            <p>
              <strong className="text-foreground">These tiny wins add up.</strong> They're the building blocks of a happy life. 
              Tiny Wins Club helps you notice, collect, and celebrate them—one win at a time.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card-cozy p-4 flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 pt-6 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            Made with 💖 for people who deserve to celebrate more
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            © {new Date().getFullYear()} Tiny Wins Club
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
