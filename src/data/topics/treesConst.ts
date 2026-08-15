import type { Topic } from '@/types/content.types';

/**
 * TOPIC 8 - TREES
 * Full deep-dive. Mirrors cheatsheet section 8 (Traversals: Inorder,
 * Preorder, Postorder, Level Order; Height/Depth; Diameter; Check BST; LCA)
 * over the same 7-node tree the visualizer animates.
 */
export const treesTopic: Topic = {
  slug: 'trees',
  order: 8,
  title: 'Trees',
  tagline: 'Hierarchy with an order - traversals, invariants, and the questions built on top.',
  difficulty: 'Intermediate',
  icon: 'pi pi-sitemap',
  estMinutes: 55,
  tags: ['Traversal', 'BST', 'LCA', 'Recursion'],

  overview:
    'A tree is a hierarchy: one root, and every other node reachable by exactly one path down from it. A binary tree caps each node at two children, which is restrictive enough to give you clean recursive structure - and that recursive structure is why nearly every tree algorithm is a few lines of "handle this node, recurse on the children, combine the results."',

  whyItExists:
    'Linear structures (arrays, lists) model sequences well but hierarchies (file systems, org charts, decision paths, parse trees) poorly. Trees exist to model "one thing has many children, each of which has its own children" directly. Binary Search Trees add an ordering invariant on top, turning that hierarchy into a searchable structure with O(log n) operations - when balanced - bridging the gap between an unsorted list (O(n) search) and a sorted array (O(log n) search but O(n) insert).',

  sections: [
    {
      id: 'anatomy-traversals',
      heading: 'Anatomy and the four traversal orders',
      body: `A tree node holds a value and pointers to its children (\`left\`, \`right\` for a binary tree). There is exactly one path from the root to any node - no cycles, unlike a general graph.

**The three depth-first orders** differ only in *when* you visit the current node relative to its children:

- **Preorder (NLR)** - visit Node, then Left, then Right. Use to *copy* a tree (you need the parent before its children) or serialize it.
- **Inorder (LNR)** - visit Left, then Node, then Right. On a **BST**, this visits nodes in **sorted order** - the single most important fact about inorder traversal.
- **Postorder (LRN)** - visit Left, then Right, then Node. Use to *delete/free* a tree (children must go before their parent) or evaluate an expression tree.

**Level Order (BFS)** is the odd one out - it is not depth-first at all. Using a queue, it visits every node at depth 0, then depth 1, then depth 2, matching how you'd read the tree if you drew it level by level. It is the tool for "shortest path from root" or "print the tree row by row" problems.

All four traversals are **O(n) time** (visit every node once) and **O(h) space** for the recursion/queue, where h is the tree's height (O(log n) balanced, O(n) degenerate).`,
      visualizer: 'tree-ops',
    },
    {
      id: 'height-diameter',
      heading: 'Height, depth, and diameter',
      body: `**Height of a node** - the number of edges on the longest path from that node down to a leaf. A single leaf has height 0 (by the common convention); an empty tree has height -1.

**Depth of a node** - the number of edges from the root down to that node. Root has depth 0.

Both are computed with the same recursive shape: \`height(node) = 1 + max(height(node.left), height(node.right))\`, base case \`height(null) = -1\`. **O(n) time** (visit every node once), **O(h) space** for the call stack.

**Diameter** - the length (in edges) of the *longest path between any two nodes*, which may or may not pass through the root. The key insight: at every node, the longest path *through* that node is \`1 + height(left) + height(right)\`. Computing height bottom-up and tracking the best "path through this node" value at each step gives the diameter in a **single O(n) pass** - a naive approach that recomputes height at every node is O(n²).`,
    },
    {
      id: 'bst',
      heading: 'Binary Search Tree - the ordering invariant',
      body: `A **BST** adds one rule on top of a binary tree: for every node, everything in its **left subtree is smaller**, everything in its **right subtree is larger**. That invariant is what makes search/insert/delete **O(h)** - at each node you eliminate an entire subtree by comparing once, the same logic as binary search.

**Validating a BST** is a classic trap: checking only "is left.val < node.val < right.val" locally is **not sufficient** - a node deep in the left subtree could still violate the ancestor's bound even though it satisfies its immediate parent. The correct approach passes a valid **(min, max) range** down through the recursion, tightening it at every step.

**Balance matters.** \`height(node) = 1 + max(...)\` gives O(h) operations, but h is only **O(log n)** if the tree is *balanced* - roughly equal-sized left/right subtrees at every node. Insert already-sorted data into a naive BST and it degenerates into a linked list: **O(n) height, O(n) operations**. Self-balancing variants (AVL, Red-Black trees) rebalance after every insert/delete to guarantee O(log n) no matter the insertion order - this is exactly what backs \`TreeMap\`/\`std::map\`/balanced-BST-based ordered sets in most standard libraries.`,
    },
    {
      id: 'lca',
      heading: 'Lowest Common Ancestor (LCA)',
      body: `The **LCA** of two nodes p and q is the deepest node that has both p and q as descendants (a node can be its own descendant).

**General binary tree** (no ordering to exploit): recurse from the root. If the current node is p or q, return it. Recurse left and right; if *both* sides return a non-null result, the current node is the LCA (p and q are in different subtrees, meeting here). If only one side is non-null, propagate it up. **O(n)** time - every node may need to be visited once.

**BST** (ordering *can* be exploited): compare both values to the current node. If both are smaller, go left; if both are larger, go right; the moment they diverge (or one equals the current node), you've found the LCA. **O(h)** time - far better than the general O(n), because the BST invariant lets you discard a whole subtree at each step, exactly like a search.

Interviewers often ask the general-tree version first, then add "what if it's a BST?" specifically to see whether you notice the ordering can be exploited to drop from O(n) to O(h).`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'Traversal (any of the 4 orders)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', note: 'h = tree height; O(log n) balanced, O(n) degenerate.' },
    { operation: 'Height / depth computation', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', note: 'Every node visited once, bottom-up.' },
    { operation: 'Diameter (single-pass)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', note: 'Naive recompute-height-at-every-node approach is O(n²).' },
    { operation: 'BST search / insert / delete', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)', note: 'Worst = degenerate/unbalanced (sorted-order insertion).' },
    { operation: 'Self-balancing BST (AVL / Red-Black) search/insert', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(log n)', note: 'Rebalances on every edit to guarantee height.' },
    { operation: 'LCA - general binary tree', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(h)', note: 'May need to visit every node.' },
    { operation: 'LCA - BST', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)', note: 'Exploits ordering to skip subtrees.' },
  ],

  dryRuns: [
    {
      title: 'Inorder traversal proving sorted output on a BST',
      input: 'BST rooted at 4, left subtree {2: left 1, right 3}, right subtree {6: left 5, right 7}',
      steps: [
        { label: 'go left from 4', detail: 'Recurse into left subtree (2) before visiting 4 itself.', state: [4, 2, 1, 3, 6, 5, 7], highlight: [1] },
        { label: 'go left from 2', detail: 'Recurse into left subtree (1) before visiting 2.', state: [4, 2, 1, 3, 6, 5, 7], highlight: [2] },
        { label: 'visit 1', detail: '1 has no children - visit it. Output so far: [1].', state: [4, 2, 1, 3, 6, 5, 7], highlight: [2] },
        { label: 'visit 2, then 3', detail: 'Back at 2: visit it (output: [1,2]), then recurse right into 3 (output: [1,2,3]).', state: [4, 2, 1, 3, 6, 5, 7], highlight: [1, 3] },
        { label: 'visit 4, then mirror on the right', detail: 'Visit 4 (output: [1,2,3,4]), then repeat the same left-node-right pattern on the right subtree (5,6,7).', state: [4, 2, 1, 3, 6, 5, 7], highlight: [0] },
      ],
      result: 'Full inorder output: [1, 2, 3, 4, 5, 6, 7] - strictly sorted, because inorder + BST invariant always produces ascending order.',
    },
    {
      title: 'Computing diameter in one bottom-up pass',
      input: 'Tree rooted at 1, left child 2 (with children 4 and 5), right child 3 (leaf)',
      steps: [
        { label: 'leaves 4, 5, 3', detail: 'height(4) = 0, height(5) = 0, height(3) = 0. No path-through candidates yet (need two children).', state: [4, 5, 3] },
        { label: 'node 2', detail: 'height(2) = 1 + max(0, 0) = 1. Path through 2 = 1 + height(4) + height(5) = 1 + 0 + 0 = 2 edges. Best diameter so far: 2.', state: [2], highlight: [0] },
        { label: 'node 1', detail: 'height(1) = 1 + max(height(2), height(3)) = 1 + max(1, 0) = 2. Path through 1 = 1 + height(2) + height(3) = 1 + 1 + 0 = 2 edges. Best diameter stays 2.', state: [1], highlight: [0] },
      ],
      result: 'Diameter = 2 edges (path 4-2-5), found alongside height computation in a single O(n) pass - no recomputation.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Maximum depth of a binary tree',
      problem: 'Return the number of nodes along the longest path from root to a leaf.',
      approach:
        'A one-line recursive definition: the depth of a tree is 1 + the deeper of its two subtrees\' depths, with an empty tree having depth 0. Every node is visited exactly once.',
      complexity: 'O(n) time, O(h) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Validate a Binary Search Tree',
      problem: 'Determine whether a binary tree satisfies the BST invariant everywhere, not just locally.',
      approach:
        'Pass a valid (low, high) range down through the recursion. A node must fall strictly within its inherited range; when recursing left, tighten high to the node\'s value, and when recursing right, tighten low. Checking only the immediate parent-child relationship is a classic bug - it misses violations from a grandparent or higher ancestor.',
      complexity: 'O(n) time, O(h) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def is_valid_bst(root, low=float('-inf'), high=float('inf')):
    if not root:
        return True
    if not (low < root.val < high):
        return False
    return (is_valid_bst(root.left, low, root.val) and
            is_valid_bst(root.right, root.val, high))`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Lowest Common Ancestor - general binary tree',
      problem: 'Find the LCA of two nodes p and q in a binary tree with no ordering guarantee.',
      approach:
        'Recurse from the root. If the current node is p, q, or null, return it directly. Otherwise recurse into both children. If both recursive calls return non-null, p and q were found in different subtrees - the current node is their LCA. If only one side is non-null, that side\'s result is the answer so far and gets propagated up unchanged.',
      complexity: 'O(n) time, O(h) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def lowest_common_ancestor(root, p, q):
    if root is None or root == p or root == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root          # p and q split here - this IS the LCA
    return left if left else right  # propagate the found side up`,
        },
      ],
    },
  ],

  advantages: [
    'Recursive structure gives clean, short algorithms - most tree problems are "handle node, recurse, combine."',
    'A BST bridges O(n) unsorted-list search and O(log n) sorted-array search while still allowing O(log n) insert/delete.',
    'Traversal order is a lever: pick preorder/inorder/postorder/level-order to match exactly what the problem needs.',
  ],
  disadvantages: [
    'An unbalanced BST degrades to a linked list - O(n) height, O(n) operations, silently.',
    'Recursion depth equals tree height - a degenerate (linked-list-shaped) tree can stack-overflow.',
    'Self-balancing trees (AVL, Red-Black) add real implementation complexity to guarantee O(log n).',
  ],
  commonMistakes: [
    'Validating a BST by checking only the immediate parent-child relationship instead of a propagated (min, max) range.',
    'Recomputing height from scratch at every node when computing diameter, turning an O(n) algorithm into O(n²).',
    'Forgetting the empty-tree base case (return 0 or -1 depending on convention) in height/depth recursion.',
    'Using the general-tree LCA algorithm on a BST when the ordering-exploiting O(h) version is available and expected.',
    'Assuming a binary tree with "left < node < right" locally everywhere is automatically a valid BST - it is not, without the range check.',
  ],
  edgeCases: [
    'Empty tree (root = null) - height, diameter, and traversals must all define a sane result.',
    'Single-node tree - height 0, diameter 0, every traversal returns just that node.',
    'Completely skewed tree (every node has only a left or only a right child) - the O(n) worst case for BST operations.',
    'Duplicate values in a BST - decide and document whether duplicates go left, right, or are disallowed.',
  ],
  interviewTips: [
    'State which traversal you need and why before coding - "inorder, because I need sorted order from this BST."',
    'For height/depth/diameter problems, default to bottom-up (post-order) recursion that returns information upward - it is almost always O(n) instead of O(n²).',
    'When validating a BST, say out loud that a local check is insufficient and that you need a propagated valid range.',
    'For LCA, ask (or state the assumption) whether the tree is a BST - it changes the optimal approach from O(n) to O(h).',
    'Mention the O(h) space cost of recursion for any tree algorithm - interviewers listen for whether you account for the call stack.',
  ],
  realWorldUseCases: [
    'File systems - directories and files form a tree; traversal walks it exactly like a DFS/BFS tree traversal.',
    'Database indexes - B-trees and B+ trees (wide, shallow BST relatives) back most relational database indexes.',
    'Balanced BSTs - std::map/std::set (C++), TreeMap/TreeSet (Java) are Red-Black trees under the hood.',
    'Parse trees / ASTs - compilers represent source code as a tree and traverse it to generate code or evaluate expressions.',
    'Autocomplete / routing tables - tries (a tree specialization) power prefix search.',
  ],
  relatedSlugs: ['data-structures', 'stack-queue', 'graphs', 'common-patterns'],

  flashcards: [
    { id: 't-f1', front: 'Which traversal visits a BST in sorted order?', back: 'Inorder (Left, Node, Right) - the BST invariant guarantees ascending output.' },
    { id: 't-f2', front: 'Preorder vs Postorder - one-line use case for each?', back: 'Preorder: copy/serialize a tree (parent before children). Postorder: delete/free a tree or evaluate an expression tree (children before parent).' },
    { id: 't-f3', front: 'Why is checking only local parent-child order insufficient to validate a BST?', back: 'A node can satisfy its immediate parent but still violate a higher ancestor\'s bound. You must propagate a valid (min, max) range down the recursion.' },
    { id: 't-f4', front: 'Diameter of a tree - naive vs optimal complexity?', back: 'Naive (recompute height at every node): O(n²). Optimal (compute height and track best path-through-node in one bottom-up pass): O(n).' },
    { id: 't-f5', front: 'LCA on a general binary tree vs a BST - complexity?', back: 'General tree: O(n) (may need to visit every node). BST: O(h) - ordering lets you discard a subtree at each step, just like search.' },
    { id: 't-f6', front: 'What makes a BST degrade to O(n) operations?', back: 'Losing balance - e.g. inserting already-sorted data creates a tree that is really a linked list in disguise, with height O(n) instead of O(log n).' },
    { id: 't-f7', front: 'Space complexity of any recursive tree traversal?', back: 'O(h), the tree\'s height - that is how deep the call stack goes. O(log n) balanced, O(n) degenerate.' },
  ],

  practice: [
    {
      id: 't-p1',
      title: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      description: 'Return the length of the longest root-to-leaf path - the foundational recursive tree warm-up.',
      constraints: ['O(n) time expected'],
      hints: ['depth(node) = 1 + max(depth(left), depth(right)); depth(null) = 0.'],
      pattern: 'Tree Recursion',
      url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    },
    {
      id: 't-p2',
      title: 'Validate Binary Search Tree',
      difficulty: 'Medium',
      description: 'Determine whether a binary tree is a valid BST, correctly handling ancestor bounds - not just parent-child order.',
      constraints: ['O(n) time expected'],
      hints: ['Propagate a valid (low, high) range through the recursion instead of comparing only to the immediate parent.'],
      pattern: 'BST / Recursion with bounds',
      url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    },
    {
      id: 't-p3',
      title: 'Lowest Common Ancestor of a Binary Tree',
      difficulty: 'Medium',
      description: 'Find the LCA of two given nodes in a general binary tree (no BST ordering to exploit).',
      constraints: ['Both nodes exist in the tree', 'O(n) time expected'],
      hints: ['If both left and right recursive calls return non-null, the current node is the LCA.'],
      pattern: 'Tree Recursion / LCA',
      url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    },
  ],

  faqs: [
    { question: 'Why does inorder traversal give sorted order specifically on a BST?', answer: 'Inorder visits Left, then Node, then Right. Combined with the BST invariant (left subtree < node < right subtree) applied recursively at every level, that visiting order produces strictly ascending values.' },
    { question: 'Is a heap a BST?', answer: 'No. A heap only guarantees a parent-child ordering (parent ≤ or ≥ children) - siblings are unordered, and there is no left-smaller/right-larger rule, so you cannot binary-search a heap. See the Data Structures module for the heap\'s actual guarantee.' },
    { question: 'When should I reach for a self-balancing BST over a hash table?', answer: 'When you need ordered operations - range queries, "next smaller/larger element," or sorted iteration - a hash table cannot do any of that, but a balanced BST does it in O(log n).' },
  ],

  references: [
    { label: 'VisuAlgo - Binary Search Tree Visualization', url: 'https://visualgo.net/en/bst' },
    { label: 'CP-Algorithms - Tree Algorithms', url: 'https://cp-algorithms.com/graph/lca.html' },
  ],
};