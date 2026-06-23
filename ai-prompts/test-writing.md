# Prompt: Test Writing

Use this template when adding tests in FounderOS. See `docs/testing-strategy.md` for the overall plan.

## Context to Provide

- The unit/component/flow to test.
- Whether a test runner is already configured (currently none — the first test task must add Vitest + RTL, and Playwright for E2E).

## Instructions for the Agent

1. Read `docs/testing-strategy.md` and `docs/domain.md`.
2. If no runner exists, set up Vitest + React Testing Library (and Playwright for E2E) and add the `test` scripts — keep config minimal and conventional.
3. Reuse existing fixtures from `lib/mock/`; don't create parallel mock data.
4. Prioritize **logic and state interactions** over static markup:
   - Derived calcs (completion %, member counts, filters).
   - State toggles (bookmark, complete) and that dependent stats update.
   - Dialog add flows.
5. Co-locate `*.test.tsx` with the unit, or use `__tests__/`.
6. Run the suite; ensure it passes alongside `npx tsc --noEmit` and `npm run build`.

## Expected Output

- Passing tests covering the specified logic/flows.
- Any new runner config + scripts, documented in `docs/testing-strategy.md`.
- A PR with the tests and a note on what is covered.

## Example Task

> Add Vitest + RTL and write tests for the investor filter logic in `app/(app)/investors/page.tsx`: stage filter, text search, and combined filter, using the `investors` mock.
