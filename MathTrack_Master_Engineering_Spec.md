# MathTrack — Master Engineering Specification
## Advanced Systems Build: Triad Triangle + AI Scoring Pipeline
**Version 1.0 | Prepared for Antigravity Agent**
**Authors: Claude (Anthropic) + Gemini (Google) | Reviewed by: MathTrack Design Lead**

---

## Document Purpose

This document provides complete, implementation-ready specifications for the two advanced systems that form the emotional and technical core of MathTrack. These systems must be built before any further feature development, as all downstream personalization logic depends on them.

**System 1: The Triad Triangle Engine** — Diagnostic state management, score normalization, barycentric coordinate placement, and persona assignment.

**System 2: The AI Scoring Pipeline** — API route architecture, LLM prompt scaffolding, async response handling, KaTeX rendering, and fallback states.

Read this document in full before writing any code. Every section contains constraints that affect adjacent systems.

---

---

# SYSTEM 1: THE TRIAD TRIANGLE ENGINE

---

## 1.1 Overview

The Triad Triangle is the centerpiece of the MathTrack UX. It takes a teacher's raw diagnostic scores across three dimensions — Computation, Receptive Literacy, and Expressive Literacy — and produces two outputs:

1. A normalized coordinate `(x, y)` for placing the teacher's dot inside an SVG equilateral triangle
2. A **Persona** assignment (one of four archetypes) that drives personalized copy, path weighting, and learning strategy

A fourth dimension — **Confidence** — is captured as a self-reported score and overlaid as a modifier, but is NOT part of the barycentric calculation. See Section 1.4.

---

## 1.2 Zustand Diagnostic Store

Install: `npm install zustand`

Create: `src/store/diagnosticStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
```

---

## 1.3 Score Normalization & Barycentric Algorithm

### Step 1 — Aggregate Raw Domain Scores

Each domain produces scores on:
- Computation: 0–3 pts
- Receptive Literacy: 0–3 pts
- Expressive Literacy: 0–3 pts
- Confidence: 1–5 (self-reported, used separately)

With 5 domains (IA, IB, II, III, IV), the maximum aggregate is 15 pts per dimension.

```typescript
// src/lib/triad.ts

import { DomainKey, DomainScore, TriadPosition, PersonaKey } from '@/store/diagnosticStore';

const DOMAINS: DomainKey[] = ['ia', 'ib', 'ii', 'iii', 'iv'];
const MAX_SCORE_PER_DOMAIN = 3;
const MAX_TOTAL = MAX_SCORE_PER_DOMAIN * DOMAINS.length; // 15

export function computeTriadPosition(
  scores: Partial<Record<DomainKey, DomainScore>>
): TriadPosition {
  let totalComputation = 0;
  let totalReceptive = 0;
  let totalExpressive = 0;
  let totalConfidence = 0;
  let domainCount = 0;

  for (const domain of DOMAINS) {
    const d = scores[domain];
    if (!d) continue;
    totalComputation += d.computation ?? 0;
    totalReceptive += d.receptiveLiteracy ?? 0;
    totalExpressive += d.expressiveLiteracy ?? 0;
    totalConfidence += d.confidence ?? 3; // default mid if missing
    domainCount++;
  }

  // Guard: avoid divide-by-zero if no domains scored
  if (domainCount === 0) {
    return { x: 0.5, y: 0.5, computation: 0, literacy: 0, confidence: 0 };
  }

  // Normalize each dimension to 0.0–1.0
  const normComputation = totalComputation / MAX_TOTAL;       // 0.0–1.0
  const normReceptive   = totalReceptive   / MAX_TOTAL;       // 0.0–1.0
  const normExpressive  = totalExpressive  / MAX_TOTAL;       // 0.0–1.0
  const normLiteracy    = (normReceptive + normExpressive) / 2; // avg of two sub-dims

  // Confidence: raw 1–5 per domain, max total = 5 * domainCount
  const maxConfidence = 5 * domainCount;
  const normConfidence = totalConfidence / maxConfidence;     // 0.0–1.0

  // --- BARYCENTRIC COORDINATE CALCULATION ---
  //
  // The three barycentric weights are: Computation (C), Literacy (L), Confidence (K)
  // They MUST sum to 1.0. We normalize them against their own sum.
  //
  // Triangle vertex positions in SVG space (equilateral, 300x260 viewBox):
  //   Computation  vertex: (150, 10)   — TOP
  //   Literacy     vertex: (10, 250)   — BOTTOM LEFT
  //   Confidence   vertex: (290, 250)  — BOTTOM RIGHT

  const rawSum = normComputation + normLiteracy + normConfidence;

  // If all scores are zero (edge case), place dot at centroid
  if (rawSum === 0) {
    return {
      x: 150, y: 170,
      computation: 0, literacy: 0, confidence: 0,
    };
  }

  // Normalize so weights sum to 1.0 (Gemini constraint — critical)
  const wC = normComputation / rawSum;  // weight for Computation vertex
  const wL = normLiteracy    / rawSum;  // weight for Literacy vertex
  const wK = normConfidence  / rawSum;  // weight for Confidence vertex

  // Vertex coordinates in SVG viewBox (300 x 260)
  const vC = { x: 150, y: 10  };  // Computation — top
  const vL = { x: 10,  y: 250 };  // Literacy    — bottom-left
  const vK = { x: 290, y: 250 };  // Confidence  — bottom-right

  // Barycentric → Cartesian
  const svgX = wC * vC.x + wL * vL.x + wK * vK.x;
  const svgY = wC * vC.y + wL * vL.y + wK * vK.y;

  return {
    x: svgX,
    y: svgY,
    computation: normComputation,
    literacy: normLiteracy,
    confidence: normConfidence,
  };
}
```

**Important:** The SVG triangle component must use a `viewBox="0 0 300 260"` and the vertex positions in the component must EXACTLY match `vC`, `vL`, `vK` defined above. These are the single source of truth. Do not hardcode different values in the SVG.

---

## 1.4 Confidence as a Modifier (Not a Vertex Weight)

Confidence is self-reported and prone to anchoring bias. It enters the barycentric calculation as a third weight only to pull the dot *slightly* toward the right vertex when a teacher rates themselves highly — this creates the visual effect of the "Overconfident" profiles described in the design.

However, for the **Persona assignment** (Section 1.5), confidence is read as a raw modifier, not a barycentric weight. This distinction is intentional.

---

## 1.5 Persona Assignment

Persona is assigned after `computeTriadPosition()` runs. It uses the normalized `computation` and `literacy` scores from `TriadPosition`. Confidence acts as a tiebreaker.

```typescript
// Append to src/lib/triad.ts

// Threshold: scores above this value are considered "High"
const HIGH_THRESHOLD = 0.55;
const LOW_THRESHOLD  = 0.45;

export function assignPersona(position: TriadPosition): PersonaKey {
  const highComp = position.computation >= HIGH_THRESHOLD;
  const highLit  = position.literacy    >= HIGH_THRESHOLD;
  const highConf = position.confidence  >= HIGH_THRESHOLD;

  // Primary 2x2 matrix (Gemini's logic — implemented exactly)
  if (highComp && !highLit)  return 'stealth_scholar';   // 🦉 High Comp, Low Lit
  if (!highComp && highLit)  return 'math_narrator';     // 🎤 Low Comp, High Lit
  if (highComp && highLit)   return 'bold_builder';      // 🏗️ High Comp, High Lit
  // Default: Low Comp + Low Lit
  // Use confidence as tiebreaker: overconfident Foundation Finders need special handling
  if (highConf) {
    // High confidence despite low scores — route to Bold Builder pathway
    // (confrontational calibration per design spec)
    return 'bold_builder';
  }
  return 'foundation_finder';                            // 🔍 Low Comp, Low Lit
}
```

### Persona Metadata

Create: `src/data/personas.ts`

```typescript
export const PERSONA_DATA = {
  stealth_scholar: {
    key: 'stealth_scholar',
    name: 'The Stealth Scholar',
    icon: '🦉',
    tagline: 'You think like a mathematician. Now let\'s find the words to match.',
    strength: 'Strong computational fluency across most domains.',
    focusArea: 'Building mathematical literacy — especially the language of explaining concepts to students.',
    strategy: 'Timed "Power Sets" to trust your speed and silence the inner critic.',
    pathWeighting: { computation: 0.2, receptive: 0.4, expressive: 0.4 },
  },
  math_narrator: {
    key: 'math_narrator',
    name: 'The Math Narrator',
    icon: '🎤',
    tagline: 'You have the language. Let\'s sharpen the arithmetic to match.',
    strength: 'Exceptional conceptual vocabulary and student-facing communication.',
    focusArea: 'Procedural fluency — turning conceptual understanding into accurate computation.',
    strategy: '"Fluency Drills" to turn your conceptual talk into accurate walk.',
    pathWeighting: { computation: 0.6, receptive: 0.2, expressive: 0.2 },
  },
  bold_builder: {
    key: 'bold_builder',
    name: 'The Bold Builder',
    icon: '🏗️',
    tagline: 'You\'ve built something real. Let\'s make sure the foundation holds.',
    strength: 'High confidence and strong overall profile across both computation and literacy.',
    focusArea: 'Precision and edge cases — the questions designed to catch overconfidence.',
    strategy: '"Reality Check" problems that surface the gaps hiding behind strong overall scores.',
    pathWeighting: { computation: 0.33, receptive: 0.33, expressive: 0.34 },
  },
  foundation_finder: {
    key: 'foundation_finder',
    name: 'The Foundation Finder',
    icon: '🔍',
    tagline: 'Every expert started here. Let\'s build your floor before your ceiling.',
    strength: 'You\'re in the right place at the right time — with the whole path ahead of you.',
    focusArea: 'Foundational content in all domains, sequenced from the ground up.',
    strategy: '"Back-to-Basics" modules that build a sturdy foundation before advancing.',
    pathWeighting: { computation: 0.4, receptive: 0.3, expressive: 0.3 },
  },
} as const;

export type PersonaData = typeof PERSONA_DATA[keyof typeof PERSONA_DATA];
```

---

## 1.6 Path Priority Algorithm

After persona assignment, compute the ordered learning path.

```typescript
// Append to src/lib/triad.ts

export function computePathPriority(
  scores: Partial<Record<DomainKey, DomainScore>>,
  position: TriadPosition
): DomainKey[] {
  // Domain weight on Praxis 5165 (from design spec)
  const DOMAIN_WEIGHTS: Record<DomainKey, number> = {
    ii:  0.30,  // Functions & Calculus — 30%
    ib:  0.20,  // Algebra — 20%
    iii: 0.20,  // Geometry — 20%
    iv:  0.20,  // Statistics & Probability — 20%
    ia:  0.10,  // Number & Quantity — 10%
  };

  // Score each domain by deficit severity × Praxis weight
  const domainDeficits = DOMAINS.map((domain) => {
    const d = scores[domain];
    if (!d) return { domain, urgency: DOMAIN_WEIGHTS[domain] * 1.0 }; // unscored = maximum urgency

    const maxPossible = MAX_SCORE_PER_DOMAIN * 3; // comp + receptive + expressive
    const actual = (d.computation ?? 0) + (d.receptiveLiteracy ?? 0) + (d.expressiveLiteracy ?? 0);
    const deficit = 1 - (actual / maxPossible);
    const urgency = deficit * DOMAIN_WEIGHTS[domain];
    return { domain, urgency };
  });

  // Sort highest urgency first
  domainDeficits.sort((a, b) => b.urgency - a.urgency);
  return domainDeficits.map((d) => d.domain);
}
```

---

## 1.7 Triad Triangle SVG Component

Create: `src/components/TriadTriangle.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { TriadPosition } from '@/store/diagnosticStore';

interface TriadTriangleProps {
  position: TriadPosition;
  size?: number;          // controls rendered size; viewBox is always 300x260
  showLabels?: boolean;
  animated?: boolean;     // false for dashboard mini-version
}

// These MUST match the vertex coordinates in src/lib/triad.ts
const VERTICES = {
  computation: { x: 150, y: 10,  label: 'Computation',  labelOffset: { x: 0, y: -14 } },
  literacy:    { x: 10,  y: 250, label: 'Literacy',     labelOffset: { x: -10, y: 16 } },
  confidence:  { x: 290, y: 250, label: 'Confidence',   labelOffset: { x: 10, y: 16 } },
};

const TRIANGLE_PATH = `M ${VERTICES.computation.x} ${VERTICES.computation.y} L ${VERTICES.literacy.x} ${VERTICES.literacy.y} L ${VERTICES.confidence.x} ${VERTICES.confidence.y} Z`;

export function TriadTriangle({
  position,
  size = 300,
  showLabels = true,
  animated = true,
}: TriadTriangleProps) {
  return (
    <svg
      viewBox="0 0 300 260"
      width={size}
      height={size * (260 / 300)}
      aria-label={`Triad triangle. Your position: Computation ${Math.round(position.computation * 100)}%, Literacy ${Math.round(position.literacy * 100)}%, Confidence ${Math.round(position.confidence * 100)}%.`}
      role="img"
    >
      {/* Triangle outline */}
      <path
        d={TRIANGLE_PATH}
        fill="none"
        stroke="#0E5546"
        strokeWidth={2}
      />

      {/* Vertex labels */}
      {showLabels && Object.values(VERTICES).map((v) => (
        <text
          key={v.label}
          x={v.x + v.labelOffset.x}
          y={v.y + v.labelOffset.y}
          textAnchor="middle"
          fontSize={11}
          fontFamily="Inter, sans-serif"
          fontWeight={600}
          fill="#0E5546"
        >
          {v.label}
        </text>
      ))}

      {/* Vertex score percentage labels */}
      {showLabels && (
        <>
          <text x={150} y={28} textAnchor="middle" fontSize={10} fill="#66AD83" fontFamily="Inter, sans-serif">
            {Math.round(position.computation * 100)}%
          </text>
          <text x={28} y={242} textAnchor="middle" fontSize={10} fill="#66AD83" fontFamily="Inter, sans-serif">
            {Math.round(position.literacy * 100)}%
          </text>
          <text x={272} y={242} textAnchor="middle" fontSize={10} fill="#66AD83" fontFamily="Inter, sans-serif">
            {Math.round(position.confidence * 100)}%
          </text>
        </>
      )}

      {/* Teacher position dot */}
      {animated ? (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={8}
          fill="#FB8B24"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.2 }}
          style={{ filter: 'drop-shadow(0 0 6px #FB8B24)' }}
        />
      ) : (
        <circle cx={position.x} cy={position.y} r={6} fill="#FB8B24" />
      )}
    </svg>
  );
}
```

Install framer-motion if not present: `npm install framer-motion`

---

---

# SYSTEM 2: THE AI SCORING PIPELINE

---

## 2.1 Overview

The AI Scoring Pipeline evaluates free-text teacher responses on Expressive and Receptive Literacy tasks. It returns a score of 0–3 with a label, feedback string, and a model answer.

**Architecture decisions:**
- Runs as a Next.js API Route (`src/app/api/score/route.ts`)
- Uses Claude claude-sonnet-4-20250514 (not Gemini — keep AI evaluation separate from the co-engineering session to avoid circular feedback)
- Scores are returned async and cached in the Zustand store — users see a brief "analyzing..." state, not a spinner
- KaTeX is used for all math rendering in feedback strings (`react-katex`)
- On any failure, a deterministic fallback score is applied (see Section 2.5)

---

## 2.2 Install Dependencies

```bash
npm install react-katex
npm install katex
npm install @types/katex --save-dev
```

Add to `src/app/globals.css` or layout:
```css
@import 'katex/dist/katex.min.css';
```

---

## 2.3 API Route

Create: `src/app/api/score/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

export interface ScoreRequest {
  taskType: 'receptive' | 'expressive';
  domain: 'ia' | 'ib' | 'ii' | 'iii' | 'iv';
  prompt: string;       // The question shown to the teacher
  response: string;     // The teacher's free-text answer
}

export interface ScoreResponse {
  score: 0 | 1 | 2 | 3;
  label: 'no_credit' | 'beginning' | 'developing' | 'exemplary';
  feedback: string;     // 1–2 sentences. May contain KaTeX-formatted math.
  modelAnswer: string;  // Exemplar response. Shown post-submission.
  rawScore: number;     // Same as score, typed as number for arithmetic
}

const SCORE_LABELS: Record<number, ScoreResponse['label']> = {
  0: 'no_credit',
  1: 'beginning',
  2: 'developing',
  3: 'exemplary',
};

export async function POST(req: NextRequest) {
  try {
  const body: ScoreRequest = await req.json();

  if (!body.response || body.response.trim().length < 10) {
    // Too short to score meaningfully — return 0 without calling the API
    return NextResponse.json(buildFallback(0, 'Response too brief to evaluate.'));
  }

  const systemPrompt = buildSystemPrompt(body);
  const userPrompt   = buildUserPrompt(body);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '';
  const parsed = parseScoreResponse(raw);
  return NextResponse.json(parsed);

  } catch (err) {
    console.error('[MathTrack Scorer] Error:', err);
    return NextResponse.json(buildFallback(1, 'Scoring unavailable. Your response has been saved.'), { status: 200 });
    // Return 200 not 500 — the client should never see an error state during a diagnostic
  }
}
```

---

## 2.4 Prompt Engineering

The system prompt is built dynamically per task. The rubric anchor text is embedded directly — this is the calibration source from `MathTrack_Rubric_Anchors.docx`.

```typescript
// Append to src/app/api/score/route.ts

function buildSystemPrompt(body: ScoreRequest): string {
  return `You are an expert mathematics education evaluator for the MathTrack platform, which prepares teachers for the Praxis 5165 Mathematics Content Knowledge exam.

Your job is to score a teacher's free-text response on a ${body.taskType === 'receptive' ? 'Receptive Literacy' : 'Expressive Literacy'} task in the ${DOMAIN_NAMES[body.domain]} domain.

## Scoring Rubric

Score on a 0–3 scale using EXACTLY these criteria:

**SCORE 3 — EXEMPLARY**
- Fully meets all criteria
- Mathematical reasoning is accurate and complete
- Vocabulary is precise and domain-appropriate
- For Expressive tasks: explanation is pedagogically clear and appropriate for secondary students
- Explains WHY, not just WHAT

**SCORE 2 — DEVELOPING**
- Meets most criteria with one meaningful gap
- Typically: correct math but imprecise language, OR correct conclusion without mechanism
- Explains WHAT correctly but not always WHY

**SCORE 1 — BEGINNING**
- Partially correct
- Identifies the surface level of the task but cannot explain, justify, or apply
- For Expressive tasks: the teacher cannot diagnose or adequately address the student's need

**SCORE 0 — NO CREDIT**
- Incorrect, blank, or validates a mathematical error
- For Expressive tasks: the explanation would deepen rather than correct the student's misconception
- A response that is vague or informal but mathematically honest should receive 1, NOT 0

## Critical Scoring Rules
- NEVER assign 0 for informality of language — assess the MATH, not the prose style
- The gap between 3 and 2 is almost always about completeness of conceptual explanation vs. procedural correctness alone
- The gap between 2 and 1 is whether the teacher can move toward a resolution
- For Expressive tasks: look for (a) error correctly identified, (b) underlying misconception named, (c) specific valid instructional strategy offered

## Output Format

You MUST respond with ONLY a valid JSON object. No preamble, no explanation outside the JSON. No markdown code fences.

{
  "score": <0|1|2|3>,
  "label": <"no_credit"|"beginning"|"developing"|"exemplary">,
  "feedback": "<1-2 sentences explaining the score. Reference specific strengths or gaps. Use LaTeX math notation where needed, wrapped in $...$ for inline or $$...$$ for block.>",
  "modelAnswer": "<A concise exemplar response at score-3 level for this specific prompt. 3-5 sentences. Use LaTeX math notation where needed.>"
}`;
}

function buildUserPrompt(body: ScoreRequest): string {
  return `## Task Prompt (what the teacher was asked)
${body.prompt}

## Teacher's Response
${body.response}

Score this response according to the rubric. Return ONLY the JSON object.`;
}

const DOMAIN_NAMES: Record<ScoreRequest['domain'], string> = {
  ia:  'Number & Quantity',
  ib:  'Algebra',
  ii:  'Functions & Calculus',
  iii: 'Geometry',
  iv:  'Statistics & Probability',
};
```

---

## 2.5 Response Parsing & Fallback

```typescript
// Append to src/app/api/score/route.ts

function parseScoreResponse(raw: string): ScoreResponse {
  try {
    // Strip any accidental markdown fences if the model adds them
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Validate score is in range
    const score = Math.min(3, Math.max(0, Number(parsed.score) || 0)) as 0 | 1 | 2 | 3;

    return {
      score,
      label: SCORE_LABELS[score],
      feedback: String(parsed.feedback || 'Response evaluated.'),
      modelAnswer: String(parsed.modelAnswer || ''),
      rawScore: score,
    };
  } catch {
    return buildFallback(1, 'Your response was saved but could not be fully evaluated at this time.');
  }
}

function buildFallback(score: 0 | 1 | 2 | 3, message: string): ScoreResponse {
  return {
    score,
    label: SCORE_LABELS[score],
    feedback: message,
    modelAnswer: '',
    rawScore: score,
  };
}
```

---

## 2.6 Client-Side Hook

Create: `src/hooks/useScorer.ts`

```typescript
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
```

---

## 2.7 KaTeX Math Rendering in Feedback

Use `react-katex` to render any math in the AI's feedback strings. The AI is instructed to wrap math in `$...$` (inline) or `$$...$$` (block).

Create: `src/components/MathFeedback.tsx`

```typescript
import { InlineMath, BlockMath } from 'react-katex';

interface MathFeedbackProps {
  text: string;
  className?: string;
}

/**
 * Renders a string that may contain LaTeX math expressions.
 * Inline math: $...$
 * Block math:  $$...$$
 * 
 * Uses react-katex which handles React's virtual DOM correctly.
 * Do NOT use raw KaTeX — it will conflict with React rendering.
 */
export function MathFeedback({ text, className }: MathFeedbackProps) {
  // Split on block math first, then inline math
  const segments = parseLatexSegments(text);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'block')  return <BlockMath  key={i} math={seg.content} />;
        if (seg.type === 'inline') return <InlineMath key={i} math={seg.content} />;
        return <span key={i}>{seg.content}</span>;
      })}
    </span>
  );
}

type Segment = { type: 'text' | 'inline' | 'block'; content: string };

function parseLatexSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // Match $$...$$ (block) and $...$ (inline), in that order
  const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: 'block', content: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: 'inline', content: match[2] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}
```

---

## 2.8 Feedback Display Component

Create: `src/components/ScorerFeedback.tsx`

```typescript
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
```

---

## 2.9 Environment Configuration

Add to `.env.local` (never commit this file):

```
ANTHROPIC_API_KEY=your_key_here
```

Add to `.env.example` (commit this):

```
ANTHROPIC_API_KEY=
```

The API route runs server-side only — the key is never exposed to the client bundle.

---

---

# INTEGRATION CHECKLIST

Use this list to verify both systems are correctly wired before shipping.

## Triad Triangle
- [ ] `src/store/diagnosticStore.ts` created with Zustand + persist middleware
- [ ] `src/lib/triad.ts` created with `computeTriadPosition`, `assignPersona`, `computePathPriority`
- [ ] `src/data/personas.ts` created with all four persona definitions
- [ ] `src/components/TriadTriangle.tsx` created with SVG vertex coordinates matching `triad.ts` exactly
- [ ] `framer-motion` installed
- [ ] `resetDiagnostic()` action tested — confirm it wipes all state including localStorage entry
- [ ] Triad Reveal screen (Screen 13) wired to `useDiagnosticStore` — reads `triadPosition` and `persona`
- [ ] Dashboard mini-triangle uses `animated={false}` prop
- [ ] Persona copy on Triad Reveal reads from `src/data/personas.ts` (not hardcoded)

## AI Scoring Pipeline
- [ ] `ANTHROPIC_API_KEY` set in `.env.local`
- [ ] `src/app/api/score/route.ts` created
- [ ] `src/hooks/useScorer.ts` created
- [ ] `react-katex` and `katex` installed
- [ ] KaTeX CSS imported in global stylesheet
- [ ] `src/components/MathFeedback.tsx` created
- [ ] `src/components/ScorerFeedback.tsx` created
- [ ] Expressive Literacy task component (Screen 07) calls `useScorer` on submit
- [ ] Receptive Literacy task component (Screen 06) calls `useScorer` on submit
- [ ] Scores returned by scorer are written to Zustand store via `setDomainScore`
- [ ] Fallback behavior tested: disconnect network, submit response, verify user is not blocked
- [ ] `completeDiagnostic()` called after Domain IV confidence rating — verify `triadPosition` and `persona` populate correctly

---

---

# APPENDIX: WIRING THE SCORER TO THE ZUSTAND STORE

This is the critical integration point. After the scorer returns, the score must be committed to the Zustand store so that `completeDiagnostic()` has complete data.

```typescript
// Example: inside the Expressive Literacy page component
// src/app/diagnostic/domain-ia/expressive/page.tsx

'use client';

import { useState } from 'react';
import { useScorer } from '@/hooks/useScorer';
import { useDiagnosticStore } from '@/store/diagnosticStore';
import { ScorerFeedback } from '@/components/ScorerFeedback';

export default function ExpressiveLiteracyIA() {
  const [response, setResponse] = useState('');
  const [hasRetried, setHasRetried] = useState(false);
  const { score, status, result, reset } = useScorer();
  const { setDomainScore, setCurrentStep } = useDiagnosticStore();

  const handleSubmit = async () => {
    const scored = await score({
      taskType: 'expressive',
      domain: 'ia',
      prompt: 'A student tells you: "I think √48 + √75 = √123 because you just add what\'s under the square roots." How would you explain the error?',
      response,
    });

    // Commit to store immediately — do not wait for navigation
    setDomainScore('ia', {
      expressiveLiteracy: scored.score,
      expressiveRaw: response,
    });
  };

  const handleContinue = () => {
    setCurrentStep('ia', 'confidence');
    // navigate to confidence page
  };

  const handleRetry = () => {
    if (!hasRetried) {
      setHasRetried(true);
      setResponse('');
      reset();
    }
  };

  return (
    <div>
      {/* ... task UI ... */}
      {status === 'idle' || status === 'scoring' ? (
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Aim for 3–5 sentences. Write as if speaking to a curious 10th grader."
          disabled={status === 'scoring'}
        />
      ) : null}

      {status === 'scoring' && (
        <p className="text-sm text-center text-gray-500 animate-pulse">Analyzing your response...</p>
      )}

      {(status === 'complete' || status === 'error') && result && (
        <ScorerFeedback
          result={result}
          onContinue={handleContinue}
          onRetry={handleRetry}
          canRetry={!hasRetried}
        />
      )}

      {(status === 'idle' || status === 'scoring') && (
        <button
          onClick={handleSubmit}
          disabled={response.trim().length < 20 || status === 'scoring'}
          className="w-full bg-[#66AD83] text-white rounded-xl py-3 font-semibold disabled:opacity-40"
        >
          {status === 'scoring' ? 'Analyzing...' : 'Submit →'}
        </button>
      )}
    </div>
  );
}
```

---

*MathTrack Master Engineering Specification v1.0*
*For Antigravity Agent — Do not modify without review from MathTrack Design Lead*
