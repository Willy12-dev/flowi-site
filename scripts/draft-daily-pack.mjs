#!/usr/bin/env node
/**
 * Daily pack drafter.
 *
 *   node scripts/draft-daily-pack.mjs               # 5 random topics
 *   node scripts/draft-daily-pack.mjs --count 3
 *   node scripts/draft-daily-pack.mjs --topic claude --topic chatgpt
 *   node scripts/draft-daily-pack.mjs --vertical ai_trading --count 2
 *   node scripts/draft-daily-pack.mjs --post-id 1  # only this exact topic id
 *
 * Picks N "planned" topics from `content/topic-library.json`, stubs out
 * fully-formed CarouselSpec JSONs under `content/carousel-specs/`, and
 * marks them as "drafted" in the library file. Each stub is ready for the
 * user to refine in `/admin/studio` (or directly in the file), then `zip`
 * to produce the full multi-platform pack.
 *
 * Status flow: planned → drafted → posted (you mark posted manually).
 *
 * The drafter ONLY scaffolds — it doesn't generate creative copy from
 * scratch. It uses the topic.hook / topic.italic from the library plus
 * the format hint to build a 5-9 slide deck following the editorial
 * conventions in `references/SYNTHESIS.md`.
 */

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/* ─── args ────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const out = { count: 5, topics: [], verticals: [], postIds: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--count") out.count = parseInt(argv[++i], 10);
    else if (a === "--topic") out.topics.push(argv[++i]);
    else if (a === "--vertical") out.verticals.push(argv[++i]);
    else if (a === "--post-id") out.postIds.push(argv[++i]);
  }
  return out;
}

/* ─── helpers ─────────────────────────────────────────────────────── */

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

/** Hashtag packs per vertical, mirroring SYNTHESIS.md */
const HASHTAGS = {
  ai_builder: [
    "ai",
    "claude",
    "chatgpt",
    "aitools",
    "buildwithai",
    "aiworkflow",
    "promptengineering",
    "aiautomation",
    "indiehacker",
  ],
  ai_trading: [
    "algotrading",
    "ictconcepts",
    "smartmoneyconcepts",
    "forex",
    "priceaction",
    "trader",
    "tradingpsychology",
    "riskmanagement",
    "marketstructure",
  ],
  ai_behavior: [
    "habits",
    "behaviorchange",
    "atomichabits",
    "selfimprovement",
    "consistency",
    "discipline",
    "mindset",
    "personaldevelopment",
  ],
  ai_general: ["ai", "claude", "chatgpt", "futureofwork", "aitools"],
};

function ctaForCourse(registry, vertical, topic) {
  if (topic) {
    const byTopic = registry.courses.find((c) =>
      c.topics.includes(topic.toLowerCase())
    );
    if (byTopic) return { keyword: byTopic.cta_keyword, promise: byTopic.cta_promise };
  }
  const byVertical = registry.courses.find(
    (c) => c.vertical === vertical && c.status === "live"
  );
  if (byVertical) {
    return { keyword: byVertical.cta_keyword, promise: byVertical.cta_promise };
  }
  return { keyword: "FLOWI", promise: "for the full pack" };
}

function themeFor(vertical) {
  if (vertical === "ai_trading") return "premium-dark";
  return "editorial-cream";
}

/* ─── template stubs by format hint ───────────────────────────────── */
/* Each builder returns an array of slides — caller fills index/total. */

function stubCover(topic, total) {
  return {
    type: "cover",
    index: 1,
    total,
    eyebrow: `${topic.topic.toUpperCase().replace(/_/g, " ")}`,
    headline: topic.hook,
    italicWord: topic.italic,
    sub: "[Edit this sub-headline to set the promise.]",
  };
}

function stubBodyForFormat(format, topic) {
  switch (format) {
    case "data-table":
      return [
        {
          type: "table",
          eyebrow: "WHAT WORKED",
          title: topic.hook,
          italicWord: topic.italic,
          columns: { label: "PATTERN", metric: "REACH" },
          rows: [
            { index: "01", label: "[Pattern 1]", metric: "[NUMBER]" },
            { index: "02", label: "[Pattern 2]", metric: "[NUMBER]" },
            { index: "03", label: "[Pattern 3]", metric: "[NUMBER]" },
            { index: "04", label: "[Pattern 4]", metric: "[NUMBER]" },
            { index: "05", label: "[Pattern 5]", metric: "[NUMBER]" },
          ],
          footer: "[Source / disclaimer]",
        },
      ];
    case "compare":
      return [
        {
          type: "compare",
          title: "What changed",
          italicWord: "in one move.",
          left: {
            label: "BEFORE",
            items: ["[item 1]", "[item 2]", "[item 3]", "[item 4]"],
          },
          right: {
            label: "AFTER",
            items: ["[item 1]", "[item 2]", "[item 3]", "[item 4]"],
          },
        },
      ];
    case "step-by-step":
      return [1, 2, 3].map((n) => ({
        type: "step",
        stepNumber: pad(n),
        stepLabel: "STEP",
        title: `[Step ${n} title]`,
        body: "[Step body — 3-line max, paste-ready instruction.]",
      }));
    case "numbered":
      return [1, 2, 3, 4, 5].map((n) => ({
        type: "numbered",
        number: pad(n),
        title: `[Item ${n} title]`,
        body: "[3-line body.]",
      }));
    case "stat":
      return [
        {
          type: "stat",
          eyebrow: "THE NUMBER",
          preStat: "[Pre-stat line]",
          stat: "[X%]",
          postStat: "[post-stat line]",
          body: "[Body — what it means.]",
        },
      ];
    case "stats":
      return [
        {
          type: "stats",
          eyebrow: "BY THE NUMBERS",
          title: topic.hook,
          italicWord: topic.italic,
          stats: [
            { value: "[1.5M]", label: "[label]" },
            { value: "[$X]", label: "[label]" },
            { value: "[N%]", label: "[label]" },
          ],
        },
      ];
    case "results":
      return [
        {
          type: "results",
          eyebrow: "RESULTS",
          title: topic.hook,
          italicWord: topic.italic,
          results: [
            { value: "[1.5M]", label: "[label]" },
            { value: "[12K]", label: "[label]" },
            { value: "[$X]", label: "[label]" },
            { value: "[N%]", label: "[label]" },
          ],
          cta: "[Closing line — what's the punchline.]",
        },
      ];
    case "grid":
      return [
        {
          type: "grid",
          title: topic.hook,
          italicWord: topic.italic,
          cols: 2,
          cards: [1, 2, 3, 4].map((n) => ({
            number: pad(n),
            title: `[Card ${n}]`,
            body: "[Card body.]",
          })),
        },
      ];
    case "diagram":
      return [
        {
          type: "diagram",
          title: topic.hook,
          italicWord: topic.italic,
          tiers: [
            {
              label: "[TIER A]",
              nodes: [
                { title: "[Node 1]", sub: "[Sub 1]" },
                { title: "[Node 2]", sub: "[Sub 2]" },
                { title: "[Node 3]", sub: "[Sub 3]" },
              ],
            },
            {
              label: "[TIER B]",
              nodes: [
                { title: "[Node 1]", sub: "[Sub 1]" },
                { title: "[Node 2]", sub: "[Sub 2]" },
                { title: "[Node 3]", sub: "[Sub 3]" },
              ],
            },
          ],
          footer: "[One-line summary.]",
        },
      ];
    case "letter":
      return [
        {
          type: "letter",
          salutation: "[Dear new trader,]",
          body: "[Letter body — 2-3 short paragraphs, italic serif.]",
          signoff: "— Flowi",
        },
      ];
    case "quote":
      return [
        {
          type: "quote",
          quote: "[Pithy single-sentence quote.]",
          attribution: "Flowi · notebook",
        },
      ];
    case "fake-tweet":
      return [
        {
          type: "fake-tweet",
          author: "[Author Name]",
          handle: "[handle]",
          body: "[Tweet body — under 280 chars.]",
          timestamp: "[Date]",
          likes: "[N]",
          reposts: "[N]",
        },
      ];
    case "bullets":
      return [
        {
          type: "bullets",
          eyebrow: "WHAT TO KNOW",
          title: topic.hook,
          italicWord: topic.italic,
          bullets: [
            "[Bullet 1 — one tight sentence.]",
            "[Bullet 2.]",
            "[Bullet 3.]",
          ],
        },
      ];
    case "definition":
      return [
        {
          type: "definition",
          eyebrow: "TERM",
          term: "[Term]",
          partOfSpeech: "noun.",
          definition: "[2-3 sentence definition.]",
          example: "[An example use of the term.]",
        },
      ];
    default:
      return [
        {
          type: "numbered",
          number: "01",
          title: "[First point]",
          body: "[Body.]",
        },
        {
          type: "numbered",
          number: "02",
          title: "[Second point]",
          body: "[Body.]",
        },
      ];
  }
}

function stubCta(topic, cta) {
  return {
    type: "cta",
    hook: "Want the full",
    italicWord: "pack?",
    sub: "Free PDF. No upsell. Save this for when you're ready.",
    ctaKeyword: cta.keyword,
    ctaPromise: cta.promise,
  };
}

/* ─── main ────────────────────────────────────────────────────────── */

function pickTopics(library, args) {
  let candidates = library.topics.filter((t) => t.status === "planned");
  if (args.postIds.length) {
    return library.topics.filter((t) => args.postIds.includes(t.id));
  }
  if (args.topics.length) {
    candidates = candidates.filter((t) => args.topics.includes(t.topic));
  }
  if (args.verticals.length) {
    candidates = candidates.filter((t) => args.verticals.includes(t.vertical));
  }
  // Shuffle
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, args.count);
}

function buildSpec(topic, registry) {
  const cta = ctaForCourse(registry, topic.vertical, topic.topic);

  const today = new Date().toISOString().slice(0, 10);
  const handle = "@useflowi";

  const body = stubBodyForFormat(topic.format, topic);
  // Cover + body + final CTA
  const total = 1 + body.length + 1;
  const cover = stubCover(topic, total);
  const ctaSlide = stubCta(topic, cta);

  const slides = [
    { ...cover, index: 1, total },
    ...body.map((b, i) => ({ ...b, index: i + 2, total })),
    { ...ctaSlide, index: total, total },
  ];

  return {
    id: `${today}-${topic.id}`,
    title: `${topic.hook} ${topic.italic ?? ""}`.trim(),
    vertical: topic.vertical,
    topic: topic.topic,
    theme: themeFor(topic.vertical),
    handle,
    cta,
    caption: `${topic.hook} ${topic.italic ?? ""}`.trim(),
    hashtags: HASHTAGS[topic.vertical] ?? HASHTAGS.ai_general,
    slides,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const libPath = path.join(ROOT, "content", "topic-library.json");
  const library = JSON.parse(await fs.readFile(libPath, "utf8"));

  const registry = JSON.parse(
    await fs.readFile(path.join(ROOT, "content", "courses.json"), "utf8")
  );

  const picks = pickTopics(library, args);
  if (picks.length === 0) {
    console.error(
      "No planned topics matched the filters. Edit content/topic-library.json to add or unblock entries."
    );
    process.exit(1);
  }

  const outDir = path.join(ROOT, "content", "carousel-specs");
  await fs.mkdir(outDir, { recursive: true });

  console.log(`Drafting ${picks.length} carousel spec(s):\n`);
  for (const topic of picks) {
    const spec = buildSpec(topic, registry);
    const outFile = path.join(outDir, `${spec.id}.json`);
    if (existsSync(outFile)) {
      console.log(`  - SKIP: ${spec.id}.json already exists`);
      continue;
    }
    await fs.writeFile(outFile, JSON.stringify(spec, null, 2) + "\n");
    topic.status = "drafted";
    topic.drafted_at = new Date().toISOString();
    console.log(`  + ${spec.id}.json   (${topic.vertical} · ${topic.topic} · ${topic.format})`);
  }

  await fs.writeFile(libPath, JSON.stringify(library, null, 2) + "\n");

  console.log(`\nNext steps:`);
  console.log(`  1. Open content/carousel-specs/<id>.json — fill the [bracketed placeholders].`);
  console.log(`  2. In /admin/studio, paste the spec, hit "Render all slides" to preview.`);
  console.log(`  3. Click "Download deck (.zip)" — multi-platform pack drops to Downloads/.`);
  console.log(`  4. Post. When done, set status="posted" in topic-library.json.`);
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
