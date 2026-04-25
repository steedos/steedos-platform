---
name: steedos-builtin-objects
description: |
  TRIGGER when: user creates a new Steedos project or package; user adds a lookup/
  master_detail field referencing a built-in object (users, organizations, spaces,
  space_users, company, roles, permission_set, etc.); user asks about built-in object
  names, fields, or relationships; user mentions departments, users, roles, permissions,
  or any core platform entity by Chinese or English name; user configures sharing rules
  or record-level permissions that depend on organizational hierarchy.
  SKIP: user is only asking about custom object definition syntax (use steedos-objects),
  or only asking about field types (use steedos-object-fields).
  Steedos platform built-in objects reference. Lists ~20 commonly used
  core objects with field definitions and relationships: users, spaces,
  organizations, space_users, company, roles, permission_set, apps,
  tasks, accounts, contacts, pages, notifications, etc. Also provides
  a full index of all ~93 built-in objects by category.

  IMPORTANT name mappings (Steedos names differ from common expectations):
  - Department/部门 → object name is `organizations` (NOT departments)
  - Workspace/工作区 → object name is `spaces`
  - Workspace User/工作区用户 → object name is `space_users`
  - Division/分部 → object name is `company`
  - Permission Profile/权限简档 → object name is `permission_set`
  - Task/任务 → object name is `tasks`
  - Contact/联系人 → object name is `contacts`
  - Account/客户 → object name is `accounts`
---

# Steedos Built-in Objects | Steedos 内置对象

## CRITICAL: Object Name Mappings | 重要：对象名称映射

**ALWAYS** use the exact API names below — do NOT guess object names based on common conventions:

| Concept | API Name (object name) | WRONG guesses to avoid |
|---------|----------------------|----------------------|
| Department 部门 | **organizations** | ~~departments~~, ~~spaces_departments~~ |
| Workspace 工作区 | **spaces** | ~~workspaces~~, ~~tenants~~ |
| Workspace User 工作区用户 | **space_users** | ~~workspace_users~~, ~~members~~ |
| Division 分部 | **company** | ~~divisions~~, ~~companies~~ |
| Permission Profile 权限简档 | **permission_set** | ~~profiles~~, ~~permission_profiles~~ |
| Task 任务 | **tasks** | — |
| Contact 联系人 | **contacts** | — |
| Account 客户 | **accounts** | — |

When referencing built-in objects in lookup fields, permissions, or code, you MUST use the API names from the table above. Consult the full object index at the end of this document if unsure.

## Overview | 概述

Steedos ships with ~93 built-in objects that provide core platform functionality. This skill documents the most commonly used objects — their fields, relationships, and purpose. Custom packages can extend these objects or reference them via lookup fields.

Steedos 平台内置约 93 个对象，提供核心平台功能。本技能文档记录最常用的对象——字段、关系和用途。自定义软件包可以扩展这些对象或通过 lookup 字段引用它们。

**Standard auto-generated fields** (present on ALL objects, not listed in tables below):

| Field | Type | Description |
|-------|------|-------------|
| `_id` | text | Record ID (primary key) |
| `owner` | lookup → users | Record owner |
| `space` | lookup → spaces | Workspace ID |
| `created` | datetime | Creation time |
| `created_by` | lookup → users | Creator |
| `modified` | datetime | Last modified time |
| `modified_by` | lookup → users | Last modifier |
| `company_id` | lookup → company | Primary division |
| `company_ids` | lookup → company (multiple) | All divisions |

## Users & Organizations | 用户与组织

### spaces — Workspace | 工作区

The top-level tenant object. Each workspace is an isolated data environment.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `admins` | lookup (multiple) | Admin Users 管理员 | → users |
| `enable_register` | boolean | Enable Registration 允许注册 | — |
| `default_profile` | lookup | Default Profile 默认简档 | → permission_set |
| `default_organization` | lookup | Default Organization 默认组织 | → organizations |
| `password_expiry_days` | number | Password Expiry Days 密码过期天数 | — |

### users — User | 用户

Platform-wide user account. A user can belong to multiple workspaces via `space_users`.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 姓名 | — |
| `avatar` | avatar | Avatar 头像 | — |
| `email` | text | Email 邮箱 | — |
| `mobile` | text | Mobile 手机 | — |
| `username` | text | Username 用户名 | — |
| `steedos_id` | text | Steedos ID | — |
| `locale` | select | Language 语言 | — |
| `utcOffset` | number | Time Zone 时区 | — |
| `email_notification` | boolean | Email Notifications 邮件通知 | — |

### organizations — Department | 部门

Hierarchical department tree within a workspace.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `fullname` | text | Fullname 全名 | — |
| `parent` | lookup | Superior 上级 | → organizations |
| `children` | lookup (multiple) | Subordinates 下级 | → organizations |
| `users` | lookup (multiple) | Members 成员 | → users |
| `sort_no` | number | Sort 排序号 | — |
| `hidden` | boolean | Hidden 隐藏 | — |
| `is_company` | boolean | Divisional 是否分部 | — |

### space_users — Space User | 工作区用户

Associates a user with a workspace, carrying workspace-specific profile info (department, profile, manager).

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 姓名 | — |
| `user` | master_detail | User 用户 | → users |
| `username` | text | Username 用户名 | — |
| `email` | text | Email 邮箱 | — |
| `mobile` | text | Mobile 手机 | — |
| `position` | text | Title 职务 | — |
| `manager` | lookup | Superior 上级主管 | → users |
| `organization` | lookup | Main Department 主部门 | → organizations |
| `organizations` | lookup (multiple) | All Departments 所有部门 | → organizations |
| `profile` | lookup | Profile 简档 | → permission_set |
| `locale` | select | Language 语言 | — |
| `avatar` | avatar | Avatar 头像 | — |
| `sort_no` | number | Sort 排序号 | — |
| `invite_state` | select | Invitation Status 邀请状态 | — |
| `user_accepted` | boolean | Valid 有效 | — |
| `email_notification` | boolean | Email Notifications 邮件通知 | — |
| `sms_notification` | boolean | SMS Notifications 短信通知 | — |

### company — Division | 分部

Multi-company / division structure. Records are scoped to divisions via `company_id`/`company_ids`.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `code` | text | Code 编码 | — |
| `organization` | lookup | Department 对应部门 | → organizations |
| `admins` | lookup (multiple) | Admin Users 管理员 | → users |
| `parent` | lookup | Parent Division 上级分部 | → company |
| `sort_no` | number | Sort 排序号 | — |
| `description` | textarea | Description 描述 | — |

## Permissions | 权限

### roles — Role | 角色

Role-based access hierarchy. Users are assigned to roles, and data sharing can cascade through the role tree.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `api_name` | text | API Name | — |
| `parent` | lookup | Parent Role 上级角色 | → roles |
| `users` | lookup (multiple) | Users 用户 | → users |
| `description` | textarea | Description 描述 | — |
| `is_system` | boolean | System 系统 | — |

### permission_set — Permission Set | 权限集

Permission profiles that control object access, field access, and security policies. Users are assigned a profile via `space_users.profile`.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `label` | text | Label 标签 | — |
| `type` | select | Type 类型 | profile / permission_set |
| `users` | lookup (multiple) | Users 用户 | → users |
| `assigned_apps` | lookup (multiple) | Assigned Apps 分配的应用 | → apps |
| `password_history` | select | Password History 密码历史 | — |
| `max_login_attempts` | select | Max Login Attempts 最大登录尝试 | — |
| `lockout_interval` | select | Lockout Interval 锁定时间 | — |
| `enable_MFA` | boolean | Multi-Factor Auth 多重认证 | — |
| `logout_other_clients` | boolean | Single Sign-On 单例登录 | — |
| `login_expiration_in_days` | number | Login Expiration 登录过期天数 | — |
| `is_system` | boolean | System 系统 | — |

### permission_objects — Object Permission | 对象权限

Per-object permission rules attached to a permission set.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `permission_set_id` | master_detail | Permission Set 权限集 | → permission_set |
| `object_name` | lookup | Object 对象 | → objects |
| `allowRead` | boolean | Allow Read 允许读取 | — |
| `allowCreate` | boolean | Allow Create 允许创建 | — |
| `allowEdit` | boolean | Allow Edit 允许编辑 | — |
| `allowDelete` | boolean | Allow Delete 允许删除 | — |
| `viewAllRecords` | boolean | View All Records 查看所有 | — |
| `modifyAllRecords` | boolean | Modify All Records 修改所有 | — |
| `viewCompanyRecords` | boolean | View Division Records 查看分部 | — |
| `modifyCompanyRecords` | boolean | Modify Division Records 修改分部 | — |
| `allowExport` | boolean | Allow Export 允许导出 | — |
| `disabled_actions` | lookup (multiple) | Disabled Actions 禁用操作 | — |
| `unreadable_fields` | lookup (multiple) | Unreadable Fields 不可读字段 | — |
| `uneditable_fields` | lookup (multiple) | Uneditable Fields 不可编辑字段 | — |

## Applications & UI | 应用与界面

### apps — Application | 应用

Application definitions with tab navigation and optional OAuth2/SAML SSO.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `code` | text | API Name | — |
| `icon_slds` | select | Icon 图标 | — |
| `color` | select | Color 颜色 | — |
| `description` | textarea | Description 描述 | — |
| `tabs` | lookup (multiple) | Tabs 标签页 | → tabs |
| `sort` | number | Sort 排序号 | — |
| `is_creator` | boolean | Desktop 桌面端显示 | — |
| `mobile` | boolean | Mobile 移动端显示 | — |
| `visible` | boolean | Visible 可见 | — |
| `url` | url | URL | — |
| `is_use_iframe` | boolean | Open with iframe | — |
| `is_new_window` | boolean | Open in New Window 新窗口 | — |
| `oauth2_enabled` | boolean | OAuth2 Enabled | — |
| `saml_enabled` | boolean | SAML Enabled | — |
| `is_system` | boolean | System 系统 | — |

### tabs — Tab | 标签页

Navigation tabs for applications. Each tab points to an object, page, or URL.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | API Name | — |
| `label` | text | Label 标签 | — |
| `type` | select | Type 类型 | object / page / url |
| `object` | lookup | Object 对象 | → objects |
| `page` | lookup | Page 页面 | → pages |
| `url` | text | URL | — |
| `icon` | lookup | Icon 图标 | — |
| `mobile` | boolean | Mobile 移动端 | — |
| `desktop` | boolean | Desktop 桌面端 | — |
| `is_new_window` | boolean | New Window 新窗口 | — |
| `description` | textarea | Description 描述 | — |

### pages — Micro Page | 微页面

Custom UI pages built with the Amis framework.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | API Name | — |
| `label` | text | Label 名称 | — |
| `type` | select | Type 类型 | app / record / list / form |
| `render_engine` | select | Render Engine 渲染器 | amis |
| `object_name` | lookup | Object 对象 | → objects |
| `is_active` | toggle | Active 状态 | — |
| `description` | textarea | Description 描述 | — |
| `allow_anonymous` | toggle | Allow Anonymous 匿名访问 | — |
| `version` | number | Version 版本号 | — |

## Business Objects | 业务对象

### accounts — Account | 业务伙伴

CRM-style business partner (customer/supplier) records.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `is_supplier` | boolean | Supplier 供应商 | — |
| `is_customer` | boolean | Customer 客户 | — |
| `type` | select | Type 类型 | Customer, Partner, Competitor... |
| `parent_id` | lookup | Parent Account 母公司 | → accounts |
| `website` | url | Website 网站 | — |
| `phone` | text | Phone 电话 | — |
| `fax` | text | Fax 传真 | — |
| `industry` | select | Industry 行业 | 30+ options |
| `number_of_employees` | number | Employees 员工人数 | — |
| `rating` | select | Rating 分级 | Hot, Warm, Cold |
| `state` | select | Region 区域 | — |
| `description` | textarea | Description 描述 | — |
| `credit_code` | text | Tax ID 纳税人识别号 | — |
| `shipping_address` | textarea | Shipping Address 发货地址 | — |
| `billing_address` | textarea | Billing Address 开单地址 | — |

### contacts — Contact | 联系人

Contacts associated with business accounts (master-detail to accounts).

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 姓名 | — |
| `account` | master_detail | Account 所属客户 | → accounts |
| `title` | text | Title 职务 | — |
| `reports_to_id` | lookup | Reports To 直属上司 | → contacts |
| `salutation` | select | Salutation 性别 | Male, Female |
| `department` | text | Department 部门 | — |
| `email` | email | Email 邮件 | — |
| `phone` | text | Work Phone 工作电话 | — |
| `mobile` | text | Mobile 手机 | — |
| `mailing_address` | textarea | Mailing Address 邮寄地址 | — |
| `birthdate` | date | Birthday 生日 | — |
| `description` | textarea | Notes 备注 | — |
| `user` | lookup | External User 外部用户 | → users |

## Collaboration | 协作

### tasks — Task | 任务

Built-in task management with assignments and due dates.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `assignees` | lookup (multiple) | Assignees 执行人 | → users |
| `due_date` | date | Due Date 截止日期 | — |
| `state` | select | State 状态 | not_started, in_progress, completed, waiting, deferred |
| `priority` | select | Priority 优先级 | high, normal, low |
| `related_to` | lookup | Related To 相关记录 | → (dynamic) |
| `description` | textarea | Description 描述 | — |

### notifications — Notification | 通知

System notifications sent to users (record changes, mentions, workflow actions, etc.).

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Title 标题 | — |
| `body` | textarea | Body 内容 | — |
| `from` | lookup | From 发送人 | → users |
| `related_to` | lookup | Related Record 相关记录 | → (dynamic) |
| `related_name` | text | Related Name 相关记录名 | — |
| `url` | url | URL 链接 | — |
| `is_read` | boolean | Read 已读 | — |

### cms_files — Attachment | 附件

File attachments linked to any object record.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 文件名 | — |
| `description` | textarea | Description 描述 | — |
| `extention` | text | Extension 扩展名 | — |
| `size` | filesize | Size 大小 | — |
| `parent` | lookup | Parent 所属记录 | → (dynamic) |
| `allow_anonymous_downloads` | boolean | Anonymous Download 匿名下载 | — |

## System | 系统配置

### api_keys — API Key | API 密钥

API keys for programmatic access to the platform.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `api_key` | text | API Key 密钥 | — |
| `active` | boolean | Enabled 启用 | — |
| `last_use_time` | datetime | Last Use 最后使用时间 | — |

### datasources — Data Source | 数据源

External database connections.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `name` | text | Name 名称 | — |
| `label` | text | Label 标签 | — |
| `driver` | select | Driver 驱动 | MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, Sqlite |
| `host` | text | Host 主机 | — |
| `port` | number | Port 端口 | — |
| `database` | text | Database 数据库名 | — |
| `username` | text | Username 用户名 | — |
| `password` | password | Password 密码 | — |
| `connectString` | textarea | Connect String 连接串 | — |
| `is_enable` | boolean | Enable 启用 | — |
| `logging` | boolean | Debug 调试 | — |
| `is_system` | boolean | System 系统 | — |

### audit_records — Audit Record | 审计记录

Field-level change history for objects with `enable_audit: true`.

| Field | Type | Label | Reference |
|-------|------|-------|-----------|
| `related_to` | lookup | Related Record 相关记录 | → (audit-enabled objects) |
| `field_name` | text | Field Name 字段名 | — |
| `previous_value` | text | Previous Value 旧值 | — |
| `new_value` | text | New Value 新值 | — |

## Object Relationships | 对象关系

```
spaces ─────────┬──→ organizations (departments)
                │         ↑ parent (self-referencing tree)
                │         ↑ organization ←── company (divisions)
                │
                ├──→ users ←──┐
                │             │ user (master_detail)
                ├──→ space_users ──→ organizations (multiple)
                │         │
                │         └──→ permission_set (profile)
                │                    │
                │                    └──→ permission_objects ──→ objects
                │
                ├──→ apps ──→ tabs ──→ pages
                │                  ──→ objects
                │
                ├──→ roles (tree via parent)
                │         └──→ users (multiple)
                │
                ├──→ accounts ←── contacts (master_detail)
                │       ↑ parent_id (self-referencing)
                │
                ├──→ tasks ──→ users (assignees)
                ├──→ notifications ──→ users (from)
                └──→ cms_files ──→ (any object via parent)
```

**Key relationships:**
- `space_users` bridges `users` ↔ `spaces`, carrying per-workspace profile and department
- `permission_objects` is a child of `permission_set` (master_detail), linking permissions to objects
- `contacts` is a child of `accounts` (master_detail, cascade delete)
- `organizations` forms a tree via `parent` (self-referencing lookup)
- `company` maps to `organizations` for multi-division data isolation
- `tabs` connect `apps` to `objects` or `pages`

## All Built-in Objects Index | 全部内置对象索引

### service-core-objects (56 objects)

| Object | Label | Description |
|--------|-------|-------------|
| `users` | User | Platform user accounts |
| `spaces` | Company | Workspace/tenant |
| `organizations` | Department | Organization tree |
| `space_users` | User | Workspace user membership |
| `space_users_invite` | Invite | User invitation |
| `roles` | Role | Role hierarchy |
| `permission_set` | Permission Sets | Profiles and permission sets |
| `permission_shares` | Permission Share | Sharing rules |
| `company` | Divisions | Multi-company structure |
| `apps` | App | Applications |
| `objects` | Objects | Object metadata registry |
| `object_fields` | Object Fields | Field metadata |
| `object_layouts` | Object Layouts | Page layouts |
| `object_listviews` | List View | List view metadata |
| `object_actions` | Object Action | Action metadata |
| `object_triggers` | Object Triggers | Trigger metadata |
| `object_validation_rules` | Validation Rules | Validation rules |
| `object_webhooks` | Webhooks | Webhook definitions |
| `object_webhooks_queue` | Webhooks Queue | Webhook execution queue |
| `object_functions` | Object Functions | Function metadata |
| `object_recent_viewed` | View Log | Recently viewed records |
| `object_related_list` | Related List | Related list config |
| `tasks` | Task | Task management |
| `events` | Event | Calendar events |
| `notes` | Notes | Notes |
| `notifications` | Notification | System notifications |
| `announcements` | Announcement | Announcements |
| `favorites` | My Favorite | Bookmarked records |
| `reports` | Report | Reports |
| `queue_import` | Data Import Queue | Bulk import jobs |
| `queue_import_history` | Import History | Import history log |
| `picklists` | Picklist | Global picklists |
| `picklist_options` | Picklist Options | Picklist option values |
| `cms_files` | Attachments | File attachments |
| `cfs_files_filerecord` | Attachment Version | File storage records |
| `cfs_images_filerecord` | Images Version | Image storage records |
| `cfs_avatars_filerecord` | Avatar Version | Avatar storage records |
| `audit_login` | Login Log | Login audit log |
| `audit_records` | Audit Records | Field change history |
| `sessions` | Login Sessions | Active sessions |
| `operation_logs` | Security Logs | Security operation log |
| `api_keys` | API Key | API authentication keys |
| `datasources` | DataSource | External DB connections |
| `settings` | Settings | System parameters |
| `keyvalue` | Settings | Key-value parameters |
| `steedos_keyvalues` | Steedos KeyValues | Internal key-value store |
| `autonumber` | Auto Number | Auto-number sequences |
| `business_hours` | Business Hours | Working hours config |
| `holidays` | Holidays | Holiday calendar |
| `license` | License | License information |
| `users_verify_code` | Verify Code | User verification codes |
| `OAuth2AccessTokens` | OAuth2 Token | OAuth2 access tokens |
| `OAuth2Clients` | OAuth2 Client | OAuth2 client apps |

### standard-accounts (2 objects)

| Object | Label | Description |
|--------|-------|-------------|
| `accounts` | 业务伙伴 | Business partners (customers/suppliers) |
| `contacts` | 联系人 | Contact persons |

### standard-permission (5 objects)

| Object | Label | Description |
|--------|-------|-------------|
| `permission_objects` | Permission | Object-level permissions |
| `permission_fields` | Field Permission | Field-level permissions |
| `permission_tabs` | Tab Permission | Tab visibility permissions |
| `share_rules` | Share Rule | Record sharing rules |
| `restriction_rules` | Restriction Rule | Record restriction rules |

### standard-process-approval (4 objects)

| Object | Label | Description |
|--------|-------|-------------|
| `workflow_rule` | Workflow Rule | Automation workflow rules |
| `workflow_notifications` | Workflow Notification | Workflow email alerts |
| `action_field_updates` | Field Updates | Workflow field update actions |
| `process_instance_history` | Approval History | Approval process history |

### service-pages (4 objects)

| Object | Label | Description |
|--------|-------|-------------|
| `pages` | 微页面 | Custom Amis pages |
| `page_versions` | Page Version | Page version history |
| `page_assignments` | Page Assignment | Page-to-object assignments |
| `widgets` | Widget | Reusable page widgets |

### standard-ui (1 object)

| Object | Label | Description |
|--------|-------|-------------|
| `tabs` | Tabs | Navigation tab definitions |

### service-package-registry (1 object)

| Object | Label | Description |
|--------|-------|-------------|
| `steedos_packages` | Package | Installed packages |

### Other Services

| Object | Label | Service | Description |
|--------|-------|---------|-------------|
| `_object_reload_logs` | — | standard-object-database | Internal reload tracking |
| `workflow_time_trigger_queue` | Time Trigger Queue | workflow_time_trigger | Scheduled workflow execution |
