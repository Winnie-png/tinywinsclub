export const affirmations = [
  "You're doing amazing! Every small step counts. 🌟",
  "Look at you, celebrating the little things! That's real wisdom. 🌈",
  "This tiny win is part of something big. Keep going! 🌻",
  "You noticed something good today. That's a superpower! ✨",
  "Every win, no matter how small, is worth celebrating! 🎉",
  "You're building something beautiful, one tiny win at a time. 🌸",
  "Progress isn't always big leaps—it's these precious moments! 💫",
  "Your jar is filling up with joy. How wonderful! 🍯",
  "You showed up today, and that's already a win! 🌺",
  "Small wins today, big smiles tomorrow! 😊",
  "You're collecting moments of magic. Keep it up! ⭐",
  "This win matters. YOU matter. Never forget that! 💝",
];

export const getRandomAffirmation = (): string => {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};
