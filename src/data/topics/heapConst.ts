import type { Topic } from '@/types/content.types';

/**
 * TOPIC 10 - HEAP
 * Full deep-dive. Mirrors cheatsheet section 10 (Complete Binary Tree,
 * Min-Heap/Max-Heap parent-child rule, insert/extractMin/peek operations
 * and their complexities) - the engine behind every priority queue.
 */
export const heapTopic: Topic = {
  slug: 'heap',
  order: 10,
  title: 'Heap',
  tagline: 'A tree that only promises one thing - and that promise is enough for a priority queue.',
  difficulty: 'Intermediate',
  icon: 'pi pi-sort-amount-up',
  estMinutes: 40,
  tags: ['Priority Queue', 'Heapify', 'Min-Heap', 'Max-Heap'],

  overview:
    'A heap is a complete binary tree with exactly one invariant: every parent is smaller (min-heap) or larger (max-heap) than its children. That is a much weaker guarantee than a BST - siblings are completely unordered - but it is precisely enough to answer one question extremely fast: "what is the smallest (or largest) element right now?" That single capability, repeated efficiently, is what a priority queue is.',

  whyItExists:
    "Fully sorting a collection every time you need the current min/max is O(n log n) per query - wasteful when all you actually need is the extreme value, not the full order. A heap exists to answer 'give me the min/max' in O(1) and 'update after adding/removing the min/max' in O(log n), without ever paying to sort the rest. That's the exact shape of problems like task scheduling by priority, streaming top-k, and Dijkstra's algorithm - which is why heap and priority queue are effectively the same word in practice.",

  sections: [
    {
      id: 'anatomy',
      heading: 'Anatomy: complete binary tree, array-backed',
      body: `A heap is a **complete binary tree** - every level is fully filled except possibly the last, which fills left to right with no gaps. That completeness is what allows a heap to be stored in a plain **array** with no pointers at all:

\`\`\`text
For a node at array index i:
  parent      = (i - 1) // 2
  left child  = 2*i + 1
  right child = 2*i + 2
\`\`\`

**Min-heap invariant:** every parent ≤ both its children. The minimum is always at the root, index 0.
**Max-heap invariant:** every parent ≥ both its children. The maximum is always at the root, index 0.

Note what is **not** guaranteed: siblings can be in any order relative to each other, and the tree is *not* sorted - only the root-to-leaf parent/child relationship is constrained. This is the single most important fact to internalize: a heap is **not** a sorted structure, it is a structure that keeps one specific element (the extreme) trivially accessible while doing minimal work to maintain that.`,
      visualizer: 'heap-ops',
    },
    {
      id: 'insert-siftup',
      heading: 'Insert - append, then sift up',
      body: `Inserting into a heap has two phases:

1. **Append** the new value at the end of the array (the next open slot in the complete tree) - **O(1)**.
2. **Sift up** (a.k.a. "bubble up" or "heapify up"): while the new node is smaller than its parent (min-heap), swap it with its parent and repeat.

Because the tree is complete, its height is **O(log n)**, so sift-up performs at most O(log n) swaps - each comparison eliminates the need to check anything below the swapped nodes. Total insert cost: **O(log n)**.

\`\`\`text
insert(heap, value):
    heap.append(value)
    i = len(heap) - 1
    while i > 0 and heap[i] < heap[parent(i)]:
        swap(heap[i], heap[parent(i)])
        i = parent(i)
\`\`\``,
    },
    {
      id: 'extract-siftdown',
      heading: 'Extract-Min/Max - swap with the last leaf, then sift down',
      body: `Removing the root (the min or max) is the operation that makes a heap useful, and it also takes **O(log n)**:

1. Save the root value (this is the return value).
2. Move the **last element** in the array to the root position, then shrink the array by one.
3. **Sift down** (a.k.a. "bubble down" or "heapify down"): while the node is bigger than either child (min-heap), swap it with its **smaller** child, and repeat.

Why the last element specifically? It's the only removal that preserves completeness for free - removing from anywhere else would leave a hole in the middle of the tree that breaks the array-index math for parent/child.

\`\`\`text
extract_min(heap):
    min_val = heap[0]
    heap[0] = heap.pop()          # move last leaf to root
    i = 0
    while True:
        smallest = smaller_child(heap, i)
        if smallest is None or heap[smallest] >= heap[i]:
            break
        swap(heap[i], heap[smallest])
        i = smallest
    return min_val
\`\`\`

**Peek** (look at the root without removing it) is just \`heap[0]\` - **O(1)**, the whole reason a heap is worth using over, say, a sorted list where peek is also O(1) but insert is O(n).`,
    },
    {
      id: 'build-heapify',
      heading: "Heapify - building a heap from an array in O(n), not O(n log n)",
      body: `You could build a heap by inserting n elements one at a time - O(n log n) total. But there is a faster way: **heapify**, which starts from the *last non-leaf node* and sifts each node down, working backward to the root.

The surprising result: this is **O(n)**, not O(n log n). The intuition is that most nodes in a complete tree are near the bottom, where a sift-down only has to travel a short distance; only the few nodes near the root have O(log n) to travel, and the sum of all these distances across the whole tree works out to a linear total (a result from summing a geometric-like series over tree levels).

\`\`\`text
def heapify(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):   # last non-leaf down to root
        sift_down(arr, i, n)
\`\`\`

This is exactly what **heap sort** uses to build its initial max-heap in O(n) before doing n O(log n) extractions - giving the overall O(n log n) you saw in the [[algorithms]] module.`,
    },
    {
      id: 'priority-queue',
      heading: 'Heap = Priority Queue - and its two biggest use cases',
      body: `A **priority queue** is an abstract interface: insert an item with a priority, and always be able to pop the highest-priority (or lowest-cost) one next. A heap is simply the standard, efficient way to *implement* that interface - most languages' \`PriorityQueue\`/\`heapq\`/\`priority_queue\` are heaps under the hood.

**Two use cases worth memorizing:**

- **Top-K streaming** - maintain a size-k min-heap while scanning n elements; push each new value, and if the heap exceeds size k, pop the smallest. The heap always holds the current k largest values seen so far. **O(n log k)**, far better than sorting everything (O(n log n)) when k ≪ n - see the [[common-patterns]] module.
- **Dijkstra's shortest path** - a min-heap of (distance, node) pairs always pops the currently-closest unvisited node next, which is exactly the greedy step Dijkstra needs. This is why Dijkstra's complexity is O((V+E) log V) - the log V is the heap's insert/extract cost, paid once per edge relaxation. See the [[graphs]] module.`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'Peek min/max', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'Always the root, index 0.' },
    { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)', note: 'Best = new value already satisfies the invariant, no sift needed.' },
    { operation: 'Extract-min/max', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)', note: 'Always requires a sift-down from the root.' },
    { operation: 'Build heap from n elements (heapify)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Bottom-up sift-down beats n individual O(log n) inserts.' },
    { operation: 'Heap sort (build + n extracts)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', note: 'In-place, not stable. See Algorithms module.' },
    { operation: 'Search for an arbitrary value', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'No ordering between siblings - a heap is NOT searchable like a BST.' },
  ],

  dryRuns: [
    {
      title: 'Insert 3 into a min-heap, sifting up',
      input: 'heap = [5, 12, 8, 27, 19], insert 3',
      steps: [
        { label: 'append', detail: 'Place 3 at the end (index 5). heap = [5, 12, 8, 27, 19, 3].', state: [5, 12, 8, 27, 19, 3], highlight: [5] },
        { label: 'compare with parent', detail: 'parent(5) = index 2 (value 8). 3 < 8 -> swap.', state: [5, 12, 3, 27, 19, 8], highlight: [2, 5] },
        { label: 'compare with new parent', detail: 'Now at index 2. parent(2) = index 0 (value 5). 3 < 5 -> swap.', state: [3, 12, 5, 27, 19, 8], highlight: [0, 2] },
        { label: 'reached root', detail: 'Index 0 has no parent - sift-up stops.', state: [3, 12, 5, 27, 19, 8], highlight: [0] },
      ],
      result: '3 became the new root in 2 swaps (O(log n) with n=6) - the new minimum is instantly at index 0.',
    },
    {
      title: 'Extract-min, sifting down',
      input: 'heap = [3, 12, 5, 27, 19, 8]',
      steps: [
        { label: 'save root, pull up last leaf', detail: 'min = 3. Move last element (8) to the root and shrink. heap = [8, 12, 5, 27, 19].', state: [8, 12, 5, 27, 19], highlight: [0] },
        { label: 'compare with children', detail: 'children of index 0: 12 (idx 1), 5 (idx 2). Smaller child is 5. 8 > 5 -> swap.', state: [5, 12, 8, 27, 19], highlight: [0, 2] },
        { label: 'compare with new children', detail: 'Now at index 2, no children (out of range) - sift-down stops.', state: [5, 12, 8, 27, 19], highlight: [2] },
      ],
      result: 'extract-min returned 3; the heap correctly re-settles to [5, 12, 8, 27, 19] with the new minimum (5) at the root.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Kth largest element in a stream',
      problem: 'Design a class that returns the k-th largest element after each new value is added.',
      approach:
        'Maintain a min-heap capped at size k. Every add pushes the value; if the heap grows past k, pop the smallest. The heap always holds exactly the current top-k, and its root (the smallest of those) is the k-th largest overall.',
      complexity: 'O(log k) per add, O(k) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = nums[:]
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Merge k sorted lists',
      problem: 'Merge k sorted linked lists into a single sorted list.',
      approach:
        'Push the head of each of the k lists into a min-heap keyed by value. Repeatedly pop the smallest, append it to the result, and push its successor (if any) from the same list. Each of the n total nodes is pushed and popped once, each costing O(log k).',
      complexity: 'O(n log k) time, O(k) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `import heapq

def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = tail = ListNode()
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Building a heap from an array in O(n)',
      problem: 'Convert an arbitrary array into a valid min-heap in place, faster than n individual inserts.',
      approach:
        'Starting from the last non-leaf node (index n//2 - 1) and working backward to the root, sift each node down. Because most nodes are near the bottom of the tree (short sift-down distance), the total work sums to O(n) rather than O(n log n) - the same trick heap sort uses to build its initial heap.',
      complexity: 'O(n) time, O(1) extra space (in place)',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def heapify_array(arr):
    n = len(arr)

    def sift_down(i):
        while True:
            l, r, smallest = 2 * i + 1, 2 * i + 2, i
            if l < n and arr[l] < arr[smallest]:
                smallest = l
            if r < n and arr[r] < arr[smallest]:
                smallest = r
            if smallest == i:
                return
            arr[i], arr[smallest] = arr[smallest], arr[i]
            i = smallest

    for i in range(n // 2 - 1, -1, -1):
        sift_down(i)
    return arr`,
        },
      ],
    },
  ],

  advantages: [
    'O(1) peek and O(log n) insert/extract for the min/max - the cheapest way to repeatedly access an extreme value.',
    'O(n) build from an existing array (heapify) - cheaper than n individual O(log n) inserts.',
    'Array-backed with no pointers - excellent cache locality compared to a pointer-based tree.',
  ],
  disadvantages: [
    'No ordering between siblings - searching for an arbitrary (non-extreme) value is O(n), unlike a BST.',
    'Not stable and not sorted - do not confuse "heap" with "sorted structure."',
    'Only the min (or max) is cheap to access - retrieving the 2nd, 3rd, ... extreme values requires actual extraction.',
  ],
  commonMistakes: [
    'Assuming a heap is fully sorted - only the root-to-child relationship is guaranteed, siblings are unordered.',
    'Building a heap via n sequential inserts (O(n log n)) when heapify (O(n)) is available and appropriate.',
    'Using a max-heap when a min-heap was needed (or vice versa) for a top-k problem - the direction inverts and trips people up.',
    'Forgetting that most languages\' library heap (Python heapq, Java PriorityQueue) is a MIN-heap by default - max-heap needs negation or a custom comparator.',
    'Trying to search a heap for an arbitrary value in better than O(n) - the structure simply does not support it.',
  ],
  edgeCases: [
    'Empty heap - peek/extract must be guarded.',
    'Single-element heap - insert and extract are both trivial (no sifting needed).',
    'All elements equal - sift-up/down still function correctly with tie-breaking, but verify swap conditions use strict inequalities where the invariant expects them.',
    'Duplicate values across the heap - completely valid; the invariant only compares parent to child, not siblings.',
  ],
  interviewTips: [
    'For "top-k" or "k-th largest/smallest," reach for a heap immediately and state the O(n log k) complexity up front.',
    'Explicitly state which direction you need: min-heap of size k gives the k LARGEST elements (counterintuitive - say it out loud).',
    'Mention heapify (O(n)) if you are building a heap from a full array upfront, instead of inserting one at a time.',
    'Be clear that a heap is not a search structure - if the problem needs "find value X," a heap is the wrong tool.',
    'Connect heaps to Dijkstra and merge-k-lists as the two canonical "priority queue" applications interviewers expect you to know.',
  ],
  realWorldUseCases: [
    "Operating system task schedulers - always run the highest-priority ready process next.",
    "Dijkstra's shortest path and Prim's MST - both greedy algorithms driven by a min-heap frontier.",
    'Event simulation systems - a min-heap of event timestamps always pops the next event to process.',
    'Median-maintenance / streaming statistics - a pair of heaps (max-heap for the lower half, min-heap for the upper half) tracks a running median in O(log n) per insert.',
  ],
  relatedSlugs: ['data-structures', 'trees', 'graphs', 'common-patterns'],

  flashcards: [
    { id: 'h-f1', front: 'What does a heap actually guarantee?', back: 'Only that every parent is ≤ (min-heap) or ≥ (max-heap) its children. Siblings are unordered - a heap is NOT fully sorted.' },
    { id: 'h-f2', front: 'Complexity of insert and extract-min/max?', back: 'Both O(log n) - bounded by the tree height, since a heap is a complete binary tree.' },
    { id: 'h-f3', front: 'Complexity of peek (min/max)?', back: 'O(1) - always at the root, array index 0.' },
    { id: 'h-f4', front: 'Building a heap from n elements - fastest approach and its complexity?', back: 'Heapify: sift down from the last non-leaf node back to the root. O(n), faster than n individual O(log n) inserts (O(n log n)).' },
    { id: 'h-f5', front: 'How do you get an O(1) parent/child lookup with no pointers?', back: 'Store the heap in an array (it\'s a complete binary tree): parent(i) = (i-1)//2, left(i) = 2i+1, right(i) = 2i+2.' },
    { id: 'h-f6', front: 'Min-heap of size k gives you the k LARGEST or k SMALLEST elements?', back: 'The k LARGEST - counterintuitive. The heap\'s root (smallest of the k) gets popped whenever a bigger value arrives, keeping only the top k.' },
    { id: 'h-f7', front: 'Can you search a heap for an arbitrary value in O(log n), like a BST?', back: 'No - a heap has no left-smaller/right-larger ordering, so arbitrary search is O(n), same as an unsorted array.' },
  ],

  quiz: [
    {
      id: 'h-q1',
      type: 'mcq',
      prompt: 'What is the time complexity of extracting the minimum from a min-heap of n elements?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      answerIndex: 1,
      explanation: 'Extract-min moves the last leaf to the root, then sifts it down - bounded by the tree height, O(log n).',
    },
    {
      id: 'h-q2',
      type: 'boolean',
      prompt: 'A min-heap, read left to right at the array level, produces its elements in sorted order.',
      answer: false,
      explanation: 'A heap only guarantees parent ≤ children - siblings and the array\'s linear order are not sorted. Only heap-sort\'s repeated extraction produces sorted output.',
    },
    {
      id: 'h-q3',
      type: 'mcq',
      prompt: 'You need the k largest elements out of a 10-million-element stream, k = 20. Best approach?',
      options: ['Sort everything - O(n log n)', 'Max-heap of size 20 - O(n log 20)', 'Min-heap of size 20 - O(n log 20)', 'Linear scan for a single running max - O(n)'],
      answerIndex: 2,
      explanation: 'A min-heap capped at size 20: push each value, pop the smallest whenever the heap exceeds 20. Its root ends up being the smallest of the top 20 - exactly what you want, in O(n log k).',
    },
    {
      id: 'h-q4',
      type: 'fill',
      prompt: 'Fill in: heapify builds a valid heap from n arbitrary elements in O(___) time, faster than n sequential inserts.',
      answer: 'O(n)',
      explanation: 'Sifting down from the last non-leaf backward to the root sums to linear total work across the whole tree, beating the O(n log n) of n individual inserts.',
    },
  ],

  practice: [
    {
      id: 'h-p1',
      title: 'Kth Largest Element in an Array',
      difficulty: 'Medium',
      description: 'Find the k-th largest element in an unsorted array - the foundational heap-vs-sort tradeoff problem.',
      constraints: ['O(n log k) expected, better than full sort'],
      hints: ['A size-k min-heap\'s root is always the k-th largest once fully populated.'],
      pattern: 'Top K Elements',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    },
    {
      id: 'h-p2',
      title: 'Merge k Sorted Lists',
      difficulty: 'Hard',
      description: 'Merge k sorted linked lists into one sorted list using a min-heap of list heads.',
      constraints: ['O(n log k) expected, n = total nodes'],
      hints: ['Push each list\'s current head into the heap; after popping, push its successor from the same list.'],
      pattern: 'Heap / Priority Queue',
      url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    },
    {
      id: 'h-p3',
      title: 'Find Median from Data Stream',
      difficulty: 'Hard',
      description: 'Support adding numbers one at a time and querying the running median in O(log n) per operation.',
      constraints: ['addNum and findMedian both required', 'O(log n) add, O(1) find'],
      hints: ['Two heaps: a max-heap for the lower half, a min-heap for the upper half, kept balanced in size.'],
      pattern: 'Two Heaps',
      url: 'https://leetcode.com/problems/find-median-from-data-stream/',
    },
  ],

  faqs: [
    { question: 'Is a heap the same thing as a priority queue?', answer: 'A priority queue is the abstract interface (insert with priority, pop the highest priority). A heap is the standard, efficient data structure used to implement that interface - most languages\' priority queue library type is a heap under the hood.' },
    { question: 'Why is a heap stored as an array instead of with actual node pointers?', answer: 'Because it is always a COMPLETE binary tree (no gaps except possibly the last level), parent/child relationships can be computed by index arithmetic alone - no pointers needed, which also gives better cache locality than a pointer-based tree.' },
    { question: 'Can I use a heap to sort data?', answer: 'Yes - heap sort builds a max-heap in O(n) (heapify) then repeatedly extracts the max in O(log n), n times, giving O(n log n) total. It is in-place but not stable. See the Algorithms module.' },
  ],

  references: [
    { label: 'VisuAlgo - Heap / Priority Queue Visualization', url: 'https://visualgo.net/en/heap' },
    { label: 'Python heapq module documentation', url: 'https://docs.python.org/3/library/heapq.html' },
  ],
};
