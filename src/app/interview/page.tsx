"use client";

import { useEffect, useState, useCallback, useMemo, useSyncExternalStore } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { INITIAL_MESSAGE, PHASE_LABELS } from "@/lib/prompts";
import ProgressBar from "@/components/interview/ProgressBar";
import ChatContainer from "@/components/interview/ChatContainer";
import InputBar from "@/components/interview/InputBar";
import CompletionTransition from "@/components/interview/CompletionTransition";

const emptySubscribe = () => () => {};

function useSessionId(): string | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("sessionId"),
    () => null
  );
}

export default function InterviewPage() {
  const router = useRouter();
  const sessionId = useSessionId();
  const [completed, setCompleted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [input, setInput] = useState("");

  // Redirect if no session (client-only)
  useEffect(() => {
    if (sessionId === null) return; // SSR or not yet hydrated
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

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

      // Brief pause so the user can read the final message before overlay
      await new Promise((r) => setTimeout(r, 1500));

      // Show the premium transition overlay
      setTransitioning(true);

      // Fire extraction in parallel with the visual transition
      const extractionPromise = fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {
        // Extraction is best-effort
      });

      // Let the transition animation play for at least 2.5s
      const [extractionDone] = await Promise.allSettled([
        extractionPromise,
        new Promise((r) => setTimeout(r, 2500)),
      ]);
      void extractionDone;

      router.push(`/complete?session=${sessionId}`);
    }
  }, [messages, sessionId, completed, router]);

  useEffect(() => {
    if (!isLoading && messages.length > 1) {
      // checkCompletion is async and sets state only conditionally after
      // an async gap (fetch), so the synchronous setState concern doesn't apply.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkCompletion();
    }
  }, [isLoading, messages, checkCompletion]);

  // Determine phase from the AI's [PHASE:N] marker in the most recent assistant message.
  // Phase 7 (farewell) maps to phase index 5 (6/6 on the progress bar).
  const phase = useMemo(() => {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistant) return 0;
    const text = lastAssistant.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
    const match = text.match(/\[PHASE:(\d+)\]/);
    if (match) {
      const n = parseInt(match[1], 10);
      // Phase 7 (farewell) stays at 6/6 → index 5
      return Math.min(Math.max(n - 1, 0), PHASE_LABELS.length - 1);
    }
    return 0;
  }, [messages]);

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
      <ProgressBar currentPhase={phase} />
      <ChatContainer messages={messages} status={status} />
      {!completed && (
        <InputBar
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSend={handleSend}
        />
      )}
      {transitioning && <CompletionTransition />}
    </div>
  );
}
