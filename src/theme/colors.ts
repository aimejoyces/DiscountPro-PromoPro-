// Stitch AI Design System - Color Palette
// Extracted from assets/src/index.css

export const colors = {
  // Surface colors
  surface: '#fbf9f8',
  surfaceDim: '#dcd9d9',
  surfaceBright: '#fbf9f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f6f3f2',
  surfaceContainer: '#f0eded',
  surfaceContainerHigh: '#eae8e7',
  surfaceContainerHighest: '#e4e2e1',

  // Text colors
  onSurface: '#1b1c1c',
  onSurfaceVariant: '#414755',

  // Outline colors
  outline: '#717786',
  outlineVariant: '#c1c6d7',

  // Primary colors
  primary: '#0058bc',
  primaryContainer: '#0070eb',
  onPrimary: '#ffffff',

  // Secondary colors
  secondary: '#016e00',
  secondaryContainer: '#7efe68',
  onSecondaryContainer: '#017500',

  // Tertiary colors
  tertiary: '#bc0000',
  tertiaryContainer: '#e41f13',
  onTertiaryContainer: '#fffbff',

  // Error colors
  error: '#ba1a1a',
  errorContainer: '#ffdad6',

  // Semantic colors
  success: '#017500',
  warning: '#ff9800',
} as const;

export type ColorKey = keyof typeof colors;
