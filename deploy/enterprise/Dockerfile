FROM ubuntu:focal

# The env variables are needed for Steedos server to correctly handle non-roman scripts like Arabic.
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential 

# Install MongoDB 4.4.25
# https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-ubuntu/
# https://github.com/docker-library/mongo/blob/66197d92be6eafc0a36b2570172de0a5f7a905e1/4.4/Dockerfile
# https://github.com/appsmithorg/appsmith/blob/release/deploy/docker/base.dockerfile
RUN set -o xtrace \
  && apt-get update \
  && apt-get upgrade --yes \
  && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --yes \
    supervisor curl nfs-common gnupg wget netcat openssh-client \
    gettext \
    ca-certificates \
  # Install MongoDB v4.4
  && curl --silent --show-error --location https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - \
  && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list \
  && apt update \
  && apt-get install --no-install-recommends --yes mongodb-org \
  && mv /etc/mongod.conf /etc/mongod.conf.orig \
  && apt-get clean

# Install nginx && redis
RUN apt-get update \
    && apt-get install -y nginx nginx-extras redis-server \
    && apt-get install -y cron supervisor git python3-pip python3-venv git ca-certificates\
    && pip3 install --no-cache-dir git+https://github.com/coderanger/supervisor-stdout@973ba19967cdaf46d9c1634d1675fc65b9574f6e \
    # && pip3 install supervisor-stdout \
    && python3 -m venv --prompt certbot /opt/certbot/venv \
    && /opt/certbot/venv/bin/pip install --upgrade certbot setuptools pip \
    && ln -s /opt/certbot/venv/bin/certbot /usr/local/bin \
    && apt-get remove -y git python3-pip python3-venv \
    && apt-get clean -y


# 安装 nvm 并安装 Node.js
ENV NVM_DIR=/root/.nvm

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && chmod +x "$NVM_DIR/nvm.sh" \
    && bash -c ". $NVM_DIR/nvm.sh && nvm install 14.21.3 && nvm install 20.18.1 && nvm alias default 14.21.3"

# 确保在构建过程中可用
ENV PATH=$NVM_DIR/versions/node/v14.21.3/bin:$PATH

RUN apt-get update \
    && apt-get install -y gnupg curl nodejs
    
# yarn 
RUN npm install --global yarn

# platform
COPY ./app/platform /app

ENV NODE_ENV=production

WORKDIR /app

RUN yarn config set registry https://registry.npmjs.org

RUN yarn && yarn cache clean

# steedosctl
COPY ./app/steedosctl /opt/steedos/steedosctl

WORKDIR /opt/steedos/steedosctl

RUN npm install --only=prod && npm install --only=prod -g

# unpkg
COPY ./app/unpkg /opt/steedos/unpkg
WORKDIR /opt/steedos/unpkg

RUN yarn && yarn cache clean

# nodered
COPY ./app/nodered /opt/steedos/nodered
WORKDIR /opt/steedos/nodered

RUN yarn && yarn cache clean

# builder6
COPY ./app/builder6 /opt/steedos/builder6
WORKDIR /opt/steedos/builder6

RUN bash -c ". $NVM_DIR/nvm.sh && nvm use 20 && npm i --production"

RUN bash -c ". $NVM_DIR/nvm.sh && nvm use 14"

COPY ./fs /

# Remove cached files
RUN rm -rf \
  /root/.cache \
  /root/.npm \
  /root/.pip \
  /usr/local/share/doc \
  /usr/share/doc \
  /usr/share/man \
  /var/lib/apt/lists/* \
  /tmp/*


# Set workdir to /opt/steedos
WORKDIR /opt/steedos

# ------------------------------------------------------------------------
ENV TMP /tmp/steedos
ENV NGINX_WWW_PATH="$TMP/www"

RUN cd - \
  && chmod 0644 /etc/cron.d/* \
  && chmod +x entrypoint.sh renew-certificate.sh healthcheck.sh templates/nginx-app.conf.sh /watchtower-hooks/*.sh \
  # Disable setuid/setgid bits for the files inside container.
  && find / \( -path /proc -prune \) -o \( \( -perm -2000 -o -perm -4000 \) -print -exec chmod -s '{}' + \) || true  \
  && node prepare-image.mjs


ENV PATH /opt/steedos/utils/node_modules/.bin:/opt/java/bin:$PATH

LABEL com.centurylinklabs.watchtower.lifecycle.pre-check=/watchtower-hooks/pre-check.sh
LABEL com.centurylinklabs.watchtower.lifecycle.pre-update=/watchtower-hooks/pre-update.sh

# ENV defaults
ENV ROOT_URL=http://127.0.0.1:3000 \
    NODE_ENV=production 

# Define volumes - Service Layer
VOLUME [ "/steedos-storage" ]

ENTRYPOINT [ "/opt/steedos/entrypoint.sh" ]

HEALTHCHECK --interval=60s --timeout=15s --start-period=120s CMD "/opt/steedos/healthcheck.sh"

CMD ["/usr/bin/supervisord", "-n"]
