---
title: 操作按钮
---

系统内置三个基本操作：新增、修改、删除。

在此基础上，用户可以自定义按钮，并编写javascript脚本执行想要的操作。

- name: 名称
- label: 按钮显示标签
- on: 显示位置 
  - "list" 为列表定义action，只显示在列表右上角
  - "record" 为记录定义action，显示在记录查看页右上角以及列表视图中每项的下拉菜单中
  - "record_more" 为记录定义action，只显示在记录查看页右上角折叠起来的“更多”下拉菜单中
  - "list_item" 为记录定义action，只显示在列表视图中每项的下拉菜单中
- sort: 排序号，显示时，按照从小到达顺序排列。编辑action的sort默认为0
- todo: 脚本内容，脚本中可以使用以下变量
  - this.object_name
  - this.object
  - this.action

使用代码编写操作按钮实例
- actions
  - "export":
    - visible: true
    - on: "list"
    - todo: ()->
