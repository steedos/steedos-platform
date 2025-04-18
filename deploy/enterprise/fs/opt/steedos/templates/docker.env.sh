#!/bin/bash

set -o nounset
MONGO_USER="$1"
MONGO_PASSWORD="$2"
ENCRYPTION_PASSWORD="$3"
ENCRYPTION_SALT="$4"
SUPERVISOR_PASSWORD="$5"
NODERED_PASSWORD="$5"

cat <<EOF

MONGO_URL=mongodb://$MONGO_USER:$MONGO_PASSWORD@localhost:27017/steedos?authSource=admin
MONGO_OPLOG_URL=mongodb://$MONGO_USER:$MONGO_PASSWORD@localhost:27017/local?authSource=admin
# MONGO_URL=mongodb://localhost:27017/steedos
# MONGO_OPLOG_URL=mongodb://localhost:27017/local

STEEDOS_MONGODB_URI=mongodb://$MONGO_USER:$MONGO_PASSWORD@localhost:27017/steedos?authSource=admin
STEEDOS_MONGODB_USER=$MONGO_USER
STEEDOS_MONGODB_PASSWORD=$MONGO_PASSWORD

STEEDOS_TABLES_MONGO_URL=mongodb://$MONGO_USER:$MONGO_PASSWORD@localhost:27017/tables?authSource=admin

TRANSPORTER=redis://localhost:6379
CACHER=redis://localhost:6379/1

STEEDOS_ENCRYPTION_PASSWORD=$ENCRYPTION_PASSWORD
STEEDOS_ENCRYPTION_SALT=$ENCRYPTION_SALT

STEEDOS_SUPERVISOR_USER=steedos
STEEDOS_SUPERVISOR_PASSWORD=$SUPERVISOR_PASSWORD

NODERED_PASSWORD=$NODERED_PASSWORD

UNPKG_BASE_URL=/unpkg

NPM_CACHE_ENABLED=true
NPM_CACHE_FOLDER=/steedos-storage/unpkg
NPM_CACHE_PACKAGE_CONTENT=true

EOF