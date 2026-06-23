# Domain Glossary

All entity types are defined in [`lib/types/index.ts`](../lib/types/index.ts). Use these exact names.

## Entities

| Entity | Description | Key fields |
|--------|-------------|-----------|
| **Investor** | A potential funder shown on the Investors page. | `name`, `role`, `firm`, `bio`, `stages[]`, `sectors[]`, `location`, `checkSize`, `portfolio[]` |
| **TeamMember** | A person on the founder's team. | `id`, `name`, `role` |
| **Task** | A unit of work on the team board. | `title`, `assigneeId?`, `status` |
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

- **Weekly completion %** = `done tasks / total tasks`, rounded. Seeded data = 2 done / 6 total = 33%.
- **Member done/pending counts** are derived from tasks where `assigneeId === member.id`; `pending = in-progress + todo`. Unassigned tasks (no `assigneeId`) appear on the board but count toward no member.
- **Saved Investors** stat = size of `savedInvestors` set (starts at 0).
- **Resources Completed** stat = size of `completedResources` set (starts at 0).
- A **featured** resource (`featured: true`) appears in both the Featured grid and the full list.

## Color Semantics

- Primary accent **violet `#7C6DF2`**: logo, active nav, primary buttons, filled stage tags, progress bar, Funding insight.
- **High** priority = red, **Medium** = amber.
- Insight categories: **Team** = blue, **Funding** = violet, **Learning** = green.
