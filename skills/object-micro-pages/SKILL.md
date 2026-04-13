---
name: object-micro-pages
description: |
  Create customizable record detail pages embedded within Steedos object
records. Use this skill to build enhanced layouts with custom components and
rich interactions beyond standard record pages. Covers page types (detail,
dashboard, form), page definition in objects/[object]/pages/, Amis schema
configuration, page assignment to objects, and conditional page display.
Includes examples for detail pages, dashboards, forms, and analytics views.
---
# Steedos Object Micro Pages | Steedos 对象微页面

## Overview | 概述

Object micro pages are customizable record detail pages that can be embedded within object records. They provide enhanced layouts, custom components, and rich interactions beyond standard record pages.

对象微页面是可自定义的记录详情页面,可以嵌入到对象记录中。它们提供增强的布局、自定义组件和丰富的交互,超越标准记录页面。

## File Location | 文件位置

Micro pages are defined in the object's pages folder:

微页面在对象的 pages 文件夹中定义:

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            └── orders/
                ├── orders.object.yml
                └── pages/
                    ├── order_detail.page.yml       # Custom detail page
                    └── order_dashboard.page.yml    # Dashboard page
```

## Page Definition Structure | 页面定义结构

```yaml
# objects/orders/pages/order_detail.page.yml
name: order_detail
label: Order Details
label_zh: 订单详情
type: page
object: orders                    # Associated object
page_type: detail                 # detail, dashboard, form
is_system: false
visible: true

schema:
  type: page
  title: Order Details
  body:
    # Amis schema (see 13-micro-pages.md for details)
```

## Page Types | 页面类型

### 1. Detail Page | 详情页面

Replace or enhance the default record detail view:

替换或增强默认记录详情视图:

```yaml
name: customer_detail
label: Customer Detail
type: page
object: customers
page_type: detail
schema:
  type: page
  body:
    - type: service
      api: /api/v4/customers/${id}
      body:
        # Custom layout
        - type: grid
          columns:
            # Left column - basic info
            - type: panel
              title: Basic Information
              body:
                - type: static
                  label: Name
                  name: name
                - type: static
                  label: Code
                  name: code
                - type: static
                  label: Type
                  name: type
                - type: static
                  label: Status
                  name: status

            # Right column - contact info
            - type: panel
              title: Contact Information
              body:
                - type: static
                  label: Email
                  name: email
                - type: static
                  label: Phone
                  name: phone
                - type: static
                  label: Address
                  name: address

        # Statistics section
        - type: grid
          className: mt-4
          columns:
            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Total Orders</div>
                      <div class="text-3xl font-bold">${total_orders}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Total Revenue</div>
                      <div class="text-3xl font-bold">¥${total_revenue}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Last Order</div>
                      <div class="text-xl">${last_order_date | date:YYYY-MM-DD}</div>
                    </div>

        # Related records
        - type: tabs
          className: mt-4
          tabs:
            - title: Orders
              body:
                - type: crud
                  api: /api/v4/orders?filters=[["customer","=","${id}"]]
                  syncLocation: false
                  columns:
                    - name: order_number
                      label: Order Number
                    - name: order_date
                      label: Order Date
                      type: date
                    - name: total_amount
                      label: Amount
                      type: number
                      prefix: ¥
                    - name: status
                      label: Status

            - title: Contacts
              body:
                - type: crud
                  api: /api/v4/contacts?filters=[["account","=","${id}"]]
                  syncLocation: false
                  columns:
                    - name: name
                      label: Name
                    - name: title
                      label: Title
                    - name: email
                      label: Email
                    - name: phone
                      label: Phone
```

### 2. Dashboard Page | 仪表板页面

Create analytics and reporting pages for records:

为记录创建分析和报表页面:

```yaml
name: order_dashboard
label: Order Dashboard
label_zh: 订单仪表板
type: page
object: orders
page_type: dashboard

schema:
  type: page
  title: Order Analytics
  body:
    # Top metrics
    - type: service
      api: /api/v4/orders/${id}/stats
      body:
        - type: grid
          columns:
            - type: card
              className: bg-blue-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Order Value</div>
                      <div class="text-3xl font-bold text-blue-600">¥${total_amount}</div>
                    </div>

            - type: card
              className: bg-green-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Items Count</div>
                      <div class="text-3xl font-bold text-green-600">${item_count}</div>
                    </div>

            - type: card
              className: bg-purple-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Status</div>
                      <div class="text-xl text-purple-600">${status}</div>
                    </div>

    # Charts
    - type: grid
      className: mt-4
      columns:
        - type: card
          header:
            title: Order Items Breakdown
          body:
            - type: chart
              api: /api/v4/orders/${id}/items-breakdown
              config:
                series:
                  - type: pie
                    radius: 60%

        - type: card
          header:
            title: Payment Timeline
          body:
            - type: chart
              api: /api/v4/orders/${id}/payment-timeline
              config:
                xAxis:
                  type: category
                yAxis:
                  type: value
                series:
                  - type: line
                    smooth: true

    # Order items table
    - type: card
      className: mt-4
      header:
        title: Order Items
      body:
        - type: crud
          api: /api/v4/order_items?filters=[["order","=","${id}"]]
          syncLocation: false
          columns:
            - name: product.name
              label: Product
            - name: quantity
              label: Quantity
            - name: unit_price
              label: Unit Price
              type: number
              prefix: ¥
            - name: total_price
              label: Total
              type: number
              prefix: ¥
```

### 3. Form Page | 表单页面

Custom create/edit forms with enhanced layouts:

使用增强布局的自定义创建/编辑表单:

```yaml
name: order_form
label: Order Form
type: page
object: orders
page_type: form

schema:
  type: page
  title: Create Order
  body:
    - type: form
      api: post:/api/v4/orders
      redirect: /app/orders/view/${id}
      body:
        # Customer section
        - type: fieldSet
          title: Customer Information
          body:
            - type: select
              name: customer
              label: Customer
              label_zh: 客户
              source: /api/v4/customers
              labelField: name
              valueField: _id
              required: true

            - type: input-text
              name: customer_contact
              label: Contact
              label_zh: 联系人

            - type: input-text
              name: customer_phone
              label: Phone
              label_zh: 电话

        # Order information
        - type: fieldSet
          title: Order Information
          body:
            - type: input-date
              name: order_date
              label: Order Date
              label_zh: 订单日期
              required: true
              value: ${TODAY()}

            - type: input-date
              name: delivery_date
              label: Delivery Date
              label_zh: 交付日期
              required: true

            - type: select
              name: priority
              label: Priority
              label_zh: 优先级
              options:
                - label: Low
                  value: low
                - label: Medium
                  value: medium
                - label: High
                  value: high
              value: medium

        # Order items
        - type: fieldSet
          title: Order Items
          body:
            - type: combo
              name: items
              label: Items
              multiple: true
              draggable: true
              items:
                - type: select
                  name: product
                  label: Product
                  source: /api/v4/products
                  labelField: name
                  valueField: _id
                  required: true

                - type: input-number
                  name: quantity
                  label: Quantity
                  required: true
                  min: 1
                  value: 1

                - type: input-number
                  name: unit_price
                  label: Unit Price
                  required: true
                  min: 0
                  prefix: ¥

                - type: static
                  name: total
                  label: Total
                  tpl: ¥${quantity * unit_price}

        # Totals
        - type: fieldSet
          title: Totals
          body:
            - type: static
              name: subtotal
              label: Subtotal
              label_zh: 小计
              tpl: ¥${SUM(items, 'quantity * unit_price')}

            - type: input-number
              name: tax_rate
              label: Tax Rate (%)
              label_zh: 税率 (%)
              value: 13
              suffix: '%'

            - type: static
              name: tax_amount
              label: Tax Amount
              label_zh: 税额
              tpl: ¥${subtotal * tax_rate / 100}

            - type: static
              name: total_amount
              label: Total Amount
              label_zh: 总金额
              tpl: ¥${subtotal + tax_amount}
              className: text-2xl font-bold

        # Notes
        - type: input-textarea
          name: notes
          label: Notes
          label_zh: 备注
          rows: 4
```

## Page Assignment | 页面分配

### Assign Page to Object | 将页面分配给对象

Define which page to use for different scenarios:

定义不同场景使用哪个页面:

```yaml
# objects/orders.object.yml
name: orders
label: Order

# Use custom detail page
detail_page: order_detail

# Use custom form page for create/edit
form_page: order_form

# Additional pages accessible via tabs
pages:
  dashboard:
    name: order_dashboard
    label: Analytics
    label_zh: 分析
```

### Conditional Page Display | 条件页面显示

```yaml
# Only show for certain users or record types
detail_page:
  name: order_detail
  visible: !!js/function |
    function(record, user) {
      // Show custom page only for managers
      return user.roles.includes('manager');
    }
```

## Complete Examples | 完整示例

### Example 1: Project Detail Page | 项目详情页面

```yaml
name: project_detail
label: Project Details
type: page
object: projects
page_type: detail

schema:
  type: page
  title: ${name}
  toolbar:
    - type: button
      label: Edit
      actionType: url
      url: /app/projects/edit/${id}
    - type: button
      label: Close Project
      level: danger
      actionType: ajax
      api: post:/api/v4/projects/${id}/close
      confirmText: Are you sure you want to close this project?

  body:
    # Project overview
    - type: service
      api: /api/v4/projects/${id}
      body:
        - type: panel
          title: Project Overview
          body:
            - type: grid
              columns:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="mb-2"><strong>Project Name:</strong> ${name}</div>
                      <div class="mb-2"><strong>Code:</strong> ${code}</div>
                      <div class="mb-2"><strong>Manager:</strong> ${manager.name}</div>
                      <div class="mb-2"><strong>Status:</strong> ${status}</div>
                      <div class="mb-2"><strong>Start Date:</strong> ${start_date | date:YYYY-MM-DD}</div>
                      <div class="mb-2"><strong>End Date:</strong> ${end_date | date:YYYY-MM-DD}</div>
                    </div>

                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="mb-4">
                        <div class="text-gray-600 mb-2">Progress</div>
                        <div class="progress">
                          <div class="progress-bar bg-success"
                               style="width: ${progress}%">${progress}%</div>
                        </div>
                      </div>
                      <div class="mb-2"><strong>Budget:</strong> ¥${budget}</div>
                      <div class="mb-2"><strong>Actual Cost:</strong> ¥${actual_cost}</div>
                      <div class="mb-2"><strong>Team Size:</strong> ${team_members.length}</div>
                    </div>

        # Tasks section
        - type: panel
          className: mt-4
          title: Tasks
          body:
            - type: crud
              api: /api/v4/tasks?filters=[["project","=","${id}"]]
              syncLocation: false
              headerToolbar:
                - type: button
                  label: New Task
                  icon: fa fa-plus
                  actionType: dialog
                  dialog:
                    title: Create Task
                    body:
                      type: form
                      api: post:/api/v4/tasks
                      body:
                        - type: hidden
                          name: project
                          value: ${id}
                        - type: input-text
                          name: name
                          label: Task Name
                          required: true
                        - type: select
                          name: assigned_to
                          label: Assigned To
                          source: /api/v4/users
                        - type: input-date
                          name: due_date
                          label: Due Date
              columns:
                - name: name
                  label: Task Name
                - name: assigned_to.name
                  label: Assigned To
                - name: status
                  label: Status
                - name: priority
                  label: Priority
                - name: due_date
                  label: Due Date
                  type: date

        # Team members
        - type: panel
          className: mt-4
          title: Team Members
          body:
            - type: cards
              api: /api/v4/users?filters=[["_id","in",${team_members}]]
              card:
                body:
                  - type: tpl
                    tpl: |
                      <div class="p-3">
                        <div class="font-bold">${name}</div>
                        <div class="text-sm text-gray-600">${email}</div>
                      </div>
```

### Example 2: Customer 360 View | 客户360视图

```yaml
name: customer_360
label: Customer 360
label_zh: 客户360视图
type: page
object: customers
page_type: detail

schema:
  type: page
  title: ${name}
  body:
    - type: service
      api: /api/v4/customers/${id}/complete-view
      body:
        # Customer header
        - type: panel
          body:
            - type: grid
              columns:
                - lg: 8
                  body:
                    - type: tpl
                      tpl: |
                        <div class="p-4">
                          <h2 class="text-2xl font-bold">${name}</h2>
                          <div class="mt-2">
                            <span class="badge badge-${status_color}">${status}</span>
                            <span class="badge badge-info ml-2">${rating}</span>
                          </div>
                          <div class="mt-3">
                            <div><i class="fa fa-envelope"></i> ${email}</div>
                            <div><i class="fa fa-phone"></i> ${phone}</div>
                            <div><i class="fa fa-map-marker"></i> ${address}</div>
                          </div>
                        </div>

                - lg: 4
                  body:
                    - type: tpl
                      tpl: |
                        <div class="p-4 text-center">
                          <div class="text-gray-600">Lifetime Value</div>
                          <div class="text-3xl font-bold text-green-600">¥${lifetime_value}</div>
                          <div class="mt-3 text-gray-600">Risk Level</div>
                          <div class="text-xl">${risk_level}</div>
                        </div>

        # Key metrics
        - type: grid
          className: mt-4
          columns:
            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Total Orders</div>
                      <div class="text-2xl font-bold">${total_orders}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Average Order</div>
                      <div class="text-2xl font-bold">¥${average_order}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Last Order</div>
                      <div class="text-xl">${last_order_date | date:YYYY-MM-DD}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Open Tickets</div>
                      <div class="text-2xl font-bold text-orange-600">${open_tickets}</div>
                    </div>

        # Tabs for different views
        - type: tabs
          className: mt-4
          tabs:
            - title: Orders
              body:
                - type: crud
                  api: /api/v4/orders?filters=[["customer","=","${id}"]]
                  syncLocation: false
                  columns:
                    - name: order_number
                      label: Order #
                    - name: order_date
                      label: Date
                      type: date
                    - name: total_amount
                      label: Amount
                      type: number
                      prefix: ¥
                    - name: status
                      label: Status

            - title: Invoices
              body:
                - type: crud
                  api: /api/v4/invoices?filters=[["customer","=","${id}"]]
                  syncLocation: false
                  columns:
                    - name: invoice_number
                      label: Invoice #
                    - name: invoice_date
                      label: Date
                      type: date
                    - name: amount
                      label: Amount
                      type: number
                      prefix: ¥
                    - name: status
                      label: Status

            - title: Contacts
              body:
                - type: crud
                  api: /api/v4/contacts?filters=[["account","=","${id}"]]
                  syncLocation: false
                  columns:
                    - name: name
                      label: Name
                    - name: title
                      label: Title
                    - name: email
                      label: Email
                    - name: phone
                      label: Phone

            - title: Activities
              body:
                - type: timeline
                  items:
                    - time: ${created}
                      title: Customer Created
                      detail: Initial registration
```

## Best Practices | 最佳实践

### 1. Use Appropriate Page Types | 使用适当的页面类型

- `detail`: For viewing record information
- `dashboard`: For analytics and reporting
- `form`: For data entry

### 2. Keep Pages Focused | 保持页面专注

Each page should have a clear purpose and not try to do too much.

每个页面应该有明确的目的,不要试图做太多事情。

### 3. Optimize Performance | 优化性能

- Use service components to load data on demand
- Implement pagination for large datasets
- Cache frequently accessed data

### 4. Responsive Design | 响应式设计

Use grid layouts and responsive classes to ensure pages work on all devices.

使用网格布局和响应式类确保页面在所有设备上正常工作。

### 5. Provide Navigation | 提供导航

Include breadcrumbs, tabs, and clear navigation to help users find information.

包含面包屑、标签页和清晰的导航,帮助用户查找信息。

## References | 参考资料

- [13-micro-pages.md](./13-micro-pages.md) - Standalone micro pages
- [04-ui-pages.prompt.md](../.github/prompts/customer/04-ui-pages.prompt.md) - Amis UI guide
- [05-objects.md](./05-objects.md) - Object definitions
- [Steedos Pages Documentation](https://docs.steedos.com/)
- [Amis Documentation](https://aisuda.bce.baidu.com/amis/)
