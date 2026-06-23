# API Patterns

> **Status:** FounderOS currently has **no backend and no API layer.** All data is static mock data imported from `lib/mock/`. This document defines the conventions to follow **if/when** a real API is introduced, so the migration is consistent.

## Current State (Mock)

- Data lives in `lib/mock/*.ts` as typed arrays (`investors`, `teamMembers`, `tasks`, `resources`, `insights`, `actionItems`).
- Pages import mock data directly. Mutations are in-memory React state only.
- The Copilot "responses" come from `getCopilotReply()` in `lib/mock/copilot.ts` — a deterministic keyword matcher, **not** an LLM call.

## When Adding a Real API

### Data access layer
- Introduce `lib/api/` with one module per domain (`investors.ts`, `team.ts`, ...). Pages import from `lib/api`, never `fetch` inline.
- Keep the same return **types** from `lib/types/` so components don't change.
- Replace mock imports module-by-module so the UI contract stays stable.

### Fetching strategy
- Prefer **Server Components** for read-only data (fetch in the page/segment, pass to client components as props).
- Use Route Handlers under `app/api/<resource>/route.ts` for mutations and client-triggered actions.

### Request/response format
- JSON. Resource objects mirror the `lib/types/` interfaces exactly.
- Lists return `{ data: T[] }`; single items return the object directly.
- Use camelCase keys (match the TS types).

### Error handling
- Route Handlers return appropriate HTTP status + `{ error: { code, message } }`.
- Client callers surface a user-facing message; never swallow errors silently.
- Validate input at the boundary (e.g. with zod) before processing.

### Auth
- Login is currently mock (`/login` just routes to `/dashboard`). A real implementation should gate the `(app)` route group via middleware and replace the mock sign-out in `sidebar.tsx`.
