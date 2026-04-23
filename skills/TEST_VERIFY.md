---
name: test-verify
description: Verification checklist for skills testing
metadata:
  internal: true
---

# Skills 验证清单

用 TEST_PROMPT.md 的提示词测试后，对照以下要点检查输出是否正确。

## 对象
- [ ] 每个对象有 name 字段或 is_name: true 的字段
- [ ] 对象 icon 使用 SLDS 图标集值
- [ ] 所有 label 用中文（跟随提示词语言）
- [ ] 无 label_zh 属性出现
- [ ] 无多余/不存在的属性

## 字段
- [ ] type 值在有效列表内（text/textarea/select/lookup/master_detail/number/currency/percent/date/datetime/boolean/autonumber/formula/summary 等）
- [ ] select 字段有 options 配置
- [ ] lookup 字段有 reference_to
- [ ] summary 字段的 summary_type 在 count/sum/avg/min/max 内
- [ ] formula 字段的 formula_blank_value 在 zeroes/blanks 内
- [ ] 无 label_zh 属性

## 列表视图
- [ ] filters 条件正确
- [ ] sort 中 order 值为 asc/desc
- [ ] columns 列配置
- [ ] filter_scope 值为 space 或 mine
- [ ] crud_mode 值为 table 或 cards
- [ ] scrolling_mode 值为 standard/virtual/infinite（如使用）
- [ ] shared_to 值为 mine/space/organizations（如使用）
- [ ] 无 label_zh

## 按钮
- [ ] type 为 amis_button
- [ ] on 值为 record_only/record/list/list_record
- [ ] amis_schema 定义交互（dialog、ajax）
- [ ] label 用中文
- [ ] 无 label_zh

## 触发器
- [ ] 文件在 triggers/ 文件夹（不在 objects/ 内）
- [ ] handler 使用内联 JavaScript
- [ ] when 值在有效列表内（beforeInsert/afterInsert/beforeUpdate/afterUpdate/beforeDelete/afterDelete/beforeFind/afterFind/afterFindOne/afterCount/beforeAggregate/afterAggregate）
- [ ] ctx.params.doc / ctx.params.previousDoc 用法正确

## 自定义页面
- [ ] .page.yml + .page.amis.json 成对
- [ ] Amis schema 结构正确（service/crud/chart）
- [ ] Tab 配置 type: page 引用页面

## 应用
- [ ] icon_slds 值来自 SLDS 图标集
- [ ] color 值为 red/orange/yellow/green/teal/cyan/blue/pink/purple/gray
- [ ] tabs 数组正确引用 tab 名称

## 权限
- [ ] .permission.yml 文件在 objects/{name}/permissions/
- [ ] admin 和 user 权限分开配置

## 国际化
- [ ] 使用 .objectTranslation.yml（非修改 label）
- [ ] 使用 .translation.yml 翻译应用名和 Tab 名
- [ ] 路径在 objectTranslations/{object}.en/ 下

## 初始化数据
- [ ] 文件在 main/default/data/ 目录
- [ ] 文件名为 {objectName}.data.yml 或 .data.json
- [ ] 每条记录有 _id
- [ ] 未手动设置 space/owner/created 等自动字段
- [ ] 需要时使用 ${space_id} 模板变量

## 项目结构
- [ ] 符合 steedos-packages/my-package/main/default/ 格式
- [ ] 各文件在正确的子目录中
