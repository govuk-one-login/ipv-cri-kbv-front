FROM node:21.7.1-alpine3.19@sha256:577f8eb599858005100d84ef3fb6bd6582c1b6b17877a393cdae4bfc9935f068

ENV PORT 5020

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
