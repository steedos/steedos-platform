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
    && apt-get install -y nginx redis-server

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
    NODE_ENV=production \
    CACHER=redis://localhost:6379 \
    TRANSPORTER=redis://localhost:6379/1 \
    MONGO_URL=mongodb://127.0.0.1:27017/steedos \
    MONGO_OPLOG_URL=mongodb://127.0.0.1:27017/local

WORKDIR /app

COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./healthcheck.sh /app/healthcheck.sh
RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/healthcheck.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/app/healthcheck.sh"

CMD ["npm", "start"]