FROM jsreport/jsreport:2.5.0-full

ADD . /app

WORKDIR /app

RUN npm config set registry http://registry.npm.taobao.org/

RUN npm i yarn -g

RUN yarn --force

VOLUME [ "/storage" ]

CMD ["yarn", "start"]
