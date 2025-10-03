import React, { createContext, useEffect, useMemo, useState } from "react";

const DEFAULT_THEME = "light";
const THEME_CLASSES = {
  light: "theme-light",
  dark: "theme-dark",
};

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_THEME;
    }

    const storedTheme = window.localStorage.getItem("app-theme");
    return storedTheme && Object.keys(THEME_CLASSES).includes(storedTheme)
      ? storedTheme
      : DEFAULT_THEME;
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const bodyClassList = document.body.classList;
    const themeClass = THEME_CLASSES[theme] || THEME_CLASSES[DEFAULT_THEME];

    Object.values(THEME_CLASSES).forEach((className) => {
      if (className) {
        bodyClassList.remove(className);
      }
    });

    if (themeClass) {
      bodyClassList.add(themeClass);
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("app-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
