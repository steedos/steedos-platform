# 权限配置详细说明

## 概述

Steedos 平台提供灵活的权限管理机制，支持对象级权限、字段级权限、记录级权限等多个层次的权限控制。

## 权限层次

```
用户 (User)
  ↓
简档 (Profile) / 权限集 (Permission Set)
  ↓
对象权限 (Object Permissions)
  ↓
字段权限 (Field Permissions)
  ↓
记录权限 (Record Permissions)
```

## 权限集 (Permission Set)

### 权限集文件格式

```yaml
# permissionsets/permissionset_name.permissionset.yml
name: permissionset_name
label: 权限集标签
license: platform
object_permissions:
  object_name:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: false
    modifyAllRecords: false
field_permissions:
  object_name.field_name:
    readable: true
    editable: false
```

### 权限集属性

| 属性 | 类型 | 说明 |
|------|------|------|
| name | String | 权限集 API 名称 |
| label | String | 权限集显示名称 |
| license | String | 许可证类型 |
| object_permissions | Object | 对象权限配置 |
| field_permissions | Object | 字段权限配置 |

## 对象权限

### 对象权限类型

```yaml
object_permissions:
  sales_order:
    # 基本权限
    allowCreate: true      # 创建权限
    allowRead: true        # 读取权限
    allowEdit: true        # 编辑权限
    allowDelete: false     # 删除权限
    
    # 扩展权限
    viewAllRecords: false  # 查看所有记录
    modifyAllRecords: false # 修改所有记录
    
    # 其他权限
    allowCreateEdit: true   # 创建和编辑
    allowReadEdit: true     # 读取和编辑
    viewCompanyRecords: false # 查看分部记录
    modifyCompanyRecords: false # 修改分部记录
```

### 权限说明

| 权限 | 说明 | 影响范围 |
|------|------|---------|
| allowCreate | 允许创建新记录 | 用户可以创建新记录 |
| allowRead | 允许读取记录 | 用户可以查看记录 |
| allowEdit | 允许编辑记录 | 用户可以编辑自己拥有的记录 |
| allowDelete | 允许删除记录 | 用户可以删除自己拥有的记录 |
| viewAllRecords | 查看所有记录 | 用户可以查看所有记录，不受所有者限制 |
| modifyAllRecords | 修改所有记录 | 用户可以编辑和删除所有记录 |

### 对象权限示例

#### 基本用户权限

```yaml
name: standard_user
label: 标准用户
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false    # 只能看自己的记录
    modifyAllRecords: false
  
  contacts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false
    modifyAllRecords: false
```

#### 管理员权限

```yaml
name: system_admin
label: 系统管理员
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true     # 可以看所有记录
    modifyAllRecords: true   # 可以修改所有记录
  
  contacts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
```

#### 只读用户权限

```yaml
name: read_only_user
label: 只读用户
object_permissions:
  accounts:
    allowCreate: false
    allowRead: true
    allowEdit: false
    allowDelete: false
    viewAllRecords: true     # 可以看所有记录
    modifyAllRecords: false
  
  reports:
    allowCreate: false
    allowRead: true
    allowEdit: false
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false
```

## 字段权限

### 字段权限配置

```yaml
field_permissions:
  # 格式：object_name.field_name
  accounts.revenue:
    readable: true          # 可读
    editable: true          # 可编辑
  
  accounts.credit_limit:
    readable: true
    editable: false         # 只读
  
  accounts.internal_notes:
    readable: false         # 不可见
    editable: false
```

### 字段权限说明

| 权限 | 说明 |
|------|------|
| readable: true | 字段可见，用户可以查看字段值 |
| readable: false | 字段不可见，用户看不到字段 |
| editable: true | 字段可编辑，用户可以修改字段值 |
| editable: false | 字段只读，用户可以看到但不能修改 |

### 字段权限示例

#### 销售人员权限

```yaml
name: sales_representative
label: 销售代表
field_permissions:
  # 客户对象
  accounts.name:
    readable: true
    editable: true
  
  accounts.revenue:
    readable: true
    editable: false        # 只读，不能修改收入
  
  accounts.credit_rating:
    readable: false        # 不可见
    editable: false
  
  # 订单对象
  sales_orders.amount:
    readable: true
    editable: true
  
  sales_orders.discount:
    readable: true
    editable: false        # 不能修改折扣
  
  sales_orders.cost:
    readable: false        # 看不到成本
    editable: false
```

#### 财务人员权限

```yaml
name: finance_user
label: 财务人员
field_permissions:
  accounts.revenue:
    readable: true
    editable: true         # 可以修改收入
  
  accounts.credit_limit:
    readable: true
    editable: true
  
  accounts.credit_rating:
    readable: true
    editable: true         # 可以看到和修改信用评级
  
  sales_orders.cost:
    readable: true         # 可以看到成本
    editable: true
  
  sales_orders.discount:
    readable: true
    editable: true         # 可以修改折扣
```

## 记录级权限

### 所有者规则

默认情况下，用户可以访问：
1. 自己创建的记录（owner = 当前用户）
2. 共享给自己的记录
3. 所属下级用户创建的记录（如果启用角色层次）

### 共享规则

#### 手动共享

```javascript
// 通过 API 共享记录
await broker.call('objectql.shareRecord', {
  objectName: 'accounts',
  recordId: 'xxx',
  userIds: ['user1', 'user2'],
  shareType: 'read' // read, edit
});
```

#### 共享规则配置

```yaml
# 在对象中定义共享规则
name: accounts
enable_share: true    # 启用共享功能

sharing_rules:
  - name: team_sharing
    label: 团队共享
    shared_to:
      type: users
      users: ['{manager}']
    access_level: read
```

### 角色层次

通过角色层次，上级可以访问下级的记录：

```
销售总监
  ↓
销售经理
  ↓
销售代表
```

销售总监可以看到销售经理和销售代表的记录。

## 权限继承

### 权限集继承

```yaml
# 基础权限集
name: base_user
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
```

```yaml
# 扩展权限集（在用户上叠加多个权限集）
name: sales_permissions
object_permissions:
  sales_orders:
    allowCreate: true
    allowRead: true
    allowEdit: true
```

用户可以拥有多个权限集，权限取并集（最大权限）。

### 对象内权限继承

在对象定义中配置默认权限：

```yaml
name: custom_object
permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
  
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
```

## 权限计算规则

### 权限组合规则

用户的最终权限是以下几个来源的组合：

1. **Profile（简档）** - 基础权限
2. **Permission Sets（权限集）** - 附加权限
3. **Object Settings（对象设置）** - 对象级默认权限
4. **Sharing Rules（共享规则）** - 记录级权限
5. **Manual Sharing（手动共享）** - 单独共享

### 权限计算优先级

```
最严格（Least Privileged）
  ↓
Profile 权限
  ↓
Permission Set 权限（取并集）
  ↓
Object Permission（取并集）
  ↓
Record Sharing（取并集）
  ↓
最宽松（Most Privileged）
```

### 权限计算示例

**Profile 权限**:
```yaml
accounts:
  allowCreate: true
  allowRead: true
  allowEdit: false
  allowDelete: false
```

**Permission Set 权限**:
```yaml
accounts:
  allowEdit: true    # 增加编辑权限
```

**最终权限**（取并集）:
```yaml
accounts:
  allowCreate: true
  allowRead: true
  allowEdit: true    # ✓ 从 Permission Set 获得
  allowDelete: false
```

## 权限验证

### API 权限验证

```javascript
// 通过 userSession 参数启用权限验证
const records = await objects.accounts.find(
  {
    filters: [['status', '=', 'active']]
  },
  userSession  // 传入用户会话
);
```

### 触发器中验证权限

```javascript
module.exports = {
  beforeUpdate: async function() {
    const { userId, spaceId } = this;
    
    // 检查用户权限
    const hasPermission = await checkUserPermission(
      userId,
      spaceId,
      'accounts',
      'edit'
    );
    
    if (!hasPermission) {
      throw new Error('没有编辑权限');
    }
  }
};
```

## 特殊权限场景

### 批准流程权限

```yaml
name: approver
label: 批准人
object_permissions:
  approval_requests:
    allowCreate: false
    allowRead: true
    allowEdit: true      # 可以批准/拒绝
    allowDelete: false
```

### 报表查看权限

```yaml
name: report_viewer
label: 报表查看者
object_permissions:
  reports:
    allowCreate: false
    allowRead: true
    allowEdit: false
    allowDelete: false
    viewAllRecords: true  # 可以查看所有报表
```

### 临时权限提升

```javascript
// 在代码中使用管理员权限执行操作
const adminSession = {
  userId: 'admin',
  spaceId: spaceId,
  is_space_admin: true
};

await objects.accounts.update(
  recordId,
  { status: 'approved' },
  adminSession
);
```

## 权限最佳实践

### 1. 最小权限原则

只授予用户完成工作所需的最小权限：

```yaml
# 推荐：最小权限
name: data_entry
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false    # 不授予删除权限
    viewAllRecords: false
```

### 2. 使用权限集分层

```yaml
# 基础权限集
name: base_sales

# 专项权限集
name: discount_approval
name: price_override
```

### 3. 敏感字段权限控制

```yaml
field_permissions:
  accounts.bank_account:
    readable: false
    editable: false
  
  accounts.tax_id:
    readable: true
    editable: false     # 只读
```

### 4. 定期审查权限

- 定期检查用户权限配置
- 删除不再需要的权限集
- 审查具有高权限的用户

### 5. 文档化权限规则

在权限集文件中添加注释：

```yaml
# 销售经理权限集
# 用途：授予销售经理管理销售数据的权限
# 适用对象：销售经理及以上级别
name: sales_manager
label: 销售经理
```

## 常见问题

### Q: 用户看不到某些记录？

A: 检查以下几点：
1. 对象权限是否包含 allowRead
2. 是否需要 viewAllRecords 权限
3. 记录是否共享给该用户
4. 是否配置了过滤规则

### Q: 字段不可编辑？

A: 检查：
1. 字段权限 editable 设置
2. 字段是否设置为 readonly
3. 对象权限是否包含 allowEdit
4. 记录级权限是否允许编辑

### Q: 如何临时提升权限？

A: 在代码中使用管理员会话：
```javascript
const adminSession = { is_space_admin: true };
await objects.xxx.operation({...}, adminSession);
```

## 相关文档

- [元数据概述](./README.md)
- [对象元数据](./object-metadata.md)
- [元数据类型](./metadata-types.md)
- [用户和组织管理](../DEVELOPER_GUIDE.md)
