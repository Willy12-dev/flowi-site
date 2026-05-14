#!/usr/bin/env node
/**
 * Flowi News Engine — autonomous daily content drafter.
 *
 * Pipeline:
 *   1. Poll ~18 AI/AI-company RSS + Atom feeds in parallel
 *   2. Dedupe vs `content/news-engine-state.json`
 *   3. Filter to items < 36h old, rank newest-first
 *   4. For the top N items, call Anthropic API → Claude writes a full
 *      publication-ready CarouselSpec for each
 *   5. Write each spec to `content/carousel-specs/news-<date>-<slug>.json`
 *   6. Update state file
 *   7. Email digest via Resend
 *
 * Runs in GitHub Actions (free tier). NO paid MCPs / NO paid services
 * beyond the Anthropic API and Resend (already used).
 *
 * Required env (set as GitHub Actions secrets):
 *   ANTHROPIC_API_KEY        — Claude API access
 *   RESEND_API_KEY           — for digest email (optional)
 *   OPS_EMAIL_TO             — digest recipient (optional)
 *   OPS_EMAIL_FROM           — digest from-address (optional)
 *
 * Run manually:    node scripts/news-engine.mjs
 * Run dry:         node scripts/news-engine.mjs --dry
 * Force N items:   node scripts/news-engine.mjs --count 3
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/* ─── CONFIG ──────────────────────────────────────────────────────── */

const ANTHROPIC_MODEL =
  process.env.NEWS_ENGINE_MODEL || "claude-sonnet-4-5-20250929";

const DEFAULT_MAX_DRAFTS = 10;
const FRESHNESS_HOURS = 36;
const SEEN_HISTORY_CAP = 2000;

/** Free RSS / Atom feeds covering the major AI labs + product news.
 *  Mix: direct lab feeds (where they exist) + Google News fallbacks for
 *  the labs whose RSS has moved/closed + general AI publications.
 *  Google News URL pattern: `https://news.google.com/rss/search?q=<query>&hl=en-US&gl=US&ceid=US:en`
 */
const FEEDS = [
  // ─ Lab announcements (direct where available, Google News otherwise)
  { label: "OpenAI",         url: "https://openai.com/blog/rss.xml",                          vertical: "ai_builder", topic_hint: "chatgpt" },
  { label: "Anthropic (news)", url: "https://news.google.com/rss/search?q=Anthropic+OR+%22Claude+AI%22&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "claude" },
  { label: "Google AI",      url: "https://blog.google/technology/ai/rss/",                   vertical: "ai_builder", topic_hint: "gemini" },
  { label: "DeepMind",       url: "https://deepmind.google/blog/rss.xml",                     vertical: "ai_builder", topic_hint: "gemini" },
  { label: "Meta AI (news)", url: "https://news.google.com/rss/search?q=%22Meta+AI%22+OR+Llama&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "builder" },
  { label: "Hugging Face",   url: "https://huggingface.co/blog/feed.xml",                     vertical: "ai_builder", topic_hint: "builder" },
  { label: "Mistral (news)", url: "https://news.google.com/rss/search?q=%22Mistral+AI%22&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "builder" },
  { label: "Cohere",         url: "https://cohere.com/blog/rss.xml",                          vertical: "ai_builder", topic_hint: "builder" },
  { label: "Midjourney (news)", url: "https://news.google.com/rss/search?q=Midjourney+OR+%22Stable+Diffusion%22&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "midjourney" },
  { label: "xAI / Grok",     url: "https://news.google.com/rss/search?q=%22xAI%22+OR+Grok&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "grok" },
  { label: "Perplexity",     url: "https://news.google.com/rss/search?q=Perplexity+AI&hl=en-US&gl=US&ceid=US:en",  vertical: "ai_builder", topic_hint: "perplexity" },
  { label: "Runway",         url: "https://news.google.com/rss/search?q=%22RunwayML%22+OR+%22Runway+AI%22+OR+%22Gen-3+Alpha%22&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "runway" },
  { label: "Cursor / coding", url: "https://news.google.com/rss/search?q=%22Cursor+AI%22+OR+%22GitHub+Copilot%22&hl=en-US&gl=US&ceid=US:en", vertical: "ai_builder", topic_hint: "cursor" },

  // ─ AI publications (broader coverage)
  { label: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/",                vertical: "ai_builder", topic_hint: "builder" },
  { label: "The Verge AI",   url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", vertical: "ai_builder", topic_hint: "builder" },
  { label: "TechCrunch AI",  url: "https://techcrunch.com/category/artificial-intelligence/feed/", vertical: "ai_builder", topic_hint: "builder" },
  { label: "Ars Technica AI", url: "https://feeds.arstechnica.com/arstechnica/index",         vertical: "ai_builder", topic_hint: "builder" },

  // ─ Community
  { label: "Hacker News (AI)", url: "https://hnrss.org/newest?q=AI+OR+LLM+OR+OpenAI+OR+Anthropic&points=50", vertical: "ai_builder", topic_hint: "builder" },
  { label: "Product Hunt (AI)", url: "https://www.producthunt.com/feed?category=artificial-intelligence",    vertical: "ai_builder", topic_hint: "builder" },
];

/* ─── ARGS ────────────────────────────────────────────────────────── */

function parseArgs() {
  const argv = process.argv.slice(2);
  const out = { dry: false, count: DEFAULT_MAX_DRAFTS };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry") out.dry = true;
    else if (a === "--count") out.count = parseInt(argv[++i], 10);
  }
  return out;
}

/* ─── FEED FETCH + PARSE ─────────────────────────────────────────── */

async function fetchFeed(feed) {
  try {
    const r = await fetch(feed.url, {
      headers: { "User-Agent": "FlowiNewsEngine/1.0 (+https://useflowi.app)" },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const xml = await r.text();
    return parseFeedXml(xml, feed);
  } catch (e) {
    console.error(`  feed FAIL: ${feed.label} — ${e.message}`);
    return [];
  }
}

function parseFeedXml(xml, feed) {
  const out = [];

  // RSS 2.0 <item> blocks
  for (const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const block = m[1];
    const item = {
      title: stripTags(extract(block, "title")),
      link: extract(block, "link") || extract(block, "guid"),
      pubDate:
        extract(block, "pubDate") ||
        extract(block, "dc:date") ||
        new Date().toISOString(),
      description: stripTags(
        extract(block, "description") || extract(block, "content:encoded")
      ).slice(0, 1500),
      source: feed.label,
      vertical: feed.vertical,
      topic_hint: feed.topic_hint,
    };
    if (item.title && item.link) out.push(item);
  }

  // Atom <entry> blocks
  for (const m of xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)) {
    const block = m[1];
    const linkMatch =
      block.match(/<link[^>]*\bhref="([^"]+)"[^>]*\/?>/) || [];
    const item = {
      title: stripTags(extract(block, "title")),
      link: linkMatch[1] || "",
      pubDate:
        extract(block, "published") ||
        extract(block, "updated") ||
        new Date().toISOString(),
      description: stripTags(
        extract(block, "summary") || extract(block, "content")
      ).slice(0, 1500),
      source: feed.label,
      vertical: feed.vertical,
      topic_hint: feed.topic_hint,
    };
    if (item.title && item.link) out.push(item);
  }

  return out;
}

function extract(block, tag) {
  const cdata = block.match(
    new RegExp(`<${tag}\\b[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i")
  );
  if (cdata) return cdata[1].trim();
  const plain = block.match(
    new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  );
  if (plain) return plain[1].trim();
  return "";
}

function stripTags(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    // numeric entities — &#39; &#8217; etc
    .replace(/&#(\d+);/g, (_, n) => {
      const code = parseInt(n, 10);
      return code > 0 && code < 0x10000 ? String.fromCharCode(code) : "";
    })
    // hex entities — &#x27;
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    // common named entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

/* ─── STATE ──────────────────────────────────────────────────────── */

const STATE_PATH = path.join(ROOT, "content", "news-engine-state.json");

async function loadState() {
  try {
    return JSON.parse(await fs.readFile(STATE_PATH, "utf8"));
  } catch {
    return {
      seen: [],
      last_run: null,
      last_run_count: 0,
      last_run_items: [],
      total_drafted: 0,
    };
  }
}

async function saveState(state) {
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

/* ─── COURSES (for CTA routing) ──────────────────────────────────── */

async function loadCourses() {
  return JSON.parse(
    await fs.readFile(path.join(ROOT, "content", "courses.json"), "utf8")
  );
}

function pickCtaForTopic(courses, topicHint, vertical) {
  if (topicHint) {
    const m = courses.courses.find((c) =>
      c.topics.includes(topicHint.toLowerCase())
    );
    if (m) return { keyword: m.cta_keyword, promise: m.cta_promise, slug: m.slug };
  }
  const v = courses.courses.find(
    (c) => c.vertical === vertical && c.status === "live"
  );
  if (v) return { keyword: v.cta_keyword, promise: v.cta_promise, slug: v.slug };
  return { keyword: "FLOWI", promise: "for the full pack", slug: null };
}

/* ─── CLAUDE AGENT ───────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are the editorial voice of Flowi — an AI publication that prints like The Information meets MKBHD.

You write Instagram carousel specs that pass for a senior editor's work at a top-tier AI newsletter. Editorial, contrarian, specific. Never AI-glossy ("dive into", "unlock", "unleash"). Never bracketed placeholders. Every word ships as written.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching the CarouselSpec schema. No prose, no markdown code fences, no commentary. The first character of your reply MUST be \`{\` and the last MUST be \`}\`.

SCHEMA:
{
  "id": "kebab-case-slug (≤ 60 chars, no date prefix — caller adds it)",
  "title": "Editorial-only working title, not rendered on the image",
  "vertical": "ai_builder" | "ai_trading" | "ai_behavior" | "ai_general",
  "topic": "kebab_case_topic (e.g. \\"claude\\", \\"chatgpt\\", \\"gemini\\", \\"grok\\", \\"midjourney\\", \\"runway\\", \\"suno\\", \\"elevenlabs\\", \\"cursor\\", \\"v0\\", \\"notebooklm\\", \\"perplexity\\", \\"builder\\")",
  "theme": "editorial-cream" | "premium-dark",
  "handle": "@useflowi",
  "cta": { "keyword": "...", "promise": "..." },
  "caption": "Instagram caption — 180-260 chars. Hook + 1 value bullet + CTA. No emoji spam.",
  "hashtags": ["8-12 relevant hashtags, no leading #"],
  "slides": [
    { "type": "cover", "index": 1, "total": N, "eyebrow": "...", "headline": "...", "italicWord": "...", "sub": "..." },
    ...4-6 body slides,
    { "type": "cta", "index": N, "total": N, "hook": "...", "italicWord": "...", "ctaKeyword": "...", "ctaPromise": "...", "sub": "..." }
  ]
}

BODY SLIDE TYPES (mix 2–3 different ones per carousel):
- numbered: { type, index, total, number: "01", title: "...", body: "..." }
- step: { type, index, total, stepNumber: "01", stepLabel: "STEP", title: "...", body: "..." }
- definition: { type, index, total, eyebrow: "...", term: "...", partOfSpeech: "noun.", definition: "...", example: "..." }
- bullets: { type, index, total, eyebrow: "...", title: "...", italicWord: "...", bullets: ["...", "...", "..."], footer: "..." }
- stats: { type, index, total, eyebrow: "...", title: "...", italicWord: "...", stats: [{value, label}, ...] }
- stat: { type, index, total, eyebrow: "...", preStat: "...", stat: "73%", postStat: "...", body: "..." }
- compare: { type, index, total, title, italicWord, left: {label, items:[]}, right: {label, items:[]} }
- audience: { type, index, total, title, italicWord, audiences: [{pill, body}, ...] }
- quote: { type, index, total, quote, attribution }
- letter: { type, index, total, salutation, body, signoff }
- grid: { type, index, total, title, italicWord, cols: 2|3, cards: [{number, title, body}, ...] }
- table: { type, index, total, eyebrow, title, italicWord, columns: {label, metric}, rows: [{index, label, metric}, ...], footer }

EDITORIAL RULES:
1. Cover hook: contrarian or curiosity-gap. ≤12 words. The italicWord is the punchy bit you'd say with emphasis aloud.
2. Total slides: 6 to 8. (cover + 4-6 body + cta).
3. Body text per slide: ≤50 words. Tight.
4. Specific numbers always: "9 things" not "several", "$4,200" not "thousands", "month four" not "later".
5. No AI-glossy verbs: NEVER use "dive", "unlock", "unleash", "harness", "revolutionize", "game-changer", "leverage", "supercharge".
6. No placeholders. Every \`[bracket]\` you'd be tempted to leave: fill with a real, specific, plausible value.
7. Sources: when you cite a number or claim, ground it in the news item provided. If the item doesn't support a claim, don't make it.
8. Tone: how a smart friend would explain it over coffee. Direct, slightly contrarian, never preachy.

TOPIC / VERTICAL MAPPING:
- OpenAI/ChatGPT/GPT news → vertical: ai_builder, topic: "chatgpt", theme: "editorial-cream"
- Anthropic/Claude news → vertical: ai_builder, topic: "claude", theme: "editorial-cream"
- Google/Gemini/DeepMind news → vertical: ai_builder, topic: "gemini", theme: "editorial-cream"
- xAI/Grok news → vertical: ai_builder, topic: "grok", theme: "editorial-cream"
- Midjourney/Stability/image-gen news → vertical: ai_builder, topic: "midjourney", theme: "premium-dark"
- Cursor/Copilot/coding-AI news → vertical: ai_builder, topic: "cursor", theme: "premium-dark"
- Trading-specific AI news → vertical: ai_trading, theme: "premium-dark"
- Mental-health / behavior AI news → vertical: ai_behavior, theme: "editorial-cream"
- Generic AI industry news → vertical: ai_builder, topic: "builder", theme: "editorial-cream"`;

function buildUserPrompt(item, ctaSuggestion) {
  return `NEWS ITEM TO COVER:

Source: ${item.source}
Title: ${item.title}
Published: ${item.pubDate}
URL: ${item.link}

Summary:
${item.description || "(no summary in feed — work from the title)"}

Suggested CTA (from courses registry — use these exact values for the cta object + the cta slide's ctaKeyword/ctaPromise):
- keyword: "${ctaSuggestion.keyword}"
- promise: "${ctaSuggestion.promise}"

Now write the complete CarouselSpec for this item as raw JSON. First character must be \`{\`.`;
}

async function callClaude(item, courses) {
  const ctaSuggestion = pickCtaForTopic(courses, item.topic_hint, item.vertical);
  const userPrompt = buildUserPrompt(item, ctaSuggestion);

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Anthropic API ${r.status}: ${txt.slice(0, 300)}`);
  }
  const data = await r.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error(`No text in response: ${JSON.stringify(data).slice(0, 300)}`);

  // Some models pad with a leading newline / explanation. Find the first { and last }.
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first < 0 || last < 0) {
    throw new Error(`No JSON object in response: ${text.slice(0, 300)}`);
  }
  const json = text.slice(first, last + 1);
  let spec;
  try {
    spec = JSON.parse(json);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message} — text: ${json.slice(0, 300)}`);
  }

  // Sanity-fix: ensure indices and total are consistent
  if (Array.isArray(spec.slides)) {
    const total = spec.slides.length;
    spec.slides = spec.slides.map((s, i) => ({ ...s, index: i + 1, total }));
  }

  return spec;
}

/* ─── PERSISTENCE ────────────────────────────────────────────────── */

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function saveSpec(spec) {
  const stamp = todayStamp();
  const slug = slugify(spec.id || spec.title || "news");
  const id = `news-${stamp}-${slug}`;
  spec.id = id;
  const out = path.join(ROOT, "content", "carousel-specs", `${id}.json`);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, JSON.stringify(spec, null, 2) + "\n");
  return out;
}

/* ─── RESEND DIGEST ──────────────────────────────────────────────── */

async function sendDigest(drafted) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OPS_EMAIL_TO;
  const from = process.env.OPS_EMAIL_FROM || "onboarding@resend.dev";
  if (!apiKey || !to) {
    console.log("  (no RESEND_API_KEY/OPS_EMAIL_TO — skipping digest email)");
    return;
  }
  const stamp = todayStamp();

  const list = drafted
    .map(
      (d, i) =>
        `${String(i + 1).padStart(2, "0")}. ${d.title}\n    → ${d.source}\n    → spec: content/carousel-specs/${d.id}.json\n    → open in studio: https://useflowi.app/admin/studio\n    → original: ${d.url}\n`
    )
    .join("\n");

  const body = `Flowi news engine · ${stamp}

${drafted.length} carousel${drafted.length === 1 ? "" : "s"} drafted from today's AI news.

Review at: https://useflowi.app/admin/news-engine
Studio:    https://useflowi.app/admin/studio

──────────────────────────────────────────────────────────────────

${list}

──────────────────────────────────────────────────────────────────

Each spec is publication-ready. Open in /admin/studio, preview, download
the deck, post. If you want to re-draft from a different angle, edit the
spec.json directly — every word ships from there.
`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `[Flowi] ${drafted.length} carousels drafted — ${stamp}`,
      text: body,
    }),
  });

  if (!r.ok) {
    console.error(`  digest email FAIL: ${r.status} ${await r.text()}`);
  } else {
    console.log(`  digest email sent → ${to}`);
  }
}

/* ─── MAIN ───────────────────────────────────────────────────────── */

async function main() {
  const args = parseArgs();
  console.log(`Flowi News Engine · ${new Date().toISOString()}`);
  console.log(`Mode: ${args.dry ? "DRY" : "WRITE"} · max drafts: ${args.count}\n`);

  if (!args.dry && !process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY env var is required (set as GitHub secret)");
  }

  const [state, courses] = await Promise.all([loadState(), loadCourses()]);
  console.log(`State: ${state.seen.length} URLs seen, last run ${state.last_run ?? "never"}`);

  console.log(`\nFetching ${FEEDS.length} feeds in parallel...`);
  const allLists = await Promise.all(FEEDS.map(fetchFeed));
  const allItems = allLists.flat();
  console.log(`  → ${allItems.length} total items`);

  const cutoff = Date.now() - FRESHNESS_HOURS * 3600 * 1000;
  const seenSet = new Set(state.seen);
  const fresh = allItems
    .filter((i) => i.link && !seenSet.has(i.link))
    .filter((i) => {
      const t = new Date(i.pubDate).getTime();
      return !isNaN(t) && t >= cutoff;
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Dedupe by normalised title (sometimes same story appears across feeds)
  const titleSet = new Set();
  const deduped = [];
  for (const item of fresh) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").slice(0, 80);
    if (titleSet.has(key)) continue;
    titleSet.add(key);
    deduped.push(item);
  }

  const top = deduped.slice(0, args.count);
  console.log(`  → ${fresh.length} fresh (< ${FRESHNESS_HOURS}h), ${deduped.length} deduped, picking top ${top.length}`);

  if (top.length === 0) {
    console.log("\nNo fresh items. Done.");
    return;
  }

  if (args.dry) {
    console.log("\nDRY RUN — items that would be drafted:\n");
    for (let i = 0; i < top.length; i++) {
      console.log(`  ${String(i + 1).padStart(2, "0")}. [${top[i].source}] ${top[i].title}`);
    }
    return;
  }

  console.log(`\nDrafting ${top.length} carousel specs in parallel via ${ANTHROPIC_MODEL}...\n`);

  const results = await Promise.allSettled(top.map((item) => callClaude(item, courses)));

  const drafted = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      try {
        const filepath = await saveSpec(r.value);
        drafted.push({ ...r.value, source: top[i].source, url: top[i].link });
        console.log(`  ✓ ${path.basename(filepath)}`);
      } catch (e) {
        console.error(`  ✗ save FAIL for ${top[i].title}: ${e.message}`);
      }
    } else {
      console.error(`  ✗ draft FAIL for ${top[i].title}: ${r.reason?.message ?? r.reason}`);
    }
  }

  // Persist all attempted URLs (so failures don't re-attempt forever)
  state.seen = [...state.seen, ...top.map((i) => i.link)].slice(-SEEN_HISTORY_CAP);
  state.last_run = new Date().toISOString();
  state.last_run_count = drafted.length;
  state.last_run_items = drafted.map((d) => ({
    id: d.id,
    title: d.title,
    source: d.source,
    url: d.url,
    vertical: d.vertical,
    topic: d.topic,
  }));
  state.total_drafted = (state.total_drafted ?? 0) + drafted.length;
  await saveState(state);

  console.log(`\nDone. Drafted ${drafted.length}/${top.length}. Total ever: ${state.total_drafted}.`);

  if (drafted.length > 0) {
    await sendDigest(drafted);
  }
}

main().catch((e) => {
  console.error(`\nFATAL: ${e.message}`);
  process.exit(1);
});
