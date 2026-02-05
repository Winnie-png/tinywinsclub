import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, KeyRound, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
          setChecking(false);
        } else if (session) {
          // User has a valid session (might have come from the reset link)
          setIsValidSession(true);
          setChecking(false);
        }
      }
    );

    // Also check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
      // Sign out after password reset so they can log in fresh
      await supabase.auth.signOut();
    }
  };

  if (checking) {
    return (
      <Layout>
        <div className="pt-8 text-center">
          <div className="animate-pulse text-muted-foreground">
            Verifying reset link...
          </div>
        </div>
      </Layout>
    );
  }

  if (!isValidSession && !success) {
    return (
      <Layout>
        <div className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 mb-6"
            >
              <KeyRound className="h-8 w-8 text-destructive" />
            </motion.div>

            <h1 className="text-2xl font-display font-bold text-foreground mb-3">
              Link expired
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-8">
              This reset link has expired or is invalid. Please request a new one.
            </p>

            <Link to="/forgot-password">
              <Button className="btn-bounce">
                Request new link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
            >
              <CheckCircle className="h-8 w-8 text-primary" />
            </motion.div>

            <h1 className="text-2xl font-display font-bold text-foreground mb-3">
              Password reset!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-8">
              You can now log in and keep celebrating your wins 🎉
            </p>

            <Link to="/auth">
              <Button className="btn-bounce">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4"
          >
            <Lock className="h-8 w-8 text-primary" />
          </motion.div>

          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Create new password
          </h1>
          <p className="text-muted-foreground text-sm">
            Choose a password you'll remember
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card-cozy p-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-display font-semibold rounded-xl btn-bounce"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Resetting...</span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </motion.form>
      </div>
    </Layout>
  );
}
