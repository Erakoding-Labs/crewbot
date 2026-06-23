# Testing Strategy

> **Status:** No test runner is configured yet. This document defines the target setup and conventions. Until then, every change must pass the **two mandatory gates** below.

## Mandatory Gates (run on every change today)

```bash
npx tsc --noEmit     # strict type check — must exit 0
npm run build        # production build — must compile, all routes generate
```

Both currently pass clean. Treat a failure in either as a blocking regression.

## Planned Test Setup

- **Unit / component**: Vitest + React Testing Library.
- **E2E**: Playwright for the critical user flows.

Suggested scripts (add to `package.json` when introduced):
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

## What to Test

### Unit (pure logic)
- Derived calculations: weekly completion %, per-member done/pending counts (`app/(app)/team/page.tsx`, `dashboard/page.tsx`).
- Filtering/search: investor stage+query filter, learning category+query filter.
- `getCopilotReply()` keyword routing (`lib/mock/copilot.ts`).

### Component
- `InvestorCard` bookmark toggle updates shared state.
- `ResourceCard` complete toggle updates shared state.
- `FilterPills` calls `onChange` and reflects active state.
- Team Add Member / Add Task dialogs append to local state.

### E2E (critical flows)
- Login → dashboard redirect.
- Bookmark an investor → "Saved Investors" stat increments → appears under "Saved" tab.
- Mark a resource complete → "Resources Completed" stat increments.
- Add a task on `/team` → appears in the correct column.
- Sidebar drawer opens/closes on mobile viewport.

## Conventions (when added)

- Test files co-located as `*.test.tsx` next to the unit under test, or under `__tests__/`.
- Mock data already exists in `lib/mock/` — reuse it; don't invent parallel fixtures.
- Aim for coverage on logic and state interactions, not on static presentational markup.
