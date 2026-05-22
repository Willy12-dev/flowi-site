/**
 * GET /api/decks/[id]/[index]
 *
 * Public per-slide renderer for the visual-deck pages at /posts/[id].
 *
 *   - [id]    : the unprefixed slug (matches the blog slug; e.g.
 *               "2026-05-19-qwen-3-5-censorship-weights"). The matching
 *               spec lives at content/carousel-specs/<prefix>-<id>.json
 *               where <prefix> is news / evergreen / imagepost / starter.
 *   - [index] : 1-indexed slide number.
 *
 * Returns a single 1080×1350 PNG. Cached as immutable for one year because
 * (a) slugs are immutable in practice (the daily engine appends, never
 * mutates), and (b) Vercel/CDN can carry the load without re-rendering.
 *
 * No auth — these are publishable visual posts. The admin-only /api/carousel/pack
 * stays as-is for the dashboard; this is the public counterpart.
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { THEMES, themeForVertical } from "@/lib/carousel/themes";
import type { CarouselSpec } from "@/lib/carousel/types";
import { loadFonts } from "@/lib/carousel/fonts";
import { renderSlide } from "@/components/carousel/render";

export const runtime = "nodejs";

const SPECS_DIR = path.join(process.cwd(), "content", "carousel-specs");
const PREFIXES = ["news", "evergreen", "imagepost", "starter"];

async function loadSpecBySlug(slug: string): Promise<CarouselSpec | null> {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  for (const prefix of PREFIXES) {
    try {
      const text = await fs.readFile(
        path.join(SPECS_DIR, `${prefix}-${safe}.json`),
        "utf8"
      );
      return JSON.parse(text) as CarouselSpec;
    } catch {
      /* try next prefix */
    }
  }
  // also accept raw (no prefix) ids
  try {
    const text = await fs.readFile(path.join(SPECS_DIR, `${safe}.json`), "utf8");
    return JSON.parse(text) as CarouselSpec;
  } catch {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string; index: string }> }
) {
  const { id, index } = await context.params;
  const n = parseInt(index, 10);
  if (!Number.isFinite(n) || n < 1) {
    return new Response("Invalid slide index", { status: 400 });
  }

  const spec = await loadSpecBySlug(id);
  if (!spec) return new Response("Deck not found", { status: 404 });

  const slide = spec.slides[n - 1];
  if (!slide) return new Response("Slide out of range", { status: 404 });

  const themeName = spec.theme ?? themeForVertical(spec.vertical);
  const theme = THEMES[themeName];
  if (!theme) return new Response(`Unknown theme: ${themeName}`, { status: 500 });

  const fonts = await loadFonts();
  const jsx = renderSlide(slide, theme, spec.handle);
  const png = new ImageResponse(jsx, {
    width: 1080,
    height: 1350,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    })),
  });

  const buf = Buffer.from(await png.arrayBuffer());
  return new Response(buf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      // Build marker — lets a deploy be detected without guessing on timing.
      "X-Carousel-Build": "noir-2026-05-22b",
      // Specs are immutable per slug — strong cache is safe. Vercel + CDN
      // will serve every subsequent hit without re-running Satori.
      "Cache-Control":
        "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
