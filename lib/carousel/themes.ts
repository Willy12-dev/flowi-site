/**
 * Carousel themes — 4 visual variants distilled from 193 reference images.
 * See references/SYNTHESIS.md for the analysis behind these tokens.
 *
 * Used by Satori (next/og) so colors are CSS strings, fonts are loaded
 * by font name and matched in carousel/fonts.ts.
 */

export type ThemeName = "editorial-cream" | "premium-dark" | "warm-dark" | "brand-mint";

export interface Theme {
  name: ThemeName;
  bg: string;
  ink: string;
  inkSoft: string;
  muted: string;
  accent: string;
  accentSoft: string;
  rule: string;
  card: string;
  cardInk: string;
  // Optional brand bar (only used by brand-mint)
  brandBar?: string;
  // Font roles — must match names registered in fonts.ts
  fonts: {
    display: string; // serif headline
    body: string;    // sans body
    mono: string;    // monospace eyebrows + code
    italic: string;  // italic serif accent words
  };
}

export const THEMES: Record<ThemeName, Theme> = {
  "editorial-cream": {
    name: "editorial-cream",
    bg: "#F5F0E5",
    ink: "#1A1815",
    inkSoft: "#3A3633",
    muted: "#8C8479",
    accent: "#C8252D",
    accentSoft: "#E8826A",
    rule: "#D9D2C2",
    card: "#FFFFFF",
    cardInk: "#1A1815",
    fonts: {
      display: "Fraunces",
      body: "Inter",
      mono: "JetBrainsMono",
      italic: "FrauncesItalic",
    },
  },
  "premium-dark": {
    name: "premium-dark",
    bg: "#0B0B0B",
    ink: "#F2EFE8",
    inkSoft: "#C8C5BE",
    muted: "#6B6B6B",
    accent: "#FF6B3D",
    accentSoft: "#FFA47E",
    rule: "#1F1F1F",
    card: "#161616",
    cardInk: "#F2EFE8",
    fonts: {
      display: "Fraunces",
      body: "Inter",
      mono: "JetBrainsMono",
      italic: "FrauncesItalic",
    },
  },
  "warm-dark": {
    name: "warm-dark",
    bg: "#1F1812",
    ink: "#F4E8D9",
    inkSoft: "#D9C9B5",
    muted: "#8C7A66",
    accent: "#E89B5C",
    accentSoft: "#F0BC8B",
    rule: "#2F2620",
    card: "#2A201A",
    cardInk: "#F4E8D9",
    fonts: {
      display: "Fraunces",
      body: "Inter",
      mono: "JetBrainsMono",
      italic: "FrauncesItalic",
    },
  },
  "brand-mint": {
    name: "brand-mint",
    bg: "#F5F0E5",
    ink: "#1A1815",
    inkSoft: "#3A3633",
    muted: "#8C8479",
    accent: "#C8252D",
    accentSoft: "#E8826A",
    rule: "#D9D2C2",
    card: "#FFFFFF",
    cardInk: "#1A1815",
    brandBar: "#B8E0C8",
    fonts: {
      display: "Fraunces",
      body: "Inter",
      mono: "JetBrainsMono",
      italic: "FrauncesItalic",
    },
  },
};

/** Default theme per content vertical. */
export function themeForVertical(
  vertical: "ai_general" | "ai_builder" | "ai_trading" | "ai_behavior"
): ThemeName {
  switch (vertical) {
    case "ai_trading":
      return "premium-dark";
    case "ai_behavior":
      return "editorial-cream";
    case "ai_builder":
      return "editorial-cream";
    default:
      return "editorial-cream";
  }
}
