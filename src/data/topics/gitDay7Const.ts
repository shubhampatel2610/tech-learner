import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 7 - REBASING & COLLABORATION ETIQUETTE
 * Seventh and final module of the "Git in 7 Days" track. Core idea: merge
 * preserves history exactly as it happened; rebase rewrites it to look
 * cleaner - same result, different story, and rebase is only safe on
 * history nobody else has pulled. Covers rebase, interactive rebase, tags,
 * and .gitignore.
 */
export const gitDay7Topic: Topic = {
  slug: 'git-day-7-rebasing-collaboration',
  order: 7,
  category: 'Git',
  title: 'Git Day 7 - Rebasing & Collaboration Etiquette',
  tagline: 'Rebase rewrites history to look clean; merge preserves it as it happened - know when each is safe.',
  difficulty: 'Advanced',
  icon: 'pi pi-users',
  estMinutes: 60,
  tags: ['Git', 'Rebase', 'Collaboration Etiquette'],

  overview:
    "The final day of the track adds a second way to combine diverged histories: rebasing. Day 3's `merge` preserves history exactly as it happened, including messy intermediate commits like \"fix typo\" - it is an honest, unedited record. Rebasing rewrites history to look cleaner, as if your branch had been built on top of the latest main all along, discarding the actual chronological messiness in favor of a tidier story with the same end result. Day 7 closes with two smaller but essential habits: tagging meaningful points in history, and keeping a repository clean with `.gitignore`.",

  whyItExists:
    "Rebasing exists because a linear, readable history is genuinely valuable for code review and future debugging - nobody wants to dig through a dozen \"wip\" and \"fix typo\" commits to understand a feature's actual change. But rewriting history is only safe when nobody else has built on top of the commits being rewritten, which is why this module pairs the mechanics of rebase with an explicit rule about when it is and isn't appropriate. `.gitignore` and tags round out the track because they are the last pieces of daily etiquette needed to work cleanly and communicate meaningful points (like releases) to collaborators.",

  sections: [
    {
      id: 'merge-vs-rebase',
      heading: 'Merge vs. rebase: same result, different story',
      body: `| Aspect | Merge | Rebase |
|---|---|---|
| Preserves exact history? | Yes | No - rewrites commits |
| Creates a merge commit? | Yes | No |
| Safe on shared/pushed branches? | Yes | No - never rebase shared history |
| Result | Messier but honest | Cleaner but rewritten |

\`git rebase main\` takes the commits on your current branch and replays them, one by one, on top of the latest commit on \`main\` - as if you had branched off from there in the first place, instead of from wherever you actually started. The resulting branch has a straight, linear history with no merge commit, but every replayed commit gets a **new hash**, because Git is literally recreating each commit on a different base.

\`git rebase -i HEAD~3\` opens an interactive rebase over the last three commits, letting you reorder, edit, combine (squash), or drop them before they're replayed - this is the tool for cleaning up a messy local history before it's shared. \`git rebase --abort\` cancels an in-progress rebase and restores the branch to its pre-rebase state, mirroring \`merge --abort\` from Day 3.`,
      visualizer: 'none',
    },
    {
      id: 'golden-rule',
      heading: 'The golden rule of rebasing',
      body: `**Never rebase a branch that others have already pulled.** Rebasing rewrites commit hashes - if a teammate already has the old versions of those commits, their next \`pull\` will try to reconcile two histories that Git considers unrelated at those points, producing a confusing pile of duplicate-looking commits or conflicts that have nothing to do with real code changes.

The safe rule of thumb: rebase freely on **local-only** branches nobody else has fetched yet (cleaning up your own history before opening a pull request is the ideal use case), and use merge - never rebase - on branches that have already been pushed and shared.`,
      visualizer: 'none',
    },
    {
      id: 'gitignore-tags',
      heading: '.gitignore and tags',
      body: `\`.gitignore\` tells Git which files and folders should never be tracked or pushed - once a pattern is listed, matching files simply do not show up in \`git status\` as untracked, and \`git add .\` will skip them automatically.

\`\`\`text
# Logs
*.log

# Dependencies
node_modules/

# Environment variables
.env

# OS files
.DS_Store
Thumbs.db
\`\`\`

Common things to ignore: logs and temp files, dependencies, environment variables (secrets should never be committed), OS-generated files, and IDE/editor settings. Note the trap: **\`.gitignore\` only affects untracked files** - if a file was already committed before being added to \`.gitignore\`, Git keeps tracking it until it is explicitly removed from tracking (\`git rm --cached <file>\`) in addition to being ignored going forward.

Tags mark a specific, permanent point in history - most commonly a release. \`git tag v1.0\` creates a lightweight tag (just a named pointer, like a branch that never moves); \`git tag -a v1.0 -m "release message"\` creates an **annotated** tag, which stores its own message, author, and date, and is the recommended form for anything meant to represent a real release.`,
    },
  ],

  dryRuns: [
    {
      title: 'Interactive rebase squashes two commits into one',
      input: 'A local-only branch with two commits: "add login form" and "fix typo in login form"',
      steps: [
        { label: 'git rebase -i HEAD~2', detail: 'Opens an editor listing the last two commits, oldest first, each prefixed "pick".' },
        { label: 'Mark the second commit "squash"', detail: 'Changing pick to squash (or s) tells Git to fold this commit\'s changes into the one directly above it.' },
        { label: 'Save and confirm the message', detail: "Git combines both commits' changes into a single new commit and lets you write one clean message." },
        { label: 'git log --oneline', detail: 'History now shows one commit ("add login form") instead of two - the typo fix never appears as a separate entry.' },
      ],
      result: 'The local-only branch now has clean, reviewable history - safe specifically because nobody else has pulled these commits yet.',
    },
  ],

  examples: [
    {
      level: 'Intermediate',
      title: 'Clean up local commits before opening a pull request',
      problem: 'A feature branch has several small "wip" and "fix typo" commits that would be noisy in a code review, and the branch has not been pushed yet.',
      approach:
        'Interactive rebase over the local commits, squashing the noisy ones into their logical parent commit, produces a clean history before it is ever shared - safe because the branch is still entirely local.',
      complexity: 'Rewrites N local commits into fewer, more meaningful ones - cost scales with commit count, not repository size.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git log --oneline
# c3d4e5f  fix typo in login form
# b2c3d4e  wip: login form styling
# a1b2c3d  add login form

git rebase -i HEAD~3
# mark b2c3d4e and c3d4e5f as "squash" in the editor, keep a1b2c3d as "pick"
# write one clean combined commit message when prompted

git log --oneline
# f9e8d7c  Add login form with styling`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Rebase a feature branch onto the latest main before merging',
      problem: 'main has moved forward since a feature branch was created, and you want the feature branch to appear as if it had been built on top of the latest main all along.',
      approach:
        '`git rebase main` while on the feature branch replays its commits on top of main\'s latest commit - only appropriate because the feature branch has not been pushed/shared with anyone else yet.',
      complexity: 'Replays every commit on the feature branch once; commit count on the branch determines the cost, not the size of main\'s history.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git switch feature
git fetch origin
git rebase origin/main
# CONFLICT (content): Merge conflict in app.js
# resolve like a normal merge conflict, then:
git add app.js
git rebase --continue

git log --oneline --graph        # straight line, no merge commit`,
        },
      ],
    },
    {
      level: 'Beginner',
      title: 'Tag a release and keep the repo clean',
      problem: 'A stable version of the project needs to be marked permanently, and build output should never be accidentally committed.',
      approach:
        'An annotated tag records the release with a message; a `.gitignore` entry stops the build directory from ever appearing as untracked in the first place.',
      complexity: 'One-time setup - a tag and a .gitignore rule apply going forward with no ongoing cost.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `echo "dist/" >> .gitignore
git add .gitignore
git commit -m "Ignore build output"

git tag -a v1.0 -m "First stable release"
git push origin v1.0            # tags are not pushed automatically with commits`,
        },
      ],
    },
  ],

  advantages: [
    'Rebase produces a linear, readable history with no merge commits, which is much easier to scan and bisect later.',
    'Interactive rebase lets you clean up messy local commits (typos, WIP saves) into a small number of meaningful ones before anyone else sees them.',
    'Annotated tags give releases a permanent, message-bearing marker that is easy to reference and diff against later.',
  ],
  disadvantages: [
    'Rebasing rewrites commit hashes, which is actively dangerous on any branch other people have already pulled from.',
    'A rebase that hits several conflicts across many commits can be more tedious to resolve than a single equivalent merge conflict.',
    'A rewritten, "cleaner" history discards the true chronological record of how a change actually evolved, which some teams value for its own sake.',
  ],
  commonMistakes: [
    'Rebasing a branch that has already been pushed and pulled by teammates, forcing everyone to reconcile diverged history afterward.',
    'Force-pushing after a rebase without warning collaborators, silently rewriting a shared remote branch out from under them.',
    'Adding a file to `.gitignore` after it was already committed and assuming that alone stops it from being tracked (it does not - `git rm --cached` is also required).',
    'Using lightweight tags (`git tag v1.0`) for real releases when an annotated tag (`-a -m`) would preserve useful release metadata.',
  ],
  edgeCases: [
    'A rebase that conflicts on multiple commits requires resolving each one in turn with `git rebase --continue`, rather than a single resolution like a merge.',
    'Tags are not pushed to a remote automatically along with commits - `git push origin <tag-name>` (or `--tags` for all of them) is a separate, explicit step.',
    'A `.gitignore` pattern added inside a subdirectory only applies from that directory downward unless written as a root-relative or global pattern.',
  ],
  interviewTips: [
    'State the golden rule of rebasing unprompted whenever the topic comes up - "never rebase shared history" is one of the most commonly tested pieces of Git judgment in interviews.',
    'When asked to compare merge and rebase, lead with "same end result, different history shape," then explain the safety tradeoff, not just the mechanics.',
    'If asked about `.gitignore` and an already-tracked file, mention `git rm --cached` explicitly - it is the detail that separates surface-level familiarity from real experience.',
  ],
  realWorldUseCases: [
    'Squashing a feature branch\'s WIP commits via interactive rebase before opening a pull request, so reviewers see a clean, logical diff.',
    'Tagging every production release with an annotated tag, giving deploy tooling and rollback scripts a stable, meaningful reference point.',
    'Team-wide `.gitignore` templates (per language/framework) that prevent build artifacts, dependencies, and secrets from ever being committed in the first place.',
  ],
  relatedSlugs: ['git-day-3-merging-conflicts', 'git-day-6-stashing-history', 'golden-rules'],

  flashcards: [
    { id: 'g7-f1', front: 'What is the core difference between merge and rebase, in terms of the resulting history?', back: 'Merge preserves exact history including a merge commit; rebase rewrites the branch\'s commits on top of the target, producing a linear history with new commit hashes and no merge commit.' },
    { id: 'g7-f2', front: 'What is the golden rule of rebasing?', back: 'Never rebase a branch that others have already pulled - it rewrites commit hashes they already have, making their next pull a mess.' },
    { id: 'g7-f3', front: 'What does `git rebase -i HEAD~3` let you do?', back: 'Interactively reorder, edit, squash, or drop the last 3 commits before they are replayed - used to clean up local history.' },
    { id: 'g7-f4', front: 'Does `.gitignore` stop an already-committed file from being tracked?', back: 'No - it only prevents untracked files from being picked up. An already-tracked file needs `git rm --cached <file>` in addition to the ignore rule.' },
    { id: 'g7-f5', front: 'What is the difference between `git tag v1.0` and `git tag -a v1.0 -m "..."`?', back: 'The first is a lightweight tag (just a named pointer); the second is an annotated tag that also stores a message, author, and date - the recommended form for releases.' },
    { id: 'g7-f6', front: 'Are tags pushed to a remote automatically with a normal `git push`?', back: 'No - tags must be pushed explicitly, either by name (`git push origin v1.0`) or all at once (`git push --tags`).' },
  ],

  practice: [
    {
      id: 'g7-p1',
      title: 'Day 7 milestone: gitignore, tag, and interactive rebase',
      difficulty: 'Medium',
      description: 'Create a .gitignore, tag a release, make 2 small commits, and use interactive rebase to squash those 2 commits into 1 on a local-only branch.',
      constraints: ['The branch used for the squash must never have been pushed', 'The .gitignore must actually prevent a matching file from appearing in git status'],
      hints: ['`git log --oneline` before and after the squash should go from 2 new commits to exactly 1.'],
      pattern: 'Local History Cleanup',
      url: 'https://git-scm.com/docs/git-rebase',
    },
    {
      id: 'g7-p2',
      title: 'Compare merge and rebase on the same divergence',
      difficulty: 'Hard',
      description: 'Branch, diverge from main with commits on both sides, then merge on one copy and rebase on an identical copy - compare the resulting `log --graph` output.',
      constraints: ['Use two separate local copies (or branches) of the same starting divergence, one for merge and one for rebase'],
      hints: ['The merge copy will show a diamond shape in `log --graph`; the rebase copy will show a straight line.'],
      pattern: 'Merge vs Rebase Comparison',
      url: 'https://git-scm.com/docs/git-rebase',
    },
    {
      id: 'g7-p3',
      title: 'Remove an already-tracked file using .gitignore correctly',
      difficulty: 'Medium',
      description: 'Commit a file, then add it to .gitignore, and correctly stop it from being tracked going forward using git rm --cached.',
      constraints: ['The file must remain on disk after being untracked, just no longer tracked by Git'],
      hints: ['`git status` right after adding the ignore rule (without `rm --cached`) will still show the file as modified/tracked - that is the trap to observe.'],
      pattern: 'Gitignore Correctness',
      url: 'https://git-scm.com/docs/gitignore',
    },
  ],

  faqs: [
    { question: 'If rebase is riskier, why use it at all instead of always merging?', answer: 'On branches nobody else has pulled, rebase carries none of the shared-history risk and produces a much cleaner, linear history - it is the right tool specifically for tidying up local, not-yet-shared work before it becomes permanent.' },
    { question: 'What should I do if I already rebased a shared branch by mistake?', answer: 'Communicate with your team immediately - anyone who already pulled the old commits needs to reconcile (often by resetting their local branch to match the new rewritten history) rather than merging the two diverged versions together.' },
    { question: 'Do I need to add node_modules/ (or similar) to .gitignore in every project?', answer: "Yes, for any dependency directory that can be regenerated from a lockfile/manifest - committing it bloats the repository and creates unnecessary merge conflicts for files nobody hand-edits." },
  ],

  references: [
    { label: 'Pro Git Book - Git Branching: Rebasing', url: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing' },
    { label: 'Git Docs - git-rebase', url: 'https://git-scm.com/docs/git-rebase' },
    { label: 'Git Docs - gitignore', url: 'https://git-scm.com/docs/gitignore' },
  ],
};
