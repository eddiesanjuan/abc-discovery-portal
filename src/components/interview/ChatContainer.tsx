"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { UIMessage } from "ai";

interface ChatContainerProps {
  messages: UIMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
}

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function cleanAssistantText(text: string): string {
  // Remove phase markers (e.g. [PHASE:3])
  let cleaned = text.replace(/\[PHASE:\d+\]/g, "").trim();
  // During streaming, hide partial phase marker artifacts (e.g. [PHASE, [PHASE:)
  cleaned = cleaned.replace(/\[PHASE(?::\d*)?$/g, "").trim();
  // Remove complete marker
  cleaned = cleaned.replace("[INTERVIEW_COMPLETE]", "").trim();
  // During streaming, hide partial interview-complete marker artifacts
  if (cleaned.includes("[INTERVIEW")) {
    cleaned = cleaned.replace(/\[INTERVIEW.*$/, "").trim();
  }
  // Remove suggestion markers (e.g. [SUGGESTIONS: "A" | "B" | "C"])
  cleaned = cleaned.replace(/\[SUGGESTIONS:.*?\]/g, "").trim();
  // During streaming, hide partial suggestion marker artifacts
  cleaned = cleaned.replace(/\[SUGGESTIONS(?::.*)?$/g, "").trim();
  return cleaned;
}

/** Extract suggestion options from [SUGGESTIONS: "A" | "B" | "C"] marker */
export function parseSuggestions(text: string): string[] {
  const match = text.match(/\[SUGGESTIONS:\s*(.*?)\]/);
  if (!match) return [];
  return match[1]
    .split("|")
    .map((s) => s.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
}

export default function ChatContainer({
  messages,
  status,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {messages.map((msg) => {
          const text = getMessageText(msg);
          if (!text) return null;
          return (
            <MessageBubble
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={
                msg.role === "assistant" ? cleanAssistantText(text) : text
              }
            />
          );
        })}
        {status === "error" && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[85%] md:max-w-[75%] px-5 py-3 rounded-2xl rounded-bl-md bg-terracotta/10 text-terracotta text-sm">
              Something went wrong. Please try sending your message again.
            </div>
          </div>
        )}
        {status === "submitted" && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
