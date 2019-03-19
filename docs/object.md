---
title: 对象
---

对象可以看作数据库中的表，Steedos内置了一些基本对象，您也可以使用配置文件配置自定义对象。无论是标准的对象还是自定义对象，Steedos都为它们提供完整的操作界面，帮助用户进行新建、编辑、存储、浏览。

![电脑、手机界面展示](assets/car_object.png)

### 定义对象
您可以创建 {object_name}.object.yml 文件，定义对象。您可以参考Steedos定义的 [标准对象](../packages/standard-objects)。

### 对象属性
- 对象名(object_name)： 必填，是对象的唯一名称，也是对象保存在数据库中的数据表名称。只能是英文、下划线和数字组成，不可重复。通过代码、API接口调用对象时，也需要使用此名称。
- 显示名称(label)： 必填，在界面上的显示名称，最终用户看到的是此名称。
- 图标(icon)： 必填，对象的显示图标名称，对应 [LIGHTNING DESIGN SYSTEM 中的Standard Icons图标](https://www.lightningdesignsystem.com/icons/#standard)
- 已启用(is_enable): 此对象已生效，显示在最终用户界面中。
- 启用搜索功能(enable_search): 此对象可以通过全局检索查询。
- 启用附件功能(enable_files): 此对象中的业务数据，可以上传附件。
- 启用任务功能(enable_tasks): 此对象中的业务数据，可以添加任务。
- 启用备忘功能(enable_notes): 此对象中的业务数据，可以添加备忘。
- 跟踪字段历史(enable_audit): 跟踪字段的修改历史，此功能会消耗更多服务器资源，只有必要的对象才应该配置此属性。
- 启用API接口(enable_api): 是否允许通过API接口访问对象，默认开启。 
- 启用数据校验(enable_schema): 在数据保存时，是否按照定义的字段属性进行数据校验。默认开启。
- 启用树状结构显示记录(enable_tree): 如果定义此属性，使用树状结构来展现对象。必须定义parent字段才能启用此属性。
- 自定义帮助(help_url)：如果设置了此字段的内容，最终用户在点击帮助时，跳转到此页面。否则跳转到默认帮助页面。
- 描述(description): 此对象的描述

### 对象子属性
- [字段](object_field.md): 根据用户定义的字段，Steedos自动生成数据库表用于保存业务数据
- [列表视图](object_listview.md)，列表视图中可定义显示的列和列表过滤条件
- [触发器](object_trigger.md)，创建对象操作触发器，在服务端执行。例如"before.insert"

### 引用对象
使用以下语法将对象加载到项目中。
```javascript
var steedos=require("@steedos/core")

// 加载单个对象
// 对于同一个对象，如果同时定义 .yml .json 和 .js 文件，按照以下优先顺序只加载第一个 .js .json .yml
steedos.use("./xxx.object.yml");
steedos.use("./xxx.object.js");
steedos.use("./src/xxx.object.yml");
steedos.use(__dirname + "/src/xxx.object.yml");
steedos.use(["./xxx.object.yml", "./yyy.object.yml"])

// 加载触发器
steedos.use("./xxx.trigger.js");

// 加载报表
steedos.use("./xxx.report.yml");

// 加载应用
steedos.use("./xxx.app.yml");

// 加载文件夹和所有子文件夹中的配置文件，依次加载对象、触发器、报表、应用
steedos.use("./src");
steedos.use("../src");
steedos.use(__dirname);

// 加载node_modules中的对象
app.use("@steedos/standard-objects");
```
