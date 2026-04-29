---
name: steedos-configuration
description: |
  Configure Steedos Server via environment variables and YAML settings files.
  TRIGGER when: user configures Steedos via environment variables or YAML
  settings; asks about .env files, steedos-config.yml,
  default.steedos.settings.yml; asks about specific env vars (MONGO_URL,
  ROOT_URL, B6_TRANSPORTER, JWT_SECRET, etc.); asks about Docker compose
  setup, production vs development config, env interpolation in YAML.
  SKIP: user asks about Builder6-specific B6_* internals — use
  steedos-builder6-internals; user asks about project structure — use
  steedos-project-package.
  Covers required env vars, steedos-config.yml, YAML settings with env
  interpolation, datasources, tenant settings, CFS file storage, SSO/OIDC,
  email, Docker setup, and security best practices.
---

# Steedos Configuration | Steedos 配置

## Overview | 概述

Configuration is loaded from multiple sources (in priority order):

1. **System environment variables** (highest priority)
2. **`.env.local`** file
3. **`.env`** file
4. **Project config** (`steedos-config.yml` in working directory)
5. **Default settings** (`default.steedos.settings.yml` shipped with server)

YAML values support `${ENV_VAR}` interpolation from environment variables.

## Required Environment Variables | 必需环境变量

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/steedos` |
| `ROOT_URL` | Application root URL | `http://localhost:5100` |
| `B6_TRANSPORTER` / `TRANSPORTER` | Moleculer transporter (Redis) | `redis://localhost:6379` |
| `B6_CACHER` / `CACHER` | Moleculer cacher (Redis) | `redis://localhost:6379/1` |

## All Environment Variables | 环境变量参考

### Core Server | 核心服务

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_PORT` / `PORT` | `5100` | Server listen port |
| `ROOT_URL` | `http://127.0.0.1:{port}` | Application root URL |
| `NODE_ENV` | `development` | Environment |
| `B6_LOG_LEVEL` | `warn` | Log level: trace, debug, info, warn, error, fatal |
| `B6_JWT_SECRET` / `JWT_SECRET` | — | JWT signing secret |
| `B6_SESSION_SECRET` | — | Express session secret |
| `SESSION_PREFIX` | `steedos-session:` | Redis session key prefix |
| `B6_CLUSTER_TRANSPORTER` | — | Redis for NestJS microservice transport |
| `B6_CLUSTER_CACHER` | — | Redis for session store |

### Database | 数据库

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URL` | — | MongoDB connection string |
| `MONGO_OPTIONS_POOLSIZE` | `10` | MongoDB connection pool size |

### Edition & License | 版本与许可

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_EDITION` | auto | Force edition: `ce`, `ee`, `cloud` |
| `STEEDOS_LICENSE` | — | Enterprise license key |
| `STEEDOS_TENANT_ENABLE_SAAS` | `false` | Enable SaaS/Cloud mode |

### File Storage | 文件存储

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_STORAGE_DIR` | `./storage` | Local file storage path |
| `STEEDOS_CFS_STORE` | `local` | Storage backend: `local`, `aws`, `aliyun` |

### Frontend Assets | 前端资源

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_UNPKG_URL` | `/unpkg` | CDN URL for unpkg assets |
| `STEEDOS_AMIS_VERSION` | `6.3.0-patch.8` | Amis widget version |
| `STEEDOS_WIDGETS_VERSION` | `6.10.52` | Steedos widgets version |

### Plugin System | 插件系统

| Variable | Description |
|----------|-------------|
| `B6_PLUGIN_PACKAGES` | NPM packages to load as plugins |
| `B6_PLUGIN_SERVICES` | Service definitions to load |
| `B6_PLUGIN_MODULES` | Module definitions to load |

### Development & Debug | 开发和调试

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBUG` | `false` | Enable debug mode |
| `HOT_RELOAD` | — | Hot reload |
| `STEEDOS_DEVELOPER_MODE` | `false` | Developer mode |

### Localization | 本地化

| Variable | Default | Description |
|----------|---------|-------------|
| `DEFAULT_LOCALE` | — | Default locale (e.g. `zh-CN`) |
| `STEEDOS_LOCALES` | — | Available locales |

---

## YAML Configuration | YAML 配置

### steedos-config.yml (Project Level)

Place in the server working directory:

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

#### cron — 定时任务

```yaml
cron:
  enabled: ${STEEDOS_CRON_ENABLED}
  mailqueue_interval: ${STEEDOS_CRON_MAILQUEUE_INTERVAL}
  push_interval: ${STEEDOS_CRON_PUSH_INTERVAL}
  workflow_rule_interval: ${STEEDOS_CRON_WORKFLOW_RULE}
```

---

## Complete .env Examples | 完整 .env 示例

### Development Environment | 开发环境

```env
PORT=5100
ROOT_URL=http://localhost:5100
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1
STEEDOS_STORAGE_DIR=./steedos-storage
B6_LOG_LEVEL=warn
JWT_SECRET=development_secret_key_change_in_production
DEBUG=true
HOT_RELOAD=true
```

### Production Environment | 生产环境

```env
PORT=80
ROOT_URL=https://app.example.com
NODE_ENV=production
MONGO_URL=mongodb://user:password@mongo.example.com:27017/steedos?authSource=admin
TRANSPORTER=redis://:password@redis.example.com:6379
CACHER=redis://:password@redis.example.com:6379/1
STEEDOS_CFS_STORE=aws
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=my-app-storage
AWS_S3_REGION=us-east-1
B6_LOG_LEVEL=error
JWT_SECRET=production_strong_secret_key_min_32_chars
MAIL_URL=smtp://user:password@smtp.example.com:587
MAIL_FROM=noreply@example.com
HOT_RELOAD=false
```

## Docker Configuration | Docker 配置

```yaml
version: '3'
services:
  steedos:
    image: steedos/steedos-community:latest
    ports:
      - "5100:5100"
    environment:
      - PORT=5100
      - ROOT_URL=http://localhost:5100
      - MONGO_URL=mongodb://mongo:27017/steedos
      - TRANSPORTER=redis://redis:6379
      - CACHER=redis://redis:6379/1
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:6-alpine

volumes:
  mongo_data:
```

## Security Best Practices | 安全最佳实践

1. **Never commit secrets**: Add `.env`, `.env.local` to `.gitignore`
2. **Use strong secrets**: JWT_SECRET should be 32+ random chars
3. **Rotate keys regularly**: Update JWT_SECRET and API keys periodically
4. **Use environment-specific values**: Don't reuse secrets across environments

## Troubleshooting | 故障排除

| Issue | Solution |
|-------|---------|
| Variables not loading | Check file is `.env` (not `env.txt`), in project root, restart server |
| Database connection fails | Verify MongoDB running, check MONGO_URL format |
| Redis connection fails | `redis-cli ping`, check TRANSPORTER/CACHER URLs |
