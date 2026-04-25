# Steedos 规范快速参考卡片

## 🎯 文件类型速查表

### 1. 对象文件 (.object.yml)
```yaml
# 必填
name: object_name

# 推荐
label: "Display Name"
icon: "icon_name"
enable_search: true
enable_files: true
enable_chatter: true

# 字段定义（内嵌，无独立 .field.yml）
fields:
  name:
    type: text                 # 必填
    label: "Name"
    required: true
    searchable: true
    
  assigned_to:
    type: lookup               # lookup 必填 reference_to
    reference_to: users        # 可以是字符串、数组或函数
    multiple: true
    defaultValue: "{userId}"

# 列表视图
list_views:
  all:
    label: "All Records"
    columns: [name, assigned_to]
    filters: []

# 权限集（必须有 user 和 admin）
permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: false      # 只能改自己的
    viewAllRecords: true         # 能看所有的
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true       # 能改所有的
    viewAllRecords: true
```

**必填字段**: `name`
**文件位置**: `main/default/objects/{name}.object.yml`

---

### 2. 触发器文件 (.trigger.yml)
```yaml
# 必填字段
name: trigger_name
listenTo: object_name          # 监听的对象
when:                          # 触发时机（数组）
  - afterInsert
  - afterUpdate

# 必填：JavaScript 代码
handler: |
  const { doc, userId, spaceId } = ctx.params;
  const user = await ctx.getUser(userId, spaceId);
  
  // 使用 objects 命名空间访问数据
  await objects.some_object.insert({
    name: doc.name,
    owner: userId,
    space: spaceId
  }, user);

# 推荐
authentication_type: none
locked: false
type: code
isEnabled: true
```

**何时触发**: 
- `beforeInsert` / `afterInsert`
- `beforeUpdate` / `afterUpdate`
- `beforeDelete` / `afterDelete`

**文件位置**: `main/default/triggers/{name}.trigger.yml`

---

### 3. 函数文件 (.function.yml)
```yaml
# 必填字段
name: function_name
objectApiName: space_users     # 所属对象
script: >-                     # JavaScript 代码
  const userSession = await ctx.getUser(
    ctx.params.userId, 
    ctx.params.spaceId
  );
  
  const records = await objects.space_users_invite.find({
    filters: [['space', '=', userSession.spaceId]]
  });
  
  return { token: records[0]._id };

# 推荐
isEnabled: true
is_rest: true                  # 是否通过 REST API 暴露
description: "Function description"
locked: false
```

**全局可用变量**:
- `_`: lodash
- `moment`: moment.js
- `validator`: validator
- `objects`: 数据访问接口
- `ctx`: 上下文（包含 params, getUser 等）

**文件位置**: `main/default/functions/{name}.function.yml`

---

### 4. 按钮文件 (.button.yml)
```yaml
# 最小化按钮
name: button_name              # 必填
label: "Button Label"
'on': record                   # record / list / record_only / list_only
visible: true

# 完整 Amis 按钮
name: copy_record
label: "复制"
'on': record_only
type: amis_button
is_enable: true
visible: !!js/function |
  function (object_name, record_id, record_permissions, record) {
    return record.record.type == 'profile';
  }
amis_schema: |-
  {
    "type": "button",
    "label": "Copy",
    "onEvent": {
      "click": {
        "actions": [{
          "actionType": "url",
          "args": {"url": "${context.rootUrl}/api/copy"}
        }]
      }
    }
  }
```

**必填字段**: `name`
**文件位置**: `main/default/objects/{objectName}/buttons/{name}.button.yml`

---

### 5. 服务文件 (.service.js)
```javascript
"use strict";

module.exports = {
    // 必填
    name: 'service-name',
    
    // 推荐
    namespace: 'steedos',
    mixins: [],
    dependencies: ['objectql'],
    
    settings: {
        // 服务配置
    },
    
    actions: {
        // 暴露的 API 方法
        'service.method': {
            handler(ctx) {
                // 实现
            }
        }
    },
    
    events: {
        // 事件处理
    },
    
    methods: {
        // 内部方法
        getObject: {
            handler: function(objectName) {
                return {
                    find: (query, userSession) => { /* ... */ },
                    insert: (doc, userSession) => { /* ... */ }
                }
            }
        }
    },
    
    created() {
        // 生命周期：服务创建时
    },
    
    async started() {
        // 生命周期：服务启动时
    },
    
    async stopped() {
        // 生命周期：服务停止时
    }
};
```

**必填字段**: `name`
**文件位置**: `package.service.js` 或 `{serviceName}.service.js`

---

## 📋 命名约定

| 对象 | 约定 | 示例 |
|------|------|------|
| 对象名 | snake_case | `tasks`, `space_users_invite` |
| 字段名 | snake_case | `due_date`, `assigned_to` |
| 触发器名 | snake_case | `objects_set_default_properties` |
| 函数名 | snake_case | `space_users_invite_token` |
| 按钮名 | camelCase 或 snake_case | `testConnection`, `delete_object` |
| 服务名 | kebab-case | `service-core-objects` |

---

## ⚠️ 常见错误

| 错误 | 正确做法 |
|------|----------|
| 创建 `.field.yml` 文件 | 字段定义要内嵌在 `.object.yml` 的 `fields:` 里 |
| lookup 字段缺少 `reference_to` | 必须指定 `reference_to: object_name` 或函数 |
| trigger 的 `when` 不是数组 | 必须: `when: [afterInsert]` 不要 `when: afterInsert` |
| 按钮缺少 `name` 字段 | 每个按钮必须有 `name` 字段 |
| 服务缺少 `namespace` | 建议添加 `namespace: "steedos"` |
| handler/script 中无法访问 objects | 是全局变量，直接使用 `objects.xxx` |

---

## 🔍 验证检查清单

创建新文件时检查：

### 对象 (.object.yml)
- [ ] 文件名: `{name}.object.yml`
- [ ] 有 `name` 字段
- [ ] `name` 是 snake_case
- [ ] 每个字段有 `type`
- [ ] lookup 字段有 `reference_to`
- [ ] 有 `permission_set` 包含 `user` 和 `admin`

### 触发器 (.trigger.yml)
- [ ] 文件名: `{name}.trigger.yml`
- [ ] 有 `name`, `listenTo`, `when`
- [ ] `when` 是数组
- [ ] `handler` 是有效 JavaScript
- [ ] 有 `authentication_type: none`

### 函数 (.function.yml)
- [ ] 文件名: `{name}.function.yml`
- [ ] 有 `name`, `objectApiName`, `script`
- [ ] `script` 是有效 JavaScript
- [ ] 返回 JSON 序列化对象

### 按钮 (.button.yml)
- [ ] 文件名: `{name}.button.yml`
- [ ] 有 `name`
- [ ] 有 `label`
- [ ] `on` 值有效
- [ ] amis 按钮有 `amis_schema`

### 服务 (.service.js)
- [ ] 导出对象
- [ ] 有 `name`
- [ ] 有 `namespace`
- [ ] 有 `methods` 或 `actions`

---

## 🎓 学习资源

- 完整参考: `STEEDOS_SPEC_REFERENCE.md`
- 验证总结: `SPEC_VALIDATION_SUMMARY.md`
- 真实示例: `services/service-core-objects/main/default/`

---

**2026-04-25** | 基于真实平台探索
