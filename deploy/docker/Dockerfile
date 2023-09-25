FROM node:14-slim as builder

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential

WORKDIR /app

ADD package.json .
ADD steedos.config.js .

ENV NODE_ENV=production

RUN npm i --production  && npm cache clean --force

FROM node:14-slim

RUN apt-get update  \
    && apt-get install curl -y \
    && apt-get install -y build-essential \
    && apt-get clean -y

WORKDIR /

RUN mkdir -p /app

# copy npm scripts
COPY --from=builder /app/package.json ./app/package.json
COPY --from=builder /app/steedos.config.js ./app/steedos.config.js
COPY --from=builder /app/node_modules ./app/node_modules

WORKDIR /app

CMD ["npm", "start"]