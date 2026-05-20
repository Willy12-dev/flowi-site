#!/usr/bin/env node
/**
 * specs-to-articles.mjs — turn carousel specs into published blog articles.
 *
 * Deterministic. No API calls. No rate limits. Each
 * content/carousel-specs/news-*.json becomes a content/blog/<slug>.md
 * article with frontmatter that matches the existing 81 articles, so it
 * renders on useflowi.app/blog the moment Vercel deploys.
 *
 * Idempotent: skips an article if its .md already exists.
 *
 * Run:           node scripts/specs-to-articles.mjs
 * Backfill all:  node scripts/specs-to-articles.mjs --all
 * Dry run:       node scripts/specs-to-articles.mjs --dry
 *
 * The news-engine cron calls this after drafting so every news item
 * that produces a carousel ALSO produces a live article — zero human step.
 */

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SPECS_DIR = path.join(ROOT, "content", "carousel-specs");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const ALL = args.includes("--all");

/* Hero image per vertical — must point at a file that already exists in
   public/images/blog/ so the article never renders a broken hero. */
const IMAGE_BY_VERTICAL = {
  ai_builder: "/images/blog/best-books-for-building-ai-agents-in-2026.jpg",
  ai_trading: "/images/blog/why-retail-algo-trading-systems-fail-at-month-four.jpg",
  ai_behavior: "/images/blog/why-habit-tracker-apps-dont-survive-the-third-month.jpg",
  ai_general: "/images/blog/code-with-claude-2026-what-actually-shipped.jpg",
};

/* Funnel link per vertical for the closing CTA. */
const FUNNEL_BY_VERTICAL = {
  ai_builder: { name: "the AI Builder's Field Guide", url: "https://useflowi.app/courses" },
  ai_trading: { name: "FlowiAI Trader", url: "https://useflowi.app/trader" },
  ai_behavior: { name: "Woyuduin", url: "https://woyuduin.com" },
  ai_general: { name: "the Flowi catalog", url: "https://useflowi.app/courses" },
};

function yamlEscape(s) {
  return String(s).replace(/"/g, '\\"');
}

function slugFromSpecId(id) {
  // news-2026-05-14-anthropic-900b -> 2026-05-14-anthropic-900b
  return id.replace(/^news-/, "");
}

function joinSentence(parts) {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/* Turn one slide into a markdown section. */
function slideToMarkdown(slide) {
  switch (slide.type) {
    case "cover":
    case "highlight-cover":
      return ""; // handled as the lead, not a body section
    case "numbered":
      return `## ${slide.number ? slide.number + ". " : ""}${slide.title}\n\n${slide.body}\n`;
    case "step":
      return `## Step ${slide.stepNumber}: ${slide.title}\n\n${slide.body}\n`;
    case "bullets": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const lines = (slide.bullets || []).map((b) => `- ${b}`).join("\n");
      return `## ${head}\n\n${lines}\n${slide.footer ? "\n*" + slide.footer + "*\n" : ""}`;
    }
    case "definition":
      return `## ${slide.term}${slide.partOfSpeech ? " — *" + slide.partOfSpeech + "*" : ""}\n\n${slide.definition}\n${slide.example ? "\n> " + slide.example + "\n" : ""}`;
    case "stat":
      return `## ${joinSentence([slide.eyebrow])}\n\n${joinSentence([slide.preStat, "**" + slide.stat + "**", slide.postStat])}. ${slide.body || ""}\n`;
    case "stats": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const lines = (slide.stats || []).map((s) => `- **${s.value}** — ${s.label}`).join("\n");
      return `## ${head}\n\n${lines}\n`;
    }
    case "results": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const lines = (slide.results || []).map((r) => `- **${r.value}** ${r.label}`).join("\n");
      return `## ${head}\n\n${lines}\n${slide.cta ? "\n*" + slide.cta + "*\n" : ""}`;
    }
    case "compare": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const left = (slide.left?.items || []).map((i) => `- ${i}`).join("\n");
      const right = (slide.right?.items || []).map((i) => `- ${i}`).join("\n");
      return `## ${head}\n\n**${slide.left?.label || "Before"}**\n\n${left}\n\n**${slide.right?.label || "After"}**\n\n${right}\n`;
    }
    case "audience": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const lines = (slide.audiences || []).map((a) => `- **${a.pill}** — ${a.body}`).join("\n");
      return `## ${head}\n\n${lines}\n`;
    }
    case "diagram": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const tiers = (slide.tiers || [])
        .map((t) => `**${t.label}**\n\n` + (t.nodes || []).map((n) => `- ${n.title}${n.sub ? " — " + n.sub : ""}`).join("\n"))
        .join("\n\n");
      return `## ${head}\n\n${tiers}\n${slide.footer ? "\n*" + slide.footer + "*\n" : ""}`;
    }
    case "table": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const rows = (slide.rows || []).map((r) => `- ${r.label}: **${r.metric}**`).join("\n");
      return `## ${head}\n\n${rows}\n${slide.footer ? "\n*" + slide.footer + "*\n" : ""}`;
    }
    case "grid": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const cards = (slide.cards || []).map((c) => `- **${c.title}** — ${c.body || ""}`).join("\n");
      return `## ${head}\n\n${cards}\n`;
    }
    case "prompt-card": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const cmds = (slide.commands || []).map((c) => `- \`${c.slash}\` — ${c.label}`).join("\n");
      return `## ${head}\n\n${slide.intro || ""}\n\n${cmds}\n`;
    }
    case "badge": {
      const head = joinSentence([slide.title, slide.italicWord]);
      const list = (slide.badges || []).map((b) => `- **${b.label}**${b.sub ? " — " + b.sub : ""}`).join("\n");
      return `## ${head}\n\n${list}\n`;
    }
    case "quote":
      return `> ${slide.quote}\n${slide.attribution ? "\n> — " + slide.attribution + "\n" : ""}`;
    case "letter":
      return `${slide.salutation}\n\n${slide.body}\n${slide.signoff ? "\n" + slide.signoff + "\n" : ""}`;
    case "fake-tweet":
      return `> "${slide.body}"\n>\n> — ${slide.author} (${slide.handle})\n`;
    case "cta":
      return ""; // handled as the closing block
    default:
      return "";
  }
}

function buildArticle(spec) {
  const vertical = spec.vertical || "ai_general";
  const cover = (spec.slides || []).find(
    (s) => s.type === "cover" || s.type === "highlight-cover"
  );
  const cta = (spec.slides || []).find((s) => s.type === "cta");
  const body = (spec.slides || []).filter(
    (s) => s.type !== "cover" && s.type !== "highlight-cover" && s.type !== "cta"
  );

  // Lead paragraph from the cover
  let lead = "";
  if (cover) {
    if (cover.type === "cover") {
      lead = joinSentence([cover.headline, cover.italicWord, cover.headlineAfter, "—", cover.sub]);
    } else {
      lead = joinSentence([cover.highlightedHook, cover.followUp, "—", cover.sub]);
    }
  }
  lead = lead || spec.caption || spec.title;

  const sections = body.map(slideToMarkdown).filter(Boolean).join("\n\n");

  // Vertical-aware contextual backlink — every article becomes a do-follow
  // link to a money page (woyuduin.com / /trader / /courses). The SEO lever:
  // 124+ indexed articles all pointing at the products.
  const backlink =
    vertical === "ai_trading"
      ? "If you trade, the execution system behind this thinking is [FlowiAI Trader](https://useflowi.app/trader)."
      : vertical === "ai_behavior"
        ? "If you're working on the behavior-change side, [Woyuduin](https://woyuduin.com) turns this into daily practice."
        : "The deep-dive playbooks that go past any single news cycle live in [the Flowi catalog](https://useflowi.app/courses).";

  const closing = [
    `## The bottom line`,
    "",
    cta
      ? joinSentence([cta.hook, cta.italicWord, cta.hookAfter, cta.sub])
      : "The pattern here is the same one we keep seeing across the AI landscape — the teams that win are the ones that systematize before they scale.",
    "",
    // EMAIL FIRST — cold readers won't buy a $9 thing, but they'll subscribe.
    `**Want this every morning?** We break down a story like this daily — the release, why it matters, who should care. [Get the free Flowi brief by email →](https://useflowi.app/dispatch) No fluff, one-click unsubscribe.`,
    "",
    backlink,
    "",
  ].join("\n");

  // Trim to <=240 chars at a word boundary so it never cuts mid-word.
  const rawDesc = (spec.caption || lead).replace(/\s+/g, " ").trim();
  let description = rawDesc;
  if (rawDesc.length > 240) {
    description = rawDesc.slice(0, 240).replace(/\s+\S*$/, "").trim() + "…";
  }
  const tags = (spec.hashtags || []).slice(0, 6);
  const keywords = [spec.topic, ...(spec.hashtags || [])].filter(Boolean).slice(0, 8);
  const today = new Date().toISOString().slice(0, 10);

  const frontmatter = [
    "---",
    `title: "${yamlEscape(spec.title)}"`,
    `description: "${yamlEscape(description)}"`,
    `date: "${today}"`,
    `category: "${vertical}"`,
    "tags:",
    ...tags.map((t) => `  - "${yamlEscape(t)}"`),
    "keywords:",
    ...keywords.map((k) => `  - "${yamlEscape(k)}"`),
    `author: "Flowi Editorial"`,
    // Per-slug hero path. The actual PNG is generated by the sidecar
    // scripts/generate-blog-heroes.mjs (forward-only: only new articles
    // get this new-style path; existing articles keep their fallbacks
    // until --backfill is run). The next.js Image component renders the
    // file at public/images/blog/<slug>.png once it exists.
    `image: "/images/blog/${slug}.png"`,
    "---",
    "",
  ].join("\n");

  const md = `${frontmatter}${lead}\n\n${sections}\n\n${closing}`;
  return md;
}

async function main() {
  const files = (await fs.readdir(SPECS_DIR)).filter(
    (f) => f.startsWith("news-") && f.endsWith(".json")
  );

  let written = 0;
  let skipped = 0;
  const created = [];

  for (const f of files) {
    let spec;
    try {
      spec = JSON.parse(await fs.readFile(path.join(SPECS_DIR, f), "utf8"));
    } catch {
      console.error(`  skip (bad JSON): ${f}`);
      continue;
    }

    const slug = slugFromSpecId(spec.id || f.replace(/\.json$/, ""));
    const outPath = path.join(BLOG_DIR, `${slug}.md`);

    if (existsSync(outPath) && !ALL) {
      skipped++;
      continue;
    }

    const md = buildArticle(spec);
    if (DRY) {
      console.log(`  would write: content/blog/${slug}.md  (${md.split(/\s+/).length} words)`);
      written++;
      continue;
    }
    await fs.writeFile(outPath, md);
    created.push(slug);
    written++;
    console.log(`  + content/blog/${slug}.md`);
  }

  console.log(
    `\nDone. ${written} article(s) ${DRY ? "would be" : ""} written, ${skipped} already existed.`
  );
  if (created.length > 0) {
    console.log("\nLive after next deploy:");
    for (const s of created.slice(0, 10)) {
      console.log(`  https://useflowi.app/blog/${s}`);
    }
    if (created.length > 10) console.log(`  ... and ${created.length - 10} more`);
  }
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
