import type { Topic } from '@/types/content.types';

/**
 * TOPIC 7 - STACK & QUEUE
 * Full deep-dive. Mirrors cheatsheet section 7 (Stack: push/pop/peek/isEmpty;
 * Queue: enqueue/dequeue/front/isEmpty) and expands into monotonic stacks,
 * deque tricks, and the O(1)-by-restriction principle.
 */
export const stackQueueTopic: Topic = {
  slug: 'stack-queue',
  order: 7,
  title: 'Stack & Queue',
  tagline: 'Two ends, four operations, O(1) each - restriction is the whole trick.',
  difficulty: 'Beginner',
  icon: 'pi pi-database',
  estMinutes: 35,
  tags: ['LIFO', 'FIFO', 'Monotonic', 'Deque'],

  overview:
    'A stack and a queue are the same idea - a sequence you can only touch at its ends - with opposite retrieval rules. A stack gives you the most recently added item first (LIFO); a queue gives you the oldest item first (FIFO). Neither lets you reach into the middle, and that restriction is precisely what makes every one of their operations O(1): there is nothing to shift, search, or rebalance.',

  whyItExists:
    'Plenty of real processes are naturally LIFO (undo history, function calls, backtracking through a maze) or naturally FIFO (task queues, print jobs, breadth-first exploration). Modeling them with a general-purpose array or list works, but a stack/queue interface documents the *intent* and, more importantly, refuses operations that would break the invariant (no accidental "delete from the middle"). That refusal is a feature: it is what keeps every operation at O(1) instead of the O(n) an unrestricted structure would eventually need.',

  sections: [
    {
      id: 'stack-mechanics',
      heading: 'Stack (LIFO) - push, pop, peek',
      body: `A **stack** exposes exactly three real operations, all **O(1)**:

- \`push(x)\` - add x to the top.
- \`pop()\` - remove and return the top element.
- \`peek()\` / \`top()\` - look at the top without removing it.
- \`isEmpty()\` - guard before pop/peek.

**Last In, First Out**: the most recently pushed element is always the first to come out. This single rule powers:

- **Function call stacks** - every language runtime uses a stack for call frames; recursion depth n costs O(n) stack space, which is why deep recursion overflows.
- **Undo/redo** - each action pushes onto an undo stack; undoing pops it.
- **Balanced brackets / expression evaluation** - an opening bracket pushes, a closing bracket must match the top (see the Data Structures module's worked example).
- **DFS** - explicit stack (or the implicit call stack via recursion) explores as deep as possible before backtracking.

Array-backed stacks are the default (push/pop at the end is O(1) amortized); a linked list works too (push/pop at the head).`,
      visualizer: 'stack-queue-ops',
    },
    {
      id: 'queue-mechanics',
      heading: 'Queue (FIFO) - enqueue, dequeue, front',
      body: `A **queue** exposes the mirror-image operations, all **O(1)** *when implemented correctly*:

- \`enqueue(x)\` - add x to the rear.
- \`dequeue()\` - remove and return the element at the front.
- \`front()\` - look at the front without removing it.
- \`isEmpty()\` - guard before dequeue/front.

**First In, First Out**: the oldest element in the queue always comes out first. This powers:

- **BFS** - a queue explores level-by-level, which is exactly what gives BFS its shortest-path guarantee on unweighted graphs.
- **Task/print scheduling** - jobs are handled in arrival order.
- **Buffering / producer-consumer pipelines** - a producer enqueues, a consumer dequeues, decoupling their speeds.

**The array trap:** a naive array-backed queue that dequeues from index 0 is **O(n)** per dequeue (everything shifts left). Real implementations use either a **circular buffer** (wrap-around indices) or a **linked list with head and tail pointers** to keep both ends O(1).`,
    },
    {
      id: 'deque',
      heading: 'Deque - both ends, one structure',
      body: `A **deque** (double-ended queue) generalizes both: \`pushFront\`, \`pushBack\`, \`popFront\`, \`popBack\` are all **O(1)**. A stack is a deque used at one end only; a queue is a deque with pushes at one end and pops at the other.

The deque unlocks a specific, high-leverage technique: the **monotonic deque**, which keeps its contents in increasing or decreasing order by evicting from the *back* before every insert. This is the standard tool for **sliding window maximum/minimum** - maintain a decreasing deque of indices; the front is always the current window's max, and each index enters and leaves the deque at most once, giving **O(n)** total instead of the naive **O(nk)** (recomputing the max for every window of size k).`,
    },
    {
      id: 'monotonic-stack',
      heading: 'Monotonic stack - the "next greater element" trick',
      body: `A **monotonic stack** keeps its elements in strictly increasing (or decreasing) order at all times, by popping elements that violate the order *before* pushing the new one. Every element is pushed once and popped at most once, so the whole scan is **O(n)** even though it looks like it should be O(n²).

This single trick solves an entire family of problems:

- **Next Greater Element** - for each element, find the next element to its right that is larger. Push indices onto a decreasing stack; when the current value beats the stack's top, you've just found that top index's answer.
- **Largest rectangle in a histogram** - a monotonic stack of bar indices finds, for each bar, how far it can extend before hitting a shorter bar on either side.
- **Daily temperatures** - "how many days until a warmer day?" is Next Greater Element wearing a different name.

The pattern to recognize: *"find the next element to the left/right that is greater/smaller"* → monotonic stack, O(n).`,
    },
    {
      id: 'why-o1',
      heading: 'Why restriction buys speed',
      body: `The unifying lesson: **stack and queue are fast precisely because they refuse to do things**. An array lets you insert/delete anywhere, so a naive implementation has to be ready for the worst case (shifting) at any position - O(n). A stack/queue only ever touches an end, so there's *never* anything to shift.

This is a recurring theme across data structures: heaps refuse full ordering (only the root is guaranteed) and get O(log n) instead of O(n log n) sorting; hash tables refuse ordering entirely and get O(1) instead of O(log n) BST lookup. **Narrowing the interface is often how you buy speed** - a lesson worth carrying into system and API design, not just algorithms.`,
    },
  ],

  complexity: [
    { operation: 'Stack push/pop/peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Array-backed: amortized O(1) on resize.' },
    { operation: 'Queue enqueue/dequeue/front (circular buffer or linked list)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Naive array dequeue-from-front is O(n) - avoid it.' },
    { operation: 'Deque push/pop (either end)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)', note: 'Generalizes stack and queue.' },
    { operation: 'Monotonic stack scan (e.g. Next Greater Element)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Each element pushed once, popped at most once.' },
    { operation: 'Sliding window max via monotonic deque', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(k)', note: 'Beats the naive O(nk) recompute-per-window approach.' },
  ],

  dryRuns: [
    {
      title: 'Monotonic stack: next greater element',
      input: 'arr = [2, 1, 2, 4, 3]',
      steps: [
        { label: 'i=0, val=2', detail: 'Stack empty - push index 0. Stack (values): [2].', state: [2, 1, 2, 4, 3], highlight: [0] },
        { label: 'i=1, val=1', detail: '1 < 2 (top) - no violation, push. Stack: [2, 1].', state: [2, 1, 2, 4, 3], highlight: [0, 1] },
        { label: 'i=2, val=2', detail: '2 > 1 (top) - pop index 1, its answer is 2. 2 == 2 (new top) is not strictly greater, so push. Stack: [2, 2].', state: [2, 1, 2, 4, 3], highlight: [1, 2] },
        { label: 'i=3, val=4', detail: '4 > 2 (top) - pop index 2, answer = 4. 4 > 2 again - pop index 0, answer = 4. Stack empty, push. Stack: [4].', state: [2, 1, 2, 4, 3], highlight: [3] },
        { label: 'i=4, val=3', detail: '3 < 4 (top) - push. Stack: [4, 3]. End of array - remaining stack entries have no next greater element (-1).', state: [2, 1, 2, 4, 3], highlight: [3, 4] },
      ],
      result: 'Answers: [4, 2, 4, -1, -1] - found in one O(n) pass; each index pushed once and popped at most once.',
    },
    {
      title: 'Queue-driven BFS distance from a start node',
      input: 'graph: 1-2, 1-3, 2-4, 3-4, start = 1',
      steps: [
        { label: 'init', detail: 'queue = [1], dist = {1: 0}.', state: [1] },
        { label: 'dequeue 1', detail: 'Enqueue unvisited neighbors 2, 3 at dist 1. queue = [2, 3].', state: [2, 3] },
        { label: 'dequeue 2', detail: 'Enqueue unvisited neighbor 4 at dist 2. queue = [3, 4].', state: [3, 4] },
        { label: 'dequeue 3', detail: 'Neighbor 4 already visited - skip. queue = [4].', state: [4] },
        { label: 'dequeue 4', detail: 'No unvisited neighbors. queue = [].', state: [] },
      ],
      result: 'dist = {1:0, 2:1, 3:1, 4:2} - the FIFO order guarantees each node is reached via a shortest path first.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Implement a queue using two stacks',
      problem: 'Build a FIFO queue using only stack primitives (push, pop, peek, isEmpty).',
      approach:
        'Keep an "in" stack for enqueue (always O(1) push) and an "out" stack for dequeue. When "out" is empty, pour all of "in" into it, reversing the order so the oldest element ends up on top. Each element moves between stacks at most once, so dequeue is O(1) amortized.',
      complexity: 'O(1) amortized per operation, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `class QueueViaStacks:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def enqueue(self, x):
        self.in_stack.append(x)

    def dequeue(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack.pop()`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Monotonic stack: daily temperatures',
      problem: 'For each day, find how many days until a warmer temperature.',
      approach:
        'Maintain a decreasing stack of day indices. When the current temperature beats the stack top, pop it and record the day gap as the answer for that popped day. Every index is pushed once and popped once - O(n) total, versus the O(n²) brute force of scanning forward from every day.',
      complexity: 'O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []  # indices, decreasing temps
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Monotonic deque: sliding window maximum',
      problem: 'Return the maximum of every contiguous window of size k as it slides across the array.',
      approach:
        'Keep a deque of indices with strictly decreasing values. Before pushing the current index, pop from the back any indices whose value is ≤ the current value (they can never be the max again). Pop from the front any index that has fallen outside the window. The front of the deque is always the current window\'s max. Each index enters and leaves the deque once - O(n) total, not O(nk).',
      complexity: 'O(n) time, O(k) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()  # indices, decreasing values
    result = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
        },
      ],
    },
  ],

  advantages: [
    'Every real operation is O(1) - the restricted interface guarantees it, no amortization tricks required (for stack).',
    'Directly models common real-world processes (undo, call stacks, task queues) with matching semantics.',
    'The monotonic variants turn a large class of "next greater/smaller" problems from O(n²) into O(n).',
  ],
  disadvantages: [
    'No random access - finding an arbitrary element requires popping/dequeuing everything ahead of it (O(n)).',
    'A naive array-backed queue (shift from index 0) silently becomes O(n) per dequeue - must use a circular buffer or linked list.',
    'A deep stack (recursion or explicit) can overflow available memory - O(n) space is easy to forget about.',
  ],
  commonMistakes: [
    'Implementing a queue by removing from index 0 of a plain array/list - O(n) per dequeue instead of O(1).',
    'Forgetting the isEmpty() guard before pop()/dequeue() on an empty structure.',
    'Using a monotonic stack but forgetting it must be strictly increasing/decreasing - equal elements need a deliberate tie-break rule.',
    'Confusing which end a deque operation touches (front vs back) when porting between an array-based and linked implementation.',
  ],
  edgeCases: [
    'Empty stack/queue - every operation needs a defined behavior (throw, return null/sentinel, or guard with isEmpty first).',
    'Single element - push then immediately pop should return exactly that element.',
    'All elements equal - stresses the strict-vs-non-strict comparison in monotonic stack/deque logic.',
    'Queue capacity exhaustion in a fixed-size circular buffer implementation - must distinguish "full" from "empty" (both can look like front == rear).',
  ],
  interviewTips: [
    'When you see "undo", "matching brackets", "nested", or "most recent" - think stack immediately.',
    'When you see "shortest path (unweighted)", "level by level", or "process in arrival order" - think queue.',
    'When you see "next greater/smaller element to the left/right" - think monotonic stack, and say so before coding.',
    'For sliding window max/min, mention the monotonic deque approach explicitly - many candidates default to a slower heap-based O(n log k) solution.',
    'If asked to implement a queue with O(1) amortized operations using only stacks, the two-stack trick is the expected answer.',
  ],
  realWorldUseCases: [
    'Stack - browser back button history, undo/redo in editors, expression parsers and compilers (operator precedence).',
    'Queue - print spoolers, message brokers (Kafka/RabbitMQ conceptually), CPU task scheduling (ready queue).',
    'Deque - Python\'s collections.deque backs both ends efficiently; used for BFS frontiers and sliding-window algorithms.',
    'Monotonic stack - stock span problems, histogram/skyline problems in computational geometry.',
  ],
  relatedSlugs: ['data-structures', 'linked-list', 'trees', 'common-patterns'],

  flashcards: [
    { id: 'sq-f1', front: 'Stack order vs Queue order?', back: 'Stack = LIFO (last in, first out). Queue = FIFO (first in, first out).' },
    { id: 'sq-f2', front: 'Why is a naive array-based queue dequeue O(n)?', back: 'Removing from index 0 shifts every remaining element left. Fix with a circular buffer or a linked list with head/tail pointers.' },
    { id: 'sq-f3', front: 'What invariant does a monotonic stack maintain?', back: 'Strictly increasing or decreasing values, by popping violators before every push - each element pushed once, popped at most once, so the scan is O(n).' },
    { id: 'sq-f4', front: 'Which structure powers BFS, and which powers DFS?', back: 'BFS uses a queue (level-by-level). DFS uses a stack, or equivalently recursion (the call stack).' },
    { id: 'sq-f5', front: 'How do you get an O(1)-amortized queue from two stacks?', back: 'Push onto an "in" stack. On dequeue, if "out" is empty, pour all of "in" into "out" (reversing order), then pop "out".' },
    { id: 'sq-f6', front: 'What does a monotonic deque give you for sliding-window max?', back: 'O(n) total instead of O(nk): the front of the deque is always the current window\'s max, maintained by evicting smaller values from the back.' },
  ],

  practice: [
    {
      id: 'sq-p1',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Determine whether a string of brackets is validly nested and matched - the canonical stack warm-up.',
      constraints: ['Only ()[]{} characters', 'O(n) expected'],
      hints: ['Push openers; on a closer, the stack top must be its match.'],
      pattern: 'Stack',
      url: 'https://leetcode.com/problems/valid-parentheses/',
    },
    {
      id: 'sq-p2',
      title: 'Daily Temperatures',
      difficulty: 'Medium',
      description: 'For each day, find how many days until a warmer temperature - monotonic stack.',
      constraints: ['O(n) expected, not O(n²)'],
      hints: ['Keep a decreasing stack of indices; pop when the current value beats the top.'],
      pattern: 'Monotonic Stack',
      url: 'https://leetcode.com/problems/daily-temperatures/',
    },
    {
      id: 'sq-p3',
      title: 'Sliding Window Maximum',
      difficulty: 'Hard',
      description: 'Return the max of every window of size k as it slides across the array, in O(n).',
      constraints: ['O(n) time required, not O(nk)'],
      hints: ['A monotonic decreasing deque of indices - front is always the current max.'],
      pattern: 'Monotonic Deque',
      url: 'https://leetcode.com/problems/sliding-window-maximum/',
    },
  ],

  faqs: [
    { question: 'Is Python\'s list a good stack?', answer: 'Yes - append() and pop() at the end are both O(1) amortized, making list a fine stack. For a queue, avoid list.pop(0) (O(n)) and use collections.deque instead, which is O(1) at both ends.' },
    { question: 'What is the difference between a monotonic stack and a regular stack?', answer: 'A regular stack accepts any push. A monotonic stack pops elements that would violate an increasing/decreasing order before accepting a new push - that discipline is what makes "next greater/smaller" queries O(n).' },
    { question: 'Why does BFS need a queue and not a stack?', answer: 'A queue processes nodes in the order they were discovered (FIFO), which visits the graph level-by-level - exactly what guarantees the first time you reach a node is via a shortest path. A stack (DFS) would dive deep first and lose that guarantee.' },
  ],

  references: [
    { label: 'Monotonic Stack - USACO Guide', url: 'https://usaco.guide/gold/stacks' },
    { label: 'Python collections.deque documentation', url: 'https://docs.python.org/3/library/collections.html#collections.deque' },
  ],
};
