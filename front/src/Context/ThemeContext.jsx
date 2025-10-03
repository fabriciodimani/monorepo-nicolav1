import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

const defaultTheme = "light";

const ThemeContext = createContext({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const storedTheme = window.localStorage.getItem("theme");
    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : defaultTheme;
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("light-theme", "dark-theme");
      document.body.classList.add(`${theme}-theme`);
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove(`${theme}-theme`);
      }
    };
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
