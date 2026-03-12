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
    return { x: 150, y: 170, computation: 0, literacy: 0, confidence: 0 };
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

// Threshold: scores above this value are considered "High"
const HIGH_THRESHOLD = 0.55;

export function assignPersona(position: TriadPosition): PersonaKey {
  const highComp = position.computation >= HIGH_THRESHOLD;
  const highLit  = position.literacy    >= HIGH_THRESHOLD;
  const highConf = position.confidence  >= HIGH_THRESHOLD;

  // Primary 2x2 matrix
  if (highComp && !highLit)  return 'stealth_scholar';   // 🦉 High Comp, Low Lit
  if (!highComp && highLit)  return 'math_narrator';     // 🎤 Low Comp, High Lit
  if (highComp && highLit)   return 'bold_builder';      // 🏗️ High Comp, High Lit
  
  // Default: Low Comp + Low Lit
  // Use confidence as tiebreaker: overconfident Foundation Finders need special handling
  if (highConf) {
    // High confidence despite low scores — route to Bold Builder pathway
    return 'bold_builder';
  }
  return 'foundation_finder';                            // 🔍 Low Comp, Low Lit
}

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
