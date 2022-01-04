FROM node:12.22.7

RUN mkdir -p /dev/disk/by-id/

WORKDIR /app

ADD .steedos ./.steedos/
ADD services ./services/
ADD steedos-app ./steedos-app/
# ADD steedos-packages ./steedos-packages/
ADD package.json .
ADD moleculer.config.js .
ADD init_home.sh .
ADD steedos-config.yml ./steedos-config.yml
ADD yarn.lock ./yarn.lock

RUN npm config set registry http://registry.npm.taobao.org/
RUN yarn config set registry http://registry.npm.taobao.org/

RUN yarn

ENV NODE_ENV=production

CMD ["yarn", "start"]