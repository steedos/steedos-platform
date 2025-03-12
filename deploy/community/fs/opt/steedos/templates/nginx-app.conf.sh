#!/bin/bash

set -o nounset

use_https="$1"
custom_domain="${2:-_}"

if [[ $use_https == 1 ]]; then
  # By default, container will use the auto-generate certificate by Let's Encrypt
  ssl_cert_path="/etc/letsencrypt/live/$custom_domain/fullchain.pem"
  ssl_key_path="/etc/letsencrypt/live/$custom_domain/privkey.pem"

  # In case of existing custom certificate, container will use them to configure SSL
  if [[ -e "/steedos-storage/ssl/fullchain.pem" ]] && [[ -e "/steedos-storage/ssl/privkey.pem" ]]; then
    ssl_cert_path="/steedos-storage/ssl/fullchain.pem"
    ssl_key_path="/steedos-storage/ssl/privkey.pem"
  fi
fi

additional_downstream_headers='
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
add_header X-Content-Type-Options "nosniff";
'

cat <<EOF > "$TMP/nginx-app.conf"
map \$http_x_forwarded_proto \$origin_scheme {
  default \$http_x_forwarded_proto;
  '' \$scheme;
}

map \$http_x_forwarded_host \$origin_host {
  default \$http_x_forwarded_host;
  '' \$host;
}

map \$http_forwarded \$final_forwarded {
  default '\$http_forwarded, host=\$host;proto=\$scheme';
  '' '';
}

# redirect log to stdout for supervisor to capture
access_log /dev/stdout;

server {

$(
if [[ $use_https == 1 ]]; then
  echo "
  listen 80;
  server_name $custom_domain;
  
  location /.well-known/acme-challenge/ {
    root /steedos-storage/data/certificate/certbot;
  }

  return 301 https://\$host\$request_uri;
}

server {
  listen 443 ssl http2;
  server_name _;
  ssl_certificate $ssl_cert_path;
  ssl_certificate_key $ssl_key_path;
  include /steedos-storage/data/certificate/conf/options-ssl-nginx.conf;
  ssl_dhparam /steedos-storage/data/certificate/conf/ssl-dhparams.pem;
"
else
  echo "
  listen ${PORT:-80} default_server;
  server_name $custom_domain;
"
fi
)

  client_max_body_size 1024m;

  gzip on;
  gzip_types *;

  # index index.html;
  # error_page 404 /;
  error_page 502 /nginx/loading;
  error_page 503 /nginx/loading;

  # https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors
  # add_header Content-Security-Policy "frame-ancestors ${STEEDOS_ALLOWED_FRAME_ANCESTORS-'self' *}";

  $additional_downstream_headers

  location /.well-known/acme-challenge/ {
    root /steedos-storage/data/certificate/certbot;
  }

  location = /supervisor {
    return 301 /supervisor/;
  }

  location /supervisor/ {
    proxy_http_version       1.1;
    proxy_buffering          off;
    proxy_max_temp_file_size 0;
    proxy_redirect           off;
    proxy_set_header  Host              \$http_host/supervisor/;
    proxy_set_header  X-Forwarded-For   \$proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto \$origin_scheme;
    proxy_set_header  X-Forwarded-Host  \$origin_host;
    proxy_set_header  Connection        "";
    proxy_pass http://localhost:9001/;
  }

  proxy_set_header X-Forwarded-Proto \$origin_scheme;
  proxy_set_header X-Forwarded-Host \$origin_host;
  proxy_set_header Forwarded \$final_forwarded;

  # If the path has an extension at the end, then respond with 404 status if the file not found.
  # location ~ ^/(?!supervisor/).*\.[a-z]+$ {
  #   try_files \$uri =404;
  # }

  location / {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-real-ip \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
  }

  location /sockjs/ {
    proxy_pass http://localhost:3000/sockjs/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  location /unpkg/ {
    proxy_http_version       1.1;
    proxy_buffering          off;
    proxy_max_temp_file_size 0;
    proxy_redirect           off;
    proxy_set_header  Host              \$http_host/unpkg/;
    proxy_set_header  X-Forwarded-For   \$proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto \$origin_scheme;
    proxy_set_header  X-Forwarded-Host  \$origin_host;
    proxy_set_header  Connection        "";
    proxy_pass http://localhost:3100/unpkg/;
  }

  location /nginx/ {
    root ${NGINX_WWW_PATH};
    try_files \$uri \$uri/ /index.html =404;
  }

  location = /info.json {
    add_header Content-Type application/json;
    alias /opt/steedos/info.json;
  }

}
EOF