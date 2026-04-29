---
name: steedos-objects
description: |
  TRIGGER when: user creates/edits a `.object.yml` or `.listview.yml` file;
  asks how to define a new Steedos object (table), configure object-level
  settings (label, icon, enable_files, enable_approvals, enable_audit), set up
  object relationships (extend, base), or asks about the overall object folder
  structure (objects/{name}/ with fields/, listviews/, permissions/, buttons/
  subfolders); asks how to define a list view (table view), configure columns,
  filters, sort order, searchable fields, mobile columns, view types (grid,
  calendar, kanban), crud_mode, shared/shared_to, or filter_scope.
  Also trigger when user asks "how do I create a new object" or "what goes in
  .object.yml" or "how do I create a list view".
  SKIP: user is asking about a specific sub-resource — use steedos-object-fields
  (fields), steedos-object-permissions (permissions), steedos-object-buttons
  (buttons); user wants server-side triggers/functions — use steedos-server-logic.
  Defines Steedos object data models (.object.yml) and list views (.listview.yml).
  Covers object properties, feature flags, inheritance, naming conventions,
  multi-file layout, list view columns, filters, sort, and sharing settings.
---

# Steedos Objects | Steedos 对象定义

## Overview | 概述

Steedos objects are the foundation of your data model. Each object represents a database table. Objects are defined using `.object.yml` files, with related metadata (fields, list views, permissions, buttons) in separate files within subfolders.

Steedos 对象是数据模型的基础。每个对象代表一个数据库表。对象使用 `.object.yml` 文件定义，相关元数据（字段、列表视图、权限、按钮）在子文件夹的独立文件中定义。

**IMPORTANT**: When adding lookup/master_detail fields that reference built-in objects, you MUST use the correct API names. Built-in object names often differ from common expectations — e.g. Department is `organizations` (not `departments`), Division is `company` (not `divisions`). Load the `steedos-builtin-objects` skill for the authoritative name list.

## File Location | 文件位置

### Modern Format (Recommended) | 现代格式（推荐）

Each object has its own folder with separate metadata files:

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            └── orders/
                ├── orders.object.yml           # Object definition
                ├── fields/                      # Field definitions
                │   ├── order_number.field.yml
                │   ├── customer.field.yml
                │   ├── status.field.yml
                │   └── total_amount.field.yml
                ├── listviews/                   # List view definitions
                │   ├── all.listview.yml
                │   ├── my_orders.listview.yml
                │   └── pending.listview.yml
                ├── permissions/                 # Permission definitions
                │   ├── user.permission.yml
                │   └── admin.permission.yml
                └── buttons/                     # Button definitions
                    ├── submit_order.button.yml
                    └── standard_delete.button.yml
```

**Note**: Triggers and functions are in separate top-level folders:
```
main/default/
├── triggers/
│   └── orders_validate.trigger.yml
└── functions/
    └── approve_order.function.yml
```

## Object Definition | 对象定义

### Minimal Object | 最小对象定义

```yaml
# objects/products/products.object.yml
name: products
label: 产品
custom: true
```

Every object must have a name field. At minimum, define a `name` field:

每个对象必须有一个名称字段。至少需要定义一个 `name` 字段：

```yaml
# objects/products/fields/name.field.yml
name: name
type: text
label: 产品名称
required: true
searchable: true
```

Fields, list views, and permissions are defined in separate files under the object folder.

### Complete Object | 完整对象定义

```yaml
# objects/orders/orders.object.yml
name: orders
label: 订单
icon: orders
custom: true
version: 2
is_enable: true
enable_search: true
enable_files: true
enable_api: true
enable_audit: true
enable_trash: true
enable_enhanced_lookup: true
enable_inline_edit: true
enable_dataloader: true
```

## Core Properties | 核心属性

### Basic Properties | 基本属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ Object API name (snake_case). MUST NOT be omitted.** |
| `label` | string | Yes | Display label (use the language of the user's prompt) |
| `icon` | string | No | **MUST be a value from the [Valid Icon Values](#valid-icon-values--有效的-icon-值) list below. Do NOT invent icon names.** |
| `custom` | boolean | No | Mark as custom object |
| `version` | number | No | Object schema version |
| `is_enable` | boolean | No | Object is active |

### Feature Flags | 功能开关

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enable_search` | boolean | true | Enable global search |
| `enable_files` | boolean | false | Enable file attachments |
| `enable_api` | boolean | true | Enable API access |
| `enable_audit` | boolean | false | Enable field history tracking |
| `enable_trash` | boolean | true | Enable recycle bin |
| `enable_enhanced_lookup` | boolean | true | Enhanced lookup UI |
| `enable_inline_edit` | boolean | false | Inline editing in list views |
| `enable_dataloader` | boolean | false | Bulk operation support |
| `enable_workflow` | boolean | false | Workflow support |
| `enable_lock_detail` | boolean | false | Record locking |

### Field Groups | 字段分组

Organize fields into collapsible groups in the UI:

```yaml
# objects/orders/orders.object.yml
field_groups:
  - group_name: Basic Information
  - group_name: Shipping Details
    collapsed: true
  - group_name: Approval Info
    collapsed: true
    visible_on: "{{status != 'draft'}}"
```

## Name Field (Required) | 名称字段（必填）

Every object **must** have a name field — this is the human-readable identifier displayed in lookup results, related lists, breadcrumbs, and record titles. There are two ways to provide it:

每个对象**必须**有一个名称字段——它是在查找结果、相关列表、面包屑和记录标题中显示的人类可读标识。有两种方式提供：

### Option 1: Define a `name` field (default) | 方式一：定义 `name` 字段（默认）

If you define a field with `name: name`, it is automatically used as the name field:

```yaml
# objects/products/fields/name.field.yml
name: name
type: text
label: 产品名称
required: true
searchable: true
index: true
```

### Option 2: Use `is_name: true` on another field | 方式二：在其他字段上设置 `is_name: true`

When the record title is not a simple text field (e.g., an autonumber or a lookup), mark a different field with `is_name: true`:

当记录标题不是简单文本字段时（例如自动编号或查找字段），在其他字段上标记 `is_name: true`：

```yaml
# objects/orders/fields/order_number.field.yml
name: order_number
type: autonumber
label: 订单号
formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
is_name: true
readonly: true
sort_no: 100
```

```yaml
# objects/permission_objects/fields/permission_set.field.yml
name: permission_set
type: master_detail
label: 权限集
reference_to: permission_set
required: true
is_name: true
```

**Resolution priority**: `is_name: true` takes precedence over a field named `name`. If neither exists, the object will have no display name and lookups/related lists will show blank values.

**优先级规则**：`is_name: true` 优先于名为 `name` 的字段。如果两者都不存在，对象将没有显示名称，查找/相关列表将显示空白值。

## Standard Fields | 标准字段

Steedos automatically adds these system fields to every object (no need to define):

| Field | Type | Description |
|-------|------|-------------|
| `_id` | text | Record ID (primary key) |
| `name` | text | Record name/title (see Name Field section above) |
| `owner` | lookup → users | Record owner |
| `space` | lookup → spaces | Workspace ID |
| `created` | datetime | Creation date |
| `created_by` | lookup → users | Creator |
| `modified` | datetime | Last modified date |
| `modified_by` | lookup → users | Last modifier |
| `company_id` | lookup → company | Primary company |
| `company_ids` | lookup → company (multiple) | Associated companies |

## Complete Example | 完整示例

### Object with Separate Files | 带独立文件的对象

**Object definition:**
```yaml
# objects/orders/orders.object.yml
name: orders
label: 订单
icon: orders
custom: true
version: 2
is_enable: true
enable_search: true
enable_files: true
enable_api: true
enable_audit: true
enable_trash: true
enable_enhanced_lookup: true
field_groups:
  - group_name: Basic Information
  - group_name: Financial
  - group_name: Shipping
    collapsed: true
```

**Field files:**
```yaml
# objects/orders/fields/order_number.field.yml
name: order_number
type: autonumber
label: 订单号
formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
is_name: true
readonly: true
sort_no: 100
```

```yaml
# objects/orders/fields/customer.field.yml
name: customer
type: lookup
label: 客户
reference_to: customers
required: true
index: true
sort_no: 200
```

```yaml
# objects/orders/fields/status.field.yml
name: status
type: select
label: 状态
required: true
index: true
sort_no: 300
options:
  - label: 草稿
    value: draft
  - label: 已提交
    value: submitted
  - label: 已批准
    value: approved
  - label: 已完成
    value: completed
  - label: 已取消
    value: cancelled
```

```yaml
# objects/orders/fields/total_amount.field.yml
name: total_amount
type: currency
label: 总金额
scale: 2
readonly: true
group: Financial
sort_no: 400
```

**List view file:**
```yaml
# objects/orders/listviews/all.listview.yml
name: all
label: 所有订单
is_enable: true
shared: true
filter_scope: space
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: status
  - field: created
sort:
  - field_name: created
    order: desc
searchable_fields:
  - field: order_number
  - field: customer
```

**Permission file:**
```yaml
# objects/orders/permissions/user.permission.yml
name: orders.user
permission_set_id: user
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: false
viewAllRecords: true
modifyAllRecords: false
```

**Button file:**
```yaml
# objects/orders/buttons/submit_order.button.yml
name: submit_order
label: 提交
type: amis_button
on: record_only
is_enable: true
visible: true
amis_schema: |-
  {
    "type": "button",
    "label": "Submit",
    "level": "primary",
    "visibleOn": "${status == 'draft'}",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "ajax",
            "api": {
              "url": "/api/v1/orders/functions/submit_order",
              "method": "post",
              "requestAdaptor": "api.data = { id: api.body.recordId }",
              "messages": { "success": "Order submitted" }
            }
          },
          { "actionType": "broadcast", "args": { "eventName": "steedos:record:reload" } }
        ]
      }
    }
  }
```

## Naming Conventions | 命名规范

### ⚠️ Object Name Prefix Rule | 对象名称前缀规范

**All custom objects MUST be prefixed with `{org_code}_{project_code}_` to avoid naming conflicts across packages and organizations.**

**所有自定义对象的 `name` 必须以 `{组织简码}_{项目简码}_` 开头，防止不同包和组织间的命名冲突。**

Format: `{org_code}_{project_code}_{object_name}`

| Part | Description | Example |
|------|-------------|---------|
| `org_code` | Organization abbreviation (2–6 chars, lowercase) | `steedos` |
| `project_code` | Project abbreviation (2–6 chars, lowercase) | `crm` |
| `object_name` | Object business name (snake_case, plural) | `contracts` |

```yaml
# ✅ Good — prefixed with org_code + project_code
name: steedos_crm_contracts
name: steedos_crm_customers
name: acme_hr_employees

# ❌ Bad — no prefix, risks conflict
name: contracts
name: customers
name: employees
```

**⚠️ When a user does not specify a prefix, ASK for their organization code and project code before generating object files. Do NOT invent a prefix.**

**⚠️ 如果用户未指定前缀，在生成对象文件前必须询问其组织简码和项目简码，不得自行编造前缀。**

### General Rules | 通用规则

```yaml
# Object names: lowercase, prefixed, plural, underscores for multi-word
name: steedos_crm_customers    # Good
name: steedos_crm_sales_orders # Good
name: customers                # Bad - missing prefix
name: SalesOrders              # Bad - no CamelCase
name: sales-orders             # Bad - no hyphens

# Field names: lowercase, underscores
customer_name          # Good
orderDate              # Bad - no camelCase
```

## Object Relationships | 对象关系

- **lookup**: One-to-many (no cascade delete)
- **master_detail**: Parent-child (cascade delete, child inherits sharing)

See the object-fields skill for detailed relationship field configuration.

## Icon Reference | 图标参考

**⚠️ CRITICAL: The `icon` value MUST be chosen from the valid icon list below. NEVER invent or guess icon names. If no icon matches the object's domain, use `custom` or `record` as a safe default.**

The object `icon` property uses Salesforce Lightning Design System (SLDS) icons — the same icon set as the application `icon_slds` property.

对象的 `icon` 属性使用 Salesforce Lightning Design System (SLDS) 图标——与应用的 `icon_slds` 属性使用相同的图标集。

**⚠️ 重要：`icon` 值必须从下方有效值列表中选取，严禁自行编造图标名称。如果没有匹配的图标，使用 `custom` 或 `record` 作为默认值。**

### Common Icons by Category | 常用图标分类

| Category | Recommended Icons |
|----------|-------------------|
| CRM/Sales | `opportunity`, `lead`, `account`, `contact`, `campaign`, `quotes` |
| Contracts | `contract`, `contract_line_item`, `contract_payment` |
| Projects | `task`, `task2`, `assignment`, `timesheet`, `work_order` |
| HR/People | `people`, `employee`, `person_account`, `user`, `groups` |
| Finance | `budget`, `expense`, `expense_report`, `currency`, `payment_gateway` |
| Content | `article`, `document`, `file`, `knowledge`, `cms` |
| Products | `product`, `products`, `pricebook`, `price_books`, `product_item` |
| Orders | `orders`, `order_item`, `fulfillment_order`, `shipment` |
| Dashboard | `dashboard`, `chart`, `report`, `insights`, `metrics` |
| Admin | `settings`, `apps_admin`, `connected_apps`, `data_model` |
| Communication | `email`, `sms`, `live_chat`, `announcement`, `call` |
| Approval | `approval`, `steps`, `process`, `flow` |
| Location | `location`, `address`, `store`, `instore_locations` |
| Quality/Inspection 质检巡检 | `observation_component`, `visits`, `case`, `work_order`, `procedure` |
| Equipment/Maintenance 设备维保 | `maintenance_asset`, `maintenance_plan`, `device`, `asset_object` |
| Service 服务 | `service_request`, `service_contract`, `service_report`, `work_order` |
| Generic | `record`, `app`, `custom`, `default`, `all` |

### Valid icon Values | 有效的 icon 值

**⚠️ ONLY the values listed below are valid. Any value NOT in this list will cause a broken icon. When in doubt, use `custom` or `record`.**

The following is the **complete and exhaustive** list of valid `icon` values (same as application `icon_slds`):

以下是 `icon` 的**完整且唯一**有效值列表（与应用的 `icon_slds` 相同），不在此列表中的值会导致图标无法显示：

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

### Usage Examples | 使用示例

```yaml
# CRM object
name: accounts
icon: account

# Order management
name: orders
icon: orders

# HR object
name: employees
icon: employee

# Approval process
name: process_definition
icon: approval

# Custom settings
name: app_settings
icon: settings
```

## Best Practices | 最佳实践

1. **Always define a name field**: Either a field named `name` or a field with `is_name: true` — without this, lookups and related lists show blank values
2. **Use separate files**: Put fields, listviews, permissions, and buttons in their own files for better version control
3. **Label follows user's language**: Write `label` in the language of the user's prompt. For internationalization, use the translations skill
4. **Add indexes**: Set `index: true` on frequently queried fields
5. **Choose valid icons ONLY**: The `icon` value **MUST** exist in the [valid icon values list](#valid-icon-values--有效的-icon-值). Never invent icon names. Use `custom` or `record` if no specific icon fits. Common mappings: 质检/检验→`observation_component`, 巡检→`visits`, 设备→`maintenance_asset`, 工单→`work_order`, 审批→`approval`
6. **Use field groups**: Organize related fields into collapsible groups
7. **Name objects as plurals**: `orders`, `customers`, `products` (not singular)

---

# List Views | 列表视图

## Overview | 概述

List views define how records are displayed in table format. Each view is a separate `.listview.yml` file in the object's `listviews/` subfolder.

## File Location | 文件位置

```
objects/
└── orders/
    └── listviews/
        ├── all.listview.yml
        ├── my_orders.listview.yml
        ├── pending_approval.listview.yml
        └── high_value.listview.yml
```

## List View Structure | 列表视图结构

```yaml
# objects/orders/listviews/all.listview.yml
name: all
label: 所有订单
is_enable: true
shared: true
shared_to: space
filter_scope: space
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: status
  - field: created
sort:
  - field_name: created
    order: desc
searchable_fields:
  - field: order_number
  - field: customer
mobile_columns:
  - field: order_number
  - field: status
```

## List View Properties | 列表视图属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ Unique view name. MUST NOT be omitted.** |
| `label` | string | Yes | Display label (use the language of the user's prompt) |
| `is_enable` | boolean | Yes | Enable/disable view |
| `crud_mode` | string | No | **⚠️ MUST be `table` (default) or `cards`. No other values are valid.** |
| `columns` | array | Yes | Displayed columns |
| `shared` | boolean | No | Share with all users |
| `shared_to` | string | No | **⚠️ MUST be one of: `mine` (default), `space`, `organizations`.** |
| `filter_scope` | string | Yes | **⚠️ MUST be `space` (all records, default) or `mine` (my records only).** |
| `filters` | array | No | Default filter conditions |
| `sort` | array | No | Default sort order (each item: `field_name` + `order`: **⚠️ `asc` or `desc`**) |
| `searchable_fields` | array | No | Full-text search fields |
| `mobile_columns` | array | No | Mobile-optimized columns |
| `extra_columns` | array | No | Hidden columns (available for formulas) |
| `scrolling_mode` | string | No | **⚠️ MUST be one of: `standard` (default), `virtual`, `infinite`.** |
| `show_count` | boolean | No | Show record count |

## Columns | 列配置

```yaml
columns:
  - field: name
  - field: description
    width: '300'
    wrap: true
```

## Filters | 筛选器

```yaml
# Single filter
filters:
  - ["status", "=", "active"]

# Multiple filters (AND)
filters:
  - ["status", "=", "active"]
  - ["total_amount", ">", 10000]

# Current user
filters:
  - ["owner", "=", "{userId}"]

# Date-based
filters:
  - ["created", ">=", "{last_n_days(7)}"]
```

### Filter Operators | 筛选运算符

| Operator | Description |
|----------|-------------|
| `=` | Equal |
| `!=` | Not equal |
| `>` | Greater than |
| `>=` | Greater than or equal |
| `<` | Less than |
| `<=` | Less than or equal |
| `contains` | Contains text |
| `startswith` | Starts with |
| `in` | In list |
| `notin` | Not in list |
| `between` | Between range |

## Sorting | 排序

```yaml
sort:
  - field_name: status
    order: asc
  - field_name: created
    order: desc
```

## List View Examples | 列表视图示例

### All Records View | 全部记录视图
```yaml
# objects/orders/listviews/all.listview.yml
name: all
label: 所有订单
is_enable: true
shared: true
shared_to: space
filter_scope: space
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: order_date
  - field: total_amount
  - field: status
  - field: owner
  - field: created
sort:
  - field_name: created
    order: desc
searchable_fields:
  - field: order_number
  - field: customer
mobile_columns:
  - field: order_number
  - field: total_amount
  - field: status
```

### My Records View | 我的记录视图
```yaml
# objects/orders/listviews/my_orders.listview.yml
name: my_orders
label: 我的订单
is_enable: true
shared: true
filter_scope: mine
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: status
sort:
  - field_name: created
    order: desc
```

### Filtered View | 筛选视图
```yaml
# objects/orders/listviews/pending_approval.listview.yml
name: pending_approval
label: 待审批
is_enable: true
shared: true
filter_scope: space
crud_mode: table
filters:
  - ["status", "=", "submitted"]
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: submitted_at
  - field: owner
sort:
  - field_name: submitted_at
    order: asc
```

## List View Best Practices | 列表视图最佳实践

1. **Limit columns**: 5-8 columns for readability
2. **Add searchable_fields**: Enable search on key fields
3. **Mobile columns**: Only essential fields for mobile
4. **Meaningful filters**: Create views that match common workflows
5. **Default sort**: Always specify a meaningful sort order
