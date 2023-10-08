#!/bin/bash

ENV_PATH="/steedos-stacks/configuration/docker.env"
PRE_DEFINED_ENV_PATH="/steedos-stacks/configuration/pre-define.env"
echo 'Load environment configuration'
set -o allexport
. "$ENV_PATH"
. "$PRE_DEFINED_ENV_PATH"
set +o allexport

export PORT=3000

if [[ -z "${STEEDOS_UNPKG_URL}" ]] && [[ ! -z "${STEEDOS_LICENSE}" ]]; then
  export STEEDOS_UNPKG_URL=/unpkg
fi

if [[ -z "${STEEDOS_STORAGE_DIR}" ]]; then
  export STEEDOS_STORAGE_DIR=/steedos-stacks/storage
fi
mkdir -pv "$STEEDOS_STORAGE_DIR"

exec "$@"