FROM node:14-slim AS builder

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
COPY ./.yarnclean ./.yarnclean
COPY ./packages ./packages
COPY ./server ./packages/server
COPY ./services ./services
COPY ./steedos-packages ./services
COPY ./ee ./services

RUN yarn
RUN yarn run build
RUN yarn autoclean
RUN yarn lerna clean --yes

FROM node:14-slim

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

COPY --from=builder ./app/.env ./
COPY --from=builder ./app/lerna.json ./
COPY --from=builder ./app/package.json ./
COPY --from=builder ./app/steedos.config.js ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services ./services

RUN yarn --production 
RUN yarn cache clean

CMD ["yarn", "start"]
