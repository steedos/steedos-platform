---
name: micro-pages
description: |
  Build standalone custom pages using Amis low-code framework, independent of
object records. Use this skill to create dashboards, reports, custom forms,
and any custom UI. Covers page definition structure in main/default/pages/,
Amis schema configuration, service components for dynamic data, responsive
design with grids, chart integration, form wizards, and tab navigation.
Includes complete examples for sales dashboards, reports, custom forms, and
analytics.
---
# Steedos Standalone Micro Pages | Steedos 独立微页面

## Overview | 概述

Standalone micro pages are custom pages built with Amis low-code framework that are not tied to specific object records. They can serve as dashboards, reports, custom forms, or any custom UI. Pages are defined using YAML/JSON configuration.

独立微页面是使用 Amis 低代码框架构建的自定义页面,不绑定到特定对象记录。它们可以用作仪表板、报表、自定义表单或任何自定义 UI。页面使用 YAML/JSON 配置定义。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── pages/
            ├── dashboard.page.yml          # Dashboard page
            ├── reports.page.yml            # Reports page
            └── custom_form.page.yml        # Custom form page
```

## Page Definition Structure | 页面定义结构

### Basic Structure | 基本结构

```yaml
name: sales_dashboard
label: Sales Dashboard
label_zh: 销售仪表板
type: page
is_system: false
visible: true

schema:
  type: page
  title: Sales Overview
  body:
    # Page content using Amis schema
```

## Complete Examples | 完整示例

### Example 1: Sales Dashboard | 销售仪表板

```yaml
name: sales_dashboard
label: Sales Dashboard
label_zh: 销售仪表板
type: page
visible: true

schema:
  type: page
  title: Sales Dashboard
  title_zh: 销售仪表板
  body:
    # Top metrics cards
    - type: service
      api: /api/v4/stats/sales-summary
      body:
        - type: grid
          columns:
            - type: card
              className: bg-blue-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Today's Sales</div>
                      <div class="text-gray-600 text-sm">今日销售额</div>
                      <div class="text-3xl font-bold text-blue-600 mt-2">¥${today_sales}</div>
                      <div class="text-sm mt-2">
                        <span class="${today_growth >= 0 ? 'text-green-600' : 'text-red-600'}">
                          ${today_growth >= 0 ? '↑' : '↓'} ${Math.abs(today_growth)}%
                        </span>
                        <span class="text-gray-500 ml-2">vs yesterday</span>
                      </div>
                    </div>

            - type: card
              className: bg-green-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">This Month</div>
                      <div class="text-gray-600 text-sm">本月销售额</div>
                      <div class="text-3xl font-bold text-green-600 mt-2">¥${month_sales}</div>
                      <div class="text-sm mt-2">
                        <span class="text-green-600">↑ ${month_growth}%</span>
                        <span class="text-gray-500 ml-2">vs last month</span>
                      </div>
                    </div>

            - type: card
              className: bg-purple-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">New Customers</div>
                      <div class="text-gray-600 text-sm">新客户</div>
                      <div class="text-3xl font-bold text-purple-600 mt-2">${new_customers}</div>
                      <div class="text-sm mt-2">This month / 本月</div>
                    </div>

            - type: card
              className: bg-orange-50
              body:
                - type: tpl
                  tpl: |
                    <div class="p-4">
                      <div class="text-gray-600">Pending Orders</div>
                      <div class="text-gray-600 text-sm">待处理订单</div>
                      <div class="text-3xl font-bold text-orange-600 mt-2">${pending_orders}</div>
                      <div class="text-sm mt-2">Requires attention / 需要处理</div>
                    </div>

    # Charts section
    - type: grid
      className: mt-4
      columns:
        # Sales trend chart
        - lg: 8
          md: 12
          body:
            - type: card
              header:
                title: Sales Trend
                title_zh: 销售趋势
              body:
                - type: chart
                  api: /api/v4/stats/sales-trend?period=30days
                  config:
                    title:
                      text: Daily Sales (Last 30 Days)
                      subtext: 每日销售额(最近30天)
                    tooltip:
                      trigger: axis
                    xAxis:
                      type: category
                      boundaryGap: false
                    yAxis:
                      type: value
                      axisLabel:
                        formatter: '¥{value}'
                    series:
                      - name: Sales
                        type: line
                        smooth: true
                        areaStyle:
                          opacity: 0.3
                        itemStyle:
                          color: '#3b82f6'

        # Top products
        - lg: 4
          md: 12
          body:
            - type: card
              header:
                title: Top Products
                title_zh: 热销产品
              body:
                - type: chart
                  api: /api/v4/stats/top-products?limit=5
                  config:
                    tooltip:
                      trigger: item
                    series:
                      - name: Sales
                        type: pie
                        radius: ['40%', '70%']
                        label:
                          show: true
                          formatter: '{b}: {d}%'

    # Recent orders and top customers
    - type: grid
      className: mt-4
      columns:
        # Recent orders
        - lg: 8
          md: 12
          body:
            - type: card
              header:
                title: Recent Orders
                title_zh: 最近订单
                toolbar:
                  - type: button
                    label: View All
                    label_zh: 查看全部
                    level: link
                    actionType: url
                    url: /app/orders
              body:
                - type: crud
                  api: /api/v4/orders?top=10&orderby=created desc
                  syncLocation: false
                  headerToolbar: []
                  footerToolbar: []
                  columns:
                    - name: order_number
                      label: Order #
                      label_zh: 订单号
                      type: text
                    - name: customer.name
                      label: Customer
                      label_zh: 客户
                      type: text
                    - name: total_amount
                      label: Amount
                      label_zh: 金额
                      type: number
                      prefix: ¥
                    - name: status
                      label: Status
                      label_zh: 状态
                      type: status
                    - name: created
                      label: Date
                      label_zh: 日期
                      type: datetime
                      format: MM-DD HH:mm

        # Top customers
        - lg: 4
          md: 12
          body:
            - type: card
              header:
                title: Top Customers
                title_zh: 大客户
              body:
                - type: service
                  api: /api/v4/stats/top-customers?limit=5
                  body:
                    - type: list
                      source: ${items}
                      listItem:
                        body:
                          - type: tpl
                            tpl: |
                              <div class="p-3 border-b">
                                <div class="font-bold">${name}</div>
                                <div class="text-sm text-gray-600">
                                  Total: ¥${total_amount}
                                </div>
                              </div>
```

### Example 2: Custom Report Page | 自定义报表页面

```yaml
name: order_report
label: Order Report
label_zh: 订单报表
type: page
visible: true

schema:
  type: page
  title: Order Report
  title_zh: 订单报表
  toolbar:
    - type: button
      label: Export Excel
      label_zh: 导出Excel
      icon: fa fa-download
      actionType: url
      url: /api/reports/orders/export?format=xlsx

  body:
    # Filter form
    - type: form
      mode: horizontal
      wrapWithPanel: false
      target: report-table
      submitOnChange: true
      body:
        - type: input-date-range
          name: date_range
          label: Date Range
          label_zh: 日期范围
          format: YYYY-MM-DD
          value: ${DATERANGELAST(30)}

        - type: select
          name: status
          label: Status
          label_zh: 状态
          source: /api/v4/options/order_status
          clearable: true

        - type: select
          name: customer
          label: Customer
          label_zh: 客户
          source: /api/v4/customers
          labelField: name
          valueField: _id
          searchable: true
          clearable: true

        - type: input-number
          name: min_amount
          label: Min Amount
          label_zh: 最小金额
          min: 0
          prefix: ¥

    # Summary cards
    - type: service
      api: /api/v4/reports/order-summary?${date_range}&status=${status}&customer=${customer}&min_amount=${min_amount}
      body:
        - type: grid
          className: mt-4
          columns:
            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Total Orders</div>
                      <div class="text-gray-600 text-sm">订单总数</div>
                      <div class="text-2xl font-bold">${total_count}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Total Amount</div>
                      <div class="text-gray-600 text-sm">总金额</div>
                      <div class="text-2xl font-bold">¥${total_amount}</div>
                    </div>

            - type: card
              body:
                - type: tpl
                  tpl: |
                    <div class="p-3 text-center">
                      <div class="text-gray-600">Average Amount</div>
                      <div class="text-gray-600 text-sm">平均金额</div>
                      <div class="text-2xl font-bold">¥${average_amount}</div>
                    </div>

    # Report table
    - type: crud
      name: report-table
      className: mt-4
      api: /api/v4/reports/orders?${date_range}&status=${status}&customer=${customer}&min_amount=${min_amount}
      syncLocation: false
      columns:
        - name: order_number
          label: Order Number
          label_zh: 订单号
          type: text
          searchable: true

        - name: customer.name
          label: Customer
          label_zh: 客户
          type: text

        - name: order_date
          label: Order Date
          label_zh: 订单日期
          type: date
          format: YYYY-MM-DD

        - name: total_amount
          label: Amount
          label_zh: 金额
          type: number
          prefix: ¥

        - name: status
          label: Status
          label_zh: 状态
          type: status
          map:
            draft:
              label: Draft
              label_zh: 草稿
              icon: fa fa-pencil
              className: text-gray-500
            pending:
              label: Pending
              label_zh: 待审批
              icon: fa fa-clock
              className: text-yellow-600
            approved:
              label: Approved
              label_zh: 已批准
              icon: fa fa-check
              className: text-green-600
            completed:
              label: Completed
              label_zh: 已完成
              icon: fa fa-check-circle
              className: text-blue-600

        - name: owner.name
          label: Owner
          label_zh: 负责人
          type: text

    # Charts
    - type: grid
      className: mt-4
      columns:
        - type: card
          header:
            title: Orders by Status
            title_zh: 按状态统计
          body:
            - type: chart
              api: /api/v4/reports/orders-by-status?${date_range}
              config:
                tooltip:
                  trigger: item
                series:
                  - name: Orders
                    type: pie
                    radius: 60%

        - type: card
          header:
            title: Daily Trend
            title_zh: 每日趋势
          body:
            - type: chart
              api: /api/v4/reports/orders-daily-trend?${date_range}
              config:
                xAxis:
                  type: category
                yAxis:
                  type: value
                series:
                  - name: Orders
                    type: bar
                    itemStyle:
                      color: '#3b82f6'
```

### Example 3: Custom Form Page | 自定义表单页面

```yaml
name: bulk_order_form
label: Bulk Order Form
label_zh: 批量订单表单
type: page
visible: true

schema:
  type: page
  title: Create Bulk Order
  title_zh: 创建批量订单
  body:
    - type: wizard
      steps:
        # Step 1: Customer selection
        - title: Select Customer
          title_zh: 选择客户
          body:
            - type: select
              name: customer
              label: Customer
              label_zh: 客户
              source: /api/v4/customers?filters=[["status","=","active"]]
              labelField: name
              valueField: _id
              searchable: true
              required: true

            - type: service
              api: /api/v4/customers/${customer}
              body:
                - type: panel
                  visibleOn: ${customer}
                  title: Customer Information
                  title_zh: 客户信息
                  body:
                    - type: tpl
                      tpl: |
                        <div class="p-3">
                          <div><strong>Code:</strong> ${code}</div>
                          <div><strong>Email:</strong> ${email}</div>
                          <div><strong>Phone:</strong> ${phone}</div>
                          <div><strong>Credit Limit:</strong> ¥${credit_limit}</div>
                          <div><strong>Available Credit:</strong> ¥${available_credit}</div>
                        </div>

        # Step 2: Order items
        - title: Add Items
          title_zh: 添加项目
          body:
            - type: input-table
              name: items
              label: Order Items
              label_zh: 订单项目
              addable: true
              removable: true
              columns:
                - name: product
                  label: Product
                  label_zh: 产品
                  type: select
                  source: /api/v4/products?filters=[["is_active","=",true]]
                  labelField: name
                  valueField: _id
                  searchable: true
                  required: true

                - name: quantity
                  label: Quantity
                  label_zh: 数量
                  type: input-number
                  required: true
                  min: 1
                  value: 1

                - name: unit_price
                  label: Unit Price
                  label_zh: 单价
                  type: input-number
                  required: true
                  min: 0
                  prefix: ¥
                  precision: 2

                - name: discount
                  label: Discount %
                  label_zh: 折扣 %
                  type: input-number
                  min: 0
                  max: 100
                  value: 0
                  suffix: '%'

                - name: subtotal
                  label: Subtotal
                  label_zh: 小计
                  type: static
                  tpl: ¥${quantity * unit_price * (1 - discount / 100)}

            - type: tpl
              tpl: |
                <div class="text-right p-3 text-xl">
                  <strong>Total: ¥${SUM(items, 'quantity * unit_price * (1 - discount / 100)')}</strong>
                </div>

        # Step 3: Shipping details
        - title: Shipping Details
          title_zh: 配送信息
          body:
            - type: input-date
              name: delivery_date
              label: Delivery Date
              label_zh: 交付日期
              required: true
              minDate: ${DATETOSTR(DATEADD('day', 1, NOW()), 'YYYY-MM-DD')}

            - type: input-textarea
              name: shipping_address
              label: Shipping Address
              label_zh: 收货地址
              required: true
              rows: 3

            - type: input-text
              name: contact_person
              label: Contact Person
              label_zh: 联系人
              required: true

            - type: input-text
              name: contact_phone
              label: Contact Phone
              label_zh: 联系电话
              required: true

        # Step 4: Review and submit
        - title: Review & Submit
          title_zh: 审核并提交
          body:
            - type: service
              body:
                - type: panel
                  title: Order Summary
                  title_zh: 订单摘要
                  body:
                    - type: tpl
                      tpl: |
                        <div class="p-4">
                          <h4>Customer Information / 客户信息</h4>
                          <div>Customer: ${customer.name}</div>

                          <h4 class="mt-4">Items / 项目</h4>
                          <table class="table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Discount</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              <% items.forEach(function(item) { %>
                              <tr>
                                <td><%= item.product.name %></td>
                                <td><%= item.quantity %></td>
                                <td>¥<%= item.unit_price %></td>
                                <td><%= item.discount %>%</td>
                                <td>¥<%= item.quantity * item.unit_price * (1 - item.discount / 100) %></td>
                              </tr>
                              <% }); %>
                            </tbody>
                          </table>

                          <h4 class="mt-4">Shipping / 配送</h4>
                          <div>Delivery Date: ${delivery_date}</div>
                          <div>Address: ${shipping_address}</div>
                          <div>Contact: ${contact_person} - ${contact_phone}</div>

                          <h3 class="mt-4">Total Amount: ¥${SUM(items, 'quantity * unit_price * (1 - discount / 100)')}</h3>
                        </div>

            - type: input-textarea
              name: notes
              label: Notes
              label_zh: 备注
              rows: 3

      api: post:/api/v4/orders/bulk-create
      redirect: /app/orders
```

### Example 4: Analytics Dashboard | 分析仪表板

```yaml
name: analytics_dashboard
label: Analytics Dashboard
label_zh: 分析仪表板
type: page
visible: true

schema:
  type: page
  title: Business Analytics
  title_zh: 业务分析

  aside:
    - type: nav
      stacked: true
      links:
        - label: Overview
          label_zh: 概览
          to: '?tab=overview'
          active: ${tab === 'overview' || !tab}
        - label: Sales
          label_zh: 销售
          to: '?tab=sales'
        - label: Customers
          label_zh: 客户
          to: '?tab=customers'
        - label: Products
          label_zh: 产品
          to: '?tab=products'

  body:
    - type: tabs
      activeKey: ${tab || 'overview'}
      tabs:
        # Overview tab
        - title: Overview
          title_zh: 概览
          hash: overview
          body:
            - type: service
              api: /api/v4/analytics/overview
              body:
                # KPI cards
                - type: grid
                  columns:
                    - type: card
                      body:
                        - type: chart
                          config:
                            title:
                              text: ${revenue}
                              subtext: Revenue / 收入
                              left: center
                            series:
                              - type: gauge
                                detail:
                                  formatter: '¥{value}'

                    - type: card
                      body:
                        - type: chart
                          config:
                            title:
                              text: ${orders}
                              subtext: Orders / 订单
                              left: center
                            series:
                              - type: gauge
                                detail:
                                  formatter: '{value}'

                    - type: card
                      body:
                        - type: chart
                          config:
                            title:
                              text: ${customers}
                              subtext: Customers / 客户
                              left: center
                            series:
                              - type: gauge
                                detail:
                                  formatter: '{value}'

        # Sales tab
        - title: Sales
          title_zh: 销售
          hash: sales
          body:
            - type: service
              api: /api/v4/analytics/sales
              body:
                - type: chart
                  config:
                    title:
                      text: Monthly Sales Trend
                      subtext: 月度销售趋势
                    xAxis:
                      type: category
                    yAxis:
                      type: value
                    series:
                      - type: bar

        # Customers tab
        - title: Customers
          title_zh: 客户
          hash: customers
          body:
            - type: service
              api: /api/v4/analytics/customers
              body:
                - type: chart
                  config:
                    title:
                      text: Customer Distribution
                      subtext: 客户分布
                    series:
                      - type: pie
```

## Best Practices | 最佳实践

### 1. Use Service Component for Dynamic Data | 使用服务组件加载动态数据

```yaml
# Good - load data on demand
- type: service
  api: /api/v4/stats/summary
  body:
    - type: tpl
      tpl: Total: ${total}

# Bad - hardcoded data
- type: tpl
  tpl: Total: 100
```

### 2. Implement Responsive Design | 实现响应式设计

```yaml
# Use grid with responsive columns
- type: grid
  columns:
    - lg: 6     # 50% on large screens
      md: 12    # 100% on medium screens
      body: ...
```

### 3. Provide Loading States | 提供加载状态

```yaml
- type: service
  api: /api/v4/data
  loadingConfig:
    show: true
  body: ...
```

### 4. Handle Errors Gracefully | 优雅处理错误

```yaml
- type: service
  api: /api/v4/data
  body: ...
  messages:
    fetchFailed: Failed to load data. Please try again.
```

### 5. Use Bilingual Labels | 使用双语标签

```yaml
title: Sales Dashboard
title_zh: 销售仪表板
```

## References | 参考资料

- [12-object-micro-pages.md](./12-object-micro-pages.md) - Object-specific pages
- [04-ui-pages.prompt.md](../.github/prompts/customer/04-ui-pages.prompt.md) - Amis UI guide
- [Amis Documentation](https://aisuda.bce.baidu.com/amis/)
- [Steedos Pages Documentation](https://docs.steedos.com/)
