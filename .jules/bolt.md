## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.

## 2024-05-18 - [Frontend Verification Without Altering Package Configs]
**Learning:** Adding testing tools like Playwright to dependencies to verify performance metrics creates unapproved commits. Verifying performance on frontend interactions requires writing standalone temporary scripts using local/system executables, rather than altering package.json which is explicitly forbidden unless instructed.
**Action:** Always create temporary scripts, run them without altering dependency lockfiles, and remove testing artifacts (`.mjs`, screenshots, `.yaml` lockfiles) before requesting a review.
