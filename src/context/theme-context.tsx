import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemeName = 'light' | 'dark';
type ThemeContextValue = { themeName: ThemeName; isDark: boolean; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  useEffect(() => {
    void AsyncStorage.getItem('@petroutine:theme').then((saved) => {
      if (saved === 'dark' || saved === 'light') setThemeName(saved);
    });
  }, []);

  function toggleTheme() {
    setThemeName((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      void AsyncStorage.setItem('@petroutine:theme', next);
      return next;
    });
  }

  const value = useMemo(
    () => ({ themeName, isDark: themeName === 'dark', toggleTheme }),
    [themeName]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  return value;
}
