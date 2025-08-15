import React, { createContext, useContext, useState, useEffect } from 'react';
import bgBlack from '../images/bg_black.jpg';
import bgWhite from '../images/bg_white.jpg';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update CSS custom properties
    const root = document.documentElement;

    if (isDark) {
      // Dark theme colors
      root.style.setProperty('--color-bg-primary', '#1E201E');
      root.style.setProperty('--color-bg-primary-rgb', '30, 32, 30');
      root.style.setProperty('--color-bg-secondary', '#ECDFCC');
      root.style.setProperty('--color-bg-tertiary', '#ECDFCC');
      root.style.setProperty('--color-accent', '#fff');
      root.style.setProperty('--color-accent-tint', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--color-text-primary', '#fff');
      root.style.setProperty('--color-text-secondary', '#ECDFCC');
      root.style.setProperty('--color-text-tertiary', '#ECDFCC');
      root.style.setProperty('--color-text-inverse', '#1E201E');
      root.style.setProperty('--bg-image-url', `url(${bgBlack})`);
      root.style.setProperty('--bg-overlay', 'rgba(30, 32, 30, 0.8)');
    } else {
      // Light theme colors (inverted)
      root.style.setProperty('--color-bg-primary', '#ECDFCC');
      root.style.setProperty('--color-bg-primary-rgb', '236, 223, 204');
      root.style.setProperty('--color-bg-secondary', '#1E201E');
      root.style.setProperty('--color-bg-tertiary', '#1E201E');
      root.style.setProperty('--color-accent', '#1E201E');
      root.style.setProperty('--color-accent-tint', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--color-text-primary', '#1E201E');
      root.style.setProperty('--color-text-secondary', '#323232');
      root.style.setProperty('--color-text-tertiary', '#323232');
      root.style.setProperty('--color-text-inverse', '#ECDFCC');
      root.style.setProperty('--bg-image-url', `url(${bgWhite})`);
      root.style.setProperty('--bg-overlay', 'rgba(236, 223, 204, 0.8)');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};