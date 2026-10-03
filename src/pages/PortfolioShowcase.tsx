import { useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import {
  Award,
  Check,
  Crown,
  Download,
  Flame,
  Home,
  Lightbulb,
  PlusCircle,
  Send,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { MoodSelector } from "@/components/MoodSelector";
import { StreakDisplay } from "@/components/StreakDisplay";
import { WeeklyStats } from "@/components/WeeklyStats";
import { WinJar } from "@/components/WinJar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getMoodDistribution } from "@/lib/analytics";
import { calculateStreak } from "@/lib/badges";
import type { Win } from "@/hooks/useWins";

const DAY = 24 * 60 * 60 * 1000;

const sampleDetails = [
  ["Finished a task I had been putting off", "😊"],
  ["Took a peaceful walk after lunch", "😌"],
  ["Made time to call someone I love", "🥰"],
  ["Completed my morning workout", "💪"],
  ["Shared an idea in the team meeting", "🌟"],
  ["Cooked a proper dinner for myself", "😊"],
  ["Reached a goal I set this week", "🥳"],
  ["Read before bed instead of scrolling", "😌"],
  ["Asked for help when I needed it", "💪"],
  ["Kept a promise I made to myself", "🌟"],
  ["Cleared my desk before starting work", "😊"],
  ["Celebrated a friend's good news", "🥰"],
  ["Tried something new without overthinking", "🥳"],
  ["Woke up early and watched the sunrise", "😌"],
] as const;

function createSampleWins(): Win[] {
  const now = new Date();
  return sampleDetails.map(([text, mood], index) => {
    const date = new Date(now.getTime() - Math.floor(index / 2) * DAY);
    date.setHours(index === 13 ? 7 : 10 + (index % 10), 12, 0, 0);
    return {
      id: `showcase-win-${index}`,
      text,
      mood,
      createdAt: date.toISOString(),
      jarId: "showcase-jar",
    };
  });
}

const frameLabels = [
  ["daily-wins", "01", "Main wins jar / daily wins"],
  ["add-win", "02", "Adding or recording a win"],
  ["badges", "03", "Badges / achievements"],
  ["stats", "04", "Stats / progress"],
  ["pro", "05", "Pro / premium experience"],
] as const;

function PhoneFrame({
  id,
  number,
  label,
  children,
}: {
  id: string;
  number: string;
  label: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!frameRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(frameRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tinywins-${id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-3 flex items-baseline gap-3 px-1">
        <span className="font-display text-xs font-bold text-primary">{number}</span>
        <h2 className="text-sm font-semibold text-foreground">{label}</h2>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label={`Download ${label} as PNG`}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
        >
          <Download className="h-3 w-3" />
          {isDownloading ? "Saving…" : "PNG"}
        </button>
      </div>
      <div
        ref={frameRef}
        className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[28px] border-[6px] border-foreground/90 bg-background shadow-lifted"
      >
        <div className="flex h-7 items-center justify-between bg-card px-5 text-[10px] font-bold text-foreground">
          <span>9:41</span>
          <div className="h-2.5 w-16 rounded-full bg-foreground/90" aria-hidden="true" />
          <span>100%</span>
        </div>
        <div className="showcase-scrollbar h-[780px] overflow-y-auto bg-background">
          {children}
        </div>
      </div>
    </section>
  );
}

function MobileNav({ active }: { active: "home" | "add" | "badges" | "stats" | "profile" }) {
  const items = [
    { key: "home", icon: Home, label: "Home" },
    { key: "add", icon: PlusCircle, label: "Add" },
    { key: "badges", icon: Trophy, label: "Badges" },
    { key: "stats", icon: TrendingUp, label: "Stats" },
    { key: "profile", icon: Crown, label: "Pro" },
  ] as const;

  return (
    <div className="sticky bottom-0 z-20 mt-auto border-t-2 border-border/50 bg-card/95 px-2 py-2 backdrop-blur-lg">
      <div className="flex items-center justify-around">
        {items.map(({ key, icon: Icon, label }) => {
          const isActive = active === key;
          return (
            <div
              key={key}
              className={`flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyWinsScreen({ wins }: { wins: Win[] }) {
  const streak = calculateStreak(wins);
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="flex-1 px-4 pb-8 pt-7 text-center">
        <motion.div
          className="mb-2 flex items-center justify-center gap-2"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Tiny Wins Club</h1>
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
        <p className="mx-auto mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Celebrate the little victories that make your day brighter ✨
        </p>
        <div className="mb-2 flex justify-center">
          <StreakDisplay streak={streak} isPro />
        </div>
        <div className="-my-2 flex justify-center">
          <WinJar wins={wins.slice(0, 9)} />
        </div>
        <Button size="lg" className="h-14 rounded-full px-9 text-base shadow-lifted btn-bounce">
          <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
          Add a Tiny Win
        </Button>
        <div className="mx-auto mt-5 max-w-xs text-left">
          <BadgeDisplay wins={wins} isPro />
        </div>
      </div>
      <MobileNav active="home" />
    </div>
  );
}

function AddWinScreen() {
  const [mood, setMood] = useState("😊");
  const [text, setText] = useState("Finished the presentation I was nervous to start");
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="flex-1 px-4 pb-8 pt-7">
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">Add a Tiny Win</h1>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">What's something good that happened today?</p>
        </div>
        <div className="space-y-6">
          <div className="card-cozy bg-gradient-to-br from-amber-100/70 to-orange-100/60 p-4">
            <label className="mb-2 block text-sm font-bold text-foreground">Your tiny win</label>
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-[128px] resize-none rounded-2xl border-2 border-border/50 bg-background/80 text-base"
              maxLength={280}
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">{text.length}/280</p>
          </div>
          <div className="card-cozy p-4">
            <p className="mb-3 text-center text-sm font-medium text-foreground">
              How does this win make you feel?
            </p>
            <MoodSelector selected={mood} onSelect={setMood} />
          </div>
          <Button className="h-14 w-full rounded-full text-lg shadow-lifted btn-bounce" disabled={!text.trim()}>
            <Send className="h-5 w-5" />
            Save My Win
          </Button>
        </div>
      </div>
      <MobileNav active="add" />
    </div>
  );
}

function BadgesScreen({ wins }: { wins: Win[] }) {
  const streak = calculateStreak(wins);
  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="flex-1 px-4 pb-8 pt-7">
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5 text-celebration" />
            <h1 className="text-2xl font-display font-bold text-foreground">Badges & Streaks</h1>
            <Trophy className="h-5 w-5 text-celebration" />
          </div>
          <p className="text-sm text-muted-foreground">Collect them all!</p>
        </div>
        <div className="mb-6 rounded-3xl border-2 border-border/30 bg-gradient-to-br from-peach/50 to-celebration/20 p-6 text-center shadow-soft">
          <Flame className="mx-auto mb-2 h-8 w-8 text-primary" />
          <p className="mb-1 text-4xl font-display font-bold text-foreground">{streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
        </div>
        <div className="card-cozy mb-6 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Badge Progress</span>
            <span className="text-sm text-muted-foreground">7 / 13</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "54%" }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-celebration"
            />
          </div>
        </div>
        <div className="card-cozy p-5">
          <BadgeDisplay wins={wins} showAll isPro />
        </div>
      </div>
      <MobileNav active="badges" />
    </div>
  );
}

function StatsScreen({ wins }: { wins: Win[] }) {
  const streak = calculateStreak(wins);
  const moodCount = getMoodDistribution(wins).length;
  const stats = [
    { label: "Total Wins", value: wins.length, icon: Award, tone: "from-lavender to-lavender/50" },
    { label: "Day Streak", value: streak, icon: Flame, tone: "from-peach to-peach/50" },
    { label: "Moods", value: moodCount, icon: TrendingUp, tone: "from-mint to-mint/50" },
  ];
  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="flex-1 px-4 pb-8 pt-7">
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">Your Stats</h1>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">See how you're doing this week</p>
        </div>
        <div className="mb-5">
          <StreakDisplay streak={streak} isPro />
        </div>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`rounded-3xl border-2 border-border/20 bg-gradient-to-br ${tone} p-4 text-center shadow-soft`}>
              <Icon className="mx-auto mb-2 h-5 w-5 text-foreground/70" />
              <div className="text-xl font-bold text-foreground"><AnimatedCounter value={value} /></div>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <WeeklyStats wins={wins} />
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-lavender/30 to-mint/30 px-5 py-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Small wins create big momentum! Keep going! ✨
          </div>
        </div>
      </div>
      <MobileNav active="stats" />
    </div>
  );
}

const benefits = [
  [Sparkles, "Unlimited tiny wins", "Capture every victory, no matter how small"],
  [TrendingUp, "Progress tracking", "Visualize your journey with beautiful charts"],
  [Lightbulb, "Personalized insights", "Discover patterns in your happiness"],
] as const;

function ProScreen() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="flex-1 px-4 pb-8 pt-7">
        <div className="mb-7 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20"
          >
            <Crown className="h-10 w-10 text-amber-500" />
          </motion.div>
          <h1 className="mb-2 text-3xl font-display font-bold text-foreground">Upgrade to Tiny Wins Pro</h1>
          <p className="text-base font-medium text-muted-foreground">Your wins deserve more space</p>
        </div>
        <div className="card-cozy relative overflow-hidden p-6">
          <div className="relative">
            <div className="mb-6 flex flex-col items-center gap-1">
              <span className="text-3xl font-display font-bold text-foreground">$6/month</span>
              <span className="text-sm text-muted-foreground">≈ 780 KES • 30 days of Pro</span>
            </div>
            <div className="mb-8 space-y-4">
              {benefits.map(([Icon, title, description]) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-foreground">{title}</h3>
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="h-14 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-display font-semibold text-primary-foreground shadow-lg">
              <Crown className="h-5 w-5" />
              Unlock Pro – $6/month
            </Button>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Pay with</span>
              <span className="rounded bg-muted px-2 py-1 font-extrabold text-foreground">VISA</span>
              <span className="rounded bg-muted px-2 py-1 font-bold text-foreground">Mastercard</span>
              <span className="rounded bg-muted px-2 py-1 font-bold text-foreground">M-Pesa</span>
            </div>
          </div>
        </div>
      </div>
      <MobileNav active="profile" />
    </div>
  );
}

export default function PortfolioShowcase() {
  const wins = useMemo(createSampleWins, []);

  return (
    <main className="min-h-screen bg-muted/40 px-5 py-10 sm:px-8 lg:px-12">
      <header className="mx-auto mb-10 max-w-6xl border-b border-border pb-6">
        <p className="mb-2 text-xs font-bold uppercase text-primary">Tiny Wins Club</p>
        <h1 className="text-3xl font-display font-bold text-foreground sm:text-4xl">Product screen showcase</h1>
        <nav className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Showcase screens">
          {frameLabels.map(([id, number, label]) => (
            <a key={id} href={`#${id}`} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              {number} {label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-x-12 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
        <PhoneFrame id="daily-wins" number="01" label="Main wins jar / daily wins">
          <DailyWinsScreen wins={wins} />
        </PhoneFrame>
        <PhoneFrame id="add-win" number="02" label="Adding or recording a win">
          <AddWinScreen />
        </PhoneFrame>
        <PhoneFrame id="badges" number="03" label="Badges / achievements">
          <BadgesScreen wins={wins} />
        </PhoneFrame>
        <PhoneFrame id="stats" number="04" label="Stats / progress">
          <StatsScreen wins={wins} />
        </PhoneFrame>
        <PhoneFrame id="pro" number="05" label="Pro / premium experience">
          <ProScreen />
        </PhoneFrame>
      </div>
    </main>
  );
}