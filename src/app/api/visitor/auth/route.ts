import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();
  const visitorCode = process.env.VISITOR_CODE || "ABC2026";

  if (code === visitorCode) {
    return NextResponse.json({ authorized: true });
  }

  return NextResponse.json(
    { error: "Invalid access code" },
    { status: 401 }
  );
}
