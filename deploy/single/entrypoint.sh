#!/bin/bash

declare -a ENV_VARS=("JWT_SECRET" "REDIS_PASSWORD")

[[ -z "${CACHER}" ]] && export CACHER=redis://localhost:6379
[[ -z "${TRANSPORTER}" ]] && export TRANSPORTER=redis://localhost:6379/1

mkdir /data/db
mkdir /data/db
mongod --bind_ip_all --replSet steedos --logpath /var/log/mongodb/mongod.log --fork
mongo --host localhost:27017 --eval "rs.initiate({ _id: 'steedos', members: [{_id: 0, host: 'localhost:27017'}]})"

redis-server --daemonize yes

# Handle CMD command
exec "$@"