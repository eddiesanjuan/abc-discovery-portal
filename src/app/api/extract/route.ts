import { NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getMessages, updateSession } from "@/lib/db";
import { EXTRACTION_PROMPT } from "@/lib/prompts";
import type { InsightExtraction } from "@/lib/types";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing sessionId" },
      { status: 400 }
    );
  }

  const messages = getMessages(sessionId);
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "No messages found" },
      { status: 404 }
    );
  }

  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "Interviewer" : "Participant"}: ${m.content}`)
    .join("\n\n");

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: EXTRACTION_PROMPT,
    prompt: transcript,
  });

  // Parse the JSON response
  let extraction: InsightExtraction;
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    extraction = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse extraction", raw: text },
      { status: 500 }
    );
  }

  // Update session with extracted insights
  updateSession(sessionId, {
    summary: extraction.summary,
    participant_name: extraction.participant_name,
    participant_role: extraction.participant_role,
    key_pain_points: JSON.stringify(extraction.key_pain_points),
    ai_interests: JSON.stringify(extraction.ai_interests),
    questions_for_eddie: JSON.stringify(extraction.questions_for_eddie),
    vision_notes: extraction.vision_notes,
    status: "completed",
    completed_at: new Date().toISOString(),
  });

  return NextResponse.json(extraction);
}
