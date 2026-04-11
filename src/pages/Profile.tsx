import { useState } from "react";
import { motion } from "framer-motion";
import visaLogo from "@/assets/visa-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import mpesaLogo from "@/assets/mpesa-logo.png";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Crown, Mail, AlertTriangle, Calendar, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
  const { user, isPro, proExpiresAt, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleOneTimeClick = () => {
    window.open("https://paystack.shop/pay/tinywins-pro-access", "_blank", "noopener,noreferrer");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await signOut();
      toast.success("Your account has been permanently deleted.");
      navigate("/auth");
    } catch (err: any) {
      console.error("Account deletion error:", err);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const daysLeft = proExpiresAt
    ? Math.max(0, Math.ceil((new Date(proExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const showExpiryWarning = isPro && daysLeft !== null && daysLeft <= 3;

  return (
    <Layout>
      <div className="pt-4">
        {showExpiryWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-sm text-foreground">
                {daysLeft === 0
                  ? "Your Pro access expires today! Renew now to keep your features."
                  : `Your Pro access expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Renew to stay Pro!`}
                <Button
                  size="sm"
                  className="ml-2 h-7 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  onClick={handleOneTimeClick}
                >
                  Renew
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

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

          {/* Pro Expiry Display */}
          {isPro && proExpiresAt && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Pro expires</p>
                <p className="font-medium text-foreground">
                  {new Date(proExpiresAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {daysLeft !== null && (
                    <span className={`ml-2 text-xs ${daysLeft <= 3 ? "text-amber-500" : "text-muted-foreground"}`}>
                      ({daysLeft} day{daysLeft === 1 ? "" : "s"} left)
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Upgrade to Pro */}
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
                Get unlimited wins, jars, insights, and more for just $6/month
              </p>
              
               <div className="space-y-3">
                 <Button 
                   onClick={handleOneTimeClick}
                   className="w-full h-14 font-display font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                 >
                   <div className="flex items-center justify-center gap-2.5 w-full">
                     <Crown className="h-5 w-5" />
                     <span className="whitespace-nowrap">Unlock Pro – $6/month</span>
                   </div>
                 </Button>
                 
                 <div className="flex items-center justify-center gap-3">
                   <span className="text-xs text-muted-foreground">Pay with</span>
                    <div className="flex items-center gap-2">
                      <img src={visaLogo} alt="Visa" className="h-5 w-auto" loading="lazy" />
                      <img src={mastercardLogo} alt="Mastercard" className="h-5 w-auto" loading="lazy" />
                      <img src={mpesaLogo} alt="M-Pesa" className="h-5 w-auto" loading="lazy" />
                    </div>
                 </div>
                 
                 <p className="text-center text-xs text-primary font-medium">
                   Instant activation after payment
                 </p>
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

          {/* Delete Account */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all your data including wins, jars, and Pro status. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </Layout>
  );
}