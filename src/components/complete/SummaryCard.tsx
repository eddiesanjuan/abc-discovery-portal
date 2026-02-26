"use client";

import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";

interface SummaryCardProps {
  summary: string | null;
  painPoints: string[];
  aiInterests: string[];
}

export default function SummaryCard({
  summary,
  painPoints,
  aiInterests,
}: SummaryCardProps) {
  if (!summary && painPoints.length === 0 && aiInterests.length === 0) {
    return null;
  }

  return (
    <FadeIn delay={0.3}>
      <Card className="max-w-2xl mx-auto">
        {summary && (
          <div className="mb-6">
            <h3 className="font-playfair text-lg text-charcoal mb-2">
              Conversation Summary
            </h3>
            <p className="text-warm-gray text-sm leading-relaxed">
              {summary}
            </p>
          </div>
        )}
        {painPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="font-playfair text-lg text-charcoal mb-2">
              Key Themes Discussed
            </h3>
            <ul className="space-y-1.5">
              {painPoints.map((point, i) => (
                <li
                  key={i}
                  className="text-warm-gray text-sm flex items-start gap-2"
                >
                  <span className="text-gold mt-0.5">&#8226;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        {aiInterests.length > 0 && (
          <div>
            <h3 className="font-playfair text-lg text-charcoal mb-2">
              Areas of Interest
            </h3>
            <ul className="space-y-1.5">
              {aiInterests.map((interest, i) => (
                <li
                  key={i}
                  className="text-warm-gray text-sm flex items-start gap-2"
                >
                  <span className="text-gold mt-0.5">&#8226;</span>
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </FadeIn>
  );
}
