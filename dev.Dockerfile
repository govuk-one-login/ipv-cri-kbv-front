# https://hub.docker.com/layers/arm64v8/node/22-bookworm/images/sha256-1d625ee0a8aba3fcbabe2ce39330b4d2a53a80f38979f200d6ef11e899bde1df
ARG NODE_SHA=sha256:47eaa0cad48cd06a6da0d2a0a3f3dbbcb3b311513ae1e23b7aa3a822d490486a
ARG DYNATRACE_SOURCE=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs

FROM ${DYNATRACE_SOURCE} AS dynatrace
FROM arm64v8/node:22-bookworm@${NODE_SHA} AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY /src ./src

RUN npm ci && npm run build && npm prune

FROM arm64v8/node:22-bookworm@${NODE_SHA} AS final

RUN <<COMMANDS
  apt-get update -y
  apt-get install -y --no-install-recommends curl tini
  apt-get clean
COMMANDS

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/src ./src

# Add in dynatrace layer
COPY --from=dynatrace / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["npm", "start"]
