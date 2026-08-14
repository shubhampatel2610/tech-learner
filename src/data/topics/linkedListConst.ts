import type { Topic } from '@/types/content.types';

/**
 * TOPIC 6 - LINKED LIST
 * Full deep-dive. Mirrors cheatsheet section 6 (Traversal, Insertion/Deletion,
 * Reverse a List, Detect Cycle (Floyd's), Merge Two Lists) with the boxed
 * Floyd's pseudocode expanded into a full module, backed by a dedicated
 * interactive visualizer (traverse / reverse / animated Floyd's).
 */
export const linkedListTopic: Topic = {
  slug: 'linked-list',
  order: 6,
  title: 'Linked List',
  tagline: 'Nodes and pointers - O(1) splicing at the cost of O(n) access.',
  difficulty: 'Intermediate',
  icon: 'pi pi-link',
  estMinutes: 40,
  tags: ["Floyd's", 'Reverse', 'Merge', 'Pointers'],

  overview:
    "A linked list trades an array's O(1) indexing for O(1) structural edits: inserting or deleting a node - once you're holding it - costs nothing but relinking a couple of pointers, no shifting required. That single tradeoff explains almost every linked-list interview question: they exist to test whether you can manipulate pointers correctly without off-by-one or use-after-free style bugs, since there is no index arithmetic to lean on.",

  whyItExists:
    'Arrays require contiguous memory, so growing one or inserting in the middle means shifting every subsequent element - O(n). A linked list scatters nodes anywhere in memory and connects them with pointers, so growth and mid-sequence edits become O(1) relinking operations. The cost is that you lose random access (O(n) to reach index i) and cache locality (each node may be a cache miss). Linked lists exist for exactly the workloads where splicing dominates and indexing does not.',

  sections: [
    {
      id: 'anatomy',
      heading: 'Anatomy: nodes, pointers, singly vs doubly',
      body: `A linked list is a chain of **nodes**, each holding a value and a pointer to the next node. The list itself is just a reference to the **head** (and often a **tail** pointer for O(1) append).

- **Singly linked list** - each node points forward only (\`next\`). Reversing traversal direction is impossible without extra bookkeeping.
- **Doubly linked list** - each node points both forward (\`next\`) and backward (\`prev\`). Costs an extra pointer per node but enables O(1) removal *given only a reference to the node* (no need to find its predecessor), and backward traversal. This is exactly what backs the [[data-structures]] LRU-cache pattern.
- **Circular linked list** - the tail's \`next\` points back to the head instead of null. Useful for round-robin scheduling and buffer rings.

**The sentinel/dummy node trick:** prepending a dummy node before the real head removes almost every "is this the head?" special case from insert/delete code - a small trick that eliminates a large class of bugs.`,
      visualizer: 'linked-list-ops',
    },
    {
      id: 'traversal-splice',
      heading: 'Traversal, insertion, deletion - the pointer-relinking rules',
      body: `**Traversal:** start at \`head\`, follow \`curr = curr.next\` until \`curr\` is \`null\`. **O(n)** time, **O(1)** space - there is no way to skip ahead without an index, unlike an array.

**Insertion given a node reference \`prev\`:**
\`\`\`text
newNode.next = prev.next
prev.next = newNode
\`\`\`
Two pointer writes, **O(1)** - no shifting of any other node, regardless of list length.

**Deletion given \`prev\` (the node before the one to remove):**
\`\`\`text
prev.next = prev.next.next
\`\`\`
One pointer write, **O(1)**. The removed node still technically exists in memory until garbage collected - in a language without GC you'd free it explicitly.

The catch in both cases: **finding** \`prev\` in a singly linked list costs **O(n)** if you only have a value, not a reference. The O(1) claim is specifically about the edit *once positioned* - a subtlety interviewers often probe.`,
    },
    {
      id: 'reverse',
      heading: 'Reversing a list - the three-pointer dance',
      body: `Reversing a singly linked list in place means flipping every \`next\` pointer to point backward, using only **O(1)** extra space (three pointers: \`prev\`, \`curr\`, \`next\`).

\`\`\`text
prev = null
curr = head
while curr:
    nxt = curr.next     # save before we overwrite curr.next
    curr.next = prev     # flip the pointer
    prev = curr           # advance prev
    curr = nxt             # advance curr
return prev   # prev is the new head
\`\`\`

The reason you must save \`nxt\` *before* reassigning \`curr.next\` is the single most common bug in this pattern: overwrite the pointer first, and you lose the rest of the list permanently - there is no way to recover it. **O(n)** time, **O(1)** space, one pass, no recursion required (though a recursive version exists and costs O(n) stack space instead).`,
    },
    {
      id: 'floyds-cycle',
      heading: "Detecting a cycle - Floyd's tortoise and hare",
      body: `**Floyd's cycle detection** uses two pointers moving at different speeds through the list: \`slow\` advances one node per step, \`fast\` advances two.

\`\`\`text
slow = head
fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        return True   # cycle detected
return False
\`\`\`

**Why it works:** if there is no cycle, \`fast\` reaches \`null\` and the loop ends cleanly. If there *is* a cycle, both pointers eventually enter it; because \`fast\` gains one extra step on \`slow\` every iteration, the gap between them shrinks by 1 each time they're both inside the cycle - so they are guaranteed to collide within one lap of the cycle's length. **O(n) time, O(1) space** - the entire reason this beats the "hash set of visited nodes" approach, which also detects cycles but needs **O(n) space**.

A bonus fact worth memorizing: once \`slow\` and \`fast\` meet, resetting one pointer to \`head\` and advancing both one step at a time until they meet again lands exactly on the **start of the cycle** - a direct extension of the same algorithm.`,
      visualizer: 'linked-list-ops',
    },
    {
      id: 'merge-lists',
      heading: 'Merging two sorted lists',
      body: `Merging two sorted linked lists into one sorted list is the linked-list analogue of the merge step in merge sort, and it is a **pure relinking operation** - no new nodes are allocated, existing nodes are just rewired.

Using a dummy head removes the "which list starts first" special case:

\`\`\`text
dummy = Node()
tail = dummy
while l1 and l2:
    if l1.val <= l2.val:
        tail.next = l1; l1 = l1.next
    else:
        tail.next = l2; l2 = l2.next
    tail = tail.next
tail.next = l1 or l2   # attach whichever list has leftovers
return dummy.next
\`\`\`

**O(n + m)** time (each node visited once), **O(1)** extra space beyond the pointers - the output list reuses the input nodes. This exact pattern is also the merge step of **merge sort on a linked list**, which is the preferred sort for linked lists precisely because it needs no random access (unlike quicksort, which wants indexing to pick pivots efficiently).`,
    },
  ],

  complexity: [
    { operation: 'Access by index', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Best = index 0 (head). No random access.' },
    { operation: 'Search by value', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Must walk from head.' },
    { operation: 'Insert/delete at head', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'No shifting, unlike an array.' },
    { operation: 'Insert/delete given node reference', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'Relink pointers only. Finding the node first costs O(n).' },
    { operation: 'Reverse (iterative)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Three-pointer dance, one pass.' },
    { operation: "Detect cycle (Floyd's)", best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'Best = cycle immediately at head.' },
    { operation: 'Merge two sorted lists', best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n + m)', space: 'O(1)', note: 'Rewires existing nodes, no new allocation.' },
  ],

  dryRuns: [
    {
      title: 'Reversing 1 -> 2 -> 3 -> null',
      input: 'head = 1 -> 2 -> 3 -> null',
      steps: [
        { label: 'init', detail: 'prev = null, curr = 1.', state: [1, 2, 3], highlight: [0] },
        { label: 'iter 1', detail: 'nxt = 2. curr.next = null (1 now points to null). prev = 1, curr = 2.', state: [1, 2, 3], highlight: [1] },
        { label: 'iter 2', detail: 'nxt = 3. curr.next = 1 (2 now points back to 1). prev = 2, curr = 3.', state: [1, 2, 3], highlight: [2] },
        { label: 'iter 3', detail: 'nxt = null. curr.next = 2 (3 now points back to 2). prev = 3, curr = null.', state: [1, 2, 3], highlight: [2] },
        { label: 'loop ends', detail: 'curr is null - stop. Return prev (3), the new head.', state: [3, 2, 1] },
      ],
      result: 'New list: 3 -> 2 -> 1 -> null. Same 3 nodes, no new allocation, O(n) time, O(1) space.',
    },
    {
      title: "Floyd's cycle detection meeting point",
      input: '1 -> 2 -> 3 -> 4 -> 5, with 5.next pointing back to 3 (cycle)',
      steps: [
        { label: 'start', detail: 'slow = 1, fast = 1.', state: [1, 2, 3, 4, 5], highlight: [0] },
        { label: 'step 1', detail: 'slow -> 2, fast -> 3.', state: [1, 2, 3, 4, 5], highlight: [1, 2] },
        { label: 'step 2', detail: 'slow -> 3, fast -> 5.', state: [1, 2, 3, 4, 5], highlight: [2, 4] },
        { label: 'step 3', detail: 'slow -> 4, fast -> 4 (fast wrapped: 5 -> 3 -> 4). They meet!', state: [1, 2, 3, 4, 5], highlight: [3] },
      ],
      result: 'slow and fast collide at node 4 - a cycle exists, confirmed in O(n) time and O(1) space, no visited-set required.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Delete a node given only that node (not the head)',
      problem: 'Given a reference to a node in the middle of a singly linked list (not the tail), delete it without access to the head.',
      approach:
        "You cannot relink the predecessor because you don't have it - but you can fake the deletion: copy the next node's value into this node, then skip over the next node. From the outside, it looks identical to having deleted this node. Only works when the node is not the tail.",
      complexity: 'O(1) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def delete_node(node):
    # node is guaranteed not to be the tail
    node.val = node.next.val
    node.next = node.next.next`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: "Reverse a linked list (iterative, three pointers)",
      problem: 'Reverse a singly linked list in place.',
      approach:
        'Walk the list once, flipping each next pointer to point at the previous node. Save next before overwriting, or the rest of the list is lost. Returns the new head (the old tail).',
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
        },
        {
          language: 'java',
          label: 'Java',
          code: `ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: "Find the start of a cycle (Floyd's, extended)",
      problem: 'Given a linked list that may contain a cycle, return the node where the cycle begins, or null.',
      approach:
        'Phase 1: run slow/fast until they meet (or fast hits null - no cycle). Phase 2: reset one pointer to head; advance both one step at a time. The node where they meet the second time is provably the cycle start. This is a direct consequence of the distance math behind Floyd\'s algorithm.',
      complexity: 'O(n) time, O(1) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def detect_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # phase 2: find the entry point
            ptr = head
            while ptr != slow:
                ptr = ptr.next
                slow = slow.next
            return ptr
    return None`,
        },
      ],
    },
  ],

  advantages: [
    'O(1) insertion/deletion once positioned - no shifting, unlike an array.',
    'Grows dynamically without pre-allocating or resizing/copying.',
    "Floyd's algorithm gives O(1)-space cycle detection where a hash set would need O(n).",
  ],
  disadvantages: [
    'O(n) access and search - no random indexing, unlike an array.',
    'Poor cache locality - nodes are scattered in memory, so traversal is slower in practice than Big-O suggests.',
    'Extra memory per node for the pointer(s) (one for singly, two for doubly).',
  ],
  commonMistakes: [
    'Overwriting curr.next before saving it during a reverse - permanently losing the rest of the list.',
    'Forgetting to handle an empty list (head = null) or single-node list as a base case.',
    'Off-by-one when finding the "node before" the target for deletion - walking one step too far.',
    'Assuming O(1) deletion without accounting for the O(n) cost of first finding the predecessor by value.',
    'Not using a dummy/sentinel head, leading to duplicated "is this the head?" branches full of edge-case bugs.',
  ],
  edgeCases: [
    'Empty list (head = null) - traverse, reverse, and merge must all handle this cleanly.',
    'Single-node list - head and tail are the same node; reverse should be a no-op.',
    'Cycle that starts at the head itself (the whole list is one loop).',
    'Merging when one list is empty - the merge should just return the other list untouched.',
  ],
  interviewTips: [
    'Draw the pointers on paper (or narrate them) before coding a reversal - visualizing prev/curr/next prevents the classic "lost the rest of the list" bug.',
    'Default to a dummy/sentinel head for any insert/delete/merge problem - it removes head-special-casing.',
    "Mention the O(n) space hash-set alternative for cycle detection, then explain why Floyd's O(1)-space version is preferred.",
    'State explicitly whether you are asked for a new list or an in-place transformation - it changes the allowed space complexity.',
    'For "kth from the end" style problems, mention the two-pointer gap technique (advance one pointer k steps first) as an O(n), one-pass alternative to counting the length first.',
  ],
  realWorldUseCases: [
    'LRU cache - doubly linked list (recency order) + hash map (O(1) lookup) - see [[data-structures]].',
    'Undo history / browser back-forward navigation - doubly linked list of states.',
    'Music/video playlist "next" and "previous" - literally a linked list of tracks.',
    'Memory allocators - free lists chain unused memory blocks together for O(1) reuse.',
  ],
  relatedSlugs: ['data-structures', 'arrays-strings', 'stack-queue'],

  flashcards: [
    { id: 'll-f1', front: 'Array O(1) op vs Linked List O(1) op?', back: 'Array: O(1) indexed access. Linked list: O(1) insert/delete once positioned at a node. They are opposite strengths.' },
    { id: 'll-f2', front: "Floyd's cycle detection speeds?", back: 'slow moves 1 step, fast moves 2 steps per iteration. If they meet, a cycle exists. O(n) time, O(1) space.' },
    { id: 'll-f3', front: 'The #1 bug when reversing a list?', back: 'Overwriting curr.next before saving it to a temp variable - you lose the rest of the list permanently.' },
    { id: 'll-f4', front: 'What does a dummy/sentinel head eliminate?', back: 'Special-casing "is this operation happening at the head?" in insert/delete/merge code.' },
    { id: 'll-f5', front: 'Doubly vs singly linked list - what do you gain?', back: 'Doubly: O(1) removal given only a node reference (no predecessor needed), and backward traversal - at the cost of an extra pointer per node.' },
    { id: 'll-f6', front: 'Space complexity of merging two sorted lists?', back: 'O(1) extra - nodes are relinked in place, not copied into a new list.' },
  ],

  practice: [
    {
      id: 'll-p1',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Reverse a singly linked list, iteratively or recursively - the foundational pointer-manipulation drill.',
      constraints: ['O(n) time', 'O(1) space for the iterative solution'],
      hints: ['Three pointers: prev, curr, next. Save next before overwriting curr.next.'],
      pattern: 'Pointer Reversal',
      url: 'https://leetcode.com/problems/reverse-linked-list/',
    },
    {
      id: 'll-p2',
      title: 'Linked List Cycle',
      difficulty: 'Easy',
      description: "Detect whether a linked list has a cycle, using O(1) extra space - Floyd's algorithm.",
      constraints: ['O(n) time', 'O(1) space required'],
      hints: ['slow moves 1 step, fast moves 2 - if they ever meet, there is a cycle.'],
      pattern: "Fast & Slow Pointer",
      url: 'https://leetcode.com/problems/linked-list-cycle/',
    },
    {
      id: 'll-p3',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merge two sorted linked lists into one sorted list by relinking nodes, no new allocation.',
      constraints: ['Both inputs sorted ascending', 'O(n + m) time, O(1) extra space'],
      hints: ['Use a dummy head to avoid special-casing which list starts first.'],
      pattern: 'Merge / Two Pointers',
      url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    },
  ],

  faqs: [
    { question: 'Why not just always use an array?', answer: "Arrays win for indexing and cache locality, which is most workloads - that's why they're the default. Linked lists win specifically when you splice (insert/delete) a lot at known positions and rarely need to index by position, e.g. the internals of an LRU cache." },
    { question: "Can Floyd's algorithm find WHERE a cycle starts, not just whether one exists?", answer: 'Yes - after the first meeting point, reset one pointer to head and advance both one step at a time; they meet again exactly at the cycle\'s start node. See the Advanced worked example above.' },
    { question: 'Is a doubly linked list always better than singly?', answer: 'No - it costs an extra pointer per node for a capability (backward traversal, O(1) removal by reference) you may never use. Default to singly unless you specifically need those.' },
  ],

  references: [
    { label: 'VisuAlgo - Linked List Visualization', url: 'https://visualgo.net/en/list' },
    { label: "Floyd's Cycle Detection - CP-Algorithms", url: 'https://cp-algorithms.com/others/tortoise_and_hare.html' },
  ],
};
