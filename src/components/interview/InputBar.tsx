"use client";

import { useRef, useEffect, type KeyboardEvent } from "react";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export default function InputBar({
  input,
  isLoading,
  onInputChange,
  onSend,
}: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  }, [input]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  }

  return (
    <div className="border-t border-stone/30 bg-ivory/90 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto flex items-end gap-3 px-4 md:px-6 py-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thoughts..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-stone/50 bg-white px-4 py-3 text-[15px] text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className="shrink-0 h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center hover:bg-gold-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Send message"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
