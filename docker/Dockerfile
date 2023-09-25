FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential

WORKDIR /app

ADD package.json .
ADD steedos.config.js .

ENV NODE_ENV=production

RUN yarn --production && yarn cache clean

CMD ["yarn", "start"]