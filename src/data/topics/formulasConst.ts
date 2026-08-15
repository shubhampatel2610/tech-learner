import type { Topic } from '@/types/content.types';

/**
 * TOPIC 13 - IMPORTANT FORMULAS
 * Full deep-dive. Mirrors cheatsheet section 13 (sum of first n numbers, sum
 * of squares, nCr, logarithm rules) - the closed-form math that replaces a
 * loop with a single O(1) computation, and the log identities behind Big-O.
 */
export const formulasTopic: Topic = {
  slug: 'formulas',
  order: 13,
  title: 'Important Formulas',
  tagline: 'Closed-form math that turns an O(n) loop into an O(1) expression.',
  difficulty: 'Beginner',
  icon: 'pi pi-calculator',
  estMinutes: 20,
  tags: ['Math', 'Combinatorics', 'Logarithms'],

  overview:
    'A handful of closed-form formulas show up constantly in algorithm work: summing a range, counting combinations, and reasoning about logarithms. Knowing them cold does two things - it lets you replace a loop with a single O(1) expression when a problem only needs a total, and it gives you the vocabulary to reason about *why* certain algorithms have the complexity they do (nested loops over pairs, Big-O bases, binary search step counts).',

  whyItExists:
    "These formulas exist because summation and counting patterns recur so often that deriving them from scratch every time wastes time you don't have in an interview or a hot code path. Gauss's trick for summing 1..n, the combinatorial identity behind nCr, and the algebra of logarithms are not obscure trivia - they are the fastest path from 'I could write a loop for this' to 'I can compute this directly,' and they explain the shape of complexity classes you already use (why O(n²) shows up for pairwise problems, why log base doesn't matter for Big-O).",

  sections: [
    {
      id: 'sum-formulas',
      heading: "Gauss's trick: sum of first n numbers",
      body: `**Sum of first n natural numbers:** \`1 + 2 + ... + n = n(n+1)/2\`.

The classic derivation (attributed to a young Gauss): write the sum forwards and backwards, then add them pairwise.

\`\`\`text
  S = 1 + 2 + 3 + ... + n
  S = n + (n-1) + (n-2) + ... + 1
------------------------------------
 2S = (n+1) + (n+1) + (n+1) + ... + (n+1)   <- n pairs, each summing to n+1
 2S = n(n+1)
  S = n(n+1) / 2
\`\`\`

**Sum of squares:** \`1² + 2² + ... + n² = n(n+1)(2n+1)/6\`.

**Why this matters for complexity analysis, not just arithmetic:** a loop that does \`i\` units of work on iteration \`i\` (like a nested loop where the inner loop shrinks each pass - "for i in range(n): for j in range(i): ...") does \`0 + 1 + 2 + ... + (n-1) = n(n-1)/2\` total work. That is **O(n²)**, not O(n) - the formula is *why* a triangular-shaped loop nest is quadratic, not the informal "two loops = squared" rule of thumb.`,
      visualizer: 'formula-ops',
    },
    {
      id: 'combinatorics',
      heading: 'Combinatorics: permutations, combinations, Pascal\'s triangle',
      body: `**Permutations** (\`nPr\`) - the number of ways to arrange r items chosen from n, where **order matters**: \`nPr = n! / (n-r)!\`.

**Combinations** (\`nCr\`, also written \`C(n,r)\` or \`(n choose r)\`) - the number of ways to choose r items from n, where **order does not matter**: \`nCr = n! / (r! (n-r)!)\`.

The order-matters-or-not distinction is the single most common source of off-by-a-factor errors: choosing 2 people from 5 for a *team* is \`5C2 = 10\`; choosing 2 people from 5 for *president and vice-president* (distinct roles) is \`5P2 = 20\` - exactly double, because each team can be assigned to the two roles in 2 ways.

**Pascal's triangle** builds every \`nCr\` value without computing any factorials: each entry is the sum of the two entries above it (\`C(n,r) = C(n-1,r-1) + C(n-1,r)\`), which is itself a DP recurrence - row n, position r of the triangle *is* \`nCr\`. This is both a fast way to compute many \`nCr\` values at once and the reason "choose a subset" problems relate so closely to the [[dynamic-programming]] module.

\`\`\`text
Row 0:          1
Row 1:         1 1
Row 2:        1 2 1
Row 3:       1 3 3 1
Row 4:      1 4 6 4 1     <- C(4,2) = 6
\`\`\``,
    },
    {
      id: 'log-rules',
      heading: 'Logarithm rules - and why Big-O never states a base',
      body: `The three algebraic identities every engineer should have memorized:

- **Product rule:** \`log_a(xy) = log_a(x) + log_a(y)\`
- **Quotient rule:** \`log_a(x/y) = log_a(x) - log_a(y)\`
- **Power rule:** \`log_a(x^k) = k · log_a(x)\`
- **Change of base:** \`log_b(x) = log_a(x) / log_a(b)\`

**The change-of-base rule is why Big-O notation never specifies a logarithm's base.** \`log_2(n)\` and \`log_10(n)\` differ only by the *constant factor* \`1/log_10(2) ≈ 3.32\` - and Big-O ignores constant factors entirely (see the [[complexity]] module). So \`O(log₂ n)\` and \`O(log₁₀ n)\` are the *same complexity class*, which is why you'll simply see "O(log n)" everywhere with no base written.

**Where this shows up in algorithms directly:** binary search halves the search space each step, so the number of steps to reach 1 element from n is \`log₂(n)\`. Merge sort's recurrence \`T(n) = 2T(n/2) + O(n)\` has \`log₂(n)\` levels of recursion. A balanced BST's height is \`log₂(n)\`. Every one of these "log n" claims is a direct application of "how many times can you halve n before reaching 1?"`,
    },
    {
      id: 'fast-exponentiation',
      heading: 'Fast exponentiation - logs turned into an algorithm',
      body: `Computing \`x^n\` naively (\`x * x * x * ... \`, n times) is **O(n)**. But you can compute it in **O(log n)** by repeated squaring, using the identity \`x^n = (x^(n/2))^2\` when n is even, and \`x^n = x · x^(n-1)\` when n is odd:

\`\`\`text
def fast_pow(x, n):
    if n == 0:
        return 1
    half = fast_pow(x, n // 2)
    if n % 2 == 0:
        return half * half
    return half * half * x
\`\`\`

Each recursive call halves n, exactly like binary search - so the recursion depth (and total work) is \`O(log n)\`. This is a direct, practical payoff of understanding logarithms as "how many halvings," not just an abstract formula - it turns a linear algorithm into a logarithmic one with the same trick binary search and merge sort both use.`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'Sum of first n (closed form)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: "Gauss's formula n(n+1)/2 - no loop needed." },
    { operation: 'Sum of first n (naive loop)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Correct but wasteful when a closed form exists.' },
    { operation: 'nCr via multiplicative formula', best: 'O(k)', average: 'O(k)', worst: 'O(k)', space: 'O(1)', note: 'k = r (the smaller of r and n-r) - avoids computing large factorials directly.' },
    { operation: "nCr via Pascal's triangle (build full table)", best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(nk)', note: 'Worth it only if you need MANY nCr values, not just one.' },
    { operation: 'Exponentiation - naive (repeated multiply)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'n multiplications for x^n.' },
    { operation: 'Exponentiation - fast (repeated squaring)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(log n)', note: 'Recursive: O(log n) stack. Iterative: O(1) space.' },
  ],

  dryRuns: [
    {
      title: "Pascal's triangle building C(4, 2)",
      input: 'Build rows 0 through 4 of Pascal\'s triangle',
      steps: [
        { label: 'row 0', detail: 'Base case: [1].', state: [1] },
        { label: 'row 1', detail: 'Edges are always 1: [1, 1].', state: [1, 1] },
        { label: 'row 2', detail: 'Middle entry = 1+1 = 2: [1, 2, 1].', state: [1, 2, 1] },
        { label: 'row 3', detail: 'Entries = sum of the two above: [1, 3, 3, 1].', state: [1, 3, 3, 1] },
        { label: 'row 4', detail: 'C(4,2) = C(3,1) + C(3,2) = 3 + 3 = 6: [1, 4, 6, 4, 1].', state: [1, 4, 6, 4, 1], highlight: [2] },
      ],
      result: 'C(4,2) = 6, read directly off row 4 position 2 - built with only additions, no factorials or division at all.',
    },
    {
      title: 'Fast exponentiation: 3^13 by repeated squaring',
      input: 'x = 3, n = 13 (binary: 1101)',
      steps: [
        { label: 'n=13 (odd)', detail: '13 = 2×6 + 1. Recurse on fast_pow(3, 6), then multiply by an extra 3.' },
        { label: 'n=6 (even)', detail: '6 = 2×3. Recurse on fast_pow(3, 3), then square the result.' },
        { label: 'n=3 (odd)', detail: '3 = 2×1 + 1. Recurse on fast_pow(3, 1), then multiply by an extra 3.' },
        { label: 'n=1 (odd) -> n=0', detail: 'fast_pow(3,1) = 3 × fast_pow(3,0) = 3 × 1 = 3.' },
        { label: 'unwind', detail: 'n=3: 3² × 3 = 27. n=6: 27² = 729. n=13: 729² × 3 = 1,594,323.' },
      ],
      result: '3^13 = 1,594,323, computed with only 5-6 multiplications instead of 13 - O(log n) instead of O(n).',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Sum a range without a loop',
      problem: 'Compute the sum of all integers from 1 to n, as fast as possible.',
      approach:
        "Gauss's formula n(n+1)/2 computes the answer in one multiplication and one division - O(1) regardless of how large n is, versus an O(n) loop that gets slower as n grows.",
      complexity: 'O(1) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def sum_range(n):
    return n * (n + 1) // 2

# sum_range(100) -> 5050, instantly, no loop`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Count pairs without enumerating them',
      problem: 'Given n items, how many unordered pairs can be formed?',
      approach:
        'This is exactly nC2 = n(n-1)/2 - a special case of the combinations formula. Recognizing "count unordered pairs from n items" as nC2 avoids writing a nested loop (O(n²)) just to compute a count that has a direct O(1) formula.',
      complexity: 'O(1) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def count_pairs(n):
    return n * (n - 1) // 2

# 5 items -> 5*4/2 = 10 pairs, matching the "choose 2 of 5" identity`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: "Fast exponentiation (Pow(x, n))",
      problem: 'Compute x raised to the power n in better than O(n) time.',
      approach:
        'Repeated squaring: halve the exponent each recursive step, squaring the partial result, and multiply in an extra factor of x when the exponent is odd. This mirrors binary search\'s "halve the problem each step" shape, giving O(log n) instead of O(n) multiplications. Handle negative exponents via x^(-n) = 1 / x^n.',
      complexity: 'O(log n) time, O(log n) space (recursive) or O(1) space (iterative)',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def my_pow(x, n):
    if n < 0:
        return 1 / my_pow(x, -n)
    if n == 0:
        return 1.0
    half = my_pow(x, n // 2)
    return half * half if n % 2 == 0 else half * half * x`,
        },
      ],
    },
  ],

  advantages: [
    'Replaces an O(n) loop with an O(1) closed-form expression whenever only the total (not each intermediate step) is needed.',
    "Pascal's triangle computes nCr with pure addition - no factorial overflow risk for large n.",
    'Understanding log rules explains WHY Big-O never states a logarithm base, instead of just memorizing the convention.',
  ],
  disadvantages: [
    'Closed-form formulas only replace a loop when you need the TOTAL, not each intermediate partial sum.',
    'Direct factorial computation for nCr overflows quickly for large n - the multiplicative or Pascal\'s-triangle forms are safer in practice.',
    'Floating-point log computations can introduce precision errors; prefer exact integer arithmetic (multiplicative nCr, repeated squaring) when correctness matters.',
  ],
  commonMistakes: [
    'Confusing permutations (order matters) with combinations (order does not) and using the wrong formula.',
    'Computing nCr via n! / (r! (n-r)!) directly with large factorials, causing overflow or slow computation - use the multiplicative form instead.',
    'Assuming O(log n) always means log base 2 in code - the algorithm\'s actual halving factor determines the base, though it never matters for the Big-O class itself.',
    'Forgetting the -1 in "sum of first n" derivations when the range starts at 0 instead of 1 - off-by-one is easy to introduce here.',
  ],
  edgeCases: [
    'n = 0 - sum formulas and nCr should both degrade to sensible values (sum = 0, C(0,0) = 1).',
    'r > n in nCr - undefined/zero, must be guarded explicitly rather than computing a negative factorial argument.',
    'Negative exponents in fast exponentiation - requires taking a reciprocal, easy to forget.',
    'Very large n causing factorial overflow in naive nCr implementations - prefer the multiplicative formula or working in log-space.',
  ],
  interviewTips: [
    'If a problem only needs a running total or count and you find yourself writing a loop, pause and check whether a closed-form formula applies.',
    'State explicitly whether a counting problem is permutations (order matters) or combinations (order does not) before writing the formula.',
    'Mention fast exponentiation (repeated squaring) whenever a problem needs x^n for large n - it signals you recognize the log n halving pattern.',
    'If asked "why doesn\'t Big-O specify a log base," the change-of-base-is-a-constant-factor argument is the complete, correct answer.',
  ],
  realWorldUseCases: [
    'Cryptography - fast exponentiation (modular version) is the core operation behind RSA and Diffie-Hellman.',
    'Probability and statistics - combinations power hypergeometric and binomial distribution calculations.',
    'Database query optimization - cardinality estimation for join sizes often uses combinatorial counting.',
    'Financial modeling - compound interest and growth calculations rely on logarithm and exponent identities.',
  ],
  relatedSlugs: ['complexity', 'algorithms', 'dynamic-programming'],

  flashcards: [
    { id: 'fm-f1', front: 'Sum of first n natural numbers?', back: 'n(n+1)/2 - derivable by pairing the sequence with its reverse (Gauss\'s trick).' },
    { id: 'fm-f2', front: 'nPr vs nCr - the key difference?', back: 'nPr counts arrangements where order matters; nCr counts selections where order does not. nPr = nCr × r! (each combination can be ordered r! ways).' },
    { id: 'fm-f3', front: "What does row n, position r of Pascal's triangle equal?", back: 'C(n, r) - each entry is the sum of the two entries above it, C(n-1,r-1) + C(n-1,r).' },
    { id: 'fm-f4', front: 'Why does Big-O never specify a logarithm\'s base?', back: 'Change of base (log_b x = log_a x / log_a b) means different bases differ only by a constant factor, and Big-O ignores constant factors.' },
    { id: 'fm-f5', front: 'Complexity of computing x^n via repeated squaring?', back: 'O(log n) - halving the exponent each step is the same shape as binary search.' },
    { id: 'fm-f6', front: 'Why is a loop that does i work on iteration i overall O(n²)?', back: 'Total work is 0+1+...+(n-1) = n(n-1)/2, which is O(n²) - the triangular-sum formula, not just "two nested loops."' },
  ],

  practice: [
    {
      id: 'fm-p1',
      title: "Pow(x, n)",
      difficulty: 'Medium',
      description: 'Implement x^n in O(log n) using fast exponentiation (repeated squaring).',
      constraints: ['n can be negative', 'O(log n) expected'],
      hints: ['Halve n each recursive step; square the partial result, and multiply in an extra x when n is odd.'],
      pattern: 'Fast Exponentiation',
      url: 'https://leetcode.com/problems/powx-n/',
    },
    {
      id: 'fm-p2',
      title: 'Sqrt(x)',
      difficulty: 'Easy',
      description: 'Compute the integer square root of a non-negative integer without using a built-in power function.',
      constraints: ['O(log x) expected'],
      hints: ['Binary search the answer in [0, x] - the same halving idea behind fast exponentiation and binary search.'],
      pattern: 'Binary Search on the Answer',
      url: 'https://leetcode.com/problems/sqrtx/',
    },
    {
      id: 'fm-p3',
      title: 'Unique Paths',
      difficulty: 'Medium',
      description: 'Count the number of distinct paths from the top-left to bottom-right of a grid, moving only right or down - a direct combinatorics application.',
      constraints: ['Grid dimensions m x n'],
      hints: ['The answer is a single combination: choose which (m-1) of the (m+n-2) total moves are "down" - C(m+n-2, m-1).'],
      pattern: 'Combinatorics',
      url: 'https://leetcode.com/problems/unique-paths/',
    },
  ],

  faqs: [
    { question: 'Do I need to memorize the sum of cubes formula too?', answer: 'It is far less commonly needed in interviews than sum of first n and sum of squares. If it comes up, note that (1+2+...+n)² equals the sum of the first n cubes - a fact worth knowing exists, not necessarily memorizing the derivation.' },
    { question: 'Why use the multiplicative nCr formula instead of n! / (r!(n-r)!) directly?', answer: 'Factorials grow extremely fast (20! already overflows a 64-bit integer) - computing them directly for large n risks overflow or wasted work on a huge intermediate value that mostly cancels out. The multiplicative form (n × (n-1) × ... × (n-r+1)) / r! avoids computing the full n! at all.' },
    { question: 'Is Pascal\'s triangle actually dynamic programming?', answer: 'Yes - it is exactly a DP table (C(n,r) = C(n-1,r-1) + C(n-1,r), a recurrence built from smaller subproblems). It is one of the cleanest illustrations of the DP framework from the Dynamic Programming module, just applied to counting instead of optimization.' },
  ],

  references: [
    { label: 'Brilliant.org - Combinatorics', url: 'https://brilliant.org/wiki/combinatorics/' },
    { label: 'Khan Academy - Properties of Logarithms', url: 'https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs' },
  ],
};
