FROM node:14-slim

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential

WORKDIR /app

ADD .env .
ADD lerna.json .
ADD package.json .
ADD steedos.config.js .
ADD steedos-packages .

ENV NODE_ENV=production

RUN yarn --production

CMD ["yarn", "start"]