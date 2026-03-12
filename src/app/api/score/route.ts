import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ScoreRequest, ScoreResponse } from '@/types/score';

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic({ apiKey }) : null;

const SCORE_LABELS: Record<number, ScoreResponse['label']> = {
  0: 'no_credit',
  1: 'beginning',
  2: 'developing',
  3: 'exemplary',
};

const DOMAIN_NAMES: Record<ScoreRequest['domain'], string> = {
  ia:  'Number & Quantity',
  ib:  'Algebra',
  ii:  'Functions & Calculus',
  iii: 'Geometry',
  iv:  'Statistics & Probability',
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

    if (!client) {
      console.warn('[MathTrack Scorer] Anthropic API Key missing. Returning fallback.');
      return NextResponse.json(buildFallback(1, 'Scoring unavailable (API Key missing). Your response has been saved.'), { status: 200 });
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Using the latest available stable model name if not exactly what's in spec
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
  }
}

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
