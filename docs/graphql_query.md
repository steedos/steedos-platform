---
title: 查询
---
### 在graphql界面中查询
- 查询条件接受5个参数，可根据需要搭配使用
    - filters:String类型
    - fields:Array类型
    - top:Int类型
    - skip:Int类型
    - sort:String类型
- 如：

```graphql
query {
  organizations(filters:"_id ne -1", fields:["name"], top:1, skip:1, sort:"name desc") {
    _id
    name
    fullname
    sort_no
    is_company
    is_group
    hidden
  }
}
```

- 查询结果
```json
{
  "data": {
    "organizations": [
      {
        "_id": "cYzsXtT7CQoDaYkpb",
        "name": "财务部",
        "fullname": null,
        "sort_no": null,
        "is_company": null,
        "is_group": null,
        "hidden": null
      }
    ]
  }
}
```
