"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

function getSpeechRecognitionConstructor():
  | (new () => SpeechRecognitionInstance)
  | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

/** Fatal errors that should permanently stop recognition */
const FATAL_ERRORS = new Set(["not-allowed", "service-not-available"]);

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef("");
  /** Tracks whether the user intends to be listening (survives browser onend events) */
  const wantsListeningRef = useRef(false);
  /** Ref to latest onTranscript to avoid stale closures in recognition handlers */
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    setIsSupported(getSpeechRecognitionConstructor() !== null);
  }, []);

  const startRecognition = useCallback(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) return;

    // Clean up any previous instance
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    finalTranscriptRef.current = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      try {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        finalTranscriptRef.current = finalText;
        const combined = finalText + interimText;
        console.log("[Voice] onresult:", JSON.stringify(combined).slice(0, 120));
        onTranscriptRef.current(combined);
      } catch (err) {
        console.error("[Voice] onresult handler error:", err);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log("[Voice] onerror:", event.error);

      if (FATAL_ERRORS.has(event.error)) {
        // Truly unrecoverable — stop for real
        console.log("[Voice] Fatal error, stopping recognition");
        wantsListeningRef.current = false;
        setIsListening(false);
        return;
      }

      // Non-fatal errors ("no-speech", "aborted", "network") — let onend handle restart
      // Don't touch isListening or wantsListeningRef here
    };

    recognition.onend = () => {
      console.log("[Voice] onend fired, wantsListening:", wantsListeningRef.current);

      if (wantsListeningRef.current) {
        // Browser stopped on its own (silence timeout, transient error) — restart
        console.log("[Voice] Restarting recognition (user still wants to listen)");
        try {
          recognition.start();
        } catch {
          // If restart fails, try creating a fresh instance after a short delay
          console.log("[Voice] Restart failed, retrying with fresh instance");
          setTimeout(() => {
            if (wantsListeningRef.current) {
              startRecognition();
            }
          }, 100);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      console.log("[Voice] Recognition started");
      setIsListening(true);
    } catch (err) {
      console.error("[Voice] Failed to start recognition:", err);
      wantsListeningRef.current = false;
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    console.log("[Voice] stop() called");
    wantsListeningRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    console.log("[Voice] start() called");
    wantsListeningRef.current = true;
    startRecognition();
  }, [startRecognition]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wantsListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, isSupported, toggle, stop };
}
