## 2024-05-16 - [Missing Database Indexes on Article Model]
**Learning:** The Article model lacks indexes on `publishedAt` and `viralScore`, as well as a compound index on `category` and `publishedAt`. Since the `newsRoutes.js` queries heavily rely on sorting by `publishedAt` (for latest news) and `viralScore` (for trending news), adding these indexes results in a 4x-7x performance improvement in the benchmark.
**Action:** Add indexes for `publishedAt` (-1), `viralScore` (-1), and optionally `{ category: 1, publishedAt: -1 }` to the Article schema.

## 2024-05-19 - [React Component Definition Inside Render]
**Learning:** The `RailItem` component was defined inside the render body of `App` in `src/App.tsx`. This causes React to unmount and remount the components completely on every re-render of `App`, which is a significant performance bottleneck and anti-pattern.
**Action:** Extract nested component definitions to the file level and memoize them using `React.memo()`.
