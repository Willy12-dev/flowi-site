import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Email capture endpoint for /atlas (and any other lead-magnet pages).
 *
 * Default backend: append-only JSONL file at <project>/data/subscribers.jsonl.
 *   Works locally and on any non-serverless host (Render, Railway, VPS).
 *
 * Optional upgrade: set BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID in env →
 * the route forwards to Beehiiv's API instead of (or in addition to) the file.
 *
 * For Vercel-serverless deployments, set USE_BEEHIIV=true + creds; the
 * filesystem write is a no-op in that case.
 */

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.jsonl');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Subscriber {
  email: string;
  source: string;
  ip?: string;
  user_agent?: string;
  created_at: string;
}

async function appendToFile(sub: Subscriber) {
  try {
    await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
    await fs.appendFile(SUBSCRIBERS_FILE, JSON.stringify(sub) + '\n', 'utf8');
  } catch (e) {
    // Serverless filesystems are read-only — silently fall through
    console.warn('appendToFile skipped:', (e as Error).message);
  }
}

async function forwardToBeehiiv(sub: Subscriber): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pubId) return { ok: false, error: 'beehiiv not configured' };
  try {
    const r = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: sub.email,
        utm_source: sub.source,
        reactivate_existing: true,
        send_welcome_email: true,
      }),
    });
    if (!r.ok) {
      return { ok: false, error: `beehiiv ${r.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function POST(request: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const source = (body.source || 'unknown').slice(0, 60);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  }

  const sub: Subscriber = {
    email,
    source,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    user_agent: request.headers.get('user-agent') || undefined,
    created_at: new Date().toISOString(),
  };

  // Always try the JSONL append (no-op on serverless RO filesystem)
  await appendToFile(sub);

  // Optional: forward to Beehiiv if credentials are present
  if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
    const r = await forwardToBeehiiv(sub);
    if (!r.ok) console.warn('beehiiv forward failed:', r.error);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Cheap health check
  return NextResponse.json({ ok: true, endpoint: 'subscribe' });
}
