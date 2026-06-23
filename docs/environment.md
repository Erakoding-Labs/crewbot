# Environment Setup

## Prerequisites

- **Node.js 18.18+** (developed on Node 22).
- **npm** (project uses npm; lockfile is `package-lock.json`).

## Local Development

```bash
npm install        # install dependencies
npm run dev        # start dev server (default http://localhost:3000)
```

If port 3000 is taken, Next picks the next free port and prints the URL. To force one:

```bash
PORT=3100 npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build (also runs type check + lint) |
| `npm run start` | Serve the production build |
| `npm run lint` | Next.js ESLint |

## Environment Variables

- **None required.** The app has no backend, no secrets, no third-party services. It runs fully offline after `npm install`.
- If a real API/auth is added later, document new vars here and provide a `.env.example`.

## Tech Stack Versions

- Next.js `14.2.33` (App Router) — pinned; see `tech-debt.md` before upgrading.
- React `18.3`, TypeScript `5.6`.
- Tailwind CSS `3.4`, shadcn/ui primitives, lucide-react icons.

## Deployment

- Static-friendly Next build (all current routes prerender as static). Deployable to any Next-compatible host (e.g. Vercel) with no env config.
