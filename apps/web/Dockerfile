# apps/web/Dockerfile — Next.js frontend for maua.ke
#
# Two targets:
#   dev    — hot-reloading `next dev` server, meant to run with the repo
#            bind-mounted over /app (see docker-compose.yml's `web`
#            service). Point docker-compose at this target for local
#            development: build.target: dev
#   runner — production standalone build (`next start`), self-contained,
#            no bind mount. Use this target for staging/prod.
#
# Requires next.config.js to set `output: 'standalone'` for the `runner`
# target — without it, .next/standalone won't exist and that stage will
# fail at its COPY step.
#
# Important: don't bind-mount source over the `runner` image. That stage
# only contains the compiled standalone output (no node_modules, no
# server.js at the source path) — mounting raw source over it breaks the
# CMD below. The bind mount in docker-compose.yml is only safe to use
# against the `dev` target.

FROM node:22-alpine AS base
RUN corepack enable
RUN apk add --no-cache libc6-compat

# ---------------------------------------------------------------------------
# Dev — run with ./apps/web (or the whole repo) bind-mounted at /app
# ---------------------------------------------------------------------------
FROM base AS dev
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "dev"]

# ---------------------------------------------------------------------------
# Production build stages
# ---------------------------------------------------------------------------
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune web --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
# turbo prune --docker doesn't include pnpm-workspace.yaml in out/json/ (it
# only carries package.json files + the lockfile there) — copy it in
# explicitly so pnpm sees onlyBuiltDependencies during install, not after.
COPY --from=pruner /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .

# NEXT_PUBLIC_* build args get inlined into the client bundle at build time.
# These names MUST match the build `args` keys docker-compose.yml passes —
# a mismatched name here silently falls back to the default below instead
# of failing the build, so if an env value isn't showing up in the
# browser, check both sides.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ARG NEXT_PUBLIC_APP_NAME=maua-ke
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}

RUN pnpm turbo run build --filter=web...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
ENV PORT=3000
EXPOSE 3000
CMD ["node", "apps/web/server.js"]