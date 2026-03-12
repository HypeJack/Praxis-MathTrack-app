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
