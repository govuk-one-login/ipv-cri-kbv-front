FROM node:23.3.0-alpine3.19@sha256:1c380ed40f8d2f42081a07e8bcea5048b18df1e1dab3e6191e0ad095c84b9e12

ENV PORT 5020

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
