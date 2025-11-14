import { useCallback, useEffect, useState } from 'react';

// Centralized theme hook for light/dark persistence and toggling
export function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ra_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    // Add transition class for smooth theme fade if user doesn't prefer reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      root.classList.add('theme-fade');
      // Remove after a short delay to avoid affecting subsequent non-theme transitions
      const t = window.setTimeout(() => root.classList.remove('theme-fade'), 450);
      return () => window.clearTimeout(t);
    }
  }, [dark]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('ra_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ra_theme', 'light');
    }
  }, [dark]);

  const toggle = useCallback(() => setDark(d => !d), []);
  const setMode = useCallback((mode: 'light' | 'dark') => setDark(mode === 'dark'), []);

  return { dark, toggle, setMode };
}
