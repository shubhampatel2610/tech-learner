import type { Topic } from '@/types/content.types';

/**
 * TOPIC 2 - DATA STRUCTURES
 * Full deep-dive. Mirrors cheatsheet section 2 (Linear: Array, Linked List,
 * Stack, Queue, Deque, String; Non-Linear: Tree, Binary Tree, BST, Heap,
 * Graph, Hash Table) and expands each into how/why/when.
 */
export const dataStructuresTopic: Topic = {
  slug: 'data-structures',
  order: 2,
  title: 'Data Structures',
  tagline: 'The containers that decide whether your algorithm is fast or hopeless.',
  difficulty: 'Beginner',
  icon: 'pi pi-database',
  estMinutes: 40,
  tags: ['Linear', 'Non-Linear', 'Trees', 'Graphs', 'Hashing'],

  overview:
    'A data structure is a way of organizing data so that specific operations are cheap. The same 1,000 numbers can be a hash set (O(1) membership), a sorted array (O(log n) search), or a linked list (O(1) insert at head) - and the "right" one depends entirely on what you do most often. Choosing the structure is usually a bigger decision than choosing the algorithm.',

  whyItExists:
    'Every operation you care about - search, insert, delete, get-min, lookup-by-key - has a cost that depends on how the data is laid out in memory. Data structures exist to make the operations you perform most often as cheap as possible, by accepting higher cost on operations you rarely do. There is no universally best structure; there are only good fits for an access pattern.',

  sections: [
    {
      id: 'linear-vs-nonlinear',
      heading: 'Linear vs non-linear (the cheatsheet split)',
      body: `The cheatsheet divides structures into two families, and it is the right first cut:

**Linear** - elements form a single sequence; each has at most one predecessor and one successor.
- Array, Linked List, Stack (LIFO), Queue (FIFO), Deque, String

**Non-linear** - elements form hierarchies or networks; an element can connect to many others.
- Tree, Binary Tree, BST, Heap (min/max), Graph, Hash Table

The distinction matters because linear structures are traversed one way; non-linear ones need traversal *strategies* (DFS, BFS, in/pre/post-order) and often recursion.`,
      visualizer: 'ds-map',
    },
    {
      id: 'array',
      heading: 'Array - contiguous memory, O(1) indexing',
      body: `An array stores elements in a **contiguous** block of memory. Element i lives at \`base + i × size\`, so indexing is a single address calculation → **O(1)**.

**Costs:**
- Access by index: **O(1)**
- Search (unsorted): **O(n)**
- Insert/delete in the middle: **O(n)** - everything after the point must shift.
- Insert/delete at the end (dynamic array): **O(1) amortized** (doubling resize).

**When to use:** you index a lot and mostly append. This is the default container for a reason - cache locality makes arrays fast in practice beyond what Big-O shows.

**When not to:** frequent inserts/deletes in the middle → prefer a linked list or a different structure.`,
      visualizer: 'array-ops',
    },
    {
      id: 'linked-list',
      heading: 'Linked List - O(1) splice, O(n) access',
      body: `A linked list is a chain of nodes, each holding a value and a pointer to the next (singly) or both neighbors (doubly). Nodes live anywhere in memory.

**Costs:**
- Access by index: **O(n)** - you must walk from the head.
- Insert/delete given the node: **O(1)** - just relink pointers, no shifting.
- Search: **O(n)**.

**The tradeoff vs array:** you gain O(1) structural edits but lose O(1) indexing and cache locality. In modern hardware, arrays often win in practice unless you truly need cheap splicing (e.g. LRU cache internals, which pair a doubly linked list with a hash map).`,
    },
    {
      id: 'stack-queue',
      heading: 'Stack & Queue - restricted access, big payoff',
      body: `**Stack (LIFO - Last In, First Out):** \`push\`, \`pop\`, \`peek\`, all **O(1)**. The most recent item comes out first. Powers: function call stacks, undo, expression evaluation, DFS, balanced-bracket checks.

**Queue (FIFO - First In, First Out):** \`enqueue\`, \`dequeue\`, \`front\`, all **O(1)**. Oldest item comes out first. Powers: BFS, task scheduling, buffering, producer/consumer pipelines.

**Deque (double-ended queue):** push/pop at *both* ends in **O(1)**. It generalizes both, and is the engine behind sliding-window-maximum and many two-pointer tricks.

The lesson: **restricting** what you can do (only the ends) is what makes these O(1) and what makes the algorithms built on them clean.`,
    },
    {
      id: 'trees-heaps',
      heading: 'Trees, BST & Heaps - hierarchy with guarantees',
      body: `**Tree:** a hierarchy of nodes with one root; each node has children. A **Binary Tree** limits that to ≤ 2 children.

**Binary Search Tree (BST):** a binary tree with an ordering invariant - everything in the left subtree is smaller, everything right is larger. That invariant gives **O(log n)** search/insert/delete *when balanced*. Unbalanced (e.g. inserting sorted data) it degrades to **O(n)** - a linked list in disguise. Self-balancing variants (AVL, Red-Black) restore the guarantee.

**Heap (min/max):** a complete binary tree where every parent is ≤ (min-heap) or ≥ (max-heap) its children. It does *not* fully sort - it only guarantees the min/max is at the root. That is exactly enough for a **priority queue**: \`peek\` min/max in **O(1)**, \`insert\` and \`extract\` in **O(log n)**.`,
    },
    {
      id: 'graph-hash',
      heading: 'Graph & Hash Table - networks and instant lookup',
      body: `**Graph:** vertices connected by edges. Represented as an **adjacency list** (space O(V + E), good for sparse graphs) or an **adjacency matrix** (space O(V²), O(1) edge check, good for dense graphs). Graphs model everything relational: maps, social networks, dependencies, the web.

**Hash Table:** maps keys to values by running the key through a **hash function** to pick a bucket. Average **O(1)** insert / lookup / delete. Collisions (two keys → same bucket) are resolved by chaining (a list per bucket) or open addressing (probe for the next slot). Worst case degrades to O(n) if hashing is adversarial or poor, but in practice it is the go-to for membership, counting, caching, and de-duplication.`,
    },
  ],

  complexity: [
    { operation: 'Array - index', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Contiguous memory.' },
    { operation: 'Array - insert/delete middle', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Shifting required.' },
    { operation: 'Linked list - access', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Best = head node.' },
    { operation: 'Linked list - insert (known node)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'Pointer relink.' },
    { operation: 'Stack / Queue - push/pop', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Ends only.' },
    { operation: 'BST - search (balanced)', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)', note: 'Worst = degenerate/unbalanced.' },
    { operation: 'Heap - extract min/max', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)', note: 'peek is O(1).' },
    { operation: 'Hash table - lookup', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)', note: 'Worst = all collisions.' },
  ],

  dryRuns: [
    {
      title: 'Inserting into the middle of an array',
      input: 'array = [10, 20, 40, 50], insert 30 at index 2',
      steps: [
        { label: 'Locate index 2', detail: 'Value 40 currently sits there; everything from here must move right.', state: [10, 20, 40, 50], highlight: [2] },
        { label: 'Shift 50 right', detail: 'Copy index 3 → index 4.', state: [10, 20, 40, 50, 50], highlight: [4] },
        { label: 'Shift 40 right', detail: 'Copy index 2 → index 3.', state: [10, 20, 40, 40, 50], highlight: [3] },
        { label: 'Write 30', detail: 'Place the new value at index 2.', state: [10, 20, 30, 40, 50], highlight: [2] },
      ],
      result: '[10, 20, 30, 40, 50] - the shifting is why middle insert is O(n).',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Stack for balanced brackets',
      problem: 'Decide whether a string of ()[]{} is balanced.',
      approach:
        'Push every opening bracket. On a closing bracket, the top of the stack must be its matching opener - otherwise it is unbalanced. A perfectly balanced string leaves the stack empty. LIFO order is exactly the nesting order.',
      complexity: 'O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def is_balanced(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Hash map for frequency counting',
      problem: 'Find the first non-repeating character in a string.',
      approach:
        'One pass builds a count map (O(1) per update). A second pass returns the first char with count 1. Two linear passes → O(n), far better than the O(n²) pairwise scan.',
      complexity: 'O(n) time, O(k) space (k = distinct chars)',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `from collections import Counter

def first_unique(s):
    counts = Counter(s)
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Heap for the k largest elements',
      problem: 'Return the k largest numbers from a stream.',
      approach:
        'Maintain a min-heap of size k. Each new element is pushed; if the heap exceeds k, pop the smallest. The heap always holds the current top-k, and its root is the k-th largest. This is O(n log k) - much better than sorting everything (O(n log n)) when k ≪ n.',
      complexity: 'O(n log k) time, O(k) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `import heapq

def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)   # drop smallest
    return sorted(heap, reverse=True)`,
        },
      ],
    },
  ],

  advantages: [
    'The right structure turns an intractable problem into an easy one.',
    'Each structure makes its "signature" operation O(1) or O(log n).',
    'Composable - real systems combine them (hash map + linked list = LRU cache).',
  ],
  disadvantages: [
    'No structure is best at everything; every choice trades some operations away.',
    'Wrong choice silently makes hot paths O(n) or worse.',
    'Non-linear structures add implementation and balancing complexity.',
  ],
  commonMistakes: [
    'Using a list/array for membership tests (O(n)) when a set gives O(1).',
    'Assuming BST operations are O(log n) without ensuring balance.',
    'Confusing "heap sorted" - a heap only guarantees the root, not full order.',
    'Reaching for a linked list expecting speed; arrays usually win on cache locality.',
  ],
  edgeCases: [
    'Empty structure - pop/dequeue/peek must be guarded.',
    'Single element - head and tail coincide in a linked list.',
    'Hash collisions clustering - a poor hash turns O(1) into O(n).',
    'Degenerate BST from sorted insertion order.',
  ],
  interviewTips: [
    'When asked to speed something up, first ask "what is the dominant operation?" then pick the structure that makes it cheap.',
    'Know the O(1)/O(log n)/O(n) profile of array, list, stack, queue, heap, hash, BST cold.',
    'Mention time/space tradeoffs explicitly (hash = O(n) space for O(1) time).',
    'For "top-k" reach for a heap; for "seen before?" reach for a set; for "order matters" a stack or queue.',
  ],
  realWorldUseCases: [
    'Undo/redo - stack. Print/task queues - queue.',
    'Priority scheduling & Dijkstra - heap (priority queue).',
    'Databases & caches - hash tables and B-trees.',
    'Maps, social graphs, package dependency resolution - graphs.',
  ],
  relatedSlugs: ['complexity', 'algorithms', 'arrays-strings', 'linked-list', 'stack-queue', 'trees', 'graphs', 'heap', 'hash-table'],

  flashcards: [
    { id: 'ds-f1', front: 'Array access vs linked-list access?', back: 'Array: O(1) by index. Linked list: O(n), must walk from head.' },
    { id: 'ds-f2', front: 'Stack order vs queue order?', back: 'Stack = LIFO (last in, first out). Queue = FIFO (first in, first out).' },
    { id: 'ds-f3', front: 'What does a heap guarantee?', back: 'Only that the min (or max) is at the root - O(1) peek, O(log n) insert/extract. It is not fully sorted.' },
    { id: 'ds-f4', front: 'Adjacency list vs matrix?', back: 'List: O(V+E) space, good for sparse. Matrix: O(V²) space, O(1) edge check, good for dense.' },
    { id: 'ds-f5', front: 'When does a hash table degrade to O(n)?', back: 'When many keys collide into the same bucket (bad hash or adversarial input).' },
    { id: 'ds-f6', front: 'When does a BST degrade to O(n)?', back: 'When it becomes unbalanced - e.g. inserting already-sorted data creates a linked list.' },
  ],

  practice: [
    {
      id: 'ds-p1',
      title: 'Implement a stack using queues',
      difficulty: 'Easy',
      description: 'Build a LIFO stack whose only primitives are FIFO queues. Cements how access restrictions compose.',
      constraints: ['Only queue operations allowed', 'Support push, pop, top, empty'],
      hints: ['You can make push O(n) to keep pop O(1), or vice versa.'],
      pattern: 'Stack / Queue',
      url: 'https://leetcode.com/problems/implement-stack-using-queues/',
    },
    {
      id: 'ds-p2',
      title: 'LRU Cache',
      difficulty: 'Medium',
      description: 'Design a cache with O(1) get and put that evicts the least-recently-used key when full.',
      constraints: ['get and put both O(1)', 'Fixed capacity'],
      hints: ['Hash map for lookup + doubly linked list for recency order.'],
      pattern: 'Hash Table + Linked List',
      url: 'https://leetcode.com/problems/lru-cache/',
    },
    {
      id: 'ds-p3',
      title: 'Kth largest in a stream',
      difficulty: 'Medium',
      description: 'Maintain the k-th largest element as numbers arrive one at a time.',
      constraints: ['Support add(val) returning the current k-th largest'],
      hints: ['A size-k min-heap: its root is always the k-th largest.'],
      pattern: 'Heap',
      url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
    },
  ],

  faqs: [
    { question: 'Array or linked list by default?', answer: 'Array. Cache locality and O(1) indexing win in practice unless you specifically need O(1) middle splicing.' },
    { question: 'Is a Python dict a hash table?', answer: 'Yes - dict and set are hash tables with average O(1) operations. Java uses HashMap/HashSet; C++ unordered_map/unordered_set.' },
    { question: 'Stack or queue for DFS?', answer: 'DFS uses a stack (or recursion, which is the call stack). BFS uses a queue.' },
  ],

  references: [
    { label: 'VisuAlgo - Data Structure Visualizations', url: 'https://visualgo.net/en' },
    { label: 'CLRS - Introduction to Algorithms', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/' },
  ],
};
