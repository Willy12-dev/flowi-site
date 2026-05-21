/**
 * Carousel spec schema — the JSON contract between the generator and consumers.
 *
 * A CarouselSpec describes a whole carousel (1–9 slides).
 * Each slide picks a template type and supplies the fields that template needs.
 * The render route converts a Slide to a PNG; the zip route returns all slides.
 */

import type { ThemeName } from "./themes";

export type Vertical = "ai_general" | "ai_builder" | "ai_trading" | "ai_behavior";

/** Top-level: the whole carousel. */
export interface CarouselSpec {
  /** Used as folder name in output/. */
  id: string;
  /** Editorial-only — never rendered onto the image. */
  title: string;
  vertical: Vertical;
  /**
   * Optional topic identifier (e.g. "claude", "midjourney", "trading_automation").
   * Matched against `content/courses.json` to pick the primary funnel.
   * Falls back to the vertical's default course if unmatched.
   */
  topic?: string;
  /** Override the per-vertical default theme. */
  theme?: ThemeName;
  /** Shown on every slide bottom-center. Include the @. */
  handle: string;
  /** 1–9 slides. */
  slides: Slide[];
  /** Optional: the call-to-action keyword promoted in the carousel. */
  cta?: { keyword: string; promise: string };
  /** Optional caption + hashtags for the post itself (not rendered on the image). */
  caption?: string;
  hashtags?: string[];
}

export type Slide =
  | CoverSlide
  | CodeBlockSlide
  | NumberedCardSlide
  | DataTableSlide
  | GridSlide
  | StatPosterSlide
  | DiagramSlide
  | QuoteSlide
  | LetterSlide
  | CtaOutroSlide
  // Round 2 — the rest of the format library
  | BulletsSlide
  | DefinitionSlide
  | StepSlide
  | StatsSlide
  | AudienceSlide
  | CompareSlide
  | HighlightCoverSlide
  | PromptCardSlide
  | BadgeSlide
  | FakeTweetSlide
  | PhotoFrameSlide
  | ResultsPosterSlide
  | StorytellingSlide
  | PromptPackCoverSlide
  | PromptPackCardSlide
  | PromptPackCtaSlide;

interface SlideBase {
  /** 1-indexed position. */
  index: number;
  /** Total slides in the carousel. */
  total: number;
}

/** 1 — COVER. Hook slide. */
export interface CoverSlide extends SlideBase {
  type: "cover";
  eyebrow?: string;
  /** Headline split: text before italic + italic word + text after italic. */
  headline: string;
  italicWord?: string;
  headlineAfter?: string;
  /** Sub-headline beneath the main hook. */
  sub?: string;
}

/** 2 — CODE_BLOCK. Snippet on a card. */
export interface CodeBlockSlide extends SlideBase {
  type: "code";
  eyebrow?: string;
  title: string;
  language?: string;
  code: string;
  caption?: string;
}

/** 3 — NUMBERED_CARD. Mid-carousel body. */
export interface NumberedCardSlide extends SlideBase {
  type: "numbered";
  number: string; // "01" / "08" — caller controls formatting
  title: string;
  body: string;
}

/** 4 — DATA_TABLE. Index | Label | Metric. */
export interface DataTableSlide extends SlideBase {
  type: "table";
  eyebrow?: string;
  title: string;
  italicWord?: string;
  columns: { label: string; metric: string };
  rows: Array<{ index: string; label: string; metric: string }>;
  footer?: string;
}

/** 5 — GRID. N-up numbered cards on one slide. */
export interface GridSlide extends SlideBase {
  type: "grid";
  title: string;
  italicWord?: string;
  cards: Array<{ number: string; title: string; body?: string }>;
  cols?: 2 | 3 | 4;
}

/** 6 — STAT_POSTER. Big number + supporting copy. */
export interface StatPosterSlide extends SlideBase {
  type: "stat";
  eyebrow?: string;
  preStat?: string;
  stat: string;
  postStat?: string;
  body?: string;
}

/** 7 — DIAGRAM. Tree/flowchart. */
export interface DiagramSlide extends SlideBase {
  type: "diagram";
  title: string;
  italicWord?: string;
  /** Two-tier structure rendered as 2 columns of children. */
  tiers: Array<{
    label: string;
    nodes: Array<{ title: string; sub?: string }>;
  }>;
  footer?: string;
}

/** 8 — QUOTE. Single italic serif poster. */
export interface QuoteSlide extends SlideBase {
  type: "quote";
  quote: string;
  attribution?: string;
}

/** 9 — LETTER. "Dear X" italic body. */
export interface LetterSlide extends SlideBase {
  type: "letter";
  salutation: string; // "Dear new trader,"
  body: string;
  signoff?: string;  // "— Flowi"
}

/** 10 — CTA_OUTRO. Final slide. */
export interface CtaOutroSlide extends SlideBase {
  type: "cta";
  hook: string;
  italicWord?: string;
  hookAfter?: string;
  sub?: string;
  ctaKeyword: string;     // "BUILD"
  ctaPromise: string;     // "for the full list"
}

/** 11 — BULLETS. Simple vertical list slide. */
export interface BulletsSlide extends SlideBase {
  type: "bullets";
  eyebrow?: string;
  title: string;
  italicWord?: string;
  bullets: string[];
  footer?: string;
}

/** 12 — DEFINITION. Term + body definition. */
export interface DefinitionSlide extends SlideBase {
  type: "definition";
  eyebrow?: string;
  term: string;
  partOfSpeech?: string; // "noun.", "verb.", "framework."
  definition: string;
  example?: string;
}

/** 13 — STEP. Large step number + tight body — for step-by-step decks. */
export interface StepSlide extends SlideBase {
  type: "step";
  stepNumber: string; // "01" / "08"
  stepLabel?: string; // "STEP" — defaults visible
  title: string;
  body: string;
}

/** 14 — STATS. Multiple inline stats with labels. */
export interface StatsSlide extends SlideBase {
  type: "stats";
  eyebrow?: string;
  title: string;
  italicWord?: string;
  stats: Array<{ value: string; label: string }>;
  footer?: string;
}

/** 15 — AUDIENCE. "Who wins with this?" targeting card. */
export interface AudienceSlide extends SlideBase {
  type: "audience";
  title: string;
  italicWord?: string;
  audiences: Array<{ pill: string; body: string }>;
}

/** 16 — COMPARE. Side-by-side before / after card. */
export interface CompareSlide extends SlideBase {
  type: "compare";
  title: string;
  italicWord?: string;
  left: { label: string; items: string[] };
  right: { label: string; items: string[] };
}

/** 17 — HIGHLIGHT_COVER. Bold condensed cover with rectangular accent highlight. */
export interface HighlightCoverSlide extends SlideBase {
  type: "highlight-cover";
  eyebrow?: string;
  /** Text that gets the highlight rectangle. */
  highlightedHook: string;
  /** Text rendered un-highlighted, on a separate line. */
  followUp?: string;
  sub?: string;
}

/** 18 — PROMPT_CARD. Italic serif intro + chat-input mockup with slash commands. */
export interface PromptCardSlide extends SlideBase {
  type: "prompt-card";
  eyebrow?: string;
  title: string;
  italicWord?: string;
  intro?: string;
  inputPlaceholder: string;
  commands: Array<{ slash: string; label: string }>;
}

/** 19 — BADGE. Skill / curriculum grid using pill badges. */
export interface BadgeSlide extends SlideBase {
  type: "badge";
  eyebrow?: string;
  title: string;
  italicWord?: string;
  badges: Array<{ label: string; sub?: string }>;
}

/** 20 — FAKE_TWEET. Simulated tweet/post card for hook slides. */
export interface FakeTweetSlide extends SlideBase {
  type: "fake-tweet";
  author: string;
  handle: string;
  body: string;
  timestamp?: string;
  /** Optional reactions row */
  likes?: string;
  reposts?: string;
}

/** 21 — PHOTO_FRAME. Photo background with overlay text. */
export interface PhotoFrameSlide extends SlideBase {
  type: "photo-frame";
  /**
   * Full-bleed background image URL. Absolute (https://) or root-relative
   * (/images/...) — both work since Satori fetches the image at render time.
   * If absent, falls back to the bgColor color block.
   */
  bgImage?: string;
  /** Hex color used when bgImage is absent. */
  bgColor?: string;
  /**
   * Reference to a template in `content/prompts.json` — populated by the
   * IMAGE_PROMPTS exporter so the user knows which prompt to run. Optional;
   * defaults to `carousel-hero-photo-frame` when absent.
   */
  promptTemplate?: string;
  /** Variable overrides for the prompt template's defaults. */
  promptVars?: Record<string, string>;
  eyebrow?: string;
  headline: string;
  italicWord?: string;
  byline?: string;
}

/** 22 — RESULTS_POSTER. Big results stats + claim — "I gave Claude my page" style. */
export interface ResultsPosterSlide extends SlideBase {
  type: "results";
  eyebrow?: string;
  title: string;
  italicWord?: string;
  results: Array<{ value: string; label: string }>;
  cta?: string;
}

/**
 * 23 — STORYTELLING. Full-bleed photo + white-serif paragraph overlay.
 * The format the Ava-style transformation carousels use: a recurring
 * persona (Soul Character) appears in different scenes per slide, with
 * personal-narrative copy floating in white italic serif over a soft
 * dark gradient for legibility. Used for first-person narrative arcs
 * (origin story → realization → action → result → CTA).
 */
export interface StorytellingSlide extends SlideBase {
  type: "storytelling";
  /** Full-bleed background image — required. Absolute https:// URL or root-relative /images/... */
  bgImage: string;
  /**
   * Multi-paragraph text overlay. Each entry renders as a separate
   * paragraph with line spacing between. Use for the personal narrative.
   */
  paragraphs: string[];
  /** Position the text block on the slide. Defaults to "top". */
  textPosition?: "top" | "center" | "bottom";
  /** Horizontal alignment of the text. Defaults to "center". */
  textAlign?: "left" | "center" | "right";
  /** Optional italic signoff — "xoxo — mira" style. */
  attribution?: string;
  /** Optional bullet list rendered after the paragraphs ("I'm exposing:" pattern). */
  bullets?: string[];
}

/**
 * 24 — PROMPTPACK_COVER. Result-led hook for the prompt-pack format (cream
 * paper, warm orange, serif). Logo badge, multi-line accent headline, an
 * optional "Result?" divider, a stat strip, a value pill, persona photo.
 */
export interface PromptPackCoverSlide extends SlideBase {
  type: "promptpack-cover";
  /** Headline as a sequence of lines: styled-run lines, or a divider label. */
  headline: Array<
    | { divider: string }
    | { runs: Array<{ t: string; accent?: boolean }>; size?: "sm" | "lg" }
  >;
  /** Up to two stats shown in the strip. */
  stats?: Array<{ value: string; label: string; sub?: string }>;
  /** White value-pill text. */
  pill?: string;
  /** Persona photo (cream-bg portrait). Absolute https:// or root-relative /images/... */
  photo?: string;
}

/**
 * 25 — PROMPTPACK_CARD. One named step of a prompt-pack: a two-tone all-caps
 * title and the actual Claude prompt shown inside a chat-window card.
 */
export interface PromptPackCardSlide extends SlideBase {
  type: "promptpack-card";
  /** Two-tone all-caps section title as styled runs. */
  title: Array<{ t: string; accent?: boolean }>;
  /** The Claude prompt, one entry per paragraph. */
  promptParagraphs: string[];
  /** Model label in the card's bottom bar. Defaults to "Sonnet 4.6". */
  model?: string;
  /** Tool pills shown under the card. */
  pills?: string[];
}

/**
 * 26 — PROMPTPACK_CTA. Comment-to-DM close for the prompt-pack format.
 * No price, no product name, no hard sell — conversion happens in the DM.
 */
export interface PromptPackCtaSlide extends SlideBase {
  type: "promptpack-cta";
  /** Word before the keyword, e.g. "Comment". */
  pre: string;
  /** The big keyword, e.g. "PROMPT". */
  keyword: string;
  /** Word after the keyword, e.g. "below". */
  post: string;
  /** Card lines — what they get. One line per entry; accent → orange. */
  card: Array<{ t: string; accent?: boolean }>;
}

export const SLIDE_TYPES = [
  "cover",
  "code",
  "numbered",
  "table",
  "grid",
  "stat",
  "diagram",
  "quote",
  "letter",
  "cta",
  "bullets",
  "definition",
  "step",
  "stats",
  "audience",
  "compare",
  "highlight-cover",
  "prompt-card",
  "badge",
  "fake-tweet",
  "photo-frame",
  "results",
  "storytelling",
  "promptpack-cover",
  "promptpack-card",
  "promptpack-cta",
] as const;
