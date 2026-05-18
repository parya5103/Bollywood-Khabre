## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2026-05-18 - Frontend Debounce Search Optimization
**Learning:** The application was making an API request on every single keystroke in the main search bar, leading to excessive backend load and potential frontend stuttering as React re-rendered with new network requests constantly.
**Action:** Implemented a standard debounce hook pattern in App.tsx using a 500ms timeout before committing the search query string used for API fetches.
