import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check API key
  checks.anthropic_key = process.env.ANTHROPIC_API_KEY ? "set" : "missing";

  // Check DB
  try {
    const db = getDb();
    const row = db.prepare("SELECT 1 AS ok").get() as { ok: number };
    checks.database = row?.ok === 1 ? "ok" : "error";
  } catch {
    checks.database = "error";
  }

  const healthy =
    checks.anthropic_key === "set" && checks.database === "ok";

  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
}
