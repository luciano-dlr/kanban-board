'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-10 h-10 rounded-full
        flex items-center justify-center
        bg-violet-100 dark:bg-violet-900/30
        hover:bg-violet-200 dark:hover:bg-violet-800/40
        text-violet-700 dark:text-violet-300
        transition-all duration-200
        hover:scale-105 active:scale-95
        shadow-sm hover:shadow-md
      "
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-5 w-5 transition-transform duration-300 dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 transition-transform duration-300 -rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
