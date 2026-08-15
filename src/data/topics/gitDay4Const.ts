import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 4 - UNDOING CHANGES
 * Fourth module of the "Git in 7 Days" track. Core idea: Git has three
 * different "undo" commands because they undo three different things -
 * picking the wrong one is the #1 cause of lost work. Covers restore,
 * reset, revert, and checkout --.
 */
export const gitDay4Topic: Topic = {
  slug: 'git-day-4-undoing-changes',
  order: 4,
  category: 'Git',
  title: 'Git Day 4 - Undoing Changes',
  tagline: 'Three different undo commands exist because they undo three different things - picking the wrong one is the #1 cause of lost work.',
  difficulty: 'Intermediate',
  icon: 'pi pi-undo',
  estMinutes: 60,
  tags: ['Git', 'Undo', 'Recovery'],

  overview:
    "Days 1-3 covered moving forward: staging, committing, branching, merging. Day 4 covers moving backward - and it is the day most likely to cause real damage if rushed, because Git offers several different \"undo\" commands that look similar but behave very differently. Picking the wrong one is the single most common cause of genuinely lost work in Git. The fix is a simple decision table: know exactly what you're undoing (an uncommitted edit? a staged file? a whole commit? a commit someone else already has?) before reaching for any command.",

  whyItExists:
    "This module exists because `reset`, `restore`, `revert`, and `checkout --` are frequently used interchangeably in casual conversation (\"just reset it\") despite doing fundamentally different things - some only touch the Working Directory, some rewrite history, and only one of them is safe to use on a commit that has already been pushed and pulled by others. Without a clear decision table, the natural failure mode is reaching for the most familiar command (often `reset --hard`) regardless of the situation, which is the one command on this page capable of permanently deleting work with no warning.",

  sections: [
    {
      id: 'decision-table',
      heading: 'The decision table: which undo do you actually need?',
      body: `Git has three different "undo" commands because they undo different things - always start from what you're trying to undo, not from a remembered command name:

| I want to... | Use this | Rewrites history? |
|---|---|---|
| Discard uncommitted changes in a file | \`git restore <file>\` | No |
| Unstage a file (keep changes) | \`git restore --staged <file>\` | No |
| Undo the last commit, keep changes unstaged | \`git reset --soft HEAD~1\` | Yes |
| Undo the last commit, discard changes | \`git reset --hard HEAD~1\` | Yes |
| Undo a commit that's already pushed/shared | \`git revert <commit-hash>\` | No - adds a new commit instead |

**The trap:** \`reset --hard\` is the only command on this list that can permanently delete work with no warning. \`revert\` is the safe choice once a commit is shared with others, because it doesn't rewrite history others may have already pulled.`,
      visualizer: 'none',
    },
    {
      id: 'restore',
      heading: 'git restore - working directory and staging, non-destructive to history',
      body: `\`git restore <file>\` discards uncommitted changes in the Working Directory, replacing the file with its last committed version. \`git restore --staged <file>\` does the opposite job: it unstages a file (moves it back from Staging to Working Directory) **without touching its content** - the edits are still there, just no longer marked ready to commit.

Neither form touches commit history - they only move content between the Working Directory and Staging Area, which is exactly the same pipeline from Day 1, just running in reverse. \`git checkout -- <file>\` is the older syntax for the same "discard working directory changes" behavior that \`restore\` replaced, and is still common in older scripts and habits.`,
    },
    {
      id: 'reset',
      heading: 'git reset - rewriting where the branch pointer is',
      body: `\`git reset\` moves your current branch's pointer to a different commit, and its flag controls what happens to the commits you're moving away from:

- \`git reset --soft HEAD~1\` moves the branch pointer back one commit, but leaves all of that commit's changes sitting in the Staging Area - nothing is lost, you can immediately re-commit (perhaps with a better message) or add more changes first.
- \`git reset --hard HEAD~1\` moves the branch pointer back one commit **and** discards all changes from the Working Directory and Staging Area to match - this is the one command that can permanently delete work with no warning, because there is no conflict marker or confirmation prompt standing between you and data loss.

Both forms **rewrite history** - the commit you reset away from is no longer part of the branch (though it may briefly remain recoverable via \`git reflog\`).`,
    },
    {
      id: 'revert',
      heading: 'git revert - the safe undo for shared history',
      body: `\`git revert <commit-hash>\` does not remove a commit at all - it computes the exact inverse of that commit's changes and applies them as a **brand new commit** on top of history. The original commit still exists, unchanged, in the log; a new commit next to it cancels out its effect.

This is the only one of the three "commit-level" undo tools that does **not** rewrite history, which makes it the correct and safe choice once a commit has already been pushed and possibly pulled by teammates - everyone's existing commit hashes stay valid, and their next \`pull\` simply brings in the new revert commit like any other change. Reaching for \`reset --hard\` on a commit others already have will not undo it for them - it will just make your local history diverge from theirs, setting up a painful reconciliation later.`,
      visualizer: 'none',
    },
  ],

  dryRuns: [
    {
      title: 'reset --soft HEAD~1 keeps your changes',
      input: 'Three commits, A, B, C, on main',
      steps: [
        { label: 'Commit A, B, C', detail: 'main points at C after three sequential commits.', state: ['A', 'B', 'C'], highlight: [2] },
        { label: 'git reset --soft HEAD~1', detail: 'main\'s pointer moves back to B - C is no longer a commit on this branch.', state: ['A', 'B'], highlight: [1] },
        { label: 'git status', detail: "C's changes are still fully present, now sitting staged and ready to re-commit or amend into something else." },
      ],
      result: 'History was rewritten (C no longer exists as a commit), but no work was lost - reset --soft only moves the pointer, it never touches file content.',
    },
    {
      title: 'revert B keeps history intact',
      input: 'Three commits, A, B, C - B has already been pushed and pulled by teammates',
      steps: [
        { label: 'Commits A, B, C exist', detail: 'All three are shared - teammates have already pulled them into their own local history.', state: ['A', 'B', 'C'], highlight: [1] },
        { label: 'git revert B', detail: "Git computes the inverse of B's changes and applies them as a brand-new commit.", state: ['A', 'B', 'C', "C'"], highlight: [3] },
        { label: 'git push', detail: "Teammates pull C' normally - no commit hash they already have was changed or removed." },
      ],
      result: "B's effect is undone, but A, B, and C still exist exactly as they did - safe for history that other people already have a copy of.",
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Discard an accidental edit before committing',
      problem: 'You edited a file, decided the change was wrong, and want the file back to its last committed state.',
      approach:
        'restore is the correct tool because nothing has been committed yet - it only touches the Working Directory, leaving commit history completely untouched.',
      complexity: 'Local, non-destructive to history - restores exactly one file to its last committed content.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git status                # shows config.txt as modified
git restore config.txt    # discards the uncommitted edit
git status                 # clean again`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Undo the last commit but keep the changes',
      problem: 'You committed too early - the message is wrong, or you meant to add one more file - and want the commit gone without losing the work.',
      approach:
        '`reset --soft HEAD~1` moves the branch pointer back one commit while leaving the changes staged, so you can immediately fix and re-commit.',
      complexity: 'O(1) - moves a single pointer; no file content is rewritten or lost.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git log --oneline -1       # abc1234 "fix tpyo in readme"

git reset --soft HEAD~1    # the commit is gone, changes are staged
git status                  # shows the same changes, now staged

git commit -m "Fix typo in README"   # re-commit with the correct message`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Safely undo a commit that is already on the shared remote',
      problem: 'A bug was introduced by a commit that teammates have already pulled - rewriting history with reset would desync everyone.',
      approach:
        'revert creates a new commit that cancels out the bad one, without touching any existing commit hash - the safe, collaborative-history-compatible undo.',
      complexity: 'Adds exactly one new commit; does not rewrite or remove anything already shared.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git log --oneline
# c3d4e5f  Add discount logic
# b2c3d4e  Fix login bug          <-- this one turned out to be broken
# a1b2c3d  Initial commit

git revert b2c3d4e
# opens editor with a default "Revert ..." message, then creates the new commit

git push`,
        },
      ],
    },
  ],

  advantages: [
    'A precise decision table (discard vs. unstage vs. undo-keep vs. undo-discard vs. revert) removes the guesswork that causes accidental data loss.',
    '`reset --soft` and `revert` both give safe paths to undo a commit without discarding the underlying work.',
    '`revert` is safe on shared history specifically because it never rewrites or removes existing commits.',
  ],
  disadvantages: [
    '`reset --hard` offers no confirmation prompt before permanently discarding uncommitted work - the most dangerous command in this module by far.',
    '`reset` (soft or hard) rewrites history, which is unsafe the moment a commit has already been shared with others.',
    '`revert` leaves the original "bad" commit visible in history forever, which some teams find noisier than a clean rewrite (a tradeoff for safety).',
  ],
  commonMistakes: [
    'Reaching for `reset --hard` as a generic "undo" without checking whether the changes being discarded are truly disposable.',
    'Using `reset` (of any kind) on a commit that has already been pushed and pulled by teammates, instead of `revert`.',
    'Confusing `restore --staged` (unstage, keep the edit) with `restore` alone (discard the edit entirely) - they are opposite in destructiveness.',
    'Assuming `revert` deletes the bad commit from history - it does not; it adds a new commit that cancels it out, and the original stays visible in the log.',
  ],
  edgeCases: [
    'Reverting a merge commit requires specifying which parent to revert relative to (`-m 1` or `-m 2`) - a plain `revert` on a merge commit fails with an explanatory error.',
    'A `reset --hard` that turns out to be a mistake can sometimes be recovered via `git reflog`, but only for a limited time and only locally - it is not a substitute for caution.',
    'Reverting a commit whose changes have since been further modified by later commits can itself produce a conflict, requiring manual resolution just like a merge.',
  ],
  interviewTips: [
    'Walk through the decision table logic out loud when asked "how do you undo X in Git" - naming the specific command AND its history-rewriting behavior shows real understanding, not memorized syntax.',
    'If asked to undo a commit already on a shared branch, `revert` should be your immediate answer, with a one-sentence justification: it never rewrites history others may have pulled.',
    'Be ready to state plainly that `reset --hard` is the one command in this set capable of silent, permanent data loss - naming the risk unprompted is a strong signal.',
  ],
  realWorldUseCases: [
    'Fixing a typo in the most recent, not-yet-pushed commit message via `reset --soft HEAD~1` followed by a corrected `commit`.',
    '`revert` used in production incident response - undoing a bad deploy\'s commit without rewriting the deployed history everyone else already has.',
    '`restore` used constantly during day-to-day development to throw away failed local experiments before they are ever staged or committed.',
  ],
  relatedSlugs: ['git-day-1-local-changes', 'git-day-3-merging-conflicts', 'git-day-6-stashing-history'],

  flashcards: [
    { id: 'g4-f1', front: 'Which command discards uncommitted changes in a single file?', back: '`git restore <file>` - replaces it with the last committed version, no history change.' },
    { id: 'g4-f2', front: 'What is the only command in this module that rewrites NO history and is safe on shared commits?', back: '`git revert <commit-hash>` - it adds a new commit that cancels out the target instead of removing anything.' },
    { id: 'g4-f3', front: 'What is the difference between `reset --soft` and `reset --hard`?', back: '`--soft` keeps the undone commit\'s changes staged and safe; `--hard` discards them entirely with no warning.' },
    { id: 'g4-f4', front: 'Which single command on Day 4 can permanently delete work with no warning?', back: '`git reset --hard` - it discards Working Directory and Staging Area content to match the target commit.' },
    { id: 'g4-f5', front: 'Does `restore --staged` delete the edit you made to a file?', back: 'No - it only unstages the file, moving it back to the Working Directory; the edit itself is preserved.' },
    { id: 'g4-f6', front: 'Why is `revert` preferred over `reset` for a commit that has already been pushed?', back: 'Because `reset` rewrites history that others may have already pulled, causing their next pull to be a mess; `revert` adds a new commit and leaves existing hashes untouched.' },
  ],

  practice: [
    {
      id: 'g4-p1',
      title: 'Day 4 milestone, part 1: reset --soft',
      difficulty: 'Medium',
      description: 'Make three commits, then undo the last one with `git reset --soft HEAD~1`, and confirm the changes are staged, not lost.',
      constraints: ['Exactly 3 commits before the reset', 'Verify with git status after the reset'],
      hints: ['`git diff --staged` right after the reset should show exactly the third commit\'s content.'],
      pattern: 'Non-Destructive Commit Undo',
      url: 'https://git-scm.com/docs/git-reset',
    },
    {
      id: 'g4-p2',
      title: 'Day 4 milestone, part 2: revert an earlier commit',
      difficulty: 'Medium',
      description: 'With the same three commits, practice `git revert` on an earlier one (not the most recent) and observe the new commit it creates.',
      constraints: ['Revert a commit that is not HEAD', 'The original commit must still appear unchanged in the log afterward'],
      hints: ['`git log --oneline` before and after the revert - count of commits should go up by one, not down.'],
      pattern: 'Shared-History-Safe Undo',
      url: 'https://git-scm.com/docs/git-revert',
    },
    {
      id: 'g4-p3',
      title: 'Compare restore and restore --staged directly',
      difficulty: 'Easy',
      description: 'Stage a change, then run `restore --staged` to unstage it, and confirm the edit is still present before finally discarding it with plain `restore`.',
      constraints: ['Perform both commands on the same file, in sequence'],
      hints: ['`git status` after each command should visibly move the file between sections.'],
      pattern: 'Staging Reversal',
      url: 'https://git-scm.com/docs/git-restore',
    },
  ],

  faqs: [
    { question: 'If I run `reset --hard` by accident, is the work gone forever?', answer: 'Often it is recoverable for a limited time via `git reflog`, which records where HEAD has pointed recently, even for commits no branch references anymore. It is not guaranteed and not permanent, so treat `--hard` as effectively destructive rather than relying on reflog as a safety net.' },
    { question: 'Why does Git even have both reset and revert instead of one universal undo?', answer: 'They solve different problems: reset is for cleaning up LOCAL, not-yet-shared history (fast, but rewrites it), while revert is for undoing something that is already SHARED (slower - adds a commit - but never rewrites history others depend on).' },
    { question: 'Is `checkout -- <file>` the same as `git restore <file>`?', answer: 'Functionally, yes, for discarding working-directory changes - `restore` is the newer, more focused command introduced specifically to replace this and other overloaded uses of `checkout`.' },
  ],

  references: [
    { label: 'Pro Git Book - Undoing Things', url: 'https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things' },
    { label: 'Git Docs - git-reset', url: 'https://git-scm.com/docs/git-reset' },
    { label: 'Git Docs - git-revert', url: 'https://git-scm.com/docs/git-revert' },
  ],
};
