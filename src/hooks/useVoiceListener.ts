// ============================================================
// HoldOn Coach — Voice Hook (Web Speech API)
// ============================================================

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseVoiceListenerOptions {
  onTranscript: (text: string) => void;
  continuous?: boolean;
  lang?: string;
}

export function useVoiceListener({ onTranscript, continuous = true, lang = 'zh-TW' }: UseVoiceListenerOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SR);
  }, []);

  // Keep ref in sync
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        onTranscript(last[0].transcript);
      }
    };

    recognition.onend = () => {
      if (continuous && isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // already started or error
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [continuous, lang, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

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
      recognitionRef.current?.stop();
    };
  }, []);

  return { isListening, isSupported, start, stop, toggle };
}
