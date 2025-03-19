FROM node:20.18-slim

RUN apt-get update || : && apt-get install -y \
    python3 \
    curl \
    build-essential
    
# RUN npm install -g typescript ts-node

WORKDIR /app

RUN mkdir -p ./storage/data/nodered

COPY ./public ./public
COPY ./package.json .
COPY ./flow-builder.png .
COPY ./flows-template.json .
COPY ./logo.png .
COPY ./settings.js .

RUN yarn --production && yarn cache clean

CMD ["yarn", "start"]