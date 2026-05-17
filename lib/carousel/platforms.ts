/**
 * Multi-platform exporter.
 *
 * Takes a CarouselSpec — the editorial source of truth — and produces
 * paste-ready text variants for every platform we post to:
 *   - Instagram     (caption only — PNGs are the asset)
 *   - Pinterest     (pin titles + descriptions, per slide)
 *   - X / Twitter   (numbered thread, ≤ 280 chars per beat)
 *   - Reddit        (long-form Markdown, informative tone, no shilling)
 *   - Quora         (Q&A-framed long answer)
 *   - TikTok        (60–90s talking-head script with on-screen text beats)
 *
 * Every exporter is deterministic — no LLM calls — so the carousel + post
 * pack is reproducible from the same spec.json forever.
 */

import type { CarouselSpec, Slide } from "./types";
import type { Course, SecondaryRoute } from "./courses";
import type { PromptTemplate } from "./image-prompts";

/**
 * Per-spec image prompts — built by the API/CLI by walking the slides
 * and resolving any PhotoFrame slides against the prompts registry.
 */
export interface ResolvedImagePrompt {
  slideIndex: number;
  templateId: string;
  templateTitle: string;
  assetPath: string;
  size: string;
  aspect: string;
  /** The paste-ready prompt for the image generator. */
  prompt: string;
}

/**
 * Routing payload — built by the API/CLI from the courses registry and
 * passed through to every exporter. Decoupled from FS so the exporters
 * stay sync-pure.
 */
export interface CarouselRouting {
  /** Primary course CTA — may be null if no match in registry. */
  primary: Course | null;
  /** Secondary "next-step" big product mention. */
  secondary: SecondaryRoute | null;
}

/* ─── helpers ─────────────────────────────────────────────────────── */

/**
 * Join hashtags with a leading # — HARD CAP at 5.
 * User constraint: only 5 hashtags allowed on their platforms. Even if a
 * spec carries 8-12, we only ever emit the first 5.
 */
const MAX_HASHTAGS = 5;
function tags(spec: CarouselSpec): string {
  return (spec.hashtags ?? [])
    .slice(0, MAX_HASHTAGS)
    .map((h) => (h.startsWith("#") ? h : `#${h}`))
    .join(" ");
}

/** Reassemble the cover hook from its parts. */
function coverHook(spec: CarouselSpec): string {
  const first = spec.slides[0];
  if (first.type === "cover") {
    return [first.headline, first.italicWord, first.headlineAfter]
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  if (first.type === "highlight-cover") {
    return [first.highlightedHook, first.followUp].filter(Boolean).join(" — ").trim();
  }
  return spec.title;
}

/** Return the CTA slide if any. */
function ctaSlide(spec: CarouselSpec) {
  return spec.slides.find((s) => s.type === "cta") as
    | Extract<Slide, { type: "cta" }>
    | undefined;
}

/** Short prose summary of a single slide — used by Reddit + Quora + TikTok. */
function slideToProse(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return [slide.headline, slide.italicWord, slide.headlineAfter, slide.sub]
        .filter(Boolean)
        .join(" ");
    case "highlight-cover":
      return [slide.highlightedHook, slide.followUp, slide.sub]
        .filter(Boolean)
        .join(" ");
    case "code":
      return `${slide.title}\n\n\`\`\`${slide.language ?? ""}\n${slide.code}\n\`\`\`${slide.caption ? `\n\n${slide.caption}` : ""}`;
    case "numbered":
      return `**${slide.number}. ${slide.title}** — ${slide.body}`;
    case "step":
      return `**Step ${slide.stepNumber}: ${slide.title}** — ${slide.body}`;
    case "bullets": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      return `**${head}**\n\n${slide.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}`;
    }
    case "definition":
      return `**${slide.term}** ${slide.partOfSpeech ?? ""} — ${slide.definition}${slide.example ? `\n\n> ${slide.example}` : ""}`;
    case "table": {
      const rows = slide.rows
        .map((r) => `- ${r.label}: **${r.metric}**`)
        .join("\n");
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      return `**${head}**\n\n${rows}${slide.footer ? `\n\n*${slide.footer}*` : ""}`;
    }
    case "grid": {
      const cards = slide.cards
        .map((c) => `- **${c.number} · ${c.title}** — ${c.body ?? ""}`)
        .join("\n");
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      return `**${head}**\n\n${cards}`;
    }
    case "stat": {
      const head = [
        slide.eyebrow,
        slide.preStat,
        `**${slide.stat}**`,
        slide.postStat,
      ]
        .filter(Boolean)
        .join(" ");
      return slide.body ? `${head}\n\n${slide.body}` : head;
    }
    case "stats": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const lines = slide.stats.map((s) => `- **${s.value}** — ${s.label}`).join("\n");
      return `**${head}**\n\n${lines}`;
    }
    case "results": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const lines = slide.results.map((r) => `- **${r.value}** ${r.label}`).join("\n");
      return `**${head}**\n\n${lines}${slide.cta ? `\n\n*${slide.cta}*` : ""}`;
    }
    case "diagram": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const tiers = slide.tiers
        .map((t) => {
          const nodes = t.nodes.map((n) => `  - ${n.title}${n.sub ? ` — ${n.sub}` : ""}`).join("\n");
          return `**${t.label}**\n${nodes}`;
        })
        .join("\n\n");
      return `**${head}**\n\n${tiers}${slide.footer ? `\n\n*${slide.footer}*` : ""}`;
    }
    case "audience": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const lines = slide.audiences
        .map((a) => `- **${a.pill}** — ${a.body}`)
        .join("\n");
      return `**${head}**\n\n${lines}`;
    }
    case "compare": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const left = slide.left.items.map((i) => `  - ${i}`).join("\n");
      const right = slide.right.items.map((i) => `  - ${i}`).join("\n");
      return `**${head}**\n\n**${slide.left.label}**\n${left}\n\n**${slide.right.label}**\n${right}`;
    }
    case "prompt-card": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const cmds = slide.commands.map((c) => `\`${c.slash}\` — ${c.label}`).join("\n");
      return `**${head}**${slide.intro ? `\n\n${slide.intro}` : ""}\n\n${cmds}`;
    }
    case "badge": {
      const head = [slide.title, slide.italicWord].filter(Boolean).join(" ");
      const list = slide.badges
        .map((b) => `- **${b.label}**${b.sub ? ` — ${b.sub}` : ""}`)
        .join("\n");
      return `**${head}**\n\n${list}`;
    }
    case "fake-tweet":
      return `*${slide.author} (${slide.handle}):* "${slide.body}"`;
    case "photo-frame":
      return [slide.eyebrow, slide.headline, slide.italicWord, slide.byline]
        .filter(Boolean)
        .join(" ");
    case "quote":
      return `> "${slide.quote}"${slide.attribution ? `\n>\n> — ${slide.attribution}` : ""}`;
    case "letter":
      return `${slide.salutation}\n\n${slide.body}${slide.signoff ? `\n\n${slide.signoff}` : ""}`;
    case "cta":
      return `${slide.hook} ${slide.italicWord ?? ""} ${slide.hookAfter ?? ""} — ${slide.sub ?? ""}`.trim();
  }
}

/** Tight single-line summary of a slide — for Twitter/TikTok where every char matters. */
function slideHeadline(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return [slide.headline, slide.italicWord, slide.headlineAfter]
        .filter(Boolean)
        .join(" ");
    case "highlight-cover":
      return [slide.highlightedHook, slide.followUp].filter(Boolean).join(" ");
    case "numbered":
      return `${slide.number}. ${slide.title} — ${slide.body}`;
    case "step":
      return `Step ${slide.stepNumber}: ${slide.title}. ${slide.body}`;
    case "bullets":
      return `${slide.title}: ${slide.bullets.join(" · ")}`;
    case "definition":
      return `${slide.term}: ${slide.definition}`;
    case "table":
      return `${slide.title}${slide.italicWord ? ` ${slide.italicWord}` : ""} — ${slide.rows.map((r) => `${r.label} (${r.metric})`).join(", ")}`;
    case "grid":
      return `${slide.title}${slide.italicWord ? ` ${slide.italicWord}` : ""}: ${slide.cards.map((c) => c.title).join(" · ")}`;
    case "stat":
      return `${slide.preStat ?? ""} ${slide.stat} ${slide.postStat ?? ""}. ${slide.body ?? ""}`.trim();
    case "stats":
      return `${slide.title}: ${slide.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}`;
    case "results":
      return `${slide.title}: ${slide.results.map((r) => `${r.value} ${r.label}`).join(" · ")}`;
    case "diagram":
      return `${slide.title}${slide.italicWord ? ` ${slide.italicWord}` : ""} — ${slide.tiers.map((t) => t.label).join(" vs ")}`;
    case "audience":
      return `${slide.title}: ${slide.audiences.map((a) => a.pill).join(", ")}`;
    case "compare":
      return `${slide.title}: ${slide.left.label} vs ${slide.right.label}`;
    case "prompt-card":
      return `${slide.title}${slide.italicWord ? ` ${slide.italicWord}` : ""}`;
    case "badge":
      return `${slide.title}: ${slide.badges.map((b) => b.label).join(" · ")}`;
    case "fake-tweet":
      return `"${slide.body}" — ${slide.author}`;
    case "photo-frame":
      return [slide.headline, slide.italicWord].filter(Boolean).join(" ");
    case "code":
      return slide.title;
    case "quote":
      return `"${slide.quote}"${slide.attribution ? ` — ${slide.attribution}` : ""}`;
    case "letter":
      return `${slide.salutation} ${slide.body.split("\n")[0]}`;
    case "cta":
      return `${slide.hook} ${slide.italicWord ?? ""} ${slide.hookAfter ?? ""}`.trim();
  }
}

/**
 * Funnel destination for a carousel — the **primary** course CTA.
 * If no course match in registry, fall back to the legacy hardcoded routes
 * (kept here so older specs without routing still produce sensible output).
 */
function destinationFor(
  spec: CarouselSpec,
  routing?: CarouselRouting
): { name: string; url: string; status: "live" | "waitlist" | "coming_soon" | "legacy" } {
  if (routing?.primary) {
    return {
      name: routing.primary.title,
      url: routing.primary.url,
      status: routing.primary.status,
    };
  }
  switch (spec.vertical) {
    case "ai_trading":
      return { name: "FlowiAI Trader", url: "https://useflowi.app/trader", status: "legacy" };
    case "ai_behavior":
      return { name: "Woyuduin", url: "https://woyuduin.com", status: "legacy" };
    case "ai_builder":
      return {
        name: "AI Builder Field Guide",
        url: "https://flowi.gumroad.com/l/ai-builders-field-guide",
        status: "legacy",
      };
    default:
      return { name: "Flowi", url: "https://useflowi.app", status: "legacy" };
  }
}

/**
 * The "next step" the carousel mentions after the primary course — points to
 * the bigger product (FlowiAI Trader / Woyuduin / Agent Memory book).
 * Used only by long-form exporters (Reddit, Quora).
 */
function secondaryRouteFor(
  spec: CarouselSpec,
  routing?: CarouselRouting
): SecondaryRoute | null {
  return routing?.secondary ?? null;
}

/* ─── Instagram caption ──────────────────────────────────────────── */

/** Plain-text one-liner per body slide, for long-caption assembly. */
function slideToCaptionLine(slide: Slide): string {
  switch (slide.type) {
    case "numbered":
      return `${slide.number}. ${slide.title} — ${slide.body}`;
    case "step":
      return `Step ${slide.stepNumber}: ${slide.title} — ${slide.body}`;
    case "definition":
      return `${slide.term}: ${slide.definition}`;
    case "stat":
      return `${slide.preStat ?? ""} ${slide.stat} ${slide.postStat ?? ""} — ${slide.body ?? ""}`.trim();
    case "bullets":
      return `${slide.title}\n${(slide.bullets || []).map((b) => `• ${b}`).join("\n")}`;
    case "compare":
      return `${slide.title}\n${slide.left?.label}: ${(slide.left?.items || []).join(", ")}\n${slide.right?.label}: ${(slide.right?.items || []).join(", ")}`;
    case "audience":
      return `${slide.title}\n${(slide.audiences || []).map((a) => `• ${a.pill}: ${a.body}`).join("\n")}`;
    case "quote":
      return `"${slide.quote}"${slide.attribution ? ` — ${slide.attribution}` : ""}`;
    default:
      return slideHeadline(slide);
  }
}

/**
 * Long-form caption. User feedback: long captions perform on their
 * platforms. We build a story-shaped caption — hook, then the body
 * beats as a readable mini-article, then CTA, then exactly 5 hashtags.
 */
export function toInstagramCaption(spec: CarouselSpec, routing?: CarouselRouting): string {
  void routing;
  const cta = ctaSlide(spec);
  const ctaLine = cta
    ? `↓ Comment "${cta.ctaKeyword}" ${cta.ctaPromise} and I'll DM it to you.`
    : spec.cta
      ? `↓ Comment "${spec.cta.keyword}" ${spec.cta.promise} and I'll DM it to you.`
      : "";

  const hook = spec.caption ?? coverHook(spec);

  // Body beats — skip cover/cta/photo, take up to 5 for a rich caption.
  const beats = spec.slides
    .filter(
      (s) =>
        s.type !== "cover" &&
        s.type !== "highlight-cover" &&
        s.type !== "photo-frame" &&
        s.type !== "cta"
    )
    .slice(0, 5)
    .map(slideToCaptionLine)
    .filter(Boolean);

  const body = beats.join("\n\n");

  const saveLine = "Save this for later — and follow @useflowi for the daily AI brief.";

  // Keep blank lines as paragraph breaks; the "." lines push hashtags
  // below the IG "more" fold so the caption reads clean.
  const parts = [hook, "", body, "", saveLine];
  if (ctaLine) parts.push("", ctaLine);
  parts.push("", ".", ".", ".", tags(spec));

  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ─── Pinterest pins ──────────────────────────────────────────────── */

/**
 * Pinterest works best when each slide is uploaded as its own pin with a
 * unique title + description. Both fields are SEO-indexed.
 */
export function toPinterestPins(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const cta = ctaSlide(spec);
  const sections = spec.slides.map((slide, i) => {
    const baseTitle = slideHeadline(slide).slice(0, 100);
    const title = `${baseTitle}${i === 0 ? "" : ` — pt ${i + 1}/${spec.slides.length}`}`;
    const description = `${slideToProse(slide).slice(0, 480)}\n\n${tags(spec)}`;
    return [
      `### Pin ${pad(i + 1)} — ${slide.type}`,
      "",
      `**Title** (≤ 100 chars)`,
      title.length > 100 ? title.slice(0, 97) + "..." : title,
      "",
      `**Description** (≤ 500 chars)`,
      description,
      "",
      `**Link**: ${dest.url}`,
      "",
      "---",
      "",
    ].join("\n");
  });

  const intro = [
    `# Pinterest pins — ${spec.title}`,
    "",
    `Upload each pin as a separate image. Use the title + description below per pin.`,
    `All pins link to: ${dest.url} (${dest.name}).`,
    cta ? `CTA in caption mention: Comment "${cta.ctaKeyword}" on the IG post for the playbook.` : "",
    "",
    "---",
    "",
  ].join("\n");

  return intro + sections.join("");
}

/* ─── Twitter / X thread ──────────────────────────────────────────── */

export function toTwitterThread(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const cta = ctaSlide(spec);

  const beats: string[] = [];

  // Tweet 1: hook + thread indicator
  const hook = coverHook(spec);
  beats.push(`${hook}\n\nA short thread on what actually works ↓`);

  // Body beats — skip the cover and cta; render the rest
  spec.slides
    .filter(
      (s) =>
        s.type !== "cover" &&
        s.type !== "highlight-cover" &&
        s.type !== "photo-frame" &&
        s.type !== "cta"
    )
    .forEach((slide, i) => {
      const head = slideHeadline(slide);
      const trimmed = head.length > 270 ? head.slice(0, 267) + "..." : head;
      beats.push(`${i + 1}/  ${trimmed}`);
    });

  // Final CTA tweet
  const ctaHook = cta
    ? `Want the full pack? ${cta.sub ?? ""}\n\nLink in bio → ${dest.url}`
    : `Full breakdown: ${dest.url}`;
  beats.push(ctaHook);

  // Format: one tweet per double-newline-separated block, prefixed with "---"
  return [
    `# X / Twitter thread — ${spec.title}`,
    "",
    `Paste each block separately. Threading tool will keep order. Each beat fits within 280 chars.`,
    "",
    "---",
    "",
    ...beats.flatMap((b, i) => [`**Tweet ${i + 1}/${beats.length}** (${b.length} chars)`, "", b, "", "---", ""]),
  ].join("\n");
}

/* ─── Reddit post ─────────────────────────────────────────────────── */

export function toRedditPost(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const secondary = secondaryRouteFor(spec, routing);
  const cta = ctaSlide(spec);

  const subRecs: Record<string, string[]> = {
    ai_builder: ["r/ClaudeAI", "r/ChatGPT", "r/PromptEngineering", "r/LocalLLaMA"],
    ai_trading: ["r/algotrading", "r/Forex", "r/Daytrading", "r/quant"],
    ai_behavior: ["r/getdisciplined", "r/selfimprovement", "r/decidingtobebetter", "r/atomichabits"],
    ai_general: ["r/singularity", "r/artificial", "r/Futurology"],
  };

  const subs = subRecs[spec.vertical] ?? subRecs.ai_general;
  const title = coverHook(spec);

  const body = spec.slides
    .filter(
      (s) =>
        s.type !== "cover" &&
        s.type !== "highlight-cover" &&
        s.type !== "photo-frame" &&
        s.type !== "cta"
    )
    .map((s) => slideToProse(s))
    .join("\n\n");

  const isWaitlist = dest.status === "waitlist";
  const ctaVerb = isWaitlist ? "early-access waitlist" : "playbook";
  const ctaArticle = isWaitlist ? "an" : "a";
  const signoffMain = cta
    ? `If this is useful, I'm putting it into ${ctaArticle} ${ctaVerb} over at ${dest.url}. Happy to answer questions in the thread.`
    : `Full write-up: ${dest.url}`;
  const secondaryLine = secondary
    ? `\n\nThe bigger play I'm building this toward is **${secondary.name}** (${secondary.url}) — ${secondary.tagline}`
    : "";
  const signoff = signoffMain + secondaryLine;

  return [
    `# Reddit post — ${spec.title}`,
    "",
    `Recommended subs (rotate, never the same day): ${subs.join(", ")}`,
    "",
    "Tone: informative, no shilling in body. Link only in sign-off, and only if rules allow.",
    "",
    "---",
    "",
    `**Title** (≤ 300 chars)`,
    "",
    title,
    "",
    `**Body** (Markdown)`,
    "",
    body,
    "",
    "---",
    "",
    signoff,
    "",
  ].join("\n");
}

/* ─── Quora answer ────────────────────────────────────────────────── */

export function toQuoraAnswer(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const secondary = secondaryRouteFor(spec, routing);

  // Frame the cover hook as a question.
  const hook = coverHook(spec);
  const question = hook.endsWith("?") ? hook : `${hook}?`;

  const intro = `Short answer: ${hook} — and here is what most write-ups miss.`;

  const body = spec.slides
    .filter(
      (s) =>
        s.type !== "cover" &&
        s.type !== "highlight-cover" &&
        s.type !== "photo-frame" &&
        s.type !== "cta"
    )
    .map((s, i) => `## ${i + 1}. ${slideHeadline(s)}\n\n${slideToProse(s)}`)
    .join("\n\n");

  const closeVerb =
    dest.status === "waitlist" ? "waitlist (launching this month)" : "playbook";
  const closeMain = `If you want the full systemized version of this, I've put it on the ${dest.name} ${closeVerb}: ${dest.url}.`;
  const closeSecondary = secondary
    ? `\n\nAnd the bigger product I'm building this toward is **${secondary.name}** (${secondary.url}) — ${secondary.tagline}`
    : "";
  const close = closeMain + closeSecondary;

  return [
    `# Quora answer — ${spec.title}`,
    "",
    `Find or create a question along the lines of:`,
    "",
    `> ${question}`,
    "",
    "---",
    "",
    `**Answer** (long form)`,
    "",
    intro,
    "",
    body,
    "",
    "---",
    "",
    close,
    "",
  ].join("\n");
}

/* ─── TikTok script ───────────────────────────────────────────────── */

export function toTikTokScript(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const cta = ctaSlide(spec);

  const hook = coverHook(spec);
  const beats: Array<{ time: string; spoken: string; onScreen: string }> = [];

  // Cold open
  beats.push({
    time: "0:00 – 0:03",
    spoken: hook,
    onScreen: hook.toUpperCase(),
  });

  // Body — distribute 50s across the remaining slides
  const bodySlides = spec.slides.filter(
      (s) =>
        s.type !== "cover" &&
        s.type !== "highlight-cover" &&
        s.type !== "photo-frame" &&
        s.type !== "cta"
    );
  const slotSec = bodySlides.length > 0 ? Math.floor(50 / bodySlides.length) : 5;
  let cursor = 3;
  for (const s of bodySlides) {
    const start = cursor;
    const end = cursor + slotSec;
    cursor = end;
    const headline = slideHeadline(s);
    beats.push({
      time: `${formatTime(start)} – ${formatTime(end)}`,
      spoken: headline,
      onScreen: slideToOnScreenText(s),
    });
  }

  // CTA
  beats.push({
    time: `${formatTime(cursor)} – ${formatTime(cursor + 5)}`,
    spoken: cta
      ? `Comment ${cta.ctaKeyword} and I'll DM you the full breakdown.`
      : `Full breakdown at ${dest.url}.`,
    onScreen: cta ? `COMMENT "${cta.ctaKeyword}"` : "LINK IN BIO",
  });

  return [
    `# TikTok / Reels script — ${spec.title}`,
    "",
    `Format: talking-head with on-screen text bumps. ~${cursor + 5} seconds total. Hook in first 3 seconds.`,
    "",
    "---",
    "",
    ...beats.flatMap((b) => [
      `**${b.time}**`,
      "",
      `*Spoken:* ${b.spoken}`,
      `*On-screen:* ${b.onScreen}`,
      "",
    ]),
    "---",
    "",
    `Caption: ${spec.caption ?? hook}`,
    "",
    `Hashtags: ${tags(spec)}`,
  ].join("\n");
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function slideToOnScreenText(s: Slide): string {
  switch (s.type) {
    case "numbered":
    case "step":
      return ("stepNumber" in s ? s.stepNumber : s.number).toString();
    case "stat":
      return s.stat;
    case "stats":
      return s.stats.map((x) => x.value).join(" / ");
    case "results":
      return s.results.map((x) => x.value).join(" / ");
    default:
      return slideHeadline(s).slice(0, 60).toUpperCase();
  }
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/* ─── IMAGE_PROMPTS ─────────────────────────────────────────────── */

export function toImagePrompts(
  spec: CarouselSpec,
  prompts: ResolvedImagePrompt[]
): string {
  if (prompts.length === 0) {
    return [
      `# Image prompts — ${spec.title}`,
      "",
      "This carousel does not use any `photo-frame` slides — no image generation required.",
      "",
      "If you want to swap in a hero photo on any slide, change that slide's `type` to `photo-frame` in `spec.json`, regenerate, and the prompt for it will appear here.",
      "",
    ].join("\n");
  }

  const sections = prompts.map((p) =>
    [
      `## Slide ${pad(p.slideIndex)} — ${p.templateTitle}`,
      "",
      `- **Asset class:** \`${p.templateId}\``,
      `- **Save to:** \`${p.assetPath.replace("<spec-id>", spec.id).replace("<NN>", pad(p.slideIndex))}\``,
      `- **Size:** ${p.size} (${p.aspect})`,
      "",
      `### Prompt (paste into ChatGPT image-gen, Gemini Imagen, or Midjourney)`,
      "",
      "```",
      p.prompt,
      "```",
      "",
      `### After generating`,
      "",
      `1. Save the result as \`${p.assetPath.replace("<spec-id>", spec.id).replace("<NN>", pad(p.slideIndex))}\``,
      `2. Edit \`spec.json\` — set \`bgImage\` on slide ${p.slideIndex} to \`/${p.assetPath.replace("public/", "").replace("<spec-id>", spec.id).replace("<NN>", pad(p.slideIndex))}\``,
      `3. Re-run the zip — the image will appear in the rendered slide`,
      "",
      "---",
      "",
    ].join("\n")
  );

  return [
    `# Image prompts — ${spec.title}`,
    "",
    `This carousel uses **${prompts.length}** photo-backed slide${prompts.length === 1 ? "" : "s"}.`,
    `Generate each image, drop it in the listed path, then re-render the zip.`,
    "",
    "---",
    "",
    ...sections,
  ].join("\n");
}

/* ─── READ_ME — the index ────────────────────────────────────────── */

export function toReadMe(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const secondary = secondaryRouteFor(spec, routing);
  const cta = ctaSlide(spec);
  return [
    `# ${spec.title}`,
    "",
    `**ID:** \`${spec.id}\``,
    `**Vertical:** ${spec.vertical}`,
    spec.topic ? `**Topic:** ${spec.topic}` : "",
    `**Primary funnel:** ${dest.name} (${dest.status}) → ${dest.url}`,
    secondary
      ? `**Bigger product mentioned in body:** ${secondary.name} → ${secondary.url}`
      : "",
    cta ? `**CTA keyword:** \`${cta.ctaKeyword}\` — ${cta.ctaPromise}` : "",
    "",
    "## What's in this pack",
    "",
    `- **${spec.slides.length} slide PNGs** (1080×1350) — drop into Instagram carousel + Pinterest pins`,
    `- **caption.txt** — Instagram caption ready to paste`,
    `- **posts/twitter-thread.md** — X / Twitter thread, one block per tweet`,
    `- **posts/reddit.md** — long-form Reddit post + recommended subs`,
    `- **posts/quora.md** — Quora answer with framing question`,
    `- **posts/tiktok-script.md** — 60s talking-head script with on-screen text beats`,
    `- **posts/pinterest-pins.md** — per-pin title + description (SEO-tuned)`,
    `- **IMAGE_PROMPTS.md** — paste-ready prompts for every photo-backed slide`,
    `- **spec.json** — the source of truth (edit + regenerate any time)`,
    "",
    "## Recommended posting order",
    "",
    "1. **Instagram carousel** (the original) — drop at peak time for your audience",
    "2. **Pinterest pins** — upload each slide as a separate pin, 2 hours later",
    "3. **X / Twitter thread** — same day, 4–6 hours after Instagram",
    "4. **TikTok / Reels** — record talking-head version of the script, next day",
    "5. **Reddit** — distribute across the recommended subs over the week, never two same day",
    "6. **Quora** — answer 1 relevant question per week with this content as the base",
    "",
    "## Edit cycle",
    "",
    "Edit `spec.json` → POST to `/api/carousel/zip` (or use `/admin/studio`) → fresh pack drops.",
    `Every platform variant regenerates from the same source. Captions, hashtags, CTA — change once, propagate everywhere.`,
    "",
  ]
    .filter((l) => l !== "")
    .join("\n")
    .replace(/\n+/g, (m) => (m.length > 2 ? "\n\n" : m));
}
