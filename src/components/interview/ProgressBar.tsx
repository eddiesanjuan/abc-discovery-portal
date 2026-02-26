"use client";

import { PHASE_LABELS } from "@/lib/prompts";

interface ProgressBarProps {
  messageCount: number;
}

export default function ProgressBar({ messageCount }: ProgressBarProps) {
  // Estimate phase: every ~3 message pairs advances one phase
  const pairCount = Math.floor(messageCount / 2);
  const phase = Math.min(pairCount, PHASE_LABELS.length - 1);
  const progress = ((phase + 1) / PHASE_LABELS.length) * 100;

  return (
    <div className="w-full">
      <div className="h-1 bg-stone/30 w-full">
        <div
          className="h-full bg-gold transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
