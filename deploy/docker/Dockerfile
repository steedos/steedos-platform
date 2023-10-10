FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential

COPY ./app/platform /app

WORKDIR /app

ENV NODE_ENV=production

RUN yarn --production && yarn cache clean

CMD ["yarn", "start"]