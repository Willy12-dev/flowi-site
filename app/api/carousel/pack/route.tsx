/**
 * POST /api/carousel/pack
 *
 * Body: a full CarouselSpec (or { specId } to load from content/carousel-specs).
 * Returns: JSON with base64 slide PNGs + every platform's paste-ready text.
 *
 * This powers /admin/library — browse + copy-paste without the terminal.
 * Same render pipeline + exporters as /api/carousel/zip, JSON instead of a
 * binary zip so the UI can show previews and copy buttons.
 */

import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_COOKIE = "flowi_admin";
const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "flowi-admin-default-secret-change-me";

function sign(v: string) {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(v).digest("hex");
}
function safeDecode(s: string) {
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

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const m = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  if (!verifyToken(m?.[1] ? safeDecode(m[1]) : undefined)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let spec: CarouselSpec;
  try {
    const body = (await req.json()) as { spec?: CarouselSpec; specId?: string };
    if (body.spec) {
      spec = body.spec;
    } else if (body.specId) {
      const safeId = body.specId.replace(/[^a-zA-Z0-9_-]/g, "");
      const p = path.join(
        process.cwd(),
        "content",
        "carousel-specs",
        `${safeId}.json`
      );
      spec = JSON.parse(await fs.readFile(p, "utf8"));
    } else {
      return NextResponse.json(
        { error: "Provide spec or specId" },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: `Bad spec: ${(e as Error).message}` },
      { status: 400 }
    );
  }

  const themeName = spec.theme ?? themeForVertical(spec.vertical);
  const theme = THEMES[themeName];
  if (!theme) {
    return NextResponse.json(
      { error: `Unknown theme: ${themeName}` },
      { status: 400 }
    );
  }

  const fonts = await loadFonts();

  // Funnel routing
  const registry = await loadCourses();
  const routing: CarouselRouting = {
    primary: pickPrimaryCourse(registry, spec.vertical, spec.topic),
    secondary: getSecondaryRoute(registry, spec.vertical),
  };

  // Image prompts for photo-frame slides
  const promptsRegistry = await loadPrompts();
  const imagePrompts: ResolvedImagePrompt[] = [];
  for (const slide of spec.slides) {
    if (slide.type !== "photo-frame") continue;
    const templateId = slide.promptTemplate ?? "carousel-hero-photo-frame";
    try {
      const r = resolvePrompt(
        promptsRegistry,
        templateId,
        slide.promptVars ?? {}
      );
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
    } catch {
      /* skip */
    }
  }

  // Render each slide -> base64 data URL
  const slides: Array<{ name: string; dataUrl: string }> = [];
  for (const slide of spec.slides) {
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
    slides.push({
      name: `${pad(slide.index)}-${slide.type}.png`,
      dataUrl: `data:image/png;base64,${buf.toString("base64")}`,
    });
  }

  return NextResponse.json({
    id: spec.id,
    title: spec.title,
    vertical: spec.vertical,
    topic: spec.topic ?? null,
    slides,
    caption: toInstagramCaption(spec, routing),
    posts: {
      twitter: toTwitterThread(spec, routing),
      reddit: toRedditPost(spec, routing),
      quora: toQuoraAnswer(spec, routing),
      tiktok: toTikTokScript(spec, routing),
      pinterest: toPinterestPins(spec, routing),
    },
    imagePrompts:
      imagePrompts.length > 0 ? toImagePrompts(spec, imagePrompts) : null,
  });
}
