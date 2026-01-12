# 工作流自动化文档 | Workflow Automation Guide

> **版本**: 1.0.0  
> **最后更新**: 2026-01-12  
> **目的**: 文档化 Steedos Platform 的所有自动化工作流程

## 📋 目录

1. [代码质量自动化](#代码质量自动化)
2. [持续集成 (CI)](#持续集成-ci)
3. [安全扫描](#安全扫描)
4. [Pull Request 自动化](#pull-request-自动化)
5. [依赖管理自动化](#依赖管理自动化)
6. [发布自动化](#发布自动化)
7. [本地 Git Hooks](#本地-git-hooks)

---

## 代码质量自动化

### Pre-commit Hooks

**文件**: `.husky/pre-commit`

**触发时机**: 每次 `git commit` 之前

**执行内容**:
1. 运行 `lint-staged`
2. 自动修复 ESLint 错误
3. 自动格式化代码（Prettier）
4. 只处理暂存的文件

**配置**: `package.json` 中的 `lint-staged` 字段

```json
"lint-staged": {
  "**/*.{ts,js}": [
    "eslint --fix",
    "prettier --write"
  ],
  "**/*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

**如何跳过** (紧急情况):
```bash
git commit --no-verify
```

### Commit Message Validation

**文件**: `.husky/commit-msg`

**触发时机**: 每次 `git commit` 时

**执行内容**:
1. 使用 commitlint 验证提交信息格式
2. 确保符合 Angular 提交规范

**格式要求**:
```
type(scope?): subject

例如:
feat(objectql): add support for complex filters
fix(metadata): resolve circular dependency issue
docs: update API documentation
```

**允许的类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具配置
- `ci`: CI 配置
- `build`: 构建系统

---

## 持续集成 (CI)

### CI - Code Quality

**文件**: `.github/workflows/ci.yml`

**触发时机**:
- Pull Request 到主分支
- Push 到主分支

**包含作业**:

#### 1. Lint and Format Check
- 运行 ESLint 检查代码质量
- 验证 Prettier 格式
- TypeScript 类型检查

#### 2. Test
- 运行所有测试套件
- 生成测试覆盖率报告
- 上传覆盖率到 Codecov

#### 3. Build Check
- 验证所有包能成功构建
- 确保生成构建产物

**查看结果**:
- PR 中自动显示检查状态
- 点击 "Details" 查看详细日志

---

## 安全扫描

### Security Scan

**文件**: `.github/workflows/security.yml`

**触发时机**:
- 每天自动运行（UTC 2:00 AM）
- Pull Request 到主分支
- 手动触发

**包含作业**:

#### 1. NPM Security Audit
- 扫描依赖包的安全漏洞
- 生成审计报告
- 保存结果 30 天

#### 2. CodeQL Analysis
- 静态代码分析
- 检测常见安全漏洞
- 检测代码质量问题
- 支持 JavaScript 和 TypeScript

#### 3. Dependency Review
- 在 PR 中审查依赖变更
- 检查新增依赖的安全问题
- 阻止添加特定许可证的依赖（GPL-2.0, GPL-3.0）

**查看结果**:
- GitHub Security 标签页
- PR 检查状态

---

## Pull Request 自动化

### PR Automation

**文件**: `.github/workflows/pr-automation.yml`

**触发时机**: PR 打开、更新或重新打开

**自动化功能**:

#### 1. 自动标签

基于文件路径:
- `documentation`: 修改了文档文件
- `core`: 核心包变更
- `services`: 服务变更
- `tests`: 测试文件
- `dependencies`: 依赖更新

基于 PR 大小:
- `XS`: 0-19 行
- `S`: 20-49 行
- `M`: 50-199 行
- `L`: 200-499 行
- `XL`: 500-999 行
- `XXL`: 1000+ 行

基于分支名称:
- `feature/*` → `feature` 标签
- `fix/*` → `bugfix` 标签
- `docs/*` → `documentation` 标签

#### 2. 自动分配审查者

**配置**: `.github/auto-assign.yml`

- 自动分配审查者到 PR
- 跳过 WIP/draft PR
- 可配置审查者列表

**当前配置**:
- 默认审查者: `hotlong`
- 每个 PR 分配 1 个审查者

---

## 依赖管理自动化

### Dependency Update

**文件**: `.github/workflows/dependency-update.yml`

**触发时机**:
- 每周一自动运行（UTC 9:00 AM）
- 手动触发

**执行内容**:
1. 更新所有依赖到最新版本
2. 运行 depcheck 检查未使用的依赖
3. 自动创建 PR

**PR 内容**:
- 标题: `chore: automated dependency updates`
- 标签: `dependencies`, `automated`
- 包含变更摘要和审查清单

**审查要点**:
- 检查是否有破坏性变更
- 运行测试确保兼容性
- 更新 changelog

---

## 发布自动化

### NPM Release

**文件**: `.github/workflows/npm-release.yml`

**触发时机**: 推送版本标签（`v2.7.**`, `v3.0.**`）

**工作流程**:

#### 1. NPM Release
- 验证标签格式
- 构建所有包
- 发布到 NPM registry
- 推送版本提交

#### 2. Docker Release
- 构建 Docker 镜像
- 推送到 Docker Hub
- 支持多平台（amd64, arm64）

#### 3. Docker Sync
- 同步镜像到阿里云镜像仓库
- 确保国内访问速度

#### 4. NPM Sync
- 同步包到 CNPM
- 加速国内下载

**发布步骤**:
```bash
# 1. 更新版本
yarn lerna version --conventional-commits

# 2. 推送标签（自动触发发布）
git push --follow-tags
```

---

## 本地 Git Hooks

### 已配置的 Hooks

#### pre-commit
- **作用**: 代码质量检查
- **执行**: ESLint + Prettier
- **位置**: `.husky/pre-commit`

#### commit-msg
- **作用**: 提交信息验证
- **执行**: commitlint
- **位置**: `.husky/commit-msg`

### 安装 Hooks

Hooks 在 `yarn install` 后自动安装（通过 `prepare` 脚本）

手动安装:
```bash
yarn prepare
```

---

## 工作流最佳实践

### 1. 开发流程

```bash
# 1. 创建功能分支
git checkout -b feat/my-feature

# 2. 进行开发
# 代码会在 commit 前自动格式化和检查

# 3. 提交（遵循规范）
git commit -m "feat(core): add new feature"

# 4. 推送并创建 PR
git push origin feat/my-feature

# 5. PR 会自动:
#    - 运行 CI 检查
#    - 添加标签
#    - 分配审查者
#    - 运行安全扫描
```

### 2. 修复 CI 失败

如果 CI 检查失败:

```bash
# ESLint 错误
yarn lint:fix

# 格式问题
yarn format

# 类型错误
yarn type-check

# 测试失败
yarn test

# 构建失败
yarn build
```

### 3. 发布新版本

```bash
# 1. 确保在正确的分支
git checkout 3.0

# 2. 拉取最新代码
git pull

# 3. 版本升级（会自动创建标签）
yarn lerna version patch  # 或 minor, major

# 4. 推送（触发自动发布）
git push --follow-tags

# 5. 监控 GitHub Actions
# 检查发布工作流是否成功
```

---

## 故障排查

### CI 检查失败

**问题**: Lint 检查失败
```bash
# 本地运行相同检查
yarn lint

# 自动修复
yarn lint:fix
```

**问题**: 测试失败
```bash
# 运行测试
yarn test

# 查看覆盖率
yarn test:coverage
```

**问题**: 构建失败
```bash
# 清理并重新构建
yarn clean
yarn build
```

### Git Hooks 问题

**问题**: Hooks 不执行
```bash
# 重新安装 hooks
rm -rf .husky
yarn prepare
```

**问题**: Commitlint 失败
```bash
# 查看提交消息格式要求
cat .commitlintrc.json

# 示例正确格式
git commit -m "feat: add new feature"
git commit -m "fix(core): resolve bug"
```

### 发布流程问题

**问题**: 标签推送失败
```bash
# 检查远程分支
git remote -v

# 强制推送标签
git push origin --tags --force
```

**问题**: NPM 发布失败
- 检查 NPM_AUTH_TOKEN secret 是否配置
- 验证包名是否可用
- 检查版本号是否已存在

---

## 配置文件索引

| 文件 | 用途 |
|------|------|
| `.github/workflows/ci.yml` | CI 代码质量检查 |
| `.github/workflows/security.yml` | 安全扫描 |
| `.github/workflows/pr-automation.yml` | PR 自动化 |
| `.github/workflows/dependency-update.yml` | 依赖更新 |
| `.github/workflows/npm-release.yml` | NPM 发布 |
| `.github/labeler.yml` | 自动标签规则（文件路径） |
| `.github/pr-labeler.yml` | 自动标签规则（分支名） |
| `.github/auto-assign.yml` | 自动分配审查者 |
| `.husky/pre-commit` | 提交前检查 |
| `.husky/commit-msg` | 提交信息验证 |
| `.commitlintrc.json` | Commitlint 配置 |
| `package.json` (lint-staged) | Lint-staged 配置 |

---

## 扩展阅读

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Husky 文档](https://typicode.github.io/husky/)
- [Commitlint 文档](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Lerna 文档](https://lerna.js.org/)

---

**维护者**: Steedos Core Team  
**最后审查**: 2026-01-12
