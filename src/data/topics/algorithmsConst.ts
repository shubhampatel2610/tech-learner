import type { Topic } from '@/types/content.types';

/**
 * TOPIC 3 - ALGORITHMS
 * Full deep-dive. Mirrors cheatsheet section 3 (Sorting: Bubble, Selection,
 * Insertion, Merge, Quick, Heap, Counting, Radix; Searching: Linear, Binary)
 * with complexities, dry runs, and interview framing.
 */
export const algorithmsTopic: Topic = {
  slug: 'algorithms',
  order: 3,
  title: 'Sorting & Searching Algorithms',
  tagline: 'The workhorses: ordering data and finding it fast.',
  difficulty: 'Intermediate',
  icon: 'pi pi-sort-alt',
  estMinutes: 45,
  tags: ['Sorting', 'Searching', 'Divide & Conquer', 'Binary Search'],

  overview:
    'Sorting and searching are the two most-used algorithm families in existence. Sorting arranges data so that other operations - searching, deduplication, grouping, median-finding - become dramatically cheaper. Searching locates an element; done well (binary search), it turns an O(n) scan into O(log n). Mastering the eight sorts and two searches on the cheatsheet gives you a template for almost every algorithmic pattern.',

  whyItExists:
    'Ordered data unlocks logarithmic access. Once data is sorted you can binary-search it, find duplicates in a single pass, and answer range queries fast. That is why sorting is often the first move in solving a harder problem: it is an O(n log n) investment that makes later steps trivial. Searching exists because scanning everything (O(n)) is wasteful when structure - sorted order or a hash - lets you skip most of the work.',

  sections: [
    {
      id: 'sorting-families',
      heading: 'The two families of sorts',
      body: `The eight sorts on the cheatsheet fall into two groups:

**Comparison sorts** - decide order by comparing pairs. Bounded below by **O(n log n)** (you cannot beat it with comparisons alone).
- *Simple, O(n²):* Bubble, Selection, Insertion - easy to code, fine for tiny/nearly-sorted inputs.
- *Efficient, O(n log n):* Merge, Quick, Heap - the ones you actually ship.

**Non-comparison sorts** - exploit the *values* themselves (as integers/keys), breaking the O(n log n) barrier.
- Counting: **O(n + k)** for k = value range.
- Radix: **O(nk)** for k = number of digits/passes.

Rule of thumb: use your language's built-in sort (a tuned merge/quick hybrid). Reach for counting/radix only when keys are small bounded integers.`,
      visualizer: 'algo-map',
    },
    {
      id: 'simple-sorts',
      heading: 'Bubble, Selection, Insertion - the O(n²) trio',
      body: `**Bubble sort:** repeatedly swap adjacent out-of-order pairs; the largest "bubbles" to the end each pass. O(n²), but O(n) best case on already-sorted input with an early-exit flag. Mostly pedagogical.

**Selection sort:** each pass selects the minimum of the unsorted region and swaps it into place. Always O(n²) - even on sorted input - but it makes the *fewest swaps* (n−1), which matters when writes are expensive.

**Insertion sort:** grow a sorted prefix, inserting each new element into its correct spot. O(n²) worst, but **O(n) on nearly-sorted data** and excellent for small arrays - which is why real sort implementations switch to it for small subarrays.

All three are **in-place** (O(1) space). Insertion is the only one of the three you will see inside production sorts.`,
    },
    {
      id: 'merge-sort',
      heading: 'Merge sort - the reliable O(n log n)',
      body: `Merge sort is **divide and conquer**: split the array in half, recursively sort each half, then merge the two sorted halves in linear time.

- **Time:** O(n log n) in *all* cases (best = average = worst). log n levels × O(n) merge work per level.
- **Space:** O(n) - it needs a temporary buffer to merge.
- **Stable:** equal elements keep their relative order.

It is the safe default when you need a *guaranteed* O(n log n) with stability (e.g. sorting objects by a secondary key). Its predictability is why it backs many standard-library sorts (Timsort is merge-based).`,
    },
    {
      id: 'quick-sort',
      heading: 'Quick sort - fast in practice, O(n²) worst',
      body: `Quick sort picks a **pivot**, partitions elements into "< pivot" and "> pivot", then recurses on each side.

- **Average:** O(n log n) and typically the fastest comparison sort in practice (great cache behavior, in-place partition).
- **Worst:** O(n²) - when pivots are consistently bad (e.g. already-sorted input with naive first-element pivot). Randomized or median-of-three pivots make this vanishingly unlikely.
- **Space:** O(log n) for the recursion stack; in-place partitioning otherwise.
- **Not stable** by default.

The interview takeaway: quicksort's *average* speed beats mergesort in practice, but mergesort's *worst-case guarantee* and stability win when predictability matters.`,
    },
    {
      id: 'heap-counting-radix',
      heading: 'Heap, Counting & Radix',
      body: `**Heap sort:** build a max-heap, then repeatedly extract the max to the end. **O(n log n)** guaranteed, **O(1)** extra space, not stable. It trades quicksort's speed for a hard worst-case bound with no extra memory.

**Counting sort:** for integers in a small range [0, k], count occurrences and rebuild. **O(n + k)** time, **O(k)** space. Stable and blazing fast when k is small - but useless when values are large or unbounded.

**Radix sort:** sort by each digit (or byte) from least to most significant, using a stable counting sort per pass. **O(nk)** for k passes. Shines on fixed-width integer/string keys.

These break the O(n log n) barrier precisely because they *don't* compare elements - they use the keys' structure directly.`,
    },
    {
      id: 'searching',
      heading: 'Searching - linear vs binary',
      body: `**Linear search:** check each element until found. **O(n)**, works on *any* data, sorted or not. It is the only option on unsorted data without extra structure.

**Binary search:** on **sorted** data, repeatedly halve the search space by comparing to the middle. **O(log n)** - 20 steps searches a million elements, 30 steps a billion.

The mechanics that trip people up:
- Use \`mid = lo + (hi - lo) // 2\` to avoid integer overflow.
- Be deliberate about \`lo <= hi\` vs \`lo < hi\` and whether \`hi\` is inclusive.
- Binary search generalizes far beyond arrays: any *monotonic* predicate ("is this feasible?") can be binary-searched - "binary search on the answer".

Binary search is the highest-leverage O(log n) tool in the toolkit; master its boundary conditions.`,
    },
  ],

  complexity: [
    { operation: 'Bubble sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', note: 'Best with early-exit on sorted input. Stable.' },
    { operation: 'Selection sort', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', note: 'Fewest swaps. Not stable.' },
    { operation: 'Insertion sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', note: 'Great on nearly-sorted / small. Stable.' },
    { operation: 'Merge sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', note: 'Guaranteed & stable.' },
    { operation: 'Quick sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', note: 'Fastest in practice; randomize pivot.' },
    { operation: 'Heap sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', note: 'In-place, not stable.' },
    { operation: 'Counting sort', best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)', note: 'Small integer range only.' },
    { operation: 'Radix sort', best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)', note: 'k = digit passes.' },
    { operation: 'Linear search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Any data.' },
    { operation: 'Binary search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)', note: 'Sorted data required.' },
  ],

  dryRuns: [
    {
      title: 'Binary search for 23 in a sorted array',
      input: '[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23',
      steps: [
        { label: 'lo=0, hi=9, mid=4', detail: 'arr[4]=16 < 23 → search right half, lo = mid + 1 = 5.', state: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], highlight: [4] },
        { label: 'lo=5, hi=9, mid=7', detail: 'arr[7]=56 > 23 → search left half, hi = mid - 1 = 6.', state: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], highlight: [7] },
        { label: 'lo=5, hi=6, mid=5', detail: 'arr[5]=23 = target → found at index 5.', state: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], highlight: [5] },
      ],
      result: 'Found at index 5 in 3 steps (log₂10 ≈ 3.3). A linear scan would take 6.',
    },
    {
      title: 'One pass of bubble sort',
      input: '[5, 1, 4, 2]',
      steps: [
        { label: 'Compare (5,1)', detail: '5 > 1 → swap.', state: [1, 5, 4, 2], highlight: [0, 1] },
        { label: 'Compare (5,4)', detail: '5 > 4 → swap.', state: [1, 4, 5, 2], highlight: [1, 2] },
        { label: 'Compare (5,2)', detail: '5 > 2 → swap. Largest has bubbled to the end.', state: [1, 4, 2, 5], highlight: [2, 3] },
      ],
      result: 'After pass 1: [1, 4, 2, 5]. The max (5) is now in place; repeat on the prefix.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Iterative binary search',
      problem: 'Return the index of target in a sorted array, or -1.',
      approach:
        'Maintain a [lo, hi] window. Compare target to the midpoint and discard half the window each step. Overflow-safe midpoint. O(log n).',
      complexity: 'O(log n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
        },
        {
          language: 'java',
          label: 'Java',
          code: `int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Merge sort',
      problem: 'Sort an array with a guaranteed O(n log n).',
      approach:
        'Recursively split to single elements (already sorted), then merge sorted halves by repeatedly taking the smaller front element. Stable and predictable.',
      complexity: 'O(n log n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    return merge(left, right)

def merge(l, r):
    out, i, j = [], 0, 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]:
            out.append(l[i]); i += 1
        else:
            out.append(r[j]); j += 1
    out.extend(l[i:]); out.extend(r[j:])
    return out`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Binary search on the answer',
      problem: 'Find the minimum eating speed so all bananas are eaten within h hours (Koko).',
      approach:
        'Speed is monotonic: if speed s works, every s′ > s works too. Binary-search the smallest feasible speed over the value range [1, max(pile)] using a feasibility check. This is the "binary search beyond arrays" pattern interviewers love.',
      complexity: 'O(n log m) time (m = max pile size)',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `import math

def min_eating_speed(piles, h):
    def hours(speed):
        return sum(math.ceil(p / speed) for p in piles)
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid          # feasible, try slower
        else:
            lo = mid + 1      # too slow, speed up
    return lo`,
        },
      ],
    },
  ],

  advantages: [
    'Sorting is a one-time O(n log n) that makes search, dedup, and grouping cheap.',
    'Binary search collapses O(n) lookups to O(log n).',
    'Non-comparison sorts beat O(n log n) for small integer keys.',
  ],
  disadvantages: [
    'Comparison sorts cannot beat O(n log n) - a hard theoretical floor.',
    'Quicksort has an O(n²) worst case if pivots are chosen naively.',
    'Binary search requires sorted data - sorting first may cost more than a linear scan for a single query.',
  ],
  commonMistakes: [
    'Off-by-one errors in binary search boundaries (lo/hi inclusive vs exclusive).',
    'Computing mid as (lo + hi) / 2 and overflowing on large indices.',
    'Assuming quicksort is always O(n log n) - it is not; randomize the pivot.',
    'Using counting/radix sort when the value range is huge (space blows up).',
    'Forgetting merge sort needs O(n) auxiliary space.',
  ],
  edgeCases: [
    'Empty array or single element - sorts and searches must handle n ≤ 1.',
    'Duplicate keys - stability matters when sorting by a secondary field.',
    'Target smaller than all / larger than all - binary search must return -1 cleanly.',
    'Already-sorted or reverse-sorted input - best/worst cases for several sorts.',
  ],
  interviewTips: [
    'Default to the library sort; mention it is an O(n log n) hybrid (Timsort/introsort).',
    'When you see "sorted array", think binary search before anything else.',
    'Recognize "minimize/maximize a value subject to a feasibility check" as binary-search-on-the-answer.',
    'Know which sorts are stable (bubble, insertion, merge, counting) and which are not (selection, quick, heap).',
    'State the recurrence for merge sort - T(n) = 2T(n/2) + O(n) - if asked to prove O(n log n).',
  ],
  realWorldUseCases: [
    'Database query planners sort to enable merge-joins and range scans.',
    'Search engines binary-search sorted posting lists.',
    'Timsort (merge+insertion hybrid) is Python and Java\'s default sort.',
    'Radix/counting sort powers fast integer sorting in graphics and networking.',
  ],
  relatedSlugs: ['complexity', 'data-structures', 'common-patterns', 'dynamic-programming', 'bit-manipulation'],

  flashcards: [
    { id: 'a-f1', front: 'Lower bound for comparison sorts?', back: 'Ω(n log n) - no comparison-based sort can do better in the worst case.' },
    { id: 'a-f2', front: 'Merge sort time in all cases?', back: 'O(n log n) best = average = worst. O(n) extra space, stable.' },
    { id: 'a-f3', front: 'Quick sort worst case and why?', back: 'O(n²) when pivots are consistently the min/max (e.g. sorted input, naive pivot). Fix: randomize the pivot.' },
    { id: 'a-f4', front: 'When can you binary search?', back: 'When the data is sorted, or more generally when a predicate is monotonic over the search space.' },
    { id: 'a-f5', front: 'Overflow-safe midpoint formula?', back: 'mid = lo + (hi - lo) // 2 (avoids lo + hi overflow).' },
    { id: 'a-f6', front: 'Which common sorts are stable?', back: 'Bubble, insertion, merge, counting. Selection, quick, and heap are not (by default).' },
    { id: 'a-f7', front: 'Counting sort complexity and limit?', back: 'O(n + k) time/space, k = value range. Only viable for small bounded integer keys.' },
  ],

  quiz: [
    {
      id: 'a-q1',
      type: 'mcq',
      prompt: 'Which sort guarantees O(n log n) in the worst case AND uses O(1) extra space?',
      options: ['Merge sort', 'Quick sort', 'Heap sort', 'Counting sort'],
      answerIndex: 2,
      explanation: 'Heap sort is O(n log n) worst-case and in-place (O(1)). Merge needs O(n); quick has an O(n²) worst case.',
    },
    {
      id: 'a-q2',
      type: 'boolean',
      prompt: 'Binary search can be applied to an unsorted array if you only search once.',
      answer: false,
      explanation: 'Binary search requires order. On unsorted data it may miss the target entirely.',
    },
    {
      id: 'a-q3',
      type: 'mcq',
      prompt: 'You must sort objects and preserve the order of equal keys. Which do you avoid?',
      options: ['Merge sort', 'Insertion sort', 'Selection sort', 'Counting sort'],
      answerIndex: 2,
      explanation: 'Selection sort is not stable - it can reorder equal elements. Merge, insertion, and counting are stable.',
    },
    {
      id: 'a-q4',
      type: 'fill',
      prompt: 'Binary search on a sorted array of ~1,000,000 elements takes about how many comparisons? (nearest power-of-two exponent)',
      answer: '20',
      explanation: 'log₂(1,000,000) ≈ 20. Each step halves the space.',
    },
  ],

  practice: [
    {
      id: 'a-p1',
      title: 'Binary Search',
      difficulty: 'Easy',
      description: 'Return the index of target in a sorted array, or -1. The canonical boundary-condition drill.',
      constraints: ['Sorted ascending, distinct integers', 'O(log n) required'],
      hints: ['Overflow-safe midpoint; be explicit about inclusive/exclusive hi.'],
      pattern: 'Binary Search',
      url: 'https://leetcode.com/problems/binary-search/',
    },
    {
      id: 'a-p2',
      title: 'Sort Colors (Dutch national flag)',
      difficulty: 'Medium',
      description: 'Sort an array of 0s, 1s, and 2s in a single pass, in place - a counting-sort-flavored three-way partition.',
      constraints: ['One pass, O(1) space'],
      hints: ['Three pointers: low, mid, high.'],
      pattern: 'Partition / Counting',
      url: 'https://leetcode.com/problems/sort-colors/',
    },
    {
      id: 'a-p3',
      title: 'Koko Eating Bananas',
      difficulty: 'Medium',
      description: 'Find the minimum integer speed to finish within h hours - binary search on the answer.',
      constraints: ['Feasibility check is monotonic in speed'],
      hints: ['Binary-search speed in [1, max(pile)]; check hours(speed) ≤ h.'],
      pattern: 'Binary Search on Answer',
      url: 'https://leetcode.com/problems/koko-eating-bananas/',
    },
  ],

  faqs: [
    { question: 'Quick sort or merge sort in production?', answer: 'Standard libraries use hybrids (Timsort = merge+insertion; introsort = quick+heap+insertion) to get quicksort\'s speed with a guaranteed worst case. Rarely implement your own.' },
    { question: 'How is O(n log n) beatable by counting/radix?', answer: 'They do not compare elements - they use the key values directly, which sidesteps the comparison lower bound. The catch is they only work for bounded integer-like keys.' },
    { question: 'What makes a sort "stable" and why care?', answer: 'Stable sorts keep equal elements in their original relative order. It matters when sorting by multiple keys in sequence (sort by secondary, then stable-sort by primary).' },
  ],

  references: [
    { label: 'Sorting Algorithm Visualizations', url: 'https://www.toptal.com/developers/sorting-algorithms' },
    { label: 'Binary Search - Errichto guide', url: 'https://codeforces.com/blog/entry/9901' },
  ],
};
