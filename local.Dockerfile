FROM node:18.15.0-alpine

ENV PORT 5020

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
