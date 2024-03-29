## K6 压力测试

### 安装依赖环境
[https://k6.io/docs/get-started/installation/](https://k6.io/docs/get-started/installation/)

### 测试平台安装软件包 @steedos/k6-test

### 配置环境变量

- `ROOT_URL` 需要测试的平台地址
- `API_KEY`  需要测试的平台API_KEY

- `K6_DURATION` 测试时间
- `K6_VUS` 并发数

- `K6_PROMETHEUS_RW_SERVER_UR` prometheus地址

### 安装node modules
```
yarn
```

### 运行测试
- 新建记录
```
yarn test:openapi:insert
```
- 查询记录
```
yarn test:openapi:find
```

- 新建主记录及新建50条子表记录
```
yarn test:openapi:insert:child
```

- 新建主记录并修改
```
test:openapi:insert:update
```

- 新建主记录并删除
```
test:openapi:insert:delete
```