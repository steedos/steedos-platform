#!/bin/bash
BUNDLE_PATH="/srv/creator"

# Create BUNDLE_PATH directory if it does not exist
[ ! -d $BUNDLE_PATH ] && mkdir -p $BUNDLE_PATH || :

if [ -d "$BUNDLE_PATH" ]; then
	meteor build --server https://cn.steedos.com/creator --directory $BUNDLE_PATH --allow-superuser
	cd $BUNDLE_PATH/bundle/programs/server
	rm -rf node_modules
	rm -f npm-shrinkwrap.json
	npm install --registry https://registry.npm.taobao.org -d

	cd $BUNDLE_PATH
	pm2 restart creator.0
else
	echo "!!!=> Failed to create bundle path: $BUNDLE_PATH"
fi