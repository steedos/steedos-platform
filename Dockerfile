FROM node:12.19.1

ENV template_dir=./steedos-projects/project-template

WORKDIR /app

ADD ${template_dir}/ ./

# RUN npm config set registry http://registry.npm.taobao.org/

# RUN yarn config set registry http://registry.npm.taobao.org/

RUN yarn

ENV NODE_ENV=production

CMD ["yarn", "start"]