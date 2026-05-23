# @steedos/service-push-notifications

Steedos 手机推送通知服务。监听 `notifications.add` 事件，自动向目标用户的已注册设备发送推送。

支持 Provider：
- **个推 (GeTui)** — 国内推送，覆盖华为/小米/OPPO/vivo 等厂商通道
- **FCM** — 海外推送（可选）

> 架构设计、技术选型、Phase 规划详见 [DESIGN.md](./DESIGN.md)

---

## 目录结构

```
services/service-push-notifications/
├── README.md                           # 使用说明（本文件）
├── DESIGN.md                           # 架构设计文档
├── package.json
├── package.service.js                  # Moleculer package-loader 入口
├── main/default/
│   ├── objects/
│   │   └── push_devices/
│   │       ├── push_devices.object.yml
│   │       └── permissions/
│   │           ├── user.permission.yml
│   │           └── admin.permission.yml
│   └── services/
│       └── push.service.js             # 推送业务逻辑
└── src/
    └── providers/
        ├── index.js                    # Provider registry
        ├── getui.js                    # 个推 REST API V2
        └── fcm.js                      # FCM HTTP V1 API (可选)
```

---

## 安装

在 Steedos 项目的 `package.json` 中添加依赖：

```json
{
  "dependencies": {
    "@steedos/service-push-notifications": "3.0.14-beta.20"
  }
}
```

或将目录作为本地包引入 workspace。

---

## 配置

在 `.env` 中添加推送配置（至少配置一个 Provider）：

```env
# ===== 个推（国内推送） =====
PUSH_GETUI_APP_ID=your_app_id
PUSH_GETUI_APP_KEY=your_app_key
PUSH_GETUI_APP_SECRET=your_app_secret
PUSH_GETUI_MASTER_SECRET=your_master_secret

# ===== FCM（海外推送，可选） =====
PUSH_FCM_SERVICE_ACCOUNT_PATH=./certs/firebase-sa.json
```

> 如果两组变量都不配，服务启动时会打印 warning 但不会报错。

---

## 启动

服务通过 `package.service.js` 自动注册为 Moleculer 服务，Steedos 启动时自动加载。

启动日志：
```
[push-notifications] Push notification providers registered: getui, fcm
```

---

## API

### 注册设备

App 获取到推送 token（FCM token 或个推 CID）后调用：

```http
POST /service/api/push-notifications/register
Content-Type: application/json
Cookie: <session cookie>

{
  "device_id": "fcm_token_or_getui_cid",
  "platform": "ios",
  "provider": "fcm",
  "device_name": "iPhone 15 Pro"
}
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `device_id` | string | ✅ | 设备标识（FCM token 或个推 CID） |
| `platform` | enum | ✅ | `ios` 或 `android` |
| `provider` | enum | ✅ | `fcm` 或 `getui` |
| `device_name` | string | ❌ | 设备名称 |

**响应**：
```json
{ "_id": "record_id", "device_id": "..." }
```

同一 `device_id` 重复注册会更新已有记录（upsert），owner 会更新为当前登录用户。

### 注销设备

用户登出时调用：

```http
POST /service/api/push-notifications/unregister
Content-Type: application/json
Cookie: <session cookie>

{
  "device_id": "fcm_token_or_getui_cid"
}
```

**响应**：
```json
{ "success": true }
```

### 触发推送

推送由 `notifications.add` 事件自动触发，无需额外调用。任何发射该事件的逻辑都会自动推送：

```javascript
await broker.call('notifications.add', {
  message: {
    name: '新任务分配',
    body: '张三给您分配了一个新任务',
    related_to: { o: 'tasks', ids: ['task_id_123'] },
    space: 'space_id'
  },
  from: 'user_id_sender',
  to: ['user_id_receiver_1', 'user_id_receiver_2']
});
```

---

## 测试

### cURL 手动测试

```bash
# 1. 注册设备
curl -X POST http://localhost:5100/service/api/push-notifications/register \
  -H "Content-Type: application/json" \
  -H "Cookie: X-Auth-Token=<token>; X-User-Id=<user_id>" \
  -d '{
    "device_id": "test_device_token_123",
    "platform": "android",
    "provider": "fcm"
  }'
# → { "_id": "xxx", "device_id": "test_device_token_123" }

# 2. 查询已注册设备
curl http://localhost:5100/api/v1/push_devices \
  -H "Cookie: X-Auth-Token=<token>; X-User-Id=<user_id>"

# 3. 触发推送
curl -X POST http://localhost:5100/service/api/notifications/add \
  -H "Content-Type: application/json" \
  -H "Cookie: X-Auth-Token=<token>; X-User-Id=<user_id>" \
  -d '{
    "message": {
      "name": "测试推送",
      "body": "这是一条测试消息",
      "related_to": { "o": "tasks", "ids": ["test_id"] },
      "space": "<space_id>"
    },
    "from": "<sender_id>",
    "to": ["<receiver_id>"]
  }'

# 4. 注销设备
curl -X POST http://localhost:5100/service/api/push-notifications/unregister \
  -H "Content-Type: application/json" \
  -H "Cookie: X-Auth-Token=<token>; X-User-Id=<user_id>" \
  -d '{ "device_id": "test_device_token_123" }'
# → { "success": true }
```

### Moleculer REPL 测试

```bash
# 注册设备
mol $ call push-notifications.register --device_id "test_cid_456" --platform "android" --provider "getui" --#user.userId "user123" --#user.spaceId "space123"

# 注销设备
mol $ call push-notifications.unregister --device_id "test_cid_456"

# 手动触发推送事件
mol $ emit notifications.add --from "admin_id" --to '["target_user_id"]' --message.name "测试" --message.body "Hello" --message.space "space_id"
```

### Mobile App 端对端测试

1. 配置 FCM：下载 `google-services.json`（Android）/ `GoogleService-Info.plist`（iOS）放入 App 项目
2. 启动 App，检查控制台输出 `[MobileBridge] Push token: xxx`
3. 在数据库确认 `push_devices` 有对应记录
4. 通过 Steedos 界面触发通知（审批流、任务分配等）
5. 验证手机收到推送，点击跳转到对应记录

### 调试

```bash
# 查看 MongoDB 中设备记录
mongo steedos --eval "db.push_devices.find().pretty()"

# 检查个推 CID 是否有效
curl https://restapi.getui.com/v2/<APP_ID>/user/detail/<CID> \
  -H "token: <AUTH_TOKEN>"
```

---

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 启动日志 "No push notification providers configured" | 未配置环境变量 | 检查 `.env` 中 `PUSH_GETUI_*` 或 `PUSH_FCM_*` |
| 注册返回 401 Unauthorized | 未登录或 cookie 失效 | 确保请求携带有效 session |
| 推送不到达 | device_id 无效或设备离线 | 检查 `push_devices` 表 `is_active` 状态 |
| FCM provider 初始化失败 | 缺少依赖 | `npm install google-auth-library` |
| 个推鉴权失败 | MASTER_SECRET 错误 | 在个推控制台确认凭证 |

## 范围边界

**本服务包含**:
- 服务端推送服务（provider 模式）
- `push_devices` 数据模型
- 个推 + FCM 两个 provider 实现
- Capacitor 插件接口规范定义
- App 端集成流程定义

**不包含**:
- Capacitor 个推插件 Android/iOS 原生代码（App 团队负责）
- Web 端浏览器推送（Web Push / Service Worker）
- 推送统计面板
- 推送模板管理
- 消息中心 UI 改造
