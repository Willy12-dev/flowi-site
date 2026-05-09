/**
 * Admin panel helpers.
 *
 * Reads/writes filesystem state from BOTH:
 *   - flowi-site (this project)              — articles, subscribers
 *   - FlowiLeads (sibling project)           — scrapes, daily reports, books
 *
 * Cross-project access is controlled by the FLOWI_LEADS_PATH env var.
 *
 * Auth model: a single ADMIN_PASSWORD env var. The login route sets a signed
 * cookie that the admin layout checks on every request. Single-user, simple,
 * no DB.
 */
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const FLOWI_LEADS_PATH =
  process.env.FLOWI_LEADS_PATH || 'C:\\Users\\User\\FlowiLeads';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'flowi-admin-default-secret-change-me';
const ADMIN_COOKIE = 'flowi_admin';
export const VERTICALS = ['ai_general', 'ai_trading', 'ai_behavior'] as const;
export type Vertical = (typeof VERTICALS)[number];

/* ─── auth ────────────────────────────────────────────────────────── */

function sign(value: string): string {
  return crypto.createHmac('sha256', ADMIN_SECRET).update(value).digest('hex');
}

export function makeAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf('.');
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload)));
}

export function checkPassword(input: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  if (input.length !== ADMIN_PASSWORD.length) return false;
  return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(ADMIN_PASSWORD));
}

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return verifyAdminToken(c.get(ADMIN_COOKIE)?.value);
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
export const ADMIN_PASSWORD_CONFIGURED = !!ADMIN_PASSWORD;

/* ─── system state ────────────────────────────────────────────────── */

export interface SystemState {
  articles: Record<string, number>; // category -> count
  totalArticles: number;
  scrapes: Record<Vertical, number>;
  totalScrapes: number;
  subscribers: number;
  books: { live: number; inProduction: number };
  flowiLeadsAvailable: boolean;
  flowiLeadsPath: string;
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
    const data = await fs.readFile(p, 'utf8');
    return data.split('\n').filter((l) => l.trim()).length;
  } catch {
    return 0;
  }
}

export async function getSystemState(): Promise<SystemState> {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const articleFiles = await safeReadDir(blogDir);
  const articles: Record<string, number> = {};
  let totalArticles = 0;

  for (const f of articleFiles) {
    if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
    totalArticles += 1;
    try {
      const text = await fs.readFile(path.join(blogDir, f), 'utf8');
      const m = text.match(/^category:\s*['"]?([^\n'"]+)/m);
      const cat = (m?.[1] || 'uncategorized').trim();
      articles[cat] = (articles[cat] || 0) + 1;
    } catch {
      articles['uncategorized'] = (articles['uncategorized'] || 0) + 1;
    }
  }

  const scrapes: Record<Vertical, number> = {
    ai_general: 0,
    ai_trading: 0,
    ai_behavior: 0,
  };
  let totalScrapes = 0;
  let flowiLeadsAvailable = true;
  try {
    await fs.access(FLOWI_LEADS_PATH);
    for (const v of VERTICALS) {
      const dir = path.join(FLOWI_LEADS_PATH, 'output', 'scraped', v);
      const files = (await safeReadDir(dir)).filter((f) => f.endsWith('.md'));
      scrapes[v] = files.length;
      totalScrapes += files.length;
    }
  } catch {
    flowiLeadsAvailable = false;
  }

  const subscribersFile = path.join(process.cwd(), 'data', 'subscribers.jsonl');
  const subscribers = await countLines(subscribersFile);

  return {
    articles,
    totalArticles,
    scrapes,
    totalScrapes,
    subscribers,
    books: { live: 1, inProduction: 5 },
    flowiLeadsAvailable,
    flowiLeadsPath: FLOWI_LEADS_PATH,
  };
}

/* ─── recent scrapes ──────────────────────────────────────────────── */

export interface ScrapeFile {
  vertical: Vertical;
  filename: string;
  path: string;
  size: number;
  modified: string;
  author?: string;
  sourceUrl?: string;
  note?: string;
}

export async function getRecentScrapes(limit = 20): Promise<ScrapeFile[]> {
  const all: ScrapeFile[] = [];
  for (const v of VERTICALS) {
    const dir = path.join(FLOWI_LEADS_PATH, 'output', 'scraped', v);
    const files = await safeReadDir(dir);
    for (const f of files) {
      if (!f.endsWith('.md')) continue;
      const full = path.join(dir, f);
      try {
        const stat = await fs.stat(full);
        const text = await fs.readFile(full, 'utf8');
        const author = text.match(/^author:\s*(.+)$/m)?.[1]?.trim();
        const sourceUrl = text.match(/^source_url:\s*(.+)$/m)?.[1]?.trim();
        const note = text.match(/^note:\s*(.*)$/m)?.[1]?.trim() || undefined;
        all.push({
          vertical: v,
          filename: f,
          path: full,
          size: stat.size,
          modified: stat.mtime.toISOString(),
          author,
          sourceUrl,
          note: note || undefined,
        });
      } catch {
        // skip
      }
    }
  }
  all.sort((a, b) => b.modified.localeCompare(a.modified));
  return all.slice(0, limit);
}

/* ─── recent articles ─────────────────────────────────────────────── */

export interface ArticleFile {
  filename: string;
  slug: string;
  title?: string;
  category?: string;
  date?: string;
  modified: string;
}

export async function getRecentArticles(limit = 10): Promise<ArticleFile[]> {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const files = await safeReadDir(blogDir);
  const all: ArticleFile[] = [];
  for (const f of files) {
    if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
    const full = path.join(blogDir, f);
    try {
      const stat = await fs.stat(full);
      const text = await fs.readFile(full, 'utf8');
      const title = text.match(/^title:\s*['"]?([^\n'"]+)/m)?.[1]?.trim();
      const category = text.match(/^category:\s*['"]?([^\n'"]+)/m)?.[1]?.trim();
      const date = text.match(/^date:\s*['"]?([^\n'"]+)/m)?.[1]?.trim();
      all.push({
        filename: f,
        slug: f.replace(/\.(md|mdx)$/, ''),
        title,
        category,
        date,
        modified: stat.mtime.toISOString(),
      });
    } catch {
      // skip
    }
  }
  all.sort((a, b) => (b.date || b.modified).localeCompare(a.date || a.modified));
  return all.slice(0, limit);
}

/* ─── scraper invocation ──────────────────────────────────────────── */

export interface ScrapeResult {
  ok: boolean;
  output: string;
  error?: string;
  outFile?: string;
  strategy?: string;
}

export async function runScraper(
  url: string,
  vertical: Vertical,
  note: string
): Promise<ScrapeResult> {
  return new Promise((resolve) => {
    const args = [
      path.join('scripts', 'scrape_thread.py'),
      url,
      '--vertical',
      vertical,
    ];
    if (note) {
      args.push('--note', note);
    }

    const proc = spawn('python', args, {
      cwd: FLOWI_LEADS_PATH,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' },
      shell: false,
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => (stdout += d.toString()));
    proc.stderr.on('data', (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      resolve({
        ok: false,
        output: stdout + stderr,
        error: 'scrape timed out after 90s',
      });
    }, 90_000);

    proc.on('close', (code) => {
      clearTimeout(timer);
      const combined = (stderr + '\n' + stdout).trim();
      const fileMatch = combined.match(
        /->\s+([^\s]+\.md)/
      );
      const stratMatch = combined.match(/strategy:\s*(\w+)/);
      resolve({
        ok: code === 0,
        output: combined,
        outFile: fileMatch?.[1],
        strategy: stratMatch?.[1],
        error: code !== 0 ? `python exited ${code}` : undefined,
      });
    });

    proc.on('error', (e) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        output: stdout + stderr,
        error: `spawn failed: ${e.message}`,
      });
    });
  });
}
