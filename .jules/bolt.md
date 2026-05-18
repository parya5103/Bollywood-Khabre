## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.

## 2024-05-18 - Optimize scraper duplicate checks
**Learning:** Resolving an N+1 query vulnerability during loop processing can have massive performance gains; in scraperService, querying the database in every iteration is slower (~3.7s baseline) versus combining all potential keys (URLs) and performing a single `$in` query beforehand to store results in a local Set for fast `O(1)` validation (~0.9s optimized). Also ensures deduplication across same-batch results via `Set.add()`.
**Action:** Always favor bulk querying with Set-based lookups when iterating over potentially large arrays of items fetched from external sources before performing sequential DB processing.
