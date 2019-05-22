---
title: 编辑
---
### 在graphql界面中编辑数据
- 方法名格式为： {定义的object.name}_UPDATE_ONE
- 接受一个参数
    - _id:String类型
    - data:JSON类型
- 如：
```graphql
mutation {
  organizations_UPDATE_ONE(_id:"5cb98489d09a343e14daae95", data:{name:"财务部"})
}
```

- 结果返回更新后的数据：
```json
{
  "data": {
    "organizations_INSERT_ONE": {
      "name": "财务部",
      "_id": "5cb98489d09a343e14daae95"
    }
  }
}
```
