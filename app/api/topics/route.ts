import { NextRequest, NextResponse } from "next/server";

const FLOWI_LEADS_API = process.env.FLOWI_LEADS_API_URL || "http://localhost:8001";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "flowi2026";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${FLOWI_LEADS_API}/api/content/topic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raw_input: body.content,
        category: body.category || "",
        is_ebook_material: body.isEbookMaterial || false,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit topic" },
      { status: 500 }
    );
  }
}
