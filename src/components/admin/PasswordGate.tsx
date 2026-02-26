"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("adminAuth", "true");
        onAuthenticated();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6">
      <Card className="w-full max-w-sm">
        <h2 className="font-playfair text-xl text-charcoal text-center mb-6">
          Admin Access
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-lg border border-stone/50 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition-colors"
          />
          {error && (
            <p className="text-terracotta text-sm text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Enter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
