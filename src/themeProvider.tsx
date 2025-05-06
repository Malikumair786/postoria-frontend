"use client";

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@/lib/store';
import { RootState, AppDispatch } from './store/store';
import { setTheme } from './store/themeSlice';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    applyTheme(currentTheme);

    if (currentTheme === 'system') {
      const listener = (e: MediaQueryListEvent) =>
        applyTheme(e.matches ? 'dark' : 'light');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', listener);

      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [currentTheme]);

  return <>{children}</>;
}