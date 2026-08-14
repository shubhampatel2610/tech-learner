import type { Topic } from '@/types/content.types';

/**
 * TOPIC 1 - COMPLEXITY
 * Full deep-dive. Mirrors cheatsheet section 1 (Time & Space Complexity, Big-O
 * ladder, "lower is better") and expands it into a complete learning module.
 */
export const complexityTopic: Topic = {
  slug: 'complexity',
  order: 1,
  title: 'Complexity Analysis',
  tagline: 'How to reason about time and space before you ever run the code.',
  difficulty: 'Beginner',
  icon: 'pi pi-chart-line',
  estMinutes: 35,
  tags: ['Big-O', 'Time', 'Space', 'Asymptotics'],

  overview:
    'Complexity analysis is how engineers predict how an algorithm behaves as its input grows - without benchmarking on a specific machine. Instead of asking "how many milliseconds?", we ask "how does the work scale?" That question has a machine-independent answer, and it is the single most useful lens for comparing two solutions to the same problem.',

  whyItExists:
    'Wall-clock timing depends on your CPU, cache, language, and what else is running. It cannot be compared across machines and it lies for small inputs. Complexity analysis strips all of that away and describes the *growth rate* of work as a function of input size n. Two algorithms that both "feel fast" on 100 items can differ by hours on 10 million items - and Big-O is what tells you that in advance.',

  sections: [
    {
      id: 'what-is-asymptotic',
      heading: 'What "asymptotic" actually means',
      body: `Asymptotic analysis studies behavior as \`n → ∞\`. We deliberately ignore:

- **Constant factors** - \`3n\` and \`n\` are both \`O(n)\`. A 3× constant does not change how something *scales*.
- **Lower-order terms** - \`n² + n + 50\` is \`O(n²)\`. For large n, the \`n²\` term dominates everything else.

Why is this fair? Because constants and lower terms are noise compared to growth rate once inputs get large. An \`O(n)\` algorithm will *eventually* and *always* beat an \`O(n²)\` one, no matter how large the constants are, if n is big enough.

The three formal bounds:

- **Big-O ( O )** - upper bound. "grows no faster than". The one we use most.
- **Big-Omega ( Ω )** - lower bound. "grows at least as fast as".
- **Big-Theta ( Θ )** - tight bound. Both O and Ω. "grows exactly like".

In interviews and industry, "the complexity" almost always means the worst-case Big-O.`,
    },
    {
      id: 'the-ladder',
      heading: 'The complexity ladder (from the cheatsheet)',
      body: `From fastest-growing-slowest to catastrophic, the classes every engineer must recognize on sight:

| Class | Name | Feels like |
|---|---|---|
| \`O(1)\` | Constant | array index, hash lookup |
| \`O(log n)\` | Logarithmic | binary search, balanced tree |
| \`O(n)\` | Linear | one pass over the input |
| \`O(n log n)\` | Linearithmic | good sorts (merge, heap) |
| \`O(n²)\` | Quadratic | nested loop over the input |
| \`O(2ⁿ)\` | Exponential | naive subset / recursion |
| \`O(n!)\` | Factorial | brute-force permutations |

**Lower is better.** The whole game of algorithm design is moving *down* this ladder for a given problem - turning an \`O(n²)\` brute force into an \`O(n log n)\` sort-based solution, or an \`O(n)\` hash-based one.`,
      visualizer: 'bigO-chart',
    },
    {
      id: 'reading-code',
      heading: 'Reading complexity off code',
      body: `A few reliable rules let you derive complexity by inspection:

- **Sequential statements add** → \`O(a) + O(b) = O(a + b)\`, then keep the dominant term.
- **Nested loops multiply** → a loop over n inside a loop over n is \`O(n²)\`.
- **Halving each step is logarithmic** → if the problem size divides by a constant each iteration, that's \`O(log n)\`.
- **Divide-and-conquer that splits in half and does O(n) work per level** → \`O(n log n)\` (the merge-sort recurrence).
- **Drop constants and non-dominant terms at the end.**

Example - what is this?

\`\`\`text
for i in range(n):        # O(n)
    for j in range(n):    # O(n)  -> nested, multiply
        work()            # O(1)
\`\`\`

Two nested passes over n → \`O(n²)\`.`,
    },
    {
      id: 'space',
      heading: 'Space complexity (and the hidden stack)',
      body: `Space complexity measures **extra** memory used as a function of n - not counting the input itself (that's "auxiliary space").

Common sources people forget:

- **Recursion uses stack space.** A recursion n deep is \`O(n)\` space even if it allocates nothing explicitly. This is why deep recursion causes stack overflows.
- **Output that grows with n** counts if the problem asks about total space, but auxiliary-space questions usually exclude it.
- **Time/space tradeoffs are everywhere.** A hash set can turn an \`O(n²)\` time / \`O(1)\` space brute force into \`O(n)\` time / \`O(n)\` space. Knowing which to spend is a core interview skill.

As the cheatsheet says: *space complexity works the same way as time - lower is better.*`,
    },
    {
      id: 'amortized',
      heading: 'Amortized analysis (why append is O(1))',
      body: `A dynamic array (Python list, JS array, Java ArrayList) doubles its capacity when full. That resize is \`O(n)\` - so how can we say \`append\` is \`O(1)\`?

**Amortized analysis** averages the cost over a sequence of operations. The expensive resizes are rare and get "paid for" by the many cheap appends between them. Across n appends, total work is \`O(n)\`, so the *amortized* cost per append is \`O(1)\`.

This is different from *average-case* (which is about input distribution). Amortized is a worst-case guarantee over a sequence - no adversarial input can make the average worse.`,
    },
  ],

  complexity: [
    {
      operation: 'Array index access',
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)',
      space: 'O(1)',
      note: 'Direct address arithmetic.',
    },
    {
      operation: 'Linear search',
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
      space: 'O(1)',
      note: 'Best = found at index 0.',
    },
    {
      operation: 'Binary search',
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
      space: 'O(1)',
      note: 'Requires sorted input.',
    },
    {
      operation: 'Comparison sort',
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
      note: 'n log n is the proven lower bound for comparison sorts.',
    },
    {
      operation: 'Nested double loop',
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
      note: 'Classic brute-force pair scan.',
    },
  ],

  dryRuns: [
    {
      title: 'Deriving the complexity of a nested loop',
      input: 'A function with a loop of n inside a loop of n',
      steps: [
        {
          label: 'Outer loop',
          detail: 'Runs n times. On its own this contributes a factor of n.',
        },
        {
          label: 'Inner loop',
          detail: 'For each outer iteration it runs n times → n × n total iterations.',
        },
        {
          label: 'Body',
          detail: 'Constant O(1) work per inner iteration.',
        },
        {
          label: 'Combine',
          detail: 'n × n × O(1) = O(n²). Drop any constants and lower terms.',
        },
      ],
      result: 'O(n²) time, O(1) auxiliary space.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Constant vs linear',
      problem: 'Return the first element vs sum all elements.',
      approach:
        'first() touches one element regardless of size → O(1). sum() must visit every element once → O(n). The gap is the difference between indexing and iterating.',
      complexity: 'first: O(1) · sum: O(n)',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def first(a):        # O(1)
    return a[0]

def total(a):        # O(n)
    s = 0
    for x in a:
        s += x
    return s`,
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const first = (a) => a[0];              // O(1)
const total = (a) => a.reduce((s, x) => s + x, 0); // O(n)`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Turning O(n²) into O(n) with a hash set',
      problem: 'Does the array contain any duplicate?',
      approach:
        'The brute force compares every pair → O(n²). A hash set records seen values in one pass; a repeat is a duplicate → O(n) time at the cost of O(n) space. This is the canonical time/space tradeoff.',
      complexity: 'brute: O(n²) time · set: O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def has_dup(a):          # O(n) time, O(n) space
    seen = set()
    for x in a:
        if x in seen:
            return True
        seen.add(x)
    return False`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Why merge sort is O(n log n)',
      problem: 'Analyze the merge-sort recurrence.',
      approach:
        'Each level splits the array in half, so there are log n levels. At every level the merges together touch all n elements → O(n) work per level. n work × log n levels = O(n log n). This recurrence, T(n) = 2T(n/2) + O(n), is worth memorizing.',
      complexity: 'O(n log n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python (recurrence sketch)',
          code: `# T(n) = 2 * T(n / 2) + O(n)
#        \\_____/   \\____/
#      two halves   merge step
# levels = log2(n), work per level = n  ->  O(n log n)`,
        },
      ],
    },
  ],

  advantages: [
    'Machine-independent - compare algorithms without benchmarking hardware.',
    'Predicts behavior at scale before you write or run code.',
    'A shared vocabulary every engineer and interviewer understands instantly.',
  ],
  disadvantages: [
    'Hides constant factors that can matter a lot for small or fixed-size inputs.',
    'Worst-case Big-O can be pessimistic for inputs that never actually occur.',
    'Says nothing about cache behavior, memory locality, or real latency.',
  ],
  commonMistakes: [
    'Reporting best-case as "the" complexity - interviewers mean worst-case.',
    'Forgetting recursion stack space when computing space complexity.',
    'Multiplying loop bounds that iterate over *different* variables (that is O(n·m), not O(n²)).',
    'Keeping constants: writing O(2n) or O(n + 3) instead of O(n).',
  ],
  edgeCases: [
    'Empty input (n = 0) - many algorithms are O(1) here; state it explicitly.',
    'Loops whose bound depends on a *value* in the input, not its length (pseudo-polynomial).',
    'Early-exit loops: best case may be O(1) even when worst case is O(n).',
  ],
  interviewTips: [
    'Always state time AND space complexity - unprompted.',
    'Say worst-case by default; mention best/average only if they differ meaningfully.',
    'When asked to "optimize", think about moving down the ladder via sorting or hashing.',
    'Narrate the tradeoff out loud: "I can trade O(n) extra space for O(n) time."',
  ],
  realWorldUseCases: [
    'Choosing a data structure: hash map (O(1) lookup) vs array scan (O(n)).',
    'Database index design - B-trees give O(log n) lookups over O(n) full scans.',
    'Deciding whether an approach will survive production-scale traffic.',
  ],
  relatedSlugs: ['data-structures', 'algorithms', 'common-patterns', 'formulas', 'golden-rules'],

  flashcards: [
    { id: 'c-f1', front: 'What does Big-O describe?', back: 'An upper bound on how work grows as input size n → ∞, ignoring constants and lower-order terms.' },
    { id: 'c-f2', front: 'Simplify O(3n² + 5n + 100)', back: 'O(n²) - keep only the dominant term, drop constants.' },
    { id: 'c-f3', front: 'Complexity of binary search?', back: 'O(log n) time, O(1) space (iterative). Requires sorted input.' },
    { id: 'c-f4', front: 'Why is O(n log n) the floor for comparison sorts?', back: 'There are n! possible orderings; a comparison tree distinguishing them needs log(n!) = Θ(n log n) comparisons.' },
    { id: 'c-f5', front: 'What space does recursion n-deep use?', back: 'O(n) - each call frame sits on the stack until it returns.' },
    { id: 'c-f6', front: 'Amortized vs average-case?', back: 'Amortized averages cost over a sequence of ops (worst-case guarantee); average-case averages over input distribution.' },
  ],

  practice: [
    {
      id: 'c-p1',
      title: 'Classify the complexity',
      difficulty: 'Easy',
      description: 'Given code snippets, state the tightest Big-O for each. Build the reflex of reading complexity by inspection.',
      constraints: ['No coding - analysis only', 'Report worst-case'],
      hints: ['Nested loops multiply; sequential loops add.', 'Halving → log.'],
      pattern: 'Complexity reasoning',
    },
    {
      id: 'c-p2',
      title: 'Two Sum - brute vs hashed',
      difficulty: 'Easy',
      description: 'Implement both the O(n²) and O(n) solutions to Two Sum and articulate the tradeoff.',
      constraints: ['Return indices of the two numbers summing to target'],
      hints: ['A hash map remembers complements you have already seen.'],
      pattern: 'Hash Table / time-space tradeoff',
      url: 'https://leetcode.com/problems/two-sum/',
    },
  ],

  faqs: [
    { question: 'Is O(2n) different from O(n)?', answer: 'No. Big-O ignores constant factors, so O(2n) simplifies to O(n).' },
    { question: 'Do I count the input array in space complexity?', answer: 'For *auxiliary* space, no - you count only extra memory beyond the input. Total space counts everything; interviews usually mean auxiliary.' },
    { question: 'What is the difference between O and Θ?', answer: 'O is an upper bound; Θ is a tight bound (both upper and lower). People say "O(n²)" loosely even when they mean Θ.' },
  ],

  references: [
    { label: 'MIT 6.006 - Algorithmic Complexity', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' },
    { label: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
  ],
};
