## 功能说明
- 支持第三方应用调用接口发推送通知

## 使用说明

1. 安装软件包 @steedos/service-push

2. 在魔方系统创建第三方应用，并记录下创建成功后的appId

3. 调用系统的graphql接口往push_notifications表中插入一条记录，系统就会自动发送推送通知

例如华炎魔方服务地址为：https://huayan-test.steedos.cn

graphql地址为：https://huayan-test.steedos.cn/graphql

graphql接口文档参考：https://www.steedos.cn/docs/developer/graphql-api

```js
// 调用示例

mutation {
    push_notifications__insert(doc:{ 
      name : "系统管理员为您分配了一个任务1",
      body : "处理次款事务1",
      owner_mobile : "xxxxxxxxxxx", //人员手机号
      app_id : "xxxxxxxxxxxx", //自建第三方应用的appId
      badge: 1 //待办数
}){
      name
      _id
  }
}


```
