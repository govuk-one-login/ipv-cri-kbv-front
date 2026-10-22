# 22-alpine amd64 (node version 22.23.4)
ARG NODE_SHA=sha256:025b8e975a61d94e33abeafaad1255ef44e4898cf1a1b6446860009c72e6d284
ARG DYNATRACE_SOURCE=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs
ARG BASE=with_dynatrace

FROM ${DYNATRACE_SOURCE} AS dynatrace
FROM node@${NODE_SHA} AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY /src ./src

RUN npm ci --omit=dev && npm run build && npm prune

FROM node@${NODE_SHA} AS plain

RUN apk --no-cache upgrade && apk add --no-cache tini curl

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/src ./src


ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f "http://localhost:$PORT/healthcheck" || exit 1

# node
USER 1000

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=EXPERIAN-KBV-CRI-FRONT-$RANDOM && tini npm start"]

CMD ["npm", "start"]

FROM plain AS with_dynatrace
COPY --from=dynatrace / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so
FROM ${BASE} AS release
