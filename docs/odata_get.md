---
title: 读取
---

```shell
GET /api/v4/{object_name}/{record_id}
```

此接口用于返回某一条业务数据的详细信息。接口只会返回当前用户授权访问的业务数据。

## 查询参数
- object_name： 业务对象名称
- record_id: 需要查询的记录ID

## 返回结果
查询成功后，将返回对象明细数据。

## 示例
查询一个联系人的详细信息。

```shell
GET /api/v4/contacts/cM3H88eYYCA664aJG
```

```json
{
    "@odata.id": "https://localhost:5000/api/v4/contacts('cM3H88eYYCA664aJG')",
    "@odata.etag": "W/\"cM3H88eYYCA664aJG\"",
    "@odata.editLink": "https://localhost:5000/api/v4/contacts('cM3H88eYYCA664aJG')",
    "_id": "cM3H88eYYCA664aJG",
    "name": "陈奕迅",
    "mobile": "18944550001",
    "company": "上海某某公司",
    "address": "上海市普陀区某某街道",
    "account": {
      "_id": "79rRJJxTdwG7Agv9r",
      "name": "dada1"
    },
    "owner": {
      "_id": "hPgDcEd9vKQxwndQR",
      "name": "系统管理员"
    }
}
```