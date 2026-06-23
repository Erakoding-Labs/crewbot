# Tech Debt & Known Limitations

## Intentional (by design for a mock app)

- **localStorage persistence, no backend.** The Crewboot platform layer (`lib/store/`) persists users, startups, messages, notifications, join requests, and settings to `localStorage` under `crewboot.db.v1`. This is a **client-only mock store** — there is no server, DB, or real auth. Swapping to a real backend = replace the store internals with API calls (see `api-patterns.md`); the component contracts stay the same.
  - Implication: data is **per-browser**. Messaging between two users only "works" within the same browser session. Multi-user real-time needs a backend.
  - The legacy `AppStateProvider` (`savedInvestors`, `completedResources`) is still in-memory only (resets on refresh) — fine for the Replit dashboard demo.
- **Mock auth.** `lib/store/store.tsx` does real-ish signup/login/session against the localStorage store and the `(app)` group is guarded by `AppShell` (redirects to `/login`). Passwords are stored in **plaintext in the mock store** — never carry this into a real backend.
- **Mock Copilot.** `getCopilotReply()` is a keyword matcher, not an LLM (PRD defers AI to post-MVP).
- **Two screen tiers coexist (deliberate, per client "exact Replit version"):** the original Replit screens (Dashboard, Team, Investors, Learning, Copilot) stay faithful on their original mock data (`lib/mock/`); the new PRD platform screens (Discover, Messages, Notifications, Profile, Startup, Settings + auth) run on the `lib/store/` layer. The Replit Team board is still on `lib/mock/team` and is not wired to startup membership — reconcile if these must share one source.

## Known Limitations

- **Team page state is local and isolated.** Members/tasks added on `/team` do not affect the dashboard "Team Members"/"Tasks Done" stats (those read the static mock). If these should sync, lift team state into `AppStateProvider` like investors/resources.
- **No test suite yet.** No test runner configured. See `testing-strategy.md` for the planned setup.
- **No `lib/api/` layer.** Pages import mock data directly; introduce an API module layer before wiring a real backend (see `api-patterns.md`).

## Dependency / Security Notes

- **Next.js pinned to 14.2.33** per the "Next 14+" requirement. `npm audit` flags several Next advisories (DoS / SSRF / cache-poisoning) that are only patched in **Next 16**, which is a breaking App Router upgrade. These advisories concern production server configs (image optimizer, RSC streaming, rewrites) and do not affect this local, data-less mock. **Do not** run `npm audit fix --force` casually — it pulls Next 16 and breaks the build. Revisit as a deliberate, tested upgrade.
- `postcss` bumped to `^8.5.15` (patched). The nested copy under `next/node_modules` may still show as outdated until Next is upgraded.

## Avoid Compounding Debt

- Keep presentational components pure — don't sneak data fetching into cards.
- Don't add a second source of truth for shared state; extend `AppStateProvider`.
- Don't introduce raw hex colors; use design tokens.
