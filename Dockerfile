FROM node:8.6.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn

ENV NODE_ENV production
COPY . .
RUN yarn build

CMD [ "yarn", "server" ]
