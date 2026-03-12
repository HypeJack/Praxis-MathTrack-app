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
    <div className="flex items-center justify-center p-4">
      <svg
        viewBox="0 0 300 260"
        width={size}
        height={size * (260 / 300)}
        aria-label={`Triad triangle. Your position: Computation ${Math.round(position.computation * 100)}%, Literacy ${Math.round(position.literacy * 100)}%, Confidence ${Math.round(position.confidence * 100)}%.`}
        role="img"
        className="overflow-visible"
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
    </div>
  );
}
