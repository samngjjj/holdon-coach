// ============================================================
// HoldOn Coach — Timer Hook
// ============================================================

'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  onTick: () => void;
  onComplete?: () => void;
  isRunning: boolean;
  intervalMs?: number;
}

export function useTimer({ onTick, onComplete, isRunning, intervalMs = 1000 }: UseTimerOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTickRef.current();
      }, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, intervalMs]);
}
