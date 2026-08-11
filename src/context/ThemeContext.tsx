import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DARK_COLORS, LIGHT_COLORS, type AppColors } from "@/constants/theme";

interface ThemeContextValue {
  isDark: boolean;
  toggleDark: () => void;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleDark: () => setIsDark((prev) => !prev),
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Reads the active palette + the Dark Mode switch itself. Call this instead
// of importing COLORS directly from constants/theme so screens repaint when
// the user flips Dark Mode in Settings.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider (see app/_layout.tsx)");
  }
  return ctx;
}
