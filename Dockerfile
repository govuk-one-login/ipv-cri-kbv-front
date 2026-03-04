ARG DYNATRACE_SOURCE=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs
ARG NODE_SHA=sha256:e4bf2a82ad0a4037d28035ae71529873c069b13eb0455466ae0bc13363826e34

FROM ${DYNATRACE_SOURCE} AS dynatrace
FROM node:22-alpine@${NODE_SHA} AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY /src ./src

RUN npm ci --omit=dev && npm run build && npm prune

FROM node:22-alpine@${NODE_SHA} AS final

RUN apk --no-cache upgrade && apk add --no-cache tini curl

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/src ./src

COPY --from=dynatrace / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=EXPERIAN-KBV-CRI-FRONT-$RANDOM && tini npm start"]

CMD ["npm", "start"]
