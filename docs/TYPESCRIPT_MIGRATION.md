# TypeScript Strict Mode Migration Guide

> Practical guide for migrating Steedos Platform packages to TypeScript strict mode

## Overview

This guide provides step-by-step instructions for migrating existing TypeScript code to strict mode, with specific examples from the Steedos Platform codebase.

## Why Migrate to Strict Mode?

**Benefits**:
- ✅ Catch 30-40% more bugs at compile time
- ✅ Better IDE autocomplete and refactoring
- ✅ Improved code documentation through types
- ✅ Easier onboarding for new developers
- ✅ Better AI assistant code generation

**Strict Mode Flags**:
```typescript
{
  "strict": true,                          // Enables all strict options
  "strictNullChecks": true,               // Prevents null/undefined errors
  "noImplicitAny": true,                  // Requires explicit types
  "strictBindCallApply": true,            // Type-safe function calls
  "strictFunctionTypes": true,            // Stricter function type checking
  "strictPropertyInitialization": true,   // Class properties must be initialized
  "noImplicitThis": true,                 // Explicit 'this' types
  "alwaysStrict": true                    // Emit "use strict"
}
```

## Migration Process

### Step 1: Assess Current State

```bash
# Check current type errors with strict mode
tsc --noEmit -p tsconfig.strict.json
```

**Common error categories**:
1. Implicit `any` types
2. Possible `null`/`undefined` access
3. Uninitialized class properties
4. Missing return types

### Step 2: Create Package-Specific Config

```json
// packages/my-package/tsconfig.json
{
  "extends": "../../tsconfig.strict.json",
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts"]
}
```

### Step 3: Fix Errors Incrementally

#### 3.1 Fix Implicit `any` Types

**Before**:
```typescript
function processData(data) {  // ❌ Parameter 'data' implicitly has an 'any' type
  return data.value;
}
```

**After**:
```typescript
interface DataInput {
  value: string;
}

function processData(data: DataInput): string {
  return data.value;
}
```

#### 3.2 Handle Null/Undefined

**Before**:
```typescript
function getObjectName(obj: SteedosObject) {
  return obj.label.toUpperCase();  // ❌ obj.label might be undefined
}
```

**After (Option 1: Optional Chaining)**:
```typescript
function getObjectName(obj: SteedosObject): string | undefined {
  return obj.label?.toUpperCase();
}
```

**After (Option 2: Default Value)**:
```typescript
function getObjectName(obj: SteedosObject): string {
  return (obj.label || obj.name || 'Unknown').toUpperCase();
}
```

**After (Option 3: Type Guard)**:
```typescript
function getObjectName(obj: SteedosObject): string {
  if (!obj.label) {
    throw new Error('Object label is required');
  }
  return obj.label.toUpperCase();
}
```

#### 3.3 Fix Function Return Types

**Before**:
```typescript
async function findRecord(objectName, id) {  // ❌ Implicit any
  const result = await broker.call('objectql.findOne', {
    objectName,
    id
  });
  return result;
}
```

**After**:
```typescript
async function findRecord(
  objectName: string,
  id: string
): Promise<Record<string, any> | null> {
  const result = await broker.call('objectql.findOne', {
    objectName,
    id,
  });
  return result as Record<string, any> | null;
}
```

#### 3.4 Class Property Initialization

**Before**:
```typescript
class ObjectManager {
  private cache: Map<string, any>;  // ❌ Not initialized
  
  constructor() {
    // Missing initialization
  }
}
```

**After (Option 1: Initialize in constructor)**:
```typescript
class ObjectManager {
  private cache: Map<string, any>;
  
  constructor() {
    this.cache = new Map();
  }
}
```

**After (Option 2: Definite assignment)**:
```typescript
class ObjectManager {
  private cache: Map<string, any> = new Map();
  
  constructor() {
    // cache is already initialized
  }
}
```

#### 3.5 Replace `any` with Specific Types

**Before**:
```typescript
function formatValue(value: any, type: string): any {
  if (type === 'date') {
    return new Date(value);
  }
  return value;
}
```

**After**:
```typescript
type FieldValue = string | number | boolean | Date | null;

function formatValue(value: FieldValue, type: string): FieldValue {
  if (type === 'date' && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}
```

### Step 4: Add Tests

```typescript
// packages/my-package/src/objectManager.test.ts
import { ObjectManager } from './objectManager';

describe('ObjectManager', () => {
  let manager: ObjectManager;

  beforeEach(() => {
    manager = new ObjectManager();
  });

  test('should get object by name', () => {
    const obj = manager.getObject('accounts');
    expect(obj).toBeDefined();
    expect(obj.name).toBe('accounts');
  });

  test('should handle missing object', () => {
    const obj = manager.getObject('nonexistent');
    expect(obj).toBeNull();
  });
});
```

### Step 5: Update Build Configuration

```json
// packages/my-package/package.json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "type-check": "tsc --noEmit",
    "test": "jest"
  }
}
```

## Common Patterns

### Pattern 1: Service Method with Validation

```typescript
interface CreateAccountParams {
  name: string;
  rating?: 'hot' | 'warm' | 'cold';
  revenue?: number;
}

interface Account extends CreateAccountParams {
  _id: string;
  created: Date;
}

async function createAccount(
  params: CreateAccountParams
): Promise<Account> {
  // Validation
  if (!params.name || params.name.trim() === '') {
    throw new Error('Account name is required');
  }

  // Default values
  const data: CreateAccountParams = {
    name: params.name.trim(),
    rating: params.rating || 'warm',
    revenue: params.revenue || 0,
  };

  // Create record
  const result = await broker.call('objectql.insert', {
    objectName: 'accounts',
    doc: data,
  });

  return result as Account;
}
```

### Pattern 2: Metadata Processing

```typescript
interface ObjectMetadata {
  name: string;
  label?: string;
  fields: Record<string, FieldMetadata>;
  triggers?: TriggerMetadata[];
}

interface FieldMetadata {
  type: string;
  label?: string;
  required?: boolean;
  defaultValue?: unknown;
}

function validateObjectMetadata(
  metadata: unknown
): ObjectMetadata {
  if (!metadata || typeof metadata !== 'object') {
    throw new Error('Invalid metadata: must be an object');
  }

  const obj = metadata as Partial<ObjectMetadata>;

  if (!obj.name || typeof obj.name !== 'string') {
    throw new Error('Invalid metadata: name is required');
  }

  if (!obj.fields || typeof obj.fields !== 'object') {
    throw new Error('Invalid metadata: fields is required');
  }

  return {
    name: obj.name,
    label: obj.label,
    fields: obj.fields,
    triggers: obj.triggers,
  };
}
```

### Pattern 3: Error Handling

```typescript
class SteedosError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SteedosError';
  }
}

async function processData(
  objectName: string,
  data: unknown
): Promise<void> {
  try {
    // Validate input
    if (!objectName) {
      throw new SteedosError(
        'Object name is required',
        'INVALID_INPUT',
        400
      );
    }

    // Process data
    await broker.call('objectql.insert', {
      objectName,
      doc: data,
    });
  } catch (error) {
    if (error instanceof SteedosError) {
      throw error;
    }
    
    throw new SteedosError(
      `Failed to process data: ${(error as Error).message}`,
      'PROCESS_ERROR',
      500,
      { objectName, error: error as Error }
    );
  }
}
```

## Package-Specific Guidelines

### @steedos/metadata-core

**Focus areas**:
1. Metadata validation functions
2. YAML/JSON parsing
3. Schema definitions

**Types to define**:
```typescript
interface MetadataObject {
  name: string;
  label: string;
  fields: Record<string, MetadataField>;
}

interface MetadataField {
  type: FieldType;
  label?: string;
  required?: boolean;
}

type FieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'lookup'
  | 'master_detail';
```

### @steedos/objectql

**Focus areas**:
1. Query builders
2. Filter processors
3. Permission checks

**Types to define**:
```typescript
interface Query {
  filters?: Filter[];
  fields?: string[];
  top?: number;
  skip?: number;
  sort?: string;
}

type Filter = 
  | [string, string, any]
  | [string, string, any[]]
  | Filter[];
```

### @steedos/formula

**Focus areas**:
1. Formula parsing
2. Expression evaluation
3. Type coercion

**Types to define**:
```typescript
type FormulaValue = 
  | string
  | number
  | boolean
  | Date
  | null;

interface FormulaContext {
  record: Record<string, FormulaValue>;
  user: Record<string, any>;
  now: Date;
}
```

## Verification

After migration:

```bash
# 1. Type check passes
yarn type-check

# 2. Tests pass
yarn test

# 3. Build succeeds
yarn build

# 4. Lint passes
yarn lint
```

## Rollback Plan

If migration causes issues:

```json
// Temporarily disable strict mode for specific files
{
  "compilerOptions": {
    // ... other options
  },
  "ts-node": {
    "compilerOptions": {
      "strict": false  // Disable for ts-node only
    }
  }
}
```

Or use `// @ts-nocheck` at file level:
```typescript
// @ts-nocheck
// TODO: Migrate to strict mode
export function legacyFunction(data: any): any {
  // ...
}
```

## Resources

- [TypeScript Strict Mode Handbook](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)
- [TypeScript Migration Guide](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
- Internal: `AI_DEVELOPMENT_GUIDE.md`
- Internal: `CODE_OPTIMIZATION_SUGGESTIONS.md`

---

**Need help?** Open an issue or discussion on GitHub.
