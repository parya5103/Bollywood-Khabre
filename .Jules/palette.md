## 2024-05-24 - App Shell Keyboard Accessibility
**Learning:** Core application navigation elements like custom side-rails (`RailItem`) and header icon buttons frequently lack keyboard focus indicators (`focus-visible`) and programmatic labels (`aria-label`) in highly styled interfaces.
**Action:** Always verify that interactive custom elements (like `button`s wrapping icons) have clear `aria-label`s, `focus-visible` styles with sufficient contrast (e.g. `ring-accent`), and semantic roles if applicable.
