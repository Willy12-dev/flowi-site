/**
 * Daily SEO ping via IndexNow.
 *
 * IndexNow is the Microsoft + Yandex search-engine push protocol. POSTing
 * a list of URLs notifies Bing, Yandex, Naver, Seznam, and DuckDuckGo
 * (which uses Bing) within minutes. Google deprecated their ping endpoint
 * in 2023 — they auto-discover via the sitemap registered in Search
 * Console. So this cron handles every search engine *except* Google,
 * and Google is handled passively via the dynamic sitemap.
 *
 * Schedule: daily at 06:30 UTC (after the daily content drop).
 *
 * Auth: Vercel Cron sends Authorization: Bearer ${CRON_SECRET}.
 *
 * Setup:
 *   1. CRON_SECRET env var (random hex)
 *   2. INDEXNOW_KEY env var (must match the .txt at /public/{key}.txt)
 */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const HOST = "useflowi.app";
const KEY = process.env.INDEXNOW_KEY || "91b8853f6c1b7e27065e7082e96cb6a1";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/** Pull all blog post slugs from the markdown files. */
async function listBlogUrls(): Promise<string[]> {
  const blogDir = path.join(process.cwd(), "content", "blog");
  let entries: string[] = [];
  try {
    entries = await fs.readdir(blogDir);
  } catch {
    return [];
  }
  return entries
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => `https://${HOST}/blog/${f.replace(/\.(md|mdx)$/, "")}`);
}

/** Static high-priority pages always re-pinged. */
function staticUrls(): string[] {
  return [
    `https://${HOST}/`,
    `https://${HOST}/blog`,
    `https://${HOST}/dispatch`,
    `https://${HOST}/courses`,
    `https://${HOST}/about`,
    `https://${HOST}/trader`,
    `https://${HOST}/launch`,
    `https://${HOST}/sources`,
    `https://${HOST}/leads`,
  ];
}

/** Category index pages — each gets BreadcrumbList + CollectionPage schema. */
function categoryUrls(): string[] {
  return [
    `https://${HOST}/blog/category/ai_general`,
    `https://${HOST}/blog/category/ai_trading`,
    `https://${HOST}/blog/category/ai_behavior`,
    `https://${HOST}/blog/category/ai_builder`,
  ];
}

function checkAuth(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return true; // dev-mode fallback
  const got = request.headers.get("authorization");
  return got === `Bearer ${expected}`;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const blogUrls = await listBlogUrls();
  const urlList = [...staticUrls(), ...categoryUrls(), ...blogUrls];

  if (urlList.length === 0) {
    return NextResponse.json({ ok: false, reason: "no urls to submit" });
  }

  const payload: IndexNowPayload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  try {
    const r = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Host: "api.indexnow.org",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      ok: r.ok,
      status: r.status,
      submitted: urlList.length,
      breakdown: {
        static: staticUrls().length,
        categories: categoryUrls().length,
        blog: blogUrls.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: (e as Error).message,
        submitted: 0,
      },
      { status: 500 }
    );
  }
}
