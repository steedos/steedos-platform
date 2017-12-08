set DB_SERVER=192.168.0.21
set MONGO_URL=mongodb://%DB_SERVER%/creator
set MONGO_OPLOG_URL=mongodb://%DB_SERVER%/local
set MULTIPLE_INSTANCES_COLLECTION_NAME=creator_instances
set ROOT_URL=http://127.0.0.1:5000/creator
meteor run --port 5000