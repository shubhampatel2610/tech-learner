import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 3 - MERGING & CONFLICTS
 * Third module of the "Git in 7 Days" track. Core idea: a merge conflict is
 * Git asking you to decide, not an error - it happens exactly when both
 * histories changed the same lines and Git cannot guess which you want.
 * Covers merge, merge conflicts, and --abort.
 */
export const gitDay3Topic: Topic = {
  slug: 'git-day-3-merging-conflicts',
  order: 3,
  category: 'Git',
  title: 'Git Day 3 - Merging & Conflicts',
  tagline: 'A merge conflict is Git asking you to decide - not an error to panic over.',
  difficulty: 'Intermediate',
  icon: 'pi pi-share-alt',
  estMinutes: 60,
  tags: ['Git', 'Merging', 'Conflicts'],

  overview:
    "Day 2 established that branches are independent pointers that can diverge freely. Day 3 is about bringing two diverging histories back together with `git merge`. When the two branches touched different parts of the codebase, Git combines them automatically. When both branches changed the exact same lines, Git cannot guess which version you want - that is a merge conflict, and it is Git explicitly asking you to decide, not a failure state. Resolving one is a normal, expected part of collaborative work, not a sign something went wrong.",

  whyItExists:
    "Merging exists because branching (Day 2) is only useful if diverged work can eventually be recombined. Conflicts exist as an unavoidable consequence of two people (or two branches) changing the same lines differently - Git has no way to know intent, so it surfaces both versions directly in the file and waits. Understanding conflict markers and the fast-forward vs. three-way distinction removes the single biggest source of Git-related panic: a conflict is not corrupted history, it is an incomplete merge waiting on one more decision from you.",

  sections: [
    {
      id: 'merge-basics',
      heading: 'git merge and git merge --abort',
      body: `\`git merge <branch-name>\` merges the named branch into your **current** branch - so you check out the branch you want to receive the changes first, then merge the other one into it. \`git status\` will list any conflicted files if the merge could not complete automatically.

\`git merge --abort\` cancels a merge that produced conflicts and returns everything exactly to how it was before the merge started - but this only works **before** you commit the merge. Once a conflicted merge has been resolved and committed, \`--abort\` is no longer available; undoing it at that point means using Day 4's tools (\`reset\` or \`revert\`) instead.`,
    },
    {
      id: 'conflict-markers',
      heading: 'What a conflict looks like',
      body: `When Git cannot automatically reconcile the same lines, it writes both versions directly into the file, separated by conflict markers:

\`\`\`text
<<<<<<< HEAD
your version
=======
their version
>>>>>>> feature-branch
\`\`\`

Everything between \`<<<<<<< HEAD\` and \`=======\` is your current branch's version; everything between \`=======\` and \`>>>>>>> feature-branch\` is the incoming branch's version. You edit the file to keep whichever content is correct (which may be one side, the other, a combination of both, or something new entirely), **delete all three marker lines**, then \`git add\` and \`git commit\` exactly like a normal change. Never leave conflict markers in committed code - a stray \`<<<<<<<\` line that slips into a commit is a clear sign the resolution step was skipped.`,
    },
    {
      id: 'fast-forward-vs-three-way',
      heading: 'Fast-forward vs. three-way merges',
      body: `Not every merge is the same shape:

| Concept | What it does | The trap |
|---|---|---|
| Fast-forward merge | No conflict, just moves the pointer forward | Happens when no new commits landed on the target branch since the branch diverged |
| Three-way merge | Combines diverging histories | Can produce conflicts |
| \`--abort\` | Cancels a messy merge | Only works before you commit the merge |
| Conflict markers | Show both versions | Never leave \`<<<<<<<\` in committed code |

A **fast-forward** merge happens when the target branch (say, \`main\`) has not moved since the feature branch diverged from it - Git simply slides \`main\`'s pointer forward to the feature branch's latest commit, with no new merge commit and no possibility of a conflict. A **three-way merge** happens when both branches have new commits since diverging - Git compares the two branch tips against their common ancestor and creates a new merge commit combining both histories; this is the shape that can produce conflicts.`,
      visualizer: 'none',
    },
  ],

  dryRuns: [
    {
      title: 'Creating and resolving a merge conflict',
      input: 'main and feature both edit line 1 of config.txt differently',
      steps: [
        { label: 'Edit line 1 on main', detail: 'main commits a change to the same line in config.txt.' },
        { label: 'Edit line 1 on feature', detail: 'feature independently commits a different change to the exact same line.' },
        { label: 'git merge feature', detail: 'Git cannot tell which edit you want - it stops mid-merge and marks config.txt as conflicted.' },
        { label: 'Resolve + remove markers', detail: 'Edit the file to keep the intended content, then delete the <<<<<<<, =======, and >>>>>>> lines.' },
        { label: 'git add + git commit', detail: 'Staging the resolved file and committing completes the merge with a new merge commit.' },
      ],
      result: 'The resulting merge commit has two parents (main and feature) - Git combined the histories once you explicitly told it which content to keep.',
    },
  ],

  examples: [
    {
      level: 'Intermediate',
      title: 'Resolve a merge conflict end to end',
      problem: 'Two branches both modified the same line of a shared config file, and merging feature into main stops with a conflict.',
      approach:
        'Inspect the conflicted file, decide what the correct final content should be, remove the conflict markers, then stage and commit like any normal change - Git treats the resolved file as the answer to the question it raised.',
      complexity: 'One conflicted file, one manual resolution, one commit - the cost scales with how many lines actually conflict, not repository size.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git switch main
git merge feature
# Auto-merging config.txt
# CONFLICT (content): Merge conflict in config.txt
# Automatic merge failed; fix conflicts and then commit the result.

git status                 # lists config.txt as "both modified"

# --- open config.txt, remove <<<<<<< / ======= / >>>>>>> ---
# --- keep the correct final content ---

git add config.txt
git commit                 # opens editor pre-filled with a merge commit message`,
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Abort a merge that went wrong',
      problem: 'A merge produced more conflicts than expected, or you realize you merged the wrong branch, and you want to cleanly back out before committing.',
      approach:
        '`git merge --abort` restores the pre-merge state exactly, as long as the merge commit itself has not been made yet - the safest possible undo for an in-progress merge.',
      complexity: 'O(1) - restores the previous HEAD and working tree state directly, no history rewrite needed.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git merge feature
# CONFLICT (content): Merge conflict in 4 files...

git merge --abort          # back to exactly how things were before the merge attempt
git status                 # clean - as if the merge never happened`,
        },
      ],
    },
  ],

  advantages: [
    'Conflict markers show both sides of a disagreement directly in the file, giving full context to make the correct resolution decision.',
    'Fast-forward merges are trivially fast and leave no extra merge commit when there is nothing to reconcile.',
    '`--abort` gives a clean, complete escape hatch from a messy merge attempt, as long as it is used before committing.',
  ],
  disadvantages: [
    'Conflict resolution is manual by nature - Git can detect a conflict, but only a human (or explicit merge strategy) can decide the correct resolution.',
    'Large, long-diverged branches tend to produce more and messier conflicts than small, frequently-merged ones.',
    'A forgotten conflict marker left in committed code can silently break builds or introduce nonsensical text into the codebase.',
  ],
  commonMistakes: [
    'Committing a "resolved" file that still contains leftover `<<<<<<<`/`=======`/`>>>>>>>` markers because they were missed during editing.',
    'Panicking and trying to fix a conflict by deleting the whole file instead of editing it down to the correct combined content.',
    'Trying to use `--abort` after already committing the merge - it silently does nothing useful at that point; Day 4\'s `reset`/`revert` are the right tools once a merge is committed.',
    'Assuming every merge will conflict, and being surprised when a clean fast-forward merge produces no prompt at all.',
  ],
  edgeCases: [
    'A merge where both branches deleted the same file - shows as a "deleted by us/them" conflict rather than a content conflict, resolved with `git rm` instead of editing.',
    'A merge where one branch renamed a file the other branch edited - Git usually detects the rename and merges the edit in, but it can still surface as a conflict depending on how much the content changed.',
    'Merging a branch into itself, or a branch that is already fully contained in the target - Git reports "Already up to date," doing nothing.',
  ],
  interviewTips: [
    'Describe a conflict as "Git asking a question it cannot answer itself," not as an error - this framing signals calm, correct understanding under a scenario many candidates find stressful.',
    'Mention the fast-forward vs. three-way distinction unprompted when asked to explain merging - it shows you understand *why* some merges conflict and others never can.',
    'If asked how to safely bail out of a bad merge, `merge --abort` (before commit) is the precise, correct answer - be ready to also state its one limitation (it does not work after the merge commit exists).',
  ],
  realWorldUseCases: [
    'Pull request merges on GitHub/GitLab - the "This branch has conflicts that must be resolved" banner is exactly this mechanism, surfaced in a web UI instead of a terminal.',
    'Long-running feature branches being periodically merged with main to keep divergence (and therefore conflict size) small.',
    'Release branches merging in hotfixes from main, where conflicts often reveal that a fix was already independently made on both sides.',
  ],
  relatedSlugs: ['git-day-2-branching', 'git-day-4-undoing-changes', 'git-day-7-rebasing-collaboration'],

  flashcards: [
    { id: 'g3-f1', front: 'What actually causes a merge conflict?', back: 'Both branches changed the exact same lines differently, and Git cannot determine which version you want.' },
    { id: 'g3-f2', front: 'What do the three conflict marker lines represent?', back: '<<<<<<< HEAD starts your current branch\'s version, ======= separates it from the incoming version, and >>>>>>> branch-name ends the incoming version.' },
    { id: 'g3-f3', front: 'After resolving a conflict, what two commands finish the merge?', back: '`git add` the resolved file(s), then `git commit` to complete the merge commit.' },
    { id: 'g3-f4', front: 'What is a fast-forward merge?', back: 'A merge where the target branch has not moved since diverging, so Git just slides its pointer forward - no merge commit, no possible conflict.' },
    { id: 'g3-f5', front: 'When does `git merge --abort` stop working?', back: 'Once the conflicted merge has already been committed - it only works while the merge is still in progress.' },
    { id: 'g3-f6', front: 'What is the risk of leaving conflict markers in a commit?', back: 'The literal <<<<<<<, =======, >>>>>>> text becomes part of the tracked file, which can break builds or silently corrupt the file\'s meaning.' },
  ],

  practice: [
    {
      id: 'g3-p1',
      title: 'Day 3 milestone: create, resolve, and commit a conflict',
      difficulty: 'Medium',
      description: 'Deliberately create a merge conflict (edit the same line on two branches), resolve it, and commit.',
      constraints: ['Both branches must edit the exact same line of the same file', 'The final commit must not contain any conflict marker lines'],
      hints: ['Diverge two branches from the same starting commit, edit line 1 differently on each, then merge one into the other.'],
      pattern: 'Merge Conflict Resolution',
      url: 'https://git-scm.com/docs/git-merge',
    },
    {
      id: 'g3-p2',
      title: 'Abort a conflicted merge cleanly',
      difficulty: 'Easy',
      description: 'Trigger a conflict on purpose, then back out entirely with `git merge --abort` and confirm the repository is exactly as it was before.',
      constraints: ['Do not commit the merge before aborting'],
      hints: ['`git status` before and after the abort should look identical.'],
      pattern: 'Merge Recovery',
      url: 'https://git-scm.com/docs/git-merge',
    },
    {
      id: 'g3-p3',
      title: 'Trigger a guaranteed fast-forward merge',
      difficulty: 'Easy',
      description: 'Create a branch, commit on it, merge it into main without ever adding new commits to main in the meantime, and confirm no merge commit was created.',
      constraints: ['main must not receive any new commits between branching and merging'],
      hints: ['`git log --oneline --graph` will show a single straight line, not a diamond shape, confirming the fast-forward.'],
      pattern: 'Fast-Forward Merge',
      url: 'https://git-scm.com/docs/git-merge',
    },
  ],

  faqs: [
    { question: 'Is a merge conflict a sign that something is broken?', answer: 'No - it is expected, routine behavior whenever two branches genuinely changed the same lines differently. Git is explicitly asking a question it cannot answer on its own, not reporting an error state.' },
    { question: 'Can I lose work while resolving a conflict?', answer: 'Not if you resolve carefully - both versions are visible in the conflict markers before you edit anything, so nothing is silently discarded. The risk is human error while editing, not Git discarding data.' },
    { question: 'What is the difference between a fast-forward merge and a "normal" merge commit?', answer: 'A fast-forward just moves a pointer forward with no new commit, because the target branch never diverged. A three-way merge creates an actual new commit with two parents, combining genuinely diverged histories - this is the shape that can conflict.' },
  ],

  references: [
    { label: 'Pro Git Book - Basic Branching and Merging (Basic Merge Conflicts)', url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging' },
    { label: 'Git Docs - git-merge', url: 'https://git-scm.com/docs/git-merge' },
  ],
};
