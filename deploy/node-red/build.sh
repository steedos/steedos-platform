#!/bin/bash
###
 # @Author: baozhoutao@steedos.com
 # @Date: 2024-11-28 13:47:30
 # @LastEditors: baozhoutao@steedos.com
 # @LastEditTime: 2025-03-19 20:11:12
 # @Description: 
### 
export CQP_VERSION=0.0.1
echo "#########################################################################"
echo "CQP Low Code version: ${CQP_VERSION}"
echo "#########################################################################"

docker-compose build --no-cache \
    --build-arg ARCH=amd64 \
    --build-arg NODE_VERSION=14 \
    --build-arg OS=alpine3.12 \
    --build-arg BUILD_DATE="$(date +"%Y-%m-%dT%H:%M:%SZ")"

docker tag steedos/steedos-project-nodered:latest steedos/steedos-project-nodered:${CQP_VERSION}