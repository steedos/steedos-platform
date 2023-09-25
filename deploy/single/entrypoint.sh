[[ -z "${REDIS_URL}" ]] && export CACHER=redis://localhost:6379
[[ -z "${TRANSPORTER}" ]] && export TRANSPORTER=redis://localhost:6379/1

sudo service mongod start
redis-server --requirepass $REDIS_PASSWORD > /dev/stdout 2>&1 &

cd /app
npm start