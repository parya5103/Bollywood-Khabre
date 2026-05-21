## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2024-05-20 - N+1 Database Query in Scraper Loop

**Learning:** Iterating over arrays and making single `findOne` queries inside the loop for existence checks creates N+1 performance bottlenecks, especially when dealing with external database IO latency.
**Action:** Bulk gather required keys (e.g., URLs) and use Mongoose's `$in` operator with `.select().lean()` to fetch only necessary data in a single query. Cache the results in a JavaScript `Set` for O(1) deduplication lookup during iteration.
## 2024-05-23 - [Unnecessary DB Queries & Mongoose .lean()]
**Learning:** The `newsRoutes.js` had a severe bottleneck where a DB query was made, awaited, and then instantly overwritten with a different query if the `category` was "trending". Furthermore, read-only endpoints were instantiating heavy Mongoose Document objects instead of returning fast plain JS objects.
**Action:** Use an `if/else` block to ensure only the necessary DB query executes. Add `.lean()` to all read-only Mongoose `.find()` and `.findOne()` calls.
