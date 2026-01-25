export interface Win {
  id: string;
  text: string;
  mood: string;
  createdAt: string;
}

const STORAGE_KEY = 'tiny-wins-club';

export const getWins = (): Win[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveWin = (win: Omit<Win, 'id' | 'createdAt'>): Win => {
  const wins = getWins();
  const newWin: Win = {
    ...win,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  wins.unshift(newWin);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
  return newWin;
};

export const deleteWin = (id: string): void => {
  const wins = getWins().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
};

export const clearAllWins = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
