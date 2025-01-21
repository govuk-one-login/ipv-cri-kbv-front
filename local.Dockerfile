FROM node:22.4.1-alpine3.19@sha256:67225d40d3fb36314e392846effda04b95c973bf52e44ea064a8e0015c83056e

ENV PORT 5020

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f "http://localhost:$PORT/healthcheck" || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["yarn", "run", "dev"]
