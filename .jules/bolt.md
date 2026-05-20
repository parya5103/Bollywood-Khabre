## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2024-05-20 - [Frontend API Call Debouncing]
**Learning:** The React frontend (`src/App.tsx`) was calling `fetchNews()` on every single keystroke in the global search input because the `useEffect` hook depended directly on the `searchQuery` state without any debouncing mechanism. This resulted in an O(n) API load relative to typing speed.
**Action:** When implementing live search in React, always introduce a secondary "debounced" state updated via `setTimeout` inside a `useEffect`, and bind the fetching logic to this debounced state rather than the immediate input state.
