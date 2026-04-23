---
name: steedos-server-config
description: |
  Configure Steedos Server via environment variables and YAML settings files.
  Covers required env vars (MONGO_URL, ROOT_URL, B6_TRANSPORTER, B6_CACHER),
  steedos-config.yml project settings, default.steedos.settings.yml template
  with env interpolation, datasources, tenant settings, CFS file storage
  (local, aliyun, aws, steedosCloud), SSO/OIDC, email, SMS, push
  notifications, and frontend asset URLs.
---

# Steedos Server Configuration | Steedos 服务端配置

## Overview | 概述

Configuration is loaded from three sources (in priority order):

1. **Environment variables** (`.env` file or system env)
2. **Project config** (`steedos-config.yml` in working directory)
3. **Default settings** (`default.steedos.settings.yml` shipped with server)

YAML values support `${ENV_VAR}` interpolation from environment variables.

## Required Environment Variables | 必需环境变量

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/steedos` |
| `ROOT_URL` | Application root URL | `http://localhost:5100` |
| `B6_TRANSPORTER` | Moleculer transporter (Redis) | `redis://localhost:6379` |
| `B6_CACHER` | Moleculer cacher (Redis) | `redis://localhost:6379/1` |
| `B6_CLUSTER_TRANSPORTER` | Redis for NestJS microservice transport | `redis://localhost:6379` |
| `B6_CLUSTER_CACHER` | Redis for session store | `redis://localhost:6379/2` |
| `B6_SESSION_SECRET` | Express session secret | `your-secret-key` |

## Server Environment Variables | 服务端环境变量

### Core Server | 核心服务

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_PORT` / `PORT` | `5100` | Server listen port |
| `ROOT_URL` | `http://127.0.0.1:{port}` | Application root URL |
| `B6_LOG_LEVEL` | `warn` | Moleculer log level |
| `B6_LOG_MONGO_ENABLED` | auto | MongoDB logging (true if license exists) |
| `B6_JWT_SECRET` | — | JWT signing secret |
| `SESSION_PREFIX` | `steedos-session:` | Redis session key prefix |

### Edition & License | 版本与许可

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_EDITION` | auto | **⚠️ MUST be one of: `ce`, `ee`, `cloud`.** Force edition |
| `STEEDOS_LICENSE` | — | Enterprise license key |
| `STEEDOS_TENANT_ENABLE_SAAS` | `false` | Enable SaaS/Cloud mode |

### Frontend Assets | 前端资源

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_UNPKG_URL` | `/unpkg` | CDN URL for unpkg assets |
| `STEEDOS_AMIS_VERSION` | `6.3.0-patch.8` | Amis widget version |
| `STEEDOS_WIDGETS_VERSION` | `6.10.52` | Steedos widgets version |
| `STEEDOS_BUILDER_URL` | `https://6-3.builder.steedos.com` | Page builder URL |
| `STEEDOS_PUBLIC_PAGE_ASSETURLS` | auto-generated | Comma-separated asset JSON URLs |
| `STEEDOS_PUBLIC_SCRIPT_PLUGINS` | — | Comma-separated JS plugin URLs |
| `STEEDOS_PUBLIC_STYLE_PLUGINS` | — | Comma-separated CSS plugin URLs |

### Cloud Proxy | 云端代理

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_CLOUD_URL` | `https://hub.steedos.cn` | Cloud hub URL (enables `/api/cloud` proxy) |

### Plugin System | 插件系统

| Variable | Description |
|----------|-------------|
| `B6_PLUGIN_PACKAGES` | NPM packages to load as plugins |
| `B6_PLUGIN_SERVICES` | Service definitions to load |
| `B6_PLUGIN_MODULES` | Module definitions to load |
| `B6_PLUGIN_INSTALL_NPMRC` | Custom npm registry config for plugin install |

## YAML Configuration | YAML 配置

### steedos-config.yml (Project Level)

Place in the server working directory to override defaults:

```yaml
datasources:
  default:
    connection:
      url: ${MONGO_URL}
    objectFiles:
      - "./steedos-app/**"

tenant:
  _id: ${STEEDOS_TENANT_ID}
  name: My Company
  enable_register: true
  enable_password_login: true
```

### Configuration Sections | 配置节

#### datasources — 数据源

```yaml
datasources:
  default:
    connection:
      url: ${MONGO_URL}
    objectFiles:
      - "./steedos-app/**"
```

#### tenant — 租户设置

```yaml
tenant:
  _id: ${STEEDOS_TENANT_ID}
  name: My Company
  logo_url: ${STEEDOS_TENANT_LOGO_URL}
  enable_register: true
  enable_password_login: true
  enable_mobile_code_login: false
  enable_email_code_login: false
  enable_bind_email: false
  enable_bind_mobile: false
  tokenSecret: ${STEEDOS_TENANT_TOKEN_SECRET}
  accessTokenExpiresIn: 90d
  refreshTokenExpiresIn: 7d
```

#### cfs — Cloud File Storage | 云文件存储

```yaml
cfs:
  store: local    # ⚠️ MUST be one of: local | aliyun | aws | steedosCloud

  local:
    folder: ${STEEDOS_STORAGE_DIR}

  aliyun:
    region: ${STEEDOS_CFS_ALIYUN_REGION}
    bucket: ${STEEDOS_CFS_ALIYUN_BUCKET}
    accessKeyId: ${STEEDOS_CFS_ALIYUN_ACCESSKEYID}
    secretAccessKey: ${STEEDOS_CFS_ALIYUN_SECRETACCESSKEY}

  aws:
    region: ${STEEDOS_CFS_AWS_S3_REGION}
    endpoint: ${STEEDOS_CFS_AWS_S3_ENDPOINT}
    bucket: ${STEEDOS_CFS_AWS_S3_BUCKET}
    accessKeyId: ${STEEDOS_CFS_AWS_S3_ACCESS_KEY_ID}
    secretAccessKey: ${STEEDOS_CFS_AWS_S3_SECRET_ACCESS_KEY}
```

#### email — 邮件配置

```yaml
email:
  from: ${STEEDOS_EMAIL_FROM}
  host: ${STEEDOS_EMAIL_HOST}
  port: ${STEEDOS_EMAIL_PORT}
  username: ${STEEDOS_EMAIL_USERNAME}
  password: ${STEEDOS_EMAIL_PASSWORD}
```

#### sso.oidc — SSO/OIDC 单点登录

```yaml
sso:
  oidc:
    config_url: ${STEEDOS_IDENTITY_OIDC_CONFIG_URL}
    client_id: ${STEEDOS_IDENTITY_OIDC_CLIENT_ID}
    client_secret: ${STEEDOS_IDENTITY_OIDC_CLIENT_SECRET}
    name: ${STEEDOS_IDENTITY_OIDC_NAME}
    label: ${STEEDOS_IDENTITY_OIDC_LABEL}
```

#### public — 公共设置 (exposed to frontend)

```yaml
public:
  NODE_ENV: ${NODE_ENV}
  cfs:
    store: ${STEEDOS_CFS_STORE}
  amis:
    map_ak: ${STEEDOS_AMIS_MAP_KEY}
    map_vendor: ${STEEDOS_AMIS_MAP_VENDER}
  analytics:
    enabled: ${STEEDOS_PUBLIC_ANALYTICS_ENABLED}
    posthog:
      id: ${STEEDOS_PUBLIC_ANALYTICS_POSTHOG_ID}
      api_host: ${STEEDOS_PUBLIC_ANALYTICS_POSTHOG_API_HOST}
```

#### cron — 定时任务

```yaml
cron:
  enabled: ${STEEDOS_CRON_ENABLED}
  mailqueue_interval: ${STEEDOS_CRON_MAILQUEUE_INTERVAL}
  push_interval: ${STEEDOS_CRON_PUSH_INTERVAL}
  workflow_rule_interval: ${STEEDOS_CRON_WORKFLOW_RULE}
```

## Environment Variable Interpolation | 环境变量插值

YAML values use `${VAR_NAME}` syntax. The config loader replaces these with `process.env` values at load time. Keys starting with `enable_` are automatically converted to booleans.

```yaml
# This:
connection:
  url: ${MONGO_URL}

# Becomes (if MONGO_URL=mongodb://localhost:27017/steedos):
connection:
  url: mongodb://localhost:27017/steedos
```
