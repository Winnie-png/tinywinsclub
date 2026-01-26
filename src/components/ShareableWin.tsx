import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Check, Twitter, Facebook } from "lucide-react";
import html2canvas from "html2canvas";
import type { Win } from "@/lib/storage";
import { getMoodTheme } from "@/lib/milestones";
import { toast } from "@/hooks/use-toast";

interface ShareableWinProps {
  win: Win;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareableWin({ win, isOpen, onClose }: ShareableWinProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const theme = getMoodTheme(win.mood);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
          setIsGenerating(false);
        }, "image/png");
      });
    } catch (error) {
      console.error("Error generating image:", error);
      setIsGenerating(false);
      return null;
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tiny-win-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded! 📥",
      description: "Your tiny win card has been saved.",
    });
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const shareText = `🏆 Tiny Win: ${win.text} ${win.mood}\n\n#TinyWinsClub #Celebrate`;

    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], "tiny-win.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "My Tiny Win",
            text: shareText,
            files: [file],
          });
          return;
        }
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    }

    // Fallback: copy text
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({
      title: "Copied to clipboard! 📋",
      description: "Share your tiny win anywhere!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`🏆 Tiny Win: ${win.text} ${win.mood}\n\n#TinyWinsClub`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display">Share Your Tiny Win ✨</DialogTitle>
        </DialogHeader>

        {/* Shareable Card Preview */}
        <div className="flex justify-center py-4">
          <div
            ref={cardRef}
            className={`w-72 p-6 rounded-3xl bg-gradient-to-br ${theme.bg} shadow-lifted relative overflow-hidden`}
          >
            {/* Background decoration */}
            <div className="absolute top-2 right-2 text-4xl opacity-20">✨</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-15">🌟</div>

            {/* Logo */}
            <div className="text-center mb-4">
              <span className="text-xs font-display font-semibold text-foreground/60 tracking-wider uppercase">
                Tiny Wins Club
              </span>
            </div>

            {/* Mood Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-5xl text-center mb-4 drop-shadow-lg"
            >
              {win.mood}
            </motion.div>

            {/* Win Text */}
            <p className="text-center text-foreground font-medium text-base leading-relaxed mb-4 px-2">
              "{win.text}"
            </p>

            {/* Date */}
            <p className="text-center text-xs text-muted-foreground">
              {formatDate(win.createdAt)}
            </p>

            {/* Footer decoration */}
            <div className="mt-4 flex justify-center gap-1">
              {["🌸", "💫", "🌈"].map((emoji, i) => (
                <span key={i} className="text-sm opacity-60">{emoji}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Share Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-full gap-2"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>

          <Button
            variant="outline"
            className="rounded-full gap-2"
            onClick={handleShare}
            disabled={isGenerating}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            variant="outline"
            className="rounded-full gap-2"
            onClick={handleTwitterShare}
          >
            <Twitter className="h-4 w-4" />
            Tweet
          </Button>

          <Button
            className="rounded-full gap-2 btn-bounce"
            onClick={handleShare}
            disabled={isGenerating}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
