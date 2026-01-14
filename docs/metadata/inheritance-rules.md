# 元数据继承和覆盖规则

## 概述

Steedos 平台支持强大的元数据继承和覆盖机制，允许在不同的软件包中扩展和定制已有的元数据。这种机制使得您可以：

- 在新包中扩展标准对象
- 覆盖现有字段的属性
- 添加新字段到现有对象
- 定制权限和布局

## 软件包依赖和加载顺序

### 软件包结构

Steedos 平台中的软件包按依赖关系组织：

```
standard-objects (基础包)
    ↓
custom-package (自定义包)
    ↓
customer-package (客户定制包)
```

### 加载顺序

系统启动时，元数据按以下顺序加载：

1. **扫描软件包** - 扫描所有软件包目录
2. **解析依赖关系** - 分析包之间的依赖关系
3. **按序加载** - 按依赖顺序加载元数据
4. **合并元数据** - 根据继承规则合并同名元数据

## 对象继承规则

### 基本继承原则

当多个软件包中定义了相同名称的对象时，系统会自动合并这些定义：

**基础包** (`standard-objects/accounts.object.yml`):
```yaml
name: accounts
label: 业务伙伴
fields:
  name:
    type: text
    label: 名称
    required: true
  phone:
    type: text
    label: 电话
```

**扩展包** (`custom-package/accounts.object.yml`):
```yaml
name: accounts
fields:
  industry:
    type: select
    label: 行业
    options:
      - label: IT
        value: it
      - label: 制造业
        value: manufacturing
  email:
    type: email
    label: 邮箱
```

**合并结果**:
```yaml
name: accounts
label: 业务伙伴  # 保留基础包的 label
fields:
  name:
    type: text
    label: 名称
    required: true
  phone:
    type: text
    label: 电话
  industry:           # 新增字段
    type: select
    label: 行业
    options:
      - label: IT
        value: it
      - label: 制造业
        value: manufacturing
  email:              # 新增字段
    type: email
    label: 邮箱
```

### 对象属性覆盖

后加载的包可以覆盖先加载包的对象属性：

**基础包**:
```yaml
name: custom_object
label: 自定义对象
enable_search: false
enable_files: false
```

**扩展包**:
```yaml
name: custom_object
label: 定制对象        # 覆盖 label
enable_search: true    # 覆盖 enable_search
enable_files: true     # 覆盖 enable_files
```

**合并结果**:
```yaml
name: custom_object
label: 定制对象        # 使用扩展包的值
enable_search: true    # 使用扩展包的值
enable_files: true     # 使用扩展包的值
```

## 字段继承规则

### 添加新字段

在扩展包中直接添加新字段：

```yaml
name: accounts
fields:
  custom_field:
    type: text
    label: 自定义字段
```

### 覆盖字段属性

覆盖已有字段的特定属性：

**基础包**:
```yaml
name: accounts
fields:
  phone:
    type: text
    label: 电话
    required: false
    hidden: true
```

**扩展包**:
```yaml
name: accounts
fields:
  phone:
    required: true      # 只覆盖 required 属性
    label: 联系电话     # 覆盖 label 属性
    visible_on: '{{true}}'  # 将隐藏字段设为显示
```

**合并结果**:
```yaml
name: accounts
fields:
  phone:
    type: text          # 保留原值
    label: 联系电话     # 使用新值
    required: true      # 使用新值
    hidden: true        # 保留原值
    visible_on: '{{true}}'  # 新增属性，控制字段显示
```

**字段可见性控制**:
- 字段的显示/隐藏主要通过 `visible_on` 属性控制
- 如果需要将隐藏字段改为显示，添加 `visible_on: '{{true}}'`
- 如果已有 `visible_on` 配置，需要修改其表达式而非添加新的
- `hidden` 属性和 `visible_on` 可以同时存在，`visible_on` 优先级更高
```

**扩展包**:
```yaml
name: accounts
fields:
  phone:
    required: true      # 只覆盖 required 属性
    label: 联系电话     # 覆盖 label 属性
```

**合并结果**:
```yaml
name: accounts
fields:
  phone:
    type: text          # 保留原值
    label: 联系电话     # 使用新值
    required: true      # 使用新值
```

### 字段属性合并规则

| 属性类型 | 合并规则 | 说明 |
|---------|---------|------|
| 简单类型 (String, Number, Boolean) | 完全覆盖 | 后加载的值覆盖先加载的值 |
| 数组类型 (Array) | 追加合并 | 后加载的值追加到数组末尾 |
| 对象类型 (Object) | 深度合并 | 递归合并对象属性 |

**数组合并示例**:

**基础包**:
```yaml
name: accounts
fields:
  status:
    type: select
    options:
      - label: 活跃
        value: active
      - label: 停用
        value: inactive
```

**扩展包**:
```yaml
name: accounts
fields:
  status:
    options:
      - label: 待审核
        value: pending
```

**合并结果**:
```yaml
name: accounts
fields:
  status:
    type: select
    options:
      - label: 活跃
        value: active
      - label: 停用
        value: inactive
      - label: 待审核    # 追加新选项
        value: pending
```

## 列表视图继承规则

### 添加新视图

```yaml
name: accounts
list_views:
  custom_view:
    label: 自定义视图
    columns: [name, phone, email]
    filters: [['status', '=', 'active']]
```

### 覆盖已有视图

**基础包**:
```yaml
name: accounts
list_views:
  all:
    label: 所有
    columns: [name, phone]
```

**扩展包**:
```yaml
name: accounts
list_views:
  all:
    label: 所有记录       # 覆盖 label
    columns: [name, phone, email]  # 覆盖 columns
```

## 权限继承规则

### 权限合并

权限设置采用**最小权限原则**进行合并：

**基础包**:
```yaml
name: sales_user
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
```

**扩展包**:
```yaml
name: sales_user
object_permissions:
  accounts:
    allowDelete: false    # 收回删除权限
```

**合并结果**:
```yaml
name: sales_user
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false    # 使用更严格的权限
```

## 触发器继承规则

### 触发器不合并

触发器采用**完全覆盖**策略，后加载的触发器会完全替换先加载的同名触发器。

**基础包** (`accounts.trigger.js`):
```javascript
module.exports = {
  listenTo: 'accounts',
  beforeInsert: async function() {
    // 基础逻辑
  }
};
```

**扩展包** (`accounts.trigger.js`):
```javascript
module.exports = {
  listenTo: 'accounts',
  beforeInsert: async function() {
    // 这会完全替换基础包的 beforeInsert
  },
  afterInsert: async function() {
    // 新增的触发器
  }
};
```

### 多个触发器文件

可以使用不同的文件名定义多个触发器：

```
triggers/
  ├── accounts_validation.trigger.js
  ├── accounts_notification.trigger.js
  └── accounts_workflow.trigger.js
```

## 应用继承规则

### 对象列表合并

应用中的对象列表会自动合并：

**基础包**:
```yaml
_id: sales
objects:
  - accounts
  - contacts
```

**扩展包**:
```yaml
_id: sales
objects:
  - sales_order
  - products
```

**合并结果**:
```yaml
_id: sales
objects:
  - accounts
  - contacts
  - sales_order    # 追加
  - products       # 追加
```

## 布局继承规则

### 区块合并

布局的区块（sections）会按名称合并：

**基础包**:
```yaml
name: accounts_default
sections:
  - label: 基本信息
    fields: [name, phone]
```

**扩展包**:
```yaml
name: accounts_default
sections:
  - label: 基本信息
    fields: [email]      # 追加到同名区块
  - label: 扩展信息
    fields: [industry]   # 新增区块
```

## 继承最佳实践

### 1. 明确包的依赖关系

在 `package.json` 中声明依赖：

```json
{
  "name": "custom-package",
  "dependencies": {
    "@steedos/standard-objects": "^2.0.0"
  }
}
```

### 2. 使用描述性包名

```
standard-objects/    # 标准对象包
crm-extension/       # CRM 扩展包
customer-custom/     # 客户定制包
```

### 3. 最小化覆盖范围

只覆盖需要修改的属性，保留其他默认值：

```yaml
# 推荐：只覆盖需要的属性
name: accounts
fields:
  phone:
    required: true

# 不推荐：重复定义所有属性
name: accounts
fields:
  phone:
    type: text
    label: 电话
    required: true
```

### 4. 文档化定制内容

在扩展包中添加注释说明定制原因：

```yaml
name: accounts
# 为满足客户需求，添加行业字段
fields:
  industry:
    type: select
    label: 行业
```

### 5. 避免循环依赖

确保包之间没有循环依赖关系：

```
# 错误：循环依赖
package-a → package-b
package-b → package-a

# 正确：单向依赖
package-a → package-b → standard-objects
```

## 继承调试

### 查看合并后的元数据

使用 API 查看最终合并的元数据：

```javascript
// 获取对象定义
const objectMeta = await broker.call('metadata.getObject', {
  objectName: 'accounts'
});
console.log(objectMeta);
```

### 元数据重载

修改元数据后重新加载：

```bash
# 调用重载 API
curl -X POST http://localhost:5000/api/metadata/reload
```

### 调试日志

启用调试日志查看加载过程：

```bash
# 设置环境变量
export DEBUG=metadata:*
```

## 常见问题

### Q: 为什么我的字段没有显示？

A: 检查以下几点：
1. 字段是否在正确的对象下定义
2. 包的加载顺序是否正确
3. 是否需要重新加载元数据

### Q: 如何完全替换而不是合并？

A: 触发器使用完全替换策略。对于其他元数据，需要在扩展包中重新定义所有属性。

### Q: 多个包修改同一属性时如何确定优先级？

A: 按包的加载顺序，后加载的包优先级更高。

## 相关文档

- [元数据概述](./README.md)
- [元数据类型](./metadata-types.md)
- [对象元数据](./object-metadata.md)
- [对象服务](../object-service.md)
