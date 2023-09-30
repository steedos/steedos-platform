#!/bin/bash
docker buildx create --use
docker buildx build --platform linux/arm64,linux/amd64 --push -t steedos/steedos-enterprise  .