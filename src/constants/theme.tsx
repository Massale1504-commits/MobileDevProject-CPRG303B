// Design tokens derived from DESIGN.md. This is the single source of
// truth for color/spacing/radius/type so every screen stays in sync with
// the design system instead of re-declaring hex values locally.

export const LIGHT_COLORS = {
  surface: "#f8f9fa",
  surfaceDim: "#d9dadb",
  surfaceBright: "#f8f9fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f4f5",
  surfaceContainer: "#edeeef",
  surfaceContainerHigh: "#e7e8e9",
  surfaceContainerHighest: "#e1e3e4",
  onSurface: "#191c1d",
  onSurfaceVariant: "#414752",
  inverseSurface: "#2e3132",
  inverseOnSurface: "#f0f1f2",
  outline: "#717783",
  outlineVariant: "#c1c6d4",
  surfaceTint: "#005faf",
  primary: "#005dac",
  onPrimary: "#ffffff",
  primaryContainer: "#1976d2",
  onPrimaryContainer: "#fffdff",
  inversePrimary: "#a5c8ff",
  secondary: "#1b6d24",
  onSecondary: "#ffffff",
  secondaryContainer: "#a0f399",
  onSecondaryContainer: "#217128",
  tertiary: "#845100",
  onTertiary: "#ffffff",
  tertiaryContainer: "#a66700",
  onTertiaryContainer: "#fffdff",
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  background: "#f8f9fa",
  onBackground: "#191c1d",
  surfaceVariant: "#e1e3e4",
} 

// Dark variant of the same token set same semantic slots, so any
// component that reads COLORS.primary / COLORS.background etc. works
// unchanged regardless of which palette is active.
export const DARK_COLORS: typeof LIGHT_COLORS = {
  surface: "#191c1d",
  surfaceDim: "#101415",
  surfaceBright: "#363a3b",
  surfaceContainerLowest: "#0b0f10",
  surfaceContainerLow: "#191c1d",
  surfaceContainer: "#1d2021",
  surfaceContainerHigh: "#282b2c",
  surfaceContainerHighest: "#333637",
  onSurface: "#e1e3e4",
  onSurfaceVariant: "#c1c6d4",
  inverseSurface: "#e1e3e4",
  inverseOnSurface: "#2e3132",
  outline: "#8b929e",
  outlineVariant: "#414752",
  surfaceTint: "#a5c8ff",
  primary: "#a5c8ff",
  onPrimary: "#003259",
  primaryContainer: "#1976d2",
  onPrimaryContainer: "#ffffff",
  inversePrimary: "#005dac",
  secondary: "#85d980",
  onSecondary: "#00390a",
  secondaryContainer: "#1b6d24",
  onSecondaryContainer: "#d7ffce",
  tertiary: "#ffb951",
  onTertiary: "#452b00",
  tertiaryContainer: "#845100",
  onTertiaryContainer: "#ffddb5",
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",
  background: "#191c1d",
  onBackground: "#e1e3e4",
  surfaceVariant: "#414752",
};

export type AppColors = typeof LIGHT_COLORS;

// Back-compat: anything that still wants a static palette gets light mode.
// Prefer `useTheme().colors` from context/ThemeContext for anything that
// should react to the Dark Mode setting in Settings.
export const COLORS = LIGHT_COLORS;

export const SPACING = {
  base: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  calculatorGap: 12,
  containerPadding: 16,
} as const;

export const RADIUS = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Maps to the `typography` block in DESIGN.md. Requires Inter + JetBrains
// Mono to be loaded once in the root layout (see app/_layout.tsx) if
// fonts haven't loaded yet, these fontFamily names just fall back to the
// platform default, so nothing breaks if you skip that step.
export const TYPOGRAPHY = {
  displayLgMobile: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 45,
    lineHeight: 52,
  },
  headlineMd: {
    fontFamily: "Inter_500Medium",
    fontSize: 28,
    lineHeight: 36,
  },
  titleLg: {
    fontFamily: "Inter_500Medium",
    fontSize: 22,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
} as const;
