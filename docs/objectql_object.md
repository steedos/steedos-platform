---
title: Object API
---

## 查询 find

按指定条件查询记录，并返回记录数组。未找到时返回空数组[]。

```typescript
  const posts = await connection.getObject("posts").find({
      fields: ['name', 'body', 'likesCount'],
      filters: [['likesCount', '>', 10]],
      top: 20,
      skip: 0,
      sort: 'likesCount desc'
  });
```

## 查询单条记录 findOne

查询并返回一条记录。

```typescript
  const post = await connection.getObject("posts").findOne('5dcbb48f735bba40b3ebbe1a');
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

## QueryOptions

QueryOptions 包括以下参数：

- fields: 字段名数组
- filters: 查询条件数组
- sort: 排序规则
- top: 返回记录数
- skip: 跳过记录数，通常用于分页显示。
