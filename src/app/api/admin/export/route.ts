import { NextResponse } from "next/server";
import { listSessions, getMessages } from "@/lib/db";
import { getDurationMinutes } from "@/lib/utils";
import type { AdminExportResponse } from "@/lib/types";

export async function GET() {
  const sessions = listSessions();

  const enriched = sessions.map((session) => ({
    ...session,
    messages: getMessages(session.id),
    duration_minutes: getDurationMinutes(
      session.started_at,
      session.completed_at
    ),
  }));

  const response: AdminExportResponse = {
    exported_at: new Date().toISOString(),
    total_sessions: sessions.length,
    sessions: enriched,
  };

  return NextResponse.json(response);
}
