# Prompt: Code Review

Use this template when reviewing a pull request in FounderOS.

## Context to Provide

- The diff / PR link.
- The ticket and acceptance criteria.

## Instructions for the Agent

Review the change against:

1. **Correctness** — does it meet the acceptance criteria? Any logic bugs, edge cases (empty lists, unassigned tasks, empty search results)?
2. **Standards** (`docs/coding-standards.md`) — file/naming conventions, `@/` imports, presentational-vs-container split, design tokens (no raw hex), no inline styles.
3. **Reuse** — does it duplicate markup that should be a shared component? Does it reuse `components/ui/` and existing helpers?
4. **Data discipline** — data stays mock and typed in `lib/mock/` + `lib/types/`. No backend/API/LLM sneaked in.
5. **State** — shared state only via `AppStateProvider`; no new state library.
6. **Gates** — confirm `npx tsc --noEmit` and `npm run build` pass; no console errors.
7. **Docs** — were affected `/docs/` updated?
8. **Hygiene** — no dead code, TODO stubs, or `console.log`.

## Expected Output

A review with: blocking issues, non-blocking suggestions, and an explicit approve / request-changes verdict. Each comment: file:line, problem, suggested fix.
