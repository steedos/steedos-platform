---
name: steedos-tabs
description: |
  TRIGGER when: user creates/edits a `.tab.yml` file; asks how to add a
  navigation item to a Steedos application sidebar; asks about tab types
  (object tab, page tab, url tab, analytics_dashboard tab); asks how to link
  a tab to an object list view, a micro page, an analytics dashboard, or an
  external/internal URL; asks about tab icon, label, desktop/mobile visibility,
  is_use_iframe, is_new_window, license restrictions, or permission_set-based
  tab visibility; asks why a tab does not appear.
  SKIP: user is asking about the application container that holds tabs —
  use steedos-applications; user is asking about the page content a tab
  points to — use steedos-micro-pages or steedos-object-micro-pages.
  Defines navigation tabs (.tab.yml) for Steedos application sidebars.
  Supports object (list view), page (Amis micro page only, NOT dashboards),
  analytics_dashboard (仪表盘/dashboard), and url (internal/external) types.
  Covers icon, label, desktop/mobile, iframe options, and permissions.
---

# Steedos Tabs | Steedos 标签页

## Overview | 概述

Tabs define the navigation items that appear in an application's sidebar. Each tab is a `.tab.yml` file that points to an object, a micro page, or a URL. Tabs are referenced by name in the application's `tabs` array.

标签页定义了应用程序侧边栏中的导航项。每个标签页是一个 `.tab.yml` 文件，指向一个对象、微页面或 URL。标签页通过名称在应用程序的 `tabs` 数组中引用。

## File Format | 文件格式

- **File Extension**: `.tab.yml`
- **Location**: `main/default/tabs/`
- **Format**: YAML
- **Naming**: `[tab_name].tab.yml`

## Tab Types | 标签页类型

### 1. Object Tab | 对象标签页

Displays an object's list view. Most common tab type.

显示对象的列表视图。最常用的标签页类型。

```yaml
name: object_contract
desktop: true
icon: collection
label: 合同
mobile: true
object: contract
permissions: []
type: object
```

### 2. Page Tab | 微页面标签页

Renders an Amis micro page (`type: page` in `.page.yml`). Used for custom UIs, landing pages, and standalone app pages. **NOT for dashboards** — use `analytics_dashboard` for that.

渲染 Amis 微页面（`.page.yml` 中 `type: page`）。用于自定义界面、落地页和独立应用页面。**不用于仪表盘** — 仪表盘请使用 `analytics_dashboard`。

```yaml
name: page_app_launcher
desktop: true
icon: agent_home
is_new_window: false
is_use_iframe: false
label: 应用
mobile: true
page: app_launcher
permissions: []
type: page
```

### 3. Analytics Dashboard Tab | 仪表盘标签页

Links to an analytics dashboard (仪表盘). **This is the correct type for dashboards — NOT `type: page`.**

指向一个分析仪表盘。**这是仪表盘的正确类型，不要用 `type: page`。**

```yaml
name: dashboard_sales
desktop: true
icon: dashboard
is_new_window: false
is_use_iframe: false
label: 销售仪表盘
mobile: false
analytics_dashboard: sales_dashboard
permissions: []
type: analytics_dashboard
```

### 4. URL Tab | URL 标签页

Opens an internal or external URL. Can use iframe or new window.

打开内部或外部 URL。可使用 iframe 或新窗口。

```yaml
name: admin_swagger
desktop: true
icon: data_model
is_new_window: true
is_use_iframe: true
label: OpenAPI
mobile: true
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'off'
    permission_set: user
type: url
url: /api/v6/
```

## Field Reference | 字段参考

### Required Fields | 必需字段

#### name (String) — **⚠️ Required, MUST NOT be omitted**
Unique identifier for the tab. This is the name referenced in the application's `tabs` array.

标签页的唯一标识符。这是在应用程序 `tabs` 数组中引用的名称。**不能省略。**

```yaml
name: object_contract
```

#### type (String)
**⚠️ MUST be one of: `object`, `page`, `url`, `analytics_dashboard`. No other values are valid. 严禁使用其他值。**

| Value | Use Case |
|-------|----------|
| `object` | Object list view |
| `page` | Amis micro page (standalone custom UI, NOT dashboards) |
| `analytics_dashboard` | Analytics dashboard / 仪表盘 |
| `url` | Internal or external URL |

```yaml
type: object
type: page
type: analytics_dashboard
type: url
```

#### label (String)
Display name shown in the sidebar navigation.

侧边栏导航中显示的名称。

```yaml
label: 合同管理
```

### Type-Specific Fields | 类型特定字段

#### object (String) — for `type: object`
The object API name to display.

**⚠️ CRITICAL: The field name is `object`, NOT `object_name`. Using `object_name` is a common mistake and will NOT work.**

**⚠️ 重要：字段名为 `object`，不是 `object_name`。使用 `object_name` 是常见错误，不会生效。**

```yaml
type: object
object: contracts     # ✅ Correct
# object_name: contracts  # ❌ WRONG — do NOT use object_name
```

#### page (String) — for `type: page`
The micro page name to render. This must be an Amis micro page (`type: page` in `.page.yml`). **Do NOT use this for dashboards** — use `type: analytics_dashboard` instead.

微页面的名称。必须是 Amis 微页面（`.page.yml` 中 `type: page`）。**不要用于仪表盘** — 仪表盘请使用 `type: analytics_dashboard`。

```yaml
type: page
page: app_launcher
```

#### analytics_dashboard (String) — for `type: analytics_dashboard`
The analytics dashboard name to display. Use this for all dashboards (仪表盘).

要显示的分析仪表盘名称。所有仪表盘都使用此类型。

```yaml
type: analytics_dashboard
analytics_dashboard: sales_dashboard
```

#### url (String) — for `type: url`
The URL to open. Supports template variables.

要打开的 URL。支持模板变量。

```yaml
type: url
url: /app/admin/space_users/view/${context.user.spaceUserId}
```

**URL Template Variables | URL 模板变量:**

| Variable | Description |
|----------|-------------|
| `${context.user.spaceUserId}` | Current user's space_users ID |

### Optional Fields | 可选字段

#### desktop (Boolean)
Whether the tab is visible on desktop. Default: `true`.

```yaml
desktop: true
```

#### mobile (Boolean)
Whether the tab is visible on mobile. Default: `true`.

```yaml
mobile: true
```

#### icon (String)
**⚠️ MUST be a valid SLDS icon name from the objects skill [Valid Icon Values](../objects/SKILL.md#valid-icon-values--有效的-icon-值) list. Do NOT invent icon names. If no icon matches, use `custom` or `record`.**

**⚠️ 必须为对象 skill [有效图标列表](../objects/SKILL.md#valid-icon-values--有效的-icon-值)中的有效 SLDS 图标名称，严禁编造。如无匹配，使用 `custom` 或 `record`。**

Salesforce Lightning Design System icon name.

```yaml
icon: contract
icon: agent_home
icon: data_model
```

#### is_new_window (Boolean)
Whether to open in a new browser window/tab. Default: `false`.

是否在新浏览器窗口/标签页中打开。默认：`false`。

```yaml
is_new_window: true
```

#### is_use_iframe (Boolean)
Whether to render the content in an iframe within the app. Default: `false`. Typically used with URL tabs.

是否在应用内使用 iframe 渲染内容。默认：`false`。通常与 URL 标签页配合使用。

```yaml
is_use_iframe: true
```

#### locked (Boolean)
Whether the tab configuration is locked from editing in the UI.

```yaml
locked: false
```

#### license (Array)
License tiers required to access this tab.

访问此标签页所需的许可证级别。

```yaml
license:
  - platform-professional
  - platform-enterprise
```

### Permissions | 权限

Control tab visibility per permission set. Each entry has `permission` (**⚠️ MUST be `'on'` or `'off'`, no other values**) and `permission_set`.

按权限集控制标签页可见性。每个条目有 `permission`（**⚠️ 必须为 `'on'` 或 `'off'`**）和 `permission_set`。

```yaml
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'on'
    permission_set: user
  - permission: 'off'
    permission_set: customer
  - permission: 'off'
    permission_set: supplier
  - permission: 'off'
    permission_set: organization_admin
  - permission: 'off'
    permission_set: workflow_admin
```

An empty `permissions: []` means the tab is visible to all users.

空的 `permissions: []` 表示标签页对所有用户可见。

## Complete Examples | 完整示例

### Object Tab — Business Object | 对象标签页 — 业务对象

```yaml
name: object_pepsico_material
desktop: true
icon: contact_list
label: 材料素材
mobile: true
object: pepsico_material
permissions: []
type: object
```

### Object Tab — Admin Only | 对象标签页 — 仅管理员

```yaml
name: admin_apps
desktop: true
icon: apps
is_new_window: false
label: 应用程序
mobile: true
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'off'
    permission_set: user
  - permission: 'off'
    permission_set: customer
  - permission: 'off'
    permission_set: supplier
  - permission: 'off'
    permission_set: organization_admin
  - permission: 'off'
    permission_set: workflow_admin
type: object
object: apps
```

### Page Tab — Custom UI | 微页面标签页 — 自定义界面

```yaml
name: page_app_store
desktop: true
icon: product_consumed
is_new_window: false
is_use_iframe: false
label: App Store
mobile: true
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'off'
    permission_set: user
type: page
page: app_store
```

### Analytics Dashboard Tab | 仪表盘标签页

```yaml
name: dashboard_sales
desktop: true
icon: dashboard
is_new_window: false
is_use_iframe: false
label: 销售仪表盘
mobile: false
permissions: []
type: analytics_dashboard
analytics_dashboard: sales_dashboard
```

### URL Tab — External Tool | URL 标签页 — 外部工具

```yaml
name: nodered
desktop: true
icon: incident
is_new_window: true
is_use_iframe: false
label: Node-RED
locked: false
mobile: true
permissions:
  - permission: 'off'
    permission_set: user
type: url
url: /flows
```

### URL Tab — Embedded Dashboard | URL 标签页 — 嵌入仪表板

```yaml
name: material_kanban
desktop: true
icon: app
is_new_window: false
is_use_iframe: true
label: 看板
locked: false
mobile: false
permissions: []
type: url
url: /analytics/embed/dashboard/6788be6a41162b06257df7a9#titled=false&bordered=false
```

### URL Tab — Dynamic URL with Context | URL 标签页 — 带上下文的动态 URL

```yaml
name: admin_personal_information
desktop: true
icon: user_role
is_new_window: false
label: 个人资料
mobile: true
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'on'
    permission_set: user
type: url
url: /app/admin/space_users/view/${context.user.spaceUserId}
```

### Tab with License Restriction | 带许可证限制的标签页

```yaml
name: admin_ai_chatbots
desktop: true
icon: live_chat
is_new_window: false
label: Chatbots
mobile: true
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'off'
    permission_set: user
type: object
object: ai_chatbots
license:
  - platform-professional
  - platform-enterprise
```

## Relationship with Applications | 与应用程序的关系

Tabs are referenced in `.app.yml` files via the `tabs` array. The tab `name` is used as the reference key.

标签页通过 `tabs` 数组在 `.app.yml` 文件中引用。标签页的 `name` 作为引用键。

```yaml
# In application .app.yml
tabs:
  - page_app_launcher
  - core_announcements
  - core_tasks

tab_items:
  page_app_launcher:
    group: ''
    index: 1
  core_announcements:
    group: 协作
    index: 2
  core_tasks:
    group: 协作
    index: 3

tab_groups:
  - group_name: 协作
    default_open: true
```

When an application's `tabs` array includes a name that matches no `.tab.yml` file, the system treats it as an implicit object tab (directly using the name as the object API name).

当应用程序的 `tabs` 数组包含的名称没有匹配的 `.tab.yml` 文件时，系统将其视为隐式对象标签页（直接将名称作为对象 API 名称）。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/
        └── default/
            ├── tabs/
            │   ├── object_contract.tab.yml
            │   ├── page_dashboard.tab.yml
            │   └── admin_settings.tab.yml
            └── applications/
                └── my_app.app.yml
```

## Naming Conventions | 命名约定

| Pattern | Use Case | Example |
|---------|----------|---------|
| `object_{name}` | Object tabs for business objects | `object_contract` |
| `admin_{name}` | Admin-only tabs | `admin_apps` |
| `page_{name}` | Micro page tabs (Amis custom UI) | `page_app_launcher` |
| `dashboard_{name}` | Analytics dashboard tabs | `dashboard_sales` |
| `core_{name}` | Core platform tabs | `core_tasks` |

## Best Practices | 最佳实践

### 1. Permission Configuration

Always explicitly set permissions for admin-only tabs:

始终为仅管理员标签页明确设置权限：

```yaml
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'off'
    permission_set: user
```

For tabs visible to all users, use empty permissions:

对所有用户可见的标签页，使用空权限：

```yaml
permissions: []
```

### 2. iframe vs New Window

- Use `is_use_iframe: true` for embedded dashboards and tools that should stay within the app
- Use `is_new_window: true` for external tools like Node-RED that need their own window
- Don't combine both — choose one approach

- 使用 `is_use_iframe: true` 嵌入仪表板和需要留在应用内的工具
- 使用 `is_new_window: true` 用于像 Node-RED 这样需要独立窗口的外部工具
- 不要同时使用两者 — 选择一种方式

### 3. Mobile Visibility

Set `mobile: false` for tabs that don't work well on mobile (e.g., complex dashboards, iframe embeds):

对不适合移动端的标签页设置 `mobile: false`（如复杂仪表板、iframe 嵌入）：

```yaml
desktop: true
mobile: false
```

## Troubleshooting | 故障排除

### Issue: Tab not appearing in sidebar

**Solutions**:
1. Verify the tab `name` is listed in the application's `tabs` array
2. Check `permissions` — user must have `permission: 'on'` for their permission_set
3. Ensure `desktop: true` (or `mobile: true` for mobile)
4. Check `license` restrictions if present

### Issue: URL tab showing blank

**Solutions**:
1. For iframe embeds, ensure `is_use_iframe: true`
2. Check the target URL allows iframe embedding (X-Frame-Options)
3. Verify the URL path is correct and accessible

### Issue: Page tab not rendering

**Solutions**:
1. Verify the `page` value matches an existing micro page name
2. Ensure the micro page `.page.yml` and `.page.amis.json` files exist
3. Check page permissions

## References | 参考资料

- [Applications](../applications/SKILL.md) — how tabs are used in app configuration
- [Micro Pages](../micro-pages/SKILL.md) — creating pages for `type: page` tabs
- [Dashboards](../dashboards/SKILL.md) — creating dashboards for `type: analytics_dashboard` tabs
- [Object Permissions](../object-permissions/SKILL.md) — permission sets referenced in tab permissions
- [Salesforce Lightning Icons](https://www.lightningdesignsystem.com/icons/)
