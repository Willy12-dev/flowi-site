import * as React from "react";

/**
 * Shared tokens + brand mark for the prompt-pack carousel format.
 *
 * The prompt-pack format is a self-contained visual system (it does NOT use
 * the deck `Frame`): warm cream paper, one warm-orange accent, Fraunces
 * display serif, an 8-point starburst brand mark. Distilled from the user's
 * reference carousel.
 */

export const PP = {
  paper: "#F7F2E9",
  ink: "#26201A",
  inkSoft: "#574E43",
  orange: "#E0673C",
  muted: "#A89F8E",
  card: "#FFFFFF",
  cardBorder: "#EBE4D6",
  pill: "#FFFFFF",
  dotRed: "#ED6A5A",
  dotYellow: "#F4BE4F",
  dotGreen: "#5FBE5B",
  serif: "Fraunces",
  sans: "Inter",
  mono: "JetBrainsMono",
} as const;

/** Promote a root-relative /images path to an absolute URL Satori can fetch. */
export function abs(src: string): string {
  return src.startsWith("/") ? `https://useflowi.app${src}` : src;
}

export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * 8-point starburst — the prompt-pack brand mark. Composed from four rotated
 * rounded bars (Satori-safe: no SVG, no clip-path).
 */
export function Starburst({
  size = 64,
  color = PP.orange,
  thickness,
}: {
  size?: number;
  color?: string;
  thickness?: number;
}) {
  const barH = thickness ?? Math.max(3, Math.round(size * 0.075));
  const bar = (rot: number): React.CSSProperties => ({
    position: "absolute",
    top: (size - barH) / 2,
    left: 0,
    width: size,
    height: barH,
    borderRadius: 999,
    backgroundColor: color,
    transform: `rotate(${rot}deg)`,
  });
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <div style={bar(0)} />
      <div style={bar(45)} />
      <div style={bar(90)} />
      <div style={bar(135)} />
    </div>
  );
}
