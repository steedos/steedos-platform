set DB_SERVER=192.168.0.21
set MONGO_URL=mongodb://%DB_SERVER%/record
set MONGO_OPLOG_URL=mongodb://%DB_SERVER%/local
set MULTIPLE_INSTANCES_COLLECTION_NAME=record_instances
set ROOT_URL=http://127.0.0.1:5000/record
meteor run --port 5000