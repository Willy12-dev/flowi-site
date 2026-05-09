/**
 * Daily ops snapshot.
 *
 * Once per day, capture the state of the system: article count, scrapes,
 * subscribers, recent activity. Optionally email it via Resend if
 * RESEND_API_KEY + OPS_EMAIL_TO are configured.
 *
 * Schedule: daily at 07:00 UTC (after seo-ping).
 *
 * Auth: Vercel Cron sends Authorization: Bearer ${CRON_SECRET}.
 */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface OpsSnapshot {
  date: string;
  articles: {
    total: number;
    new_today: number;
    by_category: Record<string, number>;
  };
  subscribers: number;
  recent_articles: Array<{ slug: string; title: string; date: string; category: string }>;
}

async function safeReadDir(p: string): Promise<string[]> {
  try {
    return await fs.readdir(p);
  } catch {
    return [];
  }
}

async function countLines(p: string): Promise<number> {
  try {
    const data = await fs.readFile(p, "utf8");
    return data.split("\n").filter((l) => l.trim()).length;
  } catch {
    return 0;
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

async function buildSnapshot(): Promise<OpsSnapshot> {
  const blogDir = path.join(process.cwd(), "content", "blog");
  const files = await safeReadDir(blogDir);
  const today = todayStr();

  const byCategory: Record<string, number> = {};
  let newToday = 0;
  const recent: OpsSnapshot["recent_articles"] = [];

  for (const f of files) {
    if (!f.endsWith(".md") && !f.endsWith(".mdx")) continue;
    try {
      const text = await fs.readFile(path.join(blogDir, f), "utf8");
      const cat = text.match(/^category:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || "uncategorized";
      const date = text.match(/^date:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || "";
      const title = text.match(/^title:\s*['"]?([^\n'"]+)/m)?.[1]?.trim() || f;

      byCategory[cat] = (byCategory[cat] || 0) + 1;
      if (date === today) newToday += 1;
      recent.push({
        slug: f.replace(/\.(md|mdx)$/, ""),
        title,
        date,
        category: cat,
      });
    } catch {
      // skip
    }
  }

  recent.sort((a, b) => b.date.localeCompare(a.date));

  const subscribersFile = path.join(process.cwd(), "data", "subscribers.jsonl");
  const subscribers = await countLines(subscribersFile);

  return {
    date: today,
    articles: {
      total: recent.length,
      new_today: newToday,
      by_category: byCategory,
    },
    subscribers,
    recent_articles: recent.slice(0, 10),
  };
}

function renderEmailHtml(s: OpsSnapshot): string {
  const cats = Object.entries(s.articles.by_category)
    .map(([k, v]) => `<li>${k}: <strong>${v}</strong></li>`)
    .join("");
  const recent = s.recent_articles
    .map(
      (a) =>
        `<li><a href="https://useflowi.app/blog/${a.slug}">${a.title}</a> <small>(${a.category} · ${a.date})</small></li>`
    )
    .join("");

  return `
    <h2>Flowi Daily Ops — ${s.date}</h2>
    <h3>Articles</h3>
    <p><strong>${s.articles.total}</strong> total · <strong>${s.articles.new_today}</strong> published today</p>
    <ul>${cats}</ul>
    <h3>Subscribers</h3>
    <p><strong>${s.subscribers}</strong> on the Dispatch list</p>
    <h3>Recent</h3>
    <ol>${recent}</ol>
  `;
}

async function sendOpsEmail(s: OpsSnapshot): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OPS_EMAIL_TO;
  const from = process.env.OPS_EMAIL_FROM || "ops@useflowi.app";
  if (!apiKey || !to) return { sent: false, error: "resend not configured" };

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Flowi Ops · ${s.date} · ${s.articles.new_today} new article${s.articles.new_today === 1 ? "" : "s"}`,
        html: renderEmailHtml(s),
      }),
    });
    if (!r.ok) {
      return { sent: false, error: `resend ${r.status}: ${await r.text()}` };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: (e as Error).message };
  }
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

  const snapshot = await buildSnapshot();
  const emailResult = await sendOpsEmail(snapshot);

  return NextResponse.json({
    ok: true,
    snapshot,
    email: emailResult,
    timestamp: new Date().toISOString(),
  });
}
