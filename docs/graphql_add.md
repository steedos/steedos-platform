---
title: 新增
---
### 在graphql界面中新增数据
- 方法名格式为： {定义的object.name}_INSERT_ONE
- 接受一个参数
    - data:JSON格式
- 如：
```graphql
mutation {
  organizations_INSERT_ONE(data:{name:"财务部"})
}
```

- 结果：
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

