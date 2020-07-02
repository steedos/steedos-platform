# 开发指引

## 运行项目源码

- [安装Meteor](https://www.meteor.com/install)
- [安装yarn](https://yarnpkg.com/zh-Hant/)
- 将项目克隆到本地
- 进入项目文件夹
- 执行 yarn ，安装依赖包。
- 执行 meteor
- 使用浏览器访问 https://localhost:3000
- 点击创建企业，注册企业账户

### 安装MongoDB数据库

- [安装MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
- 启动MongoDB服务

设定环境变量

```shell
export MONGO_URL=mongodb://127.0.0.1/steedos
```

### 安装依赖

```shell
yarn
```

### 编译

```shell
export TOOL_NODE_FLAGS="--max-old-space-size=3800"
yarn run build
```

### 测试

执行以上编译命令后，会自动把编译好的 steedos-server，复制到 [../object-server/server](https://github.com/steedos/object-server/tree/develop/server) 中

```shell
cd ../object-server/apps/contracts
yarn start
```

### 发布版本

在 object-server 中测试通过后，统一发布版本。
