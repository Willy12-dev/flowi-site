#!/usr/bin/env node
/**
 * Strip markdown-style *emphasis* markers from carousel spec JSON files.
 *
 * The daily news engine emits `*word*` emphasis into text fields. The Satori
 * carousel templates render text literally, so those asterisks show up on the
 * finished slides. This script cleans a spec in place:
 *
 *   - Cover slides: a `*marked*` word inside `headline` is promoted into the
 *     headline / italicWord / headlineAfter split the Cover template expects,
 *     so the word still renders as the accent — just correctly.
 *   - Every other string field (titles, bodies, bullets, caption, ...): the
 *     asterisks are simply removed.
 *
 *   node scripts/strip-spec-emphasis.mjs content/carousel-specs/news-2026-05-21-*.json
 */

import fs from "node:fs/promises";

function stripStars(v) {
  if (typeof v === "string") return v.replace(/\*/g, "");
  if (Array.isArray(v)) return v.map(stripStars);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = stripStars(val);
    return out;
  }
  return v;
}

/** Cover: promote the first *marked* word in the headline into the accent slot. */
function splitCoverHeadline(slide) {
  if (slide.type !== "cover" || typeof slide.headline !== "string") return slide;
  const m = slide.headline.match(/^(.*?)\*([^*]+)\*(.*)$/);
  if (!m) return slide;
  const headline = m[1].trim().replace(/\s+([.,!?:;])/g, "$1");
  let italicWord = m[2].trim();
  let after = m[3].trim();
  // Trailing punctuation belongs tight against the accent word — not floated
  // after the inter-word gap the template inserts before headlineAfter.
  const lead = after.match(/^([.,!?:;]+)\s*(.*)$/);
  if (lead) {
    italicWord += lead[1];
    after = lead[2].trim();
  }
  return {
    ...slide,
    headline,
    italicWord,
    ...(after ? { headlineAfter: after } : {}),
  };
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("usage: strip-spec-emphasis.mjs <spec.json> [<spec.json> ...]");
    process.exit(1);
  }
  for (const file of files) {
    const spec = JSON.parse(await fs.readFile(file, "utf8"));
    if (Array.isArray(spec.slides)) {
      spec.slides = spec.slides.map((slide) => {
        // Cover: promote the *marked* word into the headline accent split.
        if (slide.type === "cover") return splitCoverHeadline(slide);
        // Other slides render `italicWord` as a separate accent line. The
        // news engine duplicates a word already in the title into it, which
        // double-renders. Drop the redundant field on non-cover slides.
        const { italicWord: _drop, ...rest } = slide;
        return rest;
      });
    }
    const clean = stripStars(spec);
    await fs.writeFile(file, JSON.stringify(clean, null, 2) + "\n");
    console.log(`cleaned ${file}`);
  }
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
