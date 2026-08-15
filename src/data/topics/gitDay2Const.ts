import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 2 - BRANCHING
 * Second module of the "Git in 7 Days" track. Core idea: a branch is a
 * movable pointer to a commit, not a copy of the project - which is why
 * creating one is instant even on huge repos. Covers branch, checkout,
 * switch, and branch -d.
 */
export const gitDay2Topic: Topic = {
  slug: 'git-day-2-branching',
  order: 2,
  category: 'Git',
  title: 'Git Day 2 - Branching',
  tagline: 'A branch is not a copy of your project - it is just a movable pointer to a commit.',
  difficulty: 'Beginner',
  icon: 'pi pi-sitemap',
  estMinutes: 60,
  tags: ['Git', 'Branching'],

  overview:
    "Day 1 built the three-area pipeline (Working Directory -> Staging -> Repository); Day 2 adds a second axis on top of it: branches. A branch is not a copy of your project's files - it is a lightweight, movable label pointing at a specific commit. Creating a branch is instant, even on a repository with a huge history, because Git is not copying anything - it is just adding a new pointer next to the existing ones. Switching branches simply changes which commit your pointer (and therefore your Working Directory) currently reflects.",

  whyItExists:
    "Branching exists to let multiple lines of work exist simultaneously without interfering with each other - a bugfix, a feature, and a stable release can all progress in parallel, each as its own sequence of commits, without one clobbering the others' Working Directory state. Understanding branches as pointers (not copies) is the single idea that makes Day 3 (merging two histories back together) and Day 7 (rebasing, rewriting where a branch's history starts) make sense - both are really just operations on where these pointers live relative to each other.",

  sections: [
    {
      id: 'branch-as-pointer',
      heading: 'A branch is a pointer, not a copy',
      body: `main and a feature branch can diverge from a shared commit and both continue independently:

\`\`\`text
main:      A---B---C
                    \\\\
feature:             D---E
\`\`\`

Both \`main\` and \`feature\` exist as pointers - \`main\` still points at \`C\`, \`feature\` points at \`E\`. Switching branches just moves which snapshot your Working Directory reflects; it does not duplicate any files on disk beyond what Git already stores as commits. This is why \`git branch <name>\` is effectively instant regardless of repository size - it writes a single small pointer file, nothing more.`,
      visualizer: 'none',
    },
    {
      id: 'branch-checkout-switch',
      heading: 'git branch, git checkout, and git switch',
      body: `\`git branch\` (no args) lists existing branches; \`git branch <branch-name>\` creates a new branch pointer at the current commit **without switching to it**.

\`git checkout <branch-name>\` switches your Working Directory to reflect that branch's commit. \`git checkout -b <branch-name>\` creates **and** switches in one step - this is the older syntax, but it is still extremely common in real projects and documentation.

\`git switch <branch-name>\` is the newer, purpose-built command for changing branches (checkout historically did too many unrelated things - switching branches *and* restoring files - which is why \`switch\` and \`restore\` were split out). \`git switch -c <branch-name>\` is the newer equivalent of \`checkout -b\`: create and switch in one step. \`switch\` is cleaner but not universally used in older tutorials or muscle memory yet, so recognizing both forms matters.`,
    },
    {
      id: 'deleting-branches',
      heading: 'Deleting branches safely with branch -d',
      body: `\`git branch -d <branch-name>\` deletes a branch pointer - but only if its commits have already been merged elsewhere, so no work is lost. If the branch has unmerged commits, Git refuses and tells you so; forcing the deletion anyway requires the uppercase \`-D\` flag, which is a deliberate, separate action rather than an accident.

| Concept | What it does | The trap |
|---|---|---|
| \`checkout -b\` | Create + switch in one step | Old syntax, still very common |
| \`switch -c\` | Same, newer command | Cleaner but not everywhere yet |
| \`branch -d\` | Delete a merged branch | Won't delete unmerged work - use \`-D\` to force |
| Branch = pointer | Not a file copy | This is why branching is instant, even on huge repos |`,
      visualizer: 'none',
    },
  ],

  dryRuns: [
    {
      title: 'Branching is a pointer, not a copy',
      input: 'main is at commit C (after A -> B -> C); create feature and commit twice on it',
      steps: [
        { label: 'Start on main', detail: 'main points at C, reached via commits A -> B -> C.', state: ['A', 'B', 'C'], highlight: [2] },
        { label: 'git checkout -b feature', detail: 'A new pointer "feature" is created at the same commit C. No files are copied - just a new label.', state: ['A', 'B', 'C'], highlight: [2] },
        { label: 'commit D on feature', detail: 'feature moves forward to D. main is completely untouched and still points at C.', state: ['A', 'B', 'C', 'D'], highlight: [3] },
        { label: 'commit E on feature', detail: 'feature advances to E. main still points at C.', state: ['A', 'B', 'C', 'D', 'E'], highlight: [4] },
        { label: 'git switch main', detail: "The Working Directory now reflects commit C's snapshot - D and E are invisible from here until you merge or switch back.", state: ['A', 'B', 'C', 'D', 'E'], highlight: [2] },
      ],
      result: 'main never had D or E, because a branch is only a pointer - switching just moves which commit\'s snapshot your files reflect, nothing is duplicated or lost.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Create a feature branch without touching main',
      problem: 'You want to start work on a new feature without risking main until it is ready.',
      approach:
        'Create and switch to a new branch in one step. Both the modern (`switch -c`) and classic (`checkout -b`) forms do exactly the same thing - either is correct.',
      complexity: 'O(1) - branch creation is a single pointer write, independent of repository size.',
      code: [
        {
          language: 'bash',
          label: 'Modern (switch)',
          code: `git switch -c feature/login-form

# ...make changes, git add, git commit...

git switch main       # back to main, feature/login-form untouched`,
        },
        {
          language: 'bash',
          label: 'Classic (checkout)',
          code: `git checkout -b feature/login-form

# ...make changes, git add, git commit...

git checkout main     # back to main, feature/login-form untouched`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Clean up a branch after it has been merged',
      problem: 'A feature branch has been merged into main and is no longer needed - keep the branch list tidy.',
      approach:
        'Use `branch -d`, not `-D`. Because `-d` refuses to delete unmerged work, it doubles as a safety check that the merge actually happened before you remove the pointer.',
      complexity: 'O(1) - deleting a branch removes a single pointer, not any commits it pointed to (they stay reachable from main).',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git branch                     # confirm you're not currently on the branch
git switch main
git merge feature/login-form   # merge it in first (covered in Day 3)
git branch -d feature/login-form   # safe: refuses if unmerged`,
        },
      ],
    },
  ],

  advantages: [
    'Branch creation and switching are effectively instant, regardless of repository size, because branches are pointers, not file copies.',
    'Multiple lines of work (features, bugfixes, releases) can progress in parallel without interfering with each other\'s Working Directory state.',
    '`branch -d` refuses to delete unmerged work by default, making accidental history loss from cleanup unlikely.',
  ],
  disadvantages: [
    'Uncommitted changes can block a branch switch if they would be overwritten, which surprises users expecting `switch`/`checkout` to always succeed.',
    'Having both `checkout` and `switch` in common use (old vs. new syntax) can be confusing to newcomers reading mixed documentation.',
    'Long-lived, rarely-merged branches drift far from main over time, making an eventual merge or rebase progressively harder.',
  ],
  commonMistakes: [
    'Committing directly on main out of habit instead of creating a branch first, especially under time pressure.',
    'Using `-D` (force delete) reflexively instead of `-d`, deleting a branch with unmerged commits without realizing it.',
    'Forgetting which branch you are currently on and committing work to the wrong one - `git status` and `git branch` both show the current branch and should be checked when unsure.',
  ],
  edgeCases: [
    'Deleting the branch you are currently on - Git refuses; you must switch away first.',
    'Two branches created from the exact same commit with no divergence yet - deleting either one is always safe, since neither holds unique commits.',
    'A branch name that looks like a file path (e.g. `feature/login`) - Git supports slashes in branch names as a namespacing convention, not a literal directory requirement.',
  ],
  interviewTips: [
    'Describe a branch as "a movable pointer to a commit," not "a copy of the codebase" - this single distinction is a strong signal of real understanding versus rote command memorization.',
    'If asked why branching is fast even on huge repositories, explain that creating one only writes a small pointer - it does not duplicate the working tree or history.',
    'Mention `-d` vs `-D` unprompted when discussing branch cleanup - it demonstrates awareness of a real safety mechanism, not just the happy path.',
  ],
  realWorldUseCases: [
    'Feature branch workflows - each new feature or fix gets its own branch, kept isolated from main until it is reviewed and merged.',
    'Trunk-based development with short-lived branches - branches exist for hours or a couple of days, then merge and get deleted, keeping divergence small.',
    'Release branches - a `release/2.0` branch can be cut from main and stabilized independently while main keeps accepting new feature work.',
  ],
  relatedSlugs: ['git-day-1-local-changes', 'git-day-3-merging-conflicts', 'git-day-7-rebasing-collaboration'],

  flashcards: [
    { id: 'g2-f1', front: 'What is a Git branch, structurally?', back: 'A movable pointer to a specific commit - not a copy of the project files.' },
    { id: 'g2-f2', front: 'Why is creating a branch instant even on a huge repository?', back: 'Because it only writes a small new pointer, and copies no files or history.' },
    { id: 'g2-f3', front: 'What does `git checkout -b feature` do?', back: 'Creates a new branch called "feature" AND switches to it, in one step.' },
    { id: 'g2-f4', front: 'What is the newer equivalent of `git checkout -b`?', back: '`git switch -c` - same effect, cleaner dedicated command.' },
    { id: 'g2-f5', front: 'What is the difference between `git branch -d` and `git branch -D`?', back: '`-d` only deletes a branch if it has already been merged (safe); `-D` force-deletes regardless, which can permanently lose unmerged commits.' },
    { id: 'g2-f6', front: 'After creating "feature" from main and committing on it, does main gain those commits?', back: 'No - main\'s pointer never moves; only feature\'s pointer advances. main is unaffected until an explicit merge.' },
  ],

  practice: [
    {
      id: 'g2-p1',
      title: 'Day 2 milestone: branch, commit, switch, explain',
      difficulty: 'Easy',
      description: 'Create a branch, make a commit on it, switch back to main, and explain out loud why main doesn\'t have that commit.',
      constraints: ['Use either checkout -b or switch -c', 'Confirm with git log on both branches'],
      hints: ['`git log --oneline` on main vs. on the branch will visibly differ by exactly the commit you made.'],
      pattern: 'Branch Isolation',
      url: 'https://git-scm.com/docs/git-branch',
    },
    {
      id: 'g2-p2',
      title: 'Force-delete an unmerged branch and understand the cost',
      difficulty: 'Medium',
      description: 'Create a branch, commit on it without merging, delete it with -d (observe the refusal), then delete it with -D and confirm the commit is now unreachable from any branch.',
      constraints: ['Do not merge the branch first', 'Note exactly what warning -d gives before switching to -D'],
      hints: ['`git log --all` after the -D delete will no longer show the branch\'s commit unless you know its hash.'],
      pattern: 'Branch Cleanup Safety',
      url: 'https://git-scm.com/docs/git-branch',
    },
    {
      id: 'g2-p3',
      title: 'Compare checkout and switch side by side',
      difficulty: 'Easy',
      description: 'Create two branches from the same commit, one using `checkout -b` and one using `switch -c`, and confirm both behave identically.',
      constraints: ['Both branches must start from the same commit'],
      hints: ['`git log --oneline --all --graph` will show both branches pointing at the same starting commit.'],
      pattern: 'Command Equivalence',
      url: 'https://git-scm.com/docs/git-switch',
    },
  ],

  faqs: [
    { question: 'Should I use `git checkout` or `git switch` going forward?', answer: '`switch` (for changing branches) and `restore` (for restoring files) are the newer, purpose-built replacements for the two very different jobs `checkout` used to do at once. Either works, but `switch`/`restore` are clearer about intent - expect to see both in real codebases for a long time.' },
    { question: 'Does deleting a branch delete its commits?', answer: 'Only if those commits are not reachable from any other branch. `branch -d` protects against this by refusing to delete unmerged work; `branch -D` bypasses that protection and can make commits unreachable (though they usually remain recoverable via `git reflog` for a while).' },
    { question: 'Why can\'t I switch branches sometimes?', answer: 'Git blocks a switch if it would silently overwrite uncommitted changes that conflict with the target branch\'s version of a file. Commit, stash (Day 6), or discard the changes first.' },
  ],

  references: [
    { label: 'Pro Git Book - Git Branching: Basic Branching and Merging', url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging' },
    { label: 'Git Docs - git-switch', url: 'https://git-scm.com/docs/git-switch' },
    { label: 'Git Docs - git-branch', url: 'https://git-scm.com/docs/git-branch' },
  ],
};
