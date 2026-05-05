import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadow } from './spacing';

export { colors, typography, spacing, borderRadius, shadow };

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadow,
} as const;

export type Theme = typeof theme;
