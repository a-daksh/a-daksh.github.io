import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/*
 * Light/dark theme state.
 *
 * The colours themselves are CSS variables in src/styles/GlobalStyle.js, keyed off
 * <html data-theme="light|dark">. gatsby-ssr.js sets that attribute from the saved preference
 * before the page paints, so there is no flash; this context only mirrors and flips it.
 */

export const THEME_STORAGE_KEY = 'theme';

const ThemeContext = createContext(null);

// Storage can throw (blocked cookies/site data, some in-app browsers): never let that break the page.
const saveTheme = theme => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    // Preference just won't persist.
  }
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Server render and first client render are always "dark" so hydration matches; the effect below
  // then syncs with whatever gatsby-ssr.js already applied to <html>.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme !== 'light');
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    saveTheme(next);
    setIsDark(!isDark);
  };

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
