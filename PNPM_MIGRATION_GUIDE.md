# PNPM 迁移指南

本指南帮助团队成员从 Yarn 迁移到 pnpm。

## 为什么要迁移到 pnpm？

- ⚡ **更快**: 比 Yarn/npm 快 2-3 倍
- 💾 **省空间**: 使用硬链接节省磁盘空间 50-70%
- 🔒 **更严格**: 避免幽灵依赖，确保依赖正确性
- 🎯 **monorepo 友好**: 原生支持工作区，与 Lerna 完美集成

## 安装 pnpm

### 方法 1: 使用 npm
```bash
npm install -g pnpm
```

### 方法 2: 使用 Corepack (推荐)
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 方法 3: 使用安装脚本
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

验证安装：
```bash
pnpm --version
```

## 项目设置

项目已配置好 pnpm，包括：

1. ✅ `pnpm-workspace.yaml` - 工作区配置
2. ✅ `.npmrc` - pnpm 配置
3. ✅ `package.json` - packageManager 字段已更新

## 基本使用

### 安装依赖

```bash
# 安装所有工作区依赖
pnpm install

# 等同于 yarn install --frozen-lockfile
pnpm install --frozen-lockfile

# 仅安装生产依赖
pnpm install --prod
```

### 添加/删除依赖

```bash
# 添加依赖到根目录
pnpm add -w <package>

# 添加依赖到特定工作区
pnpm add <package> --filter <workspace>

# 添加开发依赖
pnpm add -D <package>

# 删除依赖
pnpm remove <package>
```

### 运行脚本

```bash
# 运行根目录脚本
pnpm run build
pnpm start

# 在所有工作区运行脚本 (类似 lerna run)
pnpm -r run build
pnpm -r run test

# 在特定工作区运行
pnpm --filter @steedos/objectql run test
pnpm --filter "./packages/**" run build
```

### 更新依赖

```bash
# 更新所有依赖
pnpm update

# 更新特定依赖
pnpm update <package>

# 交互式更新
pnpm update -i
```

## 常见命令对照表

| Yarn | pnpm | 说明 |
|------|------|------|
| `yarn` | `pnpm install` | 安装依赖 |
| `yarn add pkg` | `pnpm add pkg` | 添加依赖 |
| `yarn add -D pkg` | `pnpm add -D pkg` | 添加开发依赖 |
| `yarn remove pkg` | `pnpm remove pkg` | 删除依赖 |
| `yarn run script` | `pnpm run script` | 运行脚本 |
| `yarn workspace ws add pkg` | `pnpm add pkg --filter ws` | 工作区添加依赖 |
| `lerna run build` | `pnpm -r run build` | 所有包运行脚本 |
| `yarn why pkg` | `pnpm why pkg` | 查看依赖原因 |

## Lerna 集成

pnpm 可以与 Lerna 一起使用：

```bash
# Lerna 命令仍然可用
yarn lerna publish

# 或使用 pnpm 的递归命令
pnpm -r exec npm publish
```

## 开发工作流

### 1. 克隆项目后首次设置

```bash
# 克隆仓库
git clone https://github.com/steedos/steedos-platform.git
cd steedos-platform

# 安装 pnpm (如果还没有)
npm install -g pnpm

# 安装依赖
pnpm install

# 构建项目
pnpm run build
```

### 2. 日常开发

```bash
# 更新代码
git pull

# 安装新依赖（如果有）
pnpm install

# 启动开发服务器
pnpm start

# 或启动 webapp
pnpm run webapp
```

### 3. 添加新功能

```bash
# 创建新分支
git checkout -b feature/new-feature

# 修改代码...

# 添加新依赖（如需要）
pnpm add <package> --filter <workspace>

# 运行测试
pnpm -r run test

# 构建
pnpm run build
```

### 4. 发布流程

```bash
# 构建所有包
pnpm run build

# 使用 Lerna 发布
pnpm run release:beta
# 或
pnpm run release:again
```

## 故障排除

### 问题 1: 找不到模块

如果遇到 "Cannot find module" 错误：

```bash
# 清理缓存和 node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 问题 2: 幽灵依赖问题

如果某个包在 Yarn 下能工作但在 pnpm 下不行，可能是因为它依赖了未声明的依赖：

```bash
# 在 .npmrc 中添加（已配置）
shamefully-hoist=true
```

或者，正确添加缺失的依赖：

```bash
pnpm add <missing-package> --filter <workspace>
```

### 问题 3: 构建失败

```bash
# 清理构建产物
pnpm -r run clean
# 或
rm -rf packages/*/lib services/*/lib

# 重新构建
pnpm run build
```

### 问题 4: 版本冲突

```bash
# 查看依赖树
pnpm list <package>

# 查看为什么安装了某个包
pnpm why <package>

# 强制解决冲突
pnpm install --force
```

## 性能优化技巧

### 1. 使用 pnpm 缓存

pnpm 会自动缓存所有下载的包，但你可以管理缓存：

```bash
# 查看缓存位置
pnpm store path

# 查看缓存状态
pnpm store status

# 清理未使用的缓存
pnpm store prune
```

### 2. 并行执行

```bash
# 并行构建所有包
pnpm -r --parallel run build

# 限制并发数
pnpm -r --workspace-concurrency=4 run build
```

### 3. 过滤执行

```bash
# 只运行改变的包
pnpm -r --filter "...[origin/main]" run test

# 运行特定包及其依赖
pnpm -r --filter "@steedos/objectql..." run build
```

## CI/CD 配置

### GitHub Actions

项目已配置好 GitHub Actions，参考：
- `.github/workflows/test.yml` - 基本测试
- `.github/workflows/integration-test.yml` - 集成测试

关键步骤：

```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 9

- uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}

- run: pnpm install --frozen-lockfile
```

### Docker 构建

```dockerfile
# 使用 pnpm
FROM node:22-alpine
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm run build
```

## 最佳实践

1. **提交 pnpm-lock.yaml**
   - 始终提交 lock 文件到版本控制
   - 确保团队使用相同的依赖版本

2. **使用 --frozen-lockfile**
   - CI 中始终使用 `pnpm install --frozen-lockfile`
   - 确保 CI 构建的可重复性

3. **定期更新依赖**
   - 定期运行 `pnpm update -i`
   - 检查和修复安全漏洞

4. **使用过滤器**
   - 利用 `--filter` 提高效率
   - 只运行受影响的包

5. **配置 .npmrc**
   - 为团队统一配置
   - 提交到版本控制

## 资源链接

- [pnpm 官方文档](https://pnpm.io/)
- [pnpm CLI 文档](https://pnpm.io/cli/add)
- [工作区文档](https://pnpm.io/workspaces)
- [pnpm vs npm/yarn](https://pnpm.io/benchmarks)
- [迁移指南](https://pnpm.io/installation#using-a-shorter-alias)

## 获取帮助

遇到问题？

1. 查看本文档的故障排除部分
2. 查看 pnpm 官方文档
3. 在团队中询问
4. 在项目 Issues 中提问

## 反馈

如果你发现本指南有任何问题或需要补充的内容，请：

1. 创建 Pull Request
2. 创建 Issue
3. 联系项目维护者
