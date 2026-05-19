## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.
## 2025-05-19 - Inline Component Anti-Pattern Discovered
**Learning:** The React app defined the `RailItem` component inline within the `App` component function body. This meant React received a brand new function reference on every single render of the parent `App` component, causing expensive full unmounting and remounting instead of just standard re-rendering updates.
**Action:** Extract components out of render functions and to the module level. Wrap stateless, pure presentational components like this with `React.memo` to optimize rendering.
