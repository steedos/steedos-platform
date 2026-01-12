# Steedos Platform 测试流程文档

本文档描述了 Steedos Platform 的测试策略和流程。

## 测试层次

### 1. 单元测试 (Unit Tests)

测试单个函数、类或模块的功能。

**位置**: `packages/*/test/unit/`, `services/*/test/unit/`

**框架**:
- Jest (packages/moleculer-apollo-server)
- Mocha (packages/objectql)
- TypeScript Testing (builder6)

**运行方法**:
```bash
# 运行所有单元测试
pnpm -r run test

# 运行特定包的测试
pnpm --filter @steedos/objectql run test

# 监视模式
pnpm --filter @steedos/objectql run test -- --watch
```

**编写示例**:
```typescript
// packages/objectql/test/unit/example.test.ts
import { describe, it, expect } from '@jest/globals';
import { myFunction } from '../../src/myFunction';

describe('myFunction', () => {
  it('should return correct value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### 2. 集成测试 (Integration Tests)

测试多个模块或服务之间的交互。

**位置**: `packages/*/test/integration/`

**依赖服务**:
- MongoDB
- Redis
- NATS

**运行方法**:
```bash
# 启动依赖服务
docker-compose up -d mongodb redis nats

# 运行集成测试
pnpm -r run test:integration

# 停止服务
docker-compose down
```

**配置环境变量**:
```bash
export MONGO_URL=mongodb://localhost:27017/steedos-test
export REDIS_URL=redis://localhost:6379
export NATS_URL=nats://localhost:4222
export NODE_ENV=test
```

### 3. 端到端测试 (E2E Tests)

测试完整的用户场景和工作流。

**位置**: `test/e2e/`

**工具**: 
- Playwright (推荐)
- Cypress
- Selenium

**运行方法**:
```bash
# 构建项目
pnpm run build

# 启动应用
pnpm start &

# 运行 E2E 测试
pnpm run test:e2e

# 停止应用
pkill -f "node"
```

## CI/CD 测试流程

### GitHub Actions 工作流

#### 1. 基本测试工作流 (test.yml)

**触发条件**:
- 推送到 main、3.0、develop 分支
- Pull Request 到这些分支

**测试矩阵**:
- Node.js 22.x
- Node.js 20.x

**步骤**:
1. 代码检出
2. 设置 Node.js 和 pnpm
3. 安装依赖
4. 代码检查 (Linting)
5. 类型检查 (TypeScript)
6. 运行单元测试
7. 构建验证
8. 上传测试结果

**查看结果**:
- 访问 Actions 标签页
- 查看最新的工作流运行
- 下载测试结果工件

#### 2. 集成测试工作流 (integration-test.yml)

**触发条件**:
- 推送到 main、3.0 分支
- Pull Request 到这些分支
- 每天凌晨 2:00 UTC 自动运行

**服务容器**:
- MongoDB 5.0
- Redis 7
- NATS

**步骤**:
1. 启动服务容器
2. 等待服务就绪
3. 运行集成测试
4. 运行 E2E 测试（仅在 push 和 schedule 时）
5. 上传测试结果

### 本地 CI 模拟

使用 act 在本地运行 GitHub Actions:

```bash
# 安装 act
brew install act  # macOS
# 或
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# 运行测试工作流
act -j test

# 运行集成测试
act -j integration
```

## 测试覆盖率

### 生成覆盖率报告

```bash
# 运行测试并生成覆盖率
pnpm -r run test -- --coverage

# 查看覆盖率报告
open coverage/lcov-report/index.html
```

### 覆盖率目标

| 类型 | 目标 | 当前 |
|------|------|------|
| 语句覆盖率 | 80% | TBD |
| 分支覆盖率 | 75% | TBD |
| 函数覆盖率 | 80% | TBD |
| 行覆盖率 | 80% | TBD |

### 覆盖率报告位置

- `packages/*/coverage/` - 各包的覆盖率
- `coverage/` - 汇总覆盖率

## 测试最佳实践

### 1. 测试命名

```typescript
// ✅ 好的命名
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw error with invalid email', () => {});
  });
});

// ❌ 不好的命名
describe('test1', () => {
  it('works', () => {});
});
```

### 2. 测试隔离

```typescript
// ✅ 每个测试独立
beforeEach(() => {
  // 设置测试数据
  database.clear();
  user = createTestUser();
});

afterEach(() => {
  // 清理
  database.clear();
});

// ❌ 测试之间有依赖
let sharedData;
it('test 1', () => {
  sharedData = something;
});
it('test 2', () => {
  // 依赖 test 1 的数据
  expect(sharedData).toBe(something);
});
```

### 3. 使用测试辅助函数

```typescript
// test/helpers/testUtils.ts
export function createTestUser(data = {}) {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    ...data,
  };
}

export function setupTestDatabase() {
  // 设置测试数据库
}

// 在测试中使用
import { createTestUser, setupTestDatabase } from '../helpers/testUtils';
```

### 4. Mock 外部依赖

```typescript
// ✅ Mock 外部服务
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

it('should fetch data', async () => {
  mockedAxios.get.mockResolvedValue({ data: 'test' });
  const result = await fetchData();
  expect(result).toBe('test');
});
```

### 5. 异步测试

```typescript
// ✅ 使用 async/await
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});

// ✅ 或使用 done 回调
it('should handle callback', (done) => {
  callbackFunction((error, result) => {
    expect(error).toBeNull();
    expect(result).toBe('expected');
    done();
  });
});
```

## 性能测试

### 基准测试

```typescript
import { performance } from 'perf_hooks';

it('should complete within time limit', async () => {
  const start = performance.now();
  await performOperation();
  const end = performance.now();
  const duration = end - start;
  
  expect(duration).toBeLessThan(1000); // 应在 1 秒内完成
});
```

### 负载测试

使用 Artillery 或 k6 进行负载测试:

```bash
# 安装 k6
brew install k6

# 运行负载测试
k6 run test/load/api-test.js
```

## 调试测试

### VS Code 调试配置

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${relativeFile}", "--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Mocha Current File",
      "program": "${workspaceFolder}/node_modules/.bin/mocha",
      "args": ["${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 命令行调试

```bash
# Node.js 调试器
node --inspect-brk node_modules/.bin/jest --runInBand

# Chrome DevTools
# 打开 chrome://inspect
# 点击 "inspect"
```

## 测试数据管理

### Fixtures

创建测试数据文件:

```typescript
// test/fixtures/users.ts
export const testUsers = [
  {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    id: 'user-2',
    name: 'Bob',
    email: 'bob@example.com',
  },
];
```

### Factories

使用工厂函数创建测试数据:

```typescript
// test/factories/userFactory.ts
let userId = 1;

export function createUser(overrides = {}) {
  return {
    id: `user-${userId++}`,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    createdAt: new Date(),
    ...overrides,
  };
}
```

## 持续集成最佳实践

### 1. 快速失败

```yaml
# GitHub Actions 配置
strategy:
  fail-fast: true
  matrix:
    node-version: [22.x, 20.x]
```

### 2. 并行执行

```bash
# 并行运行测试
pnpm -r --parallel run test
```

### 3. 缓存依赖

```yaml
# GitHub Actions 缓存
- uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### 4. 测试报告

上传测试结果到 CI:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      **/coverage/
      **/test-results/
```

## 故障排除

### 测试超时

```typescript
// 增加超时时间
jest.setTimeout(10000); // 10 秒

// 或在特定测试中
it('long running test', async () => {
  // ...
}, 10000);
```

### 内存泄漏

```bash
# 使用 --detectLeaks 检测内存泄漏
pnpm run test -- --detectLeaks

# 增加内存限制
NODE_OPTIONS=--max_old_space_size=4096 pnpm run test
```

### 随机失败

```typescript
// 使用固定的随机种子
beforeEach(() => {
  Math.random = jest.fn(() => 0.5);
});

// 或使用 faker 的种子
import { faker } from '@faker-js/faker';
faker.seed(123);
```

## 测试检查清单

在提交代码前，确保：

- [ ] 所有新功能都有测试
- [ ] 所有测试都通过
- [ ] 测试覆盖率达标
- [ ] 没有跳过的测试 (it.skip)
- [ ] 没有独占的测试 (it.only)
- [ ] 清理了调试代码 (console.log)
- [ ] 更新了相关文档

## 参考资源

- [Jest 文档](https://jestjs.io/)
- [Mocha 文档](https://mochajs.org/)
- [Testing Library](https://testing-library.com/)
- [Playwright 文档](https://playwright.dev/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 获取帮助

- 查看现有测试示例
- 查看测试框架文档
- 在团队中询问
- 在项目 Issues 中提问
