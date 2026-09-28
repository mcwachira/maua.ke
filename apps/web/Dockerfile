# apps/web/Dockerfile — Next.js frontend for maua.ke
#
# Two targets:
#   dev    — hot-reloading `next dev` server
#   runner — production standalone build
#
# Requires next.config.ts to set:
#   output: 'standalone'

FROM node:24-alpine AS base

RUN corepack enable
RUN apk add --no-cache libc6-compat

# ---------------------------------------------------------------------------
# Dev
# ---------------------------------------------------------------------------
FROM base AS dev

WORKDIR /app

COPY . .

# Docker builds have no interactive TTY.
ENV CI=true

RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "dev"]


# ---------------------------------------------------------------------------
# Production build
# ---------------------------------------------------------------------------
FROM base AS pruner

WORKDIR /app

COPY . .

RUN pnpm dlx turbo prune web --docker


FROM base AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ .

# turbo prune --docker doesn't include pnpm-workspace.yaml
COPY --from=pruner /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

ENV CI=true

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .


# NEXT_PUBLIC_* build args
ARG NEXT_PUBLIC_API_URL=http://localhost:8001/api
ARG NEXT_PUBLIC_APP_NAME=maua-ke

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}

RUN pnpm turbo run build --filter=web...


# ---------------------------------------------------------------------------
# Production runner
# ---------------------------------------------------------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public

COPY --from=installer \
    --chown=nextjs:nodejs \
    /app/apps/web/.next/standalone \
    ./

COPY --from=installer \
    --chown=nextjs:nodejs \
    /app/apps/web/.next/static \
    ./apps/web/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]