import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { addMessage, getSession } from "@/lib/db";
import { INTERVIEW_SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

// Extract text content from AI SDK v6 message format (parts array)
function getMessageText(msg: Record<string, unknown>): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return (msg.parts as Array<{ type: string; text?: string }>)
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
  }
  if (typeof msg.content === "string") {
    return msg.content;
  }
  return "";
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "AI service is not configured. Please contact the administrator." },
      { status: 503 }
    );
  }

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
    const userText = getMessageText(lastUserMsg);
    if (userText) {
      addMessage(sessionId, "user", userText);
    }
  }

  // Convert UIMessage format (parts array) to ModelMessage format (content string)
  // Required because useChat sends UIMessages but streamText expects ModelMessages
  const modelMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: getMessageText(msg),
  }));

  try {
    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: INTERVIEW_SYSTEM_PROMPT,
      messages: modelMessages,
      onFinish: async ({ text }) => {
        // Save assistant response to DB
        const assistantText = typeof text === "string" ? text : "";
        if (assistantText) {
          addMessage(sessionId, "assistant", assistantText);
        }

        // Check for interview completion marker
        if (assistantText.includes("[INTERVIEW_COMPLETE]")) {
          const { updateSession } = await import("@/lib/db");
          updateSession(sessionId, {
            status: "completed",
            completed_at: new Date().toISOString(),
          });
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
