## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2026-05-18 - Un-debounced Search Bar
**Learning:** The root React application in `src/App.tsx` fired API calls for every keystroke when typing into the search input. This creates heavy load by requesting data for intermediate search queries (e.g. "b", "ba", "bat", "batm", "batman").
**Action:** Always wrap API fetching logic tied to user text inputs with a debounce mechanism (like `setTimeout`) and use the `useEffect` return function to clear it.
