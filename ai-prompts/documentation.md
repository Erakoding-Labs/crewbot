# Prompt: Documentation

Use this template when generating or updating documentation in FounderOS.

## Context to Provide

- What changed (feature, refactor, structure) or what doc is missing/outdated.
- Target doc(s) under `/docs/` or `README`.

## Instructions for the Agent

1. Read the relevant code and the existing `/docs/` so new docs match tone and structure.
2. Keep docs **accurate to the actual code** — reference real files with relative links (e.g. `lib/types/index.ts`).
3. Update the right file:
   - Structure/data-flow change → `docs/architecture.md`.
   - New/changed entity → `docs/domain.md` + `lib/types/`.
   - New convention → `docs/coding-standards.md`.
   - New limitation/workaround → `docs/tech-debt.md`.
   - New feature scope → `docs/prd.md`.
   - Setup/env change → `docs/environment.md`.
4. Prefer concise tables and short sections over prose walls. Document the **why**, not just the what.
5. Don't let docs drift — if code and a doc disagree, fix the doc (or flag the code).

## Expected Output

- Updated/new docs that match the code exactly.
- Relative links that resolve.
- A PR summarizing the doc changes.
