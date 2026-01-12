# AI-Assisted Development Guide

> **Version**: 1.0.0  
> **Last Updated**: 2026-01-12  
> **Purpose**: Enable AI assistants and developers to work efficiently with the Steedos Platform codebase

## Overview

This guide establishes the tooling, configuration, and best practices for AI-assisted development on the Steedos Platform monorepo. It covers code quality tooling, TypeScript strict mode migration, and development workflows optimized for both AI assistants and human developers.

## Table of Contents

1. [Code Quality Tooling](#code-quality-tooling)
2. [TypeScript Configuration](#typescript-configuration)
3. [Testing Infrastructure](#testing-infrastructure)
4. [Development Workflows](#development-workflows)
5. [AI Integration Patterns](#ai-integration-patterns)
6. [Migration Guide](#migration-guide)

---

## Code Quality Tooling

### ESLint Configuration

The monorepo uses ESLint 9.x with TypeScript support for code quality enforcement.

**Configuration**: `eslint.config.mjs`

**Key Rules**:
- TypeScript-specific warnings for `any` types
- Consistent type imports
- No unused variables (with _ prefix exception)
- Best practices enforcement (eqeqeq, curly braces, etc.)

**Usage**:
```bash
# Lint all code
yarn lint

# Fix auto-fixable issues
yarn lint:fix
```

### Prettier Configuration

Prettier enforces consistent code formatting across the monorepo.

**Configuration**: `.prettierrc.js`

**Settings**:
- 100 character line length for code
- 2 space indentation
- Single quotes
- Trailing commas (ES5)
- Unix line endings (LF)

**Usage**:
```bash
# Format all code
yarn format

# Check formatting
yarn format:check
```

### Pre-commit Hooks

Husky + lint-staged ensures code quality before commits.

**Automated on commit**:
1. ESLint auto-fix on .ts/.js files
2. Prettier formatting on all supported files
3. Only staged files are processed

**Configuration**: See `lint-staged` in `package.json`

---

## TypeScript Configuration

### Dual Configuration Strategy

The monorepo uses a dual TypeScript configuration approach:

#### 1. Base Configuration (`tsconfig.json`)
- **Purpose**: Legacy code compatibility
- **Strict Mode**: Disabled
- **Use Case**: Existing packages that haven't been migrated

#### 2. Strict Configuration (`tsconfig.strict.json`)
- **Purpose**: New code and migrated packages
- **Strict Mode**: Fully enabled
- **Use Case**: All new development

### Strict Mode Features

When using `tsconfig.strict.json`:

```json
{
  "strict": true,
  "strictNullChecks": true,
  "noImplicitAny": true,
  "strictBindCallApply": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true
}
```

**Benefits**:
- Catch null/undefined errors at compile time
- Eliminate implicit `any` types
- Improved IDE autocomplete
- Better refactoring safety

### Type Checking

```bash
# Check types with base config
yarn type-check

# Check types with strict config
yarn type-check:strict
```

---

## Testing Infrastructure

### Jest Configuration

The monorepo uses Jest for unit and integration testing.

**Configuration**: `jest.config.js`

**Features**:
- TypeScript support via ts-jest
- Coverage tracking with thresholds (50% baseline)
- Automatic test discovery
- Module path mapping for @steedos/* packages

### Writing Tests

**Test File Patterns**:
- `**/*.test.ts` - Unit tests
- `**/*.spec.ts` - Integration tests  
- `**/__tests__/**/*.ts` - Test suites

**Example Unit Test**:
```typescript
import { ObjectQL } from '@steedos/objectql';

describe('ObjectQL', () => {
  let objectql: ObjectQL;

  beforeEach(() => {
    objectql = new ObjectQL();
  });

  it('should create object instance', () => {
    const obj = objectql.getObject('accounts');
    expect(obj).toBeDefined();
    expect(obj.name).toBe('accounts');
  });

  it('should validate field types', () => {
    const obj = objectql.getObject('accounts');
    const field = obj.getField('name');
    expect(field.type).toBe('text');
  });
});
```

### Running Tests

```bash
# Run all tests
yarn test

# Run in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

### Coverage Requirements

**Baseline thresholds** (in `jest.config.js`):
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

**Goals by package priority**:
- **Critical packages** (objectql, metadata-core): 70%+
- **Core services**: 60%+
- **Utilities**: 50%+

---

## Development Workflows

### New Package Development

When creating a new package:

1. **Use strict TypeScript config**:
```json
// packages/my-package/tsconfig.json
{
  "extends": "../../tsconfig.strict.json",
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

2. **Add test setup**:
```typescript
// packages/my-package/src/index.test.ts
describe('MyPackage', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

3. **Follow linting rules**: Code will be auto-formatted on commit

### Migrating Existing Code

For packages being migrated to strict mode:

1. **Create package-specific tsconfig.strict.json**:
```json
{
  "extends": "../../tsconfig.strict.json",
  "compilerOptions": {
    "outDir": "./lib"
  },
  "include": ["src/**/*.ts"],
  "exclude": [
    "src/legacy/**/*.ts"  // Exclude legacy code
  ]
}
```

2. **Fix type errors incrementally**:
   - Start with core modules
   - Add explicit types
   - Replace `any` with specific types or `unknown`
   - Handle null/undefined cases

3. **Add tests**: Achieve 50%+ coverage before enabling strict mode

### Code Review Checklist

Before submitting PR:
- [ ] `yarn lint` passes
- [ ] `yarn format:check` passes
- [ ] `yarn type-check` passes (or `type-check:strict` for new code)
- [ ] `yarn test` passes
- [ ] Coverage meets threshold
- [ ] No console.log statements (use logger)
- [ ] TypeScript strict mode enabled (for new code)

---

## AI Integration Patterns

### Context for AI Assistants

When working with AI coding assistants (GitHub Copilot, Cursor, etc.):

**Project Context**:
```yaml
Architecture: Microservices (Moleculer framework)
Language: TypeScript (Node.js >=22.0.0)
Monorepo: Lerna + Yarn 3 workspaces
Testing: Jest
Linting: ESLint + Prettier
Type Safety: Gradual migration to strict mode
```

**Key Conventions**:
- Use `@steedos/` scoped packages
- Metadata stored as YAML/JSON
- Services use Moleculer patterns
- Follow existing naming conventions (see CODE_OPTIMIZATION_SUGGESTIONS.md)

### AI-Friendly Code Patterns

**Good** (explicit types, clear structure):
```typescript
interface AccountData {
  name: string;
  rating: 'hot' | 'warm' | 'cold';
  revenue: number | null;
}

async function createAccount(data: AccountData): Promise<string> {
  const account = await objectql.insert('accounts', data);
  return account._id;
}
```

**Avoid** (implicit any, unclear types):
```typescript
async function createAccount(data) {  // ❌ implicit any
  return await objectql.insert('accounts', data);
}
```

### AI Code Generation Guidelines

When AI generates code for this project:

1. **Use strict TypeScript** for all new code
2. **Import types explicitly**: `import type { ...} from '...'`
3. **Add JSDoc** for complex functions
4. **Include error handling**: Try-catch with specific error types
5. **Write tests** alongside implementation
6. **Follow existing patterns**: Check similar code in the monorepo

---

## Migration Guide

### Phase 1: Tooling Setup ✅

- [x] ESLint configuration with TypeScript support
- [x] Prettier configuration
- [x] Jest testing infrastructure
- [x] Strict TypeScript config (`tsconfig.strict.json`)
- [x] Enhanced npm scripts
- [x] Updated pre-commit hooks

### Phase 2: Core Package Migration (In Progress)

**Priority packages for strict mode**:

1. **@steedos/metadata-core**
   - Impact: Foundation for all metadata operations
   - Estimated effort: 2-3 weeks
   - Test coverage target: 70%

2. **@steedos/objectql**
   - Impact: Core data access layer
   - Estimated effort: 3-4 weeks
   - Test coverage target: 75%

3. **@steedos/formula**
   - Impact: Formula calculation engine
   - Estimated effort: 2 weeks
   - Test coverage target: 80%

### Phase 3: Service Migration

After core packages:
- Migrate services one by one
- Start with service-metadata
- Then service-api
- Finally specialty services

### Phase 4: Documentation & Training

- Complete API documentation
- Create migration playbook
- Team training on strict TypeScript
- AI assistant optimization

---

## Resources

### Internal Documentation

- `CODE_OPTIMIZATION_SUGGESTIONS.md` - Detailed optimization roadmap
- `CODE_QUALITY_ANALYSIS.md` - Code quality metrics
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/DEVELOPER_GUIDE.md` - Developer setup guide

### External Resources

- [TypeScript Handbook - Strict Mode](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint TypeScript Plugin](https://typescript-eslint.io/)
- [Prettier](https://prettier.io/docs/en/index.html)

---

## Support

For questions or issues:
- **GitHub Issues**: [steedos/steedos-platform/issues](https://github.com/steedos/steedos-platform/issues)
- **Discussions**: [steedos/steedos-platform/discussions](https://github.com/steedos/steedos-platform/discussions)

---

**Maintained by**: Steedos Core Team  
**Last Review**: 2026-01-12
