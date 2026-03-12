import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { computeTriadPosition, assignPersona, computePathPriority } from '@/lib/triad';

// --- Type Definitions ---

export type DomainKey = 'ia' | 'ib' | 'ii' | 'iii' | 'iv';

export interface DomainScore {
  computation: number;        // 0–3
  receptiveLiteracy: number;  // 0–3
  expressiveLiteracy: number; // 0–3
  confidence: number;         // 1–5
  computationRaw?: string;    // user's raw text answer (for display/review)
  receptiveRaw?: string;      // user's free-text response
  expressiveRaw?: string;     // user's free-text response
}

export type PersonaKey =
  | 'stealth_scholar'
  | 'math_narrator'
  | 'bold_builder'
  | 'foundation_finder';

export interface TriadPosition {
  x: number;           // SVG coordinate, 0–1 normalized
  y: number;           // SVG coordinate, 0–1 normalized
  computation: number; // 0.0–1.0 aggregate normalized
  literacy: number;    // 0.0–1.0 aggregate normalized (avg of receptive + expressive)
  confidence: number;  // 0.0–1.0 aggregate normalized
}

export interface DiagnosticState {
  // Progress tracking
  isComplete: boolean;
  currentDomain: DomainKey | null;
  currentStep: 'intro' | 'computation' | 'receptive' | 'expressive' | 'confidence' | 'transition';

  // Per-domain scores
  scores: Partial<Record<DomainKey, DomainScore>>;

  // Computed outputs (populated after diagnostic completes)
  triadPosition: TriadPosition | null;
  persona: PersonaKey | null;
  pathPriority: DomainKey[];  // ordered list, most urgent first

  // Actions
  setDomainScore: (domain: DomainKey, score: Partial<DomainScore>) => void;
  setCurrentStep: (domain: DomainKey, step: DiagnosticState['currentStep']) => void;
  completeDiagnostic: () => void;
  resetDiagnostic: () => void;  // CRITICAL: full reset for retake flow
}

// --- Initial State ---

const INITIAL_STATE: Omit<DiagnosticState, 'setDomainScore' | 'setCurrentStep' | 'completeDiagnostic' | 'resetDiagnostic'> = {
  isComplete: false,
  currentDomain: null,
  currentStep: 'intro',
  scores: {},
  triadPosition: null,
  persona: null,
  pathPriority: [],
};

// --- Store ---

export const useDiagnosticStore = create<DiagnosticState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setDomainScore: (domain, score) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [domain]: { ...state.scores[domain], ...score },
          },
        })),

      setCurrentStep: (domain, step) =>
        set({ currentDomain: domain, currentStep: step }),

      completeDiagnostic: () => {
        const { scores } = get();
        const position = computeTriadPosition(scores);
        const persona = assignPersona(position);
        const pathPriority = computePathPriority(scores, position);
        set({
          isComplete: true,
          triadPosition: position,
          persona,
          pathPriority,
        });
      },

      // Full reset — must clear all computed and raw data
      resetDiagnostic: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'mathtrack-diagnostic',  // localStorage key
      // Only persist scores and completion state — recompute derived values on hydration
      partialize: (state) => ({
        isComplete: state.isComplete,
        scores: state.scores,
        triadPosition: state.triadPosition,
        persona: state.persona,
        pathPriority: state.pathPriority,
      }),
    }
  )
);
