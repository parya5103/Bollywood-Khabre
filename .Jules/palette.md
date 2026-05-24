## 2026-05-16 - Dynamic ARIA Labels in React\n**Learning:** Implementing accessibility for interactive stateful components requires dynamic `aria-label` attributes that accurately reflect the current state (e.g., toggling between 'Save article' and 'Remove from saved' based on a boolean value or array inclusion).\n**Action:** Always verify if an interactive element has multiple states. If so, ensure its `aria-label` updates dynamically to provide accurate context to screen readers, rather than hardcoding a single, static action description.

## 2024-05-17 - Implicit vs Explicit Form Labels
**Learning:** Found instances where `<label>` elements were placed adjacent to inputs without `htmlFor`/`id` linking. This visually looks correct but breaks screen reader association and click-to-focus behavior for mouse users.
**Action:** Always use explicit linking (`htmlFor` on `<label>` matching `id` on input) even when inputs are visually adjacent to their labels. Additionally, add `cursor-pointer` to explicitly linked labels to encourage user interaction.
## 2024-05-21 - Newsletter Form Accessibility and Feedback
**Learning:** Email inputs relying purely on placeholder text need explicit `aria-label` attributes to be fully understandable by screen readers. Furthermore, adding visual elements like spinners along with `aria-live` regions for async states drastically improves UX feedback for both sighted and screen-reader users.
**Action:** When creating or auditing form components, proactively add `aria-label` if `<label>` isn't present, and combine visual loading states with screen reader announcements (`aria-busy`/`aria-live`).

## 2024-05-22 - Keyboard Support on Interactive Cards
**Learning:** Container elements (like `<section>` or `<article>`) acting as clickable cards must provide keyboard support since they don't inherently possess it. Relying only on `onClick` excludes users who navigate via keyboard.
**Action:** When a non-button container is designed to be interactive, apply the pattern: `role="button"`, `tabIndex={0}`, an explicit `aria-label`, an `onKeyDown` handler (supporting 'Enter' and 'Space'), and clear `focus-visible` styling to ensure comprehensive keyboard accessibility.

## 2024-05-22 - Nested Interactive Elements and Stretched Links
**Learning:** Applying `role="button"` to a whole card container creates an ARIA violation if the card contains other interactive elements (like a "Save" button) because screen readers struggle with nested interactive controls. It also introduces event bubbling regressions (e.g. keydown on the child triggers the parent).
**Action:** When a card needs to be fully clickable but contains other buttons, DO NOT make the container interactive. Instead, make the container `relative`, wrap the card's primary text (e.g., its Title) in a semantic `<a>` or `<button>`, and use a pseudo-element overlay (`before:absolute before:inset-0 before:z-0`) to stretch its clickable area. Ensure inner secondary buttons have `relative z-10` to sit above the overlay.
