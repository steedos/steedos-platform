<!--
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-13 10:22:58
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-13 13:39:37
 * @FilePath: /steedos-platform-2.3/packages/objectql/src/functions/function.md
 * @Description: 
-->

# Function

## .function.yml
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
- `params`: Params
- `getObject`: Function(objectName), 使用对象名称获取对象实例,
- `getUser`:  Function(userId, spaceId), 使用用户、工作区标识获取用户Session信息,
### global
- `_`: require('lodash')
- `moment`: require('moment')
- `validator`: require('validator')
- `filters`: require('@steedos/filters')
### objects
