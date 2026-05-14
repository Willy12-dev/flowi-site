/**
 * POST /api/carousel/render
 *
 * Body: a single Slide spec + theme name + handle.
 * Returns: a PNG (1080x1350) of that slide.
 *
 * Auth: requires admin cookie. Cookies are accessible to Edge runtime via
 * request.headers — we read the same flowi_admin cookie that lib/admin checks.
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { THEMES, type ThemeName } from "@/lib/carousel/themes";
import type { Slide } from "@/lib/carousel/types";
import { loadFonts } from "@/lib/carousel/fonts";
import { renderSlide } from "@/components/carousel/render";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_COOKIE = "flowi_admin";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "flowi-admin-default-secret-change-me";

function sign(value: string): string {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(value).digest("hex");
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

interface RenderBody {
  slide: Slide;
  themeName: ThemeName;
  handle: string;
}

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const m = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  const raw = m?.[1];
  const decoded = raw ? safeDecode(raw) : undefined;
  if (!verifyToken(decoded)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: RenderBody;
  try {
    body = (await req.json()) as RenderBody;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.slide || !body.themeName || !body.handle) {
    return new Response("Missing slide/themeName/handle", { status: 400 });
  }

  const theme = THEMES[body.themeName];
  if (!theme) {
    return new Response(`Unknown theme: ${body.themeName}`, { status: 400 });
  }

  let fonts;
  try {
    fonts = await loadFonts();
  } catch (e) {
    return new Response(`Font load failed: ${(e as Error).message}`, {
      status: 500,
    });
  }

  const jsx = renderSlide(body.slide, theme, body.handle);

  return new ImageResponse(jsx, {
    width: 1080,
    height: 1350,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    })),
  });
}
