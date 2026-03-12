'use client';

import { ScoreResponse } from '@/app/api/score/route';
import { MathFeedback } from './MathFeedback';

const SCORE_CONFIG = {
  exemplary:  { color: 'border-[#66AD83] bg-[#D4EDE0]', label: 'Strong explanation!',  icon: '✓' },
  developing: { color: 'border-[#FB8B24] bg-[#FEE8CE]', label: 'Getting there!',        icon: '◑' },
  beginning:  { color: 'border-[#E36414] bg-orange-50',  label: 'Let\'s work on this.', icon: '○' },
  no_credit:  { color: 'border-[#E36414] bg-red-50',     label: 'Let\'s revisit this.',  icon: '×' },
};

interface ScorerFeedbackProps {
  result: ScoreResponse;
  onContinue: () => void;
  onRetry?: () => void;
  canRetry?: boolean;
}

export function ScorerFeedback({ result, onContinue, onRetry, canRetry }: ScorerFeedbackProps) {
  const config = SCORE_CONFIG[result.label];

  return (
    <div className={`rounded-2xl border-2 p-5 ${config.color}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold">{config.icon}</span>
        <span className="font-semibold text-[#0A2E23]">{config.label}</span>
        <span className="ml-auto text-sm text-gray-500">{result.score}/3</span>
      </div>

      {/* AI Feedback */}
      <p className="text-sm text-[#0A2E23] mb-4">
        <MathFeedback text={result.feedback} />
      </p>

      {/* Model Answer — always shown */}
      {result.modelAnswer && (
        <div className="bg-white rounded-xl p-4 mb-4 border border-[#66AD83]">
          <p className="text-xs font-semibold text-[#66AD83] mb-1 uppercase tracking-wide">
            One strong response:
          </p>
          <p className="text-sm text-[#0A2E23] italic">
            <MathFeedback text={result.modelAnswer} />
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onContinue}
          className="flex-1 bg-[#0E5546] text-white rounded-xl py-3 text-sm font-semibold"
        >
          Continue →
        </button>
        {canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-4 text-[#0E5546] text-sm font-semibold"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
