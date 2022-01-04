# Steedos
自动生成并更新mongo-bi-connector所需的schema

### run service
```
yarn start
```

### 功能说明
- 本服务用于生成mongo bi connector所需的schema数据，并写入mongo数据库

### 使用方法
- 使用时先启动服务，自动读取对象定义，并写入到MONGO_URL下的schems与names表中
- 命令行中运行mongosqld --schemaSource [schemaDbName] --schemaMode custom
    + 须先安装mongo bi connector
    + schemaDbName须与env文件中MONGO_URL配置的一致
- 待mongo bi connector启动，即可使用其他sql工具通过connector查询mongodb(默认端口3307)

### source
- 需要配置环境变量：MONGO_URL、TRANSPORTER，可以通过项目的env文件进行配置。

