---
name: object-functions
description: |
  Define reusable JavaScript functions for Steedos objects that can be called
  from formulas, buttons, validations, and APIs. Use this skill to encapsulate
  complex business logic in maintainable functions. Covers function definition
  (inline in YAML or separate .functions.js files), usage in formulas, actions,
  and triggers, async functions, error handling, and parameter documentation.
  Includes examples for calculations, validations, and data processing.
---
# Steedos Object Functions | Steedos 对象函数

## Overview | 概述

Object functions are reusable JavaScript functions that can be called from various contexts including formulas, buttons, validations, and external APIs. They provide a way to encapsulate complex business logic.

对象函数是可重用的 JavaScript 函数,可以从各种上下文中调用,包括公式、按钮、验证和外部 API。它们提供了一种封装复杂业务逻辑的方法。

## File Location | 文件位置

Functions can be defined inline in objects or as separate files:

函数可以在对象中内联定义,也可以作为单独的文件:

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            ├── orders.object.yml
            └── orders.functions.js      # Functions file (optional)
```

## Function Definition | 函数定义

### Inline in Object YAML | 在对象YAML中内联

```yaml
# objects/orders.object.yml
name: orders
label: Order
fields:
  # ... field definitions

functions:
  calculateDiscount:
    label: Calculate Discount
    code: !!js/function |
      function(customerType, amount) {
        if (customerType === 'vip') {
          return amount * 0.15;  // 15% for VIP
        } else if (customerType === 'regular') {
          return amount * 0.10;  // 10% for regular
        }
        return amount * 0.05;    // 5% for others
      }

  validateOrder:
    label: Validate Order
    code: !!js/function |
      async function(orderId) {
        const order = await this.getObject('orders').findOne(orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        if (order.amount <= 0) {
          throw new Error('Invalid order amount');
        }
        return true;
      }
```

### Separate Functions File | 独立函数文件

```javascript
// objects/orders.functions.js
module.exports = {
  // Calculate total with tax
  calculateTotal: function(subtotal, taxRate) {
    return subtotal * (1 + taxRate / 100);
  },

  // Validate shipping address
  validateShippingAddress: function(address) {
    if (!address || !address.street || !address.city) {
      return false;
    }
    return true;
  },

  // Async function example
  getCustomerDiscount: async function(customerId) {
    const customerObj = this.getObject('customers');
    const customer = await customerObj.findOne(customerId);

    if (!customer) {
      return 0;
    }

    // VIP customers get higher discount
    if (customer.rating === 'A') {
      return 15;
    } else if (customer.rating === 'B') {
      return 10;
    }
    return 5;
  },

  // Function with error handling
  processOrder: async function(orderId) {
    try {
      const orderObj = this.getObject('orders');
      const order = await orderObj.findOne(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      // Validate inventory
      const hasInventory = await this.checkInventory(order.items);
      if (!hasInventory) {
        throw new Error('Insufficient inventory');
      }

      // Process payment
      const paymentResult = await this.processPayment(order.amount);
      if (!paymentResult.success) {
        throw new Error('Payment failed: ' + paymentResult.message);
      }

      // Update order status
      await orderObj.directUpdate(orderId, {
        status: 'processed',
        processed_at: new Date()
      });

      return {
        success: true,
        message: 'Order processed successfully'
      };
    } catch (error) {
      console.error('Process order failed:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
};
```

## Usage Examples | 使用示例

### 1. In Formula Fields | 在公式字段中

```yaml
fields:
  discount_amount:
    type: formula
    label: Discount Amount
    data_type: currency
    scale: 2
    formula: !!js/function |
      function() {
        // Call object function
        const discount = this.calculateDiscount(this.customer_type, this.subtotal);
        return discount;
      }

  total_with_tax:
    type: formula
    label: Total with Tax
    data_type: currency
    scale: 2
    formula: !!js/function |
      function() {
        return this.calculateTotal(this.subtotal, this.tax_rate);
      }
```

### 2. In Actions | 在动作中

```javascript
// objects/orders.action.js
module.exports = {
  process_order: {
    label: 'Process Order',
    visible: function(object_name, record_id, record) {
      return record.status === 'pending';
    },
    on: 'record',
    todo: async function(object_name, record_id) {
      try {
        // Call object function
        const result = await this.processOrder(record_id);

        if (result.success) {
          toastr.success(result.message);
          FlowRouter.reload();
        } else {
          toastr.error(result.message);
        }
      } catch (error) {
        toastr.error('Error: ' + error.message);
      }
    }
  }
};
```

### 3. In Triggers | 在触发器中

```javascript
// triggers/orders.trigger.js
module.exports = {
  listenTo: 'orders',

  beforeInsert: async function() {
    const { doc } = this;

    // Validate shipping address using function
    const isValidAddress = this.validateShippingAddress(doc.shipping_address);
    if (!isValidAddress) {
      throw new Error('Invalid shipping address');
    }

    // Calculate discount using function
    const discount = await this.getCustomerDiscount(doc.customer);
    doc.discount_rate = discount;
    doc.discount_amount = doc.subtotal * (discount / 100);

    // Calculate total using function
    doc.total_amount = this.calculateTotal(
      doc.subtotal - doc.discount_amount,
      doc.tax_rate
    );
  }
};
```

### 4. Via API | 通过API

```javascript
// Call function via Steedos API
const result = await Steedos.authRequest(
  '/api/v4/functions/orders.processOrder',
  {
    method: 'POST',
    body: JSON.stringify({
      orderId: 'ORDER_ID_HERE'
    })
  }
);
```

## Complete Examples | 完整示例

### Example 1: Customer Functions | 客户函数

```javascript
// objects/customers.functions.js
module.exports = {
  // Calculate customer lifetime value
  calculateLifetimeValue: async function(customerId) {
    const ordersObj = this.getObject('orders');
    const orders = await ordersObj.find({
      filters: [
        ['customer', '=', customerId],
        ['status', '=', 'completed']
      ]
    });

    const total = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    return total;
  },

  // Get customer risk level
  getRiskLevel: async function(customerId) {
    const customerObj = this.getObject('customers');
    const customer = await customerObj.findOne(customerId);

    if (!customer) {
      return 'unknown';
    }

    // Check overdue invoices
    const invoicesObj = this.getObject('invoices');
    const overdueCount = await invoicesObj.count({
      filters: [
        ['customer', '=', customerId],
        ['status', '=', 'overdue']
      ]
    });

    if (overdueCount > 3) {
      return 'high';
    } else if (overdueCount > 1) {
      return 'medium';
    }
    return 'low';
  },

  // Check credit availability
  checkCreditAvailability: async function(customerId, requestedAmount) {
    const customerObj = this.getObject('customers');
    const customer = await customerObj.findOne(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get pending orders
    const ordersObj = this.getObject('orders');
    const pendingOrders = await ordersObj.find({
      filters: [
        ['customer', '=', customerId],
        ['status', 'in', ['pending', 'approved']]
      ]
    });

    const pendingAmount = pendingOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const availableCredit = customer.credit_limit - pendingAmount;

    return {
      available: requestedAmount <= availableCredit,
      creditLimit: customer.credit_limit,
      pendingAmount: pendingAmount,
      availableCredit: availableCredit,
      requestedAmount: requestedAmount
    };
  }
};
```

### Example 2: Order Functions | 订单函数

```javascript
// objects/orders.functions.js
module.exports = {
  // Calculate order priority
  calculatePriority: function(customerType, amount, dueDate) {
    let priority = 0;

    // Customer type factor
    if (customerType === 'vip') {
      priority += 10;
    } else if (customerType === 'regular') {
      priority += 5;
    }

    // Amount factor
    if (amount > 100000) {
      priority += 10;
    } else if (amount > 50000) {
      priority += 5;
    }

    // Due date factor
    const daysUntilDue = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 3) {
      priority += 15;
    } else if (daysUntilDue < 7) {
      priority += 10;
    } else if (daysUntilDue < 14) {
      priority += 5;
    }

    // Convert to priority level
    if (priority >= 20) {
      return 'urgent';
    } else if (priority >= 10) {
      return 'high';
    } else if (priority >= 5) {
      return 'medium';
    }
    return 'low';
  },

  // Generate order summary
  generateSummary: async function(orderId) {
    const orderObj = this.getObject('orders');
    const order = await orderObj.findOne(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Get customer info
    const customerObj = this.getObject('customers');
    const customer = await customerObj.findOne(order.customer);

    // Get order items
    const itemsObj = this.getObject('order_items');
    const items = await itemsObj.find({
      filters: [['order', '=', orderId]]
    });

    return {
      orderNumber: order.order_number,
      orderDate: order.order_date,
      customer: {
        name: customer.name,
        code: customer.code
      },
      itemCount: items.length,
      subtotal: order.subtotal,
      tax: order.tax_amount,
      total: order.total_amount,
      status: order.status
    };
  },

  // Validate order can be shipped
  canShip: async function(orderId) {
    const orderObj = this.getObject('orders');
    const order = await orderObj.findOne(orderId);

    if (!order) {
      return { canShip: false, reason: 'Order not found' };
    }

    // Check order status
    if (order.status !== 'approved') {
      return { canShip: false, reason: 'Order not approved' };
    }

    // Check payment status
    if (!order.payment_received) {
      return { canShip: false, reason: 'Payment not received' };
    }

    // Check inventory
    const itemsObj = this.getObject('order_items');
    const items = await itemsObj.find({
      filters: [['order', '=', orderId]]
    });

    for (const item of items) {
      const product = await this.getObject('products').findOne(item.product);
      if (product.stock_quantity < item.quantity) {
        return {
          canShip: false,
          reason: `Insufficient stock for ${product.name}`
        };
      }
    }

    return { canShip: true, reason: 'Ready to ship' };
  }
};
```

### Example 3: Report Functions | 报表函数

```javascript
// objects/reports.functions.js
module.exports = {
  // Generate sales report
  generateSalesReport: async function(startDate, endDate) {
    const ordersObj = this.getObject('orders');
    const orders = await ordersObj.find({
      filters: [
        ['order_date', '>=', startDate],
        ['order_date', '<=', endDate],
        ['status', '=', 'completed']
      ]
    });

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by customer
    const customerTotals = {};
    orders.forEach(order => {
      if (!customerTotals[order.customer]) {
        customerTotals[order.customer] = 0;
      }
      customerTotals[order.customer] += order.total_amount;
    });

    // Find top customers
    const topCustomers = Object.entries(customerTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([customerId, total]) => ({ customerId, total }));

    return {
      period: { startDate, endDate },
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topCustomers
    };
  },

  // Calculate growth rate
  calculateGrowthRate: async function(currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd) {
    const ordersObj = this.getObject('orders');

    // Current period
    const currentOrders = await ordersObj.find({
      filters: [
        ['order_date', '>=', currentPeriodStart],
        ['order_date', '<=', currentPeriodEnd],
        ['status', '=', 'completed']
      ]
    });
    const currentTotal = currentOrders.reduce((sum, order) => sum + order.total_amount, 0);

    // Previous period
    const previousOrders = await ordersObj.find({
      filters: [
        ['order_date', '>=', previousPeriodStart],
        ['order_date', '<=', previousPeriodEnd],
        ['status', '=', 'completed']
      ]
    });
    const previousTotal = previousOrders.reduce((sum, order) => sum + order.total_amount, 0);

    // Calculate growth
    const growth = previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

    return {
      currentPeriod: { total: currentTotal, count: currentOrders.length },
      previousPeriod: { total: previousTotal, count: previousOrders.length },
      growthRate: Math.round(growth * 100) / 100
    };
  }
};
```

## Best Practices | 最佳实践

### 1. Keep Functions Focused | 保持函数专注

```javascript
// Good - single responsibility
calculateDiscount: function(customerType, amount) {
  // Only calculate discount
  if (customerType === 'vip') return amount * 0.15;
  return amount * 0.10;
}

// Bad - too many responsibilities
processOrder: function(order) {
  // Validates, calculates, saves, sends email (do separately)
}
```

### 2. Handle Errors Properly | 正确处理错误

```javascript
// Good - clear error handling
validateOrder: async function(orderId) {
  try {
    const order = await this.getObject('orders').findOne(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
}
```

### 3. Document Parameters | 文档化参数

```javascript
/**
 * Calculate customer discount based on type and order amount
 * @param {string} customerType - Customer type ('vip', 'regular', 'new')
 * @param {number} amount - Order amount
 * @returns {number} Discount amount
 */
calculateDiscount: function(customerType, amount) {
  // Implementation
}
```

### 4. Use Async When Needed | 必要时使用异步

```javascript
// Good - async for database operations
getCustomerData: async function(customerId) {
  const customer = await this.getObject('customers').findOne(customerId);
  return customer;
}

// Good - sync for calculations
calculateTotal: function(subtotal, tax) {
  return subtotal + tax;
}
```

### 5. Return Meaningful Results | 返回有意义的结果

```javascript
// Good - descriptive return value
checkInventory: async function(productId, quantity) {
  const product = await this.getObject('products').findOne(productId);
  return {
    available: product.stock >= quantity,
    stockLevel: product.stock,
    requested: quantity,
    shortage: Math.max(0, quantity - product.stock)
  };
}

// Bad - unclear return
checkInventory: async function(productId, quantity) {
  const product = await this.getObject('products').findOne(productId);
  return product.stock >= quantity;  // Just true/false, no context
}
```

## Troubleshooting | 故障排除

### Function Not Found | 函数未找到

1. Check function name spelling
2. Verify file location
3. Check YAML syntax
4. Restart server
5. Review server logs

### Function Errors | 函数错误

1. Check parameter types
2. Verify async/await usage
3. Check database queries
4. Review error messages
5. Add console.log for debugging

### Performance Issues | 性能问题

1. Minimize database queries
2. Use batch operations
3. Cache results when possible
4. Avoid complex calculations
5. Profile slow functions

## References | 参考资料

- [05-objects.md](./05-objects.md) - Object definitions
- [06-object-fields.md](./06-object-fields.md) - Formula fields
- [07-object-buttons.md](./07-object-buttons.md) - Actions
- [10-object-triggers.md](./10-object-triggers.md) - Triggers
- [Steedos Functions Documentation](https://docs.steedos.com/)
