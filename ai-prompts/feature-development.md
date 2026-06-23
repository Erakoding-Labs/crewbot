# Prompt: Feature Development

Use this template when building a new feature in FounderOS.

## Context to Provide

- The ticket / feature description and acceptance criteria.
- Relevant pages/components (e.g. "follows the pattern in `app/(app)/investors/page.tsx`").
- Any new entity shape, if applicable.

## Instructions for the Agent

1. Read `docs/architecture.md`, `docs/coding-standards.md`, `docs/domain.md`, and `agent-rules.md`.
2. Explore the repo for existing patterns to follow (similar page, similar card/component).
3. **Propose a plan before writing code**: files to create/modify, new types in `lib/types/`, new mock data in `lib/mock/`, shared vs. local state, and how it satisfies each acceptance criterion. Wait for approval.
4. Implement incrementally. Reuse existing components/primitives; extract a component instead of duplicating markup.
5. Keep all data mock and typed. Use design tokens for styling.
6. Run the gates: `npx tsc --noEmit` and `npm run build`. Smoke-test with `npm run dev`.
7. Update any affected `/docs/` files.
8. Open a PR (see expected output).

## Expected Output

- Working feature meeting every acceptance criterion.
- Clean type check + build, no runtime console errors.
- A PR with: summary, list of files changed, how each acceptance criterion is met, and the ticket link.

## Example Task

> Add a "Notes" field to investors: a small textarea on each `InvestorCard` whose value is stored per-investor in shared state, following the `savedInvestors` pattern in `components/app-state.tsx`. Add the type, extend the provider, and keep it mock-only.
