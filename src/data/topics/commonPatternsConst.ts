import type { Topic } from '@/types/content.types';

/**
 * TOPIC 4 - COMMON PATTERNS
 * Full deep-dive. Mirrors cheatsheet section 4 (Two Pointers, Sliding Window,
 * Fast & Slow Pointer, Merge Intervals, Cyclic Sort, Top K Elements,
 * Backtracking, Divide & Conquer, Greedy, DP, BFS/DFS) - "Master patterns,
 * solve anything."
 */
export const commonPatternsTopic: Topic = {
  slug: 'common-patterns',
  order: 4,
  title: 'Common Patterns',
  tagline: 'The ~12 templates that solve most interview problems in disguise.',
  difficulty: 'Intermediate',
  icon: 'pi pi-th-large',
  estMinutes: 50,
  tags: ['Two Pointers', 'Sliding Window', 'Backtracking', 'Patterns'],

  overview:
    'Most interview problems are not novel - they are a familiar pattern wearing a new costume. "Find the longest substring without repeats" and "find the smallest window containing all target characters" are both Sliding Window. "Detect a cycle" and "find the middle of a list" are both Fast & Slow Pointer. Once you recognize the pattern behind a problem statement, the solution is a template you adapt, not something you invent from scratch.',

  whyItExists:
    'Learning 12 patterns generalizes far better than memorizing hundreds of individual problems. Patterns exist because a small number of *shapes of computation* - shrink a window, chase two pointers, explore then backtrack, break into subproblems - recur constantly because they map directly onto how arrays, lists, trees, and graphs can be traversed and pruned. The cheatsheet groups them together for exactly this reason: master the pattern-recognition skill, not the problem list.',

  sections: [
    {
      id: 'why-patterns',
      heading: 'Why pattern recognition beats memorization',
      body: `Interviewers rarely test a memorized problem verbatim - they change the surface details (array → string, "duplicate" → "anagram") while the *underlying shape* stays identical. If you memorized one solution, you fail the moment the wording changes. If you learned the pattern, you recognize the shape and adapt in minutes.

The meta-skill is a three-step loop:

1. **Classify** - what shape is this? (contiguous subarray → window; sorted/paired → two pointers; "all combinations" → backtracking; "min/max over choices with overlapping subproblems" → DP.)
2. **Template** - recall the pattern's skeleton (pointers, loop invariant, base/recursive case).
3. **Adapt** - plug in this problem's specific condition (the window's shrink rule, the pointers' move rule, the recursion's branch rule).

The taxonomy below groups the twelve cheatsheet patterns into four families so you can search your memory by *shape* instead of by problem name.`,
      visualizer: 'pattern-map',
    },
    {
      id: 'pointer-family',
      heading: 'Pointer-based: Two Pointers, Fast & Slow, Cyclic Sort',
      body: `**Two Pointers** - one pointer from each end (or both from the start) moving toward/past each other based on a condition. Turns an O(n²) pairwise scan into **O(n)**. Classic uses: pair-sum on a sorted array, reversing in place, partitioning (Dutch national flag).

**Fast & Slow Pointer** (Floyd's tortoise and hare) - two pointers moving through a sequence at different speeds (1 step vs 2 steps). If they ever meet, there's a cycle; the meeting point also locates the cycle start and the list's middle. **O(n) time, O(1) space** - no extra visited-set needed, which is the whole point versus a hash-set approach.

**Cyclic Sort** - when you're given numbers in range [1, n] (or [0, n-1]), you can sort them in **O(n)** by placing each value directly at its "home" index (\`nums[i]\` belongs at index \`nums[i] - 1\`) instead of comparing pairs. This single trick solves most "find the missing/duplicate number in range" problems in O(n) time, O(1) space.`,
    },
    {
      id: 'window-family',
      heading: 'Window / Interval: Sliding Window, Merge Intervals',
      body: `**Sliding Window** - maintain a window \`[left, right]\` over a contiguous run of an array/string, expanding \`right\` and shrinking \`left\` only when a condition is violated. Turns "check every substring" (O(n²) or O(n³)) into **O(n)**, because each pointer moves forward at most n times total. Fixed-size windows (max sum of size k) and variable-size windows (smallest subarray ≥ target) are the two flavors.

**Merge Intervals** - given overlapping ranges, sort by start time then walk once, merging whenever the current interval's start ≤ the previous interval's end. **O(n log n)** (dominated by the sort). Powers calendar/meeting-room problems, and the "insert a new interval" variant is the same merge logic run once at the insertion point.`,
    },
    {
      id: 'traversal-family',
      heading: 'Traversal / Search: BFS/DFS, Backtracking, Top K',
      body: `**BFS / DFS** - the two ways to explore a tree or graph. **BFS** (queue) visits level-by-level - use it for shortest path in an unweighted graph, or "minimum steps" problems. **DFS** (stack or recursion) dives deep before backing up - use it for path existence, connected components, and as the engine inside backtracking. Both are **O(V + E)**.

**Backtracking** - DFS with a twist: explore a choice, recurse, then **undo the choice** ("un-choose") before trying the next one. This is how you generate all combinations, permutations, and subsets, and how you solve constraint problems (N-Queens, Sudoku) by pruning branches that can't work. Complexity is typically exponential (**O(2ⁿ)** or **O(n!)**) because you're enumerating a search space - the win is pruning it aggressively.

**Top K Elements** - maintain a size-k heap while streaming through n elements. **O(n log k)**, which beats sorting everything (O(n log n)) whenever k ≪ n. A min-heap gives the k largest; a max-heap gives the k smallest.`,
    },
    {
      id: 'optimization-family',
      heading: 'Optimization: Greedy, Dynamic Programming, Divide & Conquer',
      body: `**Greedy** - at each step, take the locally-best choice and never look back. Fast (usually **O(n log n)** or better) but only *correct* when the problem has the greedy-choice property (a local optimum provably leads to a global optimum) - e.g. interval scheduling, Huffman coding. Applying greedy where it doesn't hold gives a fast, *wrong* answer, which is worse than being slow.

**Dynamic Programming** - break a problem into overlapping subproblems, solve each **once**, and reuse the result (memoization top-down, or tabulation bottom-up). Turns exponential brute force into **polynomial** time by trading space for time. The signal: "count the ways to..." / "min/max cost to..." combined with choices that overlap (Fibonacci, knapsack, LCS).

**Divide & Conquer** - split the problem into independent subproblems, solve each recursively, combine the results. Different from DP because the subproblems **don't overlap** - no memoization needed. Classic examples: merge sort, quick sort, binary search. Complexity follows the recurrence \`T(n) = a·T(n/b) + f(n)\` (Master Theorem).

The decision rule: subproblems independent → divide & conquer. Subproblems overlap → DP. No subproblems, just informed choices → greedy (if the greedy property holds) or backtracking (if you must explore/undo).`,
    },
  ],

  complexity: [
    { operation: 'Two pointers (sorted array)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Replaces O(n²) pair scan.' },
    { operation: 'Fast & slow pointer', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Best = cycle at head.' },
    { operation: 'Cyclic sort', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Values must be in a known range.' },
    { operation: 'Sliding window', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Each pointer moves forward only.' },
    { operation: 'Merge intervals', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', note: 'Dominated by the sort.' },
    { operation: 'BFS / DFS', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', note: 'Visited set + queue/stack/recursion.' },
    { operation: 'Backtracking (subsets/permutations)', best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(n!)', space: 'O(n)', note: 'Recursion depth n; pruning reduces the constant.' },
    { operation: 'Top K via heap', best: 'O(n log k)', average: 'O(n log k)', worst: 'O(n log k)', space: 'O(k)', note: 'Beats full O(n log n) sort when k ≪ n.' },
    { operation: 'DP (memoized, e.g. 1D knapsack-style)', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(n)', note: 'Cost = states × transitions per state; exact class is problem-dependent, but each subproblem is solved once.' },
  ],

  dryRuns: [
    {
      title: 'Sliding window: smallest subarray with sum ≥ target',
      input: 'arr = [2, 1, 5, 2, 3, 2], target = 7',
      steps: [
        { label: 'right=0..2', detail: 'Expand right while sum < target. sum(2,1,5) = 8 ≥ 7 - window found, size 3.', state: [2, 1, 5, 2, 3, 2], highlight: [0, 1, 2] },
        { label: 'shrink left', detail: 'sum ≥ target, so shrink from left to try to beat size 3. Remove 2 → sum=6 < 7, stop shrinking.', state: [2, 1, 5, 2, 3, 2], highlight: [1, 2] },
        { label: 'right=3', detail: 'Expand right: add 2 → sum=8 ≥ 7. Window [1,5,2] size 3 - no improvement.', state: [2, 1, 5, 2, 3, 2], highlight: [1, 2, 3] },
        { label: 'shrink + expand continues', detail: 'Continue the expand/shrink dance across the array, always tracking the smallest valid window seen.', state: [2, 1, 5, 2, 3, 2], highlight: [3, 4] },
      ],
      result: 'Smallest window is [5, 2] or [3, 2], length 2 - found in one O(n) pass, no re-scanning.',
    },
    {
      title: "Fast & slow pointer: find the middle of a list",
      input: 'list = 1 -> 2 -> 3 -> 4 -> 5 -> null',
      steps: [
        { label: 'start', detail: 'slow = 1, fast = 1.', state: [1, 2, 3, 4, 5], highlight: [0] },
        { label: 'step 1', detail: 'slow moves 1 -> 2. fast moves 1 -> 3.', state: [1, 2, 3, 4, 5], highlight: [1, 2] },
        { label: 'step 2', detail: 'slow moves 2 -> 3. fast moves 3 -> 5.', state: [1, 2, 3, 4, 5], highlight: [2, 4] },
        { label: 'fast hits null', detail: 'fast.next is null after 5 (odd length) - stop. slow is at the middle.', state: [1, 2, 3, 4, 5], highlight: [2] },
      ],
      result: 'slow sits on node 3, the middle - found in a single O(n) pass with O(1) space, no length pre-count needed.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Two pointers: pair sum in a sorted array',
      problem: 'Given a sorted array, find two numbers that sum to target.',
      approach:
        'Start left at 0, right at the end. If the pair sum is too small, move left up (need a bigger number); too big, move right down. Sortedness guarantees this never skips a valid pair. O(n) instead of the O(n²) brute-force pair scan.',
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def pair_sum(a, target):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target:
            return [lo, hi]
        if s < target:
            lo += 1
        else:
            hi -= 1
    return [-1, -1]`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Sliding window: longest substring without repeating characters',
      problem: 'Find the length of the longest substring with no repeated characters.',
      approach:
        'Expand right, tracking the last-seen index of each character. If the incoming character was seen inside the current window, jump left past its previous occurrence instead of shrinking one step at a time. Track the max window size seen. Each character is visited a bounded number of times → O(n).',
      complexity: 'O(n) time, O(min(n, charset)) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def longest_unique(s):
    last_seen = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Backtracking: generate all subsets',
      problem: 'Return all possible subsets of a set of distinct integers.',
      approach:
        'At each index, branch into two choices: include nums[i] or skip it. Recurse to the next index; after the recursive call returns, undo the choice ("un-choose") before trying the other branch. This is the canonical backtracking skeleton: choose -> explore -> un-choose. 2 choices per element → O(2ⁿ) subsets.',
      complexity: 'O(2ⁿ) time, O(n) recursion space (excluding output)',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def subsets(nums):
    result = []
    path = []

    def backtrack(i):
        if i == len(nums):
            result.append(path[:])
            return
        # choice 1: skip nums[i]
        backtrack(i + 1)
        # choice 2: include nums[i]
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()  # un-choose

    backtrack(0)
    return result`,
        },
      ],
    },
  ],

  advantages: [
    'Turns "I have never seen this exact problem" into "I recognize this shape" - massive interview leverage.',
    'Each pattern collapses a brute-force complexity class down by one or more tiers (O(n²) → O(n), O(n³) → O(n log n)).',
    'Patterns compose - a graph problem might use BFS *and* a top-k heap *and* a greedy tie-break.',
  ],
  disadvantages: [
    'Misclassifying a problem leads you to force the wrong template and get stuck.',
    'Greedy is a trap when the greedy-choice property doesn\'t actually hold - it produces a fast, wrong answer.',
    'Backtracking without pruning degenerates into brute force with extra bookkeeping overhead.',
  ],
  commonMistakes: [
    'Reaching for DP when subproblems don\'t actually overlap (that\'s divide & conquer - memoizing wastes space for nothing).',
    'Forgetting to shrink the sliding window, turning it into an accidental O(n²) nested scan.',
    'Applying cyclic sort to values outside the assumed [1, n] range.',
    'Backtracking without an explicit "un-choose" step, corrupting shared state across branches.',
    'Using greedy on a problem that requires globally comparing alternatives (e.g. 0/1 knapsack, which needs DP).',
  ],
  edgeCases: [
    'Empty input - most patterns should short-circuit to a trivial answer (empty window, empty subset, no path).',
    'All elements identical - stresses two-pointer and window boundary logic.',
    'Single-node / single-element structures for fast & slow pointer (fast starts already at null/end).',
    'Fully overlapping or fully disjoint intervals - both are edge cases for merge intervals.',
  ],
  interviewTips: [
    'State your classification out loud first: "this is a sliding window problem because we want a contiguous run."',
    'For window problems, be explicit about the shrink condition before coding - it is where bugs live.',
    'For backtracking, narrate choose → explore → un-choose; interviewers listen for that structure.',
    'When you reach for greedy, briefly justify the greedy-choice property, or say "I need to verify this - if not, DP is the fallback."',
    'Explain the top-k heap direction: min-heap of size k for "k largest", max-heap of size k for "k smallest" (it inverts, which trips people up).',
  ],
  realWorldUseCases: [
    'Sliding window - network rate limiting, TCP congestion windows, streaming analytics over time windows.',
    'Merge intervals - calendar/meeting-room scheduling, resource booking systems.',
    'BFS - shortest-path routing, social-network "degrees of separation".',
    'Backtracking - constraint solvers, puzzle generators, dependency-resolution with rollback.',
    'Greedy - Huffman compression, interval scheduling in OS task planning.',
  ],
  relatedSlugs: ['algorithms', 'data-structures', 'arrays-strings', 'trees', 'graphs'],

  flashcards: [
    { id: 'p-f1', front: 'When do you reach for Sliding Window?', back: 'Contiguous subarray/substring problems asking for a max/min/count satisfying a condition - turns O(n²)/O(n³) into O(n).' },
    { id: 'p-f2', front: 'Fast & Slow pointer catches what, in O(1) space?', back: 'Cycles in a linked structure - if the pointers meet, there is a cycle. Beats a hash-set visited approach on space.' },
    { id: 'p-f3', front: 'DP vs Divide & Conquer - what is the difference?', back: 'DP: subproblems overlap, so you memoize. D&C: subproblems are independent, no memoization needed (e.g. merge sort).' },
    { id: 'p-f4', front: 'The backtracking skeleton in three words?', back: 'Choose, explore, un-choose - always undo the choice before trying the next branch.' },
    { id: 'p-f5', front: 'Top-k largest elements - min-heap or max-heap, and why?', back: 'A size-k min-heap: its root is the smallest of the current top-k, so popping it when the heap overflows keeps the k largest.' },
    { id: 'p-f6', front: 'What must be true for greedy to be correct?', back: 'The greedy-choice property: a locally optimal choice must lead to a globally optimal solution (provably, not just "usually").' },
    { id: 'p-f7', front: 'Merge Intervals - what is the first step, always?', back: 'Sort by start time. Without sorting, the single linear merge pass does not work.' },
  ],

  practice: [
    {
      id: 'p-p1',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      description: 'Classic sliding window: find the length of the longest run of unique characters.',
      constraints: ['ASCII string', 'O(n) expected'],
      hints: ['Track last-seen index per character; jump left past a repeat instead of stepping one at a time.'],
      pattern: 'Sliding Window',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    },
    {
      id: 'p-p2',
      title: 'Merge Intervals',
      difficulty: 'Medium',
      description: 'Merge all overlapping intervals in a collection.',
      constraints: ['Sort first', 'O(n log n) expected'],
      hints: ['Sort by start; merge into the last result interval whenever start ≤ previous end.'],
      pattern: 'Merge Intervals',
      url: 'https://leetcode.com/problems/merge-intervals/',
    },
    {
      id: 'p-p3',
      title: 'Subsets',
      difficulty: 'Medium',
      description: 'Generate all possible subsets of a set of distinct integers - the backtracking warm-up problem.',
      constraints: ['No duplicates in input', 'Return all 2ⁿ subsets'],
      hints: ['Choose/skip each element at each recursion level; un-choose before the sibling branch.'],
      pattern: 'Backtracking',
      url: 'https://leetcode.com/problems/subsets/',
    },
  ],

  faqs: [
    { question: 'How many "core" patterns should I actually know?', answer: 'The cheatsheet\'s twelve cover the large majority of interview problems: Two Pointers, Sliding Window, Fast & Slow Pointer, Merge Intervals, Cyclic Sort, Top K Elements, Backtracking, Divide & Conquer, Greedy, DP, and BFS/DFS. Most "new" problems are a remix of two or three of these.' },
    { question: 'How do I tell Sliding Window and Two Pointers apart?', answer: 'They overlap conceptually. Sliding Window specifically maintains a *contiguous range* with a size/condition that grows and shrinks. Two Pointers is broader - it also covers pointers converging from opposite ends of a sorted array, which is not a "window" at all.' },
    { question: 'Is Backtracking just DFS?', answer: 'Backtracking is DFS with explicit state mutation and undo. Plain DFS just visits; backtracking builds up a partial solution, recurses, and rolls the state back on the way out so the next branch starts clean.' },
  ],

  references: [
    { label: 'Grokking the Coding Interview - Patterns Overview', url: 'https://www.designgurus.io/course/grokking-the-coding-interview' },
    { label: 'NeetCode - Patterns Roadmap', url: 'https://neetcode.io/roadmap' },
  ],
};
