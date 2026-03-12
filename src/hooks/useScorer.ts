'use client';

import { useState } from 'react';
import type { ScoreRequest, ScoreResponse } from '@/app/api/score/route';

type ScorerStatus = 'idle' | 'scoring' | 'complete' | 'error';

export function useScorer() {
  const [status, setStatus] = useState<ScorerStatus>('idle');
  const [result, setResult] = useState<ScoreResponse | null>(null);

  const score = async (request: ScoreRequest): Promise<ScoreResponse> => {
    setStatus('scoring');
    setResult(null);

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) throw new Error(`Scorer returned ${res.status}`);

      const data: ScoreResponse = await res.json();
      setResult(data);
      setStatus('complete');
      return data;
    } catch (err) {
      console.error('[useScorer]', err);
      // Graceful degradation — never block the user's progress
      const fallback: ScoreResponse = {
        score: 1,
        label: 'beginning',
        feedback: 'Your response was saved. Detailed feedback will be available shortly.',
        modelAnswer: '',
        rawScore: 1,
      };
      setResult(fallback);
      setStatus('error');
      return fallback;
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
  };

  return { score, status, result, reset };
}
