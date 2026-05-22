/**
 * Shared tokens for the "noir" carousel format — a dark, moody, premium
 * typographic system for emotional / psychology-driven carousels. Warm
 * near-black paper, heavy Inter display type, a single orange accent.
 * Self-contained: does NOT use the deck Frame or the white "method" palette.
 */

export const N = {
  bg: "#1A1814",
  panel: "#23201B",
  ink: "#F6F3EC",
  inkSoft: "#B7AFA2",
  muted: "#8E867A",
  orange: "#F06A38",
  line: "#322E27",
  sans: "Inter",
  mono: "JetBrainsMono",
} as const;

/** Resolve a run's accent keyword to a hex colour. */
export function noirColor(accent?: "orange"): string {
  return accent === "orange" ? N.orange : N.ink;
}
