import type { ConceptNode } from '@/components/visualizers/ConceptMap';

/** Data-structures taxonomy (cheatsheet section 2). */
export const DS_MAP: ConceptNode[] = [
  { id: 'ds', label: 'Data Structures', level: 0 },
  { id: 'linear', label: 'Linear', level: 1, parent: 'ds' },
  { id: 'nonlinear', label: 'Non-Linear', level: 1, parent: 'ds' },
  { id: 'array', label: 'Array', level: 2, parent: 'linear' },
  { id: 'llist', label: 'Linked List', level: 2, parent: 'linear' },
  { id: 'stack', label: 'Stack (LIFO)', level: 2, parent: 'linear' },
  { id: 'queue', label: 'Queue (FIFO)', level: 2, parent: 'linear' },
  { id: 'deque', label: 'Deque', level: 2, parent: 'linear' },
  { id: 'tree', label: 'Tree / BST', level: 2, parent: 'nonlinear' },
  { id: 'heap', label: 'Heap (min/max)', level: 2, parent: 'nonlinear' },
  { id: 'graph', label: 'Graph', level: 2, parent: 'nonlinear' },
  { id: 'hash', label: 'Hash Table', level: 2, parent: 'nonlinear' },
];

/** Algorithms taxonomy (cheatsheet section 3). */
export const ALGO_MAP: ConceptNode[] = [
  { id: 'algo', label: 'Algorithms', level: 0 },
  { id: 'sort', label: 'Sorting', level: 1, parent: 'algo' },
  { id: 'search', label: 'Searching', level: 1, parent: 'algo' },
  { id: 'simple', label: 'Simple O(n²)', level: 2, parent: 'sort' },
  { id: 'eff', label: 'Efficient O(n log n)', level: 2, parent: 'sort' },
  { id: 'noncmp', label: 'Non-comparison', level: 2, parent: 'sort' },
  { id: 'linsrch', label: 'Linear O(n)', level: 2, parent: 'search' },
  { id: 'binsrch', label: 'Binary O(log n)', level: 2, parent: 'search' },
];

/** Common patterns taxonomy (cheatsheet section 4 - "Master patterns, solve anything"). */
export const PATTERN_MAP: ConceptNode[] = [
  { id: 'pat', label: 'Common Patterns', level: 0 },
  { id: 'pointer-based', label: 'Pointer-based', level: 1, parent: 'pat' },
  { id: 'window-interval', label: 'Window / Interval', level: 1, parent: 'pat' },
  { id: 'traversal-search', label: 'Traversal / Search', level: 1, parent: 'pat' },
  { id: 'optimization', label: 'Optimization', level: 1, parent: 'pat' },
  { id: 'two-pointers', label: 'Two Pointers', level: 2, parent: 'pointer-based' },
  { id: 'fast-slow', label: 'Fast & Slow Pointer', level: 2, parent: 'pointer-based' },
  { id: 'cyclic-sort', label: 'Cyclic Sort', level: 2, parent: 'pointer-based' },
  { id: 'sliding-window', label: 'Sliding Window', level: 2, parent: 'window-interval' },
  { id: 'merge-intervals', label: 'Merge Intervals', level: 2, parent: 'window-interval' },
  { id: 'bfs-dfs', label: 'BFS / DFS', level: 2, parent: 'traversal-search' },
  { id: 'backtracking', label: 'Backtracking', level: 2, parent: 'traversal-search' },
  { id: 'top-k', label: 'Top K Elements', level: 2, parent: 'traversal-search' },
  { id: 'greedy', label: 'Greedy', level: 2, parent: 'optimization' },
  { id: 'dp', label: 'Dynamic Programming', level: 2, parent: 'optimization' },
  { id: 'divide-conquer', label: 'Divide & Conquer', level: 2, parent: 'optimization' },
];

/** Graph algorithms taxonomy (cheatsheet section 9). */
export const GRAPH_MAP: ConceptNode[] = [
  { id: 'graph', label: 'Graphs', level: 0 },
  { id: 'repr', label: 'Representation', level: 1, parent: 'graph' },
  { id: 'traverse', label: 'Traversal', level: 1, parent: 'graph' },
  { id: 'shortest', label: 'Shortest Path', level: 1, parent: 'graph' },
  { id: 'mst-topo', label: 'MST & Ordering', level: 1, parent: 'graph' },
  { id: 'adj-list', label: 'Adjacency List', level: 2, parent: 'repr' },
  { id: 'adj-matrix', label: 'Adjacency Matrix', level: 2, parent: 'repr' },
  { id: 'bfs', label: 'BFS', level: 2, parent: 'traverse' },
  { id: 'dfs', label: 'DFS', level: 2, parent: 'traverse' },
  { id: 'dijkstra', label: 'Dijkstra (weighted)', level: 2, parent: 'shortest' },
  { id: 'bellman', label: 'Bellman-Ford', level: 2, parent: 'shortest' },
  { id: 'kruskal', label: 'Kruskal (MST)', level: 2, parent: 'mst-topo' },
  { id: 'prim', label: 'Prim (MST)', level: 2, parent: 'mst-topo' },
  { id: 'topo', label: 'Topological Sort (DAG)', level: 2, parent: 'mst-topo' },
];
