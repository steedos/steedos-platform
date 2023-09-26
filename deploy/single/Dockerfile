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
    && apt-get autoremove --yes \
    && apt-get clean -y

# Install nginx && redis
RUN apt-get update \
    && apt-get install -y nginx redis-server \
    && apt-get install -y cron supervisor git python-pip \
    # && pip install --no-cache-dir git+https://github.com/coderanger/supervisor-stdout@973ba19967cdaf46d9c1634d1675fc65b9574f6e \
    &&  pip install supervisor-stdout \
    && apt-get remove -y git python-pip \
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

COPY ./fs/ /

ENTRYPOINT [ "/opt/steedos/entrypoint.sh" ]

HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/opt/steedos/healthcheck.sh"

CMD ["/usr/bin/supervisord", "-n"]