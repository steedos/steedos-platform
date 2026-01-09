# Steedos Platform 代码优化 - 快速行动清单

> 这是一份可以立即执行的具体改进任务清单，按照实施难度和收益排序

## 🚀 立即可执行的快速改进（Quick Wins）

### 1. 添加统一日志服务 (2-3天)

**为什么重要**: 发现 350+ 处 console.log 使用，需要统一管理

**执行步骤**:
```bash
# 1. 安装依赖
cd /home/runner/work/steedos-platform/steedos-platform
yarn add -W winston winston-daily-rotate-file

# 2. 创建日志包
mkdir -p packages/logger/src
cat > packages/logger/src/index.ts << 'EOF'
import winston from 'winston';

export const createLogger = (service: string) => {
  return winston.createLogger({
    defaultMeta: { service },
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  });
};

export const logger = createLogger('steedos-platform');
EOF

# 3. 添加 package.json
cat > packages/logger/package.json << 'EOF'
{
  "name": "@steedos/logger",
  "version": "3.0.12",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "dependencies": {
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^5.0.0"
  }
}
EOF

# 4. 添加 ESLint 规则禁止 console
# 在 eslint.config.mjs 中添加：
# rules: { 'no-console': 'error' }
```

---

### 2. 清理技术债务标记 (1-2天)

**为什么重要**: 发现 41 个文件包含 TODO/FIXME，需要整理

**执行步骤**:
```bash
# 1. 导出所有 TODO/FIXME
cd /home/runner/work/steedos-platform/steedos-platform
grep -r "TODO\|FIXME\|HACK\|XXX" packages services --include="*.ts" --include="*.js" -n > TECH_DEBT.txt

# 2. 在 GitHub Issues 中创建追踪任务
# - 为每个重要的 TODO 创建 issue
# - 添加 "tech-debt" 标签
# - 分配优先级

# 3. 移除已解决的 TODO
# 4. 为无法立即解决的添加 issue 引用
# 例如: // TODO(#123): Implement feature X
```

---

### 3. 减少 @ts-ignore 使用 (3-5天)

**为什么重要**: 发现 4 处 @ts-ignore，这会隐藏类型错误

**执行步骤**:
```bash
# 1. 找到所有使用位置
grep -r "@ts-ignore\|@ts-nocheck" builder6 packages services --include="*.ts" --include="*.tsx"

# 2. 逐个修复
# - builder6/webapp/src/main.tsx: 1处
# - builder6/webapp/src/root.tsx: 2处  
# - builder6/webapp/src/components/Navbar.tsx: 1处
# - builder6/webapp/src/components/intl_provider/intl_provider.tsx: 1处

# 3. 修复方式：
# - 添加正确的类型定义
# - 使用类型断言 (as Type)
# - 使用 unknown 类型并进行类型守卫
```

---

### 4. 添加 Git Hooks 质量检查 (1天)

**为什么重要**: 已有 husky 配置，可以增强检查

**执行步骤**:
```bash
# 1. 更新 .husky/pre-commit
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 运行 lint-staged
yarn lint-staged

# 检查是否有未解决的冲突标记
if git diff --cached | grep -E '<<<<<<|>>>>>>|======' > /dev/null; then
  echo "Error: Merge conflict markers found"
  exit 1
fi

# 检查是否有调试语句
if git diff --cached --name-only | grep -E '\.(ts|js|tsx|jsx)$' | xargs grep -n 'debugger\|console\.log' > /dev/null; then
  echo "Warning: Found debugger or console.log statements"
  echo "Please remove them before committing"
  # 可以设置为 exit 1 强制阻止提交
fi
EOF

chmod +x .husky/pre-commit

# 2. 添加 commit-msg hook 检查提交信息
# 已经配置了 commitlint，确保它正常工作
```

---

### 5. 创建 TypeScript 严格配置 (1天)

**为什么重要**: 为新代码启用严格模式，逐步改善类型安全

**执行步骤**:
```bash
# 1. 创建严格配置
cat > tsconfig.strict.json << 'EOF'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "packages/logger/**/*",
    // 新包在此添加
  ]
}
EOF

# 2. 文档说明
cat >> CONTRIBUTING.md << 'EOF'

## TypeScript 编码规范

### 新代码要求
所有新建的包必须使用严格的 TypeScript 配置：

1. 在包的 tsconfig.json 中继承 tsconfig.strict.json
2. 禁止使用 `any` 类型，使用 `unknown` 替代
3. 所有函数必须有明确的返回类型注解
4. 启用所有严格检查选项

### 遗留代码
现有代码可以继续使用宽松配置，但鼓励在重构时逐步迁移到严格模式。
EOF
```

---

### 6. 建立测试基础设施 (2-3天)

**为什么重要**: 测试文件仅 20 个，覆盖率严重不足

**执行步骤**:
```bash
# 1. 安装测试依赖
yarn add -D -W jest @types/jest ts-jest
yarn add -D -W @testing-library/react @testing-library/jest-dom
yarn add -D -W c8  # 代码覆盖率工具

# 2. 创建 Jest 配置
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/services'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    'services/**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
};
EOF

# 3. 添加测试脚本到 package.json
# "test": "jest",
# "test:watch": "jest --watch",
# "test:coverage": "jest --coverage"

# 4. 创建示例测试
mkdir -p packages/utils/__tests__
cat > packages/utils/__tests__/example.test.ts << 'EOF'
describe('Utils Package', () => {
  it('should pass example test', () => {
    expect(1 + 1).toBe(2);
  });
});
EOF
```

---

### 7. 依赖安全审计 (半天)

**执行步骤**:
```bash
# 1. 运行 yarn audit
yarn audit

# 2. 自动修复（如果可能）
yarn audit fix

# 3. 检查过期依赖
yarn outdated

# 4. 添加 Snyk 监控（可选）
yarn add -D snyk
npx snyk test
npx snyk monitor  # 持续监控

# 5. 在 GitHub Actions 中添加安全检查
# .github/workflows/security.yml
cat > .github/workflows/security.yml << 'EOF'
name: Security Audit

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # 每周日运行

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: yarn install
      - run: yarn audit
EOF
```

---

### 8. 文档改进 (持续)

**执行步骤**:
```bash
# 1. 为每个重要包添加 README.md（如果缺失）
packages=(
  "objectql"
  "metadata-core"
  "formula"
  "process"
  "accounts"
)

for pkg in "${packages[@]}"; do
  if [ ! -f "packages/$pkg/README.md" ]; then
    cat > "packages/$pkg/README.md" << EOF
# @steedos/$pkg

## 概述
[简要描述包的功能]

## 安装
\`\`\`bash
yarn add @steedos/$pkg
\`\`\`

## 使用示例
\`\`\`typescript
// 添加使用示例
\`\`\`

## API 文档
[链接到详细 API 文档]

## 贡献
参见 [CONTRIBUTING.md](../../CONTRIBUTING.md)
EOF
  fi
done

# 2. 添加 API 文档生成
yarn add -D -W typedoc
cat > typedoc.json << 'EOF'
{
  "entryPoints": ["packages/*/src/index.ts"],
  "out": "docs/api",
  "exclude": ["**/node_modules/**", "**/*.test.ts"]
}
EOF

# 在 package.json 添加:
# "docs": "typedoc"
```

---

### 9. 性能监控基础 (1-2天)

**执行步骤**:
```bash
# 1. 添加健康检查端点
# 在主服务中添加:
cat > services/service-api/health.js << 'EOF'
module.exports = {
  name: "health",
  
  actions: {
    check: {
      async handler(ctx) {
        return {
          status: "UP",
          timestamp: Date.now(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: require('../../package.json').version
        };
      }
    }
  }
};
EOF

# 2. 添加 Prometheus metrics（可选）
yarn add -W prom-client

# 3. 创建简单的性能测试脚本
cat > scripts/perf-test.js << 'EOF'
const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:5000/health',
  connections: 10,
  pipelining: 1,
  duration: 10
});

autocannon.track(instance, { renderProgressBar: true });
EOF

yarn add -D autocannon
# 运行: node scripts/perf-test.js
```

---

### 10. 代码格式化检查 (半天)

**执行步骤**:
```bash
# 1. 确保 Prettier 配置正确
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# 2. 添加格式化检查到 CI
# 在 package.json 添加:
# "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
# "format:fix": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""

# 3. 运行全局格式化（首次）
yarn format:fix

# 4. 在 lint-staged 中确保格式化
# package.json 中已有配置，确认正常工作
```

---

## 📊 优先级矩阵

| 任务 | 影响力 | 难度 | 时间 | 推荐顺序 |
|------|--------|------|------|----------|
| Git Hooks 质量检查 | 高 | 低 | 1天 | 1️⃣ |
| 依赖安全审计 | 高 | 低 | 0.5天 | 2️⃣ |
| 代码格式化检查 | 中 | 低 | 0.5天 | 3️⃣ |
| 添加统一日志服务 | 高 | 中 | 2-3天 | 4️⃣ |
| 清理技术债务标记 | 中 | 低 | 1-2天 | 5️⃣ |
| 减少 @ts-ignore | 中 | 中 | 3-5天 | 6️⃣ |
| TypeScript 严格配置 | 高 | 低 | 1天 | 7️⃣ |
| 建立测试基础设施 | 高 | 中 | 2-3天 | 8️⃣ |
| 文档改进 | 中 | 低 | 持续 | 9️⃣ |
| 性能监控基础 | 中 | 中 | 1-2天 | 🔟 |

---

## 🎯 本周可以完成的任务

**第一天**:
- ✅ Git Hooks 质量检查
- ✅ 依赖安全审计
- ✅ 代码格式化检查

**第二天**:
- ✅ TypeScript 严格配置
- ✅ 清理技术债务标记（部分）

**第三天**:
- ✅ 添加统一日志服务
- ✅ 性能监控基础

**第四天-第五天**:
- ✅ 建立测试基础设施
- ✅ 减少 @ts-ignore（开始）

---

## 📝 执行检查清单

在执行每个任务后，确保：

- [ ] 代码可以正常构建（`yarn build`）
- [ ] 所有现有测试通过（`yarn test`）
- [ ] 代码通过 lint 检查（`yarn eslint`）
- [ ] 更新相关文档
- [ ] 创建 Pull Request 并请求代码审查
- [ ] 在团队内分享改进成果

---

## 🚨 注意事项

1. **渐进式改进**: 不要一次性改动太多，容易引入问题
2. **向后兼容**: 确保改动不影响现有功能
3. **团队沟通**: 大的改动需要提前与团队沟通
4. **测试验证**: 每次改动都要充分测试
5. **文档同步**: 代码改动要同步更新文档

---

## 📞 需要帮助？

如果在执行过程中遇到问题：
1. 查看详细的优化建议文档 `CODE_OPTIMIZATION_SUGGESTIONS.md`
2. 在团队内部讨论
3. 在 GitHub Discussions 中提问
4. 参考官方文档和社区资源

---

*创建日期: 2026-01-09*
*最后更新: 2026-01-09*
