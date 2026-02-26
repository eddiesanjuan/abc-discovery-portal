"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import PasswordGate from "@/components/admin/PasswordGate";
import SessionList from "@/components/admin/SessionList";
import SessionDetail from "@/components/admin/SessionDetail";
import Spinner from "@/components/ui/Spinner";
import type { Session } from "@/lib/types";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => setSessions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl text-charcoal mb-8">
          Interview Sessions
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[340px_1fr] gap-8">
            <div>
              <SessionList
                sessions={sessions}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <div>
              {selectedId ? (
                <SessionDetail sessionId={selectedId} />
              ) : (
                <div className="flex items-center justify-center h-64 rounded-xl bg-cream/50 border border-stone/20">
                  <p className="text-warm-gray text-sm">
                    Select a session to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
