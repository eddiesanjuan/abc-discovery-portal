import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { addMessage, getSession } from "@/lib/db";
import { INTERVIEW_SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return new Response("Session not found", { status: 404 });
  }

  // Save the latest user message to DB
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg?.role === "user") {
    addMessage(sessionId, "user", lastUserMsg.content);
  }

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: INTERVIEW_SYSTEM_PROMPT,
    messages,
    onFinish: async ({ text }) => {
      // Save assistant response to DB
      addMessage(sessionId, "assistant", text);

      // Check for interview completion marker
      if (text.includes("[INTERVIEW_COMPLETE]")) {
        const { updateSession } = await import("@/lib/db");
        updateSession(sessionId, {
          status: "completed",
          completed_at: new Date().toISOString(),
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
