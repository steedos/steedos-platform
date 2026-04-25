# Steedos 软件包规范参考文档

## 1. 包结构概览

### 典型包目录结构
```
service-core-objects/
├── package.json
├── package.service.js         # Moleculer 服务定义（可选）
└── main/
    └── default/
        ├── applications/      # 应用配置
        ├── objects/          # 对象定义
        │   ├── tasks.object.yml
        │   ├── notes/
        │   │   └── buttons/
        │   │       └── testConnection.button.yml
        │   └── space_users_invite.object.yml
        ├── fields/           # 字段定义（一般内嵌在对象中）
        ├── triggers/         # 触发器
        │   ├── *.trigger.yml
        │   └── *.trigger.js
        ├── functions/        # 函数定义
        │   └── *.function.yml
        ├── tabs/            # 标签页
        │   └── *.tab.yml
        ├── pages/           # 页面定义
        ├── translations/    # 翻译文件
        ├── services/        # 服务代码
        └── util/            # 工具函数
```

## 2. 文件类型与规范

### 2.1 对象定义文件 (.object.yml)

**位置**: `objects/{objectName}.object.yml`

**必填字段**:
- `name`: 对象标识符 (string, required) - API 名称，通常为蛇形命名

**常用字段**:
- `label`: 对象显示名称 (string)
- `icon`: 对象图标 (string) - 如 "timesheet_entry", "note", "link"
- `enable_search`: 是否启用全文搜索 (boolean)
- `enable_files`: 是否启用文件功能 (boolean)
- `enable_chatter`: 是否启用评论功能 (boolean)
- `hidden`: 是否隐藏对象 (boolean)
- `version`: 版本号 (number)

**子字段**:
- `fields`: 对象字段定义 (object)
- `list_views`: 列表视图配置 (object)
- `permission_set`: 权限集配置 (object)

**示例** (tasks.object.yml):
```yaml
name: tasks
label: Task
icon: timesheet_entry
enable_search: true
enable_files: true
enable_chatter: true
version: 2
fields:
  name:
    label: Name
    type: text
    required: true
    is_wide: true
    searchable: true
    filterable: true
    index: true
    name: name
  assignees:
    label: Assignees
    type: lookup
    required: true
    reference_to: users
    defaultValue: "{userId}"
    multiple: true
    name: assignees
    filterable: true
list_views:
  all:
    label: All Tasks
    columns:
      - name
      - due_date
    filters: []
permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: true
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```

### 2.2 字段定义 (.field.yml 或内嵌在对象中)

**位置**: 
- 通常在对象的 `fields:` 部分内嵌定义
- 或单独文件: `objects/{objectName}/{fieldName}.field.yml`

**必填字段**:
- `type`: 字段类型 (string, required)
  - `text`: 文本字段
  - `textarea`: 文本域
  - `date`: 日期字段
  - `boolean`: 布尔值
  - `select`: 选择列表
  - `lookup`: 查找字段（关键类型）
  - 等等

**Lookup 字段特性**:
- `reference_to`: 引用的对象或对象数组 (string | string[] | function)
- `multiple`: 是否多选 (boolean)
- `defaultValue`: 默认值 (string | function)

**通用字段属性**:
- `label`: 字段显示名称
- `required`: 是否必填
- `is_wide`: 是否宽字段
- `searchable`: 是否可搜索
- `filterable`: 是否可过滤
- `sortable`: 是否可排序
- `index`: 是否建立索引

**示例** (lookup 字段):
```yaml
related_to:
  label: Related Object Record
  type: lookup
  index: true
  reference_to: !<tag:yaml.org,2002:js/function> |-
    function () {
      try{
        let objects = [];
        var queryResult = Steedos.authRequest(`/graphql`, {
            type: 'POST', async: false, 
            data: JSON.stringify({
              query: `{ objects(filters: ["enable_notes","=",true]){ name,enable_notes } }`
            })
        });
        objects = queryResult && queryResult.data && queryResult.data.objects;
        return _.map(objects, 'name') ;
      }catch(e){
        return []
      }
    }
  name: related_to
  filterable: true

assigned_to:
  label: Assigned To
  type: lookup
  reference_to: users
  multiple: true
  defaultValue: "{userId}"
```

### 2.3 触发器定义 (.trigger.yml)

**位置**: `triggers/{triggerName}.trigger.yml`

**必填字段**:
- `name`: 触发器标识符 (string)
- `listenTo`: 监听的对象名称 (string)
- `when`: 触发时机数组 (string[])
  - `beforeInsert`: 插入前
  - `afterInsert`: 插入后
  - `beforeUpdate`: 更新前
  - `afterUpdate`: 更新后
  - `beforeDelete`: 删除前
  - `afterDelete`: 删除后

**常用字段**:
- `isEnabled`: 是否启用 (boolean, default true)
- `handler`: 触发器处理代码 (string - JavaScript 代码)
- `authentication_type`: 认证类型 (string, 通常 "none")
- `locked`: 是否锁定 (boolean)
- `type`: 触发器类型 (string, 通常 "code")

**示例**:
```yaml
name: objects_set_default_object_properties_trigger
listenTo: objects
when:
  - afterInsert
isEnabled: true
handler: |
  try{
    const { doc, userId, spaceId} = ctx.params;
    const user = await ctx.getUser(userId, spaceId);
    
    // 插入默认字段
    await objects.object_fields.insert({
        object: doc.name,
        owner: userId,
        _name: "name",
        name: "name",
        label: "名称",
        sort_no: 10,
        space: doc.space,
        type: "text",
        required: true,
        index: true,
        searchable: true,
        filterable: true
    }, user);
  }catch(error){
    console.log(error)
  }
authentication_type: none
locked: false
type: code
```

### 2.4 函数定义 (.function.yml)

**位置**: `functions/{functionName}.function.yml`

**必填字段**:
- `name`: 函数标识符 (string)
- `objectApiName`: 所属对象 API 名称 (string)
- `script`: 函数代码 (string - JavaScript)

**常用字段**:
- `isEnabled`: 是否启用 (boolean, default true)
- `is_rest`: 是否以 REST 方式暴露 (boolean)
- `description`: 函数描述 (string)
- `locked`: 是否锁定 (boolean)

**全局可用变量**:
- `_`: lodash 库
- `moment`: moment.js 库
- `validator`: validator 库
- `ctx`: 上下文对象
  - `ctx.params`: 请求参数
  - `ctx.getUser()`: 获取用户信息
  - `ctx.broker`: Moleculer broker
- `objects`: 对象访问接口

**示例**:
```yaml
name: space_users_invite_token
objectApiName: space_users
isEnabled: true
is_rest: true
script: >-
  // global: {_:lodash, moment, validator, filters}
  // objects
  // ctx: {input, params, broker, getObject, getUser}

  const userSession = await ctx.getUser(ctx.params.userId, ctx.params.spaceId);

  if (!userSession.is_space_admin) {
      throw new Error('No permission');
  }

  const record = await objects.space_users_invite.find({ 
    filters: [['space','=', userSession.spaceId], ['valid', '=', true]] 
  })

  if (record.length > 0) {
      return { token: record[0]._id };
  } else {
      const result = await objects.space_users_invite.insert({ 
        valid: true, 
        space: userSession.spaceId 
      }, userSession);
      if (result) {
          return { token: result._id };
      }
  }
description: 邀请用户
locked: false
```

### 2.5 按钮定义 (.button.yml)

**位置**: `objects/{objectName}/buttons/{buttonName}.button.yml`

**必填字段**:
- `name`: 按钮标识符 (string)

**常用字段**:
- `label`: 按钮显示名称 (string)
- `on`: 按钮出现位置 (string)
  - `record`: 记录详情页
  - `list`: 列表页
  - `record_only`: 仅记录详情页
  - `list_only`: 仅列表页
- `visible`: 是否可见 (boolean | function)
- `type`: 按钮类型 (string)
  - `amis_button`: Amis UI 按钮
  - `standard`: 标准按钮
- `is_enable`: 是否启用 (boolean)
- `amis_schema`: Amis UI 配置 (JSON string, 用于 amis_button)

**最小化示例**:
```yaml
name: testConnection
label: Test connection
'on': record
visible: true
```

**完整 Amis Button 示例** (简化):
```yaml
name: copy
label: 复制
'on': record_only
is_enable: true
type: amis_button
visible: !!js/function |
    function (object_name, record_id, record_permissions, record) {
        return record.record.type == 'profile';
    }
amis_schema: |-
  {
      "type": "service",
      "body": [
          {
              "type": "button",
              "label": "Copy",
              "onEvent": {
                  "click": {
                      "weight": 0,
                      "actions": [
                          {
                              "actionType": "url",
                              "args": {
                                  "url": "${context.rootUrl}/api/copy"
                              }
                          }
                      ]
                  }
              }
          }
      ]
  }
```

## 3. 包服务文件 (.service.js 或 package.service.js)

**位置**: 根目录或 `package.service.js`

**结构**: Moleculer 微服务定义

**必填字段**:
- `name`: 服务名称 (string)
- `namespace`: 命名空间 (string, 通常 "steedos")

**常用字段**:
- `settings`: 服务配置 (object)
- `dependencies`: 依赖的其他服务 (string[])
- `actions`: 暴露的 API 方法 (object)
- `events`: 事件定义 (object)
- `methods`: 内部方法 (object)
- `created()`: 生命周期钩子 - 服务创建时
- `started()`: 生命周期钩子 - 服务启动时
- `stopped()`: 生命周期钩子 - 服务停止时

**最简单示例**:
```javascript
"use strict";
module.exports = {
    name: 'object-mixin',
    namespace: "steedos",
    mixins: [],
    
    settings: {
        // 服务配置
    },
    
    dependencies: ['objectql'],
    
    actions: {
        // 定义 API 方法
    },
    
    events: {
        // 定义事件处理
    },
    
    methods: {
        // 定义内部方法
        getObject: {
            handler: function (objectName) {
                return {
                    find: async (query, userSession) => {
                        return await this.broker.call("objectql.find", {
                            objectName,
                            query
                        }, {
                            meta: { user: userSession }
                        })
                    },
                    insert: async (doc, userSession) => {
                        return await this.broker.call("objectql.insert", {
                            objectName,
                            doc,
                        }, {
                            meta: { user: userSession }
                        })
                    }
                    // ... 更多方法
                }
            }
        }
    },
    
    created() {
        // 服务创建时执行
    },
    
    async started() {
        // 服务启动时执行
    },
    
    async stopped() {
        // 服务停止时执行
    }
};
```

## 4. 关键字段类型参考

| 类型 | 说明 | 示例 |
|------|------|------|
| `text` | 文本字段 | name, email |
| `textarea` | 多行文本 | description |
| `date` | 日期 | due_date |
| `datetime` | 日期时间 | created |
| `boolean` | 布尔值 | is_active |
| `number` | 数字 | amount |
| `select` | 选择列表 | status, priority |
| `lookup` | 查找/关联 | assigned_to, related_to |
| `master-detail` | 主从关系 | (parent lookup) |
| `formula` | 公式字段 | (计算字段) |
| `rollup` | 汇总字段 | (聚合字段) |

## 5. 权限集 (permission_set) 配置

在对象定义中的标准格式:

```yaml
permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: false      # 只能修改自己的记录
    viewAllRecords: true         # 可以查看所有记录
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true       # 可以修改所有记录
    viewAllRecords: true
```

## 6. 验证规则检查清单

### 对象文件 (.object.yml)
- ✓ 必须有 `name` 字段
- ✓ `name` 应为蛇形命名 (snake_case)
- ✓ 如果有字段定义，应在 `fields:` 下
- ✓ 列表视图应在 `list_views:` 下
- ✓ 权限集应在 `permission_set:` 下

### 字段定义
- ✓ 必须有 `type` 字段
- ✓ lookup 字段必须有 `reference_to`
- ✓ `reference_to` 可以是字符串、数组或 JavaScript 函数

### 触发器文件 (.trigger.yml)
- ✓ 必须有 `name`, `listenTo`, `when` 字段
- ✓ `when` 应该是数组格式
- ✓ `handler` 包含 JavaScript 代码
- ✓ 通常有 `authentication_type: none`

### 函数文件 (.function.yml)
- ✓ 必须有 `name`, `objectApiName`, `script` 字段
- ✓ `script` 包含 JavaScript 代码
- ✓ 返回值应该是 JSON 序列化的对象

### 按钮文件 (.button.yml)
- ✓ 必须有 `name` 字段
- ✓ `on` 字段指定显示位置
- ✓ Amis 按钮需要有 `amis_schema` 字段
- ✓ `visible` 可以是函数

### 服务文件 (.service.js)
- ✓ 必须导出对象
- ✓ 必须有 `name` 字段
- ✓ 建议有 `namespace` 字段

---

**最后更新**: 2026-04-25
