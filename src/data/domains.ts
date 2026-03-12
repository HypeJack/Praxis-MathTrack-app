import { DomainKey } from "@/store/diagnosticStore";

export interface DomainMetadata {
  key: DomainKey;
  name: string;
  description: string;
  weight: string;
  masteryTarget: string;
  color: string;
}

export const DOMAIN_METADATA: Record<DomainKey, DomainMetadata> = {
  ia: {
    key: 'ia',
    name: 'Number & Quantity',
    description: 'Real numbers, complex operations, and matrix reasoning.',
    weight: '10%',
    masteryTarget: '85%',
    color: '#66AD83', // accent-green
  },
  ib: {
    key: 'ib',
    name: 'Algebra',
    description: 'Equations, inequalities, and structural manipulations.',
    weight: '20%',
    masteryTarget: '80%',
    color: '#FB8B24', // accent-gold
  },
  ii: {
    key: 'ii',
    name: 'Functions & Calculus',
    description: 'Limits, derivatives, integrals, and functional behavior.',
    weight: '30%',
    masteryTarget: '75%',
    color: '#0E5546', // pine-green
  },
  iii: {
    key: 'iii',
    name: 'Geometry',
    description: 'Proofs, transformations, and coordinate geometry.',
    weight: '20%',
    masteryTarget: '80%',
    color: '#8B4513', // saddle-brown/earthy
  },
  iv: {
    key: 'iv',
    name: 'Stats & Probability',
    description: 'Data distributions, probability, and statistical inference.',
    weight: '20%',
    masteryTarget: '85%',
    color: '#E07A5F', // terra-cotta
  },
};
