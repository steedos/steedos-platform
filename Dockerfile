FROM node:12.16.3

ENV community_dir=./steedos-projects/project-community

WORKDIR /app

ADD ${community_dir}/ ./

RUN npm config set registry http://registry.npm.taobao.org/

RUN yarn config set registry http://registry.npm.taobao.org/

RUN yarn install --production

ENV NODE_ENV=production

CMD ["yarn", "start"]