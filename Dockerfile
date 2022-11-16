FROM node:19.1.0-alpine3.15@sha256:8d87f28bd6f8a6c717e0be1defc297b22672b79820c83a7087a80548fa13d2b4 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY /src ./src

RUN yarn install
RUN yarn build

# 'yarn install --production' does not prune test packages which are necessary
# to build the app. So delete nod_modules and reinstall only production packages.
RUN [ "rm", "-rf", "node_modules" ]
RUN yarn install --production --frozen-lockfile

FROM node:19.1.0-alpine3.15@sha256:8d87f28bd6f8a6c717e0be1defc297b22672b79820c83a7087a80548fa13d2b4 AS final

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini"]

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/src ./src


ENV PORT 8080
EXPOSE $PORT

ENTRYPOINT ["tini", "--"]

CMD ["yarn", "start"]
