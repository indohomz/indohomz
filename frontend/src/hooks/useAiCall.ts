import { useState, useRef, useCallback } from 'react';

interface UseAiCallOptions<T> {
  /** Async function returning full payload */
  action: () => Promise<T>;
  /** Optional function that extracts a text field for streaming simulation */
  extractText?: (payload: T) => string;
  /** Milliseconds between simulated stream chunks */
  intervalMs?: number;
  /** Disable streaming simulation even if extractText is provided */
  disableStream?: boolean;
}

interface UseAiCallResult<T> {
  loading: boolean;
  error: any;
  data: T | null;
  partial: string; // progressively built string when streaming
  call: () => void;
  cancel: () => void;
  reset: () => void;
}

/**
 * useAiCall
 * Generic hook to wrap AI/report/QnA style calls providing loading, error, cancel, and optional simulated streaming.
 * If backend later supports true streaming, replace the simulation path with a fetch reader while keeping the same interface.
 */
export function useAiCall<T>(opts: UseAiCallOptions<T>): UseAiCallResult<T> {
  const { action, extractText, intervalMs = 35, disableStream } = opts;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const [partial, setPartial] = useState('');
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const timerRef = useRef<number | undefined>(undefined);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setPartial('');
    abortRef.current.aborted = false;
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const cancel = useCallback(() => {
    abortRef.current.aborted = true;
    setLoading(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const simulateStream = useCallback((full: string) => {
    const chars = full.split('');
    let idx = 0;
    const push = () => {
      if (abortRef.current.aborted) return;
      if (idx >= chars.length) return;
      setPartial(p => p + chars[idx]);
      idx += 1;
      timerRef.current = window.setTimeout(push, intervalMs);
    };
    push();
  }, [intervalMs]);

  const call = useCallback(async () => {
    reset();
    setLoading(true);
    try {
      const result = await action();
      if (abortRef.current.aborted) return; // cancelled mid-flight
      setData(result);
      const text = extractText ? extractText(result) : '';
      if (extractText && text && !disableStream) {
        simulateStream(text);
      } else {
        setPartial(text);
      }
    } catch (err: any) {
      if (!abortRef.current.aborted) setError(err);
    } finally {
      if (!abortRef.current.aborted) setLoading(false);
    }
  }, [action, extractText, disableStream, reset, simulateStream]);

  return { loading, error, data, partial, call, cancel, reset };
}

export default useAiCall;
