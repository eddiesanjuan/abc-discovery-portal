"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ThankYouHero from "@/components/complete/ThankYouHero";
import SummaryCard from "@/components/complete/SummaryCard";
import NextSteps from "@/components/complete/NextSteps";
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

function CompleteContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<SessionWithMessages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id =
      searchParams.get("session") || sessionStorage.getItem("sessionId");
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`/api/sessions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main className="px-6">
        <ThankYouHero />
        <SummaryCard
          summary={session?.summary ?? null}
          painPoints={safeParseArray(session?.key_pain_points ?? null)}
          aiInterests={safeParseArray(session?.ai_interests ?? null)}
        />
        <NextSteps />
      </main>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-ivory">
          <Spinner />
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
