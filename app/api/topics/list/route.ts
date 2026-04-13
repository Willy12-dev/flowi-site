import { NextRequest, NextResponse } from "next/server";

const FLOWI_LEADS_API = process.env.FLOWI_LEADS_API_URL || "http://localhost:8001";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "topics";

  try {
    const res = await fetch(`${FLOWI_LEADS_API}/api/content/${type}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ items: [] });
  }
}
