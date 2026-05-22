## 2026-05-16 - Dynamic ARIA Labels in React
**Learning:** Implementing accessibility for interactive stateful components requires dynamic `aria-label` attributes that accurately reflect the current state (e.g., toggling between 'Save article' and 'Remove from saved' based on a boolean value or array inclusion).
**Action:** Always verify if an interactive element has multiple states. If so, ensure its `aria-label` updates dynamically to provide accurate context to screen readers, rather than hardcoding a single, static action description.

## 2024-05-17 - Implicit vs Explicit Form Labels
**Learning:** Found instances where `<label>` elements were placed adjacent to inputs without `htmlFor`/`id` linking. This visually looks correct but breaks screen reader association and click-to-focus behavior for mouse users.
**Action:** Always use explicit linking (`htmlFor` on `<label>` matching `id` on input) even when inputs are visually adjacent to their labels. Additionally, add `cursor-pointer` to explicitly linked labels to encourage user interaction.

## 2024-05-21 - Newsletter Form Accessibility and Feedback
**Learning:** Email inputs relying purely on placeholder text need explicit `aria-label` attributes to be fully understandable by screen readers. Furthermore, adding visual elements like spinners along with `aria-live` regions for async states drastically improves UX feedback for both sighted and screen-reader users.
**Action:** When creating or auditing form components, proactively add `aria-label` if `<label>` isn't present, and combine visual loading states with screen reader announcements (`aria-busy`/`aria-live`).

## 2024-05-24 - Nested Interactive Elements ARIA Anti-pattern & React Event Bubbling
**Learning:** Adding keyboard navigation to clickable container cards that contain nested interactive elements (e.g., favorite buttons) can cause severe functional regressions due to event bubbling. Furthermore, assigning `role="button"` to a container with interactive descendants is an ARIA anti-pattern.
**Action:** Use `role="group"` instead of `role="button"` for clickable cards containing nested controls to maintain focusability without the anti-pattern. Always verify `e.target === e.currentTarget` in parent React `onKeyDown` handlers to prevent capturing and inadvertently triggering parent actions on keyboard events meant for child buttons.
