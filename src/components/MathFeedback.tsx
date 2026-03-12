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
