import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Email capture endpoint for /dispatch (and any other lead-magnet pages).
 *
 * Three storage backends, tried in priority order. First one configured wins;
 * also-configured backends ALSO get the email (defense in depth):
 *
 *   1. Resend Audiences  — set RESEND_API_KEY + RESEND_AUDIENCE_ID
 *      Creates a real newsletter contact list, can broadcast from it.
 *      Get the audience_id from https://resend.com/audiences after creating
 *      one in the dashboard.
 *
 *   2. Beehiiv           — set BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID
 *      Legacy newsletter platform option.
 *
 *   3. JSONL file        — append-only at <project>/data/subscribers.jsonl
 *      Works locally and on any non-serverless host. NO-OP on Vercel and
 *      other serverless platforms (read-only filesystem).
 *
 * On Vercel: configure backend #1 or #2 or your subscribers vanish.
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

async function forwardToResend(sub: Subscriber): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) return { ok: false, error: 'resend audiences not configured' };
  try {
    const r = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: sub.email,
        unsubscribed: false,
      }),
    });
    if (!r.ok) {
      // 422 = email already in list — treat as success
      if (r.status === 422) return { ok: true };
      return { ok: false, error: `resend ${r.status}: ${await r.text()}` };
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

  // Track which backends actually accepted the subscriber
  const stored: string[] = [];

  // Resend Audiences — preferred path on Pro
  if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
    const r = await forwardToResend(sub);
    if (r.ok) stored.push('resend');
    else console.warn('resend audience forward failed:', r.error);
  }

  // Beehiiv — alternative
  if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
    const r = await forwardToBeehiiv(sub);
    if (r.ok) stored.push('beehiiv');
    else console.warn('beehiiv forward failed:', r.error);
  }

  // If neither cloud backend is configured AND we're on serverless, the
  // email is effectively lost. Log loudly so it shows in Vercel logs.
  if (stored.length === 0) {
    console.error(
      `SUBSCRIBER_LOST: no cloud backend configured. email=${sub.email} source=${sub.source}`
    );
  }

  return NextResponse.json({ ok: true, stored });
}

export async function GET() {
  // Cheap health check
  return NextResponse.json({ ok: true, endpoint: 'subscribe' });
}
