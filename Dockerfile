# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy build output
COPY --from=builder /app/dist ./dist

# Copy node_modules (needed for native externals: better-sqlite3, geoip-lite)
COPY --from=builder /app/node_modules ./node_modules

# Copy package files (needed for pnpm scripts) and migration assets
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/db ./db

# Persistent data directory for SQLite
RUN mkdir -p data

EXPOSE 3000

# Run DB migrations then start the Nitro SSR server
CMD ["sh", "-c", "pnpm db:migrate && node dist/analog/server/index.mjs"]
