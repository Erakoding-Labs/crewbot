# Coding Standards

## Language & Framework

- **TypeScript strict mode** (`tsconfig.json` → `"strict": true`). No `any` unless unavoidable and commented.
- **Next.js App Router**. Server Components by default; add `"use client"` only when a file uses hooks, browser APIs, or event handlers.
- **Path alias**: import via `@/` (maps to repo root). Never use deep relative paths like `../../../`.

## File & Naming Conventions

- Component files: **kebab-case** (`investor-card.tsx`, `action-item-row.tsx`).
- Exported components: **PascalCase** (`InvestorCard`).
- Hooks/functions/vars: **camelCase**.
- Types/interfaces: **PascalCase**, defined in `lib/types/index.ts` for shared domain entities.
- Mock data files: one per domain area under `lib/mock/`, exporting typed arrays.

## Component Patterns

- **Presentational components take data via props** — no data imports inside cards/rows/badges. Pages own data.
- Reuse existing primitives in `components/ui/` (shadcn) before adding new UI deps.
- Reuse shared components (`PageHeader`, `FilterPills`, badges) instead of duplicating markup.
- Co-locate small, page-only helpers inside the page; promote to `components/` only when reused.

## Styling

- **Tailwind utility classes only.** No inline `style` except for dynamic values that can't be expressed in Tailwind (e.g. the progress bar transform).
- Use **design tokens**, not raw hex, in component classes: `bg-surface`, `text-muted-foreground`, `bg-primary`, `border-border`. Tokens are defined in `app/globals.css` and mapped in `tailwind.config.ts`.
- Merge conditional classes with `cn()` from `@/lib/utils`.
- Responsive: mobile-first. Grids reflow `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`. Sidebar is `hidden md:block`; drawer covers `<768px`.

## Anti-Patterns (avoid)

- ❌ Duplicating card/row markup across pages — extract a component.
- ❌ Fetching or adding a backend/DB/API — all data stays mock under `lib/mock/`.
- ❌ Raw hex colors in components — use tokens.
- ❌ Marking a file `"use client"` when it has no client-only needs.
- ❌ Adding a state-management library for the two existing shared sets — use `AppStateProvider`.
- ❌ Leaving dead code, TODO stubs, or `console.log` in committed code.

## Comments

- Comment the **why**, not the **what**. Add a short doc comment above non-obvious components/functions (see existing files for the established density).
