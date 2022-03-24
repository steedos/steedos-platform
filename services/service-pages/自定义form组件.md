## 自定义Form组件(新增、编辑)

- Form 组件需要自带弹出层
- Form 组件内部处理数据接口问题

### 渲染Form组件时, 传入的data为
```
data: {
    appId: appId,
    objectName: objectName,
    recordId: record._id // 新增时为null 
    title: title,
    initialValues: initialValues,

    context: {
        rootUrl: ROOT URL,
        tenantId: 魔方Id,
        userId: 用户Id,
        authToken: 用户认证authToken
    }
}
```

### Form组件数据处理完后,需要发出消息:

- 新增记录事件
```
window.postMessage(Object.assign({type: "record.created"}, data, {record: record}))
```

- 编辑记录事件
```
window.postMessage(Object.assign({type: "record.edited"}, data, {record: record}))
```

**autoRoute 默认为 true**

### Platform 消费record.created、record.edited 消息

- record.created: 新建的对象名称等于当前对象名称, 则进入详细页面, 否则更新当前route

- record.edited: 更新当前页面
