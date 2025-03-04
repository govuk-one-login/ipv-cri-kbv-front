ARG DYNATRACE_SOURCE=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs
ARG NODE_SHA=sha256:67225d40d3fb36314e392846effda04b95c973bf52e44ea064a8e0015c83056e
FROM node:22.4.1-alpine3.19@${NODE_SHA} AS builder

FROM ${DYNATRACE_SOURCE} AS dynatrace
WORKDIR /app

COPY package.json package-lock.json ./
COPY /src ./src

RUN npm ci && npm run build && npm prune

FROM node:22.4.1-alpine3.19@${NODE_SHA} AS final
RUN apk --no-cache upgrade && apk add --no-cache tini curl

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/src ./src

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=EXPERIAN-KBV-CRI-FRONT-$RANDOM && tini npm start"]

CMD ["npm", "start"]
