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
