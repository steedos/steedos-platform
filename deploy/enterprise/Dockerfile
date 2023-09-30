FROM ubuntu:focal

# The env variables are needed for Appsmith server to correctly handle non-roman scripts like Arabic.
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

RUN apt-get update || : && apt-get install -y \
    python \
    curl \
    build-essential 

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - 

# Install MongoDB 5.0
# https://www.mongodb.com/docs/v5.0/tutorial/install-mongodb-on-debian/
RUN apt-get update \
    && apt-get install -y gnupg curl nodejs yarn

RUN curl -fsSL https://pgp.mongodb.com/server-5.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-5.0.gpg \
   --dearmor  --no-tty

RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-5.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list

RUN apt-get update \
    && apt-get install -y mongodb-org=5.0.20 mongodb-org-database=5.0.20 mongodb-org-server=5.0.20 mongodb-org-shell=5.0.20 mongodb-org-mongos=5.0.20 mongodb-org-tools=5.0.20

# Install nginx && redis
RUN apt-get update \
    && apt-get install -y nginx  nginx-extras redis-server \
    && apt-get install -y cron supervisor git python3-pip \
    # && pip install --no-cache-dir git+https://github.com/coderanger/supervisor-stdout@973ba19967cdaf46d9c1634d1675fc65b9574f6e \
    &&  pip install supervisor-stdout \
    && apt-get remove -y git python3-pip \
    && apt-get clean -y

COPY ./fs/app /app

ENV NODE_ENV=production


WORKDIR /app/platform

RUN npm i --production  && npm cache clean --force

WORKDIR /app/unpkg

RUN npm i --production  && npm cache clean --force


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

COPY ./fs/etc /etc
COPY ./fs/opt /opt

# ENV defaults
ENV ROOT_URL=http://127.0.0.1:3000 \
    PORT=3000 \
    NODE_ENV=production 

# ------------------------------------------------------------------------
ENV TMP /tmp/steedos

# Define volumes - Service Layer
VOLUME [ "/steedos-stacks" ]

WORKDIR /opt/steedos/platform

ENTRYPOINT [ "/opt/steedos/entrypoint.sh" ]

HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/opt/steedos/healthcheck.sh"

CMD ["/usr/bin/supervisord", "-n"]