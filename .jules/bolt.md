## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2024-05-20 - N+1 Database Query in Scraper Loop

**Learning:** Iterating over arrays and making single `findOne` queries inside the loop for existence checks creates N+1 performance bottlenecks, especially when dealing with external database IO latency.
**Action:** Bulk gather required keys (e.g., URLs) and use Mongoose's `$in` operator with `.select().lean()` to fetch only necessary data in a single query. Cache the results in a JavaScript `Set` for O(1) deduplication lookup during iteration.
## 2026-05-21 - [Mongoose Hydration Overhead]
**Learning:** Returning full Mongoose documents for read-only Express API endpoints introduces significant CPU and memory overhead for instantiation, especially for large document sets or heavily loaded queries. Using `.lean()` bypasses document instantiation.
**Action:** Append `.lean()` to Mongoose queries (like `find` or `findOne`) where the resulting objects are only read and directly serialized to JSON responses.
## 2026-05-22 - [Frontend Debounce on Search Inputs]
**Learning:** Real-time search inputs in React trigger full state updates and corresponding effects (like `fetchNews`) on every keystroke. Without debouncing, this leads to an unnecessary spike in API requests and backend load for intermediate search terms that the user didn't intend to search for.
**Action:** Wrap API fetch calls tied to user input inside a `setTimeout` debounce within the `useEffect` hook (and clear it in the cleanup function) to delay execution until the user stops typing.
