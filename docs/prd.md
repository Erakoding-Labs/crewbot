# Product Requirements

## Product

**FounderOS** — a founder's operating dashboard that brings team, fundraising, learning, and AI guidance into one place. Demo persona: "Akshay" at "XYZ corp."

## Goals

- Give early-stage founders a single home for the things that matter weekly: team progress, investor pipeline, learning, and advice.
- Reduce context-switching across spreadsheets, CRMs, and bookmarks.

## Feature Scope & User Stories

### Login (`/login`)
- As a user, I can sign in (mock) and land on the dashboard.
- Acceptance: email/password fields, password visibility toggle, social login buttons; any submit routes to `/dashboard`.

### Dashboard (`/dashboard`)
- As a founder, I see at-a-glance stats: team members, tasks done, saved investors, resources completed.
- As a founder, I see weekly task completion as a % with a progress bar and a done/in-progress/todo breakdown.
- As a founder, I see Copilot Insights and prioritized Action Items.
- Acceptance: "Saved Investors" and "Resources Completed" reflect live shared state from other pages.

### Team (`/team`)
- As a founder, I see team members with per-person done/pending counts.
- As a founder, I see a Todo / In Progress / Done task board.
- As a founder, I can add a member or a task via a dialog.
- Acceptance: added items appear immediately; counts and columns update.

### Investors (`/investors`)
- As a founder, I can browse investors and filter by stage and free-text search.
- As a founder, I can bookmark investors and view only saved ones via a tab.
- Acceptance: ≥8 seeded investors; filters and search operate on mock data; bookmark state drives the dashboard stat.

### Learning Hub (`/learning`)
- As a founder, I see featured resources and a full filterable list by category.
- As a founder, I can mark resources complete.
- Acceptance: category pills show live counts; completing a resource drives the dashboard stat.

### AI Copilot (`/copilot`)
- As a founder, I can chat with an advisor and use suggested prompts.
- As a founder, I see insights and action items alongside the chat.
- Acceptance: mock canned responses (no real LLM); suggestion chips send messages.

## Out of Scope (current)

- Real authentication, persistence, backend, or live LLM.
- Editing/deleting investors or resources.
- Multi-user / collaboration.
