import type { Topic } from '@/types/content.types';

/**
 * GIT DAY 5 - REMOTE REPOSITORIES
 * Fifth module of the "Git in 7 Days" track. Core idea: your local repo
 * doesn't automatically talk to GitHub - every sync is a command you run on
 * purpose, and fetch/pull look similar but behave very differently. Covers
 * remote, push, pull, fetch, and clone.
 */
export const gitDay5Topic: Topic = {
  slug: 'git-day-5-remote-repositories',
  order: 5,
  category: 'Git',
  title: 'Git Day 5 - Remote Repositories',
  tagline: 'Your local repo never talks to GitHub on its own - every sync is a command you run on purpose.',
  difficulty: 'Intermediate',
  icon: 'pi pi-cloud',
  estMinutes: 60,
  tags: ['Git', 'Remote', 'Collaboration'],

  overview:
    "Days 1-4 were entirely local - nothing you did left your machine. Day 5 introduces remotes: a copy of your repository hosted somewhere else (GitHub, GitLab, a private server), which your local repository can push to and pull from. The critical thing to internalize is that this synchronization is never automatic - Git does not silently keep a local repo in sync with a remote one. Every download and every upload is a deliberate command, and the two commands that look most similar - `fetch` and `pull` - behave very differently, which is the most confused pair in all of Git.",

  whyItExists:
    "Remotes exist because Git is fundamentally distributed - every clone is a full, independent copy of the entire history, not a thin client pointing at a central server. That independence is powerful (you can commit, branch, and inspect history fully offline) but it means synchronization has to be explicit: someone else's commits do not appear in your repository until you deliberately fetch or pull them, and your commits do not appear anywhere else until you deliberately push. Understanding fetch vs. pull specifically prevents the common mistake of merging in changes you never actually reviewed.",

  sections: [
    {
      id: 'remote-basics',
      heading: 'git clone, git remote, and naming a remote "origin"',
      body: `\`git clone <url>\` downloads a full copy of a remote repository - complete history, all branches - and automatically sets it up with a remote named \`origin\` pointing back at the source URL.

If you started a repository locally with \`git init\` instead of cloning, there is no remote configured yet: \`git remote -v\` lists any remotes currently known (verbosely, showing URLs), and \`git remote add origin <url>\` connects your local repository to a remote one for the first time - after this, \`origin\` is just a short alias you can use instead of typing the full URL every time.`,
    },
    {
      id: 'push-pull',
      heading: 'git push and git pull',
      body: `\`git push origin <branch-name>\` uploads your local branch's new commits to the named remote. The first time you push a brand-new local branch, use \`git push -u origin <branch-name>\` - the \`-u\` (\`--set-upstream\`) flag links your local branch to the remote one, so future pushes and pulls on that branch can be run as a bare \`git push\` / \`git pull\` without repeating the branch name.

\`git pull origin <branch-name>\` downloads new commits from the remote **and immediately merges them** into your current branch, in one step. This convenience is exactly what makes it easy to confuse with \`fetch\`.`,
    },
    {
      id: 'fetch-vs-pull',
      heading: 'Fetch vs. pull - the most confused pair in Git',
      body: `| What happens | \`fetch\` | \`pull\` |
|---|---|---|
| Downloads new commits? | Yes | Yes |
| Merges into your branch? | No | Yes |
| Safe to run anytime? | Always | Only if you're ready to merge |

\`git fetch\` downloads any new commits from the remote into your local copy of the remote's branches (e.g. \`origin/main\`) **without touching your own current branch at all**. It is always safe to run - it only adds information, never changes your Working Directory or your branch history. \`git pull\` is really just \`fetch\` + \`merge\` combined: it downloads the new commits **and** immediately merges them into your current branch in the same step.

Run \`fetch\` first if you want to review incoming changes (\`git log origin/main\`, \`git diff main origin/main\`) before merging them in - this is the safer, more deliberate workflow. Running \`pull\` directly skips that review step entirely, merging whatever is new the moment it is downloaded.`,
      visualizer: 'none',
    },
  ],

  dryRuns: [
    {
      title: 'Fetch vs. pull on the same remote change',
      input: 'A teammate pushed a new commit to origin/main while you were working locally',
      steps: [
        { label: 'git fetch', detail: "Downloads the new commit into your local copy of origin/main - your own local main is unchanged and unaffected." },
        { label: 'Inspect', detail: '`git log origin/main` or `git diff main origin/main` lets you review the incoming change before touching your own branch.' },
        { label: 'git merge origin/main', detail: 'You now explicitly merge the reviewed commit into your local main, on your own terms.' },
        { label: '(alternative) git pull', detail: 'Running pull instead of fetch + merge would have done both of the previous two steps together, automatically, with no review in between.' },
      ],
      result: 'fetch downloads and stops for review; pull downloads and immediately merges - same underlying data transfer, very different amount of control over when the merge happens.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Push a brand-new local repo to GitHub for the first time',
      problem: 'A repository was created locally with `git init` and has commits, but has never been connected to a remote.',
      approach:
        'Create the empty repository on GitHub first, then connect it as `origin` and push with `-u` so the branch relationship is remembered for future pushes.',
      complexity: 'One-time setup: one `remote add` + one `push -u`; every push after this is a plain `git push`.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git remote add origin https://github.com/you/your-repo.git
git remote -v                       # confirm origin is set correctly

git push -u origin main             # first push links main <-> origin/main

# ...later commits...
git push                            # no need to repeat "origin main" now`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Review a teammate\'s changes before merging them in',
      problem: 'A teammate pushed new commits to origin/main and you want to see exactly what changed before your local main absorbs it.',
      approach:
        '`fetch` downloads without merging, giving a safe window to inspect the incoming diff, and only then merge deliberately - avoiding an unreviewed automatic merge from a plain `pull`.',
      complexity: 'Two explicit steps (fetch, then merge) instead of one implicit one (pull) - trades a little convenience for full visibility.',
      code: [
        {
          language: 'bash',
          label: 'Bash',
          code: `git fetch origin
git log origin/main -3              # peek at the newest incoming commits
git diff main origin/main            # see exactly what would change

git merge origin/main               # now merge deliberately, fully informed`,
        },
      ],
    },
  ],

  advantages: [
    'Every sync (push, pull, fetch) is explicit, so you always know exactly when your local history changed relative to the remote.',
    '`fetch` gives a completely safe way to inspect incoming changes before they touch your Working Directory at all.',
    '`push -u` remembers the branch relationship after the first push, simplifying every push and pull that follows.',
  ],
  disadvantages: [
    "The distinction between fetch and pull is subtle enough that many developers use pull by default and never review incoming changes first.",
    'A `push` can be rejected outright if the remote has commits your local branch does not - forcing a `pull`/merge (or rebase) before you can push, which can interrupt a workflow mid-task.',
    'Cloning a very large repository transfers its entire history by default, which can be slow on a poor connection (shallow clones exist to mitigate this, at the cost of losing full history locally).',
  ],
  commonMistakes: [
    "Treating `fetch` and `pull` as interchangeable, then being surprised that a plain `fetch` didn't update the Working Directory at all.",
    'Forgetting `-u` on the first push of a new branch, then needing to type `origin <branch-name>` on every push and pull afterward instead of a bare `git push`/`git pull`.',
    'Running `git push` without first pulling recent remote changes, hitting a rejected push, and not understanding why.',
    'Assuming `git remote add origin <url>` is needed again after a `git clone` - clone already sets up `origin` automatically.',
  ],
  edgeCases: [
    'A repository with more than one remote (e.g. `origin` and `upstream` for a fork workflow) - `git remote -v` lists all of them, and push/pull/fetch must specify which one when it is not the default.',
    'Pushing a branch that does not yet exist on the remote - Git creates it there automatically as part of the push.',
    'A force-push (`git push --force`) overwriting remote history that others have already pulled - the single most disruptive action possible with a remote, and generally avoided on shared branches.',
  ],
  interviewTips: [
    'The fetch-vs-pull distinction is a very common practical question - answer with the exact mechanism (pull = fetch + merge) rather than a vague "they\'re basically the same."',
    "Mention that Git's distributed model means a clone is a full, independent copy of history - this is the deeper reason synchronization has to be explicit rather than automatic.",
    "If asked about a rejected push, explain that it means the remote has commits you don't have locally yet - the fix is to fetch/pull (or rebase) first, not to force-push over it.",
  ],
  realWorldUseCases: [
    'Code review workflows where `fetch` lets a reviewer inspect a colleague\'s pushed branch locally before ever merging or even checking it out.',
    'CI/CD pipelines that `git fetch` on a schedule to detect new commits without altering any working branch, then trigger builds based on what they find.',
    'Fork-based open source contribution, where `origin` points at your fork and a second remote (commonly `upstream`) points at the original project.',
  ],
  relatedSlugs: ['git-day-1-local-changes', 'git-day-6-stashing-history', 'git-day-7-rebasing-collaboration'],

  flashcards: [
    { id: 'g5-f1', front: 'Does Git automatically keep your local repository in sync with a remote?', back: 'No - every push, pull, and fetch is a deliberate command you run; nothing syncs on its own.' },
    { id: 'g5-f2', front: 'What is the exact relationship between `pull` and `fetch`?', back: '`pull` is `fetch` + `merge` combined into one step; `fetch` alone downloads without merging.' },
    { id: 'g5-f3', front: 'Is `git fetch` ever unsafe to run?', back: 'No - it only downloads data into your local copy of the remote\'s branches; it never touches your current branch or Working Directory.' },
    { id: 'g5-f4', front: 'What does the `-u` flag do on `git push -u origin main`?', back: 'Sets the upstream tracking relationship, so future `git push`/`git pull` on that branch no longer need to specify "origin main" explicitly.' },
    { id: 'g5-f5', front: 'What does `git clone` set up automatically that `git init` does not?', back: 'A remote named "origin" pointing back at the cloned URL - `git init` starts with no remotes configured at all.' },
    { id: 'g5-f6', front: 'Why might `git push` be rejected?', back: 'Because the remote has commits your local branch does not have yet - you need to fetch/pull (or rebase) those in first before pushing.' },
  ],

  practice: [
    {
      id: 'g5-p1',
      title: 'Day 5 milestone: clone, change, push, explain',
      difficulty: 'Easy',
      description: 'Clone a repo, make a change, push it, then explain the difference between what fetch and pull just did.',
      constraints: ['Use a real (or practice) remote repository you have push access to', 'Push must use -u on the first push of any new branch'],
      hints: ['`git remote -v` right after cloning confirms origin was set up automatically.'],
      pattern: 'Remote Sync Workflow',
      url: 'https://git-scm.com/docs/git-clone',
    },
    {
      id: 'g5-p2',
      title: 'Fetch and review before merging',
      difficulty: 'Medium',
      description: 'Have a collaborator (or a second local clone) push a commit, then use `fetch` plus `git diff main origin/main` to review it before merging.',
      constraints: ['Do not use `pull` for this exercise', 'The review step must happen before any merge'],
      hints: ['`git log origin/main -1` shows the latest commit on the remote without touching your local branch.'],
      pattern: 'Deliberate Remote Review',
      url: 'https://git-scm.com/docs/git-fetch',
    },
    {
      id: 'g5-p3',
      title: 'Trigger and resolve a rejected push',
      difficulty: 'Medium',
      description: 'Simulate a rejected push by having a remote commit exist that your local branch does not, then resolve it by pulling before pushing again.',
      constraints: ['The push must actually be rejected first, not just assumed'],
      hints: ['Push from a second local clone (or ask a collaborator) to create a commit on the remote your first clone does not have yet.'],
      pattern: 'Push Conflict Recovery',
      url: 'https://git-scm.com/docs/git-push',
    },
  ],

  faqs: [
    { question: 'If fetch never merges anything, how do I actually get the new commits into my branch?', answer: 'After fetching, run `git merge origin/<branch>` (or `git rebase origin/<branch>`) explicitly - fetch only updates your local copy of the remote\'s branches, it never touches your current branch on its own.' },
    { question: 'Is it ever okay to just always use `pull` instead of fetch + merge?', answer: 'For solo projects or low-risk branches, yes - the convenience is usually fine. On shared, actively-changing branches, fetching first (to review) is the safer habit, since pull merges immediately with no chance to inspect first.' },
    { question: 'What happens if I clone a repository I do not have push access to?', answer: 'Cloning always works (it is a read operation), but `git push` will fail with a permissions error. This is the normal setup for viewing or building on top of a public repository you do not own.' },
  ],

  references: [
    { label: 'Pro Git Book - Working with Remotes', url: 'https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes' },
    { label: 'Git Docs - git-fetch', url: 'https://git-scm.com/docs/git-fetch' },
    { label: 'Git Docs - git-push', url: 'https://git-scm.com/docs/git-push' },
  ],
};
