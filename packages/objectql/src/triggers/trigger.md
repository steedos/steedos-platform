
# Trigger

## .trigger.yml
```yaml
name:
listenTo:
when: []
isEnabled: 
handler: |-
    // 函数签名 async (ctx)=>{}
```


## 参数

### ctx
- `params`: Trigger Params
- `meta`: broker.meta,
- `call`: broker.call,
- `emit`: broker.emit,
- `broadcast`: broker.broadcast,
- `broker`: {
    namespace: broker.namespace,
    nodeID: broker.nodeID,
    instanceID: broker.instanceID,
    logger: broker.logger,
    metadata: broker.metadata
},
- `getObject`: Function(objectName), 使用对象名称获取对象实例,
- `getUser`:  Function(userId, spaceId), 使用用户、工作区标识获取用户Session信息,
- `makeNewID`: Function(), 获取一个字符串格式的唯一标识
### global
- `_`: require('lodash')
- `moment`: require('moment')
- `validator`: require('validator')
- `Filters`: require('@steedos/filters')
### services
### objects
