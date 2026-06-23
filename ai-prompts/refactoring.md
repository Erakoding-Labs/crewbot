# Prompt: Refactoring

Use this template when refactoring existing code in FounderOS.

## Context to Provide

- What to refactor and why (duplication, readability, performance, structure).
- Scope boundaries — what must NOT change (behavior, UI, public props).

## Instructions for the Agent

1. Read `agent-rules.md` and `docs/coding-standards.md`.
2. **Refactoring changes structure, not behavior.** The UI and outputs must be identical before and after.
3. Identify duplication or smells; prefer extracting shared components/helpers over clever abstractions.
4. Make changes incrementally; keep each step compiling.
5. Verify behavior is unchanged: `npx tsc --noEmit`, `npm run build`, and a `npm run dev` visual check of affected pages.
6. Open a PR explaining the before/after and why behavior is preserved.

## Common Targets in This Repo

- Repeated card/row markup → extract into `components/`.
- Inline repeated Tailwind clusters → a shared component or token.
- Page-local helpers reused across pages → promote to `components/` or `lib/`.

## Expected Output

- Same behavior, cleaner structure.
- Gates pass; no UI diff.
- PR describing the structural change and preservation of behavior.
