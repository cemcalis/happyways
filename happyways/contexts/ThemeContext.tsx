import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  themeOptions: { label: string; value: ThemeMode }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');

  const themeOptions = [
    { label: 'Açık', value: 'light' as ThemeMode },
    { label: 'Koyu', value: 'dark' as ThemeMode },
    { label: 'Sistem', value: 'system' as ThemeMode },
  ];

  // Hangi tema aktif olacağını belirle
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // AsyncStorage'dan tema yükle
  useEffect(() => {
    loadTheme();
  }, []);

  // Tema değiştiğinde hiçbir şey yapmayalım, sadece state tutalım
  useEffect(() => {
    console.log('Theme changed:', theme, 'isDark:', isDark);
  }, [theme, isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Theme yüklenirken hata:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Theme kaydedilirken hata:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    themeOptions
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
