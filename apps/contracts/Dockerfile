FROM node:8.16.0

WORKDIR /app

RUN npm config set registry http://registry.npm.taobao.org/

RUN apt-get install git

RUN yarn --force

VOLUME [ "/storage" ]

CMD ["yarn", "start"]
