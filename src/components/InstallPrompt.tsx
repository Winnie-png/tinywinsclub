import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return; // Don't show for 7 days after dismiss
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // For iOS, show prompt after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // For Android/Chrome, listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  // Only show on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-card border border-border rounded-2xl shadow-lifted p-4 backdrop-blur-lg">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {showIOSInstructions ? (
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">
                    Install on iPhone
                  </h3>
                </div>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>Tap the <strong>Share</strong> button in Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>Tap <strong>"Add"</strong> to install</span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender to-peach flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🫙</span>
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-display font-semibold text-foreground text-sm">
                    Add to Home Screen
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Install Tiny Wins Club for quick access
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="rounded-full gap-1.5 btn-bounce flex-shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
