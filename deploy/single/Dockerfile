FROM steedos/steedos-community:latest


# Install MongoDB 4.4
# https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-debian/
RUN sudo apt-get update \
    && sudo apt-get install gnupg curl

RUN curl -fsSL https://pgp.mongodb.com/server-4.4.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-4.4.gpg \
   --dearmor

RUN echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-4.4.gpg ] http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

RUN sudo apt-get update \
    && sudo apt-get install -y mongodb-org=4.4.24 mongodb-org-server=4.4.24 mongodb-org-shell=4.4.24 mongodb-org-mongos=4.4.24 mongodb-org-tools=4.4.24 \
    && sudo apt-get install -y nginx redis-server

# Install nginx && redis
RUN sudo apt-get update \
    && sudo apt-get install -y nginx redis-server \
    && sudo apt-get clean -y