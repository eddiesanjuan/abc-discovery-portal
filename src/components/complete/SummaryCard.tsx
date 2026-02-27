"use client";

import FadeIn from "@/components/ui/FadeIn";

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
  const hasContent =
    summary || painPoints.length > 0 || aiInterests.length > 0;

  return (
    <FadeIn delay={0.6}>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-cream/60 rounded-2xl border border-stone/20 p-8">
          {hasContent ? (
            <>
              {summary && (
                <div className="mb-6">
                  <h3 className="font-playfair text-lg text-charcoal mb-3">
                    What We Covered
                  </h3>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    {summary}
                  </p>
                </div>
              )}
              {painPoints.length > 0 && (
                <div className={aiInterests.length > 0 ? "mb-6" : ""}>
                  <h3 className="font-playfair text-lg text-charcoal mb-3">
                    Key Themes
                  </h3>
                  <ul className="space-y-2">
                    {painPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-warm-gray text-sm flex items-start gap-2.5"
                      >
                        <span className="text-gold mt-0.5 text-xs">&#9670;</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiInterests.length > 0 && (
                <div>
                  <h3 className="font-playfair text-lg text-charcoal mb-3">
                    Areas of Interest
                  </h3>
                  <ul className="space-y-2">
                    {aiInterests.map((interest, i) => (
                      <li
                        key={i}
                        className="text-warm-gray text-sm flex items-start gap-2.5"
                      >
                        <span className="text-gold mt-0.5 text-xs">&#9670;</span>
                        {interest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-warm-gray text-sm leading-relaxed">
                Your insights have been shared with Eddie. He&apos;ll review
                everything before your meeting.
              </p>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
