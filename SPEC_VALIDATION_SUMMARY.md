# Steedos 规范验证总结

## 📊 探索成果

### 1. 发现的实际包结构

**核心服务包** (~/GitHub/steedos-platform/services/):
```
service-core-objects/           ← 核心对象集合
├── package.service.js          ← 作为 Moleculer mixin
├── main/default/
│   ├── objects/ (60+对象)
│   ├── triggers/ (2个触发器)
│   ├── functions/ (1个函数)
│   ├── applications/
│   ├── tabs/ (48个标签页)
│   ├── pages/ (30个页面)
│   ├── services/
│   ├── translations/ (多国语言)
│   └── util/ (工具函数)
```

**其他典型服务**:
- service-metadata*/ (元数据相关)
- standard-object-database/ (数据库对象)
- standard-process-approval/ (流程审批)
- service-package-registry/ (包注册表)
- service-i18n/ (国际化)

### 2. 真实文件类型分析

#### ✅ 已验证的文件类型

| 文件类型 | 数量 | 示例 |
|---------|------|------|
| `.object.yml` | 60+ | tasks, notes, space_users_invite |
| `.button.yml` | 100+ | copy, delete_object, testConnection |
| `.trigger.yml` | 2+ | objects_set_default... |
| `.function.yml` | 2+ | space_users_invite_token |
| `.tab.yml` | 48+ | admin_apps, core_tasks |
| `.service.js` | 10+ | package.service.js (Moleculer) |
| `page` 文件 | 30+ | (动态页面定义) |

#### ❌ 未发现的文件类型

- **`.field.yml`** 独立文件 - 字段总是内嵌在对象定义中
- 单独的字段定义文件不存在，所有字段都在 `.object.yml` 的 `fields:` 部分

### 3. 必填字段总结

#### 对象 (.object.yml)
```yaml
name: object_name              # ✅ 必填 (唯一必填字段)
label: "Display Name"          # 推荐
icon: "icon_name"              # 推荐
fields:                        # 推荐
  field_name:
    type: text
permission_set:                # 推荐
```

#### 字段定义 (内嵌)
```yaml
type: text                     # ✅ 必填
label: "Field Name"            # 推荐
reference_to: users            # lookup 时必填
multiple: true                 # lookup 时推荐
```

#### 触发器 (.trigger.yml)
```yaml
name: trigger_name             # ✅ 必填
listenTo: object_name          # ✅ 必填
when:                          # ✅ 必填 (数组)
  - afterInsert
handler: |                     # ✅ 必填 (JavaScript)
  // code
authentication_type: none      # 推荐
```

#### 函数 (.function.yml)
```yaml
name: function_name            # ✅ 必填
objectApiName: space_users     # ✅ 必填
script: >-                     # ✅ 必填 (JavaScript)
  // code
isEnabled: true                # 推荐
is_rest: true                  # 推荐
```

#### 按钮 (.button.yml)
```yaml
name: button_name              # ✅ 必填
label: "Button Label"          # 推荐
'on': record                   # 推荐 (record/list/record_only/list_only)
visible: true                  # 推荐
type: amis_button              # 推荐
```

#### 服务 (.service.js)
```javascript
module.exports = {
    name: 'service-name',      # ✅ 必填
    namespace: 'steedos',      # 推荐
    dependencies: [],          # 推荐
    methods: {},               # 推荐
    // ...
}
```

### 4. 真实示例代码段

#### Lookup 字段 - 动态引用
```yaml
related_to:
  label: Related Object Record
  type: lookup
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
```

#### Trigger 中的 objects 接口
```javascript
handler: |
  const { doc, userId, spaceId} = ctx.params;
  const user = await ctx.getUser(userId, spaceId);
  
  // 使用 objects 接口
  await objects.object_fields.insert({
      object: doc.name,
      owner: userId,
      name: "name",
      type: "text",
      required: true,
  }, user);
```

#### Function 中的全局变量
```javascript
script: >-
  // Available: _, moment, validator, objects, ctx
  const userSession = await ctx.getUser(ctx.params.userId, ctx.params.spaceId);
  
  const records = await objects.space_users_invite.find({
    filters: [['space','=', userSession.spaceId]]
  });
  
  return { token: records[0]._id };
```

### 5. Skills 目录分析

#### ~/.agents/skills/ 中现有的 37+ skills

包括：
- ✅ Steedos 特定技能（30+）: steedos-objects, steedos-object-fields, steedos-object-triggers 等
- ✅ 通用工具: find-skills, frontend-design
- ❌ **验证/简化/Lint 类型的 skill 不存在**

#### 建议创建的 Skill

基于当前 skills 列表，缺少以下功能性 skills：
1. **steedos-package-validator** - 验证包结构和规范
2. **steedos-package-linter** - Lint 规范文件
3. **steedos-metadata-simplifier** - 简化元数据定义

### 6. 关键发现

#### ✅ 确认的规范

1. **命名约定**
   - 对象名: snake_case (tasks, space_users_invite)
   - 字段名: snake_case (due_date, assigned_to)
   - 触发器名: snake_case_trigger (objects_set_default_object_properties_trigger)
   - 函数名: snake_case (space_users_invite_token)
   - 按钮名: snake_case 或 camelCase (testConnection, delete_object)

2. **文件位置约定**
   - 对象: `main/default/objects/{name}.object.yml`
   - 触发器: `main/default/triggers/{name}.trigger.yml`
   - 函数: `main/default/functions/{name}.function.yml`
   - 按钮: `main/default/objects/{objectName}/buttons/{name}.button.yml`
   - 标签页: `main/default/tabs/{name}.tab.yml`

3. **YAML 特殊语法**
   - JavaScript 函数: `!<tag:yaml.org,2002:js/function> |-`
   - 多行字符串: `>-` (保留换行)
   - 函数字面量: `!!js/function |`

4. **权限模型**
   - 标准权限集: user 和 admin
   - 基本权限: allowCreate, allowDelete, allowEdit, allowRead
   - 高级权限: modifyAllRecords, viewAllRecords

#### ⚠️ 需要注意的地方

1. **字段定义必须内嵌** - 不存在独立的 `.field.yml` 文件
2. **Reference 可以是函数** - lookup 的 reference_to 可以是动态函数
3. **Handler 是纯 JavaScript** - 使用标准 JS async/await 语法
4. **Context 对象提供访问** - ctx.getUser(), ctx.params 等关键接口
5. **Objects 命名空间** - 在 trigger 和 function 中都有 objects 全局对象

### 7. 规范检验清单

当创建验证工具时，应该检查：

✅ **对象文件验证**
- [ ] 文件名格式: `{name}.object.yml`
- [ ] 必填字段: name
- [ ] name 为蛇形命名
- [ ] 字段都在 fields: 下
- [ ] 每个字段有 type
- [ ] lookup 字段有 reference_to
- [ ] permission_set 格式正确

✅ **触发器验证**
- [ ] 文件名格式: `{name}.trigger.yml`
- [ ] 必填字段: name, listenTo, when
- [ ] when 是数组格式
- [ ] handler 是有效 JavaScript
- [ ] authentication_type: none

✅ **函数验证**
- [ ] 文件名格式: `{name}.function.yml`
- [ ] 必填字段: name, objectApiName, script
- [ ] script 是有效 JavaScript
- [ ] 能访问 objects, ctx, _, moment 等

✅ **按钮验证**
- [ ] 文件名格式: `{name}.button.yml`
- [ ] 必填字段: name
- [ ] on 值有效
- [ ] amis_button 类型有 amis_schema

✅ **服务验证**
- [ ] 导出对象
- [ ] 必填字段: name, namespace
- [ ] 有 dependencies 数组
- [ ] 有 methods, actions, events 等

---

## 📝 建议后续工作

1. **创建 steedos-package-validator skill**
   - 验证包结构
   - 检查必填字段
   - 检查命名约定

2. **创建 steedos-package-linter skill**
   - 检查最佳实践
   - 建议改进
   - 检查兼容性

3. **创建 steedos-metadata-simplifier skill**
   - 移除冗余字段
   - 简化重复结构
   - 优化格式

4. **文档完善**
   - 补充更多字段类型示例
   - 添加常见错误
   - 提供迁移指南

---

**参考文件位置**:
- 本参考: `STEEDOS_SPEC_REFERENCE.md`
- 真实包位置: `~/GitHub/steedos-platform/services/service-core-objects/`
- Skills 位置: `~/.agents/skills/` 和 `~/.claude/skills/`

