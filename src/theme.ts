// Exact tokens from the StoneCap wiki's Color-Scheme.md — both themes.

export const lightColors = {
  background: "#F1EEE4",
  surface: "#FFFFFF",
  surfaceAlt: "#E7E1D2",
  border: "#D8D0BC",
  borderStrong: "#C4B99C",
  textPrimary: "#0B0A08",
  textSecondary: "#6B655D",
  textMuted: "#6B655D",
  bronze: "#A97B45",
  bronzeStrong: "#8B5F2E",
  good: "#256B3E",
  warning: "#8F5C08",
  critical: "#B33434",
  cardFace: "#15110c",
  cardNeutral: "#B9B0A2",
};

export const darkColors = {
  background: "#0B0A08",
  surface: "#171310",
  surfaceAlt: "#201A14",
  border: "#2E2A22",
  borderStrong: "#3D362A",
  textPrimary: "#F2EDE4",
  textSecondary: "#B9B0A2",
  textMuted: "#82786A",
  bronze: "#E0B36E",
  bronzeStrong: "#C6913C",
  good: "#3FB558",
  warning: "#E0A83E",
  critical: "#C43B3B",
  cardFace: "#15110c",
  cardNeutral: "#B9B0A2",
};

export const lightCategoryColors = {
  Travel: "#1B53C4",
  Dining: "#DC5F80",
  Groceries: "#009333",
  Gas: "#6B6000",
  Drugstores: "#0091AF",
  Streaming: "#9B71F1",
  "Online Shopping": "#953466",
  Other: "#6B655D",
};

export const darkCategoryColors = {
  Travel: "#468BFE",
  Dining: "#DC5F80",
  Groceries: "#4DA823",
  Gas: "#686800",
  Drugstores: "#00A8AB",
  Streaming: "#6347C4",
  "Online Shopping": "#974263",
  Other: "#B9B0A2",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export type ThemeColors = typeof lightColors;
export type ThemeMode = "light" | "dark";
