export MONGO_URL=mongodb://127.0.0.1/steedos
export ROOT_URL=http://127.0.0.1:3000
# export TOOL_NODE_FLAGS="--max-old-space-size=4192"
export METEOR_ALLOW_SUPERUSER=1
export METEOR_PROFILE=1000

cp -r ../object-server/packages/* node_modules/@steedos

meteor run --port 3000  --settings settings.json