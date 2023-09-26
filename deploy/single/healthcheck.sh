#!/usr/bin/env bash
healthy=true

if [ -f "/data/.env" ]; then
  export $(cat /data/.env | xargs)
elif [ -f "/home/.env" ]; then
  export $(cat /home/.env | xargs)
else
  echo "No .env file found"
  healthy=false
fi

if [[ $(curl -Lfk -s -w "%{http_code}\n" http://localhost:3000/ -o /dev/null) -ne 200 ]]; then
  echo 'ERROR: Steedos is not running';
  healthy=false
fi

if [[ $(redis-cli --no-auth-warning  ping) != 'PONG' ]]; then
    echo 'ERROR: Redis is down';
    healthy=false
fi

if [ $healthy == true ]; then
  exit 0
else
  exit 1
fi