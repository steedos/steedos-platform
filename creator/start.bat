set DB_SERVER=192.168.0.21
REM set DB_SERVER=192.168.0.23
REM set DB_SERVER=192.168.0.195
REM set MONGO_URL=mongodb://%DB_SERVER%/test
set MONGO_URL=mongodb://%DB_SERVER%/vip-test
REM set MONGO_URL=mongodb://%DB_SERVER%/qhd201711091030
REM set MONGO_OPLOG_URL=mongodb://%DB_SERVER%/local
set MULTIPLE_INSTANCES_COLLECTION_NAME=creator_instances
set METEOR_PACKAGE_DIRS=C:\Users\steedos\Documents\meteor_temp_pgs\packages\
REM set ROOT_URL=http://127.0.0.1:5000
REM set ROOT_URL=http://192.168.0.195:5000/creator
set ROOT_URL=http://192.168.0.98:5000
REM meteor run --port 5000
set MAIL_URL=smtp://AKIAJPRG5K6Z2XDWUM2A:AglrBWID%%2Fp2kCIByvcGE6gSbewe93HNFZXvGZs8lbk9I@email-smtp.us-east-1.amazonaws.com:465/
set TOOL_NODE_FLAGS="--max-old-space-size=1800"
meteor run --port 5000 --settings settings.json