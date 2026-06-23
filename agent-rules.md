# Agent Rules

Project-specific constraints for AI agents working in FounderOS. Read this and the `/docs/` set before making changes.

## Always

- **Read context first.** Check `docs/architecture.md`, `docs/coding-standards.md`, and `docs/domain.md` before writing code.
- **Reuse before creating.** Use existing components in `components/` and `components/ui/`, shared helpers (`cn`, `PageHeader`, `FilterPills`, badges), and types in `lib/types/`.
- **Keep data in `lib/mock/`.** All data is mock and typed. New entities get a type in `lib/types/index.ts` and data in a `lib/mock/*.ts` file.
- **Use design tokens** (`bg-surface`, `text-muted-foreground`, `bg-primary`, `border-border`) — never raw hex in components.
- **Pass both gates** on every change: `npx tsc --noEmit` (exit 0) and `npm run build` (clean).
- **Match existing patterns**: kebab-case files, PascalCase components, `@/` imports, presentational-vs-container split.

## Never

- ❌ Add a backend, database, real API, or live LLM. This is a front-end mock.
- ❌ Run `npm audit fix --force` — it upgrades to Next 16 and breaks the build. See `docs/tech-debt.md`.
- ❌ Change the pinned Next major version without an explicit, tested upgrade task.
- ❌ Duplicate card/row markup across pages — extract a component.
- ❌ Add a state library; extend `AppStateProvider` for shared state.
- ❌ Leave TODO stubs, dead code, or `console.log` in committed code.
- ❌ Introduce raw hex colors or inline styles (except unavoidable dynamic values).

## Preferred Libraries

- UI primitives: **shadcn/ui** (already in `components/ui/`) on top of **Radix**.
- Icons: **lucide-react**.
- Class merging: **clsx + tailwind-merge** via `cn()`.
- Don't add new UI/state dependencies without a clear need; check existing tools first.

## Constraints Specific to This Repo

- The `(app)` route group shares `AppShell`; `/login` is standalone — don't wrap login in the shell.
- Shared cross-page state is limited to `savedInvestors` and `completedResources`. Team/Copilot state is intentionally page-local.
- Mock data counts are tuned to the UI (e.g. 6 tasks → 33%, learning category counts). If you change seed data, update dependent docs and verify the displayed numbers.

## Definition of Done

- Type check + build pass.
- No console errors at runtime (verify with `npm run dev`).
- Follows coding standards; no duplicated markup.
- Relevant `/docs/` updated if behavior, data, or structure changed.
