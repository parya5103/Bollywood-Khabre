# Security Specification for CinePulse

## Data Invariants
1. A news article must have a unique slug.
2. Only authorized admins can write to the `articles` and `stats` collections.
3. Public users can read `articles`.
4. `stats` are restricted to authorized admins for read/write.
5. All IDs must be valid alphanumeric strings.

## The Dirty Dozen Payloads (Rejection Targets)
1. **The Ghost Field Attack**: Try to create an article with `isVerified: true` (not in schema).
2. **The Identity Spoof**: Try to set `author: "Real Admin"` as a guest.
3. **The Slug Hijack**: Try to update an existing article's `slug` to something else.
4. **The Negative Score**: Try to set `viralScore: -100`.
5. **The Billion Laughs**: Inject 1MB string into `tags`.
6. **The Orphan Write**: Create an article with a category not in the enum.
7. **The Time Warp**: Set `publishedAt` to a future date manually.
8. **Stat Modification**: A guest trying to increment `monthlyEst`.
9. **Bulk Delete**: A guest trying to delete the entire `articles` collection.
10. **ID Poisoning**: Document ID with emojis or massive length.
11. **Shadow Metadata**: Adding a `hidden` field to hide articles from search.
12. **PII Leak**: Trying to read user data if it were present (none in this app yet, but good to guard).

## Test Runner (firestore.rules.test.ts)
(Implementation of these tests in a separate file would follow standard Firebase Test SDK patterns).
