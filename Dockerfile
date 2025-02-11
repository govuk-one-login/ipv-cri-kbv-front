ARG DYNATRACE_SOURCE=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs
ARG NODE_SHA=sha256:67225d40d3fb36314e392846effda04b95c973bf52e44ea064a8e0015c83056e
ARG NODE_VERSION=22.4.1-alpine3.19

FROM ${DYNATRACE_SOURCE} AS dynatrace

FROM node:${NODE_VERSION}@${NODE_SHA} AS builder
WORKDIR /app

COPY /src ./src
COPY package.json yarn.lock ./

RUN <<COMMANDS
  yarn install --ignore-scripts --frozen-lockfile
  yarn build
  rm -rf node_modules/  # Only keep production packages
  yarn install --production --ignore-scripts --frozen-lockfile
COMMANDS

FROM node:${NODE_VERSION}@${NODE_SHA} AS runner
RUN apk --no-cache upgrade && apk add --no-cache tini curl
WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
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
ENTRYPOINT ["sh", "-c", "export DT_HOST_ID=EXPERIAN-KBV-CRI-FRONT-$RANDOM && tini npm start"]
CMD ["yarn", "start"]
