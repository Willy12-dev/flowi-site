import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, makeAdminToken, ADMIN_COOKIE_NAME, ADMIN_PASSWORD_CONFIGURED } from '@/lib/admin';

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD_CONFIGURED) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD env var is not set on the server' },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const password = (body.password || '').trim();
  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'wrong password' }, { status: 401 });
  }

  const token = makeAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return res;
}
