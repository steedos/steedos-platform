---
title: 数据源
---

每一个业务对象都有一个对应的数据源，用于保存业务数据。Steedos系统层使用MongoDB数据库，Steedos的标准对象都保存在默认数据源中。开发人员也可以通过配置文件连接其他的数据源，包括已有的业务系统。

## 数据源配置

### 示例
开发人员可以在项目配置文件（steedos-config.yml）中定义默认数据源的连接方式。

以下配置文件连接了两个数据源，其中default是steedos的默认数据源，用于保存系统级的标准对象，必须配置。mattermost是第三方数据源，用于连接mattermost数据库。
```yaml
datasources:
  default:
    connection:
      url: mongodb://192.168.0.21/steedos
    objectFiles: 
      - "./src/default/"
  mattermost:
    connection: 
      driver: postgres
      url: postgresql://mmuser:password@192.168.0.21:5432/mattermost
    objectFiles: 
      - "./src/mattermost/"
```

### 默认数据源

默认数据源提供了很多数据管理的标准功能，如果使用第三方数据源则不能使用这些功能。例如：
- 单位级、记录级权限控制机制
- 更丰富的字段类型：数组、内嵌对象、内嵌表格
- 回收站机制

```yaml
datasources:
  default:
    connection:
      url: mongodb://192.168.0.21/steedos
```

### Oracle 数据源
连接到Oracle数据源之前，需要先安装Oracle客户端，并在项目中安装Oracle驱动。
```
yarn add oracledb
```
配置文件示例：

```yaml
datasources:
  oracle1:
    connection:
      driver: oracle
      host: 192.168.0.190
      port: 1521
      username: 
      password: 
      database: ORCL
    objectFiles: 
      - "./src/oracle1/"
```

### SQL Server 数据源
连接到SQL Server数据源之前，需要先在项目中安装SQL Server驱动。
```
yarn add mssql
```
配置文件示例：
```yaml
datasources:
  mssql1:
    connection:
      driver: mssql
      host: 192.168.0.190
      port: 1433
      username: 
      password: 
      database: database1
    objectFiles: 
      - "./src/mssql1/"
```

### PostgreSQL 数据源
连接到PostgreSQL数据源之前，需要先在项目中安装PostgreSQL驱动。
```
yarn add pg
```
```yaml
datasources:
  postgres1:
    connection:
      driver: postgres
      host: 192.168.0.190
      port: 
      username: 
      password: 
      database: database1
    objectFiles: 
      - "./src/postgres1/"
```

### MySQL 数据源
连接到MySQL数据源之前，需要先在项目中安装mysql驱动。
```
yarn add mysql
```
配置文件示例：
```yaml
datasources:
  mysql1:
    connection:
      driver: mysql
      host: 192.168.0.190
      port: 
      username: 
      password: 
      database: database1
    objectFiles: 
      - "./src/mysql1/"
```
