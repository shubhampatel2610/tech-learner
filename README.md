# TechPath

## The problem

Most DSA prep material is either a wall of text (cheatsheets, blog posts) or a wall of problems (LeetCode) with nothing connecting the two. Learners memorize patterns without building intuition for *why* a structure or technique works, and there's no single place that pairs a concept with a visual, a worked dry run, and a way to check you actually understood it.

## What this is

TechPath is an interactive platform that takes Data Structures & Algorithms from first principles to interview-ready. Every topic — from Big-O complexity to graphs and dynamic programming — is taught the same way: a clear explanation, an interactive visualizer you can manipulate, a step-by-step dry run, worked examples, and common mistakes/edge cases.

## What's covered

15 topics, each built out in full depth: Complexity Analysis, Arrays & Strings, Linked Lists, Stacks & Queues, Trees, Heaps, Hash Tables, Graphs, Dynamic Programming, Bit Manipulation, Formulas, Common Patterns, Algorithms, Data Structures, and Golden Rules.

Each topic page includes:
- Concept sections with interactive visualizers (array ops, tree traversal, heap operations, DP tables, and more)
- A color-coded time/space complexity reference
- Step-through dry runs and multi-language worked examples
- Advantages, disadvantages, pitfalls, and interview tips
- Flashcards and practice problems

## How to run

```bash
npm install --legacy-peer-deps   # React 19 peers; a couple of libs still declare React 18 ranges
npm run dev                      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run format     # prettier
```
