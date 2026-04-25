# Steedos 规范文档索引

## 📚 本目录下的文档

### 🔴 快速开始 - 必读
**文件**: `QUICK_REFERENCE.md`
- 5分钟快速掌握各种文件格式
- 命名约定一览表
- 常见错误与正确做法对照
- 验证检查清单

**何时使用**: 
- ✓ 快速查找某种文件的格式
- ✓ 检查是否遗漏必填字段
- ✓ 查看命名约定
- ✓ 快速完整性检查

### 🟠 详细参考 - 深入学习
**文件**: `STEEDOS_SPEC_REFERENCE.md`
- 每种文件类型的完整定义
- 所有字段说明（必填/推荐/可选）
- 真实代码示例
- 权限模型详解
- 关键字段类型表

**何时使用**:
- ✓ 学习某种文件类型的完整规范
- ✓ 查看具体字段的详细说明
- ✓ 参考真实的代码示例
- ✓ 理解字段类型系统

### 🟡 探索总结 - 理解背景
**文件**: `SPEC_VALIDATION_SUMMARY.md`
- 实际平台包结构分析
- 真实文件数量和位置
- 必填字段分析总结
- 关键发现和设计模式
- 后续工作建议

**何时使用**:
- ✓ 了解 Steedos 真实结构
- ✓ 理解为什么有这些规范
- ✓ 查看是否有遗漏的文件类型
- ✓ 理解后续改进方向

---

## 🎯 按任务查找

### "我要创建一个新的对象"
1. 阅读: `QUICK_REFERENCE.md` → "对象文件 (.object.yml)"
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "2.1 对象定义文件"
3. 检查: `QUICK_REFERENCE.md` → "验证检查清单" → "对象"
4. 学习真实例子: `services/service-core-objects/main/default/objects/tasks.object.yml`

### "我要创建一个新的字段"
1. 阅读: `QUICK_REFERENCE.md` → "对象文件" 中的 `fields` 部分
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "2.2 字段定义"
3. ⚠️ 重要: 字段定义内嵌在对象中，不是单独文件！

### "我要创建一个 lookup 字段"
1. 阅读: `QUICK_REFERENCE.md` → "对象文件" → lookup 字段例子
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "2.2 字段定义" → "Lookup 字段特性"
3. 学习真实例子:
   - `services/service-core-objects/main/default/objects/space_users_invite.object.yml`
   - `services/service-core-objects/main/default/objects/notes.object.yml` (动态引用)

### "我要创建一个触发器"
1. 阅读: `QUICK_REFERENCE.md` → "触发器文件 (.trigger.yml)"
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "2.3 触发器定义"
3. 检查: `QUICK_REFERENCE.md` → "验证检查清单" → "触发器"
4. 学习真实例子: `services/service-core-objects/main/default/triggers/objects_set_default_object_properties_trigger.trigger.yml`

### "我要创建一个函数"
1. 阅读: `QUICK_REFERENCE.md` → "函数文件 (.function.yml)"
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "2.4 函数定义"
3. 检查: `QUICK_REFERENCE.md` → "验证检查清单" → "函数"
4. 学习真实例子: `services/service-core-objects/main/default/functions/space_users_invite_token.function.yml`

### "我要创建一个按钮"
1. 阅读: `QUICK_REFERENCE.md` → "按钮文件 (.button.yml)"
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "2.5 按钮定义"
3. 检查: `QUICK_REFERENCE.md` → "验证检查清单" → "按钮"
4. 学习真实例子:
   - 简单: `services/service-core-objects/main/default/objects/datasources/buttons/testConnection.button.yml`
   - 复杂: `services/service-core-objects/main/default/objects/permission_set/buttons/copy.button.yml`

### "我要创建一个服务包"
1. 阅读: `QUICK_REFERENCE.md` → "服务文件 (.service.js)"
2. 参考: `STEEDOS_SPEC_REFERENCE.md` → "3. 包服务文件"
3. 检查: `QUICK_REFERENCE.md` → "验证检查清单" → "服务"
4. 学习真实例子: `services/service-object-mixin/package.service.js`

### "我要检查我的代码是否符合规范"
1. 对象类型: `QUICK_REFERENCE.md` → "验证检查清单" → 对应类型
2. 快速查看: `QUICK_REFERENCE.md` → "常见错误"
3. 详细检查: `STEEDOS_SPEC_REFERENCE.md` → 相关部分

### "我想了解 Steedos 的设计思想"
1. 先读: `SPEC_VALIDATION_SUMMARY.md` → "关键发现"
2. 再读: `STEEDOS_SPEC_REFERENCE.md` → "6. 验证规则检查清单"
3. 查看真实代码: `services/service-core-objects/main/default/`

---

## 📍 真实文件位置

### 对象示例
```
services/service-core-objects/main/default/objects/
├── tasks.object.yml              # 完整对象
├── notes.object.yml              # lookup 动态引用示例
├── space_users_invite.object.yml # 简单对象
└── datasources/
    └── buttons/
        └── testConnection.button.yml  # 简单按钮
```

### 触发器示例
```
services/service-core-objects/main/default/triggers/
└── objects_set_default_object_properties_trigger.trigger.yml
```

### 函数示例
```
services/service-core-objects/main/default/functions/
└── space_users_invite_token.function.yml
```

### 按钮示例
```
services/service-core-objects/main/default/objects/
├── datasources/
│   └── buttons/
│       └── testConnection.button.yml         # 简单按钮
└── permission_set/
    └── buttons/
        └── copy.button.yml                   # 复杂 Amis 按钮
```

### 服务示例
```
services/
├── service-object-mixin/
│   └── package.service.js       # Mixin 服务
├── service-core-objects/
│   └── package.service.js       # 完整服务
└── 其他服务/
    └── package.service.js
```

---

## 🔑 关键术语

- **对象** (Object): 数据模型，类似数据库表，由字段组成
- **字段** (Field): 对象的属性，每个字段有类型和配置
- **Lookup**: 关联字段，可以引用其他对象
- **触发器** (Trigger): 在数据变化时自动执行的代码块
- **函数** (Function): 可以通过 REST API 调用的服务端函数
- **按钮** (Button): UI 界面上的操作按钮，可以调用函数或打开表单
- **权限集** (Permission Set): 定义用户操作权限的集合
- **服务** (Service): Moleculer 微服务，提供 API 和业务逻辑

---

## 🛠️ 工具与验证

目前没有自动验证工具。建议检查方式：

1. **手动检查**: 用 `QUICK_REFERENCE.md` 的检查清单
2. **YAML 验证**: 使用 YAML 验证工具检查语法
3. **JavaScript 验证**: 用 ESLint 检查 script 和 handler 中的 JavaScript
4. **对比参考**: 对比同类型的真实示例文件

---

## 📊 统计数据

从实际平台探索：

| 类型 | 数量 | 备注 |
|------|------|------|
| 对象 | 60+ | service-core-objects 中 |
| 字段 | 200+ | 内嵌在对象中 |
| 触发器 | 2+ | 已探索的示例 |
| 函数 | 2+ | 已探索的示例 |
| 按钮 | 100+ | 跨多个对象 |
| 标签页 | 48+ | 应用导航 |
| 页面 | 30+ | 动态页面 |
| 服务 | 10+ | 核心和插件服务 |

---

## ✅ 文档完成度

- ✅ 对象定义规范 (100%)
- ✅ 字段定义规范 (100%)
- ✅ 触发器定义规范 (95%)
- ✅ 函数定义规范 (95%)
- ✅ 按钮定义规范 (90%)
- ✅ 服务定义规范 (90%)
- ⏳ 权限集规范 (80%) - 基本覆盖
- ⏳ 列表视图规范 (70%) - 基本覆盖
- ❌ 流程规范 - 未探索
- ❌ 报表规范 - 未探索

---

## 🚀 后续改进方向

参考 `SPEC_VALIDATION_SUMMARY.md` 的"建议后续工作"：

1. 创建 steedos-package-validator skill
2. 创建 steedos-package-linter skill
3. 创建 steedos-metadata-simplifier skill
4. 补充更多字段类型示例
5. 添加常见错误和解决方案
6. 提供迁移指南

---

**最后更新**: 2026-04-25
**文档版本**: 1.0
**基于平台**: Steedos Platform v6+
