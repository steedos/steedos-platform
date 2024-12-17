#!/bin/bash

# 加载 nvm 环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 获取 Node.js 20 的实际路径
NODE_PATH=$(nvm which 20)

if [ -z "$NODE_PATH" ]; then
    echo "Error: Node.js 20 is not installed. Please install it with nvm."
    exit 1
fi

# 切换到工作目录
cd /opt/steedos/builder6 || exit


# 检查是否定义了 B6_SERVER_VERSION 环境变量
if [ -z "$B6_SERVER_VERSION" ]; then
    echo "Environment variable B6_SERVER_VERSION is not set. Skipping version check."
else
    # 获取 package.json 中的 @builder/server 版本号
    if ! command -v jq &>/dev/null; then
        echo "jq is not installed. Please install it using 'sudo apt install -y jq'."
        exit 1
    fi

    B6_SERVER_VERSION_INSTALLED=$(jq -r '.dependencies["@builder6/server"]' package.json)

    # 比对环境变量版本号与 package.json 中的版本号
    if [ "$B6_SERVER_VERSION" != "$B6_SERVER_VERSION_INSTALLED" ]; then
        echo "B6_SERVER_VERSION mismatch, installed: @builder6/server@$B6_SERVER_VERSION_INSTALLED"
        echo "Install new version @builder6/server@$B6_SERVER_VERSION"
        nvm exec 20 npm install @builder6/server@"$B6_SERVER_VERSION" --omit=dev --no-audit --no-update-notifier --no-fund
    else
        echo "Version match: B6_SERVER_VERSION=$B6_SERVER_VERSION"
    fi
fi


# 使用 Node.js 20 运行应用
nvm exec 20  "$NODE_PATH" ./node_modules/@builder6/server/dist/b6.server.js -u /opt/steedos/builder6