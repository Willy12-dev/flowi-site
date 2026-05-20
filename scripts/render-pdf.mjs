#!/usr/bin/env node
/**
 * render-pdf.mjs — generate branded editorial PDFs from blog markdown.
 *
 * Two modes (zero credit spend — pure code on top of existing content):
 *
 *   --article <slug>     One article → public/pdfs/<slug>.pdf
 *                        Lead magnet; the byline check in
 *                        app/blog/[slug]/page.tsx already gates "Download
 *                        PDF ↓" on this file existing.
 *
 *   --guide <guide-slug> 4 articles → public/pdfs/field-guides/<slug>.pdf
 *                        Compiled from content/field-guides.json — the $9
 *                        field guides referenced on /courses. Upload to
 *                        Gumroad against the matching vanity slug.
 *
 *   --all-articles       Render lead magnets for every blog article.
 *   --all-guides         Render every configured field guide.
 *
 * Fonts: Fraunces (display/serif) + Inter (body/sans), reused from the
 * same @fontsource packages Satori uses. wawoff2-decompressed to TTF and
 * cached under .next/fonts-cache-pdf/. Same brand typography as the site.
 *
 * Output: real text-rendered PDFs (selectable, searchable, accessible).
 * ~150–400 KB per article, ~600 KB – 1.2 MB per guide.
 */

import fs from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import matter from "gray-matter";
import { remark } from "remark";
import wawoff2 from "wawoff2";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
  Font,
  renderToFile,
} from "@react-pdf/renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const PDF_OUT = path.join(ROOT, "public", "pdfs");
const GUIDES_OUT = path.join(PDF_OUT, "field-guides");
const FONTS_CACHE = path.join(ROOT, ".next", "fonts-cache-pdf");
const FG_PATH = path.join(ROOT, "content", "field-guides.json");

const COLOR = {
  ink: "#161616",
  inkSoft: "#5C5854",
  inkMute: "#9C968A",
  bg: "#F4EFE3",
  bgElevated: "#EAE3D2",
  accent: "#B33A2D",
  rule: "#D4CFC2",
};

/* ── FONT REGISTRATION ─────────────────────────────── */

async function ensureTtf(family, weight, style, woff2Path) {
  await fs.mkdir(FONTS_CACHE, { recursive: true });
  const out = path.join(FONTS_CACHE, `${family}-${weight}-${style}.ttf`);
  if (!existsSync(out)) {
    const woff2Bytes = await fs.readFile(woff2Path);
    const ttf = await wawoff2.decompress(new Uint8Array(woff2Bytes));
    await fs.writeFile(out, Buffer.from(ttf));
  }
  return out;
}

async function registerFonts() {
  const NM = path.join(ROOT, "node_modules");
  const FACES = [
    ["Fraunces", 400, "normal", "@fontsource/fraunces/files/fraunces-latin-400-normal.woff2"],
    ["Fraunces", 600, "normal", "@fontsource/fraunces/files/fraunces-latin-600-normal.woff2"],
    ["Fraunces", 400, "italic", "@fontsource/fraunces/files/fraunces-latin-400-italic.woff2"],
    ["Fraunces", 600, "italic", "@fontsource/fraunces/files/fraunces-latin-600-italic.woff2"],
    ["Inter", 400, "normal", "@fontsource/inter/files/inter-latin-400-normal.woff2"],
    ["Inter", 600, "normal", "@fontsource/inter/files/inter-latin-600-normal.woff2"],
    ["Inter", 400, "italic", "@fontsource/inter/files/inter-latin-400-italic.woff2"],
    ["Inter", 600, "italic", "@fontsource/inter/files/inter-latin-600-italic.woff2"],
  ];
  const byFamily = {};
  for (const [family, weight, style, file] of FACES) {
    const ttfPath = await ensureTtf(family, weight, style, path.join(NM, file));
    byFamily[family] ??= { family, fonts: [] };
    byFamily[family].fonts.push({ src: ttfPath, fontWeight: weight, fontStyle: style });
  }
  for (const fam of Object.values(byFamily)) {
    Font.register(fam);
  }
  // Editorial typography never hyphenates — full words even if ragged.
  Font.registerHyphenationCallback((word) => [word]);
}

/* ── STYLES ────────────────────────────────────────── */

const styles = StyleSheet.create({
  coverPage: {
    backgroundColor: COLOR.bg,
    paddingHorizontal: 56,
    paddingTop: 64,
    paddingBottom: 56,
    flexDirection: "column",
  },
  contentPage: {
    backgroundColor: COLOR.bg,
    paddingHorizontal: 56,
    paddingTop: 68,
    paddingBottom: 64,
    flexDirection: "column",
  },
  outroPage: {
    backgroundColor: COLOR.bg,
    paddingHorizontal: 56,
    paddingTop: 90,
    paddingBottom: 56,
    flexDirection: "column",
    justifyContent: "center",
  },

  eyebrow: {
    fontFamily: "Inter",
    fontSize: 8.5,
    fontWeight: 600,
    color: COLOR.inkSoft,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 22,
  },
  displayTitle: {
    fontFamily: "Fraunces",
    fontSize: 36,
    fontWeight: 600,
    color: COLOR.ink,
    lineHeight: 1.06,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Fraunces",
    fontStyle: "italic",
    fontSize: 16,
    color: COLOR.inkSoft,
    lineHeight: 1.4,
    marginBottom: 24,
  },
  byline: {
    fontFamily: "Inter",
    fontStyle: "italic",
    fontSize: 9.5,
    color: COLOR.inkSoft,
    marginTop: 18,
  },
  coverImage: {
    width: "100%",
    height: 220,
    marginBottom: 32,
    objectFit: "cover",
  },
  rule: {
    width: 60,
    height: 2,
    backgroundColor: COLOR.accent,
    marginBottom: 22,
  },

  pageHeader: {
    position: "absolute",
    top: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Inter",
    fontSize: 8,
    color: COLOR.inkMute,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Inter",
    fontSize: 8,
    color: COLOR.inkMute,
    letterSpacing: 0.4,
  },

  paragraphView: {
    marginBottom: 11,
  },
  paragraph: {
    fontFamily: "Inter",
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.65,
  },
  h2View: {
    marginTop: 18,
    marginBottom: 8,
  },
  h2: {
    fontFamily: "Fraunces",
    fontSize: 20,
    fontWeight: 600,
    color: COLOR.ink,
    lineHeight: 1.15,
    letterSpacing: -0.2,
  },
  h3View: {
    marginTop: 14,
    marginBottom: 6,
  },
  h3: {
    fontFamily: "Fraunces",
    fontSize: 14,
    fontWeight: 600,
    color: COLOR.ink,
    lineHeight: 1.2,
  },
  blockquoteView: {
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.accent,
    marginVertical: 12,
  },
  blockquote: {
    fontFamily: "Fraunces",
    fontStyle: "italic",
    fontSize: 12,
    color: COLOR.inkSoft,
    lineHeight: 1.55,
  },
  listView: {
    marginBottom: 11,
    marginLeft: 4,
  },
  listItemView: {
    flexDirection: "row",
    marginBottom: 4,
  },
  listMarker: {
    fontFamily: "Inter",
    fontSize: 10.5,
    color: COLOR.accent,
    width: 16,
    lineHeight: 1.65,
  },
  listContent: {
    flex: 1,
  },
  codeView: {
    backgroundColor: COLOR.bgElevated,
    padding: 10,
    marginVertical: 10,
    borderRadius: 2,
  },
  code: {
    fontFamily: "Inter",
    fontSize: 9,
    color: COLOR.ink,
    lineHeight: 1.5,
  },
  hr: {
    height: 1,
    backgroundColor: COLOR.rule,
    marginVertical: 16,
  },

  outroEyebrow: {
    fontFamily: "Inter",
    fontSize: 9,
    fontWeight: 600,
    color: COLOR.inkSoft,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 22,
    textAlign: "center",
  },
  outroTitle: {
    fontFamily: "Fraunces",
    fontSize: 32,
    fontWeight: 600,
    color: COLOR.ink,
    lineHeight: 1.1,
    letterSpacing: -0.3,
    textAlign: "center",
    marginBottom: 18,
  },
  outroBody: {
    fontFamily: "Inter",
    fontSize: 11.5,
    color: COLOR.inkSoft,
    lineHeight: 1.6,
    textAlign: "center",
    marginBottom: 26,
    paddingHorizontal: 18,
  },
  outroLink: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: 600,
    color: COLOR.accent,
    textAlign: "center",
    textDecoration: "none",
  },
});

/* ── MARKDOWN → REACT-PDF ──────────────────────────── */

// The @fontsource latin subset omits some typographic glyphs the engine
// likes to use (arrows, math symbols). Sub them to safe equivalents so
// they don't fall back to garbled glyphs in the rendered PDF.
function sanitizeText(s) {
  return String(s)
    .replace(/→/g, "›")   // RIGHTWARDS ARROW → SINGLE RIGHT-POINTING ANGLE QUOTE
    .replace(/←/g, "‹")   // LEFTWARDS ARROW
    .replace(/↓/g, "v")
    .replace(/↑/g, "^")
    .replace(/✓/g, "•")
    .replace(/✗/g, "x")
    .replace(/✱/g, "*");
}

function inlineNode(node, key) {
  switch (node.type) {
    case "text":
      return React.createElement(React.Fragment, { key }, sanitizeText(node.value));
    case "strong":
      return React.createElement(
        Text,
        { key, style: { fontWeight: 600 } },
        node.children.map((c, i) => inlineNode(c, i))
      );
    case "emphasis":
      return React.createElement(
        Text,
        { key, style: { fontStyle: "italic" } },
        node.children.map((c, i) => inlineNode(c, i))
      );
    case "link":
      return React.createElement(
        Link,
        { key, src: node.url, style: { color: COLOR.accent, textDecoration: "none" } },
        node.children.map((c, i) => inlineNode(c, i))
      );
    case "inlineCode":
      return React.createElement(
        Text,
        { key, style: { fontFamily: "Inter", color: COLOR.accent } },
        sanitizeText(node.value)
      );
    case "break":
      return React.createElement(Text, { key }, "\n");
    default:
      if (node.children) {
        return node.children.map((c, i) => inlineNode(c, i));
      }
      return null;
  }
}

function blockNode(node, key) {
  switch (node.type) {
    case "paragraph":
      return React.createElement(
        View,
        { key, style: styles.paragraphView },
        React.createElement(
          Text,
          { style: styles.paragraph },
          node.children.map((c, i) => inlineNode(c, i))
        )
      );
    case "heading": {
      const headingStyle = node.depth <= 2 ? styles.h2 : styles.h3;
      const headingView = node.depth <= 2 ? styles.h2View : styles.h3View;
      return React.createElement(
        View,
        { key, style: headingView },
        React.createElement(
          Text,
          { style: headingStyle },
          node.children.map((c, i) => inlineNode(c, i))
        )
      );
    }
    case "blockquote":
      return React.createElement(
        View,
        { key, style: styles.blockquoteView },
        node.children.map((c, i) => {
          if (c.type === "paragraph") {
            return React.createElement(
              Text,
              { key: i, style: styles.blockquote },
              c.children.map((cc, j) => inlineNode(cc, j))
            );
          }
          return blockNode(c, i);
        })
      );
    case "list": {
      const marker = (i) =>
        node.ordered ? `${(node.start ?? 1) + i}.` : "·";
      return React.createElement(
        View,
        { key, style: styles.listView },
        node.children.map((li, i) =>
          React.createElement(
            View,
            { key: i, style: styles.listItemView },
            React.createElement(Text, { style: styles.listMarker }, marker(i)),
            React.createElement(
              View,
              { style: styles.listContent },
              li.children.map((c, j) => blockNode(c, j))
            )
          )
        )
      );
    }
    case "code":
      return React.createElement(
        View,
        { key, style: styles.codeView },
        React.createElement(Text, { style: styles.code }, node.value)
      );
    case "thematicBreak":
      return React.createElement(View, { key, style: styles.hr });
    case "html":
      return null;
    default:
      return null;
  }
}

function renderMarkdown(md) {
  const tree = remark().parse(md);
  return tree.children.map((node, i) => blockNode(node, i));
}

/* ── PAGE COMPONENTS ───────────────────────────────── */

function CoverPage({ eyebrow, title, subtitle, byline, heroImage }) {
  const children = [];
  // resolveImage returns null when the file is missing, so a truthy check
  // is enough — no need to existsSync the resolved {data,format} object.
  if (heroImage) {
    children.push(
      React.createElement(Image, {
        key: "hero",
        src: heroImage,
        style: styles.coverImage,
      })
    );
  }
  children.push(
    React.createElement(Text, { key: "eb", style: styles.eyebrow }, eyebrow)
  );
  children.push(React.createElement(View, { key: "r", style: styles.rule }));
  children.push(
    React.createElement(Text, { key: "t", style: styles.displayTitle }, title)
  );
  if (subtitle) {
    children.push(
      React.createElement(Text, { key: "s", style: styles.subtitle }, subtitle)
    );
  }
  if (byline) {
    children.push(
      React.createElement(Text, { key: "b", style: styles.byline }, byline)
    );
  }

  return React.createElement(
    Page,
    { size: "A4", style: styles.coverPage },
    children,
    React.createElement(
      View,
      { key: "ft", fixed: true, style: styles.pageFooter },
      React.createElement(Text, null, "FLOWI · AI Intelligence"),
      React.createElement(Text, null, "useflowi.app")
    )
  );
}

function ContentPage({ markdownBody, headerLeft, headerRight }) {
  return React.createElement(
    Page,
    { size: "A4", style: styles.contentPage },
    React.createElement(
      View,
      { key: "hd", fixed: true, style: styles.pageHeader },
      React.createElement(Text, null, headerLeft),
      React.createElement(Text, null, headerRight)
    ),
    ...markdownBody,
    React.createElement(
      View,
      { key: "ft", fixed: true, style: styles.pageFooter },
      React.createElement(Text, null, "FLOWI · AI Intelligence"),
      React.createElement(Text, {
        render: ({ pageNumber }) => `Page ${pageNumber}`,
      })
    )
  );
}

function OutroPage({
  title = "Get this every morning.",
  body = "One email, the day's biggest AI release decoded for builders. Free, no fluff. Cancel any time.",
  linkText = "useflowi.app/dispatch",
  linkUrl = "https://useflowi.app/dispatch",
}) {
  return React.createElement(
    Page,
    { size: "A4", style: styles.outroPage },
    React.createElement(Text, { style: styles.outroEyebrow }, "The Dispatch · Free · Monthly"),
    React.createElement(Text, { style: styles.outroTitle }, title),
    React.createElement(Text, { style: styles.outroBody }, body),
    React.createElement(
      Link,
      { src: linkUrl, style: styles.outroLink },
      linkText
    ),
    React.createElement(
      View,
      { fixed: true, style: styles.pageFooter },
      React.createElement(Text, null, "FLOWI · AI Intelligence"),
      React.createElement(Text, null, "useflowi.app")
    )
  );
}

/* ── DOCUMENT BUILDERS ─────────────────────────────── */

function resolveImage(imgPath) {
  if (!imgPath) return null;
  const abs = path.join(ROOT, "public", imgPath.replace(/^\//, ""));
  if (!existsSync(abs)) return null;
  // react-pdf treats string src as URL (Node fetch). Pass a Buffer
  // directly to embed the local file's bytes.
  return readFileSync(abs);
}

function buildArticleDocument(post) {
  const heroAbs = resolveImage(post.image);
  const dateLong = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const byline = `By ${post.author || "Flowi Editorial"}${dateLong ? "  ·  " + dateLong : ""}`;
  const eyebrow = (post.category || "Article").replace(/_/g, " ");

  return React.createElement(
    Document,
    {
      title: post.title,
      author: post.author || "Flowi Editorial",
      subject: post.description || "",
      keywords: (post.keywords || []).join(", "),
    },
    React.createElement(CoverPage, {
      eyebrow,
      title: post.title,
      subtitle: post.description,
      byline,
      heroImage: heroAbs,
    }),
    React.createElement(ContentPage, {
      headerLeft: "FLOWI · Daily Brief",
      headerRight: eyebrow,
      markdownBody: renderMarkdown(post.content),
    }),
    React.createElement(OutroPage, {})
  );
}

function buildGuideDocument(guide, posts) {
  const heroAbs = resolveImage(guide.coverImage);
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const docChildren = [
    React.createElement(CoverPage, {
      key: "cover",
      eyebrow: "Field Guide · From the Daily Brief",
      title: guide.title,
      subtitle: guide.subtitle,
      byline: `Compiled by Flowi Editorial  ·  ${today}`,
      heroImage: heroAbs,
    }),
  ];

  posts.forEach((post, idx) => {
    const postHero = resolveImage(post.image);
    const essayEyebrow = `Essay ${String(idx + 1).padStart(2, "0")}  ·  ${(post.category || "").replace(/_/g, " ")}`;
    docChildren.push(
      React.createElement(CoverPage, {
        key: `ec-${idx}`,
        eyebrow: essayEyebrow,
        title: post.title,
        subtitle: post.description,
        byline: post.author || "Flowi Editorial",
        heroImage: postHero,
      })
    );
    docChildren.push(
      React.createElement(ContentPage, {
        key: `eb-${idx}`,
        headerLeft: `FLOWI · ${guide.title}`,
        headerRight: `Essay ${idx + 1} of ${posts.length}`,
        markdownBody: renderMarkdown(post.content),
      })
    );
  });

  docChildren.push(
    React.createElement(OutroPage, {
      key: "outro",
      title: "More like this, every morning.",
      body: "The Flowi Daily Brief decodes one new AI release every day — what shipped, why it matters, what to do by Friday. Free monthly Dispatch arrives in your inbox.",
    })
  );

  return React.createElement(
    Document,
    {
      title: guide.title,
      author: "Flowi Editorial",
      subject: guide.subtitle || "",
    },
    ...docChildren
  );
}

/* ── BLOG LOADER ───────────────────────────────────── */

function loadPost(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { slug, content, ...data };
}

/* ── CLI ───────────────────────────────────────────── */

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx >= 0 ? args[idx + 1] : null;
}

async function renderArticle(slug) {
  const post = loadPost(slug);
  if (!post) {
    console.error(`  - no post: ${slug}`);
    return false;
  }
  if (!post.title) {
    console.error(`  - post ${slug} missing title in frontmatter`);
    return false;
  }
  await fs.mkdir(PDF_OUT, { recursive: true });
  const outPath = path.join(PDF_OUT, `${slug}.pdf`);
  await renderToFile(buildArticleDocument(post), outPath);
  const stat = await fs.stat(outPath);
  console.log(`  + ${path.relative(ROOT, outPath)}  (${(stat.size / 1024).toFixed(0)} KB)`);
  return true;
}

async function renderGuide(guideSlug) {
  const cfg = JSON.parse(await fs.readFile(FG_PATH, "utf8"));
  const guide = cfg.guides[guideSlug];
  if (!guide) {
    console.error(`  - no guide: ${guideSlug}`);
    return false;
  }
  const posts = [];
  for (const s of guide.articles) {
    const p = loadPost(s);
    if (!p) {
      console.error(`  - guide ${guideSlug}: missing article ${s}`);
      return false;
    }
    posts.push(p);
  }
  await fs.mkdir(GUIDES_OUT, { recursive: true });
  const outPath = path.join(GUIDES_OUT, `${guideSlug}.pdf`);
  await renderToFile(buildGuideDocument(guide, posts), outPath);
  const stat = await fs.stat(outPath);
  console.log(`  + ${path.relative(ROOT, outPath)}  (${(stat.size / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  console.log("registering fonts…");
  await registerFonts();
  console.log("fonts ready.\n");

  if (args.includes("--article")) {
    const slug = getArg(args, "--article");
    if (!slug) {
      console.error("usage: --article <slug>");
      process.exit(1);
    }
    const ok = await renderArticle(slug);
    process.exit(ok ? 0 : 1);
  }

  if (args.includes("--guide")) {
    const slug = getArg(args, "--guide");
    if (!slug) {
      console.error("usage: --guide <guide-slug>");
      process.exit(1);
    }
    const ok = await renderGuide(slug);
    process.exit(ok ? 0 : 1);
  }

  if (args.includes("--all-guides")) {
    const cfg = JSON.parse(await fs.readFile(FG_PATH, "utf8"));
    let ok = true;
    for (const slug of Object.keys(cfg.guides)) {
      console.log(`> guide: ${slug}`);
      const r = await renderGuide(slug);
      ok = ok && r;
    }
    process.exit(ok ? 0 : 1);
  }

  if (args.includes("--all-articles")) {
    const slugs = (await fs.readdir(BLOG_DIR))
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    let success = 0;
    let failed = 0;
    for (const slug of slugs) {
      const ok = await renderArticle(slug);
      ok ? success++ : failed++;
    }
    console.log(`\ndone. ${success} succeeded, ${failed} failed.`);
    process.exit(failed === 0 ? 0 : 1);
  }

  console.error("usage:");
  console.error("  node scripts/render-pdf.mjs --article <slug>");
  console.error("  node scripts/render-pdf.mjs --guide <guide-slug>");
  console.error("  node scripts/render-pdf.mjs --all-articles");
  console.error("  node scripts/render-pdf.mjs --all-guides");
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
