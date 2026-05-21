import * as React from "react";

/**
 * Shared tokens + marks for the "method" carousel format.
 *
 * The method format is the white / bold-sans / Claude-orange + Higgsfield-green
 * system distilled from the user's reference set 2: clean white paper, heavy
 * Inter display type, green checkmark bullets, light-green callouts, a 4-point
 * sparkle. Self-contained — does NOT use the deck `Frame`.
 */

export const MM = {
  paper: "#FFFFFF",
  ink: "#171513",
  inkSoft: "#5C574E",
  orange: "#E2592B",
  green: "#83BE3B",
  greenInk: "#5E8F22",
  tintGreen: "#F0F6E2",
  tintOrange: "#FBE9E0",
  muted: "#A39C8E",
  line: "#ECE9E2",
  sans: "Inter",
  mono: "JetBrainsMono",
} as const;

/** Resolve a run's accent keyword to a hex colour. */
export function runColor(accent: "orange" | "green" | undefined): string {
  if (accent === "orange") return MM.orange;
  if (accent === "green") return MM.green;
  return MM.ink;
}

/** Promote a root-relative /images path to an absolute URL Satori can fetch. */
export function mabs(src: string): string {
  return src.startsWith("/") ? `https://useflowi.app${src}` : src;
}

export function mpad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** 4-point sparkle — two crossed rounded bars. */
export function Sparkle({
  size = 30,
  color = MM.green,
}: {
  size?: number;
  color?: string;
}) {
  const t = Math.max(3, Math.round(size * 0.17));
  const bar = (vertical: boolean): React.CSSProperties => ({
    position: "absolute",
    top: vertical ? 0 : (size - t) / 2,
    left: vertical ? (size - t) / 2 : 0,
    width: vertical ? t : size,
    height: vertical ? size : t,
    borderRadius: 999,
    backgroundColor: color,
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
      <div style={bar(true)} />
      <div style={bar(false)} />
    </div>
  );
}

/** Green circle with a white checkmark (composed from a border corner). */
export function Check({ d = 32 }: { d?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: d,
        height: d,
        borderRadius: 999,
        backgroundColor: MM.green,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: Math.round(d * 0.28),
          height: Math.round(d * 0.46),
          borderStyle: "solid",
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: Math.max(3, Math.round(d * 0.13)),
          borderBottomWidth: Math.max(3, Math.round(d * 0.13)),
          borderColor: "#FFFFFF",
          transform: "rotate(45deg)",
          marginTop: -Math.round(d * 0.06),
        }}
      />
    </div>
  );
}
