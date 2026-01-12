# 快速开始：使用 PNPM 和测试流程

本文档为开发者提供快速上手指南。

## 环境准备

### 必需软件

1. **Node.js** >= 22.0.0
   ```bash
   node --version  # 检查版本
   ```

2. **pnpm** >= 9.0.0
   ```bash
   npm install -g pnpm
   pnpm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

### 可选软件

- **Docker** (用于运行依赖服务)
- **VS Code** (推荐的 IDE)

## 初始化项目

### 1. 克隆仓库

```bash
git clone https://github.com/steedos/steedos-platform.git
cd steedos-platform
```

### 2. 安装依赖

```bash
# 使用 pnpm 安装所有依赖
pnpm install
```

这可能需要几分钟，pnpm 会：
- 下载所有依赖包
- 创建符号链接
- 构建原生模块

### 3. 构建项目

```bash
pnpm run build
```

## 开发工作流

### 日常开发

```bash
# 1. 更新代码
git pull

# 2. 安装新依赖（如有）
pnpm install

# 3. 启动开发服务器
pnpm start
# 或
pnpm run webapp

# 4. 在另一个终端运行测试（可选）
pnpm -r run test -- --watch
```

### 添加新功能

```bash
# 1. 创建功能分支
git checkout -b feature/my-feature

# 2. 修改代码...

# 3. 添加测试
# 在相应的 test/ 目录下创建测试文件

# 4. 运行测试
pnpm --filter <workspace> run test

# 5. 运行 linting
pnpm exec eslint .

# 6. 提交代码
git add .
git commit -m "feat: add my feature"

# 7. 推送并创建 PR
git push origin feature/my-feature
```

### 修复 Bug

```bash
# 1. 创建修复分支
git checkout -b fix/bug-description

# 2. 编写失败的测试（重现 bug）
# test/unit/myfeature.test.ts

# 3. 修复代码直到测试通过
pnpm run test

# 4. 确保所有测试通过
pnpm -r run test

# 5. 提交并推送
git add .
git commit -m "fix: description of the fix"
git push origin fix/bug-description
```

## 运行测试

### 单元测试

```bash
# 运行所有单元测试
pnpm -r run test

# 运行特定包的测试
pnpm --filter @steedos/objectql run test

# 监视模式（自动重新运行）
pnpm --filter @steedos/objectql run test -- --watch

# 运行单个测试文件
pnpm --filter @steedos/objectql run test -- test/unit/specific.test.ts
```

### 集成测试

```bash
# 1. 启动依赖服务
docker-compose up -d mongodb redis nats

# 2. 等待服务就绪
sleep 10

# 3. 运行集成测试
pnpm -r run test:integration

# 4. 清理
docker-compose down
```

### 查看测试覆盖率

```bash
# 运行测试并生成覆盖率报告
pnpm -r run test -- --coverage

# 打开报告（macOS）
open coverage/lcov-report/index.html

# 打开报告（Linux）
xdg-open coverage/lcov-report/index.html
```

## 常用命令

### 包管理

```bash
# 添加依赖到根目录
pnpm add -w <package>

# 添加依赖到特定工作区
pnpm add <package> --filter @steedos/objectql

# 添加开发依赖
pnpm add -D <package>

# 删除依赖
pnpm remove <package>

# 更新依赖
pnpm update
pnpm update -i  # 交互式更新
```

### 构建

```bash
# 构建所有包
pnpm run build

# 构建特定包
pnpm --filter @steedos/objectql run build

# 清理构建产物
pnpm -r run clean
# 或
rm -rf packages/*/lib services/*/lib
```

### 代码质量

```bash
# Linting
pnpm exec eslint .
pnpm exec eslint . --fix  # 自动修复

# 格式化
pnpm exec prettier --write "**/*.{ts,tsx,js,json,md}"

# 类型检查
pnpm exec tsc --noEmit
```

### Git 工作流

```bash
# 查看状态
git status

# 创建分支
git checkout -b feature/my-feature

# 提交代码
git add .
git commit -m "feat: my feature"

# 推送代码
git push origin feature/my-feature

# 同步主分支
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main
```

## 故障排除

### 问题：依赖安装失败

```bash
# 清理并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 问题：构建失败

```bash
# 清理构建产物
pnpm -r run clean
rm -rf packages/*/lib services/*/lib

# 重新构建
pnpm run build
```

### 问题：测试失败

```bash
# 清理测试缓存
pnpm -r exec jest --clearCache

# 重新运行测试
pnpm -r run test
```

### 问题：端口已被占用

```bash
# 查找占用端口的进程（例如 3000）
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 问题：Git 冲突

```bash
# 查看冲突文件
git status

# 解决冲突后
git add .
git rebase --continue
# 或
git merge --continue
```

## IDE 配置

### VS Code 推荐设置

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### VS Code 推荐插件

- ESLint
- Prettier
- EditorConfig
- GitLens
- Jest Runner
- TypeScript Vue Plugin (Volar)

安装方法：
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension editorconfig.editorconfig
code --install-extension eamodio.gitlens
code --install-extension firsttris.vscode-jest-runner
```

## 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (type)

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
git commit -m "feat(objectql): add new query builder"
git commit -m "fix(auth): resolve login token expiration issue"
git commit -m "docs: update installation guide"
git commit -m "test(api): add integration tests for user service"
```

## 性能优化技巧

### 1. 使用过滤器

```bash
# 只构建改变的包
pnpm -r --filter "...[origin/main]" run build

# 构建特定包及其依赖
pnpm -r --filter "@steedos/objectql..." run build
```

### 2. 并行执行

```bash
# 并行构建（小心内存使用）
pnpm -r --parallel run build

# 限制并发数
pnpm -r --workspace-concurrency=4 run build
```

### 3. 缓存

```bash
# pnpm 会自动缓存，查看缓存状态
pnpm store status

# 清理未使用的缓存
pnpm store prune
```

## 调试技巧

### Node.js 调试

```bash
# 使用 inspect 模式运行
node --inspect-brk packages/objectql/lib/index.js

# 在 Chrome 中调试
# 打开 chrome://inspect
```

### VS Code 调试

使用 F5 或调试面板，配置已在 `.vscode/launch.json` 中。

### 日志调试

```typescript
// 使用环境变量控制日志级别
DEBUG=steedos:* pnpm start

// 或在代码中
console.debug('Debug info:', data);
```

## 获取帮助

### 资源

- 📖 [完整文档](./PNPM_MIGRATION_EVALUATION.md)
- 📘 [迁移指南](./PNPM_MIGRATION_GUIDE.md)
- 📗 [测试指南](./TESTING_GUIDE.md)
- 🐛 [Issues](https://github.com/steedos/steedos-platform/issues)
- 💬 [Discussions](https://github.com/steedos/steedos-platform/discussions)

### 联系方式

- 在 GitHub Issues 中提问
- 在团队 Slack/Discord 中讨论
- 查看现有代码示例

## 下一步

现在你已经准备好开始开发了！建议：

1. 阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)
2. 熟悉项目结构
3. 运行示例应用
4. 尝试修复一个简单的 Issue
5. 编写你的第一个测试

祝编码愉快！ 🚀
