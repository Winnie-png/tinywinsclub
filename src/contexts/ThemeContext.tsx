import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getWins } from "@/lib/storage";

interface MoodTheme {
  name: string;
  bg: string;
  accent: string;
  cssVars: Record<string, string>;
}

export const moodThemes: Record<string, MoodTheme> = {
  "😊": {
    name: "sunny",
    bg: "from-amber-50 via-yellow-50 to-orange-50",
    accent: "amber",
    cssVars: {
      "--mood-bg": "45 90% 96%",
      "--mood-accent": "45 90% 65%",
    },
  },
  "🥳": {
    name: "party",
    bg: "from-pink-50 via-fuchsia-50 to-purple-50",
    accent: "pink",
    cssVars: {
      "--mood-bg": "320 70% 96%",
      "--mood-accent": "320 70% 65%",
    },
  },
  "😌": {
    name: "calm",
    bg: "from-sky-50 via-cyan-50 to-teal-50",
    accent: "sky",
    cssVars: {
      "--mood-bg": "200 70% 96%",
      "--mood-accent": "200 70% 65%",
    },
  },
  "💪": {
    name: "power",
    bg: "from-rose-50 via-red-50 to-orange-50",
    accent: "rose",
    cssVars: {
      "--mood-bg": "0 70% 96%",
      "--mood-accent": "0 70% 65%",
    },
  },
  "🌟": {
    name: "star",
    bg: "from-yellow-50 via-amber-50 to-orange-50",
    accent: "yellow",
    cssVars: {
      "--mood-bg": "50 90% 96%",
      "--mood-accent": "50 90% 65%",
    },
  },
  "🥰": {
    name: "love",
    bg: "from-pink-50 via-rose-50 to-red-50",
    accent: "pink",
    cssVars: {
      "--mood-bg": "340 70% 96%",
      "--mood-accent": "340 70% 65%",
    },
  },
};

const defaultTheme = moodThemes["😊"];

interface ThemeContextType {
  currentMood: string;
  theme: MoodTheme;
  setMood: (mood: string) => void;
  dominantMood: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState("😊");
  const [dominantMood, setDominantMood] = useState("😊");

  useEffect(() => {
    // Calculate dominant mood from wins
    const wins = getWins();
    if (wins.length > 0) {
      const moodCounts: Record<string, number> = {};
      wins.slice(0, 10).forEach((win) => {
        moodCounts[win.mood] = (moodCounts[win.mood] || 0) + 1;
      });
      const dominant = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "😊";
      setDominantMood(dominant);
      setCurrentMood(dominant);
    }
  }, []);

  const theme = moodThemes[currentMood] || defaultTheme;

  useEffect(() => {
    // Apply CSS variables to root
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        currentMood,
        theme,
        setMood: setCurrentMood,
        dominantMood,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
