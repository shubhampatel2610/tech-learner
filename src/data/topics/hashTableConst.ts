import type { Topic } from '@/types/content.types';

/**
 * TOPIC 11 - HASH TABLE
 * Full deep-dive. Mirrors cheatsheet section 11 (key -> value mapping,
 * O(1) average operations, insert/get/delete/contains, use cases: counting,
 * caching, frequency maps, two sum) with hashing/collisions expanded.
 */
export const hashTableTopic: Topic = {
  slug: 'hash-table',
  order: 11,
  title: 'Hash Table',
  tagline: 'Trade order for speed - O(1) average lookup by giving up any sense of position.',
  difficulty: 'Beginner',
  icon: 'pi pi-hashtag',
  estMinutes: 35,
  tags: ['Hashing', 'Collisions', 'Buckets', 'Frequency Map'],

  overview:
    "A hash table maps keys to values by running each key through a hash function to compute a bucket index directly - no searching, no comparing against every existing key. That direct computation is the entire trick: instead of asking 'where is this key stored?' and searching for the answer, you calculate the answer. The average O(1) for insert, lookup, and delete makes it the single most-reached-for structure once 'do I know this?' or 'have I seen this before?' becomes a bottleneck.",

  whyItExists:
    'An array gives O(1) access, but only by position (index) - you cannot ask "where is the value 42?" without scanning. A sorted structure (BST, sorted array) gives O(log n) key lookup, better but still not O(1). A hash table exists to close that last gap: by computing a bucket from the key itself rather than searching for it, membership, counting, and key-value lookups collapse to average O(1) - at the cost of giving up any ordering between keys.',

  sections: [
    {
      id: 'hashing-basics',
      heading: 'The hash function - turning a key into an index',
      body: `A **hash function** takes a key of any type (string, number, tuple) and deterministically produces an integer, which is then reduced to a valid bucket index via \`hash(key) % num_buckets\`.

A good hash function has two properties:

- **Deterministic** - the same key always produces the same hash, every time (required for lookup to ever find what insert stored).
- **Uniform distribution** - different keys should spread evenly across buckets, minimizing how often two keys land in the same place.

For strings, a common approach is a **polynomial rolling hash**: treat each character as a digit in a large base (e.g. 31), so \`hash("abc") = a×31² + b×31¹ + c×31⁰\`, then take that mod the bucket count. Small changes to the input (one different character) scatter the hash unpredictably, which is exactly what you want for spreading keys evenly.

**You never write hash functions from scratch in practice** - languages provide one (Python's \`hash()\`, Java's \`.hashCode()\`) for built-in types, and you implement it yourself only for custom objects used as dictionary/set keys.`,
      visualizer: 'hash-table-ops',
    },
    {
      id: 'collisions',
      heading: 'Collisions - two keys, one bucket',
      body: `A **collision** happens when two different keys hash to the same bucket - inevitable once you have more possible keys than buckets (the pigeonhole principle guarantees it eventually). How a hash table handles collisions is the core design decision:

**Chaining** - each bucket holds a small list (or tree, for very hot buckets in some implementations) of all entries that hashed there. Insert appends to the bucket's chain; lookup hashes to the bucket, then scans the chain for a matching key. Simple, and degrades gracefully - even a "full" table just means longer chains, not failure.

**Open addressing** - on a collision, probe for the next open slot in the array itself (linear probing: check i+1, i+2, ...; or quadratic/double-hashing for better spread). No extra memory for chains, better cache locality, but requires careful handling of deletions (a naive removal can break the probe sequence for later lookups - usually solved with a "tombstone" marker).

Either way, **collisions are why average-case O(1) is not worst-case O(1)**: if every key collided into the same bucket, lookup degrades to O(n) - a linear scan through one giant chain.`,
    },
    {
      id: 'load-factor',
      heading: 'Load factor and resizing',
      body: `**Load factor** = (number of entries) / (number of buckets). It measures how "full" the table is, and directly controls chain length: a load factor of 0.75 means chains average 0.75 entries - short enough that lookup stays effectively O(1).

When the load factor crosses a threshold (commonly 0.75), the table **resizes**: allocate a larger bucket array (typically double), and **rehash every existing entry** into it (bucket indices depend on \`num_buckets\`, so they all change). This resize is O(n), but - exactly like a dynamic array's resize - it happens rarely enough that the **amortized** cost per insert stays O(1). See the [[complexity]] module's section on amortized analysis for the same argument applied to array append.

This is why hash table performance can look "spiky" in practice: most inserts are O(1), but occasionally one triggers an O(n) rehash - invisible in Big-O, but real in a latency-sensitive system.`,
    },
    {
      id: 'worst-case-adversarial',
      heading: "Worst case: when O(1) becomes O(n)",
      body: `The average-case O(1) claim assumes hash values spread keys roughly evenly. Two ways that assumption breaks:

- **Poor hash function** - if many real keys happen to collide (e.g. a naive hash that only looks at string length), chains grow long even at low load factor.
- **Adversarial input** - if an attacker can choose keys specifically designed to collide (knowing your hash function), they can degrade every operation to O(n), turning a fast API endpoint into a denial-of-service vector. This is why production hash table implementations (Python, Java, and most language runtimes) **seed their hash function randomly per process** - so an attacker cannot predict which keys will collide without knowing that run's secret seed.

The takeaway for interviews and system design alike: **O(1) average, O(n) worst case** is not a minor footnote - it is a real, exploitable property that production systems specifically defend against.`,
    },
    {
      id: 'use-cases',
      heading: 'The four classic use cases',
      body: `Nearly every hash-table interview problem is one of these four shapes:

- **Membership / "have I seen this?"** - a hash **set** records seen values; checking membership is O(1) instead of an O(n) linear scan. Classic: duplicate detection, visited-node tracking in graph traversal.
- **Counting / frequency maps** - a hash **map** from value → count, built in one O(n) pass. Classic: anagram checks, majority element, first non-repeating character.
- **Caching / memoization** - a hash map from input → already-computed output turns exponential recursive re-computation into linear-time DP (see the Dynamic Programming module). Classic: Fibonacci, any "avoid recomputing the same subproblem" scenario.
- **Complement lookup** - store what you need to find later as you scan once. Classic: **Two Sum** - for each number, check whether \`target - number\` was already seen, recording each number as you go. O(n) instead of the O(n²) pairwise brute force.

Recognizing "I need O(1) access by key" as the shape of a problem, and reaching for a hash map/set by reflex, is one of the highest-leverage interview habits to build.`,
      visualizer: 'none',
    },
  ],

  complexity: [
    { operation: 'Insert (average)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)', note: 'Worst = all keys collide into one bucket.' },
    { operation: 'Lookup / get (average)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)', note: 'Worst = long chain scan or adversarial collisions.' },
    { operation: 'Delete (average)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)', note: 'Chaining: remove from list. Open addressing: tombstone.' },
    { operation: 'Contains / membership check', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)', note: 'Same cost profile as lookup.' },
    { operation: 'Resize (rehash all entries)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)', note: 'Rare - amortized to O(1) per insert overall.' },
    { operation: 'Iterate all entries', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)', note: 'No ordering guarantee (unless a specialized ordered variant is used).' },
  ],

  dryRuns: [
    {
      title: 'Inserting keys and hitting a collision',
      input: 'bucket count = 5, insert keys "cat" (hash=2), "sky" (hash=4), "run" (hash=2)',
      steps: [
        { label: 'insert "cat"', detail: 'hash("cat") % 5 = 2. Bucket 2 is empty - place it directly.', state: [0, 0, 1, 0, 0], highlight: [2] },
        { label: 'insert "sky"', detail: 'hash("sky") % 5 = 4. Bucket 4 is empty - place it directly.', state: [0, 0, 1, 0, 1], highlight: [4] },
        { label: 'insert "run" - collision!', detail: 'hash("run") % 5 = 2. Bucket 2 already holds "cat" - chain "run" onto it instead of overwriting.', state: [0, 0, 2, 0, 1], highlight: [2] },
      ],
      result: 'Bucket 2 now holds a 2-entry chain ["cat", "run"]. Looking up "run" costs one hash computation (O(1)) plus a 2-entry scan - still effectively O(1) at this load factor, but the chain is the visible cost of the collision.',
    },
    {
      title: "Two Sum via a single pass with a hash map",
      input: 'nums = [2, 7, 11, 15], target = 9',
      steps: [
        { label: 'i=0, num=2', detail: 'complement = 9 - 2 = 7. Not in seen map yet. Record seen[2] = 0.', state: [2], highlight: [0] },
        { label: 'i=1, num=7', detail: 'complement = 9 - 7 = 2. seen[2] exists (index 0) - found the pair!', state: [2, 7], highlight: [0, 1] },
      ],
      result: 'Returns indices [0, 1] after checking just 2 elements - O(n) total instead of the O(n²) brute-force pairwise scan, because the map turns "has this been seen?" into an O(1) check.',
    },
  ],

  examples: [
    {
      level: 'Beginner',
      title: 'Contains Duplicate',
      problem: 'Determine whether an array contains any value more than once.',
      approach:
        'A hash set records every value seen so far. For each new value, check membership first (O(1)) before adding it - if it is already there, you have found a duplicate. One O(n) pass instead of the O(n²) pairwise comparison or O(n log n) sort-then-scan.',
      complexity: 'O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
        },
      ],
    },
    {
      level: 'Intermediate',
      title: 'Group Anagrams',
      problem: 'Group a list of strings so that all anagrams of each other end up together.',
      approach:
        'Use a hash map keyed by each string\'s sorted-character signature (all anagrams share the same sorted form). Append each original string to the list stored under its signature. One pass, with O(k log k) sorting cost per string of length k.',
      complexity: 'O(n · k log k) time, O(n · k) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
        },
      ],
    },
    {
      level: 'Advanced',
      title: 'Longest Consecutive Sequence (O(n), no sorting)',
      problem: 'Find the length of the longest run of consecutive integers in an unsorted array, in O(n).',
      approach:
        'Put every number in a hash set. For each number that is the START of a sequence (i.e. num - 1 is NOT in the set), count forward (num+1, num+2, ...) while each is present. Skipping non-start numbers guarantees each number is only ever counted once across the whole run, even though there is a nested-looking while loop - that is what keeps it O(n) instead of O(n²).',
      complexity: 'O(n) time, O(n) space',
      code: [
        {
          language: 'python',
          label: 'Python',
          code: `def longest_consecutive(nums):
    num_set = set(nums)
    best = 0
    for n in num_set:
        if n - 1 not in num_set:   # only start counting at a sequence's beginning
            length = 1
            while n + length in num_set:
                length += 1
            best = max(best, length)
    return best`,
        },
      ],
    },
  ],

  advantages: [
    'Average O(1) insert, lookup, and delete - the fastest general-purpose key-based access available.',
    'Turns "have I seen this?" and "count occurrences" into single O(n) passes instead of O(n²) comparisons.',
    'Flexible keys - strings, tuples, custom objects (with a proper hash function) all work, not just integers.',
  ],
  disadvantages: [
    'No ordering - cannot efficiently ask for "the next smallest key" or iterate in sorted order (a BST can).',
    'Worst-case O(n) if the hash function is poor or an attacker can choose colliding keys deliberately.',
    'Extra memory overhead versus an array - buckets, chain pointers, and load-factor headroom all cost space.',
  ],
  commonMistakes: [
    'Using a mutable object as a dictionary/set key - if its hash can change after insertion, it becomes unfindable.',
    'Assuming hash table iteration order is insertion order or sorted order (language-dependent; do not rely on it without checking).',
    'Writing a custom hash function that is not uniform (e.g. hashing only part of a compound key), silently causing clustering.',
    'Forgetting that checking "in" on a list is O(n) - only a set/dict membership check is O(1).',
    'Using a hash map when the problem actually needs sorted/ordered access - reach for a balanced BST or sorted structure instead.',
  ],
  edgeCases: [
    'Empty table - lookup/delete on a key that was never inserted must be handled explicitly (KeyError, None, or a default).',
    'All keys colliding into one bucket - a stress test for whether your complexity analysis accounted for the worst case.',
    'Deleting from an open-addressing table - naive removal can break the probe chain for later lookups without a tombstone.',
    'Hashing a key whose value changes after insertion (if mutable) - the entry can become permanently unreachable.',
  ],
  interviewTips: [
    'When you hear "have I seen this before?" or "count occurrences," reach for a hash set/map immediately and say so.',
    'For "find a pair/triplet summing to X," mention the single-pass hash-map complement technique before a nested-loop brute force.',
    'State the O(1) average / O(n) worst-case distinction unprompted - it signals you understand hashing is probabilistic, not magic.',
    'If ordering matters (sorted iteration, range queries), explicitly say a hash table is the wrong tool and pivot to a balanced BST.',
    'For custom objects as keys, mention that a correct hash function must be consistent with equality (equal objects must hash equally).',
  ],
  realWorldUseCases: [
    'Database indexing and caching layers (Redis, Memcached) - key-value stores are hash tables at massive scale.',
    'Compilers and interpreters - symbol tables mapping variable/function names to their definitions.',
    'Deduplication pipelines - hash sets of already-seen record IDs or content hashes.',
    'Rate limiting and counting - frequency maps of request counts per client/IP within a time window.',
    'Language runtimes - Python dict/set, Java HashMap/HashSet, JavaScript Map/Set/plain objects are all hash tables.',
  ],
  relatedSlugs: ['data-structures', 'arrays-strings', 'common-patterns'],

  flashcards: [
    { id: 'ht-f1', front: 'Average-case complexity of hash table insert/lookup/delete?', back: 'O(1) for all three - a direct computation of the bucket from the key, not a search.' },
    { id: 'ht-f2', front: 'What causes the worst-case O(n)?', back: 'Many keys colliding into the same bucket - from a poor hash function or adversarially chosen keys - degrading a lookup into a full chain scan.' },
    { id: 'ht-f3', front: 'Chaining vs open addressing - core difference?', back: 'Chaining: each bucket holds a list of colliding entries. Open addressing: collisions probe for the next free slot in the array itself.' },
    { id: 'ht-f4', front: 'What is load factor, and why does it matter?', back: 'Entries ÷ buckets. Controls average chain length; crossing a threshold (commonly 0.75) triggers a resize + full rehash to keep O(1) average performance.' },
    { id: 'ht-f5', front: 'Why is a hash table resize O(n) but still "amortized O(1) per insert"?', back: 'Resizes are rare (each one roughly doubles capacity), so their cost spread across all the inserts since the last resize averages out to O(1) - the same argument as dynamic array append.' },
    { id: 'ht-f6', front: 'The single-pass complement trick (Two Sum) - why is it O(n) not O(n²)?', back: 'Checking whether target-num was already seen is an O(1) hash-map lookup, done once per element, instead of comparing every pair.' },
  ],

  quiz: [
    {
      id: 'ht-q1',
      type: 'mcq',
      prompt: 'What is the primary weakness of a hash table compared to a balanced BST?',
      options: ['Slower average lookup', 'No ordering / cannot do range queries or sorted iteration', 'Cannot store string keys', 'Always O(n) space'],
      answerIndex: 1,
      explanation: 'A hash table trades away ordering entirely for O(1) average access - a BST is the right tool when you need sorted iteration or "next largest/smallest" queries.',
    },
    {
      id: 'ht-q2',
      type: 'boolean',
      prompt: 'A hash table\'s worst-case lookup time is always O(1), regardless of the hash function quality.',
      answer: false,
      explanation: 'Worst-case is O(n) - if many keys collide into one bucket (poor hash function or adversarial input), lookup degrades to scanning a long chain.',
    },
    {
      id: 'ht-q3',
      type: 'mcq',
      prompt: 'Two Sum solved with a single-pass hash map has what complexity, versus the brute-force nested loop?',
      options: ['O(n) vs O(n log n)', 'O(n) vs O(n²)', 'O(log n) vs O(n)', 'O(1) vs O(n)'],
      answerIndex: 1,
      explanation: 'The hash-map approach checks each complement in O(1) during a single O(n) pass; brute force compares every pair, O(n²).',
    },
    {
      id: 'ht-q4',
      type: 'fill',
      prompt: 'Fill in: when a hash table\'s load factor crosses its threshold, it performs a ___, which is O(n) but amortized O(1) per insert overall.',
      answer: 'resize (rehash)',
      explanation: 'The bucket array grows (typically doubles) and every existing entry is rehashed into new bucket positions - rare enough that its cost amortizes away.',
    },
  ],

  practice: [
    {
      id: 'ht-p1',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Find two numbers in an array that add up to a target - the canonical hash-map complement-lookup problem.',
      constraints: ['Exactly one solution exists', 'O(n) expected'],
      hints: ['Record each number\'s index as you scan; before adding, check whether target - number was already seen.'],
      pattern: 'Hash Map - Complement Lookup',
      url: 'https://leetcode.com/problems/two-sum/',
    },
    {
      id: 'ht-p2',
      title: 'Group Anagrams',
      difficulty: 'Medium',
      description: 'Group strings that are anagrams of each other using a canonical-form hash map key.',
      constraints: ['O(n · k log k) expected, k = max string length'],
      hints: ['All anagrams share the same sorted-character signature - use it as the map key.'],
      pattern: 'Hash Map - Frequency / Signature',
      url: 'https://leetcode.com/problems/group-anagrams/',
    },
    {
      id: 'ht-p3',
      title: 'Longest Consecutive Sequence',
      difficulty: 'Medium',
      description: 'Find the longest run of consecutive integers in an unsorted array, without sorting - O(n).',
      constraints: ['O(n) time required, not O(n log n)'],
      hints: ['Only start counting from numbers whose predecessor (num - 1) is absent from the set.'],
      pattern: 'Hash Set - Sequence Detection',
      url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    },
  ],

  faqs: [
    { question: 'Is a hash table the same as a dictionary/map?', answer: '"Dictionary" and "map" describe the abstract key-value interface; "hash table" is the specific implementation that achieves O(1) average access via hashing. Python\'s dict, Java\'s HashMap, and JS\'s Map are all hash tables under that interface.' },
    { question: 'Why do production languages randomize their hash seed per process?', answer: 'To defend against hash-flooding denial-of-service attacks, where an attacker who knows the hash function submits keys engineered to all collide, degrading every operation to O(n). A random per-process seed makes that precomputation useless.' },
    { question: 'When should I use a hash set vs a hash map?', answer: 'A set stores only keys (membership questions: "have I seen X?"). A map stores key-value pairs (lookup/association questions: "what count/value goes with X?"). If you find yourself mapping every key to a dummy value like True, you actually want a set.' },
  ],

  references: [
    { label: 'MIT 6.006 - Hashing', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' },
    { label: 'Python dict implementation notes', url: 'https://docs.python.org/3/faq/design.html#how-are-dictionaries-implemented-in-cpython' },
  ],
};
