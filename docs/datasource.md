---
title: 定义数据源
---

数据源用于定义数据库连接方式，业务对象通过对应的数据源保存数据。Steedos系统层使用MongoDB数据库，Steedos的标准对象都保存在默认数据源中。开发人员也可以通过配置文件连接其他常用的数据源，包括SQL Server、Oracle、MySQL、PostgreSQL。

## 使用steedos-config配置数据源

开发人员可以在项目配置文件（steedos-config.yml）中定义数据源。

以下配置文件连接了两个数据源。

```yaml
datasources:
  default:
    connection:
      driver: mongo
      url: mongodb://192.168.0.21/steedos
  mattermost:
    connection:
      driver: postgres
      url: postgresql://user:password@192.168.0.21:5432/mattermost
```

## 使用代码定义数据源

最简单和最常用的方法是使用`createConnection`和`createConnections`函数。

`createConnection` 创建单个连接：

```typescript
import { createConnection, Connection } from "@steedos/objectql";

const connection = await createConnection({
  name: "mysql",
  driver: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
});
```

只使用`url`和`type`也可以进行连接。

```js
createConnection({
  name: "postgres",  
  driver: "postgres",
  url: "postgres://test:test@localhost/test"
});
```

## 默认数据源

默认数据源使用MongoDB数据库，以default命名，Steedos的内核[标准业务对象](./standard_objects)均运行于此数据源中。

```yaml
datasources:
  default:
    connection:
      url: mongodb://192.168.0.21/steedos
```

## 加载业务对象

在定义数据源时，通过配置 objectFiles 属性，可以加载[业务对象](./object.md)到数据源中。

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
      url: postgresql://user:password@192.168.0.21:5432/mattermost
    objectFiles:
      - "./src/mattermost/"
```
