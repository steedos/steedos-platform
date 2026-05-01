---
name: steedos-translations
description: |
  Steedos i18n: .translation.yml and .objectTranslation.yml files.
  TRIGGER: .translation.yml, .objectTranslation.yml files; Chinese/English
  labels for objects, fields, list views, buttons, select options, tab/app
  names; i18n/internationalization; translate field labels, help text,
  picklist options; naming conventions (en.translation.yml,
  zh-CN.objectTranslation.yml); label shows wrong language.
  SKIP: field definition → steedos-object-fields;
  object structure → steedos-objects; app/tab source config →
  steedos-applications / steedos-tabs.
---

# Steedos Translations | Steedos 国际化

## Overview | 概述

Steedos supports metadata-level internationalization through two types of translation files:

1. **Translation files** (`.translation.yml`) — translate application names, tab labels, and custom labels
2. **Object Translation files** (`.objectTranslation.yml`) — translate object labels, field labels, listview labels, action labels, and more

Steedos 通过两类翻译文件支持元数据级别的国际化：

1. **翻译文件** (`.translation.yml`) — 翻译应用名称、标签页标签和自定义标签
2. **对象翻译文件** (`.objectTranslation.yml`) — 翻译对象标签、字段标签、列表视图标签、操作标签等

## Supported Languages | 支持的语言

**⚠️ Language codes MUST be from the list below. Do NOT invent language codes.**

**⚠️ 语言代码必须为下表中的值，严禁编造。**

| Language Code | Language |
|---------------|----------|
| `en` | English |
| `zh-CN` | 简体中文 (Simplified Chinese) |

## File Types | 文件类型

---

## 1. Translation Files | 翻译文件

### File Format | 文件格式

- **Pattern**: `[namespace.]{lang}.translation.yml`
- **Location**: `main/default/translations/`
- **Examples**: `en.translation.yml`, `zh-CN.translation.yml`, `core.en.translation.yml`

### Naming Convention | 命名约定

| Format | Description |
|--------|-------------|
| `{lang}.translation.yml` | Default translation file for the package |
| `{namespace}.{lang}.translation.yml` | Namespaced translation file (e.g., `core.en.translation.yml`) |

### Structure | 结构

Translation files contain three top-level sections:

翻译文件包含三个顶层部分：

```yaml
CustomApplications:
  {app_code}:
    name: Application display name
    description: Application description
    groups:
      {group_key}: Group display name

CustomTabs:
  {tab_name}: Tab display name

CustomLabels:
  {label_key}: Label value
```

### Sections | 各部分说明

#### CustomApplications

Translate application names, descriptions, and admin menu group labels.

翻译应用名称、描述和管理菜单分组标签。

```yaml
CustomApplications:
  admin:
    name: Setup
    description: Manage company, users, permissions and so on.
    groups:
      personal_settings: Personal Settings
      company_settings: Company Settings
      object_settings: Object Settings
      development: Development
      process_automation: Process Automation
```

Chinese version:

```yaml
CustomApplications:
  admin:
    name: 设置
    description: 管理员设置公司、人员、权限等。
    groups:
      personal_settings: 个人设置
      company_settings: 公司设置
      object_settings: 对象设置
      development: 开发
      process_automation: 流程自动化
```

#### CustomTabs

Translate tab display labels. The key is the tab `name` (matching the `.tab.yml` file name).

翻译标签页显示标签。键为标签页的 `name`（对应 `.tab.yml` 文件名）。

```yaml
CustomTabs:
  admin_space_users: Users
  admin_permission_set: Profiles & Permission Sets
  admin_objects: Objects
  admin_pages: Custom Pages
  admin_tabs: Tabs
  admin_audit_records: Audit Records
  admin_api_keys: API Keys
```

Chinese version:

```yaml
CustomTabs:
  admin_space_users: 人员
  admin_permission_set: 简档 & 权限集
  admin_objects: 对象
  admin_pages: 微页面
  admin_tabs: 选项卡
  admin_audit_records: 审计日志
  admin_api_keys: API Key
```

#### CustomLabels

Custom labels for UI text, error messages, button labels, and other translatable strings. Can use template variables with `{$variableName}` syntax.

自定义标签用于 UI 文本、错误消息、按钮标签和其他可翻译字符串。可使用 `{$variableName}` 语法的模板变量。

```yaml
CustomLabels:
  menu_account: My Account
  menu_organizations: Departments
  menu_apps: Apps
  menu_steedos_packages: Packages
  delete_required_lookup_record_error: "Your attempt to delete could not be completed because it is associated with the following {$objectLabel}: {$recordName}"
```

Chinese version:

```yaml
CustomLabels:
  menu_account: 个人设置
  menu_organizations: 部门
  menu_apps: 应用程序
  menu_steedos_packages: 软件包
  delete_required_lookup_record_error: "无法完成您对当前记录的删除尝试，因为它与以下{$objectLabel}关联。：{$recordName}"
```

### Complete Translation File Example | 完整翻译文件示例

**`en.translation.yml`**:

```yaml
CustomApplications:
  contract_management:
    name: Contract Management
    description: Manage contracts and agreements
    groups:
      contracts: Contracts
      settings: Settings
CustomTabs:
  object_contract: Contracts
  object_customer: Customers
  contract_dashboard: Dashboard
CustomLabels:
  contract_expired_warning: "Contract {$contractName} has expired"
  contract_status_active: Active
  contract_status_expired: Expired
```

**`zh-CN.translation.yml`**:

```yaml
CustomApplications:
  contract_management:
    name: 合同管理
    description: 管理合同和协议
    groups:
      contracts: 合同
      settings: 设置
CustomTabs:
  object_contract: 合同
  object_customer: 客户
  contract_dashboard: 仪表板
CustomLabels:
  contract_expired_warning: "合同 {$contractName} 已过期"
  contract_status_active: 有效
  contract_status_expired: 已过期
```

---

## 2. Object Translation Files | 对象翻译文件

### File Format | 文件格式

- **Pattern**: `{objectName}.{lang}.objectTranslation.yml`
- **Location**: `main/default/objectTranslations/{objectName}.{lang}/`
- **Directory naming**: Each object+language pair has its own directory

### Directory Structure | 目录结构

```
main/default/objectTranslations/
├── contracts.en/
│   └── contracts.en.objectTranslation.yml
├── contracts.zh-CN/
│   └── contracts.zh-CN.objectTranslation.yml
├── customers.en/
│   └── customers.en.objectTranslation.yml
└── customers.zh-CN/
    └── customers.zh-CN.objectTranslation.yml
```

### Structure | 结构

```yaml
name: object_api_name
label: Object display name
description: Object description
fields:
  {field_name}:
    label: Field display name
    help: Field help text
    description: Field description
    options:                        # For select/picklist fields
      - label: Option display name
        value: option_value
groups:
  {group_name}: Group display name
listviews:
  {view_name}:
    label: View display name
actions:
  {action_name}:
    label: Action display name
CustomLabels:
  {label_key}: Label value
```

### Sections | 各部分说明

#### Object Label | 对象标签

```yaml
name: contracts
label: Contracts
description: Contract records
```

Chinese:

```yaml
name: contracts
label: 合同
description: 合同记录
```

#### Fields | 字段

Translate field labels, help text, descriptions, and picklist option labels.

翻译字段标签、帮助文本、描述和下拉选项标签。

```yaml
fields:
  name:
    label: Contract Name
    help: Enter the official contract name
    description: The legal name of the contract
  status:
    label: Status
    help: Current contract status
    description: 
    options:
      - label: Draft
        value: draft
      - label: Active
        value: active
      - label: Expired
        value: expired
      - label: Terminated
        value: terminated
  amount:
    label: Amount
    help: 
    description: Total contract amount
  customer:
    label: Customer
    help: 
    description: 
```

Chinese:

```yaml
fields:
  name:
    label: 合同名称
    help: 请输入正式合同名称
    description: 合同的法律名称
  status:
    label: 状态
    help: 当前合同状态
    description: 
    options:
      - label: 草稿
        value: draft
      - label: 有效
        value: active
      - label: 已过期
        value: expired
      - label: 已终止
        value: terminated
  amount:
    label: 金额
    help: 
    description: 合同总金额
  customer:
    label: 客户
    help: 
    description: 
```

#### Groups | 字段分组

Translate field group labels (groups defined in `.object.yml`).

翻译字段分组标签（分组在 `.object.yml` 中定义）。

```yaml
groups:
  basic_info: Basic Information
  financial: Financial Details
  system_information: System Information
```

Chinese:

```yaml
groups:
  basic_info: 基本信息
  financial: 财务详情
  system_information: 系统信息
```

#### List Views | 列表视图

```yaml
listviews:
  all:
    label: All Contracts
  recent:
    label: Recently Viewed
  active:
    label: Active Contracts
  expired:
    label: Expired Contracts
```

Chinese:

```yaml
listviews:
  all:
    label: 所有合同
  recent:
    label: 最近查看
  active:
    label: 有效合同
  expired:
    label: 已过期合同
```

#### Actions | 操作

Translate button/action labels. Includes both standard and custom actions.

翻译按钮/操作标签。包括标准操作和自定义操作。

```yaml
actions:
  standard_new:
    label: New
  standard_edit:
    label: Edit
  standard_delete:
    label: Delete
  standard_query:
    label: Search
  approve:
    label: Submit for Approval
  renew:
    label: Renew Contract
```

Chinese:

```yaml
actions:
  standard_new:
    label: 新建
  standard_edit:
    label: 编辑
  standard_delete:
    label: 删除
  standard_query:
    label: 查找
  approve:
    label: 提交审批
  renew:
    label: 续签合同
```

#### CustomLabels (Object-Scoped) | 对象级自定义标签

Custom labels that are scoped to a specific object.

作用于特定对象的自定义标签。

```yaml
CustomLabels:
  contract_cannot_delete: "Cannot delete contract in active status"
  contract_amount_exceeded: "Contract amount exceeds budget limit"
```

Chinese:

```yaml
CustomLabels:
  contract_cannot_delete: "无法删除有效状态的合同"
  contract_amount_exceeded: "合同金额超出预算限额"
```

### Complete Object Translation Example | 完整对象翻译示例

**`contracts.en/contracts.en.objectTranslation.yml`**:

```yaml
name: contracts
label: Contract
description: Contract management
fields:
  name:
    label: Contract Name
    help: Enter the official contract name
    description: 
  status:
    label: Status
    help: 
    description: 
    options:
      - label: Draft
        value: draft
      - label: Active
        value: active
      - label: Expired
        value: expired
  amount:
    label: Amount
    help: 
    description: 
  customer:
    label: Customer
    help: 
    description: 
  start_date:
    label: Start Date
    help: 
    description: 
  end_date:
    label: End Date
    help: 
    description: 
groups:
  basic_info: Basic Information
  financial: Financial Details
listviews:
  all:
    label: All Contracts
  recent:
    label: Recently Viewed
  active:
    label: Active Contracts
actions:
  standard_new:
    label: New
  standard_edit:
    label: Edit
  standard_delete:
    label: Delete
  approve:
    label: Submit for Approval
  renew:
    label: Renew
CustomLabels:
  contract_expired_notify: "This contract expired on {$date}"
```

**`contracts.zh-CN/contracts.zh-CN.objectTranslation.yml`**:

```yaml
name: contracts
label: 合同
description: 合同管理
fields:
  name:
    label: 合同名称
    help: 请输入正式合同名称
    description: 
  status:
    label: 状态
    help: 
    description: 
    options:
      - label: 草稿
        value: draft
      - label: 有效
        value: active
      - label: 已过期
        value: expired
  amount:
    label: 金额
    help: 
    description: 
  customer:
    label: 客户
    help: 
    description: 
  start_date:
    label: 开始日期
    help: 
    description: 
  end_date:
    label: 结束日期
    help: 
    description: 
groups:
  basic_info: 基本信息
  financial: 财务详情
listviews:
  all:
    label: 所有合同
  recent:
    label: 最近查看
  active:
    label: 有效合同
actions:
  standard_new:
    label: 新建
  standard_edit:
    label: 编辑
  standard_delete:
    label: 删除
  approve:
    label: 提交审批
  renew:
    label: 续签
CustomLabels:
  contract_expired_notify: "该合同已于 {$date} 过期"
```

---

## File Locations | 文件位置

```
steedos-packages/
└── my-package/
    └── main/
        └── default/
            ├── translations/
            │   ├── en.translation.yml
            │   └── zh-CN.translation.yml
            └── objectTranslations/
                ├── contracts.en/
                │   └── contracts.en.objectTranslation.yml
                ├── contracts.zh-CN/
                │   └── contracts.zh-CN.objectTranslation.yml
                ├── customers.en/
                │   └── customers.en.objectTranslation.yml
                └── customers.zh-CN/
                    └── customers.zh-CN.objectTranslation.yml
```

## Standard Actions | 标准操作

These standard action names are used across all objects. Always provide translations for them.

这些标准操作名在所有对象中通用。始终为它们提供翻译。

| Action Key | English | 中文 |
|------------|---------|------|
| `standard_new` | New | 新建 |
| `standard_edit` | Edit | 编辑 |
| `standard_delete` | Delete | 删除 |
| `standard_delete_many` | Delete | 删除 |
| `standard_query` | Search | 查找 |
| `standard_open_view` | View | 查看 |
| `standard_approve` | Submit for Approval | 发起审批 |
| `standard_view_instance` | View Approval | 查看审批单 |
| `standard_follow` | Follow | 关注 |
| `standard_submit_for_approval` | Submit for Approval | 提请批准 |
| `standard_import_data` | Import Data | 导入数据 |
| `standard_export_excel` | Export | 导出 |
| `standard_print` | Print | 打印 |
| `standard_create_instance` | Apply | 申请 |

## Best Practices | 最佳实践

### 1. Always Create Both Languages

For every metadata file, create both `en` and `zh-CN` translations.

对每个元数据文件，始终创建 `en` 和 `zh-CN` 两种翻译。

### 2. Keep Translations Consistent

Use the same terminology across all translation files.

在所有翻译文件中使用一致的术语。

### 3. Translate Picklist Options

Always translate picklist/select field options — they appear directly in the UI.

始终翻译下拉选择字段的选项 — 它们直接显示在界面中。

```yaml
fields:
  priority:
    label: 优先级
    options:
      - label: 高
        value: high
      - label: 中
        value: medium
      - label: 低
        value: low
```

### 4. Include Help Text

Provide meaningful help text for complex fields.

为复杂字段提供有意义的帮助文本。

```yaml
fields:
  formula_field:
    label: 计算金额
    help: 此字段根据数量和单价自动计算，无需手动填写
    description: 
```

### 5. Translate All Listviews and Actions

Don't forget listviews and custom action labels.

不要忘记翻译列表视图和自定义操作标签。

### 6. Use CustomLabels for Dynamic Messages

Use `{$variable}` template syntax for messages that include dynamic data.

使用 `{$variable}` 模板语法用于包含动态数据的消息。

```yaml
CustomLabels:
  record_created_success: "Record {$recordName} created successfully"
  validation_min_amount: "Amount must be greater than {$minAmount}"
```

## Troubleshooting | 故障排除

### Issue: Translation not appearing

**Solutions**:
1. Verify file naming matches the pattern exactly (e.g., `contracts.zh-CN.objectTranslation.yml`)
2. Check the directory name matches (e.g., `contracts.zh-CN/`)
3. Ensure the `name` field in objectTranslation matches the object API name
4. Restart server after adding translation files

### Issue: Picklist options not translated

**Solutions**:
1. The `value` must match exactly between translation and object field definition
2. Provide options in the same order as defined in the field

### Issue: CustomLabels not resolving

**Solutions**:
1. Check the label key matches exactly (case-sensitive)
2. Verify template variables use `{$variableName}` format
3. Ensure the translation file is loaded (check server logs)

## References | 参考资料

- [Objects](../objects/SKILL.md) — object definitions that need translations
- [Object Fields](../object-fields/SKILL.md) — field types and configurations
- [Object List Views](../object-list-views/SKILL.md) — listview definitions
- [Applications](../applications/SKILL.md) — application definitions
- [Tabs](../tabs/SKILL.md) — tab definitions
