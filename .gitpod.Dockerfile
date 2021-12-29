FROM gitpod/workspace-base:latest


# Install MongoDB
# Source: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu-tarball/#install-mongodb-community-edition
USER gitpod
RUN mkdir -p /tmp/mongodb && \
    cd /tmp/mongodb && \
    wget -qOmongodb.tgz https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.2.17.tgz && \
    tar xf mongodb.tgz && \
    cd mongodb-* && \
    sudo cp bin/* /usr/local/bin/ && \
    rm -rf /tmp/mongodb

# Install node
USER gitpod
ENV NODE_VERSION=12.22.7
ENV TRIGGER_REBUILD=1
RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | PROFILE=/dev/null bash \
    && bash -c ". .nvm/nvm.sh \
        && nvm install $NODE_VERSION \
        && nvm alias default $NODE_VERSION \
        && npm install -g typescript yarn node-gyp"
ENV PATH=$PATH:/home/gitpod/.nvm/versions/node/v${NODE_VERSION}/bin

# Install Redis
USER gitpod
RUN wget https://download.redis.io/releases/redis-6.2.6.tar.gz && \
    tar xzf redis-6.2.6.tar.gz && \
    cd redis-6.2.6 && \
    make && \
    cd .. && \
    rm -f redis-6.2.6.tar.gz
ENV PATH=$PATH:/home/gitpod/redis-6.2.6/src

USER gitpod