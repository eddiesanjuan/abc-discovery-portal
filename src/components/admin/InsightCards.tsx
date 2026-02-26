"use client";

interface InsightCardsProps {
  painPoints: string[];
  aiInterests: string[];
  questionsForEddie: string[];
  visionNotes: string | null;
}

function InsightCard({
  title,
  items,
  accentColor,
}: {
  title: string;
  items: string[];
  accentColor: string;
}) {
  if (items.length === 0) return null;
  return (
    <div
      className="rounded-xl border border-stone/30 bg-cream p-4"
      style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
    >
      <h4 className="font-medium text-charcoal text-sm mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-warm-gray text-xs leading-relaxed">
            &bull; {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InsightCards({
  painPoints,
  aiInterests,
  questionsForEddie,
  visionNotes,
}: InsightCardsProps) {
  return (
    <div className="space-y-3">
      <InsightCard
        title="Pain Points"
        items={painPoints}
        accentColor="#C17B5E"
      />
      <InsightCard
        title="AI Interests"
        items={aiInterests}
        accentColor="#1B2838"
      />
      <InsightCard
        title="Questions for Eddie"
        items={questionsForEddie}
        accentColor="#C5A572"
      />
      {visionNotes && (
        <div
          className="rounded-xl border border-stone/30 bg-cream p-4"
          style={{ borderLeftWidth: 3, borderLeftColor: "#7A8B6F" }}
        >
          <h4 className="font-medium text-charcoal text-sm mb-2">
            Vision
          </h4>
          <p className="text-warm-gray text-xs leading-relaxed">
            {visionNotes}
          </p>
        </div>
      )}
    </div>
  );
}
