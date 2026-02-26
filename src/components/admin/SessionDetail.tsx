"use client";

import { useEffect, useState } from "react";
import MessageBubble from "@/components/interview/MessageBubble";
import InsightCards from "./InsightCards";
import Spinner from "@/components/ui/Spinner";
import type { Session, Message } from "@/lib/types";

interface SessionWithMessages extends Session {
  messages: Message[];
}

function safeParseArray(json: string | null): string[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export default function SessionDetail({
  sessionId,
}: {
  sessionId: string;
}) {
  const [data, setData] = useState<SessionWithMessages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-warm-gray text-sm text-center py-8">
        Session not found.
      </p>
    );
  }

  const painPoints = safeParseArray(data.key_pain_points);
  const aiInterests = safeParseArray(data.ai_interests);
  const questionsForEddie = safeParseArray(data.questions_for_eddie);

  return (
    <div className="space-y-6">
      {data.summary && (
        <div className="rounded-xl bg-cream border border-stone/30 p-4">
          <h3 className="font-playfair text-lg text-charcoal mb-2">
            Summary
          </h3>
          <p className="text-warm-gray text-sm leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      <InsightCards
        painPoints={painPoints}
        aiInterests={aiInterests}
        questionsForEddie={questionsForEddie}
        visionNotes={data.vision_notes}
      />

      <div>
        <h3 className="font-playfair text-lg text-charcoal mb-4">
          Transcript
        </h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto rounded-xl bg-ivory/50 p-4">
          {data.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content
                .replace("[INTERVIEW_COMPLETE]", "")
                .trim()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
