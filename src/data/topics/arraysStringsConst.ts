import type { Topic } from '@/types/content.types';

/**
 * TOPIC 5 - ARRAYS & STRINGS
 * Full deep-dive. Mirrors cheatsheet section 5 (Traversal, Insertion/Deletion,
 * Prefix Sum, Two Pointers, Kadane's Algorithm) and expands each into a
 * complete learning module, reusing the ArrayOps visualizer from Data
 * Structures for the hands-on traverse/insert/delete/reverse demo.
 */
export const arraysStringsTopic: Topic = {
  slug: 'arrays-strings',
  order: 5,
  title: 'Arrays & Strings',
  tagline: 'The most-used container in programming - and the deepest well of interview tricks.',
  difficulty: 'Beginner',
  icon: 'pi pi-list',
  estMinutes: 45,
  tags: ['Prefix Sum', 'Kadane', 'Two Pointers', 'In-place'],

  overview:
    'Arrays and strings are where most people start learning to code, and where interviewers keep finding new depth. A string is, mechanically, just an array of characters - so every array technique (two pointers, prefix sums, in-place rewriting) applies directly, with the one extra wrinkle that strings are often immutable in high-level languages, which changes the cost model for edits.',

  whyItExists:
    'Contiguous memory is the fastest thing your CPU can read - sequential access hits the cache predictably, so array/string algorithms that look identical in Big-O to a linked structure are often 5-10x faster in wall-clock time. That is why almost every interview funnel starts here: it tests whether you can extract that performance by writing in-place, single-pass solutions instead of reaching for extra data structures out of habit.',

  sections: [
    {
      id: 'traversal-inplace',
      heading: 'Traversal and in-place mutation',
      body: `A single pass (\`for i in range(n)\`) is **O(n)** and the baseline every other technique tries to match or beat. The skill interviewers actually probe is **in-place mutation**: can you transform the array using **O(1)** extra space by overwriting positions you've already read, instead of allocating a new array?

Two building blocks make this possible:

- **Swap-based rewriting** - reverse, rotate, and partition problems all move elements by swapping indices rather than copying to a new array.
- **Write-pointer / read-pointer separation** - a slow pointer marks "the next place to write" while a fast pointer scans ahead; classic for "remove duplicates from a sorted array in place."

Strings complicate this: in Python, Java, and JavaScript, strings are **immutable** - every concatenation creates a new string, silently turning an intended O(n) loop into O(n²). The fix is to build a mutable buffer (a list of characters, or a \`StringBuilder\`/array-join) and convert once at the end.`,
      visualizer: 'array-ops',
    },
    {
      id: 'prefix-sum',
      heading: "Prefix Sum - O(n) preprocessing, O(1) range queries",
      body: `A **prefix sum** array \`P\` stores \`P[i] = sum(arr[0..i])\`. Building it is one **O(n)** pass. Once built, the sum of *any* range \`[l, r]\` is \`P[r] - P[l-1]\` - **O(1)** per query, no matter how many queries you run.

This is the array equivalent of "pay once, query forever." It generalizes beyond sums: prefix XOR, prefix min/max (with a monotonic structure), and prefix counts all follow the same shape, and it is the backbone of the **subarray-sum-equals-k** family of problems when combined with a hash map of prefix-sum frequencies.

\`\`\`text
arr:    [2, 4, 1, 5, 3]
prefix: [2, 6, 7, 12, 15]   (prefix[i] = arr[0] + ... + arr[i])

sum(1..3) = prefix[3] - prefix[0] = 12 - 2 = 10   (4 + 1 + 5 = 10 ✓)
\`\`\``,
    },
    {
      id: 'two-pointers-array',
      heading: 'Two Pointers on arrays and strings',
      body: `Two pointers moving from opposite ends (or one fast, one slow from the same end) replace an **O(n²)** nested scan with a single **O(n)** pass, whenever the array has a property you can exploit - most commonly, being **sorted**.

Common shapes:
- **Converging pointers** (\`left=0, right=n-1\`) - pair-sum on sorted input, palindrome checking, reversing.
- **Same-direction pointers** (\`slow, fast\`) - removing duplicates in place, partitioning around a pivot.

On strings, the converging-pointer form is exactly how you check a palindrome in **O(n) time, O(1) space** without allocating a reversed copy: compare \`s[left] == s[right]\`, move both inward, stop when they cross.`,
    },
    {
      id: 'kadane',
      heading: "Kadane's Algorithm - maximum subarray in O(n)",
      body: `**Kadane's algorithm** finds the maximum-sum contiguous subarray in a single **O(n)** pass, replacing the naive **O(n²)** (or O(n³) without prefix sums) all-subarrays scan.

The insight: at each position, the best subarray *ending here* is either "just this element" or "this element plus the best subarray ending at the previous position" - whichever is larger. If the running sum ever drops below the current element alone, it's better to restart from here; negative history only drags the sum down.

\`\`\`text
maxi = arr[0]
curr = arr[0]
for x in arr[1:]:
    curr = max(x, curr + x)   # restart here, or extend
    maxi = max(maxi, curr)
return maxi
\`\`\`

This is the cheatsheet's boxed template verbatim - it is worth memorizing character-for-character because dozens of problems (max product subarray, max circular subarray, best time to buy/sell stock) are Kadane's with a one-line twist.`,
      visualizer: 'none',
    },
    {
      id: 'string-specifics',
      heading: 'String-specific techniques',
      body: `Beyond "array of characters," strings bring their own toolbox:

- **Frequency maps / anagram checks** - count characters (array of 26 for lowercase-only, or a hash map generally) and compare counts in **O(n)** instead of sorting both strings (**O(n log n)**).
- **Sliding window over characters** - longest substring without repeats, minimum window substring - see [[common-patterns]] for the general template.
- **Palindrome expansion** - for "longest palindromic substring," expand outward from every center (accounting for even and odd length) in **O(n²)** total, which is the standard non-DP approach; Manacher's algorithm exists for **O(n)** but is rarely required.
- **Immutability tax** - repeated \`+=\` concatenation in a loop is **O(n²)** in Python/Java/JS. Always accumulate into a list/array and \`''.join(...)\` (or \`StringBuilder.append\`) once at the end.`,
    },
  ],

  complexity: [
    { operation: 'Traverse (array or string)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'The baseline every technique compares against.' },
    { operation: 'Build prefix sum', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'One-time cost.' },
    { operation: 'Range sum query (with prefix sum)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'Per query, after preprocessing.' },
    { operation: "Kadane's max subarray", best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Single pass, constant extra space.' },
    { operation: 'Two-pointer pair sum (sorted)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Best = found immediately.' },
    { operation: 'Naive string concatenation in a loop', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(n²)', note: 'Each += allocates a new string. Use a buffer instead.' },
    { operation: 'Anagram check (frequency count)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(k)', note: 'k = alphabet size. Beats sort-and-compare O(n log n).' },
  ],

  dryRuns: [
    {
      title: "Kadane's algorithm on a mixed-sign array",
      input: 'arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
      steps: [
        { label: 'i=0', detail: 'curr = -2, maxi = -2 (single-element start).', state: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [0] },
        { label: 'i=1', detail: 'curr = max(1, -2+1) = 1. Restart wins - the run of one negative wasn\'t worth carrying. maxi = 1.', state: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [1] },
        { label: 'i=2', detail: 'curr = max(-3, 1-3) = -2. maxi stays 1.', state: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [2] },
        { label: 'i=3', detail: 'curr = max(4, -2+4) = 4. Restart wins again. maxi = 4.', state: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3] },
        { label: 'i=4..6', detail: 'curr accumulates 4 → 3 → 5 → 6 (extending beats restarting each time). maxi becomes 6.', state: [-2, 1, -3, 4, -1, 2, 1, -5, 4], highlight: [3, 4, 5, 6] },
      ],
      result: 'Maximum subarray is [4, -1, 2, 1], sum = 6 - found in one O(n) pass with O(1) space.',
    },
    {
      title: 'Prefix sum answering a range query',
      input: 'arr = [3, 1, 4, 1, 5], query sum(1, 3)',
      steps: [
        { label: 'build prefix', detail: 'prefix = [3, 4, 8, 9, 14] (running total).', state: [3, 4, 8, 9, 14] },
        { label: 'apply formula', detail: 'sum(1,3) = prefix[3] - prefix[0] = 9 - 3 = 6.', state: [3, 4, 8, 9, 14], highlight: [3, 0] },
        { label: 'verify', detail: 'arr[1] + arr[2] + arr[3] = 1 + 4 + 1 = 6. ✓', state: [3, 1, 4, 1, 5], highlight: [1, 2, 3] },
      ],
      result: 'O(1) per query after an O(n) build - answering 1,000 queries costs O(n + 1000), not O(1000n).',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Two pointers: valid palindrome',
      problem: 'Check whether a string reads the same forward and backward.',
      approach:
        'Converging pointers from both ends compare characters and move inward. No reversed copy is allocated, so it is O(n) time and O(1) space instead of O(n) time and O(n) space for the naive s == s[::-1] approach.',
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Prefix sum + hash map: subarray sum equals K',
      problem: 'Count the number of contiguous subarrays whose sum equals k.',
      approach:
        'Track a running prefix sum and a frequency map of prefix sums seen so far. If (running_sum - k) has been seen before, every one of those occurrences marks the start of a subarray ending here that sums to k. One O(n) pass replaces the O(n²) all-subarrays scan.',
      complexity: 'O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `from collections import defaultdict

def subarray_sum(nums, k):
    count = 0
    running = 0
    seen = defaultdict(int)
    seen[0] = 1  # empty prefix
    for x in nums:
        running += x
        count += seen[running - k]
        seen[running] += 1
    return count`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: "Kadane's variant: maximum product subarray",
      problem: 'Find the contiguous subarray with the largest product (values can be negative).',
      approach:
        'Unlike sum, a negative number can flip a very negative running product into the new maximum. Track both a running max AND a running min at each step (a negative number swaps their roles), and take the overall max seen. Still one O(n) pass.',
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def max_product(nums):
    result = cur_max = cur_min = nums[0]
    for x in nums[1:]:
        candidates = (x, cur_max * x, cur_min * x)
        cur_max, cur_min = max(candidates), min(candidates)
        result = max(result, cur_max)
    return result`,
        },
      ],
    },
  ],

  advantages: [
    'Contiguous memory means sequential access is cache-friendly - fast in practice, not just in theory.',
    'A huge fraction of interview problems reduce to prefix sums, two pointers, or Kadane\'s once you see the shape.',
    'In-place techniques solve problems with zero extra memory - the strongest possible space bound.',
  ],
  disadvantages: [
    'Fixed-size arrays require O(n) resizing when they grow beyond capacity (amortized O(1), but a real cost).',
    'Insert/delete in the middle is O(n) - a shift-heavy workload should consider a different structure.',
    'Strings are immutable in most high-level languages - naive concatenation silently costs O(n²).',
  ],
  commonMistakes: [
    'Concatenating strings in a loop with += instead of collecting into a list and joining once.',
    'Off-by-one errors in prefix-sum range queries (forgetting the l-1 term, or not seeding prefix[0]).',
    'Restarting Kadane\'s running sum at 0 instead of at the current element when all numbers are negative.',
    'Using two pointers on unsorted data where the converging logic depends on sortedness.',
    'Comparing strings with sort-and-compare (O(n log n)) when a frequency-count anagram check (O(n)) is sufficient.',
  ],
  edgeCases: [
    'Empty array/string - every technique should define a sane result for n = 0.',
    'Single element - two pointers start already crossed or coincident.',
    'All-negative array for Kadane\'s - the answer is the single largest (least negative) element, not 0.',
    'Duplicate values clustering at the boundaries during in-place partitioning.',
  ],
  interviewTips: [
    'If the problem says "sorted" and asks for a pair/triplet, reach for two pointers before a hash map.',
    'If it says "contiguous subarray" and a sum/max/min, think prefix sum or Kadane\'s immediately.',
    'State the in-place constraint explicitly and confirm O(1) extra space before coding, if it matters to the interviewer.',
    'For strings, mention the immutability cost model up front - it signals you know the cost of += in a loop.',
    'Dry-run your two-pointer loop invariant on paper for 3 elements before typing; boundary bugs live here.',
  ],
  realWorldUseCases: [
    'Prefix sums power analytics dashboards - "total revenue between two dates" from a running daily total.',
    'Two pointers - merging sorted result sets, diffing sorted logs, deduplication pipelines.',
    "Kadane's algorithm - signal processing (best contiguous window of a time series), financial max-drawdown analysis.",
    'In-place array rewriting - memory-constrained embedded systems, streaming ETL that cannot buffer a full copy.',
  ],
  relatedSlugs: ['data-structures', 'common-patterns', 'linked-list'],

  flashcards: [
    { id: 'as-f1', front: "Kadane's algorithm recurrence?", back: 'curr = max(x, curr + x) at each element; maxi tracks the best curr seen. O(n) time, O(1) space.' },
    { id: 'as-f2', front: 'Prefix sum range query formula?', back: 'sum(l, r) = prefix[r] - prefix[l-1] (with prefix[-1] treated as 0) - O(1) after an O(n) build.' },
    { id: 'as-f3', front: 'Why is string += in a loop dangerous?', back: 'Strings are immutable in Python/Java/JS - each += allocates a new string, turning an intended O(n) loop into O(n²).' },
    { id: 'as-f4', front: 'When do two pointers require sorted input?', back: 'The converging-pointer form (pair sum, etc.) relies on sortedness to decide which side to move. Same-direction slow/fast pointers do not.' },
    { id: 'as-f5', front: 'Fastest way to check two strings are anagrams?', back: 'Frequency count both (O(n)) and compare counts, instead of sorting both (O(n log n)).' },
    { id: 'as-f6', front: 'Palindrome check without allocating a reversed string?', back: 'Two pointers converging from both ends, O(n) time, O(1) space.' },
  ],

  quiz: [
    {
      id: 'as-q1',
      type: 'mcq',
      prompt: "What does Kadane's algorithm do when the running sum becomes negative?",
      options: ['Sets it to 0 and continues', 'Restarts the subarray at the current element', 'Throws an error', 'Reverses the array'],
      answerIndex: 1,
      explanation: 'When curr + x is worse than x alone, the algorithm effectively restarts the subarray at the current element (curr = x), because carrying negative history only hurts.',
    },
    {
      id: 'as-q2',
      type: 'boolean',
      prompt: 'A prefix sum array lets you answer any range-sum query in O(1) after an O(n) build.',
      answer: true,
      explanation: 'sum(l, r) = prefix[r] - prefix[l-1] is a single subtraction regardless of range size.',
    },
    {
      id: 'as-q3',
      type: 'mcq',
      prompt: 'Which is the correct complexity of naively concatenating a string inside a loop that runs n times, in Python?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
      answerIndex: 2,
      explanation: 'Each += creates a new immutable string of growing length, so total work is 1+2+...+n = O(n²).',
    },
    {
      id: 'as-q4',
      type: 'fill',
      prompt: "Fill in: two pointers converging on a sorted array turn an O(n²) pair scan into O(___).",
      answer: 'O(n)',
      explanation: 'Each pointer moves at most n times total across the whole run, giving a single linear pass.',
    },
  ],

  practice: [
    {
      id: 'as-p1',
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      description: "Find the contiguous subarray with the largest sum - the canonical Kadane's algorithm problem.",
      constraints: ['Array has at least one element', 'O(n) expected'],
      hints: ['At each index decide: extend the running subarray, or restart here.'],
      pattern: "Kadane's Algorithm",
      url: 'https://leetcode.com/problems/maximum-subarray/',
    },
    {
      id: 'as-p2',
      title: 'Subarray Sum Equals K',
      difficulty: 'Medium',
      description: 'Count contiguous subarrays summing to a target k - prefix sum plus a hash map of frequencies.',
      constraints: ['Values may be negative', 'O(n) expected'],
      hints: ['Track how many times each prefix sum has occurred; look up running_sum - k.'],
      pattern: 'Prefix Sum',
      url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    },
    {
      id: 'as-p3',
      title: 'Two Sum II - Input Array Is Sorted',
      difficulty: 'Medium',
      description: 'Find two numbers in a sorted array that add up to a target, using O(1) extra space.',
      constraints: ['Input is sorted ascending', 'Exactly one solution', 'O(1) space required'],
      hints: ['Converging two pointers from both ends replace the hash-map approach when the array is sorted.'],
      pattern: 'Two Pointers',
      url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    },
  ],

  faqs: [
    { question: 'Are strings arrays, exactly?', answer: 'Mechanically yes - a string is a sequence of characters, and array techniques (two pointers, sliding window, prefix structures) apply directly. The one real difference is immutability in most languages, which changes the cost of in-place-looking edits.' },
    { question: "Does Kadane's algorithm handle all-negative arrays correctly?", answer: 'Yes, as written with maxi/curr initialized to arr[0] (not 0) - it correctly returns the single largest (least negative) element rather than an incorrect empty-subarray sum of 0.' },
    { question: 'When is prefix sum overkill?', answer: 'If you only need a single range-sum query, a direct O(r-l) loop is simpler and just as fast. Prefix sum pays off once you have multiple queries over a fixed array.' },
  ],

  references: [
    { label: "Kadane's Algorithm - GeeksforGeeks", url: 'https://www.geeksforgeeks.org/dsa/largest-sum-contiguous-subarray/' },
    { label: 'Prefix Sum Technique - USACO Guide', url: 'https://usaco.guide/silver/prefix-sums' },
  ],
};
