"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { INITIAL_MESSAGE, PHASE_LABELS } from "@/lib/prompts";
import InterviewHeader from "@/components/interview/InterviewHeader";
import ProgressBar from "@/components/interview/ProgressBar";
import ChatContainer from "@/components/interview/ChatContainer";
import InputBar from "@/components/interview/InputBar";

export default function InterviewPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("sessionId");
    if (!id) {
      router.replace("/");
      return;
    }
    setSessionId(id);
  }, [router]);

  const transport = useMemo(() => {
    if (!sessionId) return undefined;
    return new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId },
    });
  }, [sessionId]);

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: [
      {
        id: "initial",
        role: "assistant" as const,
        parts: [{ type: "text" as const, text: INITIAL_MESSAGE }],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Check for completion marker
  const checkCompletion = useCallback(async () => {
    if (completed || !sessionId) return;
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    const text = lastAssistant.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
    if (text.includes("[INTERVIEW_COMPLETE]")) {
      setCompleted(true);
      try {
        await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        // Extraction is best-effort
      }
      router.push(`/complete?session=${sessionId}`);
    }
  }, [messages, sessionId, completed, router]);

  useEffect(() => {
    if (!isLoading && messages.length > 1) {
      checkCompletion();
    }
  }, [isLoading, messages, checkCompletion]);

  // Estimate phase from message count
  const pairCount = Math.floor(messages.length / 2);
  const phase = Math.min(pairCount, PHASE_LABELS.length - 1);

  async function handleSend() {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-warm-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ivory">
      <ProgressBar messageCount={messages.length} />
      <div className="border-b border-stone/20">
        <div className="max-w-2xl mx-auto">
          <InterviewHeader phase={phase} />
        </div>
      </div>
      <ChatContainer messages={messages} isLoading={isLoading} />
      <InputBar
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}
