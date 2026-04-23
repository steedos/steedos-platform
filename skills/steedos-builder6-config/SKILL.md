---
name: steedos-builder6-config
description: |
  Builder6 Server configuration system. Environment variables are parsed
  from .env via dotenv-flow, with B6_ and STEEDOS_ prefixes auto-mapped
  to nested config objects. Covers required vars (B6_MONGO_URL,
  B6_TRANSPORTER, B6_CACHER), server port, JWT/session secrets, file
  storage (local/S3), Moleculer broker settings, logging, and Steedos
  compatibility aliases (MONGO_URL, ROOT_URL, PORT).
---

# Builder6 Server Configuration | Builder6 服务端配置

## Overview | 概述

Configuration is loaded from environment variables via `dotenv-flow`. Variables with `B6_` and `STEEDOS_` prefixes are automatically parsed into nested config objects accessible via NestJS `ConfigService`.

## Environment Variable Parsing | 环境变量解析

The `getEnvConfigs()` function in `@builder6/core` parses `B6_*` and `STEEDOS_*` env vars:

- Underscores become nested keys: `B6_MONGO_URL` → `configService.get('mongo.url')`
- `"true"/"false"` → boolean
- Numeric strings → numbers
- Both `B6_` and `STEEDOS_` prefixes are merged (B6 takes precedence)

## Required Environment Variables | 必需环境变量

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_MONGO_URL` | `mongodb://127.0.0.1/steedos` | MongoDB connection |
| `B6_TRANSPORTER` | `redis://127.0.0.1:6379` | Moleculer Redis transporter |
| `B6_CACHER` | `redis://127.0.0.1:6379/1` | Moleculer Redis cacher |
| `B6_ROOT_URL` | `http://127.0.0.1:5100` | Application root URL |

## Steedos Compatibility Aliases | Steedos 兼容别名

Legacy Steedos env vars are auto-mapped:

| Legacy Variable | Maps To |
|----------------|---------|
| `MONGO_URL` | `B6_MONGO_URL` |
| `ROOT_URL` | `B6_ROOT_URL` |
| `PORT` | `B6_PORT` |
| `TRANSPORTER` | `B6_TRANSPORTER` |
| `STEEDOS_CACHER` / `CACHER` | `B6_CACHER` |
| `JWT_SECRET` | `B6_JWT_SECRET` |
| `STEEDOS_UNPKG_URL` | `B6_UNPKG_URL` |
| `STEEDOS_STORAGE_DIR` | `B6_STORAGE_DIR` |
| `STEEDOS_LOG_LEVEL` | `B6_LOG_LEVEL` |

## All Environment Variables | 全部环境变量

### Server Core | 核心服务

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_PORT` | `5100` | Server listen port |
| `B6_ROOT_URL` | `http://127.0.0.1:5100` | Application root URL |
| `B6_HOME` | `process.cwd()` | Project working directory |
| `B6_HOST` | same as `B6_ROOT_URL` | Host URL |
| `B6_LOG_LEVEL` | `warn` | Log level (error/warn/info/debug) |

### Database & Cache | 数据库与缓存

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_MONGO_URL` | `mongodb://127.0.0.1/steedos` | MongoDB connection string |
| `B6_TRANSPORTER` | `redis://127.0.0.1:6379` | Moleculer transporter URL |
| `B6_CACHER` | `redis://127.0.0.1:6379/1` | Moleculer cacher URL |
| `B6_CLUSTER_TRANSPORTER` | same as `B6_TRANSPORTER` | NestJS microservice transport |
| `B6_CLUSTER_CACHER` | same as `B6_TRANSPORTER` | Redis session store URL |
| `B6_NAMESPACE` | `steedos` | Moleculer namespace |

### Authentication | 认证

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_JWT_SECRET` | `steedos` | JWT signing secret |
| `B6_SESSION_SECRET` | `steedos-session-secret` | Express session secret |
| `B6_SESSION_PREFIX` | `steedos-session:` | Redis session key prefix |

### File Storage | 文件存储

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_STORAGE_DIR` | `./steedos-storage` | Local file storage directory |
| `B6_CFS_STORE` | `local` | Storage type: `local` or `S3` |
| `B6_CFS_AWS_S3_ENDPOINT` | — | S3 endpoint URL |
| `B6_CFS_AWS_S3_ACCESS_KEY_ID` | — | S3 access key |
| `B6_CFS_AWS_S3_SECRET_ACCESS_KEY` | — | S3 secret key |
| `B6_CFS_AWS_S3_REGION` | — | S3 region |
| `B6_CFS_AWS_S3_BUCKET` | — | S3 bucket name |
| `B6_CFS_AWS_S3_FORCE_PATH_STYLE` | — | Force path-style URLs |
| `B6_CFS_DOWNLOAD_PUBLIC` | `["avatars"]` | Collections downloadable without auth |

### Tenant | 租户

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_TENANT_NAME` | `Steedos` | Tenant display name |
| `B6_TENANT_LOGO_URL` | `{ROOT_URL}/images/logo.png` | Tenant logo URL |
| `STEEDOS_TENANT_ID` | — | Fixed tenant ID |

### Plugin System | 插件系统

| Variable | Description |
|----------|-------------|
| `B6_PLUGIN_PACKAGES` | Comma-separated NPM packages: `@pkg/a@1.0,@pkg/b` |
| `B6_PLUGIN_MODULES` | Comma-separated NestJS module packages to load |
| `B6_PLUGIN_NPMRC` | Custom `.npmrc` content for plugin registry |

### Frontend Assets | 前端资源

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_UNPKG_URL` | `https://unpkg.com` | CDN URL for unpkg assets |

## ConfigService Access Pattern | ConfigService 访问模式

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  example() {
    const mongoUrl = this.configService.get('mongo.url');
    const port = this.configService.get('port');
    const s3Bucket = this.configService.get('cfs.aws.s3.bucket');
  }
}
```

## Example .env File | .env 示例

```bash
B6_PORT=5100
B6_ROOT_URL=http://localhost:5100
B6_MONGO_URL=mongodb://127.0.0.1:27017/steedos
B6_TRANSPORTER=redis://127.0.0.1:6379
B6_CACHER=redis://127.0.0.1:6379/1
B6_JWT_SECRET=your-jwt-secret
B6_SESSION_SECRET=your-session-secret
```
