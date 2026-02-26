"use client";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed",
          isUser
            ? "bg-user-bg text-user-text rounded-br-md"
            : "bg-assistant-bg text-charcoal rounded-bl-md"
        )}
      >
        {content}
      </div>
    </div>
  );
}
