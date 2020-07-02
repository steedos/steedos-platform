# 字段历史
通过在对象上设置`enable_audit=true`来开启对象的字段跟踪

## 字段值存储规则
- 日期 格式存储为 (String): 2018-01-02
- 时间 格式存储为 (String): 2018-01-02 23:12
- lookup 和下拉框，都是对应的显示名称 (name | label)
- boolean 就存是/否
- 多行文本\grid\lookup有optionsFunction并且没有reference_to时 不记录新旧值, 只记录修改时间, 修改人, 修改的字段显示名

## 显示规则
- 记录详细界面上， 如果当前用户对当前对象有modifyAllRecords权限， 则在以相关列表显示当前记录的字段历史列表
- 设置-高级-字段历史： `permission_sets = admin` 可见

## 补充说明
- 不记录相关对象的新增，修改

## TODO
[【字段历史】可以指定记录对象的那些字段](https://github.com/steedos/creator/issues/998)




