---
name: steedos-environment-variables
description: |
  Configure Steedos applications using environment variables for server
  settings, databases (MongoDB, PostgreSQL/MySQL), message queues (Redis/NATS),
  file storage, authentication, email, and localization. Covers development vs
  production configurations, Docker setup, and security best practices. Use when
  setting up or troubleshooting Steedos deployments.
---

# Steedos Environment Variables | Steedos 环境变量

## Overview | 概述

Steedos uses environment variables for configuration. Variables can be defined in `.env` files or system environment variables.

Steedos 使用环境变量进行配置。变量可以在 `.env` 文件或系统环境变量中定义。

## Loading Priority | 加载优先级

1. System environment variables (highest priority)
2. `.env.local` file
3. `.env` file
4. Default values (lowest priority)

## Core Variables | 核心变量

### Server Configuration | 服务器配置

```env
# Server port
PORT=5100

# Root URL for the application
ROOT_URL=http://localhost:5100

# Node environment
NODE_ENV=development
```

### Database Configuration | 数据库配置

```env
# MongoDB connection string (for metadata)
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# MongoDB options
MONGO_OPTIONS_POOLSIZE=10

# SQL Database (for business data)
# PostgreSQL
STEEDOS_CFS_STORE=pg
STEEDOS_CFS_STORE_URL=postgres://user:password@localhost:5432/dbname

# MySQL
# STEEDOS_CFS_STORE=mysql
# STEEDOS_CFS_STORE_URL=mysql://user:password@localhost:3306/dbname
```

### Message Queue & Cache | 消息队列和缓存

```env
# Moleculer transporter (for service communication)
TRANSPORTER=redis://127.0.0.1:6379

# Moleculer cacher (for caching)
CACHER=redis://127.0.0.1:6379/1

# Alternative: Use NATS
# TRANSPORTER=nats://127.0.0.1:4222
```

### File Storage | 文件存储

```env
# Local file storage directory
STEEDOS_STORAGE_DIR=./steedos-storage

# Alternative: Use cloud storage
# S3-compatible storage
STEEDOS_CFS_STORE=aws
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
AWS_S3_REGION=us-east-1
```

### Logging | 日志配置

```env
# Log level: ⚠️ MUST be one of: trace, debug, info, warn, error, fatal
B6_LOG_LEVEL=warn

# Moleculer log level
LOGGER=true
LOGLEVEL=info
```

## Authentication & Security | 认证和安全

### JWT Configuration | JWT 配置

```env
# JWT secret key
JWT_SECRET=your_secret_key_here

# Token expiration (in seconds)
JWT_EXPIRES_IN=86400
```

### API Keys | API 密钥

```env
# API key for external integrations
STEEDOS_API_KEY=your_api_key
```

### CORS Configuration | CORS 配置

```env
# Allowed origins for CORS
STEEDOS_CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## Email Configuration | 邮件配置

```env
# SMTP server
MAIL_URL=smtp://user:password@smtp.example.com:587

# Email from address
MAIL_FROM=noreply@example.com

# Alternative: SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key
```

## Plugin Configuration | 插件配置

```env
# Plugins to install on startup
STEEDOS_PLUGIN_PACKAGES=@steedos-plugins/plugin1,@steedos-plugins/plugin2

# Plugin services to start automatically
STEEDOS_PLUGIN_SERVICES=plugin1,plugin2
```

## Localization | 本地化

```env
# Default locale
DEFAULT_LOCALE=zh-CN

# Available locales
STEEDOS_LOCALES=zh-CN,en-US
```

## Development & Debug | 开发和调试

```env
# Enable debug mode
DEBUG=true

# Hot reload
HOT_RELOAD=true

# Developer mode
STEEDOS_DEVELOPER_MODE=true
```

## Production Settings | 生产环境设置

```env
# Node environment
NODE_ENV=production

# Disable hot reload
HOT_RELOAD=false

# Minimize logs
B6_LOG_LEVEL=error
LOGLEVEL=error

# Enable clustering
STEEDOS_CLUSTER=true
```

## Complete .env Example | 完整 .env 示例

### Development Environment | 开发环境

```env
# Server
PORT=5100
ROOT_URL=http://localhost:5100
NODE_ENV=development

# Database
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# Message Queue & Cache
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

# Storage
STEEDOS_STORAGE_DIR=./steedos-storage

# Logging
B6_LOG_LEVEL=warn
LOGLEVEL=info

# Security
JWT_SECRET=development_secret_key_change_in_production

# Email (optional)
# MAIL_URL=smtp://user:password@smtp.gmail.com:587

# Development
DEBUG=true
HOT_RELOAD=true
STEEDOS_DEVELOPER_MODE=true
```

### Production Environment | 生产环境

```env
# Server
PORT=80
ROOT_URL=https://app.example.com
NODE_ENV=production

# Database
MONGO_URL=mongodb://user:password@mongo.example.com:27017/steedos?authSource=admin
MONGO_OPTIONS_POOLSIZE=20

# SQL Database (optional)
STEEDOS_CFS_STORE=pg
STEEDOS_CFS_STORE_URL=postgres://user:password@postgres.example.com:5432/steedos

# Message Queue & Cache
TRANSPORTER=redis://:password@redis.example.com:6379
CACHER=redis://:password@redis.example.com:6379/1

# Cloud Storage
STEEDOS_CFS_STORE=aws
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=my-app-storage
AWS_S3_REGION=us-east-1

# Logging
B6_LOG_LEVEL=error
LOGLEVEL=error

# Security
JWT_SECRET=production_strong_secret_key_min_32_chars
JWT_EXPIRES_IN=86400

# Email
MAIL_URL=smtp://user:password@smtp.example.com:587
MAIL_FROM=noreply@example.com

# Performance
STEEDOS_CLUSTER=true

# Features
STEEDOS_DEVELOPER_MODE=false
HOT_RELOAD=false
```

## Environment-Specific Files | 环境特定文件

### Using Multiple .env Files

```bash
# Development
.env.development

# Production
.env.production

# Local overrides
.env.local
```

### Loading Specific Environment

```bash
# Linux/Mac
NODE_ENV=production npm start

# Windows
set NODE_ENV=production && npm start
```

## Docker Configuration | Docker 配置

### docker-compose.yml Example

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
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

## Security Best Practices | 安全最佳实践

### 1. Never Commit Secrets

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Strong Secrets

```env
# Bad
JWT_SECRET=secret

# Good
JWT_SECRET=8f4e7d3c2a1b9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3
```

### 3. Rotate Keys Regularly

Update JWT_SECRET and API keys periodically.

### 4. Use Environment-Specific Values

Don't use the same secrets across environments.

### 5. Limit Access

Restrict who can access production environment variables.

## Validation & Troubleshooting | 验证和故障排除

### Check Environment Variables

```javascript
// In Node.js code
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL:', process.env.MONGO_URL);
```

### Common Issues

#### Issue: Variables not loading

**Solution**:
1. Check file name is `.env` (not `env.txt`)
2. Ensure file is in project root
3. Restart server after changes
4. Check for typos in variable names

#### Issue: Database connection fails

**Solution**:
1. Verify MongoDB is running
2. Check MONGO_URL format
3. Test connection: `mongo mongodb://127.0.0.1:27017/steedos`
4. Check network/firewall

#### Issue: Redis connection fails

**Solution**:
1. Verify Redis is running: `redis-cli ping`
2. Check TRANSPORTER and CACHER URLs
3. Test connection: `redis-cli -h 127.0.0.1 -p 6379 ping`

## Variable Reference Table | 变量参考表

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | Number | 5100 | Server port |
| `ROOT_URL` | String | - | Application URL |
| `MONGO_URL` | String | - | MongoDB connection |
| `TRANSPORTER` | String | - | Message queue |
| `CACHER` | String | - | Cache store |
| `STEEDOS_STORAGE_DIR` | String | ./storage | File storage path |
| `B6_LOG_LEVEL` | String | warn | Log level |
| `JWT_SECRET` | String | - | JWT secret key |
| `NODE_ENV` | String | development | Environment |

## References | 参考资料

- [Steedos Configuration Guide](https://docs.steedos.com/configuration)
- [Environment Variables](https://docs.steedos.com/deploy/env)
- [Docker Deployment](https://docs.steedos.com/deploy/docker)
