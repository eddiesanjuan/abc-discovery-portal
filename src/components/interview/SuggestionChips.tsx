"use client";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  visible: boolean;
}

export default function SuggestionChips({
  suggestions,
  onSelect,
  visible,
}: SuggestionChipsProps) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 pb-2 animate-fade-in">
      <p className="text-xs text-warm-gray mb-2 tracking-wide">
        Suggested responses
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            className="text-left px-4 py-2.5 rounded-full border border-gold/40 bg-cream text-charcoal text-sm font-inter leading-snug hover:border-gold hover:bg-gold-light transition-colors cursor-pointer"
          >
            {text}
          </button>
        ))}
      </div>
      <p className="text-xs text-warm-gray/60 mt-2">
        Or type your own response below
      </p>
    </div>
  );
}
