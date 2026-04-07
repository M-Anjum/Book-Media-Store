// src/styles/theme.ts
export const BookeaPalette = {
  orange: "#E8520A",
  orangeHover: "#C94409",
  orangeLight: "#FDE8DF",
  black: "#111111",
  white: "#FFFFFF",
  bg: "#F5F5F0",
  text: "#333333",
  textMuted: "#666666",
  border: "#E5E5E5",
} as const;

export type BookeaColor = keyof typeof BookeaPalette;
