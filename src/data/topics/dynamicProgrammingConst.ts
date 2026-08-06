import type { Topic } from '@/types/content.types';

/**
 * TOPIC 12 - DYNAMIC PROGRAMMING
 * Full deep-dive. Mirrors cheatsheet section 12 (Steps: Define State, Write
 * Recurrence, Choose Order, Add Memoization/Tabulation; Common Problems:
 * Fibonacci, Knapsack, LCS, Coin Change, Matrix Chain Multiplication) - the
 * "Advanced" capstone module, matching the boxed "DP = Break It Down, Build
 * It Up!" callout.
 */
export const dynamicProgrammingTopic: Topic = {
  slug: 'dynamic-programming',
  order: 12,
  title: 'Dynamic Programming',
  tagline: 'Break it down, build it up - solve every subproblem exactly once.',
  difficulty: 'Advanced',
  icon: 'pi pi-table',
  estMinutes: 75,
  tags: ['Memoization', 'Tabulation', 'DP', 'Recurrence'],

  overview:
    "Dynamic programming solves a problem by breaking it into smaller subproblems - the same idea as plain recursion - but with one crucial addition: it never solves the same subproblem twice. Naive recursion on overlapping subproblems (like Fibonacci) re-derives the same answer exponentially many times; DP notices the repetition, stores each answer the first time it's computed, and reuses it forever after. That single change turns exponential blowup into polynomial time.",

  whyItExists:
    "Some problems - counting paths, optimizing a cost, finding the best combination of choices - naturally decompose into smaller versions of themselves, but those smaller versions overlap: computing fib(10) needs fib(9) and fib(8), and fib(9) ALSO needs fib(8). Plain recursion recomputes fib(8) from scratch both times, and this compounds exponentially with depth. DP exists to recognize that overlap and pay for each distinct subproblem exactly once, trading memory (to remember answers) for a massive reduction in time.",

  sections: [
    {
      id: 'four-steps',
      heading: 'The four-step framework',
      body: `Every DP problem, however different it looks on the surface, is solved by the same four-step process from the cheatsheet:

1. **Define the state** - what does a subproblem look like, precisely? Usually "the answer for input of size i" (\`dp[i]\`) or "the answer considering the first i items with j capacity used" (\`dp[i][j]\`). Getting the state definition right is 80% of solving a DP problem - if two different subproblems need different amounts of information to describe, your state is incomplete.
2. **Write the recurrence** - how does \`dp[i]\` relate to smaller/earlier states? This is the "choice" at each step: for Fibonacci, \`dp[i] = dp[i-1] + dp[i-2]\`; for knapsack, "take this item or don't" gives \`dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w - weight[i]])\`.
3. **Choose the order** - top-down (recursion + memoization, computed on demand, natural recursive order) or bottom-up (iterative tabulation, computed in an order that guarantees dependencies are ready first - almost always smallest subproblems to largest).
4. **Add memoization or tabulation** - store each \`dp[state]\` the first time it's computed, so later requests for the same state are an O(1) lookup instead of a recomputation.

Miss step 1 (a wrong or incomplete state) and no amount of memoization saves you - you'll either get a wrong answer or find you still can't reuse subproblems.`,
      visualizer: 'dp-table-ops',
    },
    {
      id: 'memo-vs-tab',
      heading: 'Memoization (top-down) vs Tabulation (bottom-up)',
      body: `Both achieve the same complexity - they differ only in *direction* and *mechanism*.

**Memoization (top-down):** write the recursion exactly as you'd think about the problem naturally, then add a cache. Before computing \`dp[state]\`, check if it's already in the cache; if so, return it immediately.

\`\`\`text
memo = {}
def fib(n):
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
\`\`\`

**Tabulation (bottom-up):** build an explicit table (array) and fill it iteratively, starting from the base cases, in an order that guarantees every value you need has already been computed.

\`\`\`text
dp = [0, 1] + [0] * (n - 1)
for i in range(2, n + 1):
    dp[i] = dp[i-1] + dp[i-2]
\`\`\`

**Tradeoffs:** memoization is often easier to write correctly (you don't have to figure out a fill order - recursion figures it out for you) and only computes states that are actually needed. Tabulation avoids recursion's call-stack overhead and stack-depth limits, and makes space optimization easier to spot (see below). For interviews, starting with memoization and converting to tabulation once it works is a very common, very safe strategy.`,
    },
    {
      id: 'space-optimization',
      heading: 'Space optimization - do you need the whole table?',
      body: `Once tabulation is working, a frequent follow-up optimization: if \`dp[i]\` only depends on the last **k** previous states (not the entire history), you don't need to store the whole table - just the last k values.

Fibonacci's recurrence \`dp[i] = dp[i-1] + dp[i-2]\` only ever looks back 2 steps, so the full O(n) array can shrink to two rolling variables:

\`\`\`text
prev2, prev1 = 0, 1
for i in range(2, n + 1):
    prev2, prev1 = prev1, prev2 + prev1
# answer is prev1
\`\`\`

**O(n) space → O(1) space**, same O(n) time. This pattern generalizes: a 2D DP table where row i only depends on row i-1 can be compressed to two 1D rows (or even one, updated carefully in the right direction) - a very common "can you do better on space?" interview follow-up once the correctness is established.`,
    },
    {
      id: 'classic-problems',
      heading: 'The four classic problem shapes',
      body: `Most DP interview questions are a variation on one of these:

- **0/1 Knapsack** - given items with weight and value, and a capacity limit, maximize value without exceeding capacity, using each item at most once. State: \`dp[i][w]\` = best value using the first i items with capacity w. Recurrence: skip item i, or take it (if it fits) and add its value to the best solution for the remaining capacity. **O(n · W)** time and space.
- **Longest Common Subsequence (LCS)** - given two strings, find the longest subsequence common to both (not necessarily contiguous). State: \`dp[i][j]\` = LCS length of the first i characters of A and first j of B. Recurrence: if the characters match, extend the diagonal; otherwise take the best of dropping one character from either string. **O(n · m)**.
- **Coin Change** - given coin denominations, find the minimum number of coins to make a target amount (or count the ways to make it). State: \`dp[amount]\` = min coins (or number of ways) to reach that amount. Recurrence: for each coin, \`dp[amount] = min(dp[amount], 1 + dp[amount - coin])\`. **O(amount · num_coins)**.
- **Matrix Chain Multiplication** - given a chain of matrices, find the cheapest order to multiply them (multiplication is associative but not free - order changes total scalar multiplications). State: \`dp[i][j]\` = min cost to multiply matrices i through j. Recurrence: try every split point k between i and j, combine the two sub-chains' costs plus the cost of multiplying their results. **O(n³)**.

Recognizing which shape a new problem resembles is most of the battle - the actual code for each is a direct translation of its recurrence.`,
    },
    {
      id: 'when-not-dp',
      heading: 'When DP is the wrong tool',
      body: `DP is not always the answer, and reaching for it reflexively wastes time on problems that have a simpler or faster solution:

- **No overlapping subproblems** - if the subproblems are independent (they never repeat), you want **Divide & Conquer**, not DP. Memoizing independent subproblems adds bookkeeping overhead for zero benefit. See the [[common-patterns]] module.
- **The greedy-choice property holds** - if a locally optimal choice is provably globally optimal (interval scheduling, MST via Kruskal's/Prim's), greedy solves it faster than DP, with less code and no table.
- **The state space is too large** - if a correct DP state genuinely requires exponential dimensions (e.g. a state per subset of n items, \`O(2ⁿ)\` states), DP doesn't save you - it just makes the exponential blowup explicit instead of hidden in recursion. At that point you need approximation, pruning (branch and bound), or accepting exponential time for small n.

The diagnostic question worth asking every time: **"do smaller subproblems repeat, and is there a small enough number of distinct ones to actually store?"** If yes to both, DP applies. If either answer is no, look elsewhere first.`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'Naive recursive Fibonacci (no memo)', best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)', space: 'O(n)', note: 'Recomputes the same subproblems exponentially many times.' },
    { operation: 'Memoized / tabulated Fibonacci', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Space-optimizable to O(1) with two rolling variables.' },
    { operation: '0/1 Knapsack', best: 'O(n·W)', average: 'O(n·W)', worst: 'O(n·W)', space: 'O(n·W)', note: 'W = capacity. Space optimizable to O(W) with a 1D rolling row.' },
    { operation: 'Longest Common Subsequence', best: 'O(n·m)', average: 'O(n·m)', worst: 'O(n·m)', space: 'O(n·m)', note: 'n, m = string lengths. Space optimizable to O(min(n,m)).' },
    { operation: 'Coin Change (min coins)', best: 'O(amount)', average: 'O(amount · k)', worst: 'O(amount · k)', space: 'O(amount)', note: 'k = number of coin denominations.' },
    { operation: 'Matrix Chain Multiplication', best: 'O(n³)', average: 'O(n³)', worst: 'O(n³)', space: 'O(n²)', note: 'Tries every split point for every subrange.' },
  ],

  dryRuns: [
    {
      title: 'Memoization caching a repeated subproblem in Fibonacci',
      input: 'fib(5), with an initially empty memo cache',
      steps: [
        { label: 'fib(5) calls fib(4) and fib(3)', detail: 'fib(4) recurses into fib(3) and fib(2) - notice fib(3) is about to be requested by BOTH fib(5) and fib(4).', state: [5, 4, 3] },
        { label: 'fib(3) computed and cached', detail: 'First time fib(3) is requested (via the fib(4) branch), it recurses down, computes 2, and memo[3] = 2 is stored.', state: [3], highlight: [0] },
        { label: 'fib(5) needs fib(3) again', detail: 'Without memoization this would re-recurse into fib(2) and fib(1) all over again. WITH memoization: memo[3] is an O(1) lookup - no recursion at all.', state: [3], highlight: [0] },
        { label: 'total calls', detail: 'Naive recursion makes 15 calls for fib(5). Memoized: exactly 6 (one per distinct value 0..5) - every subproblem solved exactly once.', state: [0, 1, 2, 3, 4, 5] },
      ],
      result: "Memoization turns fib(5)'s O(2ⁿ) call tree into O(n) - the caching of fib(3) alone is what prevents the tree from branching exponentially below it.",
    },
    {
      title: 'Coin Change tabulation for amount = 5, coins = [1, 2, 5]',
      input: 'dp[0..5], dp[0] = 0 (base case), all others start at infinity',
      steps: [
        { label: 'dp[1]', detail: 'Try each coin ≤ 1: coin 1 -> dp[1] = min(inf, 1 + dp[0]) = 1.', state: [0, 1] },
        { label: 'dp[2]', detail: 'coin 1 -> 1 + dp[1] = 2. coin 2 -> 1 + dp[0] = 1. Best: dp[2] = 1.', state: [0, 1, 1] },
        { label: 'dp[3]', detail: 'coin 1 -> 1 + dp[2] = 2. coin 2 -> 1 + dp[1] = 2. Best: dp[3] = 2.', state: [0, 1, 1, 2] },
        { label: 'dp[4]', detail: 'coin 1 -> 1 + dp[3] = 3. coin 2 -> 1 + dp[2] = 2. Best: dp[4] = 2.', state: [0, 1, 1, 2, 2] },
        { label: 'dp[5]', detail: 'coin 1 -> 1 + dp[4] = 3. coin 2 -> 1 + dp[3] = 3. coin 5 -> 1 + dp[0] = 1. Best: dp[5] = 1.', state: [0, 1, 1, 2, 2, 1] },
      ],
      result: 'Minimum coins for amount 5 is 1 (a single 5-coin) - built bottom-up in O(amount × coins), reusing every smaller dp[i] instead of re-deriving it.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Climbing Stairs (Fibonacci in disguise)',
      problem: 'You can climb 1 or 2 steps at a time - count the number of distinct ways to reach step n.',
      approach:
        'The number of ways to reach step i is the number of ways to reach step i-1 (then take a 1-step) plus the ways to reach step i-2 (then take a 2-step). That IS the Fibonacci recurrence, just with different base cases (ways(1)=1, ways(2)=2). Space-optimized to O(1) with two rolling variables.',
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: '0/1 Knapsack (tabulated)',
      problem: 'Given item weights and values and a capacity W, maximize total value without exceeding capacity, using each item at most once.',
      approach:
        'dp[i][w] = best value using the first i items with capacity w. At each item, choose the better of: skip it (dp[i-1][w]), or take it if it fits (value[i] + dp[i-1][w - weight[i]]). Filling row by row (items) and column by column (capacity) guarantees every dependency is already computed.',
      complexity: 'O(n·W) time, O(n·W) space (optimizable to O(W))',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]  # skip item i-1
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                )
    return dp[n][capacity]`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Longest Common Subsequence',
      problem: 'Find the length of the longest subsequence common to two strings.',
      approach:
        'dp[i][j] = LCS length of A[0:i] and B[0:j]. If the current characters match, extend the diagonal (dp[i-1][j-1] + 1) - that character is definitely part of an optimal LCS ending here. If they don\'t match, the LCS ending here is the better of dropping the last character of A or of B.',
      complexity: 'O(n·m) time, O(n·m) space (optimizable to O(min(n,m)))',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`,
        },
      ],
    },
  ],

  advantages: [
    'Turns exponential brute-force recursion (O(2ⁿ)) into polynomial time by eliminating repeated work.',
    'The four-step framework (state, recurrence, order, memoize) applies uniformly across a huge range of problems.',
    'Space optimization (rolling arrays) often turns an O(n·m)-space solution into O(min(n,m)) or even O(1) once correctness is established.',
  ],
  disadvantages: [
    'Requires correctly identifying the state - an incomplete or wrong state definition silently produces wrong answers, not errors.',
    'Table/memo storage costs real memory - a 2D DP table over two large inputs can still be prohibitively large even at polynomial complexity.',
    'Not a universal hammer - applying it to problems without overlapping subproblems (divide & conquer territory) or with a valid greedy solution adds unnecessary complexity.',
  ],
  commonMistakes: [
    'Defining an incomplete state - forgetting a dimension that two different subproblems actually need to distinguish them (e.g. omitting "remaining capacity" in a knapsack-style problem).',
    'Getting the tabulation fill order wrong, reading a dp[i] value before it has been computed.',
    'Off-by-one errors in the base cases (dp[0], dp[1]) that then propagate through the entire table.',
    'Reaching for DP on a problem with independent (non-overlapping) subproblems, where divide & conquer is simpler and just as fast.',
    'Forgetting to initialize non-reachable states to a sentinel (infinity for minimization, -infinity or 0 for maximization) before taking min/max over them.',
  ],
  edgeCases: [
    'Empty input (n = 0) - base cases must define a sane dp[0] (often 0 or 1, depending on what is being counted).',
    'Target/capacity of 0 - should resolve immediately from the base case, not attempt any recursion or table lookup below index 0.',
    'No valid solution exists (e.g. coin change where the amount cannot be made) - the sentinel (infinity) must be detected and reported, not returned as a real answer.',
    'Very large state space - confirm the DP table actually fits in memory before committing to a 2D/3D approach; sometimes a rolling-array optimization is mandatory, not optional.',
  ],
  interviewTips: [
    'State the four steps out loud in order: "First I\'ll define the state, then the recurrence, then decide top-down or bottom-up, then add memoization."',
    'Start by getting the brute-force recursive solution correct FIRST, then add memoization - trying to write the memoized/tabulated version directly often hides state-definition bugs.',
    'After a correct tabulated solution, proactively mention the space optimization (rolling array) if the recurrence only depends on a bounded window of previous states.',
    'When stuck defining the state, ask: "what is the minimum information needed to describe a subproblem such that its answer doesn\'t depend on how we got there?"',
    'Explicitly identify which classic shape (knapsack, LCS, coin change, interval DP) a new problem resembles - most DP interview questions are a close variant of one of these.',
  ],
  realWorldUseCases: [
    'Bioinformatics - sequence alignment (DNA/protein comparison) is literally the LCS/edit-distance recurrence at scale.',
    'Version control diff tools - the "diff" algorithm computing minimal edits between file versions is edit-distance DP.',
    'Resource allocation and budgeting - knapsack-style optimization under a fixed budget or capacity constraint.',
    'Compiler optimization - optimal instruction scheduling and register allocation use DP-style optimal substructure.',
    'Speech recognition and NLP - dynamic time warping and certain decoding algorithms are DP over sequences.',
  ],
  relatedSlugs: ['common-patterns', 'algorithms', 'arrays-strings'],

  flashcards: [
    { id: 'dp-f1', front: 'What are the four steps of the DP framework?', back: '1) Define the state, 2) write the recurrence, 3) choose the order (top-down or bottom-up), 4) add memoization/tabulation.' },
    { id: 'dp-f2', front: 'Memoization vs tabulation - direction?', back: 'Memoization: top-down, recursive, computed on demand with a cache. Tabulation: bottom-up, iterative, fills a table in an order that guarantees dependencies are ready.' },
    { id: 'dp-f3', front: 'Why does naive recursive Fibonacci take O(2ⁿ)?', back: 'It recomputes the same subproblems repeatedly - fib(8) gets recomputed independently inside both the fib(9) and fib(10) branches, and this compounds exponentially with depth.' },
    { id: 'dp-f4', front: "What signals a problem needs DP rather than divide & conquer?", back: "Overlapping subproblems - the same smaller subproblem is needed by multiple larger ones. If subproblems are independent, it's divide & conquer instead." },
    { id: 'dp-f5', front: '0/1 Knapsack state and recurrence?', back: 'dp[i][w] = best value using first i items with capacity w. dp[i][w] = max(skip item i: dp[i-1][w], take it if it fits: value[i] + dp[i-1][w-weight[i]]).' },
    { id: 'dp-f6', front: 'When can you space-optimize a DP table from O(n) to O(1)?', back: "When dp[i] only depends on a fixed, small window of previous states (e.g. Fibonacci's dp[i-1] and dp[i-2]) - keep only those in rolling variables instead of the full array." },
    { id: 'dp-f7', front: 'LCS recurrence when characters match vs don\'t match?', back: 'Match: dp[i][j] = dp[i-1][j-1] + 1 (extend the diagonal). No match: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (best of dropping a character from either string).' },
  ],

  quiz: [
    {
      id: 'dp-q1',
      type: 'mcq',
      prompt: 'What is the single property that makes a problem solvable with DP (rather than plain divide & conquer)?',
      options: ['It has a recursive structure', 'Its subproblems overlap', 'It involves an array', 'It has a greedy-choice property'],
      answerIndex: 1,
      explanation: 'Both DP and divide & conquer break problems into subproblems. DP specifically pays off when those subproblems overlap and can be cached; if they are independent, memoization adds nothing and D&C is the right frame.',
    },
    {
      id: 'dp-q2',
      type: 'boolean',
      prompt: 'Memoization and tabulation always produce the same asymptotic time complexity for a given DP problem.',
      answer: true,
      explanation: 'Both compute the exact same set of distinct subproblems exactly once - the only difference is the order (recursive/on-demand vs iterative/precomputed), not the total amount of work.',
    },
    {
      id: 'dp-q3',
      type: 'mcq',
      prompt: 'A DP recurrence dp[i] depends only on dp[i-1] and dp[i-2]. What is the minimum extra space needed for a bottom-up solution?',
      options: ['O(n)', 'O(log n)', 'O(1) - two rolling variables', 'O(n²)'],
      answerIndex: 2,
      explanation: 'Since only the last two values are ever needed, the full array can be replaced with two rolling variables, dropping space from O(n) to O(1) while keeping O(n) time.',
    },
    {
      id: 'dp-q4',
      type: 'fill',
      prompt: 'Fill in: the state for the Longest Common Subsequence of strings of length n and m is typically dp[i][j], giving a table of size O(___).',
      answer: 'O(n · m)',
      explanation: 'One dimension per string\'s prefix length - the table has (n+1) × (m+1) entries, giving O(n·m) time and space.',
    },
  ],

  practice: [
    {
      id: 'dp-p1',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'Count the distinct ways to climb n stairs taking 1 or 2 steps at a time - the friendliest introduction to recognizing a Fibonacci-shaped recurrence.',
      constraints: ['O(n) time expected', 'O(1) space achievable'],
      hints: ['ways(n) = ways(n-1) + ways(n-2) - same shape as Fibonacci with different base cases.'],
      pattern: 'DP - 1D Tabulation',
      url: 'https://leetcode.com/problems/climbing-stairs/',
    },
    {
      id: 'dp-p2',
      title: 'Coin Change',
      difficulty: 'Medium',
      description: 'Find the minimum number of coins needed to make a target amount, or -1 if impossible.',
      constraints: ['Unlimited supply of each coin denomination', 'O(amount × coins) expected'],
      hints: ['dp[amount] = min over every coin of 1 + dp[amount - coin]; initialize unreachable amounts to infinity.'],
      pattern: 'DP - Unbounded Knapsack shape',
      url: 'https://leetcode.com/problems/coin-change/',
    },
    {
      id: 'dp-p3',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      description: 'Find the length of the longest subsequence common to two strings - the classic 2D DP table-fill problem.',
      constraints: ['O(n·m) time expected'],
      hints: ['Matching characters extend the diagonal; mismatches take the best of dropping a character from either string.'],
      pattern: 'DP - 2D Table',
      url: 'https://leetcode.com/problems/longest-common-subsequence/',
    },
  ],

  faqs: [
    { question: 'Is DP just "recursion with a cache"?', answer: 'That is exactly what memoization (top-down DP) is, mechanically. But the real skill is upstream of the code: correctly identifying the state and recurrence in the first place. The caching is the easy, almost mechanical last step.' },
    { question: 'How do I know if my DP state definition is correct?', answer: "A good test: can you compute dp[state] using ONLY smaller/earlier states, with no additional information about 'how you got there'? If two different paths to the same nominal state actually need different follow-up decisions, your state is missing a dimension." },
    { question: 'Should I always convert memoization to tabulation?', answer: "Not always - it's a nice-to-have optimization (avoids recursion overhead, enables easier space optimization), not a requirement. In an interview, a correct memoized solution is a complete answer; offer the tabulated/space-optimized version as a follow-up if time allows." },
  ],

  references: [
    { label: 'MIT 6.006 - Dynamic Programming', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' },
    { label: 'USACO Guide - Introduction to DP', url: 'https://usaco.guide/gold/intro-dp' },
  ],
};
