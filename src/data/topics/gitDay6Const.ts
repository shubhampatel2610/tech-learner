import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 6 - STASHING & HISTORY
 * Sixth module of the "Git in 7 Days" track. Core idea: stash is a
 * temporary shelf for uncommitted work when you need to switch branches
 * but aren't ready to commit yet. Covers stash, log --graph, blame, and
 * cherry-pick.
 */
export const gitDay6Topic: Topic = {
  slug: 'git-day-6-stashing-history',
  order: 6,
  category: 'Git',
  title: 'Git Day 6 - Stashing & History',
  tagline: 'Shelve uncommitted work with stash, then read history with log --graph, blame, and cherry-pick.',
  difficulty: 'Intermediate',
  icon: 'pi pi-history',
  estMinutes: 60,
  tags: ['Git', 'Stash', 'History'],

  overview:
    "Day 2 showed that switching branches is instant when your Working Directory is clean - but what about when it isn't? Sometimes you need to switch branches mid-change, before your work is ready to commit. `git stash` is a temporary shelf: it saves your uncommitted changes (both staged and unstaged) outside of the normal commit history, resets your Working Directory to match the last commit, and lets you bring those changes back later exactly as they were. The second half of Day 6 turns to reading history more deeply - visualizing branch structure with `log --graph`, attributing lines with `blame`, and copying individual commits between branches with `cherry-pick`.",

  whyItExists:
    "Stashing exists to solve a specific, very common interruption: you're mid-change, and something more urgent (a bug fix, a different branch) needs your attention right now, but your current change is not commit-worthy yet. Without stash, the only options are an awkward half-finished commit or losing the work entirely. `log --graph`, `blame`, and `cherry-pick` round out Day 6 because they are the tools for understanding and selectively reusing history once a project has enough of it to no longer be trivial to hold in your head.",

  sections: [
    {
      id: 'stash-basics',
      heading: 'git stash - a temporary shelf for uncommitted work',
      body: `\`git stash\` (with no arguments) saves all uncommitted changes - staged and unstaged - onto a stack, then resets the Working Directory to match the last commit, as if the changes never happened. \`git stash list\` shows everything currently shelved, since stashes are stacked and it is easy to lose track of which is which if you stash more than once.

\`git stash pop\` re-applies the most recent stash **and removes it from the list** - this is what you want most of the time. \`git stash apply\` re-applies the most recent stash but **keeps it in the list**, useful when you might want to apply the same shelved changes to more than one branch. \`git stash drop\` deletes a stash entry without applying it, for cleaning up ones you no longer need.`,
    },
    {
      id: 'stash-conflicts',
      heading: 'When stash pop conflicts',
      body: `Popping (or applying) a stash can conflict, exactly like a merge, if the Working Directory has changed in a way that overlaps with the stashed content - for example, if you stashed a change, then made a *different* edit to the same lines before popping. Git will surface the same \`<<<<<<<\` / \`=======\` / \`>>>>>>>\` conflict markers from Day 3, and resolution works the same way: edit to the correct content, remove the markers, then stage the result. Because \`pop\` removes the stash entry immediately on success but leaves it in place if a conflict occurs, a conflicted pop is not "lost" - it stays in the stash list until you resolve things and clean up manually with \`stash drop\`.

| Concept | What it does | The trap |
|---|---|---|
| \`stash\` | Shelves uncommitted work | Stashes are stacked - easy to lose track of which is which |
| \`stash pop\` | Applies + removes from stash list | Can conflict if the working directory changed |
| \`stash apply\` | Applies but keeps it in the list | Use when you might need it again |
| \`cherry-pick\` | Copies one commit onto current branch | Can create duplicate commits if misused |
| \`blame\` | Shows who last changed each line | Great for finding context, not for finger-pointing |`,
      visualizer: 'none',
    },
    {
      id: 'log-graph-blame-cherry-pick',
      heading: 'log --graph, blame, and cherry-pick',
      body: `\`git log --graph --oneline --all\` renders commit history as an ASCII graph, showing exactly how branches diverged and merged - far easier to reason about visually than a flat list once a project has more than one active branch.

\`git blame <file>\` annotates every line of a file with the commit (and author) that last changed it. It is a tool for finding **context** - "why does this line exist, what was the reasoning in that commit's message" - not for assigning fault; treating it as a finger-pointing tool misses its actual value in day-to-day debugging and code archaeology.

\`git cherry-pick <commit-hash>\` copies the changes from a single, specific commit and applies them as a new commit on your current branch - useful for pulling one bugfix out of a branch without merging everything else from it. The trap: cherry-picking a commit that later gets merged normally (via its original branch) can create a duplicate commit with the same changes but a different hash, which shows up twice in history unless deliberately avoided.`,
    },
  ],

  dryRuns: [
    {
      title: 'Stash, switch, and pop without losing work',
      input: 'Mid-edit on a feature branch, need to fix an urgent bug on main',
      steps: [
        { label: 'Editing feature.txt', detail: 'Uncommitted changes exist in the Working Directory - not ready to commit yet.' },
        { label: 'git stash', detail: 'The uncommitted changes are shelved; the Working Directory now matches the last commit again.' },
        { label: 'git switch main', detail: 'The switch succeeds cleanly, because there are no uncommitted changes left to conflict with it.' },
        { label: 'Fix bug, commit, switch back', detail: '`git switch feature` returns to the original branch, still with an empty Working Directory.' },
        { label: 'git stash pop', detail: 'The shelved changes are reapplied to the Working Directory and removed from the stash list.' },
      ],
      result: 'The mid-change work survived a branch switch and an unrelated bug fix in between, without ever being committed.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Switch branches mid-change without committing early',
      problem: 'You are partway through an edit on feature branch and need to quickly check something on main, but the edit is not ready to be a commit.',
      approach:
        '`stash` shelves the incomplete work so the branch switch is clean, then `stash pop` brings it back exactly where you left off once you return.',
      complexity: 'O(1) relative to change size - a single shelve and a single restore, no commit created.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git status                  # feature.txt modified, not staged

git stash                    # working directory is clean now
git switch main
# ...check something, switch back...
git switch feature

git stash pop                 # feature.txt is modified again, exactly as left`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Pull a single bugfix commit onto another branch',
      problem: 'A bugfix was committed on a feature branch, but a separate release branch needs just that fix, not the rest of the feature.',
      approach:
        '`cherry-pick` copies exactly one commit\'s changes onto the current branch, without pulling in any other unrelated commits from the source branch.',
      complexity: 'Copies exactly one commit\'s diff - cost is proportional to that commit\'s changes, not the whole branch.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git log feature --oneline
# f4a5b6c  Fix null pointer in checkout
# e3d4c5b  Add discount banner UI (do NOT want this on release)

git switch release
git cherry-pick f4a5b6c        # only the bugfix commit is applied here

git log --oneline -1            # new commit, same fix, new hash`,
        },
      ],
    },
  ],

  advantages: [
    'Stash lets you switch context immediately without forcing a premature, half-finished commit.',
    '`log --graph --oneline --all` makes branch structure and merge points visually obvious instead of requiring mental reconstruction from a flat list.',
    '`cherry-pick` allows selectively reusing exactly one useful commit without merging an entire branch.',
  ],
  disadvantages: [
    'Stashes are stacked and unnamed by default, making it easy to lose track of which stash corresponds to which piece of work if several accumulate.',
    'Popping a stash can produce conflicts just like a merge, which is an unwelcome surprise if you expected it to always apply cleanly.',
    'Cherry-picking the same logical change onto two branches that later merge can create duplicate, confusing history entries.',
  ],
  commonMistakes: [
    'Stashing repeatedly without ever running `stash list`, then forgetting what is shelved or in what order.',
    'Using `stash apply` when `stash pop` was intended, leaving a stale duplicate entry sitting in the stash list indefinitely.',
    'Treating `git blame` output as "whose fault is this" rather than "what was the reasoning behind this line," which discourages using a genuinely useful debugging tool.',
    'Cherry-picking a commit and later merging its original branch anyway, producing the same change twice in history.',
  ],
  edgeCases: [
    'Stashing when there are no changes at all - Git reports "No local changes to save" and does nothing destructive.',
    'A stash that conflicts on pop is not discarded - it remains in the stash list until you resolve the conflict and explicitly drop it.',
    'Cherry-picking a commit that depends on earlier changes not present on the target branch can itself produce a conflict, resolved the same way as a merge conflict.',
  ],
  interviewTips: [
    'Describe stash as "a temporary shelf outside of commit history," distinguishing it clearly from a commit - this distinction is often glossed over by candidates who use it casually.',
    'Mention that `blame` is a context-finding tool, not a blame-assigning one, if the topic comes up - it is a small but telling detail about code review culture.',
    'If asked how to pull one fix out of a larger branch, `cherry-pick` is the precise answer, with the caveat about potential duplicate commits if that branch later merges too.',
  ],
  realWorldUseCases: [
    'Stashing local experiments before pulling in urgent hotfix work, then restoring the experiment afterward.',
    '`git log --graph --oneline --all` used routinely before a rebase or merge to visually confirm the actual shape of divergence.',
    'Backporting a single security fix from a main development branch onto an older, still-supported release branch via cherry-pick.',
  ],
  relatedSlugs: ['git-day-2-branching', 'git-day-4-undoing-changes', 'git-day-7-rebasing-collaboration'],

  flashcards: [
    { id: 'g6-f1', front: 'What does `git stash` save, and where does it put your Working Directory afterward?', back: 'It saves all staged and unstaged uncommitted changes onto a stack, then resets the Working Directory to match the last commit.' },
    { id: 'g6-f2', front: 'What is the difference between `stash pop` and `stash apply`?', back: '`pop` re-applies the most recent stash and removes it from the list; `apply` re-applies it but keeps it in the list for reuse.' },
    { id: 'g6-f3', front: 'Can `git stash pop` produce a merge-style conflict?', back: 'Yes - if the Working Directory changed in a way that overlaps with the stashed content since it was shelved.' },
    { id: 'g6-f4', front: 'What does `git cherry-pick <hash>` do?', back: 'Copies the changes from that single commit and applies them as a new commit on the current branch.' },
    { id: 'g6-f5', front: 'What is `git blame` actually useful for?', back: 'Finding the context and reasoning behind a specific line of code (which commit/author last changed it), not assigning fault.' },
    { id: 'g6-f6', front: 'Why is `git log --graph --oneline --all` more useful than plain `git log` on a multi-branch project?', back: 'It renders branch structure and merge points visually, making divergence and history shape obvious instead of requiring mental reconstruction.' },
  ],

  practice: [
    {
      id: 'g6-p1',
      title: 'Day 6 milestone: stash, switch, and pop',
      difficulty: 'Easy',
      description: 'Start editing a file, stash it mid-change, switch branches, switch back, and pop the stash.',
      constraints: ['Do not commit the change at any point', 'Confirm the file content matches exactly before and after the round trip'],
      hints: ['`git stash list` before the pop confirms exactly one entry is shelved.'],
      pattern: 'Uncommitted Work Preservation',
      url: 'https://git-scm.com/docs/git-stash',
    },
    {
      id: 'g6-p2',
      title: 'Reproduce and resolve a stash pop conflict',
      difficulty: 'Hard',
      description: 'Stash a change, make a different edit to the same lines, then pop the stash and resolve the resulting conflict.',
      constraints: ['The conflict must be genuine, not simulated by hand-editing markers'],
      hints: ['Stash first, then edit the exact same line differently before popping - mirrors the Day 3 conflict setup.'],
      pattern: 'Stash Conflict Resolution',
      url: 'https://git-scm.com/docs/git-stash',
    },
    {
      id: 'g6-p3',
      title: 'Cherry-pick a single commit onto another branch',
      difficulty: 'Medium',
      description: 'Commit two unrelated changes on one branch, then cherry-pick only one of them onto a second branch.',
      constraints: ['Only one of the two commits should end up on the target branch'],
      hints: ['`git log --oneline` on the target branch afterward should show exactly one new commit, not two.'],
      pattern: 'Selective Commit Reuse',
      url: 'https://git-scm.com/docs/git-cherry-pick',
    },
  ],

  faqs: [
    { question: 'Does stashing create a commit?', answer: 'No - a stash lives outside normal commit history, on its own stack. It will not show up in `git log`, only in `git stash list`.' },
    { question: 'How many things can I have stashed at once?', answer: 'As many as you want - stashes are stacked. This is exactly why `git stash list` matters: without checking it, it is easy to accumulate several shelved changes and lose track of which is which.' },
    { question: 'Is cherry-picking the same as merging?', answer: 'No - a merge brings in an entire branch\'s divergent history (potentially many commits) as a combined result; cherry-pick copies exactly one specific commit\'s changes, deliberately leaving everything else on that branch behind.' },
  ],

  references: [
    { label: 'Pro Git Book - Stashing and Cleaning', url: 'https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning' },
    { label: 'Git Docs - git-stash', url: 'https://git-scm.com/docs/git-stash' },
    { label: 'Git Docs - git-cherry-pick', url: 'https://git-scm.com/docs/git-cherry-pick' },
  ],
};
