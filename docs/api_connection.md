---
title: Connection
---

## 什么是`Connection`

只有在建立连接后才能与数据库进行交互。
ObjectQL 的`Connection`不会像看起来那样设置单个数据库连接，而是设置连接池。
如果使用`createConnection`函数设置连接，则会自动调用`connect`方法。调用`close`时会断开连接（关闭池中的所有连接）。
通常情况下，你只能在应用程序启动时创建一次连接，并在完全使用数据库后关闭它。实际上，如果要为站点构建后端，并且后端服务器始终保持运行,则不需要关闭连接。

## 创建新的连接

有多种方法可以创建连接。但是最简单和最常用的方法是使用`createConnection`和`createConnections`函数。

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

`createConnections` 创建多个连接:

```typescript
import { createConnections, Connection } from "@steedos/objectql";

const connections = await createConnections([
  {
    name: "default",
    driver: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test"
  },
  {
    name: "test2-connection",
    driver: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test2"
  }
]);
```

这两种方式都根据你传递的连接选项创建`Connection`，并调用`connect`方法。另外你也可以在项目的根目录中创建一个`ormconfig.json`文件，`createConnection`和`createConnections`将自动从此文件中读取连接选项。项目的根目录与`node_modules`目录的级别相同。

```typescript
import { createConnection, createConnections, Connection } from "@steedos/objectql";

// createConnection将从ormconfig.json / ormconfig.js / ormconfig.yml / ormconfig.env / ormconfig.xml 文件或特殊环境变量中加载连接选项
const connection: Connection = await createConnection();

// 你可以指定要创建的连接的名称
// （如果省略名称，则将创建没有指定名称的连接）
const secondConnection: Connection = await createConnection("test2-connection");

// 如果调用createConnections而不是createConnection
// 它将初始化并返回ormconfig文件中定义的所有连接
const connections: Connection[] = await createConnections();
```

不同的连接必须具有不同的名称默。认情况下，如果未指定连接名称，则为`default`。
通常在你使用多个数据库或多个连接配置时才会使用多连接。

创建连接后，你可以使用`getConnection`函数从应用程序中的任何位置使用它：

```typescript
import { getConnection } from "type@steedos/objectqlorm";

// 可以在调用createConnection后使用并解析
const connection = getConnection();

// 如果你有多个连接，则可以按名称获取连接
const secondConnection = getConnection("test2-connection");
```

## 使用连接

设置连接后，可以使用`getConnection`函数在应用程序的任何位置使用它：

```typescript
import { getConnection } from "@steedos/objectql";
import { User } from "../entity/User";

export class UserController {
  getAll() {
    return getConnection().find('users', {username: 'god'});
  }
}
```

使用 Connection，你可以对对象执行数据库操作。有关它们的更多信息，请参阅[Object API](api_object.md) 文档。

但一般来说，你不要太多使用`Connection`。大多数情况下，你只需创建连接并使用`getObject()`和来访问连接的管理器和存储库，而无需直接使用连接对象：

```typescript
import { getObject } from "@steedos/objectql";

export class UserController {
  getAll() {
    return getObject("users").find({username: 'god'});
  }
}
```

## 获取对象

使用 getObject 函数可以获取此连接下的对象，使用[Object API](api_object.md)执行查询操作。

```typescript
  const posts = await connection.getObject("posts").find({
      fields: ['name', 'body', 'likesCount'],
      filters: [['likesCount', '>', 10]],
      top: 20,
      skip: 0,
      sort: 'likesCount desc'
  });
```
