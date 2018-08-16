set DB_SERVER=127.0.0.1
set MONGO_URL=mongodb://%DB_SERVER%/steedos
set MONGO_OPLOG_URL=mongodb://%DB_SERVER%/local
set MULTIPLE_INSTANCES_COLLECTION_NAME=creator_instances
set ROOT_URL=http://127.0.0.1:5000
set TOOL_NODE_FLAGS="--max-old-space-size=1800"
meteor run --port 5000