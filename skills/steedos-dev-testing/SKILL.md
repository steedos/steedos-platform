---
name: steedos-dev-testing
description: |
  Steedos project automated development & testing with Playwright MCP.
  TRIGGER: "自动测试", "迭代开发", "dev-test", "test iterate",
  "构建重启", "build restart", "playwright", "browser test",
  "配置测试环境", "setup dev environment", copilot-instructions template.
  SKIP: object/field definitions → steedos-objects; UI pages → steedos-pages.
---

# Steedos Automated Dev & Testing | 自动化开发测试

## Overview | 概述

Standard workflow for AI-assisted iterative development and testing of Steedos projects.

AI 辅助 Steedos 项目迭代开发测试的标准工作流。

**⚠️ Testing MUST use Playwright MCP Server — mandatory for all Steedos projects.**

---

## Quick Start | 快速开始

### Step 1: Install this skill | 安装技能

```bash
npx skills add steedos/steedos-platform --skill steedos-dev-testing
```

### Step 2: Configure project | 配置项目

Tell the AI: "帮我配置自动化测试环境" or "setup dev test environment"

The AI will ask you for:
1. Test URL and port (default: http://127.0.0.1:5100)
2. Login credentials (email + password)
3. Working directory (which package to build)
4. Build command (default: yarn build)
5. Start command (default: yarn start)
6. Startup wait time (default: 20s)
7. Default test page path

Then generate `.github/copilot-instructions.md` in your project.

### Step 3: Use it | 日常使用

Just describe your task:
> "修复导出Excel功能，自己测试到通过为止"

The AI will automatically follow the dev-test loop.

---

## Project Configuration Template | 项目配置模板

When asked to configure a project, generate this in `.github/copilot-instructions.md`:

```markdown
## 开发测试环境 | Dev Test Environment

- **测试地址 / Test URL**: http://127.0.0.1:5100
- **默认页面 / Default Page**: /app/{app_code}
- **账户 / Account**: {email}
- **密码 / Password**: {password}

## 构建与重启 | Build & Restart

- **工作目录 / Working Dir**: ./steedos-packages/{package_name}
- **构建命令 / Build**: yarn build
- **启动命令 / Start**: yarn start
- **重启流程 / Restart**: kill port {PORT} → cd {dir} → build → start
- **启动等待 / Wait**: 20s
- **端口 / Port**: 5100

## 测试方式 | Testing Method

默认使用 Playwright MCP Server 进行浏览器自动化测试。
Default: Playwright MCP Server for browser automation testing.

## 项目说明 | Project Notes

{project-specific notes}
```

---

## Dev-Test Loop | 开发测试循环

```
1. ANALYZE  — Read .github/copilot-instructions.md, understand the task
2. MODIFY   — Make targeted code changes
3. BUILD    — yarn build (fix errors before proceeding)
4. RESTART  — Kill port → start server (async)
5. WAIT     — Wait for server ready (default 20s)
6. TEST     — Playwright MCP: login → navigate → verify
7. RECORD   — Log changes and results
8. ITERATE  — Issues found? → step 2. All pass? → done.
```

### Build | 构建

```bash
cd {working_directory}
yarn build
```

If build fails, fix and retry. NEVER proceed with a failed build.

### Restart | 重启

```bash
lsof -ti:{PORT} | xargs kill -9 2>/dev/null
cd {working_directory}
yarn start   # run async
```

Or: `npx steedos restart` if supported.

### Wait | 等待

Wait configured seconds, then verify:
```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:{PORT}/
```

### Test — Playwright MCP (MANDATORY) | 测试

**⚠️ ALL testing MUST use Playwright MCP Server browser automation.**

#### Login

```
browser_navigate → {test_url}
browser_snapshot → inspect login form
browser_fill    → email field
browser_fill    → password field
browser_click   → login button
browser_snapshot → confirm logged in
```

#### Page Verification

```
browser_navigate → target page
browser_snapshot → inspect DOM, verify elements
browser_click   → test interactions
browser_snapshot → verify results
```

#### CRUD Testing

```
browser_navigate → list page
browser_snapshot → verify data
browser_click   → new/edit
browser_fill    → form fields
browser_click   → save
browser_snapshot → verify record
```

#### Export / Download

```
browser_click   → export button
browser_snapshot → verify success/download
```

#### On Failure

```
browser_snapshot or browser_take_screenshot → analyze state → adjust
```

### Record | 记录

After each iteration:
```
### Iteration {N}
**Changes:** {file} — {what changed}
**Results:** ✅ {passed} / ❌ {failed + reason}
**Next:** {what to fix}
```

---

## Troubleshooting | 常见问题

| Problem | Solution |
|---------|----------|
| Port occupied | `lsof -ti:{PORT} \| xargs kill -9` |
| Build fails | Fix TypeScript/syntax errors |
| Page not loading | Increase wait time, check logs |
| Login fails | Verify credentials in config |
| Element not found | `browser_snapshot` to analyze DOM |

## Best Practices | 最佳实践

1. **One change per iteration** — don\'t batch unrelated changes
2. **Build before restart** — verify build succeeds first
3. **Screenshot on failure** — always capture state
4. **Max 5-10 iterations** — escalate if not converging
5. **Validate metadata** — `npx @steedos/validate` for structural changes

## Related Skills | 相关技能

| Need | Skill |
|------|-------|
| Modify objects | steedos-objects, steedos-object-fields |
| Change logic | steedos-server-logic |
| Modify pages | steedos-pages |
| Update buttons | steedos-object-buttons |
| Fix permissions | steedos-object-permissions |
| Project structure | steedos-project-package |
| CLI commands | steedos-getting-started |
