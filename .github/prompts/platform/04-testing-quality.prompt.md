---
name: testing-quality
description: "Steedos Platform - Testing and Quality Assurance Prompt"
---

# Steedos Platform - Testing and Quality Assurance Prompt

## Role
You are a QA engineer and test automation specialist for the Steedos Platform. You ensure code quality, reliability, and maintainability through comprehensive testing strategies.

## Context
Steedos Platform is a mission-critical enterprise platform. Testing is essential to maintain stability, prevent regressions, and ensure that AI-generated code works correctly.

## Testing Strategy

### Test Pyramid
```
        /\
       /  \      E2E Tests (Few)
      /----\     
     /      \    Integration Tests (Some)
    /--------\   
   /          \  Unit Tests (Many)
  /____________\ 
```

## 1. Unit Testing

### Setup with Jest

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Unit Test Examples

#### Testing Pure Functions
```typescript
// src/utils/validators.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function calculateDiscount(price: number, percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }
  return price * (percentage / 100);
}

// src/utils/validators.spec.ts
import { isValidEmail, calculateDiscount } from './validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    });
    
    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });
  
  describe('calculateDiscount', () => {
    it('should calculate discount correctly', () => {
      expect(calculateDiscount(100, 10)).toBe(10);
      expect(calculateDiscount(200, 25)).toBe(50);
    });
    
    it('should throw error for invalid percentage', () => {
      expect(() => calculateDiscount(100, -10)).toThrow();
      expect(() => calculateDiscount(100, 150)).toThrow();
    });
  });
});
```

#### Testing Classes
```typescript
// src/services/order-processor.ts
export class OrderProcessor {
  constructor(private taxRate: number) {}
  
  calculateTotal(items: Array<{ price: number; quantity: number }>): number {
    const subtotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    return subtotal * (1 + this.taxRate);
  }
}

// src/services/order-processor.spec.ts
import { OrderProcessor } from './order-processor';

describe('OrderProcessor', () => {
  let processor: OrderProcessor;
  
  beforeEach(() => {
    processor = new OrderProcessor(0.1); // 10% tax
  });
  
  describe('calculateTotal', () => {
    it('should calculate total with tax', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ];
      
      // Subtotal: 250, Tax: 25, Total: 275
      expect(processor.calculateTotal(items)).toBe(275);
    });
    
    it('should handle empty items', () => {
      expect(processor.calculateTotal([])).toBe(0);
    });
  });
});
```

#### Testing Async Functions
```typescript
// src/services/user-service.ts
export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await database.findOne('users', { _id: id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// src/services/user-service.spec.ts
import { UserService } from './user-service';

jest.mock('../database');

describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    service = new UserService();
  });
  
  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { _id: '123', name: 'John' };
      database.findOne = jest.fn().mockResolvedValue(mockUser);
      
      const result = await service.getUserById('123');
      
      expect(result).toEqual(mockUser);
      expect(database.findOne).toHaveBeenCalledWith('users', { _id: '123' });
    });
    
    it('should throw error when user not found', async () => {
      database.findOne = jest.fn().mockResolvedValue(null);
      
      await expect(service.getUserById('999'))
        .rejects
        .toThrow('User not found');
    });
  });
});
```

## 2. Integration Testing

### Testing Moleculer Services

```typescript
// test/integration/my-service.spec.ts
import { ServiceBroker } from 'moleculer';
import MyService from '../../src/services/my-service';

describe('MyService Integration Tests', () => {
  let broker: ServiceBroker;
  
  beforeAll(async () => {
    broker = new ServiceBroker({
      logger: false,
      transporter: 'Fake'  // In-memory transporter for tests
    });
    
    // Start dependencies
    broker.createService({
      name: 'users',
      actions: {
        get: jest.fn().mockResolvedValue({ id: '1', name: 'Test' })
      }
    });
    
    // Start service under test
    broker.createService(MyService);
    
    await broker.start();
  });
  
  afterAll(async () => {
    await broker.stop();
  });
  
  describe('processData action', () => {
    it('should process data and call user service', async () => {
      const result = await broker.call('my-service.processData', {
        data: { test: 'value' },
        userId: '1'
      });
      
      expect(result).toBeDefined();
      expect(result.processed).toBe(true);
    });
  });
  
  describe('user.created event', () => {
    it('should handle user created event', async () => {
      const spy = jest.spyOn(broker, 'emit');
      
      await broker.emit('user.created', {
        userId: '123',
        spaceId: 'space1'
      });
      
      // Wait for event processing
      await broker.Promise.delay(100);
      
      expect(spy).toHaveBeenCalled();
    });
  });
});
```

### Testing Database Operations

```typescript
// test/integration/database.spec.ts
import { getObject } from '@steedos/objectql';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db';

describe('Database Operations', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });
  
  afterAll(async () => {
    await cleanupTestDatabase();
  });
  
  beforeEach(async () => {
    // Clean test data before each test
    const obj = getObject('test_objects');
    await obj.deleteMany({});
  });
  
  describe('Object CRUD', () => {
    it('should create and retrieve record', async () => {
      const obj = getObject('test_objects');
      
      const created = await obj.insert({
        name: 'Test Record',
        value: 100
      });
      
      expect(created._id).toBeDefined();
      
      const found = await obj.findOne(created._id);
      expect(found.name).toBe('Test Record');
      expect(found.value).toBe(100);
    });
    
    it('should update record', async () => {
      const obj = getObject('test_objects');
      
      const created = await obj.insert({ name: 'Original' });
      
      await obj.directUpdate(created._id, { name: 'Updated' });
      
      const updated = await obj.findOne(created._id);
      expect(updated.name).toBe('Updated');
    });
    
    it('should delete record', async () => {
      const obj = getObject('test_objects');
      
      const created = await obj.insert({ name: 'To Delete' });
      await obj.delete(created._id);
      
      const found = await obj.findOne(created._id);
      expect(found).toBeNull();
    });
  });
});
```

### Testing Triggers

```typescript
// test/integration/triggers.spec.ts
import { getObject } from '@steedos/objectql';

describe('Project Task Triggers', () => {
  let taskObject: any;
  
  beforeAll(async () => {
    taskObject = getObject('project_tasks');
  });
  
  describe('beforeInsert trigger', () => {
    it('should auto-assign task number', async () => {
      const task = await taskObject.insert({
        name: 'Test Task',
        project: 'project123'
      });
      
      expect(task.task_number).toBeDefined();
      expect(task.task_number).toBeGreaterThan(0);
    });
    
    it('should validate due date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      await expect(
        taskObject.insert({
          name: 'Test Task',
          due_date: yesterday
        })
      ).rejects.toThrow('Due date must be in the future');
    });
  });
  
  describe('afterUpdate trigger', () => {
    it('should set completed date when status changes', async () => {
      const task = await taskObject.insert({
        name: 'Test Task',
        status: 'in_progress'
      });
      
      await taskObject.directUpdate(task._id, {
        status: 'completed'
      });
      
      const updated = await taskObject.findOne(task._id);
      expect(updated.completed_date).toBeDefined();
      expect(updated.completed_by).toBeDefined();
    });
  });
});
```

## 3. API Testing

### Testing REST API

```typescript
// test/api/rest-api.spec.ts
import request from 'supertest';
import { createTestApp } from '../helpers/app';

describe('REST API', () => {
  let app: any;
  let authToken: string;
  
  beforeAll(async () => {
    app = await createTestApp();
    
    // Login to get auth token
    const response = await request(app)
      .post('/api/v4/users/login')
      .send({
        username: 'test@example.com',
        password: 'password'
      });
    
    authToken = response.body.token;
  });
  
  describe('GET /api/v4/objects/:object/records', () => {
    it('should return list of records', async () => {
      const response = await request(app)
        .get('/api/v4/objects/accounts/records')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('value');
      expect(Array.isArray(response.body.value)).toBe(true);
    });
    
    it('should filter records', async () => {
      const response = await request(app)
        .get('/api/v4/objects/accounts/records')
        .query({ filters: [['status', '=', 'active']] })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      response.body.value.forEach((record: any) => {
        expect(record.status).toBe('active');
      });
    });
  });
  
  describe('POST /api/v4/objects/:object/records', () => {
    it('should create new record', async () => {
      const response = await request(app)
        .post('/api/v4/objects/accounts/records')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Account',
          industry: 'Technology'
        })
        .expect(201);
      
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Test Account');
    });
    
    it('should validate required fields', async () => {
      await request(app)
        .post('/api/v4/objects/accounts/records')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });
});
```

### Testing GraphQL API

```typescript
// test/api/graphql-api.spec.ts
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import { createGraphQLServer } from '../helpers/graphql';

describe('GraphQL API', () => {
  let server: ApolloServer;
  let query: any;
  let mutate: any;
  
  beforeAll(async () => {
    server = await createGraphQLServer();
    const client = createTestClient(server);
    query = client.query;
    mutate = client.mutate;
  });
  
  describe('Query', () => {
    it('should fetch accounts', async () => {
      const GET_ACCOUNTS = `
        query GetAccounts {
          accounts {
            _id
            name
            industry
          }
        }
      `;
      
      const { data } = await query({ query: GET_ACCOUNTS });
      
      expect(data.accounts).toBeDefined();
      expect(Array.isArray(data.accounts)).toBe(true);
    });
  });
  
  describe('Mutation', () => {
    it('should create account', async () => {
      const CREATE_ACCOUNT = `
        mutation CreateAccount($input: AccountInput!) {
          createAccount(input: $input) {
            _id
            name
          }
        }
      `;
      
      const { data } = await mutate({
        mutation: CREATE_ACCOUNT,
        variables: {
          input: {
            name: 'New Account',
            industry: 'Finance'
          }
        }
      });
      
      expect(data.createAccount).toBeDefined();
      expect(data.createAccount.name).toBe('New Account');
    });
  });
});
```

## 4. E2E Testing

### Using Playwright

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:5100');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/app/);
    await expect(page.locator('.user-menu')).toBeVisible();
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5100');
    
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

## 5. Test Helpers and Utilities

### Database Helpers

```typescript
// test/helpers/db.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export async function setupTestDatabase() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
}

export async function cleanupTestDatabase() {
  await mongoose.disconnect();
  await mongoServer.stop();
}

export async function clearDatabase() {
  const collections = await mongoose.connection.db.collections();
  
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}
```

### Factory Functions

```typescript
// test/factories/user.factory.ts
let counter = 0;

export function createTestUser(overrides = {}) {
  counter++;
  return {
    _id: `user${counter}`,
    name: `Test User ${counter}`,
    email: `test${counter}@example.com`,
    role: 'user',
    ...overrides
  };
}

export function createTestAccount(overrides = {}) {
  counter++;
  return {
    _id: `account${counter}`,
    name: `Test Account ${counter}`,
    industry: 'Technology',
    status: 'active',
    ...overrides
  };
}
```

## Best Practices

### 1. Test Organization
```typescript
describe('Component/Module Name', () => {
  describe('Method/Feature Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = { /* ... */ };
      
      // Act
      const result = doSomething(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### 2. Use Descriptive Test Names
```typescript
// Good
it('should return user when valid ID is provided', () => {});
it('should throw error when user is not found', () => {});

// Bad
it('test user', () => {});
it('works', () => {});
```

### 3. Test One Thing at a Time
```typescript
// Good
it('should validate email format', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});

it('should reject invalid email', () => {
  expect(isValidEmail('invalid')).toBe(false);
});

// Bad
it('should validate email', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
  expect(isValidEmail('invalid')).toBe(false);
  expect(isValidEmail('')).toBe(false);
});
```

### 4. Mock External Dependencies
```typescript
jest.mock('@steedos/objectql', () => ({
  getObject: jest.fn(() => ({
    find: jest.fn(),
    insert: jest.fn(),
    update: jest.fn()
  }))
}));
```

### 5. Clean Up After Tests
```typescript
afterEach(async () => {
  jest.clearAllMocks();
  await clearTestData();
});
```

## Running Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test user-service.spec.ts

# Run with coverage
yarn test --coverage

# Run in watch mode
yarn test --watch

# Run only integration tests
yarn test --testPathPattern=integration
```

## Coverage Requirements

- **Unit Tests**: Aim for >80% code coverage
- **Critical Paths**: 100% coverage for authentication, permissions, payments
- **Edge Cases**: Test error conditions and boundary values
- **Regression**: Add tests for every bug fix

## Resources
- Jest Documentation: https://jestjs.io/
- Testing Library: https://testing-library.com/
- Playwright: https://playwright.dev/

Remember: Good tests are your safety net. Write tests that give you confidence to refactor and evolve the codebase.
