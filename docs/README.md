# Steedos Platform 文档中心

欢迎来到 Steedos Platform (华炎魔方) 文档中心！

## 📚 核心文档

### 架构文档
- **[核心架构 (中文)](./CORE_ARCHITECTURE_CN.md)** - 深入了解 Steedos 平台的整体架构、设计模式和技术栈
- **[Core Architecture (English)](./CORE_ARCHITECTURE_EN.md)** - Comprehensive overview of Steedos platform architecture

### 开发指南
- **[开发者指南 (中文)](./DEVELOPER_GUIDE_CN.md)** - 完整的开发环境搭建、开发工作流和最佳实践
- **[包和服务索引 (中文)](./PACKAGES_INDEX_CN.md)** - 所有核心包和微服务的详细索引
- **[快速参考 (中文)](./QUICK_REFERENCE_CN.md)** - 常用命令、API 和配置的快速参考

### 技术文档
- **[ObjectQL](./objectql.md)** - 对象查询语言详细说明
- **[Object Service](./object-service.md)** - 对象服务架构
- **[Trigger](./trigger.md)** - 触发器使用指南
- **[Environment Variables](./env.md)** - 环境变量配置

## 🚀 快速开始

### 方式一：Docker 一键启动

```bash
docker run -d -p 80:80 steedos/steedos-community:3.0
```

访问 http://localhost

### 方式二：创建新项目

```bash
# 创建项目
npx create-steedos-app my-project

# 进入目录并安装依赖
cd my-project
yarn install

# 启动服务
yarn start
```

访问 http://localhost:5100

## 📖 学习路径

### 初学者
1. 阅读 [README](../README_cn.md) 了解项目概况
2. 跟随快速开始部署第一个应用
3. 学习 [ObjectQL](./objectql.md) 进行数据操作

### 开发者
1. 阅读 [核心架构文档](./CORE_ARCHITECTURE_CN.md)
2. 参考 [开发者指南](./DEVELOPER_GUIDE_CN.md) 搭建开发环境
3. 浏览 [包和服务索引](./PACKAGES_INDEX_CN.md) 了解各个模块

### 高级用户
1. 深入学习微服务架构和扩展机制
2. 自定义触发器和业务逻辑
3. 集成第三方系统和 AI 服务

## 🔗 相关资源

- **官方网站**: [www.steedos.com](https://www.steedos.com/)
- **在线文档**: [docs.steedos.com](https://docs.steedos.com/)
- **GitHub**: [github.com/steedos/steedos-platform](https://github.com/steedos/steedos-platform)
- **示例项目**: [github.com/steedos/steedos-templates](https://github.com/steedos/steedos-templates)
- **社区讨论**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)

## 📝 文档结构

```
docs/
├── README.md                    # 本文档
├── CORE_ARCHITECTURE_CN.md      # 核心架构 (中文)
├── CORE_ARCHITECTURE_EN.md      # 核心架构 (英文)
├── DEVELOPER_GUIDE_CN.md        # 开发者指南 (中文)
├── PACKAGES_INDEX_CN.md         # 包和服务索引 (中文)
├── QUICK_REFERENCE_CN.md        # 快速参考 (中文)
├── objectql.md                  # ObjectQL 文档
├── object-service.md            # 对象服务文档
├── trigger.md                   # 触发器文档
├── env.md                       # 环境变量
├── cn/                          # 中文文档目录
└── images/                      # 图片资源
```

## 🤝 贡献

欢迎为文档做出贡献！如果您发现文档有错误或需要改进的地方：

1. Fork 项目
2. 创建您的特性分支
3. 提交您的修改
4. 推送到分支
5. 创建 Pull Request

## 📮 获取帮助

- **Bug 报告**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
- **功能请求**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
- **技术支持**: 查看官网联系方式

---

**其他文档**: 更多详细文档已迁移至 [www.steedos.cn/docs](https://www.steedos.cn/docs)  
**文档版本**: 3.0.12  
**最后更新**: 2026-01-09