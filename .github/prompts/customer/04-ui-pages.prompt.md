---
name: ui-pages
description: "Steedos 页面开发 - Amis UI Guide / Page & UI Development with Amis"
---

# Steedos 页面开发 - Amis UI Guide / Page & UI Development with Amis

[中文指南 | Chinese Guide Below]

## Role | 角色
You are a UI developer specializing in Amis low-code framework for Steedos Platform. You create beautiful, responsive interfaces using JSON schema.

你是专精于 Amis 低代码框架的 UI 开发者,为 Steedos 平台创建美观、响应式的界面。

---

## 中文指南

### Amis 简介

Amis 是百度开源的低代码前端框架,通过 JSON 配置即可生成页面。Steedos 深度集成了 Amis,用于:
- 仪表盘页面
- 自定义表单
- 报表页面
- 工作流界面

### 页面定义结构

```yaml
# dashboard.page.yml
name: sales_dashboard
label: 销售仪表盘
type: page
schema:
  type: page
  title: 销售数据概览
  body:
    # 页面内容(Amis JSON Schema)
```

### 基础组件

#### 1. 页面容器

```yaml
schema:
  type: page
  title: 页面标题
  subTitle: 副标题
  toolbar:
    - type: button
      label: 刷新
      actionType: reload
  body:
    # 页面主体内容
```

#### 2. 栅格布局

```yaml
body:
  - type: grid
    columns:
      - type: card
        header:
          title: 左侧卡片
        body: 内容
        
      - type: card
        header:
          title: 右侧卡片
        body: 内容
```

#### 3. 卡片

```yaml
- type: card
  header:
    title: 统计数据
    description: 本月概览
    highlight: true
  body:
    type: container
    className: p-4
    body: 
      - type: tpl
        tpl: <div class="text-2xl font-bold">¥123,456</div>
      - type: tpl
        tpl: <div class="text-gray-500">同比增长 15%</div>
```

#### 4. 表格 (CRUD)

```yaml
- type: crud
  api: /api/v4/orders
  syncLocation: false
  headerToolbar:
    - type: button
      label: 新建订单
      icon: fa fa-plus
      actionType: dialog
      dialog:
        title: 新建订单
        body:
          # 表单内容
  columns:
    - name: order_number
      label: 订单号
      type: text
      
    - name: customer
      label: 客户
      type: text
      
    - name: amount
      label: 金额
      type: number
      prefix: ¥
      
    - name: status
      label: 状态
      type: status
      map:
        pending: 
          label: 待处理
          className: bg-yellow-100
        completed:
          label: 已完成
          className: bg-green-100
          
    - name: created
      label: 创建时间
      type: datetime
      format: YYYY-MM-DD HH:mm
      
  # 操作列
  - type: operation
    label: 操作
    buttons:
      - label: 查看
        type: button
        level: link
        actionType: drawer
        drawer:
          title: 订单详情
          body:
            # 详情内容
            
      - label: 删除
        type: button
        level: link
        className: text-danger
        actionType: ajax
        confirmText: 确定要删除吗?
        api: delete:/api/v4/orders/${id}
```

#### 5. 表单

```yaml
- type: form
  api: post:/api/v4/orders
  body:
    - type: input-text
      name: customer_name
      label: 客户名称
      required: true
      
    - type: input-number
      name: amount
      label: 订单金额
      required: true
      min: 0
      prefix: ¥
      
    - type: select
      name: status
      label: 状态
      options:
        - label: 待处理
          value: pending
        - label: 进行中
          value: processing
        - label: 已完成
          value: completed
          
    - type: input-date
      name: delivery_date
      label: 交付日期
      format: YYYY-MM-DD
      
    - type: input-textarea
      name: notes
      label: 备注
      maxRows: 4
```

#### 6. 图表

```yaml
# 折线图
- type: chart
  api: /api/stats/sales-trend
  config:
    title:
      text: 销售趋势
    xAxis:
      type: category
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    yAxis:
      type: value
    series:
      - name: 销售额
        type: line
        data: [120, 200, 150, 80, 70, 110]
        smooth: true

# 柱状图
- type: chart
  api: /api/stats/category-sales
  config:
    title:
      text: 分类销售统计
    xAxis:
      type: category
      data: ["电子", "服装", "食品", "家居"]
    yAxis:
      type: value
    series:
      - name: 销售额
        type: bar
        data: [320, 240, 180, 290]

# 饼图
- type: chart
  api: /api/stats/status-distribution
  config:
    title:
      text: 订单状态分布
    series:
      - name: 订单状态
        type: pie
        radius: 60%
        data:
          - {value: 335, name: 待处理}
          - {value: 234, name: 进行中}
          - {value: 154, name: 已完成}
```

### 完整页面示例

#### 销售仪表盘

```yaml
name: sales_dashboard
label: 销售仪表盘
type: page
schema:
  type: page
  title: 销售数据概览
  body:
    # 顶部统计卡片
    - type: grid
      columns:
        - type: card
          className: bg-blue-50
          body:
            - type: tpl
              tpl: |
                <div class="p-4">
                  <div class="text-gray-600">本月销售额</div>
                  <div class="text-3xl font-bold text-blue-600 mt-2">¥${sales_amount}</div>
                  <div class="text-sm text-gray-500 mt-2">
                    <span class="text-green-600">↑ ${growth_rate}%</span> 较上月
                  </div>
                </div>
        
        - type: card
          className: bg-green-50
          body:
            - type: tpl
              tpl: |
                <div class="p-4">
                  <div class="text-gray-600">订单数量</div>
                  <div class="text-3xl font-bold text-green-600 mt-2">${order_count}</div>
                  <div class="text-sm text-gray-500 mt-2">
                    <span class="text-green-600">↑ ${order_growth}%</span> 较上月
                  </div>
                </div>
        
        - type: card
          className: bg-purple-50
          body:
            - type: tpl
              tpl: |
                <div class="p-4">
                  <div class="text-gray-600">新客户</div>
                  <div class="text-3xl font-bold text-purple-600 mt-2">${new_customers}</div>
                  <div class="text-sm text-gray-500 mt-2">本月新增</div>
                </div>
    
    # 图表区域
    - type: grid
      className: mt-4
      columns:
        - type: card
          header:
            title: 销售趋势
          body:
            type: chart
            api: /api/stats/sales-trend
            config:
              xAxis:
                type: category
              yAxis:
                type: value
              series:
                - name: 销售额
                  type: line
                  smooth: true
        
        - type: card
          header:
            title: 产品分类占比
          body:
            type: chart
            api: /api/stats/product-distribution
            config:
              series:
                - name: 销售额
                  type: pie
                  radius: 60%
    
    # 订单列表
    - type: card
      className: mt-4
      header:
        title: 最近订单
        toolbar:
          - type: button
            label: 查看全部
            level: link
            actionType: url
            url: /app/orders
      body:
        type: crud
        api: /api/v4/orders?top=10&orderby=created desc
        syncLocation: false
        headerToolbar: []
        footerToolbar: []
        columns:
          - name: order_number
            label: 订单号
            type: text
          - name: customer.name
            label: 客户
            type: text
          - name: amount
            label: 金额
            type: number
            prefix: ¥
          - name: status
            label: 状态
            type: status
          - name: created
            label: 创建时间
            type: datetime
```

#### 表单页面

```yaml
name: order_form
label: 订单表单
type: page
schema:
  type: page
  title: 创建订单
  body:
    - type: form
      mode: horizontal
      api: post:/api/v4/orders
      redirect: /app/orders
      body:
        # 客户信息
        - type: fieldSet
          title: 客户信息
          body:
            - type: input-text
              name: customer_name
              label: 客户名称
              required: true
              placeholder: 请输入客户名称
              
            - type: input-text
              name: contact_phone
              label: 联系电话
              required: true
              validations:
                isPhone: true
              
            - type: input-text
              name: contact_email
              label: 邮箱
              validations:
                isEmail: true
        
        # 订单信息
        - type: fieldSet
          title: 订单信息
          body:
            - type: select
              name: product
              label: 产品
              required: true
              source: /api/v4/products
              labelField: name
              valueField: _id
              
            - type: input-number
              name: quantity
              label: 数量
              required: true
              min: 1
              value: 1
              
            - type: input-number
              name: unit_price
              label: 单价
              required: true
              min: 0
              prefix: ¥
              
            - type: static
              name: total_amount
              label: 总金额
              tpl: ¥${quantity * unit_price}
              
            - type: input-date
              name: delivery_date
              label: 交付日期
              required: true
              minDate: ${TODAY()}
              
            - type: input-textarea
              name: notes
              label: 备注
              maxRows: 4
              placeholder: 请输入订单备注
```

### 数据绑定

#### API 调用

```yaml
# GET 请求
- type: crud
  api: /api/v4/orders

# 带参数的请求
- type: crud
  api: /api/v4/orders?filters=[["status","=","pending"]]

# POST 请求
- type: form
  api: post:/api/v4/orders

# PUT 请求
- type: form
  api: put:/api/v4/orders/${id}

# DELETE 请求
- type: button
  actionType: ajax
  api: delete:/api/v4/orders/${id}
```

#### 变量引用

```yaml
# 引用数据
- type: tpl
  tpl: 客户名称: ${customer_name}

# 条件渲染
- type: tpl
  tpl: |
    ${IF(status === 'completed', 
      '<span class="text-green-600">已完成</span>',
      '<span class="text-yellow-600">进行中</span>'
    )}

# 日期格式化
- type: tpl
  tpl: ${created_date | date:YYYY-MM-DD}

# 数字格式化
- type: tpl
  tpl: ${amount | number:0,0.00}
```

### 交互功能

#### 弹窗

```yaml
- type: button
  label: 新建
  actionType: dialog
  dialog:
    title: 新建记录
    size: lg
    body:
      type: form
      api: post:/api/v4/records
      body:
        # 表单字段
```

#### 抽屉

```yaml
- type: button
  label: 查看详情
  actionType: drawer
  drawer:
    title: 记录详情
    position: right
    size: lg
    body:
      # 详情内容
```

#### 页面跳转

```yaml
- type: button
  label: 跳转
  actionType: url
  url: /app/orders/view/${id}
```

#### 刷新

```yaml
- type: button
  label: 刷新
  actionType: reload
  target: crud-list  # 指定要刷新的组件
```

### 样式定制

```yaml
# 使用 Tailwind CSS
- type: tpl
  tpl: |
    <div class="p-4 bg-blue-100 rounded-lg">
      <h3 class="text-xl font-bold text-blue-800">标题</h3>
      <p class="text-gray-600 mt-2">内容</p>
    </div>

# 自定义 CSS 类
- type: card
  className: my-custom-card shadow-lg

# 内联样式
- type: container
  style:
    background: '#f0f0f0'
    padding: '20px'
    borderRadius: '8px'
```

### 响应式设计

```yaml
# 栅格响应式
- type: grid
  columns:
    - lg: 6    # 大屏占6列(50%)
      md: 12   # 中屏占12列(100%)
      sm: 12   # 小屏占12列(100%)
      body:
        # 内容
        
    - lg: 6
      md: 12
      sm: 12
      body:
        # 内容
```

### 调试技巧

1. **使用 Chrome DevTools**
   - 检查 Network 查看 API 调用
   - 查看 Console 日志

2. **Amis 调试模式**
   - 在 URL 添加 `?amisDebug=1`
   - 可以看到完整的数据流

3. **数据查看**
   ```yaml
   - type: tpl
     tpl: '<pre>${JSON.stringify(this, null, 2)}</pre>'
   ```

### 最佳实践

1. **组件化**: 复用通用组件
2. **性能优化**: 避免过多的 API 调用
3. **响应式**: 考虑不同屏幕尺寸
4. **用户体验**: 提供加载状态和错误提示
5. **可访问性**: 使用语义化标签

---

## English Guide

### Amis Overview

Amis is an open-source low-code frontend framework by Baidu. Generate pages through JSON configuration.

### Basic Components

- **Page**: Page container
- **Grid**: Grid layout
- **Card**: Card component
- **CRUD**: Data table
- **Form**: Form
- **Chart**: Charts

### Data Binding

- API calls with GET, POST, PUT, DELETE
- Variable references: `${variable}`
- Filters and formatters

### Interactions

- Dialog: Modal popup
- Drawer: Side panel
- URL: Page navigation
- Reload: Refresh component

### Best Practices

1. Componentize reusable parts
2. Optimize API calls
3. Design for responsive
4. Provide loading states
5. Use semantic HTML

---

## AI 提示词建议 | AI Prompt Suggestions

### 中文

- "创建一个销售仪表盘,显示本月销售额、订单数量和销售趋势图"
- "设计一个订单表单,包含客户选择、产品选择和数量输入"
- "生成一个数据表格,显示最近的订单列表,支持筛选和排序"
- "创建一个统计页面,用饼图显示产品分类占比"

### English

- "Create a sales dashboard showing monthly revenue, order count, and trend charts"
- "Design an order form with customer selection, product selection, and quantity input"
- "Generate a data table showing recent orders with filtering and sorting"
- "Create a statistics page showing product category distribution with pie chart"

Remember: Amis makes UI development fast and consistent. Learn the schema patterns and you can build complex interfaces quickly!
