# Steedos
自动生成并更新mongo-bi-connector所需的schema

### run service
```
yarn start
```

### develop app
- 使用mongosqld --schemaSource [schemaDbName] --schemaMode custom运行bi connector, 
    schemaDbName须与env文件中MONGO_SCHEMA_URL配置的一致
- 启动本服务
- 启动service-metadata
- 运行steedos项目

### source
- 需要配置环境变量：MONGO_SCHEMA_URL、TRANSPORTER，可以通过项目的env文件进行配置。

