REM set DB_SERVER=192.168.0.21
set DB_SERVER=192.168.0.23
REM set DB_SERVER=192.168.0.195
REM set MONGO_URL=mongodb://%DB_SERVER%/test
REM set MONGO_URL=mongodb://%DB_SERVER%/vip-test
set MONGO_URL=mongodb://%DB_SERVER%/qhd20180810
REM set MONGO_OPLOG_URL=mongodb://%DB_SERVER%/local
set MULTIPLE_INSTANCES_COLLECTION_NAME=creator_instances
REM set METEOR_PACKAGE_DIRS=C:\Users\steedos\Documents\meteor_temp_pgs\packages\
REM set ROOT_URL=http://127.0.0.1:5000
REM set ROOT_URL=http://192.168.0.195:5000/creator
set ROOT_URL=http://192.168.0.81:5000
REM meteor run --port 5000
REM set MAIL_URL=smtp://AKIAJPRG5K6Z2XDWUM2A:AglrBWID%%2Fp2kCIByvcGE6gSbewe93HNFZXvGZs8lbk9I@email-smtp.us-east-1.amazonaws.com:465/
set TOOL_NODE_FLAGS="--max-old-space-size=3800"
set SOCKET_IO_PORT=8080
meteor run --port 5000 --settings settings.json