# 推送服务设计文档

## 架构总览

```
notifications.service.js (已有, 不修改)
  │ emit('notifications.add')
  ▼
push.service.js (新增, 监听事件)
  │ 查询 push_devices → 按 provider 分组
  ├── provider: 'getui' → 个推 REST API V2 (推送到 CID)
  └── provider: 'fcm'   → FCM HTTP V1 API (推送到 FCM token)

Capacitor App (客户端)
  ├── Android: @steedos/capacitor-plugin-getui (自定义插件, 获取 CID)
  ├── iOS: @steedos/capacitor-plugin-getui (同一插件, 个推代理 APNs)
  └── [可选] @capacitor-firebase/messaging (FCM, 海外)
```

### 关键约束

1. **个推必须客户端集成 SDK** — 个推 REST API 只接受 CID（Client ID），不接受裸厂商 token
2. **FCM 在国内 Android 不可用** — 无 Google Play Services 的设备无法获取 FCM token
3. **iOS 两条路都通** — 个推代理 APNs / FCM 代理 APNs 均可
4. **现有 Capacitor 个推插件不成熟** — `@vaecebyz/capacitor-getui` v0.1.4 可参考但需重写

### 技术选型说明

| 对比项 | 个推 (GeTui) | 极光推送 (JPush) |
|--------|-------------|-----------------|
| 厂商通道整合 | ✅ 一次接入覆盖华为/小米/OPPO/vivo/魅族/荣耀 | ⚠️ 需单独配置每个厂商 |
| Capacitor 插件 | 社区 v0.1.4，需二次开发 | 仅 Cordova 插件，无原生 Capacitor |
| 免费额度 | 每日 100 万推送 | 免费版限制多 |
| 公司稳定性 | 上市公司（每日互动 300766） | 近年业务收缩 |
| iOS 处理 | SDK 自动代理 APNs，无需单独处理 | 同 |

**结论：选个推。** 个推 ≠ UniPush。UniPush 是 DCloud 基于个推封装给 uni-app 用的品牌名，与 Capacitor 无关。

---

## Phase 1: 服务端推送服务

### 1.1 数据模型 — `push_devices` 对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `owner` | lookup → users | 设备所属用户（系统字段） |
| `device_id` | text, required, unique | 设备标识（个推 CID 或 FCM token） |
| `platform` | select: ios / android | 设备平台 |
| `provider` | select: getui / fcm | 推送通道 |
| `device_name` | text | 设备名称（可选） |
| `is_active` | boolean, default true | 是否活跃 |
| `last_active` | datetime | 最后活跃时间 |

权限：user 只能 CRUD 自己的记录，admin 可管理全部。

### 1.2 核心服务 — `push.service.js`

**事件监听**: `notifications.add`（已由现有 `notifications.service.js` 发射）

**处理流程**:
1. 从 event payload 获取 `to`（用户 ID 列表）和 `message`
2. 查询 `push_devices`: `filters: [['owner', 'in', userIds], ['is_active', '=', true]]`
3. 按 `provider` 字段分组
4. 调用对应 provider 的 `send(devices, message)` 方法
5. 处理失败：单设备失败不影响其他；token 失效标记 `is_active: false`

**暴露 Actions**:
- `push-notifications.register` — 注册/更新设备（客户端调用）
- `push-notifications.unregister` — 注销设备（登出时调用）

### 1.3 个推 Provider — `src/providers/getui.js`

**依赖**: 无第三方 npm 包，使用 Node.js 原生 `fetch`

**环境变量**:
```env
PUSH_GETUI_APP_ID=
PUSH_GETUI_APP_KEY=
PUSH_GETUI_APP_SECRET=       # 用于客户端初始化
PUSH_GETUI_MASTER_SECRET=    # 用于服务端鉴权
```

**API 调用链**:
1. **鉴权**: `POST /v2/{appId}/auth` → 获取 token（有效期 1 小时，内存缓存）
2. **单推**: `POST /v2/{appId}/push/single/cid` — ≤1000 CID/次
3. **批量推**: `POST /v2/{appId}/push/list/cid` — 先创建消息体，再批量推
4. **Token 失效处理**: 响应中 `invalidCids` → 标记设备 `is_active: false`

**推送 payload 结构**:
```json
{
  "request_id": "<uuid>",
  "audience": { "cid": ["cid1", "cid2"] },
  "push_message": {
    "notification": {
      "title": "<message.name>",
      "body": "<message.body>",
      "click_type": "payload",
      "payload": "{\"related_to\":{...},\"space\":\"...\"}"
    }
  }
}
```

### 1.4 FCM Provider — `src/providers/fcm.js`（可选）

**依赖**: `google-auth-library`（OAuth2 鉴权）

**环境变量**:
```env
PUSH_FCM_SERVICE_ACCOUNT_PATH=./certs/firebase-sa.json
```

**API**: `POST https://fcm.googleapis.com/v1/projects/{projectId}/messages:send`

---

## Phase 2: Capacitor 个推插件（App 团队实现）

> 此部分由 App 团队实现，此处定义接口规范和交互协议。

### 2.1 插件信息

- **npm 包名**: `@steedos/capacitor-plugin-getui`
- **可参考**: `@vaecebyz/capacitor-getui`（v0.1.4）

### 2.2 TypeScript 接口定义

```typescript
export interface GetuiPushPlugin {
  /** 初始化 SDK（App 启动时调用一次） */
  initialize(options: GetuiInitOptions): Promise<void>;

  /** 获取当前 CID（初始化完成后可能为空，需等 cidReceived 事件） */
  getClientId(): Promise<{ cid: string | null }>;

  /** 绑定别名（可选） */
  bindAlias(options: { alias: string }): Promise<void>;
  unbindAlias(options: { alias: string }): Promise<void>;

  /** 事件监听 */
  addListener(event: 'cidReceived', cb: (data: { cid: string }) => void): Promise<PluginListenerHandle>;
  addListener(event: 'notificationReceived', cb: (data: PushNotification) => void): Promise<PluginListenerHandle>;
  addListener(event: 'notificationClicked', cb: (data: PushNotification) => void): Promise<PluginListenerHandle>;

  removeAllListeners(): Promise<void>;
}

export interface GetuiInitOptions {
  appId: string;
  appKey: string;
  appSecret: string;
}

export interface PushNotification {
  title?: string;
  body?: string;
  data?: Record<string, string>;
}
```

### 2.3 Android 原生集成要点

- **依赖**: `com.getui:gtsdk:3.x.x` + 各厂商 SDK（华为/小米/OPPO/vivo）
- **初始化**: 在 `Application.onCreate()` 或插件 `initialize()` 中调用
- **CID 获取**: `PushManager.getInstance().getClientid(context)`
- **厂商通道**: 在 `AndroidManifest.xml` 配置各厂商 AppID
- **通知点击**: 自定义 `IntentService` 接收并转发到 JS 层

### 2.4 iOS 原生集成要点

- **依赖**: GTSDK（CocoaPods）
- **权限**: `Signing & Capabilities` 启用 Push Notifications
- **初始化**: `GeTuiSdk.start(withAppId:appKey:appSecret:delegate:)`
- **APNs Token**: 在 `AppDelegate` 中将 APNs token 传给个推 SDK
- **Delegate**: 实现 `GeTuiSdkDelegate` 接收 CID 和消息回调
- **无需单独对接 APNs**: 个推 SDK 自动代理

### 2.5 App 端集成示例

```typescript
import { GetuiPush } from '@steedos/capacitor-plugin-getui';
import { Capacitor } from '@capacitor/core';

// 1. 启动时初始化
await GetuiPush.initialize({
  appId: config.PUSH_GETUI_APP_ID,
  appKey: config.PUSH_GETUI_APP_KEY,
  appSecret: config.PUSH_GETUI_APP_SECRET,
});

// 2. 监听 CID → 上报服务端
GetuiPush.addListener('cidReceived', async ({ cid }) => {
  await api.call('push-notifications.register', {
    device_id: cid,
    platform: Capacitor.getPlatform(),
    provider: 'getui',
  });
});

// 3. 登出时注销
async function onLogout() {
  const { cid } = await GetuiPush.getClientId();
  if (cid) {
    await api.call('push-notifications.unregister', { device_id: cid });
  }
}

// 4. 通知点击 → 跳转到对应记录
GetuiPush.addListener('notificationClicked', (notification) => {
  if (notification.data?.related_to) {
    const { o, ids } = JSON.parse(notification.data.related_to);
    router.navigate(`/app/${o}/view/${ids[0]}`);
  }
});
```

---

## Phase 3: FCM 可选支持（海外用户）

### 3.1 App 端（已有成熟插件）

```bash
npm install @capacitor-firebase/messaging firebase
```

```typescript
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

const { token } = await FirebaseMessaging.getToken();
await api.call('push-notifications.register', {
  device_id: token,
  platform: Capacitor.getPlatform(),
  provider: 'fcm',
});

FirebaseMessaging.addListener('tokenReceived', async ({ token }) => {
  await api.call('push-notifications.register', {
    device_id: token,
    platform: Capacitor.getPlatform(),
    provider: 'fcm',
  });
});
```

### 3.2 服务端

通过环境变量 `PUSH_FCM_SERVICE_ACCOUNT_PATH` 启用 FCM Provider。无此变量则不加载。

---

## Phase 4: 管理与运维（后期）

| 功能 | 说明 |
|------|------|
| 设备管理 | Admin 在"设置"中查看/筛选/禁用设备 |
| 推送日志 | `push_logs` 对象记录推送结果（成功/失败/原因） |
| 用户偏好 | 推送开关、免打扰时段、按类型开关 |

---

## 验证步骤

1. **单元测试**: Mock 个推 API，验证事件监听 → 设备查询 → provider 路由逻辑
2. **集成测试 (个推)**:
   - 个推后台创建测试 App
   - 测试设备注册 CID
   - 手动调用 `push-notifications.register` 注册设备
   - 触发通知 → 验证手机收到推送
3. **集成测试 (FCM)**:
   - 配置 Firebase 项目
   - 用 `@capacitor-firebase/messaging` 获取 token
   - 触发通知 → 验证推送到达
4. **端到端测试**:
   - 审批场景: 提交审批 → 审批人手机收到推送 → 点击跳转到审批记录
   - 用户登出 → 不再收到推送
   - 多设备 → 所有设备都收到

---

## 决策记录

| 决策 | 理由 |
|------|------|
| 个推作为国内主力 | 覆盖全部国内 Android 厂商通道 + iOS，一个 SDK 全平台 |
| 必须自定义 Capacitor 插件 | 个推不支持裸 vendor token 推送，必须客户端 SDK 生成 CID |
| 不修改现有 notifications.service.js | 通过事件解耦，push 服务独立监听，零侵入 |
| FCM 作为可选方案 | 有成熟 Capacitor 插件 (`@capacitor-firebase/messaging`)，适合海外 |
| 不用极光推送 | 无成熟 Capacitor 插件，极光近年维护力度下降 |
| 设备标识用 CID/FCM token，不用 alias | 简单直接，一个用户可有多设备 |
