---
name: steedos-auth
description: |
  Builder6 Server authentication and authorization system. Covers AuthGuard
  and AdminGuard (NestJS CanActivate), AuthService (signIn, getUserByToken,
  extractTokenFromHeaderOrCookie), triple token format (JWT, spaceId+authToken
  cookies, apikey), password hashing (SHA256+bcrypt), login token stamping,
  cookie management, user lookup (username/email/mobile), space_users tenant
  membership, and request user context (req.user).
---

# Builder6 Authentication | Builder6 认证系统

## Overview | 概述

Builder6 uses a multi-format token system supporting JWT, cookie-based session tokens, and API keys. Authentication is handled by `AuthService` and enforced by NestJS guards (`AuthGuard`, `AdminGuard`) from `@builder6/core`.

## Token Formats | Token 格式

The system accepts three token formats, extracted from `Authorization` header or cookies:

### 1. JWT Token (Bearer)

```
Authorization: Bearer <jwt>
```

JWT payload: `{ sub: userId, name, email, space: spaceId, profile }`

### 2. Cookie-Based Session Token

Cookies set during login:

| Cookie | Description |
|--------|-------------|
| `X-Space-Id` | Tenant ID |
| `X-Auth-Token` | Session auth token |
| `X-User-Id` | User ID |
| `X-Access-Token` | JWT access token |

Internally combined as: `{spaceId},{authToken}` → validated against hashed tokens in `users.services.resume.loginTokens`.

### 3. API Key

```
Authorization: Bearer apikey,<api-key-string>
```

Looked up in `api_keys` collection. Must be `active: true`.

## Guards | 守卫

### AuthGuard

Used on most endpoints. Extracts token, validates via `getUserByToken()`, sets `req['user']`:

```typescript
@UseGuards(AuthGuard)
@Controller('api/v6/tables/')
export class TablesController { ... }
```

The `req['user']` object contains space_users fields: `_id`, `user`, `space`, `name`, `email`, `profile`, etc.

### AdminGuard

Used on admin-only endpoints (Direct MongoDB API). Same as AuthGuard + checks `profile === 'admin'` and primary space membership:

```typescript
@UseGuards(AdminGuard)
@Controller('api/v6/direct')
export class MongodbController { ... }
```

## AuthService Methods | AuthService 方法

### signIn(username, password?, space_id?)

1. Find user by `username`, `emails.address`, or `mobile` (case-insensitive)
2. Hash password: `SHA256(password)` → `bcrypt.compare()` against `users.services.password.bcrypt`
3. Verify `space_users` membership
4. Generate JWT + stamped login token
5. Store hashed token in `users.services.resume.loginTokens`
6. Return `{ access_token, auth_token, ...space_user }`

### getUserByToken(token)

Parses token format:
- Single string → JWT decode → lookup user by `payload.sub`
- `"apikey,<key>"` → lookup `api_keys` collection
- `"spaceId,authToken"` → hash token → find user with matching `services.resume.loginTokens.hashedToken`

### extractTokenFromHeaderOrCookie(request)

Priority:
1. `Authorization: Bearer <token>` header
2. Combine `X-Space-Id` + `X-Auth-Token` cookies

### setAuthCookies(res, { access_token, auth_token, user_id, space_id })

Sets 4 cookies with options: `httpOnly: true`, `sameSite: 'strict'`, `maxAge: 2 years`.

Override cookie SameSite with `STEEDOS_AUTH_COOKIES_USE_SAMESITE=None` (requires `secure: true`).

## Password Hashing | 密码哈希

```
Client password → SHA256 hex digest → bcrypt compare against stored hash
```

Stored in MongoDB: `users.services.password.bcrypt`

## Login Token Lifecycle | 登录 Token 生命周期

```
Login → generate UUID authToken
  → stamp: { token, when: Date }
  → hash: SHA256(token).base64
  → push to users.services.resume.loginTokens
```

Validation reverses the process: hash incoming token → find matching `hashedToken` in user's loginTokens array.

## User Context in Controllers | 控制器中的用户上下文

After `AuthGuard` validates, `req['user']` contains the `space_users` record:

```typescript
async create(@Req() req: Request) {
  const user = req['user'];
  // user._id — user ID
  // user.space — tenant/space ID
  // user.name — display name
  // user.email — email address
  // user.profile — "admin" | "user" | ...
}
```

## MongoDB Collections | MongoDB 集合

| Collection | Purpose |
|------------|---------|
| `users` | User accounts, credentials, login tokens |
| `space_users` | User-tenant membership and profiles |
| `spaces` | Tenant/workspace records |
| `api_keys` | API key registry |

## Login API Example | 登录 API 示例

```bash
# Login with username/password
curl -X POST http://localhost:5100/api/v6/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Response
{
  "access_token": "eyJhbGci...",
  "auth_token": "a1b2c3d4-...",
  "user": "userId",
  "space": "spaceId",
  "name": "Admin",
  "email": "admin@example.com",
  "profile": "admin"
}
```
