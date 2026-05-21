/**
 * Article-page CTA funnels.
 *
 * The flowi-site is a three-vertical publisher. Each vertical funnels to a
 * different conversion target:
 *
 *   ai_trading     → FlowiAI Trader   (algo trading, AI in markets, automation)
 *   ai_behavior    → Woyuduin         (habit, focus, discipline, behavioral AI)
 *   everything else → Books           (the AI Business product line)
 *
 * Update the `href` fields below when the public URLs are ready.
 */

export interface ArticleCTA {
  eyebrow: string;
  title: string;
  titleHref: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondary: { prefix: string; label: string; href: string };
  external: boolean;
}

export const FUNNELS: Record<string, ArticleCTA> = {
  ai_trading: {
    eyebrow: "Want to trade with this kind of system?",
    title: "FlowiAI Trader — institutional-grade algo trading.",
    titleHref: "https://useflowi.app/trader", // TODO: swap for live FlowiAI Trader URL
    body:
      "ICT methodology + multi-agent risk + 5 trading modes. Forex, crypto, stocks, indices. Built on the patterns this article describes.",
    primaryLabel: "Get on the FlowiAI Trader launch list →",
    primaryHref: "https://useflowi.app/trader",
    secondary: {
      prefix: "or grab",
      label: "the 4-essay playbook (PDF, $9)",
      href: "https://flowi.gumroad.com/l/algo-traders-playbook-v1",
    },
    external: true,
  },

  ai_behavior: {
    eyebrow: "Building habits that actually stick?",
    title: "Woyuduin — AI-assisted accountability.",
    titleHref: "https://woyuduin.com",
    body:
      "Track the patterns, get nudges that fire when they matter, recover fast when you slip. The behavioral system this article points toward — built.",
    primaryLabel: "Try Woyuduin →",
    primaryHref: "https://woyuduin.com",
    secondary: {
      prefix: "or grab",
      label: "the 4-essay playbook (PDF, $9)",
      href: "https://flowi.gumroad.com/l/behavior-change-playbook",
    },
    external: true,
  },
};

export const DEFAULT_CTA: ArticleCTA = {
  eyebrow: "If this was useful",
  title: "Agent Memory: The 5 Patterns That Ship in Production",
  titleHref: "https://flowi.gumroad.com/l/sqqhvm",
  body:
    "The decision tree, the code, and the failure modes nobody warns you about. 5 chapters · ~4,500 words · code that runs.",
  primaryLabel: "Read it — $19 →",
  primaryHref: "https://flowi.gumroad.com/l/sqqhvm",
  secondary: {
    prefix: "or grab",
    label: "the field guide (PDF, $9)",
    href: "https://flowi.gumroad.com/l/ai-builders-field-guide-v1",
  },
  external: true,
};

export function getCTAForCategory(category: string | undefined): ArticleCTA {
  if (!category) return DEFAULT_CTA;
  return FUNNELS[category] ?? DEFAULT_CTA;
}
