FROM ubuntu:focal

# The env variables are needed for Steedos server to correctly handle non-roman scripts like Arabic.
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    jq \
    build-essential 

# 安装 nvm 并安装 Node.js
ENV NVM_DIR=/root/.nvm

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && chmod +x "$NVM_DIR/nvm.sh" \
    && bash -c ". $NVM_DIR/nvm.sh && nvm install 20.18.1 && nvm alias default 20.18.1"

# 确保在构建过程中可用
ENV PATH=$NVM_DIR/versions/node/v20.18.1/bin:$PATH

RUN apt-get update \
    && apt-get install -y gnupg curl nodejs
    
# yarn 
RUN npm install --global yarn

# nodered
COPY ./app/nodered /opt/steedos/nodered
WORKDIR /opt/steedos/nodered

RUN yarn && yarn cache clean

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
