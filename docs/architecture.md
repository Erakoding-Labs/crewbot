# Architecture

## Overview

FounderOS is a single-page-style founder dashboard built on **Next.js 14 (App Router)** with **TypeScript** and **Tailwind CSS**. It is a front-end-only application: all data is mock data, there is no backend, database, or external API.

## Major Components

```
app/
  layout.tsx              Root layout — <html>, fonts, dark theme class
  page.tsx                Redirects "/" → "/login"
  login/page.tsx          Mock auth split-screen (no auth state persisted)
  (app)/                  Route group for authenticated pages
    layout.tsx            Wraps children in <AppShell/>
    dashboard/page.tsx    Stats, weekly completion, insights, action items
    team/page.tsx         Members + task board + Add Member/Add Task dialogs
    investors/page.tsx    Tabs, search, stage filters, bookmark toggles
    learning/page.tsx     Featured grid, category filters, complete toggles
    copilot/page.tsx      Mock chat + insights/actions side panel

components/
  app-shell.tsx           Layout wrapper: sidebar + mobile drawer + main + AppStateProvider
  sidebar.tsx             Desktop rail + shared drawer content (SidebarContent)
  app-state.tsx           Client context: savedInvestors + completedResources
  page-header.tsx         Title/subtitle/actions header used by every page
  *-card.tsx / *-row.tsx  Presentational entity components (props in, markup out)
  badges.tsx              PriorityBadge, TagBadge, InsightCategoryLabel
  filter-pills.tsx        Generic selectable filter pill row
  ui/                     shadcn/ui primitives (Button, Card, Dialog, Tabs, ...)

lib/
  types/index.ts          All domain entity types
  mock/*.ts               Typed mock data, one file per domain area
  utils.ts                cn() class-name merge helper
```

## Data Flow

1. **Mock data** is imported directly from `lib/mock/*` into page components — no fetching layer.
2. **Page components** (mostly `"use client"`) compute derived values (filters, counts, completion %) at render time from the imported mock data plus local React state.
3. **Cross-page mutable state** lives in `AppStateProvider` (`components/app-state.tsx`), mounted once inside `AppShell`. It holds two `Set<string>`s:
   - `savedInvestors` — toggled by `InvestorCard`, read by the dashboard "Saved Investors" stat and the Investors "Saved" tab.
   - `completedResources` — toggled by `ResourceCard`, read by the dashboard "Resources Completed" stat.
4. **Local-only state** (Team members/tasks, Copilot messages) lives in the owning page via `useState` and is seeded from mock data. It is not shared and resets on navigation.

## Crewboot Platform Layer (PRD MVP)

On top of the original Replit dashboard, the PRD MVP features are implemented as a client-side platform:

- **`lib/store/store.tsx` — `StoreProvider` / `useStore`**: a single localStorage-backed store (`crewboot.db.v4`) holding `users`, `startups`, `joinRequests`, `tasks`, `conversations`, `messages`, `notifications`, `settings`, and `currentUserId`. Exposes auth (`signup`/`login`/`logout`), profile/startup CRUD, join requests, **project management** (`getStartupMembers`, `setMemberRole`, `getTasks`, `createTask`, `updateTask`, `setTaskStatus`, `deleteTask`), messaging, notifications, and settings. Mounted at the **root layout** so both `/login` and the app can use it.
- **`lib/store/seed.ts`**: initial users (across all roles), startups, conversations, messages, notifications. Demo account: `akshaycrln@gmail.com` / `password`.
- **Auth guard**: `AppShell` redirects to `/login` when there is no session; shows a loading state until the store hydrates (avoids SSR/localStorage mismatch).

### Onboarding (post-signup)
Signup now only collects name/email/password and routes to **`/onboarding`** — a full-screen 4-step wizard (role → skills → availability → interests) that lives outside the `(app)` group (root layout only, no sidebar). On finish it calls `updateProfile({ role, skills, availability, interests, onboarded: true })` and routes to `/dashboard`. `AppShell` enforces this: a signed-in user with `onboarded !== true` is redirected to `/onboarding`. New `User` fields: `availability` (`Availability` union), `interests: string[]`, `onboarded: boolean`. These feed matching — surfaced on `UserCard` and searchable on Discover.

### Full route map
- Public: `/` (landing — purpose, who-it's-for, how-it-works, CTA), `/login`, `/signup`, `/onboarding` (auth-gated wizard), `/forgot-password`
- App (`(app)` group, guarded): `/dashboard`, `/team`, `/discover`, `/investors`, `/messages`, `/notifications`, `/learning`, `/copilot`, `/profile`, `/startup`, `/recruitment`, `/settings`
  - **`/recruitment`** is founder-only (rendered in the sidebar and guarded in-page when the current user owns a startup). It lists applications to the founder's startup (review + accept/decline + message) and manages open roles. Non-owners are redirected to `/dashboard`.
  - **`/team`** is the project-management hub for the current user's startup: overview stats + overall progress, a Task Board (Todo/In Progress/Done kanban), and a Members & Roles roster. Store-backed via `tasks` + `Startup.memberRoles`. Founders create/edit/delete/assign tasks and set member roles; any member can move a task's status. Assignment fires a `task_assigned` notification. Users without a startup see a join/create empty state.

### New shared components
`UserCard` (Discover people + message action), `StartupCard` (Discover startups + apply-to-a-role dialog: pick an open role + write a pitch, with the PRD one-startup exclusivity rule), `ApplicantCard` (an application on the Recruitment board), `AuthShell` (signup/forgot split-screen), `TaskCard` + `TaskDialog` (project board card + create/edit form), `TeamMemberCard` (roster tile with role + workload), `UserAvatar` (initial tile from `avatarColor`, shared by task/member cards).

### Applications
A `JoinRequest` optionally carries `roleId`/`roleTitle` — the open role applied for via `requestToJoin(startupId, message, roleId?)`. Founders review them on `/recruitment`; the applicant's pitch is the `message`.

## Key Design Decisions

- **Route group `(app)`** isolates the authenticated shell from `/login`, which has its own full-screen layout.
- **Presentational vs. container split**: cards/rows/badges are pure and take props; pages own data and state. This keeps markup DRY and reusable.
- **Single client context** for the only two pieces of genuinely cross-page state, rather than a global store library — keeps the dependency surface minimal.
- **Dark-only theme** via a fixed `dark` class on `<html>` and HSL design tokens in `app/globals.css`.
- **No persistence**: state is in-memory only. A page refresh resets saved/completed sets and any added members/tasks. This is intentional for a mock.
