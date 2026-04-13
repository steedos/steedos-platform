# Steedos Applications | Steedos 应用程序

## Overview | 概述

A Steedos application is a container that groups related objects, pages, and functionality together. Applications appear in the navigation menu and provide organized access to features.

Steedos 应用程序是一个容器,将相关的对象、页面和功能组合在一起。应用程序显示在导航菜单中,提供对功能的有组织访问。

## File Format | 文件格式

- **File Extension**: `.app.yml`
- **Location**: `main/default/applications/`
- **Format**: YAML
- **Naming**: `[app_code].app.yml`

## Basic Structure | 基本结构

```yaml
name: Application Name
code: app_code
description: Application description
icon: icon_name
is_creator: true
objects:
  - object1
  - object2
visible: true
sort: 100
```

## Field Reference | 字段参考

### Required Fields | 必需字段

#### name (String)
Application display name shown in the UI.

```yaml
name: Contract Management
```

#### code (String)
Unique identifier for the application (API name).

```yaml
code: contracts
```

### Optional Fields | 可选字段

#### _id (String)
Explicit ID for the application. If not provided, uses `code`.

```yaml
_id: contracts
```

#### description (String)
Description of the application's purpose.

```yaml
description: Manage contracts and agreements
```

#### icon (String)
Icon name to display with the application.

```yaml
# Salesforce Lightning Design System icons
icon: contract
icon_slds: approval

# Custom icon
icon: custom_icon
```

#### icon_slds (String)
Salesforce Lightning icon name (alternative to `icon`).

```yaml
icon_slds: approval
```

#### is_creator (Boolean)
Whether this application uses the Creator UI framework.

```yaml
is_creator: true   # Modern UI
is_creator: false  # Classic UI
```

#### visible (Boolean)
Whether the application is visible in the app menu.

```yaml
visible: true   # Show in menu
visible: false  # Hide from menu
```

#### sort (Number)
Display order in the application menu (lower numbers first).

```yaml
sort: 100
```

#### objects (Array)
List of objects included in this application.

```yaml
objects:
  - contracts
  - contract_items
  - customers
```

#### mobile_objects (Array)
Objects available in mobile app (optional, defaults to `objects`).

```yaml
mobile_objects:
  - contracts
  - customers
```

## Complete Example | 完整示例

### Simple Application | 简单应用

```yaml
name: Task Management
code: tasks
description: Manage tasks and to-dos
icon: task
is_creator: true
objects:
  - tasks
visible: true
sort: 200
```

### Complex Application | 复杂应用

```yaml
_id: contract_management
name: Contract Management
code: contracts
description: Complete contract lifecycle management system
icon: contract
icon_slds: contract
is_creator: true
visible: true
sort: 100

# Desktop objects
objects:
  - contracts
  - contract_items
  - contract_templates
  - customers
  - contract_approvals

# Mobile objects (subset)
mobile_objects:
  - contracts
  - customers
  - contract_approvals

# Admin menu configuration
admin_menus:
  - _id: contract_settings
    name: Contract Settings
    sort: 100
    permission_sets:
      - admin
    object_name: contract_templates
    parent: contracts
```

## Advanced Features | 高级功能

### Admin Menus | 管理菜单

Applications can include admin menu items:

```yaml
admin_menus:
  - _id: settings_menu
    name: Settings
    sort: 100
    permission_sets:
      - admin
    object_name: settings_object
    parent: app_code

  - _id: reports_menu
    name: Reports
    sort: 200
    permission_sets:
      - admin
      - manager
    object_name: reports
```

**Admin Menu Fields:**
- `_id`: Unique identifier
- `name`: Display name
- `sort`: Display order
- `permission_sets`: Who can see it
- `object_name`: Associated object
- `parent`: Parent menu ID

### Tab Items | 标签项

Detailed tab configuration (alternative to `objects`):

```yaml
tab_items:
  - object: contracts
    sort: 100
    mobile: true

  - object: contract_items
    sort: 200
    mobile: false

  - page: custom_dashboard
    sort: 300
    mobile: true
```

### Landing Page | 落地页

Specify a landing page when opening the app:

```yaml
landing_page: custom_dashboard
```

## Application Types | 应用程序类型

### 1. Standard Application | 标准应用

For general business processes:

```yaml
name: Sales Management
code: sales
description: Sales pipeline and opportunities
icon: opportunity
is_creator: true
objects:
  - leads
  - opportunities
  - quotes
  - orders
visible: true
```

### 2. Admin Application | 管理应用

For system administration:

```yaml
name: System Administration
code: admin
description: System configuration and management
icon: settings
is_creator: false
visible: true
permission_sets:
  - admin
admin_menus:
  - _id: user_management
    name: Users
    object_name: users
  - _id: permissions
    name: Permissions
    object_name: permission_sets
```

### 3. Process Automation Application | 流程自动化应用

For workflows and automation:

```yaml
_id: process_automation
name: Process Automation
icon_slds: approval
is_creator: false
admin_menus:
  - _id: process_definition
    name: Approval Processes
    sort: 400
    permission_sets:
      - admin
    object_name: process_definition
    parent: process_automation
```

### 4. Dashboard Application | 仪表板应用

Analytics and reporting:

```yaml
name: Analytics Dashboard
code: analytics
description: Business intelligence and reporting
icon: dashboard
is_creator: true
landing_page: analytics_dashboard
objects:
  - reports
  - dashboards
visible: true
```

## Application Visibility & Permissions | 应用可见性和权限

### Basic Visibility

```yaml
visible: true   # All users can see
```

### Permission-Based Visibility

Use permission sets to control access:

```yaml
permission_sets:
  - admin
  - manager
```

### Programmatic Visibility

Use a function to determine visibility:

```yaml
visible: !<tag:yaml.org,2002:js/function> |-
  function() {
    const user = Creator.getUser();
    return user.profile === 'admin';
  }
```

## Icons | 图标

### Salesforce Lightning Icons

Use any Salesforce Lightning Design System icon:

```yaml
icon_slds: account
icon_slds: contract
icon_slds: approval
icon_slds: task
icon_slds: opportunity
icon_slds: dashboard
```

### Custom Icons

```yaml
icon: custom_icon_name
```

### Icon Resources

- [Salesforce Lightning Icons](https://www.lightningdesignsystem.com/icons/)
- Icons are referenced by name without prefixes

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/
        └── default/
            └── applications/
                ├── app1.app.yml
                ├── app2.app.yml
                └── admin.app.yml
```

## Best Practices | 最佳实践

### 1. Naming Conventions

```yaml
# Good
name: Contract Management
code: contracts

# Avoid
name: CM
code: cm_app
```

### 2. Object Organization

Group related objects:

```yaml
objects:
  # Core objects first
  - contracts
  - customers

  # Related objects
  - contract_items
  - contract_approvals

  # Configuration objects
  - contract_templates
```

### 3. Mobile Optimization

Only include essential objects in mobile:

```yaml
mobile_objects:
  - contracts      # Main object
  - customers      # Lookup reference
  - approvals      # Action required
  # Exclude: templates, settings
```

### 4. Sort Order

Use consistent sort values:

```yaml
# Primary apps: 100-199
sort: 100  # Main business app

# Secondary apps: 200-299
sort: 200  # Supporting app

# Admin apps: 900-999
sort: 900  # Administration
```

### 5. Icons

Choose meaningful icons:

```yaml
# Business apps
icon_slds: contract      # Contracts
icon_slds: opportunity   # Sales
icon_slds: account       # Customers

# System apps
icon_slds: settings      # Configuration
icon_slds: dashboard     # Analytics
```

## Common Patterns | 常见模式

### CRM Application

```yaml
name: Customer Relationship Management
code: crm
description: Manage customers, leads, and opportunities
icon_slds: opportunity
is_creator: true
objects:
  - accounts
  - contacts
  - leads
  - opportunities
  - quotes
mobile_objects:
  - accounts
  - contacts
  - opportunities
visible: true
sort: 100
```

### Project Management Application

```yaml
name: Project Management
code: projects
description: Track projects, tasks, and resources
icon_slds: task
is_creator: true
objects:
  - projects
  - tasks
  - milestones
  - time_entries
mobile_objects:
  - projects
  - tasks
visible: true
sort: 150
```

### HR Management Application

```yaml
name: Human Resources
code: hr
description: Employee and HR management
icon_slds: people
is_creator: true
objects:
  - employees
  - departments
  - positions
  - attendance
  - leave_requests
mobile_objects:
  - leave_requests
  - attendance
visible: true
sort: 200
permission_sets:
  - admin
  - hr_manager
```

## Internationalization | 国际化

### Bilingual Labels

```yaml
name: Contract Management
name_zh: 合同管理
description: Manage contracts and agreements
description_zh: 管理合同和协议
```

### Translation Files

Use translation files for better i18n support:

```yaml
# applications/contracts.app.yml
name: Contract Management
code: contracts

# translations/zh-CN.i18n.yml
contracts:
  name: 合同管理
  description: 管理合同和协议
```

## Troubleshooting | 故障排除

### Issue: Application not showing

**Solutions**:
1. Check `visible: true`
2. Verify user has permissions
3. Check object permissions
4. Clear cache and reload

### Issue: Objects not appearing

**Solutions**:
1. Verify objects exist
2. Check object names match exactly
3. Ensure objects have proper permissions
4. Restart server

### Issue: Icon not displaying

**Solutions**:
1. Use valid Lightning icon name
2. Check icon name spelling
3. Try alternative: `icon_slds` vs `icon`

## References | 参考资料

- [Application Development Guide](../.github/prompts/customer/01-general-development.md)
- [Object Definition](./05-objects.md)
- [Salesforce Lightning Icons](https://www.lightningdesignsystem.com/icons/)
- [Steedos Documentation](https://docs.steedos.com/)
