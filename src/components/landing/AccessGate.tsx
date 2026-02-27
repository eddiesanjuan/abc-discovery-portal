"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface AccessGateProps {
  onAuthenticated: () => void;
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block mr-1 -mt-0.5"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function AccessGate({ onAuthenticated }: AccessGateProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/visitor/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        sessionStorage.setItem("visitorAuth", "true");
        onAuthenticated();
      } else {
        setError("That code doesn't seem right. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6">
      <Card className="w-full max-w-sm">
        <h2 className="font-playfair text-2xl text-charcoal text-center mb-2">
          Welcome
        </h2>
        <p className="text-warm-gray text-sm text-center mb-6">
          Please enter your access code to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              aria-label="Access code"
              autoFocus
              className="w-full rounded-lg border border-stone/50 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition-colors text-center tracking-widest"
            />
            <p className="text-warm-gray text-xs text-center mt-1" style={{ color: "#7A756D" }}>
              Code is case-sensitive
            </p>
          </div>
          {error && (
            <p className="text-terracotta text-sm text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </form>
        <p className="text-warm-gray text-xs text-center mt-6 leading-relaxed">
          <LockIcon />
          Everything shared here goes directly to Eddie San Juan and nowhere
          else. Your responses are completely private and used solely to prepare
          for your upcoming meeting.
        </p>
      </Card>
    </div>
  );
}
