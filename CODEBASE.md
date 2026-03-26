# What the code does

This doc maps **every meaningful part** of the `next-app` project: what file it is, and what job it has.

---

## App (pages & routes)

| File | What it does |
|------|----------------|
| `app/page.tsx` | Home page — starter UI with a sample `Button`. Not wired to the studio or API yet. |
| `app/layout.tsx` | Root layout: loads fonts (Geist, JetBrains Mono), wraps children in `ThemeProvider`, applies global styles. |
| `app/globals.css` | Global CSS and Tailwind theme tokens (colors, radii, dark mode). |
| `app/favicon.ico` | Browser tab icon. |
| `app/api/analyze/route.ts` | **Backend API.** `POST` accepts JSON `{ prompt, image? \| imageUrl? }`, calls OpenRouter **image generation** (`google/gemini-2.5-flash-image`) with optional reference image, returns `{ image }` (base64 data URL). Also exports `generateProductAd()` for reuse. **Note:** the path is `/api/analyze` but behavior is “generate ad image,” not JSON product analysis. |

---

## Types

| File | What it does |
|------|----------------|
| `types/studio.ts` | Shared TypeScript types: `OutputSize`, `SIZE_MAP`, `ProductAnalysis`, `ChatMessage`, `GenerationStatus`, `GenerationJob`. Used by the store and (later) by APIs/UI. `ProductAnalysis` is **not** filled by the current `/api/analyze` route. |

---

## Lib (shared logic)

| File | What it does |
|------|----------------|
| `lib/openrouter.ts` | Single **OpenRouter SDK client** — reads `process.env.OPENROUTER_API_KEY`. API routes import this; no business logic here. |
| `lib/store.ts` | **Zustand** store `useStudioStore`: holds one `GenerationJob` (`job`) and actions (`setSourceImage`, `setPrompt`, `setSize`, `setStatus`, `setAnalysis`, `setResult`, `addMessage`, `reset`). `newJob()` / `reset` create a fresh id and timestamps. **Not yet used** by any page. |
| `lib/utils.ts` | `cn()` — merges Tailwind class names (used by shadcn-style components). |

---

## Components

| File | What it does |
|------|----------------|
| `components/theme-provider.tsx` | Wraps `next-themes` so the app can switch light/dark (used in `layout.tsx`). |
| `components/ui/button.tsx` | shadcn-style button (variants, sizes). |
| `components/ui/input.tsx` | Text input field. |
| `components/ui/textarea.tsx` | Multi-line text input. |
| `components/ui/badge.tsx` | Small label / tag UI. |
| `components/ui/dialog.tsx` | Modal dialog (Radix-based). |
| `components/ui/scroll-area.tsx` | Scrollable region. |
| `components/ui/separator.tsx` | Visual divider. |
| `components/ui/tooltip.tsx` | Hover tooltip. |
| `components/.gitkeep` | Placeholder so empty `components/` folder stays in git (if used). |

---

## Config & tooling

| File | What it does |
|------|----------------|
| `package.json` | Dependencies and scripts (`dev`, `build`, `lint`, `typecheck`, etc.). |
| `tsconfig.json` | TypeScript compiler options and path alias `@/*`. |
| `next.config.mjs` | Next.js configuration. |
| `postcss.config.mjs` | PostCSS (Tailwind pipeline). |
| `eslint.config.mjs` | ESLint rules. |
| `components.json` | shadcn/ui generator config (where UI primitives live). |
| `.prettierrc` | Formatting (no semicolons, double quotes, etc.). |
| `README.md` | Short template note about adding shadcn components. |

---

## Outside `next-app` (repo root)

| File | What it does |
|------|----------------|
| `../color.md` (in `photoproject/`) | **Not part of the Next app.** A standalone HTML + Tailwind **design reference** (“AdStudio AI” dashboard). Use it as a visual/style guide when building real React pages; it is not imported by Next. |

---

## What is **not** built yet

- No `/studio` (or similar) page calling `POST /api/analyze` or using `useStudioStore`.
- No API that returns **`ProductAnalysis`** JSON from a vision model.
- No database, auth, or image storage — only in-memory client state and one generate endpoint.

---

## Env you need

| Variable | Used by |
|----------|---------|
| `OPENROUTER_API_KEY` | `lib/openrouter.ts` → all OpenRouter calls from `app/api/analyze/route.ts` |

Put it in `.env.local` in `next-app` (not committed).
