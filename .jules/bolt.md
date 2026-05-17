## 2026-05-17 - App Search Debouncing
**Learning:** In a live-search component architecture (like in `src/App.tsx`), firing API requests instantly on every keystroke causes unnecessary backend load and frontend stuttering.
**Action:** Implementing a standard 500ms debounce using `useState` and `useEffect` with `setTimeout` successfully batches input changes into a single API request without sacrificing input reactivity.
