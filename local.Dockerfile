FROM node:20.12.1-alpine3.19@sha256:d21256de67597675524c5f75c72bc483ef5c10dc3b035f0459fd10de3e82b3c9

ENV PORT 5020

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
