#!/bin/bash
set -e

stacks_path=/steedos-storage

export SUPERVISORD_CONF_TARGET="$TMP/supervisor-conf.d/"  # export for use in supervisord.conf

mkdir -pv "$SUPERVISORD_CONF_TARGET" "$NGINX_WWW_PATH"

init_env_file() {
  CONF_PATH="/steedos-storage/configuration"
  ENV_PATH="$CONF_PATH/docker.env"
  TEMPLATES_PATH="/opt/steedos/templates"

  mkdir -p "$CONF_PATH"

  if [ -z "${STEEDOS_NODERED_ENABLED}" ]; then
    export STEEDOS_NODERED_ENABLED=false
  fi


  # Build an env file with current env variables. We single-quote the values, as well as escaping any single-quote characters.
  printenv | grep -E '^STEEDOS_|^B6_|^MONGO_|ROOT_URL|CACHER|TRANSPORTER|PORT|NODE_ENV' | sed "s/'/'\\\''/g; s/=/='/; s/$/'/" > "$CONF_PATH/pre-define.env"

  echo "Initialize .env file"
  if ! [[ -e "$ENV_PATH" ]]; then
    # Generate new docker.env file when initializing container for first time or in Heroku which does not have persistent volume
    echo "Generating default configuration file"
    local generated_steedos_nodered_password=$(
      tr -dc A-Za-z0-9 </dev/urandom | head -c 13
      echo ""
    )

    bash "$TEMPLATES_PATH/docker.env.sh" "$generated_steedos_nodered_password" > "$ENV_PATH"
  fi

  echo "Load environment configuration"
  set -o allexport
  . "$ENV_PATH"
  . "$CONF_PATH/pre-define.env"
  set +o allexport
}

is_empty_directory() {
  [[ -d $1 && -z "$(ls -A "$1")" ]]
}

configure_supervisord() {
  local supervisord_conf_source="/opt/steedos/templates/supervisord"
  if [[ -n "$(ls -A "$SUPERVISORD_CONF_TARGET")" ]]; then
    rm -f "$SUPERVISORD_CONF_TARGET"/*
  fi

  cp -f "$supervisord_conf_source"/nodered.conf "$SUPERVISORD_CONF_TARGET"
}

# Main Section
init_env_file


# Ensure the restore path exists in the container, so an archive can be copied to it, if need be.
mkdir -p /steedos-storage/data/{nodered}

# Create sub-directory to store services log in the container mounting folder
mkdir -p /steedos-storage/logs/{nodered}

configure_supervisord

# Handle CMD command
exec "$@"