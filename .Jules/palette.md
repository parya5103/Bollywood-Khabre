## 2026-05-16 - Dynamic ARIA Labels in React\n**Learning:** Implementing accessibility for interactive stateful components requires dynamic `aria-label` attributes that accurately reflect the current state (e.g., toggling between 'Save article' and 'Remove from saved' based on a boolean value or array inclusion).\n**Action:** Always verify if an interactive element has multiple states. If so, ensure its `aria-label` updates dynamically to provide accurate context to screen readers, rather than hardcoding a single, static action description.

## 2024-05-17 - Implicit vs Explicit Form Labels
**Learning:** Found instances where `<label>` elements were placed adjacent to inputs without `htmlFor`/`id` linking. This visually looks correct but breaks screen reader association and click-to-focus behavior for mouse users.
**Action:** Always use explicit linking (`htmlFor` on `<label>` matching `id` on input) even when inputs are visually adjacent to their labels. Additionally, add `cursor-pointer` to explicitly linked labels to encourage user interaction.
## 2024-05-21 - Newsletter Form Accessibility and Feedback
**Learning:** Email inputs relying purely on placeholder text need explicit `aria-label` attributes to be fully understandable by screen readers. Furthermore, adding visual elements like spinners along with `aria-live` regions for async states drastically improves UX feedback for both sighted and screen-reader users.
**Action:** When creating or auditing form components, proactively add `aria-label` if `<label>` isn't present, and combine visual loading states with screen reader announcements (`aria-busy`/`aria-live`).

## 2026-05-23 - Interactive Block Elements Require Keyboard Support
**Learning:** Found that non-interactive block elements (like `<section>` or `<article>`) being used as clickable cards using just `onClick` handlers are completely inaccessible to keyboard users (they cannot be tabbed to or activated with Enter/Space).
**Action:** Whenever converting a non-interactive element into a clickable target using `onClick`, explicitly add `role="button"`, `tabIndex={0}`, an `onKeyDown` handler mapped to Enter/Space, and visible focus states (`focus-visible`).
