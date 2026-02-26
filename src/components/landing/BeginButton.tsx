"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function BeginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleBegin() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/sessions", { method: "POST" });
      const data = await res.json();
      sessionStorage.setItem("sessionId", data.id);
      router.push("/interview");
    } catch {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <>
      <Button size="lg" onClick={handleBegin} disabled={loading}>
        {loading ? "Starting..." : "Begin Discovery Interview"}
      </Button>
      {error && (
        <p className="text-terracotta text-sm mt-3">
          Something went wrong. Please try again.
        </p>
      )}
    </>
  );
}
