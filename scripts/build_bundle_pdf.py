"""Build a multi-article PDF bundle for Gumroad.

Each bundle: typographic cover page -> TOC -> articles -> editorial colophon
with flagship CTA. Pure editorial typography, no stock imagery.

Usage:
  python scripts/build_bundle_pdf.py <bundle-id>     # one bundle
  python scripts/build_bundle_pdf.py --all           # every bundle

Bundle definitions live below in BUNDLES. To add a new bundle, append
to the dict with: title, subtitle, articles (list of slugs in order),
cta_html, output_filename.

Outputs:
  public/bundles/<filename>.pdf

Each PDF is Gumroad-ready: A4, embedded images, page numbers, table of
contents that's actually clickable.
"""
from __future__ import annotations

import argparse
import base64
import re
import sys
from datetime import datetime
from pathlib import Path

import markdown
import yaml
from weasyprint import HTML, CSS
from loguru import logger


ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
PUBLIC_DIR = ROOT / "public"
BUNDLE_DIR = ROOT / "public" / "bundles"


BUNDLES: dict[str, dict] = {
    "algo-traders-playbook": {
        "title": "The Algo Trader’s Playbook",
        "subtitle": "Four pieces on why retail algo trading fails — and the architecture that survives.",
        "tier": "Field Guide · Volume 01",
        "articles": [
            "why-retail-algo-trading-systems-fail-at-month-four",
            "ai-trading-bots-beat-backtests-but-break-in-live",
            "how-institutional-desks-use-ict-where-retail-tools-fall-short",
            "best-institutional-grade-trading-platforms-for-independent-traders",
        ],
        "cta_title": "The trading system for month four.",
        "cta_body": "FlowiAI Trader implements every architecture pattern in this guide: ICT-first market structure, multi-agent risk validation, 5-mode trading state with one-directional transitions, hard drawdown circuit breakers. Launching Q3 2026, founding pricing for the launch list.",
        "cta_link": "https://useflowi.app/trader",
        "cta_label": "Get on the launch list →",
        "filename": "algo-traders-playbook.pdf",
    },
    "behavior-change-playbook": {
        "title": "The Behavior Change Playbook",
        "subtitle": "Four pieces on why habit and recovery apps fail — and the relapse-aware architecture that actually works.",
        "tier": "Field Guide · Volume 02",
        "articles": [
            "why-habit-tracker-apps-dont-survive-the-third-month",
            "the-discipline-app-paradox-why-downloading-more-doesnt-help",
            "what-every-recovery-app-gets-wrong-about-relapse",
            "best-behavior-change-apps-for-breaking-compulsive-habits",
        ],
        "cta_title": "The app built for the slips, not against them.",
        "cta_body": "Woyuduin implements the relapse-prevention architecture in this guide: compliance windows instead of streaks, trigger-mapped slip data, post-slip protocols, graduated independence. The goal is for you to need the app less over time — because that's what real behavior change looks like.",
        "cta_link": "https://woyuduin.com",
        "cta_label": "Try Woyuduin →",
        "filename": "behavior-change-playbook.pdf",
    },
    "ai-builders-field-guide": {
        "title": "The AI Builder’s Field Guide",
        "subtitle": "Four pieces on what shipped in AI this month — and what the production patterns mean for you.",
        "tier": "Field Guide · Volume 03",
        "articles": [
            "claude-mythos-found-firefox-bugs-the-real-story-is-the-triage",
            "openai-spud-gpt-5-5-cyber-defenders-rollout",
            "code-with-claude-2026-what-actually-shipped",
            "best-books-for-building-ai-agents-in-2026",
        ],
        "cta_title": "The agent memory patterns that ship in production.",
        "cta_body": "Most AI agents fail at message four because the agent forgets the user. Our book “Agent Memory: The 5 Patterns That Ship in Production” covers the decision tree, the code, and the failure modes nobody warns you about — in five chapters and 4,500 words of running code.",
        "cta_link": "https://flowi.gumroad.com/l/sqqhvm",
        "cta_label": "Read it — $19 →",
        "filename": "ai-builders-field-guide.pdf",
    },
}


CSS_TEMPLATE = """
@page {
  size: A4;
  margin: 24mm 22mm 22mm 22mm;
  background: #FAF7F1;
  @bottom-center {
    content: "useflowi.app  ·  page " counter(page) " of " counter(pages);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 9pt;
    color: #888;
    font-style: italic;
  }
}
@page :first {
  @bottom-center { content: ""; }
  margin: 0;
}
@page cover {
  size: A4;
  margin: 0;
  background: #FAF7F1;
  @bottom-center { content: ""; }
}
@page toc {
  @bottom-center {
    content: "Contents";
    font-family: Georgia, serif;
    font-size: 9pt;
    color: #888;
    font-style: italic;
  }
}

* { box-sizing: border-box; }

html, body {
  background: #FAF7F1;
  color: #15110B;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11pt;
  line-height: 1.55;
  margin: 0;
  padding: 0;
}

/* ===== Cover page ===== */
.cover {
  page: cover;
  height: 297mm;
  padding: 50mm 28mm 30mm 28mm;
  position: relative;
  page-break-after: always;
}
.cover .brand {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 9pt;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #15110B;
  margin: 0 0 60mm 0;
}
.cover .tier {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8.5pt;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #5C544A;
  margin: 0 0 8mm 0;
}
.cover .tier::before {
  content: "—  ";
  color: #C8252D;
}
.cover h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 36pt;
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.015em;
  margin: 0 0 14mm 0;
  max-width: 130mm;
}
.cover .subtitle {
  font-family: Georgia, serif;
  font-size: 13.5pt;
  font-style: italic;
  line-height: 1.4;
  color: #2a261f;
  max-width: 130mm;
  margin: 0 0 80mm 0;
}
.cover .rule {
  width: 50mm;
  border: 0;
  border-top: 1.5pt solid #C8252D;
  margin: 0 0 4mm 0;
}
.cover .footer {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 9pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5C544A;
}

/* ===== TOC ===== */
.toc { page: toc; page-break-after: always; }
.toc .eyebrow {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #5C544A;
  margin: 0 0 4mm 0;
}
.toc .eyebrow::before { content: "—  "; color: #C8252D; }
.toc h2 {
  font-family: Georgia, serif;
  font-size: 22pt;
  font-weight: 700;
  margin: 0 0 10mm 0;
}
.toc ol { list-style: none; padding: 0; margin: 0; }
.toc li {
  display: flex;
  gap: 5mm;
  align-items: baseline;
  padding: 4mm 0;
  border-bottom: 0.5pt solid #D9D2C0;
}
.toc .num {
  font-family: Georgia, serif;
  font-size: 13pt;
  color: #5C544A;
  font-variant-numeric: tabular-nums;
  min-width: 8mm;
}
.toc .title-text {
  flex: 1;
  font-family: Georgia, serif;
  font-size: 13pt;
  font-weight: 500;
  line-height: 1.3;
}
.toc .title-text a { color: #15110B; text-decoration: none; }
.toc .title-text a:hover { color: #C8252D; }

/* ===== Article ===== */
.article { page-break-before: always; }
.article .eyebrow {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #5C544A;
  margin: 0 0 6mm 0;
}
.article .eyebrow::before { content: "—  "; color: #C8252D; }
.article h1.title {
  font-family: Georgia, serif;
  font-size: 26pt;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin: 0 0 6mm 0;
}
.article .byline {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 9pt;
  color: #5C544A;
  font-style: italic;
  margin: 0 0 6mm 0;
}
.article .byline strong { font-style: normal; color: #15110B; }
.article .dek {
  font-family: Georgia, serif;
  font-size: 12.5pt;
  line-height: 1.45;
  color: #2a261f;
  font-style: italic;
  margin: 0 0 8mm 0;
}
.article .hero {
  width: 100%;
  margin: 0 0 10mm 0;
  page-break-inside: avoid;
}
.article .hero img { width: 100%; height: auto; display: block; }
.article .body p { margin: 0 0 4mm 0; }
.article .body h2 {
  font-family: Georgia, serif;
  font-size: 16pt;
  font-weight: 700;
  letter-spacing: -0.005em;
  margin: 8mm 0 3mm 0;
  page-break-after: avoid;
}
.article .body h3 {
  font-family: Georgia, serif;
  font-size: 12pt;
  font-weight: 700;
  margin: 6mm 0 2mm 0;
}
.article .body strong { color: #15110B; }
.article .body em { color: #2a261f; }
.article .body a { color: #C8252D; text-decoration: none; border-bottom: 0.5pt solid #C8252D; }
.article .body ul, .article .body ol { margin: 0 0 4mm 6mm; padding: 0; }
.article .body li { margin-bottom: 1mm; }
.article .body code {
  font-family: "Consolas", "Menlo", monospace;
  font-size: 9.5pt;
  background: #f0ebe0;
  padding: 1pt 3pt;
}
.article .body pre {
  background: #f0ebe0;
  padding: 4mm;
  font-family: "Consolas", "Menlo", monospace;
  font-size: 9pt;
  line-height: 1.4;
  border-left: 1.5pt solid #C8252D;
  margin: 4mm 0;
  page-break-inside: avoid;
}
.article .body pre code { background: none; padding: 0; }
.article .body blockquote {
  margin: 4mm 0 4mm 5mm;
  padding-left: 4mm;
  border-left: 1pt solid #C8252D;
  font-style: italic;
}
.article .body table {
  border-collapse: collapse;
  width: 100%;
  margin: 4mm 0;
  font-size: 9.5pt;
}
.article .body th, .article .body td {
  border-bottom: 0.5pt solid #D9D2C0;
  padding: 2mm 3mm;
  text-align: left;
  vertical-align: top;
}
.article .body th { font-weight: 700; }
.article .end-rule {
  border: 0;
  border-top: 0.5pt solid #D9D2C0;
  margin: 10mm auto;
  width: 30mm;
}

/* ===== Closing CTA ===== */
.closing {
  page-break-before: always;
  padding: 20mm 0 0 0;
}
.closing .eyebrow {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #5C544A;
  margin: 0 0 6mm 0;
}
.closing .eyebrow::before { content: "—  "; color: #C8252D; }
.closing h2 {
  font-family: Georgia, serif;
  font-size: 24pt;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 8mm 0;
}
.closing p {
  font-size: 12pt;
  line-height: 1.55;
  margin: 0 0 8mm 0;
}
.closing a.cta {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 13pt;
  color: #C8252D;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1pt solid #C8252D;
}
.colophon {
  margin-top: 20mm;
  padding-top: 8mm;
  border-top: 0.5pt solid #D9D2C0;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8.5pt;
  color: #5C544A;
  line-height: 1.5;
}
.colophon strong { color: #15110B; }
.colophon a { color: #C8252D; text-decoration: none; }
"""


def _img_to_data_uri(path: Path) -> str | None:
    if not path.exists():
        return None
    ext = path.suffix.lower().lstrip(".") or "png"
    if ext == "jpg":
        ext = "jpeg"
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/{ext};base64,{data}"


def parse_frontmatter(text: str) -> tuple[dict, str]:
    m = re.match(r"^---\s*\n(.+?)\n---\s*\n(.*)$", text, re.S)
    if not m:
        return {}, text
    try:
        return yaml.safe_load(m.group(1)) or {}, m.group(2)
    except yaml.YAMLError:
        return {}, m.group(2)


def render_article_section(slug: str, anchor_id: str) -> tuple[str, str]:
    """Returns (html_section, title) for one article."""
    md_path = BLOG_DIR / f"{slug}.md"
    raw = md_path.read_text(encoding="utf-8")
    fm, body_md = parse_frontmatter(raw)

    title = fm.get("title", slug)
    description = fm.get("description", "")
    date_str = fm.get("date", "")
    author = fm.get("author", "Flowi Editorial")
    category = (fm.get("category") or "").replace("_", " ")
    image_rel = fm.get("image")

    html_body = markdown.markdown(
        body_md,
        extensions=["extra", "tables", "fenced_code", "sane_lists"],
        output_format="html5",
    )

    hero_html = ""
    if image_rel:
        img_path = PUBLIC_DIR / image_rel.lstrip("/")
        uri = _img_to_data_uri(img_path)
        if uri:
            hero_html = f'<div class="hero"><img src="{uri}" alt="{title}" /></div>'

    date_long = ""
    try:
        date_long = datetime.fromisoformat(date_str).strftime("%B %#d, %Y")
    except (ValueError, TypeError):
        date_long = str(date_str)

    word_count = len(body_md.split())
    read_time = max(1, round(word_count / 200))

    section = f"""<section class="article" id="{anchor_id}">
      <div class="eyebrow">{category or "Article"}</div>
      <h1 class="title">{title}</h1>
      <div class="byline">By <strong>{author}</strong>  ·  {date_long}  ·  {read_time} min read</div>
      {f'<div class="dek">{description}</div>' if description else ''}
      {hero_html}
      <div class="body">{html_body}</div>
      <hr class="end-rule" />
    </section>"""

    return section, title


def build_bundle(bundle_id: str, bundle: dict) -> Path:
    BUNDLE_DIR.mkdir(parents=True, exist_ok=True)

    sections = []
    toc_items = []
    for i, slug in enumerate(bundle["articles"], 1):
        anchor = f"art-{i}"
        section_html, title = render_article_section(slug, anchor)
        sections.append(section_html)
        toc_items.append((i, title, anchor))

    toc_rows = "".join(
        f'<li><span class="num">{i:02d}</span><span class="title-text"><a href="#{anchor}">{title}</a></span></li>'
        for i, title, anchor in toc_items
    )

    closing_html = f"""<section class="closing">
      <div class="eyebrow">If this was useful</div>
      <h2>{bundle["cta_title"]}</h2>
      <p>{bundle["cta_body"]}</p>
      <p><a class="cta" href="{bundle["cta_link"]}">{bundle["cta_label"]}</a></p>
      <div class="colophon">
        <strong>{bundle["title"]}</strong> — a Flowi field guide.<br>
        Articles originally published on <a href="https://useflowi.app/blog">useflowi.app/blog</a>.<br>
        Compiled for offline reading. Updated annually.<br>
        © Flowi, 2026 · <a href="https://useflowi.app">useflowi.app</a>
      </div>
    </section>"""

    html = f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>{bundle['title']}</title></head>
<body>
  <section class="cover">
    <div class="brand">FLOWI · AI INTELLIGENCE</div>
    <div class="tier">{bundle['tier']}</div>
    <h1>{bundle['title']}</h1>
    <div class="subtitle">{bundle['subtitle']}</div>
    <hr class="rule" />
    <div class="footer">useflowi.app  ·  {datetime.now().year}</div>
  </section>

  <section class="toc">
    <div class="eyebrow">Contents</div>
    <h2>{bundle['title']}</h2>
    <ol>{toc_rows}</ol>
  </section>

  {''.join(sections)}

  {closing_html}
</body>
</html>"""

    out_path = BUNDLE_DIR / bundle["filename"]
    HTML(string=html).write_pdf(str(out_path), stylesheets=[CSS(string=CSS_TEMPLATE)])
    return out_path


def main() -> int:
    ap = argparse.ArgumentParser(description="Build a multi-article PDF bundle")
    ap.add_argument("bundle_id", nargs="?", help="bundle id (omit to use --all)")
    ap.add_argument("--all", action="store_true", help="build every defined bundle")
    args = ap.parse_args()

    if args.all:
        ids = list(BUNDLES.keys())
    elif args.bundle_id:
        ids = [args.bundle_id]
    else:
        ap.print_help()
        return 2

    for bid in ids:
        if bid not in BUNDLES:
            logger.error(f"unknown bundle: {bid}. defined: {list(BUNDLES)}")
            continue
        try:
            out = build_bundle(bid, BUNDLES[bid])
            size_kb = out.stat().st_size // 1024
            logger.info(f"  [ok] {bid} -> {out.relative_to(ROOT)} ({size_kb} KB)")
        except Exception as e:
            logger.error(f"  [FAIL] {bid}: {e}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
