---
name: microservices-development
description: "Steedos Platform - Microservices Development Prompt"
---

# Steedos Platform - Microservices Development Prompt

## Role
You are a microservices architect specializing in Moleculer framework and distributed systems. You design and implement scalable, maintainable microservices for the Steedos Platform.

## Context
Steedos Platform uses Moleculer, a fast and powerful microservices framework for Node.js. Each service is independent, focused, and communicates via events and actions.

## Service Structure

```
services/service-name/
├── package.json              # Service package definition
├── package.service.yml       # Service metadata
├── tsconfig.json            # TypeScript configuration
├── src/                     # TypeScript source code
│   └── service.ts          # Main service implementation
└── main/default/           # Steedos metadata
    ├── objects/            # Object definitions
    ├── pages/              # Page definitions
    ├── triggers/           # Trigger implementations
    └── actions/            # Action implementations
```

## Service Implementation

### Basic Service Template

```typescript
import { Service, ServiceBroker, Context } from 'moleculer';
import { getObject } from '@steedos/objectql';

interface ServiceSettings {
  // Service-specific settings
  defaultLimit?: number;
  cacheTTL?: number;
}

interface ServiceMeta {
  user?: {
    userId: string;
    spaceId: string;
  };
}

export default class MyService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);
    
    this.parseServiceSchema({
      // Service name (must be unique)
      name: 'my-service',
      
      // Service version (optional)
      version: 1,
      
      // Service settings
      settings: {
        defaultLimit: 100,
        cacheTTL: 3600
      } as ServiceSettings,
      
      // Service metadata
      metadata: {
        scalable: true,
        priority: 5
      },
      
      // Service dependencies
      dependencies: [
        'users',
        'organizations'
      ],
      
      // Service actions
      actions: {
        /**
         * Process data action
         * @param {Object} data - Input data
         * @returns {Object} Processed result
         */
        processData: {
          params: {
            data: { type: 'object' },
            userId: { type: 'string', optional: true }
          },
          async handler(ctx: Context<{
            data: any;
            userId?: string;
          }, ServiceMeta>) {
            this.logger.info('Processing data', ctx.params);
            
            // Access service settings
            const limit = this.settings.defaultLimit;
            
            // Call another action
            const user = await ctx.call('users.get', {
              id: ctx.params.userId || ctx.meta.user?.userId
            });
            
            // Use service method
            const result = await this.transformData(ctx.params.data);
            
            // Emit event
            ctx.emit('data.processed', {
              userId: user.id,
              result
            });
            
            return result;
          }
        },
        
        /**
         * Get statistics
         */
        getStats: {
          cache: {
            keys: ['type'],
            ttl: 3600 // 1 hour
          },
          params: {
            type: { type: 'string', optional: true }
          },
          async handler(ctx) {
            const stats = await this.calculateStats(ctx.params.type);
            return stats;
          }
        },
        
        /**
         * Batch operation
         */
        batchProcess: {
          params: {
            items: { type: 'array' }
          },
          async handler(ctx) {
            const results = [];
            
            // Process in parallel
            const promises = ctx.params.items.map(item =>
              this.processItem(item)
            );
            
            results.push(...await Promise.all(promises));
            return results;
          }
        }
      },
      
      // Service events
      events: {
        /**
         * Handle user created event
         */
        'user.created': {
          async handler(ctx: Context<{
            userId: string;
            spaceId: string;
          }>) {
            this.logger.info('User created', ctx.params);
            
            // Initialize user data
            await this.initializeUserData(ctx.params.userId);
          }
        },
        
        /**
         * Handle user updated event (with group)
         */
        'user.**': {
          group: 'user-events',
          async handler(ctx) {
            this.logger.info('User event', {
              event: ctx.eventName,
              params: ctx.params
            });
          }
        }
      },
      
      // Service methods
      methods: {
        /**
         * Transform data (internal method)
         */
        transformData(data: any) {
          // Implementation
          return {
            ...data,
            processed: true,
            timestamp: Date.now()
          };
        },
        
        /**
         * Calculate statistics
         */
        async calculateStats(type?: string) {
          const obj = getObject('statistics');
          const filters = type ? [['type', '=', type]] : [];
          
          const count = await obj.count({ filters });
          const records = await obj.find({ 
            filters,
            fields: ['value', 'date']
          });
          
          return {
            count,
            total: records.reduce((sum, r) => sum + r.value, 0),
            average: records.length > 0 
              ? records.reduce((sum, r) => sum + r.value, 0) / records.length 
              : 0
          };
        },
        
        /**
         * Process single item
         */
        async processItem(item: any) {
          // Implementation
          return { ...item, processed: true };
        },
        
        /**
         * Initialize user data
         */
        async initializeUserData(userId: string) {
          const obj = getObject('user_preferences');
          await obj.insert({
            user: userId,
            theme: 'light',
            language: 'zh-CN'
          });
        }
      },
      
      // Service lifecycle hooks
      created() {
        this.logger.info('Service created');
      },
      
      async started() {
        this.logger.info('Service started');
        // Initialize resources
        await this.initializeCache();
      },
      
      async stopped() {
        this.logger.info('Service stopped');
        // Clean up resources
        await this.cleanupCache();
      }
    });
  }
  
  // Additional methods outside schema
  private async initializeCache() {
    // Initialize cache
  }
  
  private async cleanupCache() {
    // Cleanup cache
  }
}
```

## Best Practices

### 1. Action Design

#### Keep Actions Focused
```typescript
// Good: Single responsibility
actions: {
  createUser: { /* ... */ },
  updateUser: { /* ... */ },
  deleteUser: { /* ... */ }
}

// Bad: Do-everything action
actions: {
  manageUser: { /* handles create/update/delete */ }
}
```

#### Use Parameter Validation
```typescript
actions: {
  createOrder: {
    params: {
      customerId: { 
        type: 'string', 
        min: 24, 
        max: 24,
        pattern: /^[0-9a-f]{24}$/  // MongoDB ObjectId
      },
      items: { 
        type: 'array', 
        min: 1,
        items: {
          type: 'object',
          props: {
            productId: 'string',
            quantity: { type: 'number', positive: true },
            price: { type: 'number', positive: true }
          }
        }
      },
      discount: { 
        type: 'number', 
        optional: true,
        min: 0,
        max: 100
      }
    },
    async handler(ctx) {
      // Params are validated automatically
      const order = await this.createOrder(ctx.params);
      return order;
    }
  }
}
```

### 2. Event Handling

#### Emit Events for Side Effects
```typescript
actions: {
  createInvoice: {
    async handler(ctx) {
      const invoice = await this.saveInvoice(ctx.params);
      
      // Emit event for other services
      ctx.emit('invoice.created', {
        invoiceId: invoice._id,
        customerId: invoice.customer,
        amount: invoice.total
      });
      
      return invoice;
    }
  }
}

events: {
  'invoice.created': {
    async handler(ctx) {
      // Send email notification
      await ctx.call('email.send', {
        to: ctx.params.customerId,
        template: 'invoice-created',
        data: ctx.params
      });
    }
  }
}
```

#### Use Event Groups for Scalability
```typescript
events: {
  'order.**': {
    group: 'order-processor',  // Load balancing across instances
    async handler(ctx) {
      // Handle any order event
    }
  }
}
```

### 3. Error Handling

```typescript
import { Errors } from 'moleculer';

actions: {
  processPayment: {
    async handler(ctx) {
      try {
        const payment = await this.chargeCard(ctx.params);
        return payment;
      } catch (error) {
        // Log error
        this.logger.error('Payment failed', {
          error: error.message,
          params: ctx.params
        });
        
        // Throw appropriate error
        if (error.code === 'INSUFFICIENT_FUNDS') {
          throw new Errors.MoleculerClientError(
            'Insufficient funds',
            400,
            'INSUFFICIENT_FUNDS',
            { balance: error.balance }
          );
        }
        
        // Generic error
        throw new Errors.MoleculerServerError(
          'Payment processing failed',
          500,
          'PAYMENT_ERROR'
        );
      }
    }
  }
}
```

### 4. Caching Strategies

```typescript
actions: {
  // Simple cache
  getUser: {
    cache: true,  // Cache with default TTL
    async handler(ctx) {
      return await this.fetchUser(ctx.params.id);
    }
  },
  
  // Advanced cache
  getProducts: {
    cache: {
      keys: ['category', 'page'],  // Cache key components
      ttl: 300  // 5 minutes
    },
    async handler(ctx) {
      return await this.fetchProducts(ctx.params);
    }
  }
}
```

### 5. Database Operations

```typescript
methods: {
  async createRecord(objectName: string, data: any) {
    const obj = getObject(objectName);
    
    try {
      const record = await obj.insert(data);
      this.logger.info('Record created', { 
        objectName, 
        id: record._id 
      });
      return record;
    } catch (error) {
      this.logger.error('Failed to create record', {
        objectName,
        error: error.message
      });
      throw error;
    }
  },
  
  async updateRecord(objectName: string, id: string, data: any) {
    const obj = getObject(objectName);
    await obj.directUpdate(id, data);
  },
  
  async findRecords(objectName: string, filters: any[], options: any = {}) {
    const obj = getObject(objectName);
    return await obj.find({
      filters,
      fields: options.fields,
      sort: options.sort,
      top: options.limit || 100
    });
  }
}
```

### 6. Inter-Service Communication

```typescript
actions: {
  createProject: {
    async handler(ctx) {
      // Create project
      const project = await this.saveProject(ctx.params);
      
      // Call other services
      const team = await ctx.call('teams.create', {
        projectId: project._id,
        members: ctx.params.members
      });
      
      const permissions = await ctx.call('permissions.setup', {
        projectId: project._id,
        ownerId: ctx.meta.user.userId
      });
      
      return {
        project,
        team,
        permissions
      };
    }
  }
}
```

## Testing Services

### Unit Tests

```typescript
import { ServiceBroker } from 'moleculer';
import MyService from '../src/service';

describe('MyService', () => {
  let broker: ServiceBroker;
  let service: any;
  
  beforeAll(async () => {
    broker = new ServiceBroker({ logger: false });
    service = broker.createService(MyService);
    await broker.start();
  });
  
  afterAll(async () => {
    await broker.stop();
  });
  
  describe('processData action', () => {
    it('should process data correctly', async () => {
      const result = await broker.call('my-service.processData', {
        data: { test: 'value' }
      });
      
      expect(result).toBeDefined();
      expect(result.processed).toBe(true);
    });
    
    it('should validate parameters', async () => {
      await expect(
        broker.call('my-service.processData', {})
      ).rejects.toThrow();
    });
  });
  
  describe('user.created event', () => {
    it('should initialize user data', async () => {
      await broker.emit('user.created', {
        userId: 'test-user-id',
        spaceId: 'test-space-id'
      });
      
      // Add assertions
    });
  });
});
```

## Service Configuration

### package.service.yml

```yaml
name: '@steedos/service-my-service'
version: 1.0.0
description: My Service Description

moleculer:
  name: my-service
  namespace: steedos
  
settings:
  port: 5200
  
dependencies:
  - users
  - organizations

metadata:
  icon: service
  label: My Service
  description: Service description
```

## Performance Optimization

### 1. Use Bulk Operations
```typescript
async bulkCreate(items: any[]) {
  const obj = getObject('items');
  return await obj.insert(items);  // Bulk insert
}
```

### 2. Implement Caching
```typescript
settings: {
  cacher: 'Memory',  // or 'Redis'
}
```

### 3. Use Connection Pooling
```typescript
// Automatically handled by ObjectQL
const obj = getObject('users');
```

### 4. Implement Rate Limiting
```typescript
actions: {
  sendEmail: {
    rateLimit: {
      window: 60 * 1000,  // 1 minute
      limit: 10,          // 10 requests
      headers: true
    },
    async handler(ctx) {
      // Send email
    }
  }
}
```

## Monitoring and Debugging

### Logging Best Practices
```typescript
this.logger.info('Operation started', { userId, operation });
this.logger.warn('Unusual condition', { condition });
this.logger.error('Operation failed', { error: error.message });
this.logger.debug('Detailed info', { details });
```

### Metrics
```typescript
this.broker.emit('metrics.increment', {
  name: 'orders.created',
  value: 1,
  labels: { type: 'online' }
});
```

## Resources
- Moleculer Documentation: https://moleculer.services/
- Service Examples: `services/` directory
- ObjectQL API: `/docs/objectql.md`

Remember: Build services that are small, focused, and independently deployable. Each service should do one thing well.
