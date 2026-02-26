"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function BeginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBegin() {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", { method: "POST" });
      const data = await res.json();
      sessionStorage.setItem("sessionId", data.id);
      router.push("/interview");
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button size="lg" onClick={handleBegin} disabled={loading}>
      {loading ? "Starting..." : "Begin Discovery Interview"}
    </Button>
  );
}
