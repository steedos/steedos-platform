1.13.6 / 2019-12-20
===================

  * 分部增加排序号字段，更新组织时从组织同步 #211
  * 新建分部时，如果选择了关联组织，不应该再自动创建组织 #212
  * 引入 dotenv
  * [增加全局函数Creator.openApp，以辅助实现单点登录](https://github.com/steedos/creator/issues/1494)
1.6.4-patch.1 / 2019-09-16
===================

  * jsreport-core等jsreport内核包版本固定住，以防止高版本报错Cannot find module 'handlebars'
1.5.0-beta.0 / 2019-08-30

  * 把所属分部表 company 从 organizations 中独立出来 #124
1.0.12 / 2019-09-02
===================

  * [webhook增加全局checkbox选项](https://github.com/steedos/workflow/issues/2035)
===================

  * 对象扩展action.on值，增加选项list_item、record_only，移除原来的action.only_list_item、action.only_detail属性
1.0.10 / 2019-09-02
===================

  * 整理base object
1.0.9 / 2019-08-31
===================

  * 流程可上传附件用作正文模板，[审批王需实现每个流程可配置相应的正文模板功能](https://github.com/steedos/workflow/issues/2045)
1.0.4 / 2019-08-19
===================

  * [数据导入功能，支持重复导入同一个Excel](https://github.com/steedos/object-server/issues/109)
1.0.0 / 2019-08-13
===================

  * [标准业务对象完善 #114](https://github.com/steedos/object-server/issues/114)
0.2.2 / 2019-08-12
===================

  * fix bug：给yml文件中function类型字段添加 `!!js/function`
0.2.1 / 2019-08-02
===================

  * object listViews 支持指定字段宽度，是否换行
0.1.1 / 2019-07-23
===================

  * Creator.Objects.reports识别配置了jsreport插件了才显示相关字段
0.1.2 / 2019-07-30
===================

  * 整理核心对象
0.0.6 / 2019-07-22
===================

  * 处理bug：根部门单字段修改报错

0.0.5 / 2019-07-17
===================

  * 添加*.object.js文件
0.0.3 / 2019-06-13
===================

  * 添加core.objcet.yml, core.objectwebhooks.trigger.js及object_webhooks.object.yml