"use client";

import { useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

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

  const handleTranscript = useCallback(
    (text: string) => {
      onInputChange(text);
    },
    [onInputChange]
  );

  const { isListening, isSupported, toggle } =
    useVoiceInput(handleTranscript);

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
    <div className="border-t border-stone/30 bg-ivory/90 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-2xl mx-auto flex items-end gap-3 px-4 md:px-6 py-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share your thoughts..."
          aria-label="Your response"
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-stone/50 bg-white px-4 py-3 text-[15px] text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
        />
        {isSupported && (
          <button
            type="button"
            onClick={toggle}
            disabled={isLoading}
            className={`relative shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isListening
                ? "bg-terracotta/10 text-terracotta animate-mic-pulse"
                : "bg-transparent text-warm-gray hover:text-gold hover:bg-gold-light"
            }`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="1" width="6" height="14" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
            {isListening && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-terracotta" />
            )}
          </button>
        )}
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
