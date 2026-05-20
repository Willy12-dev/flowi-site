#!/usr/bin/env node
/**
 * generate-blog-heroes.mjs — concept-visualizing blog hero generator.
 *
 * Scans content/blog/*.md and identifies articles whose frontmatter image
 * already points at /images/blog/<slug>.png but the PNG file doesn't
 * actually exist yet. Generates the missing heroes via the Higgsfield
 * REST API in the cohesive vintage-editorial style — same DNA as the
 * carousel/cartoon identity.
 *
 * SAFE BY DEFAULT
 *   • Default mode is --list: prints what's pending, NO api calls, NO
 *     credits spent. The cron runs this safe mode until you flip it.
 *   • --generate is opt-in and requires HIGGSFIELD_API_KEY.
 *   • --limit caps generations per run (default 5) so a runaway never
 *     burns the monthly budget.
 *
 * FORWARD-ONLY
 *   Only articles whose frontmatter image is already the per-slug path
 *   (written by the updated specs-to-articles.mjs) are queued. Old
 *   articles with stock-fallback paths are skipped unless --backfill.
 *
 * USAGE
 *   node scripts/generate-blog-heroes.mjs                       (list only)
 *   node scripts/generate-blog-heroes.mjs --generate            (gen up to 5)
 *   node scripts/generate-blog-heroes.mjs --generate --limit 3
 *   node scripts/generate-blog-heroes.mjs --generate --backfill --limit 2
 *
 * SETUP
 *   1. Get an API key from cloud.higgsfield.ai → API.
 *   2. Add HIGGSFIELD_API_KEY=... to .env.local.
 *   3. Run `--generate` manually once to verify; then update the cron
 *      .ps1 to call this with --generate --limit N.
 */

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const IMG_DIR = path.join(ROOT, "public", "images", "blog");

const args = process.argv.slice(2);
const MODE_GENERATE = args.includes("--generate");
const BACKFILL = args.includes("--backfill");
const LIMIT = parseLimit(args);

/* The cohesive Flowi visual identity — one DNA across blog heroes, the
   homepage Dispatch image, and (next) the carousel cover.  Black ink +
   muted red + warm ochre on aged paper, conceptual, NO baked text. */
const STYLE_PROMPT_TEMPLATE = `Vintage editorial magazine illustration, conceptual, in the New Yorker / The Economist register. CONCEPT: __CONCEPT__. Render a single conceptual visual metaphor that captures the thesis — do not illustrate literally; find the editorial conceit, the abstract image that makes the argument visible. Confident hand-drawn ink linework, limited palette: black ink plus one muted red and a warm ochre accent, off-white aged-paper background, subtle print grain. ABSOLUTELY NO text, no words, no letters, no labels, no numbers anywhere. Editorial, intelligent. Flat print look, no photorealism, no 3D. Wide landscape composition.`;

const HF_BASE = "https://api.higgsfield.ai";
const HF_MODEL = "nano_banana"; // budget, ~1 credit, proven for no-text concept art
const HF_ASPECT = "16:9";
const HF_WIDTH = 1344;
const HF_HEIGHT = 768;

function parseLimit(arr) {
  const i = arr.indexOf("--limit");
  if (i < 0) return 5;
  const n = Number(arr[i + 1]);
  return Number.isFinite(n) && n > 0 ? n : 5;
}

/* Minimal YAML-ish frontmatter parser — only what we need (title /
   description / image). Avoids pulling gray-matter into a CLI script. */
function parseFrontmatter(md) {
  if (!md.startsWith("---")) return null;
  const end = md.indexOf("\n---", 3);
  if (end < 0) return null;
  const fm = md.slice(3, end);
  const out = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([a-zA-Z_]+):\s*"?([^"]*)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return { fm: out, body: md.slice(end + 4).replace(/^\n+/, "") };
}

async function listArticles() {
  const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
  const articles = [];
  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    const full = path.join(BLOG_DIR, f);
    const raw = await fs.readFile(full, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;
    const image = parsed.fm.image || "";
    const expected = `/images/blog/${slug}.png`;
    const imgPath = path.join(IMG_DIR, `${slug}.png`);
    const hasPng = existsSync(imgPath);
    const usesNewPath = image === expected;
    const lead = parsed.body
      .split("\n\n")[0]
      ?.replace(/\s+/g, " ")
      .trim() || "";
    articles.push({
      slug,
      mdPath: full,
      title: parsed.fm.title || slug,
      description: parsed.fm.description || "",
      lead,
      image,
      expected,
      hasPng,
      usesNewPath,
    });
  }
  return articles;
}

function buildPrompt({ title, description, lead }) {
  // Prefer the article's own thesis (description). Fall back to title + lead.
  const concept = (description || `${title} — ${lead}`)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
  return STYLE_PROMPT_TEMPLATE.replace("__CONCEPT__", concept);
}

/* Higgsfield REST API client. Async: POST returns an id, GET polls until
   completed, then we fetch the output URL. If the canonical schema ever
   shifts, this single function is the only thing to update — the rest of
   the sidecar (scanning, prompts, saving, idempotency) is unaffected. */
async function callHiggsfield(prompt) {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    throw new Error(
      "HIGGSFIELD_API_KEY env var is required for --generate. Get one at cloud.higgsfield.ai."
    );
  }

  const submitRes = await fetch(`${HF_BASE}/v1/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: "text-to-image",
      model: HF_MODEL,
      prompt,
      aspect_ratio: HF_ASPECT,
      width: HF_WIDTH,
      height: HF_HEIGHT,
    }),
  });
  if (!submitRes.ok) {
    const t = await submitRes.text();
    throw new Error(`submit ${submitRes.status}: ${t.slice(0, 300)}`);
  }
  const submitJson = await submitRes.json();
  const jobId =
    submitJson.id ||
    submitJson.job_id ||
    submitJson?.results?.[0]?.id;
  if (!jobId) {
    throw new Error(
      `no job id in response: ${JSON.stringify(submitJson).slice(0, 300)}`
    );
  }

  // Poll up to ~2 minutes (60 × 2s)
  const MAX_POLLS = 60;
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(`${HF_BASE}/v1/generations/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) {
      const t = await statusRes.text();
      throw new Error(`poll ${statusRes.status}: ${t.slice(0, 300)}`);
    }
    const j = await statusRes.json();
    const status = j.status || j?.results?.[0]?.status;
    if (status === "completed") {
      const url =
        j?.results?.rawUrl ||
        j?.results?.[0]?.results?.rawUrl ||
        j?.output_url ||
        j?.url;
      if (!url) {
        throw new Error(
          `completed but no output url: ${JSON.stringify(j).slice(0, 300)}`
        );
      }
      return url;
    }
    if (status === "failed" || status === "error") {
      throw new Error(`job failed: ${JSON.stringify(j).slice(0, 300)}`);
    }
  }
  throw new Error(`job ${jobId} did not complete in ${MAX_POLLS * 2}s`);
}

async function downloadTo(url, target) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status}: ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(target, buf);
}

async function rewriteFrontmatterImage(mdPath, newImage) {
  const raw = await fs.readFile(mdPath, "utf8");
  const updated = raw.replace(
    /^image:\s*"[^"]*"\s*$/m,
    `image: "${newImage}"`
  );
  if (updated === raw) return false;
  await fs.writeFile(mdPath, updated);
  return true;
}

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });

  const all = await listArticles();
  const pending = all.filter((a) => {
    if (a.hasPng) return false;
    if (a.usesNewPath) return true;
    return BACKFILL;
  });

  console.log(
    `scanned ${all.length} article(s); ${pending.length} pending hero(es)${
      BACKFILL ? " [backfill mode]" : ""
    }.`
  );

  if (!MODE_GENERATE) {
    if (pending.length === 0) {
      console.log("  nothing to do.");
    } else {
      console.log("Pending:");
      for (const a of pending.slice(0, 20)) {
        console.log(`  - ${a.slug}${a.usesNewPath ? "" : " [backfill]"}`);
      }
      if (pending.length > 20) {
        console.log(`  ... and ${pending.length - 20} more`);
      }
      console.log(
        `\nDry-run only. Pass --generate (and set HIGGSFIELD_API_KEY) to actually generate.`
      );
    }
    return;
  }

  if (!process.env.HIGGSFIELD_API_KEY) {
    console.error(
      "FATAL: HIGGSFIELD_API_KEY env var is required for --generate. Get one at cloud.higgsfield.ai -> API."
    );
    process.exit(1);
  }

  const batch = pending.slice(0, LIMIT);
  console.log(
    `Generating ${batch.length} of ${pending.length} pending (limit=${LIMIT}).\n`
  );

  let ok = 0;
  let fail = 0;
  for (const a of batch) {
    try {
      const prompt = buildPrompt(a);
      console.log(`  > ${a.slug} ...`);
      const url = await callHiggsfield(prompt);
      const target = path.join(IMG_DIR, `${a.slug}.png`);
      await downloadTo(url, target);
      if (!a.usesNewPath) {
        await rewriteFrontmatterImage(a.mdPath, a.expected);
      }
      console.log(`    ok saved -> public${a.expected}`);
      ok++;
    } catch (e) {
      console.error(`    fail ${a.slug}: ${e.message}`);
      fail++;
    }
  }

  console.log(
    `\nDone. ${ok} generated, ${fail} failed, ${
      pending.length - batch.length
    } still pending after this run.`
  );
  if (fail > 0) process.exitCode = 2;
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
