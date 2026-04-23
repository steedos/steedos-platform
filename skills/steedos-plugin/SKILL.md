---
name: steedos-plugin
description: |
  Builder6 dynamic plugin system. Plugins are NPM packages loaded at startup
  via environment variables. Covers PluginModule.forRootAsync() for NestJS
  module plugins (B6_PLUGIN_MODULES), MoleculerPluginService for Moleculer
  service plugins (B6_PLUGIN_PACKAGES), automatic npm install in plugins/
  directory, custom .npmrc for private registries (B6_PLUGIN_NPMRC), plugin
  lifecycle states, and the dist/plugin.module.js entry point convention.
---

# Builder6 Plugin System | Builder6 插件系统

## Overview | 概述

Builder6 supports dynamic plugin loading at startup. Plugins are NPM packages that provide NestJS modules and/or Moleculer services. They are configured via environment variables and automatically installed in the `plugins/` directory.

## Plugin Types | 插件类型

### 1. NestJS Module Plugins (B6_PLUGIN_MODULES)

NestJS modules loaded via `PluginModule.forRootAsync()`:

```bash
B6_PLUGIN_MODULES=@builder6/plugin-custom,@myorg/plugin-erp
```

Each package must export a default NestJS module from `dist/plugin.module.js`:

```typescript
// plugin-custom/src/plugin.module.ts
import { Module } from '@nestjs/common';

@Module({
  controllers: [...],
  providers: [...],
})
export default class CustomPluginModule {}
```

### 2. Moleculer Service Plugins (B6_PLUGIN_PACKAGES)

NPM packages installed and loaded as Moleculer services via `MoleculerPluginService`:

```bash
B6_PLUGIN_PACKAGES=@steedos/service-custom@1.0.0,@steedos/service-report
```

Format: `packageName@version` (version defaults to `latest`).

## Configuration | 配置

| Variable | Description |
|----------|-------------|
| `B6_PLUGIN_MODULES` | Comma-separated NestJS module package names |
| `B6_PLUGIN_PACKAGES` | Comma-separated NPM packages: `@pkg/a@1.0,@pkg/b` |
| `B6_PLUGIN_NPMRC` | Custom `.npmrc` content for private registries |

## Plugin Directory | 插件目录

Plugins are installed in `{cwd}/plugins/`:

```
plugins/
├── package.json        # Auto-managed dependencies
├── .npmrc              # Auto-generated from B6_PLUGIN_NPMRC
└── node_modules/
    ├── @builder6/plugin-custom/
    └── @steedos/service-report/
```

## Installation Lifecycle | 安装生命周期

On startup, `PluginModule.forRootAsync()`:

1. **Update .npmrc** — write `B6_PLUGIN_NPMRC` to `plugins/.npmrc` (or remove if unset)
2. **Compare dependencies** — diff `B6_PLUGIN_PACKAGES` against `plugins/package.json`
3. **Install if changed** — run `npm install --omit=dev --no-audit` in `plugins/`
4. **Load NestJS modules** — resolve `B6_PLUGIN_MODULES` packages → require `dist/plugin.module.js`
5. **Load Moleculer services** — `MoleculerPluginService.loadServices()` on module init

## Plugin States | 插件状态

| State | Description |
|-------|-------------|
| `STOPPED` | Initial state |
| `LOADING` | Reading plugin configs |
| `INSTALLING` | Running npm install |
| `STARTING` | Loading modules/services |
| `RUNNING` | All plugins active |
| `SAFE` | Running in safe mode |
| `CRASHED` | Plugin loading failed |
| `STOPPING` | Shutting down |

## Creating a NestJS Plugin | 创建 NestJS 插件

```
my-plugin/
├── package.json
├── src/
│   └── plugin.module.ts    # Export default Module
└── dist/
    └── plugin.module.js    # Built entry point (required)
```

```typescript
// src/plugin.module.ts
import { Module } from '@nestjs/common';
import { MyController } from './my.controller';
import { MyService } from './my.service';

@Module({
  controllers: [MyController],
  providers: [MyService],
})
export default class MyPluginModule {}
```

## Private Registry | 私有仓库

```bash
B6_PLUGIN_NPMRC="registry=https://npm.mycompany.com/\n//npm.mycompany.com/:_authToken=TOKEN123"
```

This content is written to `plugins/.npmrc` before installation.

## Error Handling | 错误处理

If npm install fails, the plugin system:
1. Reverts `plugins/package.json` to its previous content
2. Throws an error (server may fail to start)
3. On next startup, retries installation
