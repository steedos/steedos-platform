#!/bin/bash

# 加载 nvm 环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 获取 Node.js 20 的实际路径
NODE_PATH=$(nvm which 20)

if [ -z "$NODE_PATH" ]; then
    echo "Error: Node.js 14 is not installed. Please install it with nvm."
    exit 1
fi

# 切换到工作目录
cd /opt/steedos/plugins || exit

# 使用 Node.js 14 运行应用
exec "$NODE_PATH" ./node_modules/@builder6/mongodb-api/dist/main.js