import React, { createContext, useContext, useState, useEffect } from 'react';
import themes from './themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');

  const applyTheme = (themeName) => {
    if (!themes[themeName]) {
      console.warn(`Theme ${themeName} not found, using dark`);
      themeName = 'dark';
    }

    const themeConfig = themes[themeName];
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty('--primary-bg', themeConfig.primaryBg);
    root.style.setProperty('--secondary-bg', themeConfig.secondaryBg);
    root.style.setProperty('--accent-color', themeConfig.accentColor);
    root.style.setProperty('--text-color', themeConfig.textColor);
    root.style.setProperty('--border-color', themeConfig.borderColor);
    root.style.setProperty('--hover-color', themeConfig.hoverColor);

    setCurrentTheme(themeName);
    localStorage.setItem('selectedTheme', themeName);
  };

  useEffect(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
    applyTheme(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, applyTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
