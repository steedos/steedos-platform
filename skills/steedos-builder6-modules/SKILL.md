---
name: steedos-builder6-modules
description: |
  TRIGGER when: user asks about Builder6 authentication (AuthGuard,
  AdminGuard, token formats, signIn, password hashing, cookie management,
  API keys); asks about Builder6 file upload/download system (local/S3
  storage, /api/v6/files, presigned URLs, collection naming cfs.*); asks
  about Builder6 plugin system (B6_PLUGIN_MODULES, B6_PLUGIN_PACKAGES,
  PluginModule, MoleculerPluginService, plugin lifecycle).
  SKIP: user asks about Steedos object-level permissions — use
  steedos-object-permissions; user asks about Builder6 architecture — use
  steedos-builder6-internals.
  Covers auth guards, file upload/download (local + S3), and dynamic plugin loading.
---

# Builder6 Modules: Auth, Files & Plugins

---

## Authentication | 认证系统

Builder6 uses a multi-format token system: JWT, cookie-based sessions, and API keys. Enforced by NestJS guards from `@builder6/core`.

### Token Formats

#### 1. JWT (Bearer)
```
Authorization: Bearer <jwt>
```
Payload: `{ sub: userId, name, email, space: spaceId, profile }`

#### 2. Cookie-Based Session
Cookies: `X-Space-Id`, `X-Auth-Token`, `X-User-Id`, `X-Access-Token`
Validated against hashed tokens in `users.services.resume.loginTokens`.

#### 3. API Key
```
Authorization: Bearer apikey,<api-key-string>
```
Looked up in `api_keys` collection. Must be `active: true`.

### Guards

| Guard | Usage |
|-------|-------|
| `AuthGuard` | Most endpoints. Extracts token → validates → sets `req['user']` |
| `AdminGuard` | Admin-only. Same + checks `profile === 'admin'` |

### AuthService Methods

- **`signIn(username, password?, space_id?)`**: Find user → SHA256+bcrypt verify → generate JWT + login token → return `{ access_token, auth_token, ...space_user }`
- **`getUserByToken(token)`**: JWT decode / apikey lookup / cookie hash validation
- **`extractTokenFromHeaderOrCookie(request)`**: Priority: Authorization header → cookies
- **`setAuthCookies(res, {...})`**: Sets 4 cookies (`httpOnly: true`, `sameSite: 'strict'`, `maxAge: 2 years`)

### Password Hashing
```
Client password → SHA256 hex digest → bcrypt compare against stored hash
```

### User Context in Controllers
```typescript
const user = req['user'];
// user._id, user.space, user.name, user.email, user.profile
```

### MongoDB Collections
| Collection | Purpose |
|------------|---------|
| `users` | Accounts, credentials, login tokens |
| `space_users` | User-tenant membership |
| `spaces` | Tenant/workspace records |
| `api_keys` | API key registry |

---

## File System | 文件系统

The Files module (`@builder6/files`) provides file upload/download with local filesystem and AWS S3 support.

### Storage Types
| Type | Config | Path |
|------|--------|------|
| `local` | `B6_CFS_STORE=local` | `{B6_STORAGE_DIR}/files/{collection}/{object_name}/{YYYY}/{MM}/{uuid}-{filename}` |
| `S3` | `B6_CFS_STORE=S3` | `{collection}/{object_name}/{YYYY}/{MM}/{uuid}-{filename}` |

### Collection Names
| Collection | Alias | Purpose |
|------------|-------|---------|
| `cfs.files.filerecord` | `files` | General attachments |
| `cfs.avatars.filerecord` | `avatars` | User avatars |
| `cfs.images.filerecord` | `images` | Image files |

### API Endpoints

**Upload**: `POST /api/v6/files/:collectionName` (multipart, AuthGuard)
- Fields: `file` (binary), `object_name`, `record_id`, `parent`

**Download**: `GET /api/v6/files/:collectionName/:fileId[/:fileName]`
- `?redirect=true` (S3 signed URL), `?download=true` (force attachment)
- Public collections (default: `avatars`) allow anonymous download

**Direct Download**: `GET /api/v6/files/download/:collectionName/:fileId/:fileName`

**Presigned URLs**: `POST /api/v6/files/:collectionName/presigned-urls`
- Body: `{ "records": ["fileId1", "fileId2"] }` → `{ "urls": [...] }`

### File Record Schema
```json
{
  "_id": "uuid",
  "original": { "type": "application/pdf", "size": 12345, "name": "invoice.pdf" },
  "metadata": { "owner": "userId", "space": "spaceId", "object_name": "orders", "record_id": "orderId" },
  "copies": { "files": { "name": "...", "key": "orders/2026/04/uuid-invoice.pdf" } }
}
```

### S3 Configuration
```bash
B6_CFS_STORE=S3
B6_CFS_AWS_S3_ENDPOINT=https://s3.amazonaws.com
B6_CFS_AWS_S3_ACCESS_KEY_ID=...
B6_CFS_AWS_S3_SECRET_ACCESS_KEY=...
B6_CFS_AWS_S3_REGION=us-east-1
B6_CFS_AWS_S3_BUCKET=my-bucket
```

---

## Plugin System | 插件系统

Plugins are NPM packages loaded at startup via environment variables.

### Plugin Types

**NestJS Module Plugins** (`B6_PLUGIN_MODULES`):
```bash
B6_PLUGIN_MODULES=@builder6/plugin-custom,@myorg/plugin-erp
```
Each package exports a default NestJS module from `dist/plugin.module.js`.

**Moleculer Service Plugins** (`B6_PLUGIN_PACKAGES`):
```bash
B6_PLUGIN_PACKAGES=@steedos/service-custom@1.0.0,@steedos/service-report
```

### Configuration
| Variable | Description |
|----------|-------------|
| `B6_PLUGIN_MODULES` | NestJS module packages |
| `B6_PLUGIN_PACKAGES` | NPM packages (`@pkg/a@1.0,@pkg/b`) |
| `B6_PLUGIN_NPMRC` | Custom `.npmrc` for private registries |

### Plugin Directory
```
plugins/
├── package.json        # Auto-managed
├── .npmrc              # From B6_PLUGIN_NPMRC
└── node_modules/
```

### Installation Lifecycle
1. Update `.npmrc` from `B6_PLUGIN_NPMRC`
2. Diff dependencies against `plugins/package.json`
3. `npm install --omit=dev --no-audit` (if changed)
4. Load NestJS modules → require `dist/plugin.module.js`
5. Load Moleculer services via `MoleculerPluginService`

### Creating a NestJS Plugin
```typescript
// src/plugin.module.ts
import { Module } from '@nestjs/common';

@Module({
  controllers: [...],
  providers: [...],
})
export default class MyPluginModule {}
```

Build to `dist/plugin.module.js` — this is the required entry point.
