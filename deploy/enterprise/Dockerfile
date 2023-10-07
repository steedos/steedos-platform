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

RUN apt-get update \
    && apt-get install -y gnupg curl nodejs yarn

# Install MongoDB 4.4.25
# https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-ubuntu/
# https://github.com/docker-library/mongo/blob/66197d92be6eafc0a36b2570172de0a5f7a905e1/4.4/Dockerfile
RUN set -ex; \
	export GNUPGHOME="$(mktemp -d)"; \
	set -- '20691EEC35216C63CAF66CE1656408E390CFB1F5'; \
	for key; do \
		gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key"; \
	done; \
	mkdir -p /etc/apt/keyrings; \
	gpg --batch --export "$@" > /etc/apt/keyrings/mongodb.gpg; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME"

# Allow build-time overrides (eg. to build image with MongoDB Enterprise version)
# Options for MONGO_PACKAGE: mongodb-org OR mongodb-enterprise
# Options for MONGO_REPO: repo.mongodb.org OR repo.mongodb.com
# Example: docker build --build-arg MONGO_PACKAGE=mongodb-enterprise --build-arg MONGO_REPO=repo.mongodb.com .
ARG MONGO_PACKAGE=mongodb-org
ARG MONGO_REPO=repo.mongodb.org
ENV MONGO_PACKAGE=${MONGO_PACKAGE} MONGO_REPO=${MONGO_REPO}

ENV MONGO_MAJOR 4.4
RUN echo "deb [ signed-by=/etc/apt/keyrings/mongodb.gpg ] http://$MONGO_REPO/apt/ubuntu focal/${MONGO_PACKAGE%-unstable}/$MONGO_MAJOR multiverse" | tee "/etc/apt/sources.list.d/${MONGO_PACKAGE%-unstable}.list"

# https://docs.mongodb.org/master/release-notes/4.4/
ENV MONGO_VERSION 4.4.25
# 09/26/2023, https://github.com/mongodb/mongo/tree/3e18c4c56048ddf22a6872edc111b542521ad1d5

RUN set -x \
# installing "mongodb-enterprise" pulls in "tzdata" which prompts for input
	&& export DEBIAN_FRONTEND=noninteractive \
	&& apt-get update \
	&& apt-get install -y \
		${MONGO_PACKAGE}=$MONGO_VERSION \
		${MONGO_PACKAGE}-server=$MONGO_VERSION \
		${MONGO_PACKAGE}-shell=$MONGO_VERSION \
		${MONGO_PACKAGE}-mongos=$MONGO_VERSION \
		${MONGO_PACKAGE}-tools=$MONGO_VERSION \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/lib/mongodb \
	&& mv /etc/mongod.conf /etc/mongod.conf.orig

# Install nginx && redis
RUN apt-get update \
    && apt-get install -y nginx  nginx-extras redis-server \
    && apt-get install -y cron supervisor git python3-pip\
    && pip3 install --no-cache-dir git+https://github.com/coderanger/supervisor-stdout@973ba19967cdaf46d9c1634d1675fc65b9574f6e \
    # && pip3 install supervisor-stdout \
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