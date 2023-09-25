FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential

WORKDIR /app

COPY ./.env ./
COPY ./lerna.json ./
COPY ./package.json ./
COPY ./steedos.config.js ./
COPY ./yarn.lock ./
COPY ./packages ./packages
COPY ./server ./packages/server
COPY ./services ./services
COPY ./steedos-packages ./services
COPY ./ee ./services

RUN yarn
RUN yarn run build

CMD ["yarn", "start"]
