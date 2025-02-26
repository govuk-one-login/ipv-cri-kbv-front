ARG NODE_SHA=sha256:67225d40d3fb36314e392846effda04b95c973bf52e44ea064a8e0015c83056e

FROM node:22.4.1-alpine3.19@${NODE_SHA}
WORKDIR /app

COPY src ./src
COPY package.json package-lock.json ./

RUN <<COMMANDS
    npm install --ignore-scripts --frozen-lockfile
    npm run build
    apk add --no-cache tini curl
COMMANDS

ENV PORT=5020
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f "http://localhost:$PORT/healthcheck" || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["npm", "run", "dev"]
