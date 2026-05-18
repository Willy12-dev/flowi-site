/**
 * POST /api/carousel/zip
 *
 * Body: full CarouselSpec.
 * Returns: a ZIP file containing all rendered PNGs plus the spec JSON
 * and a caption.txt (caption + hashtags). Filename: <spec.id>.zip
 *
 * Uses the same render pipeline as /api/carousel/render. Renders slides
 * sequentially to keep memory steady on Vercel.
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { THEMES, themeForVertical } from "@/lib/carousel/themes";
import type { CarouselSpec } from "@/lib/carousel/types";
import { loadFonts } from "@/lib/carousel/fonts";
import { renderSlide } from "@/components/carousel/render";
import {
  toInstagramCaption,
  toPinterestPins,
  toTwitterThread,
  toRedditPost,
  toQuoraAnswer,
  toTikTokScript,
  toYouTubeShort,
  toReadMe,
  toImagePrompts,
  type CarouselRouting,
  type ResolvedImagePrompt,
} from "@/lib/carousel/platforms";
import {
  loadCourses,
  pickPrimaryCourse,
  getSecondaryRoute,
} from "@/lib/carousel/courses";
import { loadPrompts, resolvePrompt } from "@/lib/carousel/image-prompts";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_COOKIE = "flowi_admin";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "flowi-admin-default-secret-change-me";

function sign(v: string) {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(v).digest("hex");
}
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload)));
  } catch {
    return false;
  }
}

// Minimal zip writer — store-only (no compression). PNGs are already
// compressed and the carousel will be < 9 slides, so the saving from DEFLATE
// is negligible vs. pulling in JSZip.
function buildZip(
  entries: Array<{ name: string; data: Uint8Array }>
): Uint8Array {
  const enc = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const e of entries) {
    const nameBytes = enc.encode(e.name);
    const crc = crc32(e.data);
    const size = e.data.length;

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true); // method 0 = store
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, e.data);

    // Central directory entry
    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);

    offset += localHeader.length + e.data.length;
  }

  // End of central directory
  const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalSize =
    localParts.reduce((s, p) => s + p.length, 0) + centralSize + eocd.length;
  const out = new Uint8Array(totalSize);
  let p = 0;
  for (const part of localParts) {
    out.set(part, p);
    p += part.length;
  }
  for (const part of centralParts) {
    out.set(part, p);
    p += part.length;
  }
  out.set(eocd, p);
  return out;
}

// CRC32 (ZIP format) — standard polynomial 0xEDB88320.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const m = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  const raw = m?.[1];
  const decoded = raw ? safeDecode(raw) : undefined;
  if (!verifyToken(decoded)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let spec: CarouselSpec;
  try {
    const body = (await req.json()) as
      | CarouselSpec
      | { spec?: CarouselSpec; specId?: string };
    if ((body as { specId?: string }).specId) {
      // Library passes just an id — load the spec from disk.
      const safeId = (body as { specId: string }).specId.replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      );
      const p = path.join(
        process.cwd(),
        "content",
        "carousel-specs",
        `${safeId}.json`
      );
      spec = JSON.parse(await fs.readFile(p, "utf8")) as CarouselSpec;
    } else if ((body as { spec?: CarouselSpec }).spec) {
      spec = (body as { spec: CarouselSpec }).spec;
    } else {
      spec = body as CarouselSpec;
    }
  } catch {
    return new Response("Invalid JSON or spec not found", { status: 400 });
  }

  if (!spec.id || !spec.slides || !spec.handle || !spec.vertical) {
    return new Response("Spec missing id/slides/handle/vertical", { status: 400 });
  }

  const themeName = spec.theme ?? themeForVertical(spec.vertical);
  const theme = THEMES[themeName];
  if (!theme) {
    return new Response(`Unknown theme: ${themeName}`, { status: 400 });
  }

  const fonts = await loadFonts();

  // Build the funnel routing from the courses registry
  const registry = await loadCourses();
  const routing: CarouselRouting = {
    primary: pickPrimaryCourse(registry, spec.vertical, spec.topic),
    secondary: getSecondaryRoute(registry, spec.vertical),
  };

  // Resolve image prompts for every photo-frame slide
  const promptsRegistry = await loadPrompts();
  const imagePrompts: ResolvedImagePrompt[] = [];
  for (const slide of spec.slides) {
    if (slide.type !== "photo-frame") continue;
    const templateId = slide.promptTemplate ?? "carousel-hero-photo-frame";
    try {
      const r = resolvePrompt(promptsRegistry, templateId, slide.promptVars ?? {});
      const t = promptsRegistry.templates.find((x) => x.id === templateId);
      imagePrompts.push({
        slideIndex: slide.index,
        templateId,
        templateTitle: t?.title ?? templateId,
        assetPath: r.assetPath,
        size: r.size,
        aspect: r.aspect,
        prompt: r.prompt,
      });
    } catch (e) {
      console.error(`Failed to resolve image prompt for slide ${slide.index}:`, e);
    }
  }

  const entries: Array<{ name: string; data: Uint8Array }> = [];

  for (let i = 0; i < spec.slides.length; i++) {
    const slide = spec.slides[i];
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
    const buf = new Uint8Array(await png.arrayBuffer());
    const filename = `${pad(slide.index)}-${slide.type}.png`;
    entries.push({ name: filename, data: buf });
  }

  const enc = new TextEncoder();

  // Spec JSON — the source of truth
  entries.push({
    name: "spec.json",
    data: enc.encode(JSON.stringify(spec, null, 2)),
  });

  // README — what's in this pack and how to post it
  entries.push({
    name: "READ_ME_FIRST.md",
    data: enc.encode(toReadMe(spec, routing)),
  });

  // Instagram caption (the one you paste alongside the carousel)
  entries.push({
    name: "caption.txt",
    data: enc.encode(toInstagramCaption(spec, routing)),
  });

  // Per-platform post packs
  entries.push({
    name: "posts/twitter-thread.md",
    data: enc.encode(toTwitterThread(spec, routing)),
  });
  entries.push({
    name: "posts/reddit.md",
    data: enc.encode(toRedditPost(spec, routing)),
  });
  entries.push({
    name: "posts/quora.md",
    data: enc.encode(toQuoraAnswer(spec, routing)),
  });
  entries.push({
    name: "posts/tiktok-script.md",
    data: enc.encode(toTikTokScript(spec, routing)),
  });
  entries.push({
    name: "posts/youtube-short.md",
    data: enc.encode(toYouTubeShort(spec, routing)),
  });
  entries.push({
    name: "posts/pinterest-pins.md",
    data: enc.encode(toPinterestPins(spec, routing)),
  });

  // Image prompts — paste-ready for every photo-backed slide
  entries.push({
    name: "IMAGE_PROMPTS.md",
    data: enc.encode(toImagePrompts(spec, imagePrompts)),
  });

  const zipBytes = buildZip(entries);
  return new Response(zipBytes as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${spec.id}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}
