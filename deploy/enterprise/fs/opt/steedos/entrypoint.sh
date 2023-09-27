#!/bin/bash

set -e

stacks_path=/steedos-stacks

export SUPERVISORD_CONF_TARGET="$TMP/supervisor-conf.d/"  # export for use in supervisord.conf
export MONGODB_TMP_KEY_PATH="$TMP/mongodb-key"  # export for use in supervisor process mongodb.conf

mkdir -pv "$SUPERVISORD_CONF_TARGET"

init_env_file() {
  CONF_PATH="/steedos-stacks/configuration"
  ENV_PATH="$CONF_PATH/docker.env"
  TEMPLATES_PATH="/opt/steedos/templates"

  mkdir -p "$CONF_PATH"
  # Build an env file with current env variables. We single-quote the values, as well as escaping any single-quote characters.
  printenv | grep -E '^STEEDOS_|^MONGO_|ROOT_URL|CACHER|TRANSPORTER|PORT|NODE_ENV' | sed "s/'/'\\\''/g; s/=/='/; s/$/'/" > "$CONF_PATH/pre-define.env"

  echo "Initialize .env file"
  if ! [[ -e "$ENV_PATH" ]]; then
    # Generate new docker.env file when initializing container for first time or in Heroku which does not have persistent volume
    echo "Generating default configuration file"
    local default_steedos_mongodb_user="root"
    local generated_steedos_mongodb_password=$(
      tr -dc A-Za-z0-9 </dev/urandom | head -c 13
      echo ""
    )
    local generated_steedos_encryption_password=$(
      tr -dc A-Za-z0-9 </dev/urandom | head -c 13
      echo ""
    )
    local generated_steedos_encription_salt=$(
      tr -dc A-Za-z0-9 </dev/urandom | head -c 13
      echo ""
    )
    local generated_steedos_supervisor_password=$(
      tr -dc A-Za-z0-9 </dev/urandom | head -c 13
      echo ''
    )
    bash "$TEMPLATES_PATH/docker.env.sh" "$default_steedos_mongodb_user" "$generated_steedos_mongodb_password" "$generated_steedos_encryption_password" "$generated_steedos_encription_salt" "$generated_steedos_supervisor_password" > "$ENV_PATH"
  fi


  echo "Load environment configuration"
  set -o allexport
  . "$ENV_PATH"
  . "$CONF_PATH/pre-define.env"
  set +o allexport
}


check_mongodb_uri() {
  echo "Checking MONGO_URL"
  isUriLocal=1
  if [[ $MONGO_URL == *"localhost"* || $MONGO_URL == *"127.0.0.1"* ]]; then
    echo "Detected local MongoDB"
    isUriLocal=0
  fi
}


init_mongodb() {
  if [[ $isUriLocal -eq 0 ]]; then
    echo "Initializing local database"
    MONGO_DB_PATH="$stacks_path/data/mongodb"
    MONGO_LOG_PATH="$MONGO_DB_PATH/log"
    MONGO_DB_KEY="$MONGO_DB_PATH/key"
    mkdir -p "$MONGO_DB_PATH"
    touch "$MONGO_LOG_PATH"

    if [[ ! -f "$MONGO_DB_KEY" ]]; then
      openssl rand -base64 756 > "$MONGO_DB_KEY"
    fi
    use-mongodb-key "$MONGO_DB_KEY"
  fi
}


init_replica_set() {
  echo "Checking initialized database"
  shouldPerformInitdb=1
  for path in \
    "$MONGO_DB_PATH/WiredTiger" \
    "$MONGO_DB_PATH/journal" \
    "$MONGO_DB_PATH/local.0" \
    "$MONGO_DB_PATH/storage.bson"; do
    if [ -e "$path" ]; then
      shouldPerformInitdb=0
      break
    fi
  done

  if [[ $isUriLocal -gt 0 && -f /proc/cpuinfo ]] && ! grep --quiet avx /proc/cpuinfo; then
    echo "====================================================================================================" >&2
    echo "==" >&2
    echo "== AVX instruction not found in your CPU. Steedos's embedded MongoDB may not start. Please use an external MongoDB instance instead." >&2
    echo "==" >&2
    echo "====================================================================================================" >&2
  fi

  if [[ $shouldPerformInitdb -gt 0 && $isUriLocal -eq 0 ]]; then
    echo "Initializing Replica Set for local database"
    # Start installed MongoDB service - Dependencies Layer
    mongod --fork --port 27017 --dbpath "$MONGO_DB_PATH" --logpath "$MONGO_LOG_PATH"
    echo "Waiting 10s for MongoDB to start"
    sleep 10
    # echo "Creating MongoDB user"
    mongo "127.0.0.1/admin" --eval "db.createUser({
        user: '$STEEDOS_MONGODB_USER',
        pwd: '$STEEDOS_MONGODB_PASSWORD',
        roles: [{
            role: 'root',
            db: 'admin'
        }, 'readWrite']
      }
    )"
    echo "Enabling Replica Set"
    mongod --dbpath "$MONGO_DB_PATH" --shutdown || true
    mongod --fork --port 27017 --dbpath "$MONGO_DB_PATH" --logpath "$MONGO_LOG_PATH" --replSet steedos --keyFile "$MONGODB_TMP_KEY_PATH" --bind_ip localhost
    echo "Waiting 10s for MongoDB to start with Replica Set"
    sleep 10
    mongo "$MONGO_URL" --eval 'rs.initiate()'
    mongod --dbpath "$MONGO_DB_PATH" --shutdown || true
  fi

  if [[ $isUriLocal -gt 0 ]]; then
    echo "Checking Replica Set of external MongoDB"

    # if appsmithctl check-replica-set; then
    #   echo "MongoDB ReplicaSet is enabled"
    # else
    #   echo -e "\033[0;31m***************************************************************************************\033[0m"
    #   echo -e "\033[0;31m*      MongoDB Replica Set is not enabled                                             *\033[0m"
    #   echo -e "\033[0;31m*      Please ensure the credentials provided for MongoDB, has 'readWrite' role.      *\033[0m"
    #   echo -e "\033[0;31m***************************************************************************************\033[0m"
    #   exit 1
    # fi
  fi
}

use-mongodb-key() {
  # We copy the MongoDB key file to `$MONGODB_TMP_KEY_PATH`, so that we can reliably set its permissions to 600.
  # Why? When the host machine of this Docker container is Windows, file permissions cannot be set on files in volumes.
  # So the key file should be somewhere inside the container, and not in a volume.
  mkdir -pv "$(dirname "$MONGODB_TMP_KEY_PATH")"
  cp -v "$1" "$MONGODB_TMP_KEY_PATH"
  chmod 600 "$MONGODB_TMP_KEY_PATH"
}


configure_supervisord() {
  local supervisord_conf_source="/opt/steedos/templates/supervisord"
  if [[ -n "$(ls -A "$SUPERVISORD_CONF_TARGET")" ]]; then
    rm -f "$SUPERVISORD_CONF_TARGET"/*
  fi

  cp -f "$supervisord_conf_source"/nginx.conf "$SUPERVISORD_CONF_TARGET"
  cp -f "$supervisord_conf_source"/steedos.conf "$SUPERVISORD_CONF_TARGET"
  cp -f "$supervisord_conf_source"/unpkg.conf "$SUPERVISORD_CONF_TARGET"

  # Disable services based on configuration
  if [[ -z "${DYNO}" ]]; then
    if [[ $isUriLocal -eq 0 ]]; then
      cp "$supervisord_conf_source/mongodb.conf" "$SUPERVISORD_CONF_TARGET"
    fi
    if [[ $CACHER == *"localhost"* || $CACHER == *"127.0.0.1"* ]]; then
      cp "$supervisord_conf_source/redis.conf" "$SUPERVISORD_CONF_TARGET"
      mkdir -p "$stacks_path/data/redis"
    fi
    if ! [[ -e "/steedos-stacks/ssl/fullchain.pem" ]] || ! [[ -e "/steedos-stacks/ssl/privkey.pem" ]]; then
      cp "$supervisord_conf_source/cron.conf" "$SUPERVISORD_CONF_TARGET"
    fi
  fi

}

init_env_file

check_mongodb_uri
if [[ -z "${DYNO}" ]]; then
  # Don't run MongoDB if running in a Heroku dyno.
  init_mongodb
  init_replica_set
else
  # These functions are used to limit heap size for Backend process when deployed on Heroku
  get_maximum_heap
  setup_backend_heap_arg
  # set the hostname for heroku dyno
  export HOSTNAME="heroku_dyno"
fi


configure_supervisord

mkdir -p /steedos-stacks/unpkg

# Ensure the restore path exists in the container, so an archive can be copied to it, if need be.
mkdir -p /steedos-stacks/data/{backup,restore}

# Create sub-directory to store services log in the container mounting folder
mkdir -p /steedos-stacks/logs/{supervisor,steedos,cron,mongodb,redis,nginx,unpkg}

# Handle CMD command
exec "$@"