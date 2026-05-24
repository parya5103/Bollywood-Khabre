## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2024-05-20 - N+1 Database Query in Scraper Loop

**Learning:** Iterating over arrays and making single `findOne` queries inside the loop for existence checks creates N+1 performance bottlenecks, especially when dealing with external database IO latency.
**Action:** Bulk gather required keys (e.g., URLs) and use Mongoose's `$in` operator with `.select().lean()` to fetch only necessary data in a single query. Cache the results in a JavaScript `Set` for O(1) deduplication lookup during iteration.
## 2026-05-21 - [Mongoose Hydration Overhead]
**Learning:** Returning full Mongoose documents for read-only Express API endpoints introduces significant CPU and memory overhead for instantiation, especially for large document sets or heavily loaded queries. Using `.lean()` bypasses document instantiation.
**Action:** Append `.lean()` to Mongoose queries (like `find` or `findOne`) where the resulting objects are only read and directly serialized to JSON responses.
## 2024-05-24 - API Calls Triggered on Every Keystroke
**Learning:** Found a performance bottleneck where `fetchNews` was triggered on every single keystroke in the main search input due to immediate state dependency, causing excessive and unnecessary API requests.
**Action:** Always implement debouncing (e.g., using a delayed state update via `setTimeout`) for search inputs that directly trigger API calls to significantly reduce network load and unnecessary React re-renders.
