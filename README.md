# DSA Learner

An interactive, engineering-focused platform for learning Data Structures & Algorithms - from first principles to interview-ready. Built with Next.js 15 (App Router), React 19, TypeScript (strict), Redux Toolkit, and a compact Linear-inspired dark UI.

> **Scope note.** All **15 cheatsheet topics** are built end-to-end in full depth, from Complexity Analysis through Golden Rules - each with concept sections, interactive visualizers, worked examples, a quiz, and practice problems. Every topic is a pure data file (see [Adding a topic](#adding-a-topic)), so extending the content never requires touching component code.

## Quick start

```bash
npm install --legacy-peer-deps   # React 19 peers; see note below
npm run dev                      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (fully offline - fonts are self-hosted)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit (strict)
npm run lint       # eslint
npm run format     # prettier
```

> `--legacy-peer-deps` is currently needed because a few libraries (PrimeReact, React Flow) still declare React 18 peer ranges even though they run fine on React 19. It only affects install-time peer resolution.

## What's inside

- **Learning roadmap** (`/`) - all 15 cheatsheet topics, filterable by difficulty, all built out in full depth.
- **Topic modules** (`/topics/[slug]`) - each topic includes an overview, "why it exists", multiple concept sections with interactive visualizers, a colour-coded complexity reference, step-through dry runs, multi-language worked examples, advantages/disadvantages/mistakes/edge-cases, interview tips, real-world uses, flashcards, an auto-graded quiz, practice problems, and an FAQ.
- **Dashboard** (`/dashboard`) - XP, day-streak, per-topic completion, a 12-week study heatmap, bookmarks, and recently visited topics. All progress persists to `localStorage`.

## Architecture

```
src/
  app/                 # Next.js App Router (routes, layout, error/loading/not-found)
    fonts/             # self-hosted Inter + JetBrains Mono (.woff2)
    topics/[slug]/     # SSG topic pages (dynamicParams = false)
  components/
    common/            # logo, theme toggle, topic card
    layout/            # navbar, footer
    module/            # content renderers: TopicView, ComplexityTable, DryRunStepper,
                       # Flashcards, Quiz, PracticeList
    ui/                # primitives: Badge, SectionCard, EmptyState, CodeBlock, Markdown
    visualizers/       # BigOChart, ArrayOps, ConceptMap, LinkedListOps, StackQueueOps,
                       # TreeOps, HeapOps, HashTableOps, DPTableOps, FormulaOps, BitOps
                       # + VisualizerHost dispatcher
  data/
    topics/            # ONE data file per topic (15) + the registry (index.ts)
    conceptMaps.ts     # taxonomy node lists for the React Flow maps
  hooks/               # useTopicProgress, useMounted, useScrolled, useCopyToClipboard
  lib/                 # appConstants (all copy/config), utils (pure helpers)
  providers/           # Redux + PrimeReact providers, ThemeController
  store/               # Redux Toolkit: slices, selectors, typed hooks, persistence
  types/               # content + progress domain types
```

Design principles applied throughout:

- **Content is data, not code.** Every topic is a strongly-typed `Topic` object. UI components are generic renderers driven by that data (Open/Closed).
- **No business logic in components.** Progress/XP/streak logic lives in the Redux slice; derived values live in memoized selectors and the `useTopicProgress` hook.
- **Strict typing.** `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters` are all on. No `any`.
- **Centralized copy.** User-facing strings live in `lib/appConstants.ts`.
- **Accessibility floor.** Keyboard focus is visible, motion respects `prefers-reduced-motion`, layouts are responsive to mobile.

## Adding a topic

All 15 cheatsheet topics are built, but the same pattern extends to any new one:

1. Create `src/data/topics/<name>Const.ts` exporting a `Topic` object (copy an existing file as a template - the type will guide you).
2. Import it in `src/data/topics/index.ts` and add it to the `FULL_TOPICS` array.
3. Done. It gets a statically-generated page, appears on the roadmap and dashboard, and wires into progress/XP automatically.

To add a **new visualizer**: add a `VisualizerKind` in `types/content.types.ts`, a `case` in `components/visualizers/VisualizerHost.tsx`, and reference it from a section's `visualizer` field.

## State & persistence

Redux Toolkit with two slices: `progress` (XP, streak, per-topic completion, bookmarks, activity) and `preferences` (theme, reduced motion). A debounced middleware persists both to `localStorage` under the key `dsa-learner:v1`, and the store hydrates from it on first load. Clearing browser storage resets everything (there's also a Reset button on the dashboard).

## Fonts

Inter (UI) and JetBrains Mono (code) are **self-hosted** from vendored `.woff2` files in `src/app/fonts/` via `next/font/local`. This avoids a render-blocking Google Fonts request, sidesteps the GDPR concerns with Google Fonts, and makes production builds reproducible without network access.

## Deployment

Deploys as-is to Vercel (zero config) or any Node host:

```bash
npm run build && npm run start
```

## Security notes

- Pinned to Next.js `15.5.22`, which includes the fix for the earlier 15.1.x advisory.
- `npm audit` reports remaining **high** advisories in tooling that Next bundles transitively (`postcss`, `sharp`). They are build-time only and are not resolvable without upgrading to Next 16 (a breaking major). Track them and upgrade when you migrate to Next 16.

## License

Provided for educational use.
