import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Crown, Mail, CreditCard } from "lucide-react";

export default function Profile() {
  const { user, isPro, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleOneTimeClick = () => {
    window.open("https://paystack.shop/pay/tinywins-pro-access", "_blank", "noopener,noreferrer");
  };

  const handleSubscriptionClick = () => {
    window.open("https://paystack.shop/pay/tinywins-pro", "_blank", "noopener,noreferrer");
  };

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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4"
          >
            <User className="h-10 w-10 text-primary" />
          </motion.div>

          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            My Profile
          </h1>
          
          {isPro && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg"
            >
              <Crown className="h-4 w-4" />
              Pro Member
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-cozy p-6 space-y-6"
        >
          {/* Email Display */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground truncate">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          {/* Upgrade to Pro - Only show for non-Pro users */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="font-display font-semibold text-foreground">
                  Upgrade to Pro
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get unlimited wins, jars, insights, and more for just 400 KES/month
              </p>
              
              {/* Primary Button - One-time (Same as Pricing page) */}
              <div className="space-y-3">
                <Button 
                  onClick={handleOneTimeClick}
                  className="w-full h-12 text-base font-display font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Get 30 Days Pro
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/512px-M-PESA_LOGO-01.svg.png" 
                    alt="M-Pesa" 
                    className="h-5 ml-2"
                  />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  M-Pesa, Apple Pay, & Cards
                </p>
                
                {/* Secondary Button - Subscription */}
                <Button 
                  variant="outline"
                  onClick={handleSubscriptionClick}
                  className="w-full h-10 text-sm font-display font-semibold rounded-xl border-2 hover:bg-muted/50"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Monthly Subscription
                </Button>
              </div>
            </motion.div>
          )}

          {/* Sign Out */}
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
