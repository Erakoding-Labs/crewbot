# Domain Glossary

All entity types are defined in [`lib/types/index.ts`](../lib/types/index.ts). Use these exact names.

## Entities

| Entity | Description | Key fields |
|--------|-------------|-----------|
| **Investor** | A potential funder shown on the Investors page. | `name`, `role`, `firm`, `bio`, `stages[]`, `sectors[]`, `location`, `checkSize`, `portfolio[]` |
| **ProjectTask** | A store-backed unit of work on a startup's project board. | `startupId`, `title`, `description?`, `assigneeId?` (a `User`), `status`, `priority`, `dueDate?` |
| **Resource** | A learning resource (book/article). | `title`, `description`, `author`, `duration`, `category`, `featured`, `url` |
| **Insight** | A Copilot observation shown on dashboard + copilot. | `category`, `title`, `body` |
| **ActionItem** | A recommended next action with priority. | `title`, `description`, `priority` |

## Enums / Unions

- **Stage**: `"Pre-Seed" | "Seed" | "Series A" | "Series B"` — investor funding stages; also the Investors filter pills.
- **TaskStatus**: `"todo" | "in-progress" | "done"` — maps to the three task board columns.
- **ResourceCategory**: `"Product" | "Growth" | "Fundraising" | "Strategy" | "Team" | "Fundamentals" | "AI"` — Learning Hub filter categories.
- **InsightCategory**: `"Team" | "Funding" | "Learning"` — drives the colored label (blue / violet / green).
- **Priority**: `"High" | "Medium" | "Low"` — drives the priority badge color (red / amber / gray).

## Business Rules

- **Completion %** = `done tasks / total tasks`, rounded (0 when there are no tasks). Seeded `s-xyz` board = 2 done / 7 total = 29%. Shown on `/team` and the dashboard from live store tasks.
- **Member done/pending counts** are derived from tasks where `assigneeId === member.id`; `pending = in-progress + todo`. Unassigned tasks (no `assigneeId`) appear on the board but count toward no member.
- **Member roles** (e.g. "CTO") live in `Startup.memberRoles` (`userId -> title`) and are editable by the founder on `/team`. They are distinct from the account-level `User.role`.
- **Task assignment** notifies the assignee (`task_assigned`) on create or reassignment, except self-assignment. Any team member can move a task's status; only the founder can create/edit/delete tasks and set roles.
- **Saved Investors** stat = size of `savedInvestors` set (starts at 0).
- **Resources Completed** stat = size of `completedResources` set (starts at 0).
- A **featured** resource (`featured: true`) appears in both the Featured grid and the full list.

## Color Semantics

- Primary accent **violet `#7C6DF2`**: logo, active nav, primary buttons, filled stage tags, progress bar, Funding insight.
- **High** priority = red, **Medium** = amber.
- Insight categories: **Team** = blue, **Funding** = violet, **Learning** = green.
