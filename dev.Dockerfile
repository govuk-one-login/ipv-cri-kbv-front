ARG DYNATRACE_SOURCE=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs
ARG NODE_SHA=sha256:b16c4e21f9e9e4d02c226d7b2dde3283fc9315104b66009af546b50f5c7acad4

FROM ${DYNATRACE_SOURCE} AS dynatrace

FROM arm64v8/node@${NODE_SHA} AS builder
WORKDIR /app

COPY /src ./src
COPY package.json package.lock ./

RUN <<COMMANDS
  npm install --ignore-scripts --frozen-lockfile
  npm run build
  rm -rf node_modules/  # Only keep production packages
  npm install --production --ignore-scripts --frozen-lockfile
COMMANDS

FROM arm64v8/node@${NODE_SHA} AS runner
WORKDIR /app

RUN <<COMMANDS
  apt-get update -y
  apt-get -y --no-install-recommends install tini curl
  apt-get clean
COMMANDS

COPY --from=builder /app/package.json /app/package.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

COPY --from=dynatrace / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f "http://localhost:$PORT/healthcheck" || exit 1

USER node
ENTRYPOINT ["tini", "--"]
CMD ["npm", "start"]
