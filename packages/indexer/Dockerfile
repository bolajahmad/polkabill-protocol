FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /squid
RUN corepack enable
COPY package.json .
RUN pnpm install --no-frozen-lockfile
COPY tsconfig.json .
COPY schema.graphql .
COPY commands.json .
COPY db db
COPY src src
RUN pnpm build

FROM base AS deps
WORKDIR /squid
RUN corepack enable
COPY package.json .
RUN pnpm install --prod --no-frozen-lockfile

FROM base AS squid
WORKDIR /squid
COPY --from=deps /squid/package.json ./package.json
COPY --from=deps /squid/node_modules ./node_modules
COPY --from=builder /squid/lib ./lib
COPY --from=builder /squid/db ./db
COPY --from=builder /squid/schema.graphql ./schema.graphql
COPY --from=builder /squid/commands.json ./commands.json
RUN printf "loglevel=silent\nupdate-notifier=false\n" > /squid/.npmrc
RUN npm i -g @subsquid/commands && ln -sf $(which squid-commands) /usr/local/bin/sqd
ENV PROCESSOR_PROMETHEUS_PORT=3000