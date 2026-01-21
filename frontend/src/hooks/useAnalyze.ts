import { useState } from 'react';
import type { AnalyzeResponse } from '../types/api';
import { analyzePhoto } from '../lib/api';

interface UseAnalyzeReturn {
  result: AnalyzeResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (photo: File, vibe?: string, language?: string, hints?: string) => Promise<void>;
  regenerate: (photo: File, vibe?: string, language?: string, hints?: string) => Promise<void>;
  reset: () => void;
}

export function useAnalyze(): UseAnalyzeReturn {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (photo: File, vibe?: string, language?: string, hints?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzePhoto(photo, vibe, language, hints);
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze photo');
    } finally {
      setIsLoading(false);
    }
  };

  const regenerate = async (photo: File, vibe?: string, language?: string, hints?: string) => {
    setIsLoading(true);
    setError(null);
    // DON'T clear result - keep showing old quote while regenerating

    try {
      const response = await analyzePhoto(photo, vibe, language, hints);
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze photo');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, analyze, regenerate, reset };
}
