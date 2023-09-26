FROM steedos/steedos-community


# Install MongoDB 4.4
# https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-debian/
RUN apt-get update \
    && apt-get install -y gnupg curl

RUN curl -fsSL https://pgp.mongodb.com/server-4.4.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-4.4.gpg \
   --dearmor  --no-tty

RUN echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-4.4.gpg ] http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

RUN apt-get update \
    && apt-get install -y mongodb-org=4.4.24 mongodb-org-server=4.4.24 mongodb-org-shell=4.4.24 mongodb-org-mongos=4.4.24 mongodb-org-tools=4.4.24 \
    && apt-get install -y nginx redis-server \
    && apt-get install -y cron supervisor git python-pip \
    && pip install --no-cache-dir git+https://github.com/coderanger/supervisor-stdout@973ba19967cdaf46d9c1634d1675fc65b9574f6e \
    && apt-get autoremove --yes

# Install nginx && redis
RUN apt-get update \
    && apt-get install -y nginx redis-server \
    && apt-get clean -y

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

# ENV defaults
ENV ROOT_URL=http://127.0.0.1:3000 \
    PORT=3000 \
    NODE_ENV=production 

# ------------------------------------------------------------------------
ENV TMP /tmp/steedos

# Define volumes - Service Layer
VOLUME [ "/steedos-stacks" ]

WORKDIR /app

COPY ./etc/ /etc/

COPY ./supervisord /app/supervisord
COPY ./docker.env.sh /app/docker.env.sh
COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./healthcheck.sh /app/healthcheck.sh
COPY ./run-with-env.sh /app/run-with-env.sh
RUN chmod +x /app/docker.env.sh
RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/healthcheck.sh
RUN chmod +x /app/run-with-env.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/app/healthcheck.sh"

CMD ["/usr/bin/supervisord", "-n"]