"""Render a flowi-site blog article -> a downloadable editorial PDF.

Usage:
  python scripts/article_to_pdf.py <slug>           # single
  python scripts/article_to_pdf.py --all            # every article in content/blog/
  python scripts/article_to_pdf.py --today          # every article dated today

Outputs:
  public/pdfs/<slug>.pdf

Picks up:
  - frontmatter title, description, date, author, image
  - markdown body
  - editorial styling matching the site (paper, serif, single red accent)
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
PDF_DIR = ROOT / "public" / "pdfs"
PUBLIC_DIR = ROOT / "public"


CSS_TEMPLATE = """
@page {
  size: A4;
  margin: 22mm 20mm 22mm 20mm;
  background: #FAF7F1;

  @bottom-center {
    content: "useflowi.app  ·  page " counter(page) " of " counter(pages);
    font-family: Georgia, "Times New Roman", serif;
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

.eyebrow {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #5C544A;
  margin: 0 0 10mm 0;
}
.eyebrow::before {
  content: "—  ";
  color: #C8252D;
}

h1.title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28pt;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin: 0 0 8mm 0;
  color: #15110B;
}

.byline {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 9pt;
  color: #5C544A;
  font-style: italic;
  margin: 0 0 8mm 0;
}
.byline strong { font-style: normal; color: #15110B; }

.dek {
  font-family: Georgia, serif;
  font-size: 13pt;
  line-height: 1.45;
  color: #2a261f;
  font-style: italic;
  margin: 0 0 10mm 0;
}

.hero {
  width: 100%;
  margin: 0 0 12mm 0;
  page-break-inside: avoid;
}
.hero img {
  width: 100%;
  height: auto;
  display: block;
}

.rule {
  border: 0;
  border-top: 0.5pt solid #D9D2C0;
  margin: 8mm 0;
}

.body { color: #15110B; }
.body p { margin: 0 0 4mm 0; }
.body h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16pt;
  font-weight: 700;
  letter-spacing: -0.005em;
  margin: 9mm 0 3mm 0;
  page-break-after: avoid;
}
.body h3 {
  font-family: Georgia, serif;
  font-size: 12pt;
  font-weight: 700;
  margin: 6mm 0 2mm 0;
  page-break-after: avoid;
}
.body strong { color: #15110B; }
.body em { color: #2a261f; }
.body a { color: #C8252D; text-decoration: none; border-bottom: 0.5pt solid #C8252D; }
.body ul, .body ol { margin: 0 0 4mm 6mm; padding: 0; }
.body li { margin-bottom: 1mm; }
.body code {
  font-family: "Consolas", "Menlo", monospace;
  font-size: 9.5pt;
  background: #f0ebe0;
  padding: 1pt 3pt;
  border-radius: 1pt;
}
.body pre {
  background: #f0ebe0;
  padding: 4mm;
  font-family: "Consolas", "Menlo", monospace;
  font-size: 9pt;
  line-height: 1.4;
  overflow-x: auto;
  border-left: 1.5pt solid #C8252D;
  margin: 4mm 0 5mm 0;
  page-break-inside: avoid;
}
.body pre code { background: none; padding: 0; }
.body blockquote {
  margin: 4mm 0 4mm 5mm;
  padding-left: 4mm;
  border-left: 1pt solid #C8252D;
  color: #2a261f;
  font-style: italic;
}
.body table {
  border-collapse: collapse;
  margin: 4mm 0;
  font-size: 9.5pt;
  width: 100%;
}
.body th, .body td {
  border-bottom: 0.5pt solid #D9D2C0;
  padding: 2mm 3mm;
  text-align: left;
  vertical-align: top;
}
.body th { font-weight: 700; }

.colophon {
  margin-top: 14mm;
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
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        fm = {}
    return fm, m.group(2)


def render_article(slug: str) -> Path:
    md_path = BLOG_DIR / f"{slug}.md"
    if not md_path.exists():
        raise FileNotFoundError(md_path)

    raw = md_path.read_text(encoding="utf-8")
    fm, body_md = parse_frontmatter(raw)

    title = fm.get("title", slug)
    description = fm.get("description", "")
    date_str = fm.get("date", "")
    author = fm.get("author", "Flowi Editorial")
    category = (fm.get("category") or "").replace("_", " ")
    image_rel = fm.get("image")

    # Convert body markdown -> HTML
    html_body = markdown.markdown(
        body_md,
        extensions=["extra", "tables", "fenced_code", "sane_lists"],
        output_format="html5",
    )

    # Inline the hero image as data URI (WeasyPrint reads it natively from disk
    # too, but data URI sidesteps path resolution issues).
    hero_html = ""
    if image_rel:
        # image_rel like "/images/blog/foo.png" — strip leading /
        img_path = PUBLIC_DIR / image_rel.lstrip("/")
        uri = _img_to_data_uri(img_path)
        if uri:
            hero_html = f'<div class="hero"><img src="{uri}" alt="{title}" /></div>'

    # Format date
    date_long = ""
    try:
        date_long = datetime.fromisoformat(date_str).strftime("%B %-d, %Y")
    except (ValueError, TypeError):
        try:
            date_long = datetime.fromisoformat(date_str).strftime("%B %#d, %Y")
        except (ValueError, TypeError):
            date_long = str(date_str)

    word_count = len(body_md.split())
    read_time = max(1, round(word_count / 200))

    html = f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>{title}</title></head>
<body>
  <div class="eyebrow">{category or "Article"}</div>
  <h1 class="title">{title}</h1>
  <div class="byline">By <strong>{author}</strong>  ·  {date_long}  ·  {read_time} min read</div>
  {f'<div class="dek">{description}</div>' if description else ''}
  {hero_html}
  <hr class="rule" />
  <div class="body">
    {html_body}
  </div>
  <div class="colophon">
    Originally published on <a href="https://useflowi.app/blog/{slug}">useflowi.app/blog/{slug}</a>.<br>
    <strong>Flowi</strong> — the editorial intelligence layer for AI builders.<br>
    Daily brief at <a href="https://useflowi.app/blog">useflowi.app/blog</a>  ·  Monthly Dispatch at <a href="https://useflowi.app/dispatch">useflowi.app/dispatch</a>.
  </div>
</body>
</html>"""

    PDF_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PDF_DIR / f"{slug}.pdf"
    HTML(string=html).write_pdf(str(out_path), stylesheets=[CSS(string=CSS_TEMPLATE)])
    return out_path


def list_slugs(filter_today: bool = False) -> list[str]:
    today = datetime.utcnow().strftime("%Y-%m-%d")
    slugs = []
    for p in sorted(BLOG_DIR.glob("*.md")):
        if filter_today:
            text = p.read_text(encoding="utf-8")
            if f'date: "{today}"' not in text and f"date: '{today}'" not in text and f"date: {today}" not in text:
                continue
        slugs.append(p.stem)
    return slugs


def main() -> int:
    ap = argparse.ArgumentParser(description="Render blog articles to editorial PDFs")
    ap.add_argument("slug", nargs="?", help="article slug (omit to use --all or --today)")
    ap.add_argument("--all", action="store_true", help="render every article")
    ap.add_argument("--today", action="store_true", help="render only today's articles")
    args = ap.parse_args()

    if args.all or args.today:
        slugs = list_slugs(filter_today=args.today)
    elif args.slug:
        slugs = [args.slug]
    else:
        ap.print_help()
        return 2

    if not slugs:
        logger.warning("no articles matched")
        return 0

    logger.info(f"rendering {len(slugs)} article(s) -> {PDF_DIR}")
    for s in slugs:
        try:
            out = render_article(s)
            size_kb = out.stat().st_size // 1024
            logger.info(f"  [ok] {s} -> {size_kb} KB")
        except Exception as e:
            logger.error(f"  [FAIL] {s}: {e}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
