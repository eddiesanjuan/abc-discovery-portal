"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { UIMessage } from "ai";

interface ChatContainerProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function ChatContainer({
  messages,
  isLoading,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
                msg.role === "assistant"
                  ? text.replace("[INTERVIEW_COMPLETE]", "").trim()
                  : text
              }
            />
          );
        })}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
