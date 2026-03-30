# Agents

This file provides context and guidelines for AI coding agents working on the **simpa** project.

## Project Overview

**simpa** is a self-hosted, privacy-friendly web analytics platform built with [AnalogJS](https://analogjs.org) — the fullstack meta-framework for Angular. It tracks page views, referrers, countries, and clients for registered sites, without cookies or third-party dependencies.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [AnalogJS](https://analogjs.org) v2 (Angular 21 + Vite + Nitro) |
| Language | TypeScript |
| Styling | CSS (global `src/styles.css`) |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team) + `better-sqlite3` |
| Build Tool | Vite 7 |
| Test Runner | Vitest 4 |
| Package Manager | pnpm |

## Project Structure

```
src/
  app/
    pages/          # File-based routing (AnalogJS pages)
  server/
    routes/api/     # API route handlers (h3-based)
    plugins/        # Server plugins
    utils/          # Shared server utilities
  main.ts           # Client entry point
  main.server.ts    # SSR entry point
db/
  schema.ts         # Drizzle ORM table definitions
  index.ts          # Database connection
data/               # SQLite database file (runtime, gitignored)
```

## Key Conventions

### Routing
- Pages live in `src/app/pages/` and use AnalogJS file-based routing (`.page.ts` suffix).
- API endpoints live in `src/server/routes/api/` and follow the naming pattern `<resource>.<method>.ts` (e.g., `sites.get.ts`, `tracker.post.ts`).

### Database
- Schema is defined in `db/schema.ts` using Drizzle ORM.
- After modifying the schema, run `pnpm db:generate` then `pnpm db:migrate`.
- The database file path defaults to `data/simpa.db` and can be overridden via the `DB_PATH` environment variable.

### Tables
- `site` — registered sites (id, name, url, createdAt)
- `count` — raw page view events (siteId, date, referer, page, country, ip, client)
- `day_count` — aggregated daily counts (reserved for future use)

### Testing
- Tests use Vitest with jsdom and live alongside source files (`*.spec.ts`).
- Run with `pnpm test`.

## Common Commands

```bash
pnpm start          # Dev server at http://localhost:5173
pnpm build          # Production build
pnpm test           # Run unit tests
pnpm db:generate    # Generate Drizzle migrations from schema changes
pnpm db:migrate     # Apply pending migrations
pnpm preview        # Serve the production build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_PATH` | `data/simpa.db` | Path to the SQLite database file |

## Notes for Agents

- This project uses **ESM** (`"type": "module"` in `package.json`). Avoid CommonJS patterns.
- Server-side code (API routes, plugins) runs in a **Nitro** environment — use `h3` utilities for request/response handling.
- The tracker endpoint (`/api/tracker`) is designed to be called from external sites to record page views; it should remain lightweight and have minimal dependencies.
- `geoip-lite` and `better-sqlite3` are **native/external** modules and are explicitly excluded from Vite's bundling in `vite.config.ts`.
