#!/usr/bin/env bash

set -e

ENV_PATH="/steedos-stacks/configuration/docker.env"
PRE_DEFINED_ENV_PATH="/steedos-stacks/configuration/pre-define.env"
if [[ -f /steedos-stacks/configuration/docker.env ]]; then
  echo 'Load environment configuration'
  set -o allexport
  . "$ENV_PATH"
  . "$PRE_DEFINED_ENV_PATH"
  set +o allexport
fi

if [[ -n $STEEDOS_CUSTOM_DOMAIN ]]; then
  data_path="/steedos-stacks/data/certificate"
  domain="$STEEDOS_CUSTOM_DOMAIN"
  rsa_key_size=4096

  certbot certonly --webroot --webroot-path="$data_path/certbot" \
    --register-unsafely-without-email \
    --domains $domain \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal
  supervisorctl restart nginx
else
  echo 'Custom domain not configured. Cannot enable SSL without a custom domain.' >&2
fi