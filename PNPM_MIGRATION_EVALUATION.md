# Steedos Platform PNPM 迁移评估报告

## 执行概要

本文档评估了将 Steedos Platform 从 Yarn 3.8.7 迁移到 pnpm 的可行性，并提供了基本测试流程的实施方案。

## 当前项目状态

### 技术栈
- **包管理器**: Yarn 3.8.7 (现代 Yarn)
- **Node.js 版本**: >=22.0.0
- **Monorepo 工具**: Lerna 9.0.3
- **工作区数量**: 
  - packages: 28个包
  - services: 38个服务
  - ee: 企业版包
  - builder6: 构建工具

### 现有测试基础设施
项目已有一定的测试基础：
- Jest 测试框架 (packages/moleculer-apollo-server)
- Mocha 测试框架 (packages/objectql)
- TypeScript 测试文件 (builder6)
- 部分包已配置测试脚本

## PNPM 迁移评估

### ✅ 优势

1. **性能提升**
   - pnpm 使用符号链接和硬链接，磁盘空间使用效率高
   - 安装速度比 Yarn 快 2-3 倍
   - 严格的依赖解析，避免幽灵依赖

2. **兼容性**
   - 完全支持 monorepo 工作区
   - 与 Lerna 良好集成
   - 支持 Node.js 22+

3. **节省空间**
   - 全局存储共享依赖
   - 项目中只存储符号链接
   - 可节省 50-70% 的磁盘空间

### ⚠️ 注意事项

1. **配置调整**
   - 需要创建 `pnpm-workspace.yaml` 替代 package.json 的 workspaces
   - 需要创建 `.npmrc` 配置文件
   - 可能需要调整某些构建脚本

2. **依赖严格性**
   - pnpm 默认不提升所有依赖
   - 某些依赖于扁平 node_modules 的工具可能需要调整
   - 建议使用 `shamefully-hoist=true` 进行过渡

3. **CI/CD 调整**
   - 需要更新 GitHub Actions 工作流
   - 需要更新 Docker 构建脚本
   - 需要更新发布流程

### 🔄 迁移步骤

1. **准备阶段**
   - [x] 创建 `pnpm-workspace.yaml`
   - [x] 创建 `.npmrc` 配置
   - [x] 更新 `package.json` 的 packageManager 字段

2. **测试阶段**
   - [ ] 运行 `pnpm install` 测试依赖安装
   - [ ] 运行 `pnpm build` 测试构建
   - [ ] 运行现有测试套件
   - [ ] 验证所有包的构建输出

3. **CI/CD 更新**
   - [ ] 更新 GitHub Actions 工作流
   - [ ] 更新 Docker 构建文件
   - [ ] 更新发布脚本

4. **文档更新**
   - [ ] 更新 README
   - [ ] 更新 CONTRIBUTING.md
   - [ ] 创建迁移指南

## 测试流程设计

### 基本测试工作流

已创建 `.github/workflows/test.yml`，包含以下功能：

1. **多 Node.js 版本测试**
   - Node.js 22.x (主要版本)
   - Node.js 20.x (兼容性测试)

2. **测试步骤**
   - 代码检出
   - pnpm 缓存配置
   - 依赖安装
   - 代码检查 (Linting)
   - 类型检查 (TypeScript)
   - 单元测试运行
   - 构建验证

3. **优化特性**
   - 使用 pnpm 缓存加速 CI
   - 并行测试执行
   - 测试结果报告

### 集成测试工作流

已创建 `.github/workflows/integration-test.yml`，包含：

1. **服务依赖**
   - MongoDB
   - Redis
   - NATS

2. **集成测试**
   - 数据库集成测试
   - API 集成测试
   - 服务间通信测试

## 建议的迁移策略

### 方案 A: 渐进式迁移（推荐）

1. **阶段 1**: 并行支持 (1-2周)
   - 同时支持 Yarn 和 pnpm
   - 团队成员逐步切换到 pnpm
   - 监控和解决兼容性问题

2. **阶段 2**: 更新 CI/CD (1周)
   - 更新所有自动化流程
   - 确保发布流程正常工作

3. **阶段 3**: 完全迁移 (1周)
   - 移除 Yarn 相关配置
   - 删除 yarn.lock
   - 更新所有文档

### 方案 B: 快速迁移

1. 直接切换到 pnpm
2. 一次性更新所有配置
3. 集中解决所有问题

**推荐使用方案 A**，风险更低，团队适应更容易。

## 风险评估

| 风险 | 级别 | 缓解措施 |
|------|------|----------|
| 依赖安装失败 | 中 | 使用 shamefully-hoist 配置 |
| 构建脚本不兼容 | 低 | 逐个测试和修复 |
| CI/CD 中断 | 中 | 在分支中充分测试 |
| 团队学习成本 | 低 | 提供文档和培训 |

## 预期收益

1. **性能提升**
   - CI 时间减少 30-40%
   - 本地开发安装速度提升 2-3倍
   - 磁盘空间节省 50-70%

2. **质量提升**
   - 更严格的依赖管理
   - 避免幽灵依赖问题
   - 更好的测试覆盖

3. **开发体验**
   - 更快的依赖安装
   - 更清晰的依赖关系
   - 更好的错误提示

## 结论

**✅ 可以迁移到 pnpm**

基于以上评估，Steedos Platform 完全可以迁移到 pnpm。主要理由：

1. 项目结构与 pnpm 兼容
2. 有明确的收益（性能、空间、质量）
3. 风险可控，可以渐进式迁移
4. pnpm 是现代化的包管理工具，代表未来趋势

## 下一步行动

1. ✅ 创建 pnpm 配置文件
2. ✅ 创建基本测试工作流
3. [ ] 在分支中测试 pnpm 安装和构建
4. [ ] 团队评审和讨论
5. [ ] 制定详细的迁移时间表
6. [ ] 开始渐进式迁移

## 附录

### 有用的 pnpm 命令

```bash
# 安装所有依赖
pnpm install

# 安装特定包
pnpm add <package>

# 更新依赖
pnpm update

# 运行脚本
pnpm run <script>

# 递归执行命令（类似 lerna run）
pnpm -r <command>

# 过滤执行
pnpm --filter <package> <command>

# 清理
pnpm store prune
```

### 参考资源

- [pnpm 官方文档](https://pnpm.io/)
- [pnpm 工作区](https://pnpm.io/workspaces)
- [从 Yarn 迁移](https://pnpm.io/continuous-integration#github-actions)
