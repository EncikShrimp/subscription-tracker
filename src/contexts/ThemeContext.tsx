import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Explicitly preserve MD3 typography by setting fonts from MD3 themes.
const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  fonts: MD3LightTheme.fonts, // Preserve MD3 typography variants
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    error: '#B00020',
    onSurface: '#000000',
    onSurfaceVariant: '#1f1f1f',
    outline: '#79747E',
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  fonts: MD3DarkTheme.fonts, // Preserve MD3 typography variants
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#1a1a1a',
    surface: '#242424',
    surfaceVariant: '#2d2d2d',
    error: '#cf6679',
    onSurface: '#ffffff',
    onSurfaceVariant: '#e1e1e1',
    outline: '#938F99',
    elevation: {
      level0: 'transparent',
      level1: '#2d2d2d',
      level2: '#323232',
      level3: '#373737',
      level4: '#3e3e3e',
      level5: '#444444',
    },
  },
};


type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof CombinedDefaultTheme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  isDarkTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: CombinedDefaultTheme,
  themeType: 'light',
  setThemeType: () => {},
  isDarkTheme: false,
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('light');

  useEffect(() => {
    loadThemeType();
  }, []);

  const loadThemeType = async () => {
    try {
      const savedThemeType = await AsyncStorage.getItem('themeType');
      if (savedThemeType) {
        setThemeType(savedThemeType as ThemeType);
      } else {
        await AsyncStorage.setItem('themeType', 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setThemeTypeAndSave = async (type: ThemeType) => {
    try {
      await AsyncStorage.setItem('themeType', type);
      setThemeType(type);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDarkTheme = themeType === 'dark' || (themeType === 'system' && colorScheme === 'dark');
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        setThemeType: setThemeTypeAndSave,
        isDarkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
