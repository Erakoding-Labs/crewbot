# Prompt: Bug Fix

Use this template when fixing a bug in FounderOS.

## Context to Provide

- Bug report: what's wrong.
- Steps to reproduce.
- Expected vs. actual behavior.
- Affected page/route if known.

## Instructions for the Agent

1. Read `agent-rules.md` and the relevant `/docs/`.
2. Search the codebase to find the **root cause** — don't patch symptoms. State the root cause before fixing.
3. Reproduce the bug (describe the failing behavior; add a failing test if a test runner exists, otherwise a precise manual repro via `npm run dev`).
4. Implement the **minimal** fix consistent with existing patterns.
5. Verify: `npx tsc --noEmit`, `npm run build`, and runtime check that the repro now passes and nothing else regressed.
6. Open a PR referencing the bug ticket.

## Expected Output

- Root-cause explanation.
- Minimal fix.
- Verification evidence (gates pass + repro resolved).
- PR linked to the ticket.

## Example Task

> Bug: On `/team`, adding a task with no assignee crashes / shows blank owner. Repro: open Add Task, leave Assignee = Unassigned, submit. Expected: task appears in Todo with "Unassigned". Find the root cause in `task-column.tsx` / `team/page.tsx` and apply the minimal fix.
