---
title: Object 
---

## 对象是什么?

对象是一个映射到数据库表（或使用 MongoDB 时的集合）的配置文件。
你可以通过定义yml文件来创建一个对象：

```yml
name: user
fields:
  id:
    type: number
    primary: true
  name:
    type: string
  isActive:
    type: boolean
```

这将创建以下数据库表：

```bash
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

基本对象由列和关系组成。
每个对象**必须**有一个主列（如果使用 MongoDB，则为 _id 列）。

> 每个对象都必须在Connection选项中注册，你可以指定包含所有对象的整个目录， 该目录下所有对象都将被加载。

```typescript
import { createConnection, Connection } from "@steedos/objectql";

const connection: Connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    objectFiles: ["./objects/"]
});
```

## 批量查询 find

按指定条件查询记录，并返回记录数组。未找到时返回空数组[]。

查询条件包括以下参数：

- fields: 字段名数组
- filters: 查询条件数组
- sort: 排序规则
- top: 返回记录数
- skip: 跳过记录数，通常用于分页显示。

```typescript
  const posts = await connection.getObject("posts").find({
      fields: ['name', 'body', 'likesCount'],
      filters: [['likesCount', '>', 10], ['likesCount', '<', 20]],
      top: 20,
      skip: 0,
      sort: 'likesCount desc'
  });
  // SELECT TOP 20 name, body, likesCount
  // FROM posts
  // WHERE likesCount > 10 AND likesCount < 20
  // ORDER BY likesCount desc
```

## 查询单条记录 findOne

查询并返回一条记录。

```typescript
  const post = await connection.getObject("posts").findOne('5dcbb48f735bba40b3ebbe1a');
  // SELECT * from posts where _id = '5dcbb48f735bba40b3ebbe1a'
```

## 插入 insert

插入一条记录，参数为记录内容。返回插入之后的记录，包括_id字段。

```typescript
  const posts = await connection.getObject("posts").insert({
      name: 'Hello'
      body: 'Hello from samples'
      likesCount: 100
  });
```

## 更新单条记录 updateOne

参数

- _id: 需要更新的记录_id
- doc: 需要更新的记录内容。

```typescript
  const posts = await connection.getObject("posts").updateOne('5dcbb48f735bba40b3ebbe1a', {
      name: 'Hello'
      likesCount: 100
  });
  // UPDATE posts set name = 'Hello' and likesCount = 100 
  // WHERE _id = '5dcbb48f735bba40b3ebbe1a'
```

## 批量更新记录 updateMany

参数

- filters: 查询条件
- doc: 需要更新的记录内容。

```typescript
  const posts = await connection.getObject("posts").updateMany([['likesCount', '>', '20']], {
      likesCount: 20
  });
  // UPDATE posts set likesCount = 20
  // WHERE likesCount > 20
```

## 删除单条记录 delete

```typescript
  const posts = await connection.getObject("posts").delete('5dcbb48f735bba40b3ebbe1a');
  // DELETE FROM posts WHERE _id = '5dcbb48f735bba40b3ebbe1a'
```
