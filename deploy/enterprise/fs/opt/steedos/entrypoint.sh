#!/bin/bash

set -e

stacks_path=/steedos-storage

export SUPERVISORD_CONF_TARGET="$TMP/supervisor-conf.d/"  # export for use in supervisord.conf
export MONGODB_TMP_KEY_PATH="$TMP/mongodb-key"  # export for use in supervisor process mongodb.conf

mkdir -pv "$SUPERVISORD_CONF_TARGET" "$NGINX_WWW_PATH"

init_env_file() {
  CONF_PATH="/steedos-storage/configuration"
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
    local generated_steedos_nodered_password=$(
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
    bash "$TEMPLATES_PATH/docker.env.sh" "$default_steedos_mongodb_user" "$generated_steedos_mongodb_password" "$generated_steedos_encryption_password" "$generated_steedos_encription_salt" "$generated_steedos_supervisor_password" "$generated_steedos_nodered_password" > "$ENV_PATH"
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

    if steedosctl check-replica-set; then
      echo "MongoDB ReplicaSet is enabled"
    else
      echo -e "\033[0;31m***************************************************************************************\033[0m"
      echo -e "\033[0;31m*      MongoDB Replica Set is not enabled                                             *\033[0m"
      echo -e "\033[0;31m*      Please ensure the credentials provided for MongoDB, has 'readWrite' role.      *\033[0m"
      echo -e "\033[0;31m***************************************************************************************\033[0m"
      exit 1
    fi
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


# Keep Let's Encrypt directory persistent
mount_letsencrypt_directory() {
  echo "Mounting Let's encrypt directory"
  rm -rf /etc/letsencrypt
  mkdir -p /steedos-storage/{letsencrypt,ssl}
  ln -s /steedos-storage/letsencrypt /etc/letsencrypt
}

is_empty_directory() {
  [[ -d $1 && -z "$(ls -A "$1")" ]]
}

check_setup_custom_ca_certificates() {
  # old, deprecated, should be removed.
  local stacks_ca_certs_path
  stacks_ca_certs_path="$stacks_path/ca-certs"

  local container_ca_certs_path
  container_ca_certs_path="/usr/local/share/ca-certificates"

  if [[ -d $stacks_ca_certs_path ]]; then
    if [[ ! -L $container_ca_certs_path ]]; then
      if is_empty_directory "$container_ca_certs_path"; then
        rmdir -v "$container_ca_certs_path"
      else
        echo "The 'ca-certificates' directory inside the container is not empty. Please clear it and restart to use certs from 'stacks/ca-certs' directory." >&2
        return
      fi
    fi

    ln --verbose --force --symbolic --no-target-directory "$stacks_ca_certs_path" "$container_ca_certs_path"

  elif [[ ! -e $container_ca_certs_path ]]; then
    rm -vf "$container_ca_certs_path"  # If it exists as a broken symlink, this will be needed.
    mkdir -v "$container_ca_certs_path"

  fi

  update-ca-certificates --fresh
}

setup-custom-ca-certificates() (
  local stacks_ca_certs_path="$stacks_path/ca-certs"
  local store="$TMP/cacerts"
  local opts_file="$TMP/java-cacerts-opts"

  rm -f "$store" "$opts_file"

  if [[ -n "$(ls "$stacks_ca_certs_path"/*.pem 2>/dev/null)" ]]; then
    echo "Looks like you have some '.pem' files in your 'ca-certs' folder. Please rename them to '.crt' to be picked up automatically.".
  fi

  if ! [[ -d "$stacks_ca_certs_path" && "$(find "$stacks_ca_certs_path" -maxdepth 1 -type f -name '*.crt' | wc -l)" -gt 0 ]]; then
    echo "No custom CA certificates found."
    return
  fi

  # Import the system CA certificates into the store.
  keytool -importkeystore \
    -srckeystore /opt/java/lib/security/cacerts \
    -destkeystore "$store" \
    -srcstorepass changeit \
    -deststorepass changeit

  # Add the custom CA certificates to the store.
  find "$stacks_ca_certs_path" -maxdepth 1 -type f -name '*.crt' \
    -exec keytool -import -noprompt -keystore "$store" -file '{}' -storepass changeit ';'

  {
    echo "-Djavax.net.ssl.trustStore=$store"
    echo "-Djavax.net.ssl.trustStorePassword=changeit"
  } > "$opts_file"

  # Get certbot to use the combined trusted CA certs file.
  export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
)


configure_supervisord() {
  local supervisord_conf_source="/opt/steedos/templates/supervisord"
  if [[ -n "$(ls -A "$SUPERVISORD_CONF_TARGET")" ]]; then
    rm -f "$SUPERVISORD_CONF_TARGET"/*
  fi

  cp -f "$supervisord_conf_source"/nginx.conf "$SUPERVISORD_CONF_TARGET"
  cp -f "$supervisord_conf_source"/steedos.conf "$SUPERVISORD_CONF_TARGET"
  cp -f "$supervisord_conf_source"/unpkg.conf "$SUPERVISORD_CONF_TARGET"
  cp -f "$supervisord_conf_source"/nodered.conf "$SUPERVISORD_CONF_TARGET"
  cp -f "$supervisord_conf_source"/api.conf "$SUPERVISORD_CONF_TARGET"

  # Disable services based on configuration
  if [[ -z "${DYNO}" ]]; then
    if [[ $isUriLocal -eq 0 ]]; then
      cp "$supervisord_conf_source/mongodb.conf" "$SUPERVISORD_CONF_TARGET"
    fi
    if [[ $CACHER == *"localhost"* || $CACHER == *"127.0.0.1"* ]]; then
      cp "$supervisord_conf_source/redis.conf" "$SUPERVISORD_CONF_TARGET"
      mkdir -p "$stacks_path/data/redis"
    fi
    if ! [[ -e "/steedos-storage/ssl/fullchain.pem" ]] || ! [[ -e "/steedos-storage/ssl/privkey.pem" ]]; then
      cp "$supervisord_conf_source/cron.conf" "$SUPERVISORD_CONF_TARGET"
    fi
  fi

}

init_loading_pages(){
  local starting_page="/opt/steedos/templates/steedos_starting.html"
  local initializing_page="/opt/steedos/templates/steedos_initializing.html"
  local editor_load_page="$NGINX_WWW_PATH/loading.html"
  cp "$initializing_page" "$NGINX_WWW_PATH/index.html"
  # TODO: Also listen on 443, if HTTP certs are available.
  cat <<EOF > "$TMP/nginx-app.conf"
    server {
      listen ${PORT:-80} default_server;
      location / {
        try_files \$uri \$uri/ /index.html =404;
      }
    }
EOF
  # Start nginx page to display the Steedos is Initializing page
  nginx
  # Update editor nginx page for starting page
  cp "$starting_page" "$editor_load_page"
}

check_setup_custom_ca_certificates
setup-custom-ca-certificates

mount_letsencrypt_directory

# Main Section
init_loading_pages
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


mkdir -p /steedos-storage/unpkg

# Ensure the restore path exists in the container, so an archive can be copied to it, if need be.
mkdir -p /steedos-storage/data/{backup,restore,nodered,unpkg}

# Create sub-directory to store services log in the container mounting folder
mkdir -p /steedos-storage/logs/{supervisor,steedos,cron,mongodb,redis,nginx,unpkg,nodered,api}

configure_supervisord

# Stop nginx gracefully
nginx -s quit

# Handle CMD command
exec "$@"