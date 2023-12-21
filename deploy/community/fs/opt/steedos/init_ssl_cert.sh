#!/bin/bash

init_ssl_cert() {
  STEEDOS_CUSTOM_DOMAIN="$1"

  local rsa_key_size=4096
  local data_path="/steedos-storage/data/certificate"

  mkdir -p "$data_path/www"

  echo "Re-generating nginx config template with domain"
  /opt/steedos/templates/nginx-app.conf.sh "0" "$STEEDOS_CUSTOM_DOMAIN"

  echo "Start Nginx to verify certificate"
  nginx

  local live_path="/etc/letsencrypt/live/$STEEDOS_CUSTOM_DOMAIN"
  local ssl_path="/steedos-storage/ssl"
  if [[ -e "$ssl_path/fullchain.pem" ]] && [[ -e "$ssl_path/privkey.pem" ]]; then
    echo "Existing custom certificate"
    echo "Stop Nginx"
    nginx -s stop
    return
  fi

  if [[ -e "$live_path" ]]; then
    echo "Existing certificate for domain $STEEDOS_CUSTOM_DOMAIN"
    echo "Stop Nginx"
    nginx -s stop
    return
  fi

  echo "Creating certificate for '$STEEDOS_CUSTOM_DOMAIN'"

  echo "Requesting Let's Encrypt certificate for '$STEEDOS_CUSTOM_DOMAIN'..."
  echo "Generating OpenSSL key for '$STEEDOS_CUSTOM_DOMAIN'..."

  mkdir -p "$live_path" && openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$live_path/privkey.pem" \
    -out "$live_path/fullchain.pem" \
    -subj "/CN=localhost"

  echo "Removing key now that validation is done for $STEEDOS_CUSTOM_DOMAIN..."
  rm -Rfv /etc/letsencrypt/live/$STEEDOS_CUSTOM_DOMAIN /etc/letsencrypt/archive/$STEEDOS_CUSTOM_DOMAIN /etc/letsencrypt/renewal/$STEEDOS_CUSTOM_DOMAIN.conf

  echo "Generating certification for domain $STEEDOS_CUSTOM_DOMAIN"
  mkdir -p "$data_path/certbot"
  certbot certonly --webroot --webroot-path="$data_path/certbot" \
    --register-unsafely-without-email \
    --domains $STEEDOS_CUSTOM_DOMAIN \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal

  if (($? != 0)); then
    echo "Stop Nginx due to provisioning fail"
    nginx -s stop
    return 1
  fi

  echo "Stop Nginx"
  nginx -s stop
}
