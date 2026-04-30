# Steedos 项目模板

基于 [Steedos 低代码平台](https://www.steedos.com/) 构建的企业级应用项目模板。

通过 `create-steedos-app` 脚手架生成，提供元数据建模、API 扩展和业务逻辑开发的完整基础框架，帮助开发者快速启动企业应用。

## 环境要求

开始前，请确保本地已安装以下依赖：

| 依赖 | 版本要求 |
|------|---------|
| Node.js | v22.0 及以上 |
| MongoDB | v7.0 及以上 |
| Redis | 最新稳定版 |
| Yarn | 最新稳定版 |

## 快速开始

### 第一步：启动数据库服务

确保 MongoDB 和 Redis 服务正常运行，执行以下命令通过 Docker 启动：

```bash
yarn start:db
```

### 第二步：安装依赖

在项目根目录执行以下命令安装所需 Node 依赖包：

```bash
yarn
```

### 第三步：启动开发服务器

启动 Steedos 开发服务器，控制台会输出访问地址：

```bash
yarn start
```

### 第四步：访问应用

服务启动成功后，打开浏览器访问：

```
http://localhost:5100
```

## 项目结构

```text
steedos-project-template/
├── .env                                  # 环境变量配置（勿提交敏感信息）
├── .env.local                            # 本地环境变量覆盖
├── package.json                          # 项目依赖与脚本配置
├── steedos-config.js                     # Steedos 核心配置
├── docker-compose.yml                    # Docker 服务编排配置
└── steedos-packages/
    └── example-app/                      # 示例业务包
        ├── package.json                  # 业务包定义
        └── main/
            └── default/
                ├── objects/              # 对象元数据定义
                └── apps/                 # 应用元数据定义
```

## 环境变量配置

在项目根目录创建或修改 `.env` 文件，配置数据库连接和服务端口：

```shell
# 服务端口
PORT=5100

# MongoDB 连接地址
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# 根地址（附件存储和 API 回调必须正确配置）
ROOT_URL=http://localhost:5100

# 元数据存储目录
STEEDOS_STORAGE_DIR=./storage
```

## 开发指南

### 元数据导出

通过界面（Steedos 设置）修改配置后，可使用 Steedos CLI 或 VS Code 插件将变更同步回本地代码，保持代码与配置一致。

### 开发建议

- 将业务逻辑封装在 `steedos-packages/` 下各自的业务包中
- 使用 `.env.local` 存放本地开发专用配置，避免污染共享配置
- 元数据文件（对象、字段、按钮等）建议纳入版本控制

## 使用 AI 开发 Steedos 项目

借助 AI 编程助手，可大幅提升 Steedos 项目的开发效率。以下是推荐的 AI 开发工作流。

### 准备工作

1. **安装工具**：提前安装 [VS Code](https://code.visualstudio.com/)，以及 Claude Code 插件（选装）。

2. **安装 Steedos Skills**：让 AI 具备 Steedos 领域知识，执行：
   ```bash
   npx skills add steedos/steedos-platform
   ```
   > 安装时，按空格键选中所有 Steedos skills，然后确认安装。

### AI 计划模式（需求分析）

在开始编码前，先让 AI 理解需求并制定实现计划：

1. 新开一个会话窗口，在 Chat 页面将 **Mode** 切换为 **Plan Mode**
2. 在输入框描述需求并发送，例如：
   ```
   帮我设计一个 CRM 系统
   ```
3. 也可以上传 `.txt` 文本或图片类型的需求文档，再发送：
   ```
   基于以上文件中的需求，请分析并提供解决方案
   ```
4. AI 分析完成后会输出实现计划，确认无误后，告知 AI 按计划执行
5. 如对计划不满意，可继续沟通调整，直到满意后再让 AI 开始实现

### AI 开发

计划确认后，让 AI 进入开发模式，自动生成对象、字段、业务逻辑等元数据文件。

### 人工测试确认

1. 启动服务：
   ```bash
   yarn start
   ```
2. 登录系统，验证功能是否符合需求
3. 将测试中发现的问题反馈给 AI，等待其修复
4. **每次 AI 修改完成后，需重启服务使代码生效**

> **异常处理**：若控制台出现报错，直接将错误信息粘贴到 AI Chat 输入框发送，AI 会自动定位并修复问题。

### AI 自动化测试（可选）

对于复杂功能，可让 AI 自主驱动浏览器进行端到端测试：

1. 在 VS Code 扩展市场搜索 `@mcp`，找到 **Playwright** 插件并安装
2. 向 AI 发送测试指令，例如：
   ```
   请测试 CRM 模块的功能。
   访问地址：http://localhost:5100
   账号：admin@example.com  密码：admin123
   ```
3. AI 将自动操作浏览器，完成功能验证直到测试通过

### 初始化演示数据

功能开发完成后，可让 AI 生成演示数据便于展示和测试：

```
请帮我初始化演示数据
```

### 前端项目开发

AI 也支持开发完全自定义的前端项目，包括网页、小程序、移动客户端，后端对接 Steedos API：

- 在 Chat 页面通过上传图片或文字描述告知 UI 需求，例如：
  ```
  还需要这样的页面，请用 React 帮我实现
  ```
- 如果是 Web 端项目，可集成到 Steedos 服务器中运行，发送：
  ```
  React 项目需要通过 Steedos Router 提供 SPA 访问
  ```

## 相关资源

- [Steedos 官方文档](https://docs.steedos.com/)
- [Steedos GitHub 仓库](https://github.com/steedos/steedos-platform)
- [Steedos 社区](https://community.steedos.com/)
