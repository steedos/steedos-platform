FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential

WORKDIR /app

COPY .env ./
COPY lerna.json ./
COPY package.json ./
COPY steedos.config.js ./
COPY yarn.lock ./
COPY ee ./ee
COPY packages ./packages
COPY server ./server
COPY services ./services
COPY steedos-packages ./steedos-packages

RUN yarn
RUN yarn run build

CMD ["yarn", "start"]
