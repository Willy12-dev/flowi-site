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
    case "storytelling": {
      const body = slide.paragraphs.join("\n\n");
      const bullets = slide.bullets && slide.bullets.length > 0
        ? `\n\n${slide.bullets.map((b) => `- ${b}`).join("\n")}`
        : "";
      const sig = slide.attribution ? `\n\n${slide.attribution}` : "";
      return `${body}${bullets}${sig}`;
    }
    case "promptpack-cover": {
      const lines = slide.headline
        .map((l) => ("divider" in l ? l.divider : l.runs.map((r) => r.t).join(" ")))
        .join(" ");
      const stats = (slide.stats ?? [])
        .map((s) => `${s.value} ${s.label}${s.sub ? ` ${s.sub}` : ""}`)
        .join(" · ");
      return [lines, stats, slide.pill].filter(Boolean).join("\n\n");
    }
    case "promptpack-card": {
      const head = slide.title.map((r) => r.t).join(" ");
      return `**${head}**\n\n${slide.promptParagraphs.join("\n\n")}`;
    }
    case "promptpack-cta": {
      const head = `${slide.pre} ${slide.keyword} ${slide.post}`.trim();
      return `${head}\n\n${slide.card.map((l) => l.t).join(" ")}`;
    }
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
    case "storytelling":
      return slide.paragraphs[0] ?? "";
    case "promptpack-cover":
      return slide.headline
        .map((l) => ("divider" in l ? l.divider : l.runs.map((r) => r.t).join(" ")))
        .join(" ");
    case "promptpack-card":
      return slide.title.map((r) => r.t).join(" ");
    case "promptpack-cta":
      return `${slide.pre} ${slide.keyword} ${slide.post}`.trim();
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
        url: "https://flowi.gumroad.com/l/ai-builders-field-guide-v1",
        status: "legacy",
      };
    default:
      return { name: "Flowi", url: "https://useflowi.app", status: "legacy" };
  }
}

/**
 * The outbound link every social post should point at.
 *
 * For NEWS specs (id starts with "news-") the canonical destination is the
 * live blog article for that story — NOT a course/waitlist URL. The article
 * already carries the funnel CTA, gives Google a real page to index, and
 * earns dwell time. social → article → product is the correct funnel; a raw
 * waitlist link is too aggressive AND was mis-routing (OpenAI stories
 * pointing at the Grok waitlist).
 *
 * Evergreen/hand-written specs keep the course-funnel destination.
 */
function outboundUrl(spec: CarouselSpec, dest: { url: string }): string {
  if (spec.id && spec.id.startsWith("news-")) {
    const slug = spec.id.replace(/^news-/, "");
    return `https://useflowi.app/blog/${slug}`;
  }
  return dest.url;
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
  const link = outboundUrl(spec, dest);
  const cta = ctaSlide(spec);
  // Pinterest flags near-duplicate pins as spam. Only emit the 2 strongest:
  // the cover and the single richest body slide. Both link to the article.
  const cover = spec.slides[0];
  const bodyPick =
    spec.slides.find((s) =>
      ["definition", "stat", "stats", "compare", "numbered"].includes(s.type)
    ) ?? spec.slides[1];
  const picks = [cover, bodyPick].filter(Boolean);
  const sections = picks.map((slide, i) => {
    const baseTitle = slideHeadline(slide).slice(0, 100);
    const title = baseTitle.length > 100 ? baseTitle.slice(0, 97) + "..." : baseTitle;
    const description = `${slideToProse(slide).slice(0, 440)}\n\n${tags(spec)}`;
    return [
      `### Pin ${pad(i + 1)} — use ${i === 0 ? "the cover (01-*.png)" : slide.type + " slide"}`,
      "",
      `**Title** (≤ 100 chars)`,
      title,
      "",
      `**Description** (≤ 500 chars)`,
      description,
      "",
      `**Link**: ${link}`,
      "",
      "---",
      "",
    ].join("\n");
  });

  const intro = [
    `# Pinterest pins — ${spec.title}`,
    "",
    `Post these 2 pins (more = Pinterest near-dupe spam flag).`,
    `Both link to the live article: ${link}`,
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

  // Final CTA tweet — news specs point at the live article, not a waitlist
  const tLink = outboundUrl(spec, dest);
  const ctaHook =
    spec.id && spec.id.startsWith("news-")
      ? `Full breakdown ↓\n\n${tLink}`
      : cta
        ? `Want the full pack? ${cta.sub ?? ""}\n\nLink in bio → ${tLink}`
        : `Full breakdown: ${tLink}`;
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

  const isNews = spec.id && spec.id.startsWith("news-");
  const rLink = outboundUrl(spec, dest);
  const isWaitlist = dest.status === "waitlist";
  const ctaVerb = isWaitlist ? "early-access waitlist" : "playbook";
  const ctaArticle = isWaitlist ? "an" : "a";
  // News: soft article link (Reddit-safe). Evergreen: the funnel.
  const signoffMain = isNews
    ? `I wrote the full breakdown here if useful: ${rLink} — happy to get into any of it in the comments.`
    : cta
      ? `If this is useful, I'm putting it into ${ctaArticle} ${ctaVerb} over at ${rLink}. Happy to answer questions in the thread.`
      : `Full write-up: ${rLink}`;
  // Don't stack a second promo link on news posts — Reddit hates that.
  const secondaryLine = secondary && !isNews
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

/** Strip markdown emphasis + any URL so Quora Spaces never see a link. */
function plainNoLinks(s: string): string {
  return s
    .replace(/\(https?:\/\/[^)]+\)/g, "") // markdown link targets
    .replace(/https?:\/\/\S+/g, "")        // bare URLs
    .replace(/\*\*/g, "")                   // bold
    .replace(/^#+\s*/gm, "")                // headings -> plain
    .replace(/^>\s?/gm, "")                 // blockquote markers
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Quora Spaces / communities ban links and reward long, substantive,
 * link-free answers. This emits a pure-value long-form post — no URLs,
 * no product mention, no markdown headers. The user pastes it as-is.
 */
export function toQuoraAnswer(spec: CarouselSpec, routing?: CarouselRouting): string {
  void routing;
  const hook = coverHook(spec);
  const question = hook.endsWith("?") ? hook : `${hook}?`;

  const intro = plainNoLinks(hook);

  const body = spec.slides
    .filter(
      (s) =>
        s.type !== "cover" &&
        s.type !== "highlight-cover" &&
        s.type !== "photo-frame" &&
        s.type !== "cta"
    )
    .map((s) => {
      const head = slideHeadline(s);
      const prose = plainNoLinks(slideToProse(s));
      return `${head}\n\n${prose}`;
    })
    .join("\n\n");

  // A value-only closer — no link, no product. Invites discussion instead.
  const close =
    "If you found this useful, the nuance worth arguing about is which of these holds once the hype cycle cools. Curious where others land.";

  return [
    `# Quora — ${spec.title}`,
    "",
    `NO LINKS — Quora Spaces auto-remove them. Paste the answer below as-is.`,
    `Find/answer a question like:`,
    "",
    `> ${question}`,
    "",
    "---",
    "",
    intro,
    "",
    body,
    "",
    close,
    "",
  ].join("\n");
}

/* ─── Higgsfield video brief (was: TikTok script) ─────────────────── */

/** Persona per vertical — the persistent Higgsfield Soul Character.
 *  `soul` is the stable trained-character id reused on every video forever
 *  (train once from `ref`); the face never drifts week to week. */
function personaFor(spec: CarouselSpec): {
  name: string;
  first: string;
  soul: string;
  ref: string;
  pronoun: string;
  world: string;
  music: string;
} {
  switch (spec.vertical) {
    case "ai_trading":
      return {
        name: "Sofia (quant trader)",
        first: "Sofia",
        soul: "sofia",
        ref: "public/images/personas/sofia-hero.jpg",
        pronoun: "she",
        world: "near-black trading desk, single orange screen-glow, high contrast, controlled intensity",
        music: "tense cinematic, low pulsing sub-bass, sparse",
      };
    case "ai_behavior":
      return {
        name: "Mira (luxury lifestyle advisor)",
        first: "Mira",
        soul: "mira",
        ref: "public/images/personas/mira-hero.png",
        pronoun: "she",
        world: "warm Mediterranean-coded minimalist interior, cream walls + light wood, soft natural window light, subtle terracotta accents",
        music: "warm acoustic guitar, soft sun-soaked, contemplative",
      };
    default:
      return {
        name: "Maya (AI engineer)",
        first: "Maya",
        soul: "maya",
        ref: "public/images/personas/maya-hero.jpg",
        pronoun: "she",
        world: "warm cream editorial space, soft north-window light, calm-confident",
        music: "modern minimal electronic, low-key confident, light pulse",
      };
  }
}

const CAMERA_MOVES = [
  "slow push-in on the subject",
  "static, shallow depth of field",
  "subtle handheld drift right",
  "slow dolly orbit left",
  "rack focus background → subject",
  "locked wide, subject centered",
];

/**
 * The platform-neutral Higgsfield shot brief — header, one-paste MCP run
 * block, per-shot Generate prompts, train/stitch workflow. Shared by the
 * TikTok and YouTube Shorts exporters so the video brief is a single
 * source of truth and never drifts into two copies.
 */
function higgsfieldShotBrief(spec: CarouselSpec): string {
  const cta = ctaSlide(spec);
  const persona = personaFor(spec);
  const hook = coverHook(spec);

  const bodySlides = spec.slides.filter(
    (s) =>
      s.type !== "cover" &&
      s.type !== "highlight-cover" &&
      s.type !== "photo-frame" &&
      s.type !== "cta"
  );

  type Shot = {
    dur: number;
    action: string;
    camera: string;
    onScreen: string;
    vo: string;
  };
  const shots: Shot[] = [];

  // Shot 1 — the hook (attention-grab camera, first 2s decide everything)
  shots.push({
    dur: 4,
    action: `${persona.first} looks straight to camera, direct, like ${persona.pronoun}'s about to tell you something most people get wrong`,
    camera: "fast push-in / snap zoom to face",
    onScreen: hook.toUpperCase().slice(0, 70),
    vo: hook,
  });

  // Body shots — one per body slide, rotating camera moves
  bodySlides.forEach((s, i) => {
    shots.push({
      dur: bodySlides.length > 6 ? 5 : 7,
      action:
        i % 2 === 0
          ? `${persona.first} explaining, controlled hand gesture, confident`
          : `${persona.first} half-turned, glancing back to camera mid-thought`,
      camera: CAMERA_MOVES[i % CAMERA_MOVES.length],
      onScreen: slideToOnScreenText(s).slice(0, 60),
      vo: slideHeadline(s),
    });
  });

  // Final shot — CTA
  shots.push({
    dur: 5,
    action: `${persona.first} leans in slightly, resolved, direct eye contact`,
    camera: "slow push-in, settle to static",
    onScreen: cta ? `COMMENT "${cta.ctaKeyword}"` : "LINK IN BIO",
    vo: cta
      ? `Comment ${cta.ctaKeyword} and I'll DM you the full breakdown.`
      : `Full breakdown — link in bio.`,
  });

  const total = shots.reduce((a, s) => a + s.dur, 0);

  // The literal natural-language prompt handed to the Higgsfield MCP, per shot.
  const genPrompt = (s: Shot) =>
    `Generate a ${s.dur}s 9:16 cinematic clip with Soul Character "${persona.soul}": ${s.action}. ` +
    `Setting: ${persona.world}. Camera: ${s.camera}. Mood: ${persona.music}. Keep identity stable.`;

  const header = [
    `# Higgsfield MCP brief — ${spec.title}`,
    "",
    `**Format:** 9:16 vertical · ~${total}s · hook must land in first 2 seconds`,
    `**Soul Character:** \`${persona.soul}\` — ${persona.name}`,
    `**Train-from (first time only):** ${persona.ref}`,
    `**World:** ${persona.world}`,
    `**Music / mood:** ${persona.music}`,
    "",
    "## One-paste run block — give this to Claude with the Higgsfield connector on",
    "",
    "```",
    `Using the Higgsfield connector: if a Soul Character named "${persona.soul}" does not exist, train it once from ${persona.ref}. Then generate the ${shots.length} shots below as 9:16 clips, in order, reusing Soul Character "${persona.soul}" on every shot so the face is identical. Return each clip.`,
    "```",
    "",
    "---",
    "",
  ];

  let t = 0;
  const shotBlocks = shots.flatMap((s, i) => {
    const start = t;
    t += s.dur;
    return [
      `## Shot ${i + 1} · ${formatTime(start)}–${formatTime(t)} (${s.dur}s)`,
      "",
      `**Generate:** ${genPrompt(s)}`,
      "",
      `- **On-screen text (overlay, add in post):** ${s.onScreen}`,
      `- **Voiceover (add in post):** ${s.vo}`,
      i < shots.length - 1 ? `- **Transition:** hard cut` : `- **End:** hold 0.5s on the CTA text`,
      "",
    ];
  });

  return [
    ...header,
    ...shotBlocks,
    "---",
    "",
    `**Workflow:** paste the run block to Claude (Higgsfield connector on) → it trains/reuses Soul Character \`${persona.soul}\` and returns every clip → stitch in order → add the on-screen text + voiceover → post. The Soul Character keeps the face identical across this and every future video — train it once, never retrain.`,
  ].join("\n");
}

/**
 * TikTok / IG Reels package — the shared Higgsfield brief + caption + the
 * 5 hashtags. These platforms have no clickable links, so the CTA drives
 * to "link in bio". Same export name so Library/zip/pack wiring is
 * unchanged.
 */
export function toTikTokScript(spec: CarouselSpec, routing?: CarouselRouting): string {
  void routing;
  const hook = coverHook(spec);
  return [
    higgsfieldShotBrief(spec),
    "",
    "---",
    "",
    `**Caption:** ${spec.caption ?? hook}`,
    "",
    `**Hashtags:** ${tags(spec)}`,
    "",
    `*TikTok / IG Reels have no clickable links — the CTA must drive to "link in bio".*`,
  ].join("\n");
}

/* ─── YouTube Shorts ─────────────────────────────────────────────── */

/**
 * YouTube Shorts package. Reuses the exact Higgsfield shot brief (zero
 * drift) and adds the packaging YouTube needs. The lever YT has that
 * TikTok / IG Reels do NOT: clickable links in the description and a
 * searchable title — so the outbound link AND the email-capture link are
 * real here. Shorts is the only short-form channel that converts
 * on-platform instead of "link in bio".
 */
export function toYouTubeShort(spec: CarouselSpec, routing?: CarouselRouting): string {
  const dest = destinationFor(spec, routing);
  const link = outboundUrl(spec, dest);
  const cta = ctaSlide(spec);
  const hook = coverHook(spec).replace(/\s+/g, " ").trim();

  // Title ≤100 chars (Shorts ARE searched). Leave room for " #Shorts".
  const titleBase =
    hook.length > 92 ? hook.slice(0, 92).replace(/\s+\S*$/, "").trim() : hook;

  // Description: the first line surfaces in-feed — lead with the value.
  const summary = (spec.caption ?? hook).replace(/\s+/g, " ").trim();
  const blurb =
    summary.length > 300
      ? summary.slice(0, 300).replace(/\s+\S*$/, "").trim() + "…"
      : summary;

  const ctaLine = cta
    ? `Comment "${cta.ctaKeyword}" ${cta.ctaPromise ?? ""}`.trim()
    : "";

  return [
    `# YouTube Short — ${spec.title}`,
    "",
    "## Title  (paste — write it as a phrase someone would actually search)",
    "",
    `${titleBase} #Shorts`,
    "",
    "## Description  (paste as-is — links ARE clickable on YouTube, unlike TikTok/IG)",
    "",
    blurb,
    "",
    `▶ Free daily AI brief — one email, no fluff: https://useflowi.app/dispatch`,
    `▶ Full write-up: ${link}`,
    "",
    ctaLine,
    "",
    `#Shorts ${tags(spec)}`,
    "",
    "---",
    "",
    "## Shoot it (same Soul Character — face stays identical to every other Short on this channel)",
    "",
    higgsfieldShotBrief(spec),
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
