---
description: "Use when editing Steedos metadata files (.object.yml, .trigger.js, .trigger.yml, .button.yml, .page.yml, .page.amis.json, package.service.js). Reminds about build/restart and Playwright MCP testing."
applyTo: ["**/*.object.yml", "**/*.trigger.js", "**/*.trigger.yml", "**/*.button.yml", "**/*.page.yml", "**/*.page.amis.json", "**/package.service.js", "**/*.function.yml"]
---

## Steedos 开发注意事项

修改元数据文件后：
1. **必须重新构建** (`yarn build`) 并**重启服务**才能生效
2. 重启流程：kill 端口进程 → 构建 → 启动
3. **测试必须使用 Playwright MCP Server** 进行浏览器自动化验证
4. 触发器文件 (.trigger.js/.trigger.yml) 必须放在 `main/default/triggers/` 目录
5. 页面文件 (.page.yml) 必须有对应的 .page.amis.json 文件
