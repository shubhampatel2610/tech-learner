import type { Topic } from '@/types/content.types';

/**
 * TOPIC 14 - BIT MANIPULATION
 * Full deep-dive. Mirrors cheatsheet section 14 (AND/OR/XOR/NOT, left/right
 * shift, check/set/toggle bit) and expands into Brian Kernighan's algorithm,
 * XOR tricks, and bitmask subset enumeration.
 */
export const bitManipulationTopic: Topic = {
  slug: 'bit-manipulation',
  order: 14,
  title: 'Bit Manipulation',
  tagline: 'Working directly in binary - O(1) tricks that replace loops and extra memory.',
  difficulty: 'Intermediate',
  icon: 'pi pi-microchip',
  estMinutes: 40,
  tags: ['XOR', 'Shifts', 'Masks', 'Bitwise'],

  overview:
    "Every integer is already a sequence of bits sitting in a CPU register - bit manipulation is just operating on that representation directly instead of through higher-level abstractions like loops or extra data structures. Because bitwise operations run in a single CPU instruction, they are as fast as an operation can possibly be, and a surprising number of problems that look like they need O(n) space or an extra pass collapse to a handful of O(1) bitwise operations once you spot the pattern.",

  whyItExists:
    "Bit manipulation exists because binary IS how integers are stored - working with individual bits is not a trick layered on top of the data, it's the data's native format. That makes bitwise operations both maximally efficient (single CPU instructions, no branching in many cases) and uniquely suited to problems about presence/absence, toggling, and combining flags - subsets, permissions, visited-sets over a small fixed universe - where a full data structure would be overkill for what is fundamentally a fixed number of yes/no bits.",

  sections: [
    {
      id: 'core-operators',
      heading: 'The six core operators',
      body: `Six operators cover essentially everything:

| Operator | Symbol | Effect |
|---|---|---|
| AND | \`&\` | 1 only where BOTH bits are 1 - used to check/clear bits |
| OR | \`\\|\` | 1 where EITHER bit is 1 - used to set bits |
| XOR | \`^\` | 1 where the bits DIFFER - used to toggle bits, find differences |
| NOT | \`~\` | flips every bit - used to build masks |
| Left shift | \`<< k\` | shifts bits left, filling with 0s - multiplies by 2^k |
| Right shift | \`>> k\` | shifts bits right - divides by 2^k (floor) |

All six run in **O(1)** - a single CPU instruction operating on the full word width at once, not a loop over individual bits. This is the entire reason bit tricks are worth learning: they replace what would otherwise be a loop (O(n) over n bits, or O(n) over n elements) with a single constant-time instruction.`,
      visualizer: 'bit-ops',
    },
    {
      id: 'bit-masks',
      heading: 'Check, set, clear, toggle - the four mask operations',
      body: `A **mask** is a bit pattern with a 1 in the position(s) you want to operate on, and 0 everywhere else - typically built with \`1 << i\` to target bit i.

\`\`\`text
check bit i:   (x >> i) & 1        - shift bit i to position 0, isolate it
set bit i:     x | (1 << i)        - OR forces that bit to 1, leaves others alone
clear bit i:   x & ~(1 << i)       - AND with an inverted mask forces that bit to 0
toggle bit i:  x ^ (1 << i)        - XOR flips exactly that bit, leaves others alone
\`\`\`

The pattern to notice: **OR sets, AND (with a NOT mask) clears, XOR toggles** - each operator's mathematical identity element (OR's 0, AND's 1, XOR's 0) is exactly what makes it "leave other bits alone" while affecting only the masked position. Once these four are automatic, most bit-manipulation problems become mechanical.`,
    },
    {
      id: 'xor-tricks',
      heading: "XOR's special properties",
      body: `XOR has three algebraic properties that make it uniquely useful beyond just "toggle a bit":

- **Self-canceling:** \`x ^ x = 0\` - anything XORed with itself vanishes.
- **Identity:** \`x ^ 0 = x\` - XOR with 0 changes nothing.
- **Commutative and associative:** \`a ^ b ^ c = c ^ a ^ b\` - order doesn't matter, so you can XOR a whole collection in any order.

**These three facts together solve "find the single number"**: given an array where every element appears twice except one, XOR the entire array together. Every paired value cancels itself out (\`x ^ x = 0\`), leaving only the unpaired value (\`answer ^ 0 = answer\`). **O(n) time, O(1) space** - no hash set required, which is the whole appeal.

**The same self-canceling property also swaps two variables without a temp variable:**

\`\`\`text
a = a ^ b
b = a ^ b   # = (a^b)^b = a
a = a ^ b   # = (a^b)^a = b (using the NEW b, which is now the old a)
\`\`\`

(In practice, most languages have cleaner tuple/multiple-assignment swaps - this trick is more a demonstration of XOR's algebra than something you'd actually write in production code.)`,
    },
    {
      id: 'popcount-power-of-two',
      heading: "Brian Kernighan's trick: x & (x-1)",
      body: `**\`x & (x - 1)\` clears the lowest set bit of x.** Why: subtracting 1 flips every bit from the lowest set bit downward (that bit becomes 0, everything below it becomes 1); ANDing with the original x keeps only the bits that were 1 in both - which is everything above the lowest set bit, since the lowest set bit itself just became 0 in \`x - 1\`.

\`\`\`text
x     = 0b01011000
x - 1 = 0b01010111
x & (x-1) = 0b01010000    <- lowest set bit (the 4s place) is gone
\`\`\`

**This gives two classic O(1)-per-bit tricks:**

- **Count set bits (popcount):** repeatedly apply \`x = x & (x-1)\` and count iterations until x is 0. Runs in **O(popcount)** - proportional to the number of 1-bits, not the word width - faster than checking all 32/64 bits individually when the number is sparse.
- **Check power of two:** a power of two has exactly one set bit, so clearing its lowest set bit leaves 0. Thus \`x > 0 and (x & (x - 1)) == 0\` is a one-line, **O(1)** power-of-two test - no loop, no logarithm computation needed.`,
    },
    {
      id: 'bitmask-subsets',
      heading: 'Bitmasks for subset enumeration and state',
      body: `For a set of n items (n small, typically ≤ 20), every subset can be represented as an **n-bit integer**: bit i is 1 if item i is included. There are exactly \`2^n\` possible subsets, matching exactly \`2^n\` possible integer values from 0 to \`2^n - 1\`.

\`\`\`text
for mask in range(1 << n):          # 0 .. 2^n - 1, every subset
    subset = [i for i in range(n) if mask & (1 << i)]
\`\`\`

This turns "enumerate all subsets" from a recursive backtracking problem (see the [[common-patterns]] module) into a flat loop, and - more importantly - it makes the **subset itself usable as a DP state**: \`dp[mask]\` = "best answer using exactly the items marked in mask." This is the backbone of **bitmask DP**, used for problems like the Traveling Salesman Problem on small n, where the state is "which cities have I visited" - a perfect fit for a bitmask, since visiting order doesn't matter but the *set* visited does.

A bitmask is also a compact, O(1)-per-operation **visited set** when the universe of possible items is small and known upfront (e.g. tracking which of 26 letters have appeared) - trading a hash set's overhead for a single integer and bitwise operations.`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'AND / OR / XOR / NOT / shift', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'Single CPU instruction on the whole word.' },
    { operation: 'Check / set / clear / toggle a bit', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'One masked bitwise operation.' },
    { operation: 'Find single non-duplicate via XOR', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'One pass, no hash set needed.' },
    { operation: "Count set bits (Brian Kernighan's)", best: 'O(1)', average: 'O(k)', worst: 'O(k)', space: 'O(1)', note: 'k = number of set bits, not word width. Best = x is already 0.' },
    { operation: 'Check power of two', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'x > 0 and x & (x-1) == 0.' },
    { operation: 'Enumerate all subsets via bitmask', best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)', space: 'O(1)', note: 'n = number of items; matches backtracking subset generation.' },
  ],

  dryRuns: [
    {
      title: "Brian Kernighan's algorithm counting set bits in 44",
      input: 'x = 44 (0b00101100)',
      steps: [
        { label: 'x = 0b00101100', detail: 'x - 1 = 0b00101011. x & (x-1) = 0b00101000. Lowest set bit (4s place) cleared. count = 1.', state: [0, 0, 1, 0, 1, 1, 0, 0], highlight: [4] },
        { label: 'x = 0b00101000', detail: 'x - 1 = 0b00100111. x & (x-1) = 0b00100000. Lowest set bit (8s place) cleared. count = 2.', state: [0, 0, 1, 0, 1, 0, 0, 0], highlight: [3] },
        { label: 'x = 0b00100000', detail: 'x - 1 = 0b00011111. x & (x-1) = 0b00000000. Lowest set bit (32s place) cleared. count = 3.', state: [0, 0, 1, 0, 0, 0, 0, 0], highlight: [2] },
        { label: 'x = 0', detail: 'Loop stops - x is 0.', state: [0, 0, 0, 0, 0, 0, 0, 0] },
      ],
      result: '44 has 3 set bits, found in exactly 3 iterations (one per set bit) - not 8 (the word width), which is what makes this faster than a naive bit-by-bit scan for sparse numbers.',
    },
    {
      title: 'XOR find the single number',
      input: 'nums = [4, 1, 2, 1, 2]',
      steps: [
        { label: 'result = 0', detail: 'Start the running XOR at 0 (the identity element).', state: [0] },
        { label: 'result ^= 4', detail: '0 ^ 4 = 4.', state: [4] },
        { label: 'result ^= 1', detail: '4 ^ 1 = 5.', state: [5] },
        { label: 'result ^= 2', detail: '5 ^ 2 = 7.', state: [7] },
        { label: 'result ^= 1', detail: '7 ^ 1 = 6. (The first 1 has now been canceled by this second 1: 5^1^1 = 5... traced precisely, the two 1s cancel each other across the full sequence.)', state: [6] },
        { label: 'result ^= 2', detail: '6 ^ 2 = 4. The two 2s have also fully canceled - only 4 (the unpaired value) survives.', state: [4] },
      ],
      result: 'result = 4, the single non-duplicate value - found in one O(n) pass with O(1) space, no hash set required.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Check if a number is a power of two',
      problem: 'Determine whether a positive integer is a power of two, in O(1).',
      approach:
        'A power of two has exactly one set bit (1, 2, 4, 8, ... are 0b1, 0b10, 0b100, 0b1000). Clearing its lowest (and only) set bit with x & (x-1) leaves 0. Combined with a positivity check (0 itself is not a power of two), this is a single O(1) expression.',
      complexity: 'O(1) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def is_power_of_two(x):
    return x > 0 and (x & (x - 1)) == 0`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Single Number (XOR)',
      problem: 'Every element in an array appears exactly twice except one - find the one that appears once.',
      approach:
        "XOR every element together. XOR is commutative and associative, so pairs can cancel in any order (x ^ x = 0), and XOR with 0 changes nothing (x ^ 0 = x). After XORing the whole array, only the unpaired element survives. O(n) time, O(1) space - no hash set needed.",
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Counting Bits for every number 0..n (DP + bit trick)',
      problem: 'For every integer from 0 to n, compute its number of set bits, in O(n) total.',
      approach:
        'Each number\'s popcount relates to a smaller number already computed: dp[i] = dp[i & (i-1)] + 1, since i & (i-1) clears the lowest set bit, removing exactly one 1-bit. This combines Brian Kernighan\'s identity with dynamic programming to answer all n queries in O(n) total instead of O(n log n) (popcounting each number independently).',
      complexity: 'O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i & (i - 1)] + 1
    return dp`,
        },
      ],
    },
  ],

  advantages: [
    'Every core operation is O(1) - a single CPU instruction, the fastest an operation can be.',
    "XOR-based and Brian Kernighan's tricks eliminate the need for a hash set or extra O(n) memory in several classic problems.",
    'Bitmasks compactly represent subsets of small, fixed universes (≤ ~20-30 items) as a single integer, powering fast subset enumeration and bitmask DP.',
  ],
  disadvantages: [
    'Bit tricks are notoriously easy to get subtly wrong and hard to read - always worth a comment explaining the intent.',
    'Bitmask subset techniques only scale to roughly n ≤ 20-25 before 2ⁿ becomes too large to enumerate.',
    'Language-specific behavior varies: right-shift on negative numbers (arithmetic vs logical shift), and fixed-width overflow, differ across languages and need care.',
  ],
  commonMistakes: [
    'Confusing which operator sets vs clears vs toggles a bit - OR sets, AND-with-NOT clears, XOR toggles.',
    'Using >> on a negative number expecting a logical shift when the language performs an arithmetic (sign-extending) shift, or vice versa.',
    'Forgetting that x & (x-1) requires x != 0 as a loop-termination check (subtracting 1 from 0 underflows in unsigned contexts).',
    'Applying bitmask subset enumeration to n large enough that 2ⁿ is computationally infeasible (n > ~25).',
    'Writing an unreadable one-liner bit trick with no comment, making the code a maintenance hazard even when correct.',
  ],
  edgeCases: [
    'x = 0 - popcount should return 0 immediately; power-of-two check must explicitly exclude it (0 has zero set bits, not one).',
    'Negative numbers - two\'s-complement representation changes what NOT and right-shift actually produce; be explicit about signedness.',
    'Single-element or empty array for the XOR "find single number" pattern - the empty case has no defined answer and should be guarded.',
    'The maximum representable value for a fixed-width type - left-shifting can silently overflow past it.',
  ],
  interviewTips: [
    'When you see "appears exactly once, everything else appears twice (or three times)," think XOR immediately.',
    'For "count set bits" or "is this a power of two," mention Brian Kernighan\'s x & (x-1) trick by name - it signals deeper bit-manipulation fluency than a naive bit-by-bit loop.',
    'For "enumerate all subsets" with small n, offer bitmask iteration as an alternative to recursive backtracking, and mention bitmask DP if the problem has an optimization angle (state = which items are used).',
    'Narrate WHY a bit trick works (the algebraic identity), not just that it works - interviewers are testing understanding, not memorization.',
    'State the O(1)-per-operation nature of bitwise ops explicitly when they replace something that looks like it needs a loop or extra structure.',
  ],
  realWorldUseCases: [
    'Permission systems / feature flags - each bit represents a boolean flag, combined and checked with bitwise operations.',
    'Compression and encoding - run-length encoding, Huffman codes, and many binary formats operate at the bit level.',
    'Graphics and low-level systems programming - pixel formats, color channels, and hardware registers are manipulated via bitwise operations.',
    'Bloom filters - probabilistic membership testing built entirely from bit arrays and hash functions.',
    'Competitive programming - bitmask DP solves small-n combinatorial optimization problems (TSP-style) that would otherwise be intractable.',
  ],
  relatedSlugs: ['data-structures', 'algorithms', 'dynamic-programming'],

  flashcards: [
    { id: 'bm-f1', front: 'Which operator sets a bit, which clears, which toggles?', back: 'OR (|) sets. AND with a NOT mask (& ~) clears. XOR (^) toggles. All O(1).' },
    { id: 'bm-f2', front: 'What does x & (x - 1) do?', back: "Clears the lowest set bit of x - Brian Kernighan's trick, used for popcount and power-of-two checks." },
    { id: 'bm-f3', front: 'How do you test if x is a power of two, in O(1)?', back: 'x > 0 and (x & (x - 1)) == 0 - a power of two has exactly one set bit, which the trick clears to zero.' },
    { id: 'bm-f4', front: 'Why does XOR-ing an array find the single non-duplicate value?', back: 'x ^ x = 0 (pairs cancel) and x ^ 0 = x (identity) - every duplicated value cancels itself out, leaving only the unpaired one.' },
    { id: 'bm-f5', front: "Complexity of Brian Kernighan's popcount vs a naive bit-by-bit scan?", back: "Kernighan's: O(k), k = number of set bits. Naive: O(word width), e.g. always 32 or 64 checks regardless of how many bits are actually set." },
    { id: 'bm-f6', front: 'How many possible subsets does an n-item set have, and how does a bitmask represent one?', back: '2ⁿ subsets. A bitmask is an n-bit integer where bit i = 1 means item i is included - integers 0 to 2ⁿ-1 enumerate every subset.' },
  ],

  practice: [
    {
      id: 'bm-p1',
      title: 'Single Number',
      difficulty: 'Easy',
      description: 'Find the element that appears once while every other element appears exactly twice - the canonical XOR problem.',
      constraints: ['O(n) time, O(1) space required'],
      hints: ['XOR every element together; duplicates cancel to 0, leaving the answer.'],
      pattern: 'XOR',
      url: 'https://leetcode.com/problems/single-number/',
    },
    {
      id: 'bm-p2',
      title: 'Number of 1 Bits',
      difficulty: 'Easy',
      description: "Count the number of set bits in an integer's binary representation.",
      constraints: ["O(popcount) achievable with Brian Kernighan's trick"],
      hints: ['Repeatedly apply x = x & (x - 1), counting iterations until x reaches 0.'],
      pattern: "Brian Kernighan's Algorithm",
      url: 'https://leetcode.com/problems/number-of-1-bits/',
    },
    {
      id: 'bm-p3',
      title: 'Counting Bits',
      difficulty: 'Easy',
      description: 'Compute the popcount for every integer from 0 to n in a single O(n) pass.',
      constraints: ['O(n) total time expected, not O(n log n)'],
      hints: ['dp[i] = dp[i & (i - 1)] + 1 - reuse the popcount of a smaller, already-computed number.'],
      pattern: 'Bit DP',
      url: 'https://leetcode.com/problems/counting-bits/',
    },
  ],

  faqs: [
    { question: "Do I need to memorize every bit trick?", answer: "No - internalize the six core operators and the four mask operations (check/set/clear/toggle) cold, and understand XOR's cancel-and-identity properties and Brian Kernighan's x & (x-1). Most other 'tricks' are direct applications or compositions of these few ideas." },
    { question: 'Why is left shift equivalent to multiplying by a power of 2?', answer: 'Binary place values double with each position, exactly like decimal place values are powers of 10. Shifting every bit one position left is the same operation as multiplying by the base (2), for the same reason multiplying a decimal number by 10 appends a zero.' },
    { question: 'When should I reach for a bitmask instead of a hash set or boolean array?', answer: 'When the universe of possible items is small and fixed (roughly ≤ 30, so it fits in an integer) - a bitmask gives O(1) membership check/set/clear with none of a hash set\'s overhead, and it can itself be used as a compact DP state.' },
  ],

  references: [
    { label: 'Bit Twiddling Hacks (Stanford)', url: 'https://graphics.stanford.edu/~seander/bithacks.html' },
    { label: 'USACO Guide - Bitmasks', url: 'https://usaco.guide/gold/bitmasks' },
  ],
};
