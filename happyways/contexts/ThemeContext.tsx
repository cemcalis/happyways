import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

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
  const {t} = useTranslation('common');
  // Language support
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  const themeOptions = language === 'en'
    ? [
        { label: 'Light', value: 'light' as ThemeMode },
        { label: 'Dark', value: 'dark' as ThemeMode },
        { label: 'System', value: 'system' as ThemeMode },
      ]
    : [
        { label: t("light"), value: 'light' as ThemeMode },
        { label: t("dark"), value: 'dark' as ThemeMode },
        { label: t("system"), value: 'system' as ThemeMode },
      ];


  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
    loadLanguage();
  }, []);


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
      console.error(language === 'en' ? 'Error loading theme:' : 'Theme yüklenirken hata:', error);
    }
  };

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang && ['tr', 'en'].includes(savedLang)) {
        setLanguage(savedLang as 'tr' | 'en');
      }
    } catch (error) {
      console.error(language === 'en' ? 'Error loading language:' : 'Dil yüklenirken hata:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error(language === 'en' ? 'Error saving theme:' : 'Theme kaydedilirken hata:', error);
    }
  };

  const setLanguageAsync = async (lang: 'tr' | 'en') => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error(language === 'en' ? 'Error saving language:' : 'Dil kaydedilirken hata:', error);
    }
  };

  const value: ThemeContextType & { language: 'tr' | 'en'; setLanguage: (lang: 'tr' | 'en') => void } = {
    theme,
    isDark,
    setTheme,
    themeOptions,
    language,
    setLanguage: setLanguageAsync
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
