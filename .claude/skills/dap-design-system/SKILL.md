---
name: dap-design-system
description: Use when building or changing the citizen-facing frontend (src/app/(frontend)) with the DÁP Design System (`dap-design-system`, `dap-ds-*` Lit web components): picking components, their attributes/slots/events, theming with `--dds-*` tokens, styling via `::part`, React/Next.js integration, SSR/FOUC issues. Not for the Payload admin UI.
---

# DÁP Design System

Lit web components (`dap-ds-*` prefix) for Hungarian government digital services. In this project it is used only for the citizen-facing pages in `src/app/(frontend)`; the Payload admin keeps its own UI.

## Sources, in order of trust

1. **The installed package (matches the version we actually run).** `dap-design-system@0.61.11` in `package.json`.
   - `node_modules/dap-design-system/dist/manifest/web-types.json`: every element (182) with `attributes`, `slots`, `events`, `doc-url`. Use this to check that an attribute or event exists before writing it. Never invent one.
     ```bash
     node -e 'const w=require("./node_modules/dap-design-system/dist/manifest/web-types.json");const e=w.contributions.html.elements.find(x=>x.name==="dap-ds-button");console.log(JSON.stringify({attributes:e.attributes.map(a=>a.name),slots:e.slots?.map(s=>s.name),events:e.events?.map(v=>v.name)},null,2))'
     ```
   - `node_modules/dap-design-system/dist/react/dap-ds-<name>/index.d.ts`: React wrapper types, JSDoc with usage examples and the typed event names.
   - `node_modules/dap-design-system/dist/components/<name>/*.d.ts`: the Lit component classes (properties, CSS parts in JSDoc).
2. **[reference/llms.txt](reference/llms.txt)**: the official LLM overview (conventions, component list with doc links, tokens, pitfalls). Downloaded from https://services.gov.hu/design-system-dev/llms.txt on 2026-10-14. It is not versioned; when it disagrees with the package, the package wins.
3. **Online docs**: https://services.gov.hu/design-system-dev/ (component pages: `/webcomponents/<name>`, Next.js: `/frameworks/next`, tokens: `/designtokens`). Example repo: https://github.com/mohojojo/dap-ds-examples

When the package version changes, re-download `llms.txt` and update the version and date above.

## Project rules

- **Client-only registration.** Web components register in the browser. Components that render or import `dap-ds-*` live in `'use client'` files; do not import `dap-design-system` from a Server Component. Check the official Next.js and FOUC guidance (`/frameworks/next`) before choosing the loading strategy.
- **Prefer the React wrappers** from `dap-design-system/react` (built on `@lit/react`): typed props and event handler props. Raw `<dap-ds-*>` tags in JSX need a ref plus `addEventListener` for custom events.
- **Theme CSS is required**: import one theme (`dap-design-system/dist/light.theme.css`) once, in the frontend layout. Without it components render unstyled.
- **Shadow DOM**: Tailwind classes do not reach inside a component. Use Tailwind only for page layout around components (bound to `--dds-*` tokens via `@theme`); customise components through documented `::part(...)` selectors and component CSS custom properties.
- **Attributes vs properties**: strings, numbers, booleans as attributes (kebab-case in HTML); objects and arrays as properties (the React wrapper does this for you).
- **No hardcoded colours, spacing, fonts**: use `--dds-*` tokens or component variants.
- **Must not pass as an official government site** (project decision, not a DÁP rule). The site is publicly deployed, so:
  - `dap-ds-dap-badge` is fine: it only signals that the DÁP Design System is used.
  - `dap-ds-official-website-banner` only with our own demo text in its slots (e.g. heading "Ez egy demóoldal, nem hivatalos kormányzati weboldal."), never with the default "official website" content.
  - No state logos. The mocked "Belépés DÁP-pal" must be clearly labelled as a demo.
- **Accessibility**: icon-only buttons need `aria-label`; form fields go inside `dap-ds-label` or use `aria-labelledby`; error messages must be associated with their input. Verified with Playwright + axe.

## Our Next.js setup

- `src/app/(frontend)/components/ClientApplication.tsx`: `'use client'` wrapper, `import('dap-design-system')` in `useEffect`. The official `/frameworks/next` page imports `dap-design-system/dist/dds`, which the package `exports` (0.61.x) no longer allows; the package root points to the same file.
- `src/app/(frontend)/layout.tsx`: theme CSS, Inter via `next/font/local` (`./fonts/InterVariable.woff2`, copied from `dap-design-system/dist/assets/fonts/` of 0.61.11), wraps children in `ClientApplication`. The `<Suspense>` in the official example does not help with registration (a `useEffect` import does not suspend), so it is left out.
- `src/app/(frontend)/globals.css`: `:not(:defined) { visibility: hidden; }` against FOUC (generic technique, not yet compared with the official FOUC page).
- Open checks: Hungarian glyphs (ő, ű) in the bundled 48 KB font; whether components with a hardcoded `font-family: "Inter"` in their shadow styles (input, radio-button, timepicker) get the font, since `next/font/local` registers it under a generated family name.

## Known doubts in llms.txt

- The Next.js `next/dynamic` example (`dynamic(() => import('dap-design-system').then(() => 'dap-ds-button'))`) returns a tag name string from the loader and does not look like a working pattern. Do not copy it; follow `/frameworks/next` and the example repo instead.
- It says to attach events via `addEventListener` in React. That applies to raw tags; the React wrappers expose event props.
