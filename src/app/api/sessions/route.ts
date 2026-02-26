import { NextResponse } from "next/server";
import { createSession, listSessions } from "@/lib/db";
import { generateId } from "@/lib/utils";

export async function POST() {
  const id = generateId();
  const session = createSession(id);
  return NextResponse.json({ id: session.id, started_at: session.started_at });
}

export async function GET() {
  const sessions = listSessions();
  return NextResponse.json(sessions);
}
