# nextjs-supabase-starter

Phase 0 walking skeleton for the "simple web app" default stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Zod + Supabase, deployed on Vercel. It already passes lint, format, typecheck, unit tests, a Playwright phone-width smoke test and a build.

## Create a project from it

```bash
gh repo create <app> --template tonylxm/nextjs-supabase-starter --private --clone
```

Then:

1. Rename: set `name` in `package.json`, and replace this README.
2. `pnpm install` (also installs the Husky hook).
3. `pnpm supabase start`, then copy `.env.example` to `.env.local` and fill it from `pnpm supabase status`.
4. `pnpm dev` and open http://localhost:3000.
5. In the GitHub repo settings, turn on secret scanning and push protection (templates don't copy settings).
6. Import the repo in Vercel and add the same env vars. Production deploys from `main`, and PRs get previews.
7. In the hosted Supabase project, under Authentication → URL Configuration, set the Site URL to production and add `https://<your-domain>/auth/callback` (and your Vercel preview pattern) to the redirect URLs, so email confirmation links work.

**Team mode** (branch + PR, CI blocks merge): remove the hook with `pnpm remove husky lint-staged && rm -rf .husky`, delete the `prepare` and `lint-staged` entries from `package.json`, and protect `main` so it requires the CI check.

## Scripts

| Script                                           | Does                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `dev` / `build` / `start`                        | Next.js                                                                                    |
| `lint` / `format` / `format:check` / `typecheck` | ESLint, Prettier, `next typegen && tsc --noEmit` (route types live in gitignored `.next/`) |
| `test`                                           | Vitest (unit and component)                                                                |
| `test:e2e`                                       | Playwright smoke test (run `pnpm exec playwright install chromium` once)                   |

## What's included

- Supabase Auth (`@supabase/ssr`), deny by default: `src/proxy.ts` refreshes the session on every request and sends signed-out visitors to `/login`, except for the public paths in `src/lib/supabase/routes.ts`. Pages that show user data check again with `getClaims()` (see `/account`).
  - `src/lib/supabase/server.ts` and `client.ts` create a client per request (server) or per browser.
  - `/login` signs in or creates an account with email and password. `/auth/callback` finishes email confirmation. Local Supabase skips confirmation.
  - New tables need Row Level Security and policies before the browser can read them.
- Env validation in `src/lib/env.ts`, checked at server start by `src/instrumentation.ts`. A missing var fails with a clear message.
- CI (`.github/workflows/ci.yml`) and Dependabot, copied from the project-starter skill.
- A pre-commit hook that runs lint-staged (auto-fix only, no tests).
- `AGENTS.md` holds only the Next.js agent rules block. project-starter's agents-md step fills in the rest.
