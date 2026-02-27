"use client";

import { PHASE_LABELS } from "@/lib/prompts";

interface ProgressBarProps {
  currentPhase: number;
}

export default function ProgressBar({
  currentPhase,
}: ProgressBarProps) {
  const phase = Math.min(currentPhase, PHASE_LABELS.length - 1);
  const progress = ((phase + 1) / PHASE_LABELS.length) * 100;

  return (
    <div className="w-full">
      {/* Gold progress bar */}
      <div className="h-1 bg-stone/30 w-full">
        <div
          className="h-full bg-gold transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Phase label and step count */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2 max-w-2xl mx-auto">
        <p className="text-xs text-warm-gray tracking-wide">
          {PHASE_LABELS[phase]}
        </p>
        <p className="text-xs text-warm-gray/60 tabular-nums">
          {phase + 1} of {PHASE_LABELS.length}
        </p>
      </div>
    </div>
  );
}
