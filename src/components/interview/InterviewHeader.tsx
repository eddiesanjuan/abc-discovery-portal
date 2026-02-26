import { PHASE_LABELS } from "@/lib/prompts";

interface InterviewHeaderProps {
  phase: number;
}

export default function InterviewHeader({ phase }: InterviewHeaderProps) {
  const label = PHASE_LABELS[phase] || PHASE_LABELS[0];

  return (
    <div className="text-center py-4">
      <p className="text-sm text-warm-gray tracking-wide uppercase">
        {label}
      </p>
    </div>
  );
}
