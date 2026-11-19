import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemeName = 'light' | 'dark';
export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryPressed: string;
  primaryText: string;
  error: string;
  success: string;
};
type ThemeContextValue = { themeName: ThemeName; isDark: boolean; colors: ThemeColors; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

const lightColors: ThemeColors = {
  background: '#FEF7EE',
  surface: '#FFFFFF',
  surfaceMuted: '#EDF2F4',
  text: '#263238',
  textMuted: '#607D8B',
  border: '#CBD5DA',
  primary: '#B84E16',
  primaryPressed: '#934015',
  primaryText: '#FFFFFF',
  error: '#B42318',
  success: '#2E7D32',
};

const darkColors: ThemeColors = {
  background: '#17212B',
  surface: '#263643',
  surfaceMuted: '#344957',
  text: '#F7FAFC',
  textMuted: '#C1CDD4',
  border: '#607D8B',
  primary: '#FFAB76',
  primaryPressed: '#D98A57',
  primaryText: '#17212B',
  error: '#FFB4AB',
  success: '#A5D6A7',
};

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
    () => ({
      themeName,
      isDark: themeName === 'dark',
      colors: themeName === 'dark' ? darkColors : lightColors,
      toggleTheme,
    }),
    [themeName]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  return value;
}
