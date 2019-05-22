---
title: 删除
---
### 在graphql界面中删除数据
- 方法名格式为： {定义的object.name}_DELETE_ONE
- 接受参数
    - _id:String类型
- 如：
```graphql
mutation {
  organizations_DELETE_ONE(_id:"5cb98489d09a343e14daae95")
}
```

- 结果：
```json
{
  "data": {
    "organizations_DELETE_ONE": null
  }
}
```
