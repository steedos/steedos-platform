---
name: steedos-cli-commands
description: |
  Steedos CLI commands reference. Covers project lifecycle commands (start,
  restart), data import/export, source management, package operations, and
  authentication. Use this skill when running, restarting, or managing Steedos
  projects from the command line, especially for AI-assisted development
  workflows that need automatic restart after code changes.
---

# Steedos CLI Commands | Steedos 命令行工具

## Overview | 概述

The Steedos CLI (`steedos`) is an oclif-based command-line tool for managing Steedos projects. It provides commands for starting/restarting servers, managing source code, importing/exporting data, and package operations.

Steedos CLI (`steedos`) 是基于 oclif 的命令行工具，用于管理 Steedos 项目。提供服务器启动/重启、源代码管理、数据导入导出和软件包操作等命令。

## Commands Reference | 命令参考

### steedos start

Start the Steedos server. Writes a PID file (`.steedos.pid`) to the current working directory for process management.

启动 Steedos 服务器。在当前工作目录写入 PID 文件 (`.steedos.pid`) 用于进程管理。

```bash
steedos start
```

**Behavior:**
- Resolves and loads `@steedos/server` module
- Writes current process PID to `.steedos.pid`
- Registers signal handlers (SIGINT, SIGTERM) to clean up PID file on exit
- Calls `server.bootstrap()` to start the server

### steedos restart

Stop the running Steedos instance and start a new one. Designed for **local development** scenarios, especially useful for AI-assisted development workflows.

停止运行中的 Steedos 实例并启动新实例。专为**本地开发**场景设计，特别适用于 AI 辅助开发工作流。

```bash
steedos restart
```

**Behavior:**
1. Reads `.steedos.pid` file to find the running process
2. Sends `SIGTERM` to gracefully stop the process
3. Waits up to 30 seconds for the process to exit
4. If timeout, sends `SIGKILL` to force kill
5. Starts a new server instance (same as `steedos start`)

**AI-Assisted Development Workflow | AI 辅助开发工作流:**

After AI modifies code (e.g., triggers, functions, objects), use `steedos restart` to apply changes:

AI 修改代码后（如触发器、函数、对象），使用 `steedos restart` 应用更改：

```bash
# AI workflow: modify code → restart → verify
steedos restart
```

**Important Notes | 重要说明:**
- **Local development only** — 仅用于本地开发环境
- **Not for Docker/cluster deployments** — 不适用于 Docker/集群部署（Docker 使用 supervisord 管理进程，集群使用编排器管理）
- PID file is local to the filesystem — PID 文件是本地文件，无法跨容器操作
- The new server runs in the **foreground** (blocks the terminal) — 新服务在**前台**运行（占用终端）

### steedos package:start

Run Steedos packages as Moleculer microservices. Supports clustering and hot reload.

以 Moleculer 微服务方式运行 Steedos 软件包。支持集群和热更新。

```bash
steedos package:start [--instances <count|max>] [--hot]
```

**Flags:**
- `--instances`: Number of worker processes (number or `max` for CPU count)
- `--hot`: Enable hot reload for development

### steedos source:deploy

Deploy local source metadata to the metadata server.

将本地源代码元数据部署到 metadata server。

```bash
steedos source:deploy -p <path>
```

### steedos source:retrieve

Retrieve source metadata from the metadata server to local.

从 metadata server 获取源代码元数据到本地。

```bash
steedos source:retrieve -p <path>
```

### steedos source:config

Configure the metadata server connection (interactive).

配置 metadata server 连接（交互式）。

```bash
steedos source:config
```

### steedos source:convert

Convert legacy format files to the modern source format.

将旧格式文件转换为现代源代码格式。

```bash
steedos source:convert -p <path>
```

### steedos source:merge

Merge split object-related files (`.field.yml`, `.listview.yml`, etc.) into a single `.object.yml` file.

合并拆分的对象相关文件为单个 `.object.yml` 文件。

```bash
steedos source:merge -p <path>
```

### steedos data:export

Export object data to JSON files.

导出对象数据为 JSON 文件。

```bash
steedos data:export -o <objectName> [-i <ids>] [-f <fields>]
```

### steedos data:import

Import data from JSON files or plan files.

从 JSON 文件或 plan 文件导入数据。

```bash
steedos data:import -p <path>
```

### steedos auth:login

Authenticate with the metadata server.

登录 metadata server。

```bash
steedos auth:login -u <username> -p <password>
```

### steedos i18n

Sync internationalization resources.

同步国际化资源文件。

```bash
steedos i18n
```

### steedos package:build

Build/compress a Steedos package.

构建/压缩 Steedos 软件包。

```bash
steedos package:build
```

## PID File Management | PID 文件管理

The `start` and `restart` commands use a `.steedos.pid` file for process tracking:

`start` 和 `restart` 命令使用 `.steedos.pid` 文件进行进程跟踪：

- **Location**: `{project_root}/.steedos.pid`
- **Content**: Process ID (PID) as plain text
- **Created**: On `steedos start` or `steedos restart`
- **Removed**: On process exit (SIGINT, SIGTERM, or normal exit)
- **Scope**: Local to the filesystem (single machine, single instance)

Add `.steedos.pid` to `.gitignore`:

```gitignore
.steedos.pid
```

## Deployment Contexts | 部署场景

| Context | Restart Method | Notes |
|---------|---------------|-------|
| Local development | `steedos restart` | Uses PID file, foreground process |
| Docker single container | supervisord `autorestart` | `steedos start` managed by supervisord |
| Docker Swarm / K8s cluster | Orchestrator rolling update | `docker service update` or `kubectl rollout` |
| Moleculer microservice | `steedos package:start --hot` | Hot reload for development |

## Best Practices | 最佳实践

### For AI-Assisted Development | AI 辅助开发

1. Use `steedos start` in an **async terminal** to run the server in background
2. After code modifications, run `steedos restart` to apply changes
3. Wait for the server to fully start before testing changes
4. The restart command handles graceful shutdown automatically

AI 辅助开发工作流：
1. 在**异步终端**中用 `steedos start` 启动服务
2. 修改代码后，运行 `steedos restart` 应用更改
3. 等待服务完全启动后再测试
4. restart 命令会自动处理优雅关闭
