import type { Topic } from '@/types/content.types';

/**
 * TOPIC 9 - GRAPHS
 * Full deep-dive. Mirrors cheatsheet section 9 (Representations: Adjacency
 * List/Matrix; Traversals: BFS/DFS; Shortest Path: Dijkstra/Bellman-Ford;
 * MST: Kruskal/Prim; Topological Sort) - the most "Advanced" module yet.
 */
export const graphsTopic: Topic = {
  slug: 'graphs',
  order: 9,
  title: 'Graphs',
  tagline: 'Everything relational - the most general structure, and the widest algorithm toolbox.',
  difficulty: 'Advanced',
  icon: 'pi pi-share-alt',
  estMinutes: 70,
  tags: ['BFS', 'DFS', 'Dijkstra', 'MST'],

  overview:
    "A graph is vertices connected by edges - no restriction on how many neighbors a node can have or in what pattern. That generality is the point: a tree is a graph with no cycles and exactly one path between any two nodes; a linked list is a graph where every node has at most one neighbor in each direction. Once you can model a problem as a graph, an entire toolbox of traversal, shortest-path, and connectivity algorithms becomes available.",

  whyItExists:
    'Most interesting real-world relationships are not linear or strictly hierarchical - road networks have multiple routes between cities, social networks have friends-of-friends cycles, dependency graphs can have diamond-shaped sharing. Graphs exist because trees and lists cannot represent these shapes at all. The tradeoff for that generality is that graph algorithms have to actively guard against cycles (a visited set is mandatory, unlike tree traversal) and choose a representation (list vs matrix) based on density, because there is no single free layout the way arrays and linked lists have.',

  sections: [
    {
      id: 'representation',
      heading: 'Representation: adjacency list vs adjacency matrix',
      body: `**Adjacency list** - each vertex stores a list of its neighbors. Space is **O(V + E)** - proportional to what's actually there. This is the default choice for **sparse** graphs (E ≪ V²), which is most real-world graphs (a social network user doesn't know every other user).

**Adjacency matrix** - a V × V grid where \`matrix[i][j]\` marks whether an edge exists (or its weight). Space is **O(V²)** regardless of edge count, but checking "is there an edge between i and j?" is **O(1)** instead of the list's O(degree). Worth it for **dense** graphs or when edge-existence checks dominate.

\`\`\`text
Graph: 1-2, 1-3, 2-3

Adjacency List:            Adjacency Matrix:
1: [2, 3]                       1  2  3
2: [1, 3]                    1  -  1  1
3: [1, 2]                    2  1  -  1
                              3  1  1  -
\`\`\`

Rule of thumb: **default to adjacency list.** Reach for a matrix only when the graph is dense or you need O(1) edge lookups more than you need to save memory.`,
      visualizer: 'graph-map',
    },
    {
      id: 'bfs-dfs-graph',
      heading: 'BFS and DFS on graphs - the one crucial addition',
      body: `Both traversals work exactly as on a tree, with **one mandatory addition: a visited set.** Trees have no cycles, so you never revisit a node by accident. Graphs can have cycles, so without tracking visited nodes, BFS/DFS can loop forever.

**BFS** (queue) explores level by level. On an **unweighted** graph, the first time you reach a node is guaranteed to be via a shortest path - this is BFS's single most useful property, and it's why "shortest path, unweighted" always means BFS.

**DFS** (stack or recursion) dives as deep as possible before backtracking. Use it for: does a path exist, finding connected components, detecting cycles, and topological sort (see below).

Both are **O(V + E)** - every vertex is visited once (guarded by the visited set) and every edge is examined once (from whichever endpoint discovers it).

\`\`\`text
bfs(start):
    visited = {start}
    queue = [start]
    while queue:
        node = queue.pop_left()
        for neighbor in adj[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.push(neighbor)
\`\`\``,
    },
    {
      id: 'shortest-path',
      heading: 'Shortest path: Dijkstra and Bellman-Ford',
      body: `**Dijkstra's algorithm** finds shortest paths from a single source on a **weighted graph with non-negative weights**. It's a greedy algorithm: repeatedly pop the closest unvisited vertex (via a min-heap), and relax its neighbors' distances. **O((V + E) log V)** with a binary heap.

**Why non-negative weights matter:** Dijkstra assumes that once a vertex is popped as "closest," its distance is final - a negative edge discovered later could retroactively make some *other* path shorter, which would silently break the algorithm's correctness. It doesn't crash; it just gives a wrong answer.

**Bellman-Ford** handles **negative weights** by relaxing *every* edge, V-1 times (that's the maximum possible path length without cycles). **O(V · E)** - slower than Dijkstra, but correct with negative edges, and it can additionally **detect negative-weight cycles**: if a V-th relaxation pass still improves any distance, a negative cycle exists and "shortest path" is undefined (you could loop it forever, subtracting weight infinitely).

| | Dijkstra | Bellman-Ford |
|---|---|---|
| Weights | Non-negative only | Any (detects negative cycles) |
| Time | O((V+E) log V) | O(V · E) |
| Approach | Greedy + min-heap | DP-style edge relaxation |`,
    },
    {
      id: 'mst',
      heading: 'Minimum Spanning Tree: Kruskal and Prim',
      body: `A **Minimum Spanning Tree (MST)** connects all V vertices with exactly V-1 edges at the lowest possible total weight, with no cycles. Think: "cheapest way to wire every city together with power lines."

**Kruskal's algorithm** - sort all edges by weight, then greedily add each edge unless it would create a cycle (checked with a **Union-Find / Disjoint Set** structure in near-O(1) per check). **O(E log E)**, dominated by the sort. Naturally suited to **edge-list** representations and sparse graphs.

**Prim's algorithm** - start from any vertex and greedily grow the tree, always adding the cheapest edge that connects a new vertex to the existing tree (via a min-heap of frontier edges). **O(E log V)** with a binary heap. Naturally suited to **adjacency-list** representations and dense graphs.

Both are greedy and both are provably optimal for MST (unlike general shortest-path or scheduling problems, where greedy often fails) - this is one of the few places in the curriculum where "always take the locally cheapest option" is mathematically guaranteed to produce the global optimum.`,
    },
    {
      id: 'topo-sort',
      heading: 'Topological Sort - ordering a DAG',
      body: `A **topological sort** orders the vertices of a **Directed Acyclic Graph (DAG)** so that every edge u → v places u before v. It only exists if the graph has **no cycles** - "finish A before B" constraints that loop back on themselves are unsatisfiable.

**DFS-based approach:** run DFS from every unvisited node; when a node's DFS finishes (all its descendants are done), push it onto a stack. Reverse the stack (or read it back-to-front) for the topological order. **O(V + E)**.

**Kahn's algorithm (BFS-based):** repeatedly remove vertices with **in-degree 0** (no remaining prerequisites), decrementing their neighbors' in-degrees as you go. If you process all V vertices, you have a valid order; if some vertices are never removed (their in-degree never hits 0), the graph has a cycle. **O(V + E)**, and it doubles as a **cycle detector** for free - a property Kahn's has that the DFS approach requires extra bookkeeping to match.

Classic use case: **course prerequisites, build systems, task scheduling** - anything phrased as "X must happen before Y."`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'Adjacency list - space', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V + E)', note: 'Best for sparse graphs.' },
    { operation: 'Adjacency matrix - space', best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', space: 'O(V²)', note: 'O(1) edge check; wasteful when sparse.' },
    { operation: 'BFS / DFS', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', note: 'Visited set is mandatory (unlike tree traversal).' },
    { operation: 'Dijkstra (binary heap)', best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)', note: 'Requires non-negative weights.' },
    { operation: 'Bellman-Ford', best: 'O(V · E)', average: 'O(V · E)', worst: 'O(V · E)', space: 'O(V)', note: 'Handles negative weights; detects negative cycles.' },
    { operation: "Kruskal's MST", best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)', note: 'Dominated by sorting edges; uses Union-Find.' },
    { operation: "Prim's MST", best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)', note: 'Binary-heap frontier; good for dense graphs.' },
    { operation: 'Topological sort (DFS or Kahn\'s)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', note: 'Only defined for a DAG (no cycles).' },
  ],

  dryRuns: [
    {
      title: "Kahn's algorithm: topological sort of a course prerequisite DAG",
      input: 'Edges (prereq -> course): 1->2, 1->3, 2->4, 3->4',
      steps: [
        { label: 'compute in-degrees', detail: 'in-degree: 1=0, 2=1, 3=1, 4=2. Queue starts with all in-degree-0 nodes: [1].', state: [1] },
        { label: 'process 1', detail: 'Remove 1, add it to the order. Decrement in-degree of 2 and 3 (both now 0) - enqueue both. Queue: [2, 3].', state: [2, 3] },
        { label: 'process 2', detail: 'Remove 2, add to order. Decrement in-degree of 4 (now 1, not yet 0) - do not enqueue. Queue: [3].', state: [3] },
        { label: 'process 3', detail: 'Remove 3, add to order. Decrement in-degree of 4 (now 0) - enqueue it. Queue: [4].', state: [4] },
        { label: 'process 4', detail: 'Remove 4, add to order. No outgoing edges. Queue empty - all 4 vertices processed, no cycle.', state: [] },
      ],
      result: 'Valid order: [1, 2, 3, 4] - every edge points forward in this order, found in O(V + E) with a free cycle check.',
    },
    {
      title: "Dijkstra's algorithm from node 1",
      input: 'Edges: 1-2 (w=4), 1-3 (w=1), 3-2 (w=2), 2-4 (w=1), 3-4 (w=5)',
      steps: [
        { label: 'init', detail: 'dist = {1:0, 2:∞, 3:∞, 4:∞}. Min-heap: [(0,1)].', state: [0, 999, 999, 999] },
        { label: 'pop 1 (dist 0)', detail: 'Relax neighbors: dist[2] = min(∞, 0+4) = 4. dist[3] = min(∞, 0+1) = 1. Heap: [(1,3), (4,2)].', state: [0, 4, 1, 999] },
        { label: 'pop 3 (dist 1)', detail: 'Relax neighbors: dist[2] = min(4, 1+2) = 3 (improved!). dist[4] = min(∞, 1+5) = 6. Heap: [(3,2), (4,2)stale, (6,4)].', state: [0, 3, 1, 6] },
        { label: 'pop 2 (dist 3)', detail: 'Relax neighbors: dist[4] = min(6, 3+1) = 4 (improved!). Heap: [(4,4), (6,4)stale].', state: [0, 3, 1, 4] },
        { label: 'pop 4 (dist 4)', detail: 'No unvisited neighbors to relax. Heap drains its remaining stale entries and finishes.', state: [0, 3, 1, 4] },
      ],
      result: 'Shortest distances from node 1: {1:0, 2:3, 3:1, 4:4} - note node 2\'s distance was improved after being relaxed a second time via node 3, which is exactly what the min-heap ordering guarantees is still correct.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Number of connected components (undirected graph)',
      problem: 'Count how many separate connected components exist in an undirected graph.',
      approach:
        'Run BFS or DFS from every unvisited node; each run marks one entire component as visited. The number of times you had to start a fresh traversal is the number of components. O(V + E) total, since every node and edge is touched once across all runs combined.',
      complexity: 'O(V + E) time, O(V) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def count_components(n, edges):
    adj = {i: [] for i in range(n)}
    for a, b in edges:
        adj[a].append(b)
        adj[b].append(a)

    visited = set()
    count = 0
    for start in range(n):
        if start in visited:
            continue
        count += 1
        stack = [start]
        visited.add(start)
        while stack:
            node = stack.pop()
            for nb in adj[node]:
                if nb not in visited:
                    visited.add(nb)
                    stack.append(nb)
    return count`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Course schedule - detect a cycle with topological sort',
      problem: 'Given course prerequisites, determine whether it is possible to finish all courses (i.e. the prerequisite graph is a DAG).',
      approach:
        "Kahn's algorithm gives a cycle check for free: repeatedly remove in-degree-0 nodes. If every node gets removed, there's no cycle and all courses are completable; if some remain stuck (a cycle among them keeps their in-degree above 0 forever), it's impossible.",
      complexity: 'O(V + E) time, O(V) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `from collections import deque

def can_finish(num_courses, prerequisites):
    indegree = [0] * num_courses
    adj = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        indegree[course] += 1

    queue = deque(c for c in range(num_courses) if indegree[c] == 0)
    processed = 0
    while queue:
        node = queue.popleft()
        processed += 1
        for nxt in adj[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return processed == num_courses`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: "Dijkstra's algorithm with a min-heap",
      problem: 'Find the shortest distance from a source to every other node in a weighted graph with non-negative edges.',
      approach:
        'A min-heap always pops the currently-closest unvisited node. Relaxing its edges may improve neighbor distances, which get pushed back onto the heap (stale, larger-distance entries are simply skipped when popped later since the node is already finalized). This lazy-deletion approach is simpler to implement than a heap with decrease-key support.',
      complexity: 'O((V + E) log V) time, O(V) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `import heapq

def dijkstra(n, adj, src):
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue  # stale entry, already finalized with a better distance
        for nb, weight in adj[node]:
            nd = d + weight
            if nd < dist[nb]:
                dist[nb] = nd
                heapq.heappush(heap, (nd, nb))
    return dist`,
        },
      ],
    },
  ],

  advantages: [
    'The most general structure - trees, lists, and grids are all special-case graphs.',
    'A rich, well-understood algorithm toolbox exists for nearly any relational question (reachability, shortest path, optimal connection, ordering).',
    "Greedy algorithms (Kruskal's, Prim's) are provably optimal for MST - a rare guarantee in algorithm design.",
  ],
  disadvantages: [
    'Cycles mean traversal always needs explicit visited-tracking - a mistake here causes infinite loops, unlike tree traversal.',
    'Choosing the wrong representation (matrix on a sparse graph) wastes O(V²) memory for no benefit.',
    'Dijkstra silently gives wrong answers on negative weights instead of erroring - a dangerous failure mode.',
  ],
  commonMistakes: [
    'Forgetting the visited set on a graph BFS/DFS, causing infinite loops on any cycle.',
    'Using Dijkstra on a graph with negative edge weights - it will run and return a plausible-looking but wrong answer.',
    "Using an adjacency matrix by default on a large sparse graph, wasting O(V²) memory when O(V + E) would do.",
    'Confusing BFS shortest-path (works only on unweighted graphs) with Dijkstra (required once edges have weights).',
    "Attempting a topological sort on a graph that has a cycle - the algorithm should detect and report this, not silently produce a partial/wrong order.",
  ],
  edgeCases: [
    'Disconnected graph - traversal from a single start node will miss other components; must loop over all vertices.',
    'Self-loops and parallel edges - decide upfront how your representation and algorithms handle them.',
    'Negative-weight cycle - "shortest path" is undefined; Bellman-Ford must detect and report it, not loop forever.',
    'Single-node graph, or a graph with zero edges - BFS/DFS/topo-sort should all degrade gracefully.',
  ],
  interviewTips: [
    'State your representation choice and why: "adjacency list, since this graph is sparse."',
    'For "shortest path," always ask (or state): weighted or unweighted? That single answer picks BFS vs Dijkstra vs Bellman-Ford.',
    'Mention the visited-set requirement explicitly when moving from tree to graph traversal - it signals you understand why trees didn\'t need it.',
    'For MST questions, mention both Kruskal\'s (edge-sorted + union-find) and Prim\'s (heap-grown frontier), and pick based on density: sparse → Kruskal\'s, dense → Prim\'s.',
    'If a problem says "prerequisites," "build order," or "dependencies," say "topological sort" immediately and ask if a valid order is guaranteed to exist (i.e. is it a DAG).',
  ],
  realWorldUseCases: [
    'Road networks and GPS routing - Dijkstra (or A*, an informed variant) for shortest/fastest route.',
    'Social networks - BFS for "degrees of separation," connected components for friend clusters.',
    'Build systems and package managers - topological sort resolves dependency/build order (npm, Maven, Makefiles).',
    'Network design - MST algorithms minimize the cost of cabling/connecting a set of locations.',
    'Currency arbitrage detection - Bellman-Ford\'s negative-cycle detection finds profitable exchange-rate loops.',
  ],
  relatedSlugs: ['data-structures', 'trees', 'algorithms', 'common-patterns'],

  flashcards: [
    { id: 'g-f1', front: 'Adjacency list vs matrix - when to use each?', back: 'List: O(V+E) space, best for sparse graphs (the default). Matrix: O(V²) space but O(1) edge check, best for dense graphs.' },
    { id: 'g-f2', front: 'What must graph BFS/DFS have that tree traversal does not?', back: 'A visited set - graphs can have cycles, so without tracking visited nodes the traversal can loop forever.' },
    { id: 'g-f3', front: 'When does BFS alone find the shortest path?', back: 'Only on an unweighted graph. Weighted graphs need Dijkstra (non-negative weights) or Bellman-Ford (any weights).' },
    { id: 'g-f4', front: "Why does Dijkstra fail with negative edge weights?", back: 'It assumes a popped vertex\'s distance is final. A later negative edge could retroactively create a shorter path, silently giving a wrong answer instead of erroring.' },
    { id: 'g-f5', front: "Kruskal's vs Prim's - core mechanism?", back: "Kruskal's: sort all edges, greedily add if no cycle (via Union-Find). Prim's: grow one tree, always adding the cheapest edge to a new vertex (via a min-heap)." },
    { id: 'g-f6', front: "What does Kahn's algorithm give you for free?", back: 'Cycle detection - if not all vertices get removed (in-degree never reaches 0 for some), the graph has a cycle and no valid topological order exists.' },
    { id: 'g-f7', front: 'Time complexity of BFS/DFS on a graph?', back: 'O(V + E) - every vertex visited once (guarded by visited set), every edge examined once.' },
  ],

  practice: [
    {
      id: 'g-p1',
      title: 'Number of Islands',
      difficulty: 'Medium',
      description: 'Count connected components of land cells in a grid - a graph traversal problem in disguise.',
      constraints: ['Grid of 0s (water) and 1s (land)', 'O(rows × cols) expected'],
      hints: ['Treat each land cell as a graph node; BFS or DFS from each unvisited land cell, marking its whole component visited.'],
      pattern: 'BFS / DFS - Connected Components',
      url: 'https://leetcode.com/problems/number-of-islands/',
    },
    {
      id: 'g-p2',
      title: 'Course Schedule',
      difficulty: 'Medium',
      description: 'Determine if all courses can be finished given prerequisite pairs - cycle detection via topological sort.',
      constraints: ['Directed graph of prerequisites', 'O(V + E) expected'],
      hints: ["Kahn's algorithm: if you can remove all in-degree-0 nodes iteratively, there's no cycle."],
      pattern: 'Topological Sort',
      url: 'https://leetcode.com/problems/course-schedule/',
    },
    {
      id: 'g-p3',
      title: 'Network Delay Time',
      difficulty: 'Medium',
      description: 'Find the time for a signal to reach all nodes from a source in a weighted directed graph - a direct Dijkstra application.',
      constraints: ['Non-negative edge weights', 'O((V+E) log V) expected'],
      hints: ['Run Dijkstra from the source; the answer is the maximum finite distance across all nodes.'],
      pattern: "Dijkstra's Algorithm",
      url: 'https://leetcode.com/problems/network-delay-time/',
    },
  ],

  faqs: [
    { question: 'Is a tree just a special graph?', answer: 'Yes - a tree is a connected, acyclic graph with exactly one path between any two nodes. Every tree algorithm (traversal, recursion) is a graph algorithm specialized to a shape with no cycles to worry about.' },
    { question: 'When would I use Bellman-Ford instead of Dijkstra even without negative weights?', answer: 'Rarely - Dijkstra is faster (O((V+E) log V) vs O(V·E)) and correct whenever weights are non-negative. Bellman-Ford is only worth its extra cost when negative weights (or negative-cycle detection) are actually possible in your input.' },
    { question: "Why are Kruskal's and Prim's both correct - doesn't greedy usually fail?", answer: 'MST has a special property (the "cut property"): the cheapest edge crossing any partition of vertices is guaranteed to be in some MST. Both algorithms exploit this directly, which is why greedy provably works here even though it fails for many other optimization problems (like 0/1 knapsack).' },
  ],

  references: [
    { label: 'VisuAlgo - Graph Traversal & Shortest Path', url: 'https://visualgo.net/en/sssp' },
    { label: 'CP-Algorithms - Graph Algorithms', url: 'https://cp-algorithms.com/graph/breadth-first-search.html' },
  ],
};
