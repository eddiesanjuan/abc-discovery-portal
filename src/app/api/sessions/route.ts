import { NextResponse } from "next/server";
import { createSession, addMessage, listSessions } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { INITIAL_MESSAGE } from "@/lib/prompts";

export async function POST() {
  const id = generateId();
  const session = createSession(id);
  addMessage(session.id, "assistant", INITIAL_MESSAGE, 1);
  return NextResponse.json({ id: session.id, started_at: session.started_at });
}

export async function GET() {
  const sessions = listSessions();
  return NextResponse.json(sessions);
}
