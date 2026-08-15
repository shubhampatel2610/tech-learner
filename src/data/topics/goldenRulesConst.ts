import type { Topic } from '@/types/content.types';

/**
 * TOPIC 15 - GOLDEN RULES
 * Full deep-dive. Mirrors cheatsheet section 15 (Understand, Dry Run, Code,
 * Test, Optimize, Repeat + "Discipline Today, Success Tomorrow") - the
 * capstone module. Unlike modules 1-14, this one is a *process*, not a data
 * structure or algorithm, so `complexity` and `dryRuns` are intentionally
 * omitted (both optional on Topic) and the worked examples carry the weight
 * instead, each walking a real problem through all six steps end to end.
 */
export const goldenRulesTopic: Topic = {
  slug: 'golden-rules',
  order: 15,
  title: 'Golden Rules',
  tagline: 'The six-step method that turns "I don\'t know where to start" into a working solution.',
  difficulty: 'Beginner',
  icon: 'pi pi-star',
  estMinutes: 15,
  tags: ['Method', 'Practice', 'Process'],

  overview:
    "Everything in the first 14 modules is WHAT to know - the structures, the algorithms, the patterns. This module is HOW to actually use them under pressure: a repeatable six-step process (Understand, Dry Run, Code, Test, Optimize, Repeat) that turns a blank editor and a nerve-wracking problem statement into a working, reasoned solution. It is deliberately the last module, because it is the discipline that ties all fourteen before it together into something you can execute reliably, not just recognize.",

  whyItExists:
    "Knowing every pattern in this app does not automatically make you fast or correct under interview conditions - most failures are not 'I didn't know DP,' they're 'I started coding before understanding the problem' or 'I never dry-ran it and shipped a bug I could have caught on paper.' This six-step method exists because skipping any one step has a predictable failure mode: skip Understand and you solve the wrong problem; skip Dry Run and you debug in your head instead of on paper; skip Test and you miss the edge case that fails silently; skip Optimize and you stop at a working-but-slow answer; skip Repeat and none of it sticks. The method is not busywork - each step exists because its absence causes a specific, common, avoidable failure.",

  sections: [
    {
      id: 'understand',
      heading: 'Step 1 - Understand before you touch the keyboard',
      body: `The single most common cause of a failed interview or a wasted hour is **solving the wrong problem** - and it is entirely preventable. Before writing a line of code:

- **Restate the problem in your own words** out loud (or on paper). If you cannot restate it, you have not understood it yet.
- **Clarify constraints explicitly**: input size (does it change your complexity budget?), value ranges (negative numbers? duplicates? empty input?), and what "correct" means for ambiguous cases.
- **Ask about edge cases up front**: empty input, a single element, all-identical values. Getting these on the table before coding means you design for them instead of patching them in later.
- **Work through 1-2 concrete examples by hand** - not to solve the algorithm yet, just to make sure your mental model of the problem matches what is actually being asked.

This step costs two or three minutes and prevents the single most expensive mistake: a fully-coded, fully-tested solution to a problem nobody asked.`,
    },
    {
      id: 'dry-run',
      heading: 'Step 2 - Dry run before you write real code',
      body: `A **dry run** is tracing your intended logic by hand - on paper, on a whiteboard, or just narrated out loud - against a concrete example, *before* translating it into code. This is the step most people skip under time pressure, and it is the one that pays back the most.

Why it works: debugging logic in your head while also fighting syntax is doing two hard things at once. Debugging logic on paper, where you can see every variable's value at every step, isolates the *one* hard thing - and it is dramatically faster to spot "wait, this index is off by one" while tracing on paper than after it has manifested as a wrong answer three layers deep in running code.

This app's [[complexity]], [[data-structures]], and every module since have a **DryRunStepper** for exactly this reason - watching a trace step by step, with the state visible at each point, is the habit worth building. Do this on a real interview: narrate a small example (\`[2, 7, 11, 15], target = 9\`) through your proposed approach before writing a single line, and you will catch most logic errors for free.`,
    },
    {
      id: 'code',
      heading: 'Step 3 - Code: translate the dry run, don\'t improvise',
      body: `Once the dry run works on paper, coding should be **mechanical translation**, not creative problem-solving - if you find yourself making new logical decisions while typing, that is a sign the dry run was incomplete.

Practical habits that keep this step fast and clean:

- **Name variables for what they mean**, not what type they are (\`left\`/\`right\` pointers, not \`i\`/\`j\`, when the meaning matters).
- **Write the skeleton first** (function signature, main loop structure, return statement) before filling in logic - it keeps you oriented and gives the interviewer a preview of your plan.
- **Build incrementally and narrate as you go** - "now I'll handle the case where the window needs to shrink" - so a reviewer (or future you) can follow the reasoning, not just the syntax.
- **Reuse the vocabulary from the [[common-patterns]] module** - naming the pattern you're implementing ("this is the sliding window template") keeps the code aligned with a known-correct shape instead of drifting into an ad hoc variant.`,
    },
    {
      id: 'test',
      heading: 'Step 4 - Test: the happy path is not enough',
      body: `A solution that works on the example given in the problem statement and nothing else is not tested - it is *demonstrated*. Deliberately try to break your own solution before anyone else does:

- **Empty input** - does an empty array/string/tree crash, or return a sane default?
- **Single element** - the smallest non-trivial case, where off-by-one errors love to hide.
- **All identical values** - stresses any logic that assumes distinctness.
- **Extremes** - the largest allowed input size (does it still run in time?), the smallest/largest allowed values (overflow? negative numbers where you assumed positive?).
- **The specific edge cases you identified back in Step 1** - if you wrote them down during Understand, this is where you cash that list in.

Testing is not a formality tacked onto the end - it is where the edge cases you *promised* to handle during Understand actually get verified, closing the loop between what you said you'd do and what the code does.`,
    },
    {
      id: 'optimize-repeat',
      heading: 'Step 5 & 6 - Optimize, then Repeat',
      body: `**Optimize** only after correctness: a slow-but-correct solution is infinitely more valuable than a fast-but-wrong one, so never optimize before your solution passes its tests. Once it does, revisit it with the lens of the [[complexity]] and [[common-patterns]] modules: is there a brute-force nested loop that a hash map, two pointers, or a different data structure would collapse to O(n)? State the current complexity, and explicitly reason about whether a better one is reachable - even if you run out of time to implement it, saying "this is O(n²); I believe a hash map gets this to O(n) because..." demonstrates the skill.

**Repeat** is the step with no shortcut: pattern recognition - the entire premise of the [[common-patterns]] module - is built through **spaced, deliberate practice**, not a single read-through. Concretely:

- **Revisit problems you got wrong**, not just new ones - the fastest way to close a real gap.
- **Practice a little, consistently** (the cheatsheet's "Practice LeetCode Daily") beats sporadic long sessions - pattern recognition is built through repetition spaced over time, not crammed into one sitting.
- **After solving something, ask "what pattern was this?"** explicitly - that act of labeling is what turns "I solved problem #47" into "I now recognize sliding window on sight."

This closes the loop back to the start of this app: modules 1-14 are the *material*; this six-step method, practiced repeatedly, is what turns that material into a reliable skill.`,
      visualizer: 'none',
    },
  ],

  advantages: [
    'A fixed, repeatable process reduces panic under time pressure - you always know what to do next.',
    'Each step catches a specific class of failure BEFORE it becomes an expensive, hard-to-debug mistake.',
    'Explicitly separating "get it correct" (steps 1-4) from "make it fast" (step 5) prevents premature optimization.',
  ],
  disadvantages: [
    'Feels slow when you already sense the answer - the discipline is hardest to apply exactly when it matters least (easy problems) and exactly when it matters most (hard, unfamiliar ones).',
    'Six named steps can feel like overhead on very short/simple problems - use judgment on how much ceremony a given problem actually needs.',
    'Not a substitute for the underlying knowledge - a perfect process applied to a pattern you have never seen still needs step 6 (Repeat) to have happened beforehand.',
  ],
  commonMistakes: [
    'Starting to code before restating the problem and confirming constraints - solving the wrong problem quickly is still wrong.',
    'Skipping the dry run and debugging directly in running code - slower and more error-prone than tracing on paper first.',
    'Testing only the example given in the problem statement, missing empty/single-element/extreme cases.',
    'Optimizing before the solution is correct, producing a fast solution to the wrong problem.',
    'Treating "Repeat" as optional - pattern recognition does not form from a single exposure, no matter how well-understood that one exposure was.',
  ],
  edgeCases: [
    'Time-boxed situations (interviews) - the six steps still apply, just compressed; Understand and Dry Run can be seconds, not minutes, but skipping them is still costly.',
    'A problem you have genuinely never seen a pattern for - Understand and Dry Run become exploratory tools for discovering structure, not just confirming a known approach.',
    'A problem where the "obvious" brute force is already optimal - Step 5 (Optimize) should conclude "no further optimization is possible" and say so, not force an unnecessary rewrite.',
  ],
  interviewTips: [
    'Narrate each step out loud as you move through it - interviewers are evaluating your process at least as much as your final code.',
    'If you are stuck, return explicitly to Step 1 ("let me re-read the constraints") or Step 2 ("let me trace a smaller example") rather than staring silently at the editor.',
    'When you finish a correct solution, proactively state its complexity and whether you believe it can be improved - do not wait to be asked.',
    'After ANY practice problem (interview or not), spend 30 seconds naming the pattern you used - this is Step 6 in miniature, and it compounds.',
  ],
  realWorldUseCases: [
    'Code review culture - "did you consider the empty-input case?" is Step 4 being asked by someone else.',
    'Production incident postmortems - "we didn\'t test the edge case that caused the outage" is a Step 4 failure with real consequences.',
    'Technical design docs - stating assumptions and constraints upfront is Step 1 applied to system design, not just algorithms.',
    'Any deliberate-practice skill (music, sports, writing) - the Understand/Attempt/Test/Refine/Repeat shape generalizes far beyond coding interviews.',
  ],
  relatedSlugs: ['common-patterns', 'complexity', 'algorithms'],

  flashcards: [
    { id: 'gr-f1', front: 'What are the six golden rules, in order?', back: 'Understand, Dry Run, Code, Test, Optimize, Repeat.' },
    { id: 'gr-f2', front: 'What specific failure does skipping "Understand" cause?', back: 'Solving the wrong problem, correctly - fast and confident, but not what was actually asked.' },
    { id: 'gr-f3', front: 'Why dry-run on paper instead of debugging in code directly?', back: 'It isolates logic errors from syntax errors - you can see every variable\'s state at each step, which is far faster to reason about than a running program\'s failure three layers deep.' },
    { id: 'gr-f4', front: 'What is the risk of optimizing before testing?', back: "You may end up with a fast, elegant solution to the WRONG problem - correctness must be established first; speed is a refinement on top of a working answer." },
    { id: 'gr-f5', front: 'Why does "Repeat" matter even after solving a problem correctly once?', back: 'Pattern recognition is built through spaced, deliberate repetition - a single correct solve does not reliably transfer to recognizing the same pattern in a differently-worded problem later.' },
    { id: 'gr-f6', front: 'What is the fastest way to check whether you have Understood a problem?', back: 'Try to restate it in your own words. If you cannot, you have not understood it yet - regardless of how confident you feel.' },
  ],

  practice: [
    {
      id: 'gr-p1',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Apply the six-step method deliberately: write down your Understand notes and dry-run trace on paper BEFORE opening an editor.',
      constraints: ['Time yourself on each step, not just the total'],
      hints: ['If you skip straight to coding, restart and write the dry run first - the habit only forms if you actually practice it.'],
      pattern: 'Hash Map - Complement Lookup',
      url: 'https://leetcode.com/problems/two-sum/',
    },
    {
      id: 'gr-p2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Practice the Test step deliberately: list every edge case BEFORE running your solution, then verify each one explicitly.',
      constraints: ['Write your edge-case list first, as if reviewing someone else\'s code'],
      hints: ['Empty string, single unmatched closer, all-openers, and a wrong-order mismatch are the four cases worth listing.'],
      pattern: 'Stack',
      url: 'https://leetcode.com/problems/valid-parentheses/',
    },
    {
      id: 'gr-p3',
      title: 'Course Schedule',
      difficulty: 'Medium',
      description: 'A harder problem to practice Understand and Dry Run on: restate the problem as a graph-cycle question before writing any code.',
      constraints: ['Spend at least 2 minutes on Understand + Dry Run before coding'],
      hints: ['If "no valid order exists" is hard to reason about directly, reframe it as "does this directed graph have a cycle?" first.'],
      pattern: 'Topological Sort',
      url: 'https://leetcode.com/problems/course-schedule/',
    },
  ],

  faqs: [
    { question: 'Do I really need to dry-run EVERY problem, even easy ones?', answer: 'For genuinely trivial problems, the dry run can be seconds long - but skipping it entirely is where "easy" problems produce silly, avoidable mistakes (off-by-one, wrong comparison direction). Scale the TIME spent, not whether you do it at all.' },
    { question: 'How is "Repeat" different from just doing more practice problems?', answer: 'Volume alone is not the point - Repeat specifically means revisiting problems you got wrong and explicitly naming the pattern each time you solve something, so recognition transfers to new, differently-worded problems instead of only the exact one you memorized.' },
    { question: 'What if I run out of time before reaching Optimize?', answer: 'A correct, clearly-explained, sub-optimal solution with an honest statement of its complexity and a stated idea for improvement is a strong outcome - far better than a rushed, broken attempt at the optimal solution. Correctness (steps 1-4) is the priority; Optimize is the step most reasonable to leave partial under real time pressure.' },
  ],

  references: [
    { label: 'Polya - How to Solve It (the classical 4-step problem-solving method this extends)', url: 'https://en.wikipedia.org/wiki/How_to_Solve_It' },
    { label: 'NeetCode - A Complete Guide to Coding Interviews', url: 'https://neetcode.io/roadmap' },
  ],
};
