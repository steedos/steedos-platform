---
name: steedos-applications
description: |
  TRIGGER when: user creates/edits a `.app.yml` file; asks how to create a
  Steedos application, configure the app sidebar menu, set app icon/color,
  control mobile visibility, configure admin_menus, group tabs with tab_groups,
  restrict app visibility by permission_set; asks why the application menu is
  not showing (missing tabs field is a common cause).
  SKIP: user is asking about individual sidebar navigation items (tabs) —
  use steedos-tabs; user is asking about the pages tabs point to —
  use steedos-pages.
  Creates and configures Steedos applications (.app.yml). Required fields:
  name, code, tabs. Covers icon_slds, color, tab_items/tab_groups, mobile,
  showSidebar, and permission-based visibility.
---

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
icon_slds: icon_name
color: blue
is_creator: true
showSidebar: true
mobile: true
visible: true
sort: 100
tabs:
  - object1
  - object2
tab_items:
  object1:
    group: ''
    index: 1
  object2:
    group: ''
    index: 2
```

## Field Reference | 字段参考

### Required Fields | 必需字段

#### name (String) — **⚠️ Required, MUST NOT be omitted**
Application display name shown in the UI. **不能省略。**

```yaml
name: Contract Management
```

#### code (String) — **⚠️ Required, MUST NOT be omitted**
Unique identifier for the application (API name). **不能省略。**

**⚠️ CRITICAL: The `code` value MUST exactly match the filename (without `.app.yml`). For example, if `code: steedos_crm`, the file MUST be named `steedos_crm.app.yml`.**

**⚠️ 重要：`code` 值必须与文件名（去掉 `.app.yml` 后缀）完全一致。例如 `code: steedos_crm`，文件名必须为 `steedos_crm.app.yml`。**

```yaml
code: steedos_crm   # → file: steedos_crm.app.yml
```

#### tabs (Array) — REQUIRED
**List of tab names for the application's sidebar navigation. This field is required — without it, the application menu will not display.**

**应用程序侧边栏导航的标签页名称列表。此字段为必需 — 没有它，应用程序菜单将无法显示。**

Each entry is either a tab name (matching a `.tab.yml` file) or an object API name (implicit object tab).

```yaml
tabs:
  - contracts
  - contract_items
  - page_custom_dashboard
```

#### is_creator (Boolean) — **⚠️ Required, MUST be `true`**
Whether this application uses the Creator UI framework. **Must always be `true`.**

**是否使用 Creator UI 框架。必须始终设置为 `true`，不能省略。**

```yaml
is_creator: true
```

#### visible (Boolean) — **⚠️ Required, MUST be `true`**
Whether the application is visible in the app menu. **Must always be `true`.**

**应用是否在菜单中可见。必须始终设置为 `true`，不能省略。**

```yaml
visible: true
```

#### showSidebar (Boolean) — **⚠️ Required, MUST be `true`**
Whether the sidebar navigation is shown. **Must always be `true`.**

**是否显示侧边栏导航。必须始终设置为 `true`，不能省略。**

```yaml
showSidebar: true
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

#### color (String)
Application theme color. Must be one of the following values:

应用程序主题颜色。必须是以下值之一：

| Value | Color |
|-------|-------|
| `red` | Red |
| `orange` | Orange |
| `yellow` | Yellow |
| `green` | Green |
| `teal` | Teal |
| `cyan` | Cyan |
| `blue` | Blue |
| `pink` | Pink |
| `purple` | Purple |
| `gray` | Gray |

Default: `sky`

```yaml
color: blue
color: teal
color: purple
```

#### dark (Boolean)
Whether the application uses a dark theme for the sidebar.

```yaml
dark: true
```

#### mobile (Boolean)
Whether the application is available on mobile devices.

```yaml
mobile: true
```

#### icon_slds (String)
**⚠️ MUST be a value from the [Valid icon_slds Values](#valid-icon_slds-values--有效的-icon_slds-值) list below. Do NOT invent icon names. If no icon matches, use `custom` or `record` as a safe default.**

Salesforce Lightning 图标名称。**必须**从下方[有效值列表](#valid-icon_slds-values--有效的-icon_slds-值)中选取，严禁自行编造。如无匹配图标，使用 `custom` 或 `record` 作为默认值。

```yaml
icon_slds: approval
icon_slds: agent_home
icon_slds: contract
```

#### icon (String)
Custom icon name (use `icon_slds` when possible).

```yaml
icon: custom_icon
```

#### sort (Number)
Display order in the application menu (lower numbers first).

```yaml
sort: 100
```

#### tab_items (Object)
Detailed tab configuration with grouping and ordering. Keys are tab names (matching entries in `tabs`), values specify `group` and `index`.

详细的标签配置，包含分组和排序。键为标签名（对应 `tabs` 中的条目），值指定 `group` 和 `index`。

```yaml
tab_items:
  contracts:
    group: 业务
    index: 1
  contract_items:
    group: 业务
    index: 2
  page_custom_dashboard:
    group: ''
    index: 0
```

#### tab_groups (Array)
Define sidebar navigation groups. Each group has a `group_name` and optional `default_open`.

定义侧边栏导航分组。每个分组有 `group_name` 和可选的 `default_open`。

```yaml
tab_groups:
  - group_name: 业务
    default_open: true
  - group_name: 管理
    default_open: true
```

## Complete Example | 完整示例

### Simple Application | 简单应用

```yaml
name: Task Management
code: tasks
description: Manage tasks and to-dos
icon_slds: task
color: blue
is_creator: true
showSidebar: true
mobile: true
visible: true
sort: 200
tabs:
  - tasks
tab_items:
  tasks:
    group: ''
    index: 1
```

### Complex Application | 复杂应用

```yaml
_id: contract_management
name: Contract Management
code: contracts
description: Complete contract lifecycle management system
icon_slds: contract
color: teal
is_creator: true
showSidebar: true
mobile: true
visible: true
sort: 100

tabs:
  - contracts
  - contract_items
  - contract_templates
  - customers
  - contract_approvals

tab_groups:
  - group_name: 合同
    default_open: true
  - group_name: 客户
    default_open: true

tab_items:
  contracts:
    group: 合同
    index: 1
  contract_items:
    group: 合同
    index: 2
  contract_templates:
    group: 合同
    index: 3
  customers:
    group: 客户
    index: 1
  contract_approvals:
    group: ''
    index: 0

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
icon_slds: opportunity
color: orange
is_creator: true
showSidebar: true
mobile: true
visible: true
tabs:
  - leads
  - opportunities
  - quotes
  - orders
tab_items:
  leads:
    group: ''
    index: 1
  opportunities:
    group: ''
    index: 2
  quotes:
    group: ''
    index: 3
  orders:
    group: ''
    index: 4
```

### 2. Admin Application | 管理应用

For system administration:

```yaml
name: System Administration
code: admin
description: System configuration and management
icon_slds: settings
is_creator: false
showSidebar: true
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
icon_slds: dashboard
color: cyan
is_creator: true
showSidebar: true
mobile: true
visible: true
landing_page: analytics_dashboard
tabs:
  - reports
  - dashboards
tab_items:
  reports:
    group: ''
    index: 1
  dashboards:
    group: ''
    index: 2
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

Use `permission_sets` to control which profiles can access the application:

使用 `permission_sets` 控制哪些权限配置可以访问应用程序：

```yaml
permission_sets:
  - admin
  - hr_manager
```

## Icon Reference | 图标参考

**⚠️ CRITICAL: The `icon_slds` value MUST be chosen from the valid list below. NEVER invent or guess icon names. Any value NOT in this list will cause a broken icon. When in doubt, use `custom` or `record`.**

**⚠️ 重要：`icon_slds` 值必须从下方有效值列表中选取，严禁自行编造图标名称。不在列表中的值会导致图标无法显示。如不确定，使用 `custom` 或 `record`。**

### Valid icon_slds Values | 有效的 icon_slds 值

The following is the **complete and exhaustive** list of valid `icon_slds` values. Any value NOT in this list will result in a broken icon:

以下是 `icon_slds` 的**完整且唯一**有效值列表，不在此列表中的值会导致图标无法显示：

**A**: `account`, `account_info`, `action_list_component`, `actions_and_buttons`, `activation_target`, `activations`, `address`, `agent_home`, `agent_session`, `aggregation_policy`, `all`, `announcement`, `answer_best`, `answer_private`, `answer_public`, `apex`, `apex_plugin`, `app`, `approval`, `apps`, `apps_admin`, `article`, `asset_action`, `asset_action_source`, `asset_audit`, `asset_downtime_period`, `asset_object`, `asset_relationship`, `asset_state_period`, `asset_warranty`, `assigned_resource`, `assignment`, `attach`, `avatar`, `avatar_loading`

**B**: `bot`, `bot_training`, `branch_merge`, `brand`, `budget`, `budget_allocation`, `bundle_config`, `bundle_policy`, `business_hours`, `buyer_account`, `buyer_group`

**C**: `calculated_insights`, `calibration`, `call`, `call_coaching`, `call_history`, `campaign`, `campaign_members`, `cancel_checkout`, `canvas`, `capacity_plan`, `care_request_reviewer`, `carousel`, `case`, `case_change_status`, `case_comment`, `case_email`, `case_log_a_call`, `case_milestone`, `case_transcript`, `case_wrap_up`, `catalog`, `category`, `change_request`, `channel_program_history`, `channel_program_levels`, `channel_program_members`, `channel_programs`, `chart`, `checkout`, `choice`, `client`, `cms`, `coaching`, `code_playground`, `code_set`, `code_set_bundle`, `collection`, `collection_variable`, `connected_apps`, `constant`, `contact`, `contact_list`, `contact_request`, `contract`, `contract_line_item`, `contract_payment`, `coupon_codes`, `currency`, `currency_input`, `custom`, `custom_component_task`, `custom_notification`, `customer_360`, `customer_lifecycle_analytics`, `customer_portal_users`, `customers`

**D**: `dashboard`, `dashboard_component`, `dashboard_ea`, `data_integration_hub`, `data_mapping`, `data_model`, `data_streams`, `datadotcom`, `dataset`, `date_input`, `date_time`, `decision`, `default`, `delegated_account`, `device`, `discounts`, `display_rich_text`, `display_text`, `document`, `document_reference`, `drafts`, `duration_downscale`, `dynamic_record_choice`

**E**: `education`, `einstein_replies`, `email`, `email_chatter`, `employee`, `employee_asset`, `employee_contact`, `employee_job`, `employee_job_position`, `employee_organization`, `empty`, `endorsement`, `entitlement`, `entitlement_policy`, `entitlement_process`, `entitlement_template`, `entity`, `entity_milestone`, `environment_hub`, `event`, `events`, `expense`, `expense_report`, `expense_report_entry`

**F**: `feed`, `feedback`, `field_sales`, `file`, `filter`, `filter_criteria`, `filter_criteria_rule`, `first_non_empty`, `flow`, `folder`, `forecasts`, `form`, `formula`, `fulfillment_order`

**G**: `generic_loading`, `global_constant`, `goals`, `group_loading`, `groups`, `guidance_center`

**H**: `hierarchy`, `high_velocity_sales`, `historical_adherence`, `holiday_operating_hours`, `home`, `household`

**I**: `identifier`, `immunization`, `incident`, `individual`, `insights`, `instore_locations`, `investment_account`, `invocable_action`, `iot_context`, `iot_orchestrations`

**J**: `javascript_button`, `job_family`, `job_position`, `job_profile`

**K**: `kanban`, `key_dates`, `knowledge`

**L**: `lead`, `lead_insights`, `lead_list`, `letterhead`, `lightning_component`, `lightning_usage`, `link`, `list_email`, `live_chat`, `live_chat_visitor`, `location`, `location_permit`, `log_a_call`, `logging`, `loop`

**M**: `macros`, `maintenance_asset`, `maintenance_plan`, `maintenance_work_rule`, `marketing_actions`, `med_rec_recommendation`, `med_rec_statement_recommendation`, `medication`, `medication_dispense`, `medication_ingredient`, `medication_reconciliation`, `medication_statement`, `merge`, `messaging_conversation`, `messaging_session`, `messaging_user`, `metrics`, `multi_picklist`, `multi_select_checkbox`

**N**: `network_contract`, `news`, `note`, `number_input`

**O**: `observation_component`, `omni_supervisor`, `operating_hours`, `opportunity`, `opportunity_contact_role`, `opportunity_splits`, `orchestrator`, `order_item`, `orders`, `outcome`, `output`

**P**: `partner_fund_allocation`, `partner_fund_claim`, `partner_fund_request`, `partner_marketing_budget`, `partners`, `password`, `past_chat`, `patient_medication_dosage`, `payment_gateway`, `people`, `performance`, `person_account`, `person_language`, `person_name`, `photo`, `picklist_choice`, `picklist_type`, `planogram`, `poll`, `portal`, `portal_roles`, `portal_roles_and_subordinates`, `post`, `practitioner_role`, `price_book_entries`, `price_books`, `pricebook`, `pricing_workspace`, `problem`, `procedure`, `procedure_detail`, `process`, `process_exception`, `product`, `product_consumed`, `product_consumed_state`, `product_item`, `product_item_transaction`, `product_quantity_rules`, `product_request`, `product_request_line_item`, `product_required`, `product_service_campaign`, `product_service_campaign_item`, `product_transfer`, `product_transfer_state`, `product_warranty_term`, `product_workspace`, `products`, `promotion_segments`, `promotions`, `promotions_workspace`, `propagation_policy`, `proposition`

**Q**: `qualifications`, `question_best`, `question_feed`, `queue`, `quick_text`, `quip`, `quip_sheet`, `quotes`

**R**: `radio_button`, `read_receipts`, `recent`, `recipe`, `record`, `record_create`, `record_delete`, `record_lookup`, `record_signature_task`, `record_update`, `recycle_bin`, `related_list`, `relationship`, `reply_text`, `report`, `report_type`, `resource_absence`, `resource_capacity`, `resource_preference`, `resource_skill`, `restriction_policy`, `return_order`, `return_order_line_item`, `reward`, `rtc_presence`

**S**: `sales_cadence`, `sales_cadence_target`, `sales_channel`, `sales_path`, `sales_value`, `salesforce_cms`, `scan_card`, `schedule_objective`, `scheduling_constraint`, `scheduling_policy`, `screen`, `search`, `section`, `segments`, `selling_model`, `serialized_product`, `serialized_product_transaction`, `service_appointment`, `service_appointment_capacity_usage`, `service_contract`, `service_crew`, `service_crew_member`, `service_report`, `service_request`, `service_request_detail`, `service_resource`, `service_territory`, `service_territory_location`, `service_territory_member`, `service_territory_policy`, `settings`, `shift`, `shift_pattern`, `shift_pattern_entry`, `shift_preference`, `shift_scheduling_operation`, `shift_template`, `shift_type`, `shipment`, `skill`, `skill_entity`, `skill_requirement`, `slack`, `slider`, `sms`, `snippet`, `snippets`, `sobject`, `sobject_collection`, `social`, `solution`, `sort`, `sort_policy`, `sossession`, `stage`, `stage_collection`, `steps`, `store`, `store_group`, `story`, `strategy`, `survey`, `swarm_request`, `swarm_session`, `system_and_global_variable`

**T**: `tableau`, `task`, `task2`, `team_member`, `template`, `text`, `text_template`, `textarea`, `textbox`, `thanks`, `thanks_loading`, `timesheet`, `timesheet_entry`, `timeslot`, `today`, `toggle`, `topic`, `topic2`, `tour`, `tour_check`, `trailhead`, `trailhead_alt`, `travel_mode`

**U**: `unified_health_score`, `unmatched`, `user`, `user_role`

**V**: `variable`, `variation_attribute_setup`, `variation_products`, `video`, `visit_templates`, `visits`, `visualforce_page`, `voice_call`

**W**: `waits`, `warranty_term`, `webcart`, `work_capacity_limit`, `work_capacity_usage`, `work_contract`, `work_forecast`, `work_order`, `work_order_item`, `work_plan`, `work_plan_rule`, `work_plan_template`, `work_plan_template_entry`, `work_queue`, `work_step`, `work_step_template`, `work_type`, `work_type_group`, `workforce_engagement`

### Common Icons by Category | 常用图标分类

| Category | Recommended Icons |
|----------|-------------------|
| CRM/Sales | `opportunity`, `lead`, `account`, `contact`, `campaign`, `quotes` |
| Contracts | `contract`, `contract_line_item`, `contract_payment` |
| Projects | `task`, `task2`, `assignment`, `timesheet`, `work_order` |
| HR/People | `people`, `employee`, `person_account`, `user`, `groups` |
| Finance | `budget`, `expense`, `expense_report`, `currency`, `payment_gateway` |
| Content | `article`, `document`, `file`, `knowledge`, `cms` |
| Dashboard | `dashboard`, `dashboard_ea`, `chart`, `report`, `insights` |
| Admin | `settings`, `apps_admin`, `connected_apps`, `data_model` |
| Communication | `email`, `sms`, `live_chat`, `announcement`, `call` |
| Home/Navigation | `home`, `agent_home`, `app`, `apps`, `kanban` |
| Quality/Inspection 质检巡检 | `observation_component`, `visits`, `case`, `work_order`, `procedure` |
| Equipment/Maintenance 设备维保 | `maintenance_asset`, `maintenance_plan`, `device`, `asset_object` |
| Service 服务 | `service_request`, `service_contract`, `service_report`, `work_order` |

### Custom Icons

```yaml
icon: custom_icon_name
```

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

### 1. Naming Conventions | 命名规范

#### ⚠️ Application Code & Filename Rule | 应用 code 与文件名规范

**The `code` value MUST exactly match the filename (without `.app.yml`). This is a hard requirement.**

**`code` 值必须与文件名（去掉 `.app.yml` 后缀）完全一致，这是强制要求。**

```yaml
# File: steedos_crm.app.yml
code: steedos_crm   # ✅ matches filename

# File: steedos_crm.app.yml
code: crm           # ❌ does NOT match filename
```

#### ⚠️ Application Code Prefix Rule | 应用 code 前缀规范

**All custom applications MUST have their `code` prefixed with `{org_code}_{project_code}_` to avoid naming conflicts.**

**所有自定义应用的 `code` 必须以 `{组织简码}_{项目简码}_` 开头，防止命名冲突。**

Format: `{org_code}_{project_code}_{app_name}`

| Part | Description | Example |
|------|-------------|---------|
| `org_code` | Organization abbreviation (2–6 chars, lowercase) | `steedos` |
| `project_code` | Project abbreviation (2–6 chars, lowercase) | `crm` |
| `app_name` | App business name (snake_case) | `app` |

```yaml
# ✅ Good
name: CRM
code: steedos_crm_app

name: HR Management
code: acme_hr_app

# ❌ Bad — no prefix, risks conflict
name: Contract Management
code: contracts
```

**⚠️ When a user does not specify a prefix, ASK for their organization code and project code before generating app files. Do NOT invent a prefix.**

**⚠️ 如果用户未指定前缀，在生成应用文件前必须询问其组织简码和项目简码，不得自行编造前缀。**

### 2. Tab Organization with Groups

Group related tabs using `tab_groups` and `tab_items`:

使用 `tab_groups` 和 `tab_items` 对标签进行分组：

```yaml
tabs:
  - contracts
  - customers
  - contract_items
  - contract_approvals
  - contract_templates

tab_groups:
  - group_name: 业务
    default_open: true
  - group_name: 配置
    default_open: false

tab_items:
  contracts:
    group: 业务
    index: 1
  customers:
    group: 业务
    index: 2
  contract_items:
    group: 业务
    index: 3
  contract_approvals:
    group: 业务
    index: 4
  contract_templates:
    group: 配置
    index: 1
```

### 3. Always Enable Sidebar

Always set `showSidebar: true` for proper navigation:

始终设置 `showSidebar: true` 以确保正确的导航：

```yaml
showSidebar: true
mobile: true
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

**The `icon_slds` value MUST exist in the [valid icon_slds values list](#valid-icon_slds-values--有效的-icon_slds-值). Never invent icon names. Use `custom` or `record` if no specific icon fits.** Common mappings: 质检/检验→`observation_component`, 巡检→`visits`, 设备→`maintenance_asset`, 工单→`work_order`, 审批→`approval`

**`icon_slds` 值必须存在于[有效值列表](#valid-icon_slds-values--有效的-icon_slds-值)中，严禁编造。** 常见映射：质检→`observation_component`，巡检→`visits`，设备→`maintenance_asset`，工单→`work_order`，审批→`approval`

```yaml
# Business apps
icon_slds: contract      # Contracts
icon_slds: opportunity   # Sales
icon_slds: account       # Customers
icon_slds: orders        # Orders

# System apps
icon_slds: settings      # Configuration
icon_slds: dashboard     # Analytics
icon_slds: apps_admin    # Administration
```

## Common Patterns | 常见模式

### CRM Application

```yaml
# File: steedos_crm.app.yml
name: CRM 客户关系管理
code: steedos_crm
description: 客户关系管理系统
icon_slds: opportunity
is_creator: true
showSidebar: true
mobile: true
visible: true
sort: 100

tabs:
  - steedos_crm_overview
  - steedos_crm_leads
  - steedos_crm_accounts
  - steedos_crm_contacts
  - steedos_crm_opportunities
  - steedos_crm_activities
  - steedos_crm_quotes
  - steedos_crm_contracts
  - steedos_crm_products
  - steedos_crm_sales_targets

tab_groups:
  - group_name: 概览
    default_open: true
  - group_name: 销售过程
    default_open: true
  - group_name: 商务管理
    default_open: true
  - group_name: 基础数据
    default_open: true

tab_items:
  steedos_crm_overview:
    group: 概览
    index: 1
  steedos_crm_leads:
    group: 销售过程
    index: 1
  steedos_crm_accounts:
    group: 销售过程
    index: 2
  steedos_crm_contacts:
    group: 销售过程
    index: 3
  steedos_crm_opportunities:
    group: 销售过程
    index: 4
  steedos_crm_activities:
    group: 销售过程
    index: 5
  steedos_crm_quotes:
    group: 商务管理
    index: 1
  steedos_crm_contracts:
    group: 商务管理
    index: 2
  steedos_crm_products:
    group: 基础数据
    index: 1
  steedos_crm_sales_targets:
    group: 基础数据
    index: 2
```

### Project Management Application

```yaml
name: Project Management
code: projects
description: Track projects, tasks, and resources
icon_slds: task
color: green
is_creator: true
showSidebar: true
mobile: true
visible: true
sort: 150
tabs:
  - projects
  - tasks
  - milestones
  - time_entries
tab_groups:
  - group_name: 项目
    default_open: true
tab_items:
  projects:
    group: 项目
    index: 1
  tasks:
    group: 项目
    index: 2
  milestones:
    group: 项目
    index: 3
  time_entries:
    group: ''
    index: 4
```

### HR Management Application

```yaml
name: Human Resources
code: hr
description: Employee and HR management
icon_slds: people
color: purple
is_creator: true
showSidebar: true
mobile: true
visible: true
sort: 200
permission_sets:
  - admin
  - hr_manager
tabs:
  - employees
  - departments
  - positions
  - attendance
  - leave_requests
tab_groups:
  - group_name: 人事
    default_open: true
  - group_name: 考勤
    default_open: true
tab_items:
  employees:
    group: 人事
    index: 1
  departments:
    group: 人事
    index: 2
  positions:
    group: 人事
    index: 3
  attendance:
    group: 考勤
    index: 1
  leave_requests:
    group: 考勤
    index: 2
```

## Internationalization | 国际化

Application names are translated using `.translation.yml` files. See the [translations skill](../translations/SKILL.md) for details.

应用名称通过 `.translation.yml` 文件翻译。详见[国际化 skill](../translations/SKILL.md)。

```yaml
# applications/contracts.app.yml — label follows user's prompt language
name: 合同管理
code: contracts

# objectTranslations are NOT used for apps.
# Use translations/en.translation.yml for app name translation:
# CustomLabels or app-level translation entries.
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

- [Object Definition](../objects/SKILL.md)
- [Micro Pages](../micro-pages/SKILL.md)
- [Object Permissions](../object-permissions/SKILL.md)
- [Salesforce Lightning Icons](https://www.lightningdesignsystem.com/icons/)
- [Steedos Documentation](https://docs.steedos.com/)
