import { NextRequest, NextResponse } from 'next/server';
import { isAuthed, runScraper, VERTICALS, Vertical } from '@/lib/admin';

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'not authorized' }, { status: 401 });
  }

  let body: { url?: string; vertical?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const url = (body.url || '').trim();
  const vertical = (body.vertical || 'ai_general').trim() as Vertical;
  const note = (body.note || '').trim().slice(0, 200);

  if (!url || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }
  if (!VERTICALS.includes(vertical)) {
    return NextResponse.json({ error: 'invalid vertical' }, { status: 400 });
  }

  const result = await runScraper(url, vertical, note);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
