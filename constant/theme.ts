export const colors = {
  background: "#fff9e3",
  foreground: "#ffffff",
  card: "#fff8e7",
  muted: "#f6eecf",
  mutedForeground: "rgba(0, 0, 0, 0.6)",
  primary: "#07031A",
  accent: "#ea7a53",
  border: "rgba(0, 0, 0, 0.1)",
  success: "#16a34a",
  destructive: "#dc2626",
  subscription: "#8fd1bd",
  shadow: "#000",
  black: "#000000",
  primaryLight: "#EFF6FF",
  surface: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  warning: "#F59E0B",
} as const;

export const lightColors = {
  primary: colors.primary,
  primaryLight: colors.primaryLight,
  surface: colors.surface,
  background: colors.surface,
  border: colors.border,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  danger: colors.danger,
  dangerLight: colors.dangerLight,
  success: colors.success,
  warning: colors.warning,
};

export const darkColors = {
  primary: "#93C5FD",
  primaryLight: "rgba(59, 130, 246, 0.15)",
  surface: "#1C1C1E",
  background: "#000000",
  border: "#2C2C2E",
  textPrimary: "#F5F5F7",
  textSecondary: "#AEAEB2",
  textMuted: "#8E8E93",
  danger: "#FF6B6B",
  dangerLight: "rgba(255, 107, 107, 0.15)",
  success: "#34D399",
  warning: "#FBBF24",
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[16],

    radius: spacing[10], // was spacing[8] — rounder bar
    iconFrame: spacing[14], // was spacing[12] — bigger icon frame
    itemPaddingVertical: spacing[2],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
