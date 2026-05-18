---
description: "Steedos 迭代开发测试 — 自动修改、构建、重启、Playwright MCP 浏览器测试，循环直到通过"
agent: "steedos-developer"
argument-hint: "描述要修复或开发的功能，如：修复导出Excel功能"
---

请按照以下流程自动迭代开发测试：

1. 读取项目 `.github/copilot-instructions.md` 获取测试环境配置
2. 分析需求，定位相关代码
3. 修改代码 → 构建 → 重启服务 → 等待启动
4. **使用 Playwright MCP Server 进行浏览器自动化测试**（登录 → 导航 → 验证功能）
5. 记录每轮修改内容和测试结果
6. 如果测试不通过，返回步骤 3 继续迭代
7. 测试通过后，输出完整的修改报告

需求：
