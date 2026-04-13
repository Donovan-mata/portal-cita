import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeOption = 'light' | 'dark';

interface ThemeState {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

const getInitialTheme = (): ThemeOption => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
