import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_THEME = "light";
const STORAGE_KEY = "app-theme";

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
});

const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return storedTheme || DEFAULT_THEME;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const className = `theme-${theme}`;
    const body = document.body;

    body.classList.remove("theme-light", "theme-dark");
    body.classList.add(className);

    return () => {
      body.classList.remove(className);
    };
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
