# Budget Manager | DevMinds

Plan, allocate and track a budget — rebuilt with a modern stack.

| Layer | Stack |
| --- | --- |
| Frontend (`web/`) | React 18 + Vite + TypeScript, Tailwind + shadcn/ui components, framer-motion, zustand, react-hook-form + zod (yup also supported via `schemaResolver`), recharts, light/dark mode |
| Backend (`server/`) | NestJS 10 + Prisma 5, JWT auth (bcrypt), zod validation, dotenv, nodemon |
| Database | SQLite, Neon Postgres, Turso (libSQL) or MySQL — selected with `DB_PROVIDER` |

## Architecture
- **server/src/budget/domain** – pure business rules (summaries, over-allocation checks), unit-tested, framework-free.
- **\*.repository.ts** – persistence only (Prisma). **\*.service.ts** – use cases. **\*.controller.ts** – HTTP + validation.
- `bootstrap.ts` builds the app once and is shared by `main.ts` (long-running server) and `serverless.ts` (Vercel function).
- **web/src/features/** – feature folders (auth, budget); `components/ui` – shadcn primitives; `stores/` – zustand state; `lib/api.ts` – single HTTP client.

## Getting started
```bash
npm run install:all
cp server/.env.example server/.env      # pick DB_PROVIDER + DATABASE_URL, set JWT_SECRET
npm run db:push --prefix server          # create tables
npm run dev:server                       # http://localhost:4000/api
npm run dev:web                          # http://localhost:5173
npm test                                 # server (jest) + web (vitest)
```

## Database providers
Prisma cannot read the provider from an env var, so `server/prisma/select-provider.js` renders `schema.prisma`
from `schema.template.prisma` before `generate`/`db push` (run automatically by the npm scripts).

| `DB_PROVIDER` | `DATABASE_URL` | Extra |
| --- | --- | --- |
| `sqlite` | `file:./dev.db` | local dev only |
| `neon` / `postgresql` | `postgresql://…neon.tech/neondb?sslmode=require` | |
| `mysql` | `mysql://user:pass@host:3306/db` | any free MySQL (Aiven, TiDB Serverless, …) |
| `turso` | `file:./dev.db` (CLI only) | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`; create tables with `prisma migrate diff --script` + `turso db shell` |

## Deployment (Vercel)
`vercel.json` builds both apps, serves `web/dist` as a static SPA and runs NestJS as a single serverless
function (`api/index.js` → `server/dist/serverless.js`). Use a hosted DB (Neon recommended; SQLite does not persist on Vercel).

Env vars on Vercel: `DB_PROVIDER`, `DATABASE_URL`, `JWT_SECRET`, optional `JWT_EXPIRES_IN`, `TURSO_*`, `RECAPTCHA_SECRET_KEY` + `REACT_APP_RECAPTCHA_SITE_KEY` (or `VITE_…`), `RECAPTCHA_ALLOWED_HOSTS`.
