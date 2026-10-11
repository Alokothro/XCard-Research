import React, { createContext, useContext, useState, useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  lightColors,
  darkColors,
  lightCategoryColors,
  darkCategoryColors,
  ThemeColors,
  ThemeMode,
} from "./theme";

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  categoryColors: Record<string, string>;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === "light" ? "light" : "dark");

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: mode === "light" ? lightColors : darkColors,
      categoryColors: mode === "light" ? lightCategoryColors : darkCategoryColors,
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
