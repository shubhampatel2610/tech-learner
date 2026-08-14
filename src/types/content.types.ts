/**
 * Content domain model.
 *
 * Every learning topic in the app is a strongly-typed `Topic` object that lives
 * in a dedicated data file (e.g. `data/topics/complexity.ts`). Adding a new
 * topic means adding one data object that satisfies this contract - no UI code
 * changes are required. This is the Open/Closed principle applied to content.
 */

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ComplexityClass =
  | 'O(1)'
  | 'O(log n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n log k)'
  | 'O(n²)'
  | 'O(n³)'
  | 'O(n·W)'
  | 'O(n·m)'
  | 'O(amount)'
  | 'O(amount · k)'
  | 'O(2ⁿ)'
  | 'O(n!)'
  | 'O(n + k)'
  | 'O(n + m)'
  | 'O(nk)'
  | 'O(k)'
  | 'O(h)'
  | 'O(V)'
  | 'O(V²)'
  | 'O(V + E)'
  | 'O(V · E)'
  | 'O(E log E)'
  | 'O(E log V)'
  | 'O((V+E) log V)';

/** A single Big-O row rendered in complexity tables. */
export interface ComplexityRow {
  operation: string;
  best: ComplexityClass;
  average: ComplexityClass;
  worst: ComplexityClass;
  space: ComplexityClass;
  note?: string;
}

/** One step in a dry-run trace. Rendered as an animated stepper. */
export interface DryRunStep {
  label: string;
  detail: string;
  /** Optional snapshot of a data structure's state at this step. */
  state?: (string | number)[];
  /** Indices to highlight in the state snapshot. */
  highlight?: number[];
}

export interface DryRun {
  title: string;
  input: string;
  steps: DryRunStep[];
  result: string;
}

export interface CodeSample {
  language: 'python' | 'javascript' | 'typescript' | 'java' | 'cpp';
  label: string;
  code: string;
}

export interface WorkedExample {
  level: Difficulty;
  title: string;
  problem: string;
  approach: string;
  code: CodeSample[];
  complexity: string;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  hints: string[];
  pattern: string;
  url?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Which interactive visualizer a section should render, if any. */
export type VisualizerKind =
  | 'bigO-chart'
  | 'array-ops'
  | 'ds-map'
  | 'algo-map'
  | 'pattern-map'
  | 'linked-list-ops'
  | 'stack-queue-ops'
  | 'tree-ops'
  | 'graph-map'
  | 'heap-ops'
  | 'hash-table-ops'
  | 'dp-table-ops'
  | 'formula-ops'
  | 'bit-ops'
  | 'none';

/** A rich, structured learning section within a topic. */
export interface TopicSection {
  id: string;
  heading: string;
  /** Markdown body. Supports GFM. */
  body: string;
  visualizer?: VisualizerKind;
}

export interface Topic {
  slug: string;
  /** Cheatsheet ordering (1..15). */
  order: number;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  /** primeicons class, e.g. "pi pi-chart-line". */
  icon: string;
  /** Estimated reading + practice time in minutes. */
  estMinutes: number;
  tags: string[];

  overview: string;
  whyItExists: string;

  sections: TopicSection[];
  complexity?: ComplexityRow[];
  dryRuns?: DryRun[];
  examples?: WorkedExample[];

  advantages: string[];
  disadvantages: string[];
  commonMistakes: string[];
  edgeCases: string[];
  interviewTips: string[];
  realWorldUseCases: string[];
  relatedSlugs: string[];

  flashcards: FlashCard[];
  practice: PracticeProblem[];
  faqs: FaqItem[];
  references: { label: string; url: string }[];
}

/** Lightweight index entry for nav / cards, derived from a Topic. */
export interface TopicMeta {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  icon: string;
  estMinutes: number;
  tags: string[];
}
