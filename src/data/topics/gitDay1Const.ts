import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 1 - LOCAL CHANGES
 * First module of the "Git in 7 Days" track. Establishes the three-area
 * mental model (Working Directory / Staging Area / Repository) that every
 * later Git day builds on, then covers the local-only commands: init,
 * status, add, commit, diff, log. Nothing here touches a network - that
 * starts on Day 5.
 */
export const gitDay1Topic: Topic = {
  slug: 'git-day-1-local-changes',
  order: 1,
  category: 'Git',
  title: 'Git Day 1 - Local Changes',
  tagline: 'Git is not a save button - it is a history of snapshots. Day 1 is the three areas every command moves between.',
  difficulty: 'Beginner',
  icon: 'pi pi-save',
  estMinutes: 60,
  tags: ['Git', 'Fundamentals', 'Local Workflow'],

  overview:
    "Most people learn Git as a list of commands to copy-paste when stuck - which is exactly why merge conflicts and unexpected `git status` output cause panic later. Before touching a single command, it helps to see that almost everything Git does is just moving content between three areas: the Working Directory (your actual files, as you're editing them), the Staging Area / Index (files marked 'ready for the next snapshot'), and the Repository (`.git`, permanent committed snapshots). `git add` moves working -> staging. `git commit` moves staging -> repository. `git restore` moves it back. Once that clicks, the commands stop feeling random. Day 1 covers exactly this - and nothing else leaves your machine yet, no internet, no collaboration, just tracking changes to your own files.",

  whyItExists:
    "Day 1 exists because everything from Day 2 onward (branches, merges, remotes, rebases) is built on top of this same three-area pipeline - a branch is just a different set of pointers into the same Repository, a merge is combining two histories of the same Repository, a push is syncing your Repository with a remote one. Skipping straight to 'useful' commands like branch and merge without first internalizing Working Directory -> Staging -> Repository is why `git diff` showing nothing after `git add` feels like a bug instead of the expected behavior, and why `git status` reads like noise instead of a to-do list.",

  sections: [
    {
      id: 'how-git-thinks',
      heading: 'How Git actually thinks: three areas, not a save button',
      body: `Git tracks three distinct areas, and reading them left to right is the entire mental model for local work:

| Area | What it holds | Think of it as |
|---|---|---|
| **Working Directory** | Your actual files, as you're editing them | Your desk - messy, in progress |
| **Staging Area (Index)** | Files marked "ready for the next snapshot" | The packing area - things you've selected |
| **Repository (\`.git\`)** | Permanent, committed snapshots | The archive - saved history |

\`\`\`text
Working Directory  --git add-->  Staging Area  --git commit-->  Repository
       ^                              |
       '---------git restore---------'   (also: git restore --staged, moving staging back to working)
\`\`\`

Every Git command is really just moving content between these three areas: \`add\` moves working -> staging, \`commit\` moves staging -> repository, \`restore\` moves it back. This is the big takeaway of the entire 7-day track: **you are not learning random commands - you are learning how to move changes through a simple pipeline: Work -> Stage -> Commit.** Everything else (branching, merging, rebasing, remotes) is a variation on top of this same pipeline, never a replacement for it.`,
      visualizer: 'none',
    },
    {
      id: 'init-status',
      heading: 'git init and git status - creating and reading the repository',
      body: `\`git init\` creates a new, empty \`.git\` directory in the current folder - this turns an ordinary folder into a Git repository. Run once per project; running it again in an already-initialized folder is harmless (it just re-initializes an existing, empty history).

\`git status\` is the single most important command in this entire track, not because it changes anything, but because it *tells you exactly what to do next*: which files are untracked, which are modified but unstaged, which are staged and ready to commit, and which branch you're on. Beginners tend to run it only when confused; the better habit is running it constantly, before and after nearly every other command, until reading its output becomes automatic.`,
    },
    {
      id: 'add-commit',
      heading: 'git add and git commit - moving files through the pipeline',
      body: `\`git add <file>\` stages a single file; \`git add .\` stages every changed file in and below the current directory. Staging is a **selection** step - it lets you build a commit out of only some of your current changes, not necessarily everything you've touched.

\`git add\` does **not** save anything permanently - that is the single most common beginner trap on Day 1. Staging only marks content as "ready"; it is \`git commit -m "message"\` that actually writes a permanent snapshot into the Repository. Running \`git commit\` without \`-m\` opens a text editor (usually Vim) for the commit message instead, which confuses beginners who don't expect an editor to open - always pass \`-m "message"\` until you're deliberately writing a multi-line commit message.`,
    },
    {
      id: 'diff-log',
      heading: 'git diff and git log - inspecting changes and history',
      body: `\`git diff\` shows **unstaged** changes - the difference between the Working Directory and the Staging Area. This is the trap: after running \`git add\`, a plain \`git diff\` shows nothing, because the changes are no longer unstaged - they moved to staging. To see staged changes about to be committed, use \`git diff --staged\` instead.

\`git log\` shows the full commit history, newest commit first (oldest at the bottom, newest at the top) - this ordering is worth memorizing, since it's easy to assume the opposite. \`git log --oneline\` compresses each commit to a single line (short hash + message), which is far more scannable once a project has more than a handful of commits.

| Concept | What it does | The trap |
|---|---|---|
| \`git add\` | Moves file to staging | Doesn't save it - \`commit\` does that |
| \`git commit\` | Saves a permanent snapshot | Without \`-m\`, opens an editor - confuses beginners |
| \`git diff\` | Shows unstaged changes | Shows nothing after \`git add\` - use \`--staged\` |
| \`git status\` | Shows state of all 3 areas | Read it every time - it tells you exactly what to do next |
| \`git log\` | History of commits | Oldest at bottom, newest at top |`,
      visualizer: 'none',
    },
  ],

  dryRuns: [
    {
      title: 'Tracking a file through the three areas',
      input: 'git init, then create hello.txt, stage it, commit it, and edit it again',
      steps: [
        { label: 'git init', detail: 'An empty repository is created - Working Directory, Staging Area, and Repository all exist but are empty.', state: ['Working Dir', 'Staging', 'Repository'] },
        { label: 'create hello.txt', detail: 'The new file exists only in the Working Directory - git status reports it as untracked.', state: ['Working Dir', 'Staging', 'Repository'], highlight: [0] },
        { label: 'git add hello.txt', detail: 'The file is copied into the Staging Area - marked ready for the next snapshot. The Working Directory copy is untouched.', state: ['Working Dir', 'Staging', 'Repository'], highlight: [1] },
        { label: 'git commit -m "add hello"', detail: 'Staging Area content is written permanently into the Repository as a new commit.', state: ['Working Dir', 'Staging', 'Repository'], highlight: [2] },
        { label: 'edit hello.txt again', detail: 'The file changes again, but only in the Working Directory - the Repository still holds the previously committed version.', state: ['Working Dir', 'Staging', 'Repository'], highlight: [0] },
      ],
      result: '`git diff` now shows the new unstaged edit; `git diff --staged` shows nothing until you `git add` again - the edit has not reached the Staging Area yet.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Track a new file end to end',
      problem: 'A new file needs to become a permanent, committed part of the project history.',
      approach:
        'Stage it explicitly so Git knows it should be part of the next snapshot, then commit to write that snapshot permanently. Two commands, fully local - no network round trip needed.',
      complexity: 'Local-only workflow - one `add` + one `commit`, no network required.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git init
echo "hello git" > hello.txt

git status              # hello.txt shown as untracked
git add hello.txt        # moves it to the Staging Area
git status               # now shown as staged, ready to commit
git commit -m "Add hello.txt"

git log --oneline        # confirms the commit exists`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Review a change before committing it',
      problem: 'You edited a tracked file and want to confirm exactly what changed before staging and committing it.',
      approach:
        '`git diff` (no flag) shows the unstaged difference against the last commit. After staging, that same diff moves to `--staged`, which is the most common source of "why does diff show nothing" confusion.',
      complexity: 'Local-only - inspecting a diff never touches the network.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `echo "hello git, updated" > hello.txt

git diff                 # shows the unstaged change
git add hello.txt
git diff                 # shows NOTHING - the change is now staged
git diff --staged        # shows the change here instead
git commit -m "Update hello.txt"`,
        },
      ],
    },
  ],

  advantages: [
    'The three-area model (Working Directory / Staging / Repository) explains every later Git command instead of requiring each one to be memorized independently.',
    'Staging lets you build a commit out of only some of your current changes, instead of forcing an all-or-nothing snapshot.',
    'Fully local - you can experiment, make mistakes, and inspect history freely without any risk to a shared/remote copy.',
  ],
  disadvantages: [
    'The staging step is an extra layer beginners coming from simpler "save" tools do not expect, and it is the single biggest source of early confusion.',
    'Commit messages without `-m` silently open an editor, which looks like a hang to someone unfamiliar with Vim.',
    'None of Day 1 is backed up anywhere else yet - a deleted `.git` folder loses everything, since nothing has been pushed to a remote.',
  ],
  commonMistakes: [
    'Assuming `git add` saves the file permanently, then being surprised the change is gone after a bad `git reset` or a crash.',
    'Running `git diff` after `git add` and concluding "the change disappeared" instead of checking `git diff --staged`.',
    'Running `git commit` without `-m`, panicking at the editor that opens, and force-closing the terminal instead of saving and exiting.',
    'Ignoring `git status` output and guessing at the next command instead of reading what it explicitly recommends.',
  ],
  edgeCases: [
    'Running `git init` in a folder that already has a `.git` directory - safe, it just re-initializes without touching existing commits.',
    'Staging a file, then editing it again before committing - the staged version and the working-directory version can now differ, and `git status` will show the file in both the staged and unstaged sections simultaneously.',
    'Committing with an empty staging area - Git refuses with "nothing to commit, working tree clean" rather than creating an empty commit (unless `--allow-empty` is explicitly passed).',
  ],
  interviewTips: [
    'If asked to explain Git in one sentence, describe the three-area pipeline (Working Directory -> Staging -> Repository) rather than listing commands - it demonstrates you understand the model, not just the syntax.',
    'Mention that `add` and `commit` are separate steps on purpose - staging lets you craft focused, reviewable commits instead of dumping every change into one.',
    'If asked why `git diff` "shows nothing," immediately reach for `--staged` as the explanation - this is a very common real-world debugging question.',
  ],
  realWorldUseCases: [
    'Splitting unrelated changes into separate, focused commits by staging one file (or even one hunk, via `git add -p`) at a time.',
    'Using `git status` as a pre-commit checklist to avoid accidentally committing debug code, temp files, or unrelated edits.',
    'Reading `git log --oneline` to quickly scan a project\'s history during code review or onboarding, before diving into full diffs.',
  ],
  relatedSlugs: ['git-day-2-branching', 'git-day-4-undoing-changes'],

  flashcards: [
    { id: 'g1-f1', front: 'What are the three areas every Git command moves content between?', back: 'Working Directory, Staging Area (Index), and Repository (.git).' },
    { id: 'g1-f2', front: 'Does `git add` permanently save a file?', back: 'No - it only moves it to the Staging Area. `git commit` is what writes a permanent snapshot.' },
    { id: 'g1-f3', front: 'Why does `git diff` show nothing right after `git add`?', back: 'Because plain `git diff` only shows UNSTAGED changes; after `add`, the change is staged, so you need `git diff --staged` to see it.' },
    { id: 'g1-f4', front: 'What happens if you run `git commit` without `-m`?', back: 'Git opens a text editor (usually Vim) for you to write the commit message interactively.' },
    { id: 'g1-f5', front: 'In `git log` output, which commit appears at the top?', back: 'The newest commit - oldest is at the bottom.' },
    { id: 'g1-f6', front: 'Why is `git status` considered the most important command on Day 1?', back: "It reads the state of all three areas at once and tells you exactly what to do next, rather than requiring you to guess." },
  ],

  practice: [
    {
      id: 'g1-p1',
      title: 'Day 1 milestone: init, stage, commit, diff',
      difficulty: 'Easy',
      description: 'Initialize a repo, create a file, stage it, commit it, then edit the file again and view the diff - without looking anything up.',
      constraints: ['Do it from an empty folder', 'No copy-pasting commands from this page while attempting it'],
      hints: ['`git status` after every step tells you exactly what to do next.'],
      pattern: 'Local Git Workflow',
      url: 'https://git-scm.com/docs/git-init',
    },
    {
      id: 'g1-p2',
      title: 'Stage only part of a change',
      difficulty: 'Medium',
      description: 'Edit two different files, but craft a single commit that includes only one of them by staging selectively.',
      constraints: ['Both files must actually be modified in your working directory', 'Only one file should appear in the resulting commit'],
      hints: ['`git add <specific-file>` instead of `git add .` is the whole trick.'],
      pattern: 'Selective Staging',
      url: 'https://git-scm.com/docs/git-add',
    },
    {
      id: 'g1-p3',
      title: 'Read history without full diffs',
      difficulty: 'Easy',
      description: 'Make three small commits, then use `git log --oneline` to identify the exact order they happened in.',
      constraints: ['At least 3 distinct commits'],
      hints: ['Compare the short-hash order in `--oneline` against the newest-first rule.'],
      pattern: 'History Inspection',
      url: 'https://git-scm.com/docs/git-log',
    },
  ],

  faqs: [
    { question: 'Is `git add .` safe to run all the time?', answer: 'It stages every change in and below the current directory, which is convenient but stages everything indiscriminately - including files you may not have meant to include. For a quick personal commit it is usually fine; for a focused, reviewable commit, staging specific files (or hunks) is safer.' },
    { question: 'Why does Git need a separate staging step at all - why not just commit the working directory directly?', answer: 'Staging lets you build a commit out of only part of your current changes, review exactly what will be committed with `git diff --staged` before it becomes permanent, and split unrelated edits into separate, focused commits.' },
    { question: 'Does `git init` require an internet connection?', answer: 'No - Day 1 is entirely local. `init`, `status`, `add`, `commit`, `diff`, and `log` all operate purely on your machine; nothing is synced anywhere until Day 5 introduces remotes.' },
  ],

  references: [
    { label: 'Pro Git Book - Getting Started: Git Basics', url: 'https://git-scm.com/book/en/v2/Getting-Started-Git-Basics' },
    { label: 'Git Docs - git-status', url: 'https://git-scm.com/docs/git-status' },
    { label: 'Git Docs - git-commit', url: 'https://git-scm.com/docs/git-commit' },
  ],
};
