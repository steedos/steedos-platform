Steedos Objects 
===

Steedos Objects 用于定义Steedos中的对象。Object对象中可以定义以下内容
- fields，Creator根据object.fields生成schema
- list_views，列表视图，列表视图中可定义显示的列和列表过滤条件
- triggers，创建对象操作触发器，在服务端执行。例如"before.insert"
- 系统初始化时自动生成Object对应的Collection，并绑定到Schema。

### baseObject
baseObject用于定义所有对象适用的基础fields, triggers, indexes. list_views 只能在对象中定义

### Object 支持的属性
- name: 唯一的object name
- label: 显示名
- icon：图标，参见 https://www.lightningdesignsystem.com/icons ， Standard Icons 部分
- db：对应的Meteor Collection，如果未定义此属性，Steedos 会自动生成。
- enable_search: 启用全局搜索，只搜索searchable的字段
- enable_files: 启用上传附件功能
- enable_chatter: 启用讨论功能
- enable_tasks: 启用任务功能
- enable_audit: 启用审计跟踪功能
- enable_api: 启用API接口
- enable_schema: 是否自动Attach Schema到Collection上。默认开启。

### fields支持的字段类型
- [lookup](https://github.com/steedos/creator/tree/master/packages/steedos-autoform-lookup): 相关表，联合reference_to字段，从关联表中选择记录
- master_detail: 子表，联合reference_to属性，表示当前记录是主表的子记录。系统会自动检测此类型的字段，在主表的记录显示页面中生成子表列表视图。
- text: 文本
- textarea: 文本域
- "[text]": 文本数组，也可以用来保存id数组
- date: 日期
- datetime: 日期时间
- select: 下拉框，联合options属性，生成下拉框的内容
- boolean：Checkbox
- number: 数值
	- scale: 小数位数，默认值0
	- precision: 数值最大长度，默认值18
- 实例：
	- 在archive_records对象里，字段archive_destroy_id类型为master_detail
		- archive_destroy_id:
				type:"master_detail"
				label:"销毁单"
				filters:[["destroy_state", "=", "未销毁"]]
				depend_on:["destroy_state"]
				reference_to:"archive_destroy"
				group:"销毁"
		- 备注：上述实例中，使用了filters字段级过滤，其中depend_on必须有，最终得到“archive_destroy”表中，destroy_state值为“未销毁”的记录。

### fields 属性
- name: 字段名
- label: 字段显示名。如果系统检测到翻译 "objectname_fieldname"，以翻译为准。
- defaultValue: 默认值，可配置默认值公式 {{userId}}, {{spaceId}} 等，#todo
- required: 必填
- inlineHelpText: 表单填写时显示的帮助文本
- sortable: 可排序，可排序字段系统会自动创建索引
- index: true/false，指定是否为此字段创建索引
- readonly: 只读，应该只显示在查看页面或列表页面上，新增和修改页面都不显示 #todo
- omit: 所有页面都不显示
- multiple: 表示数组字段，可以多选
- group：字段分组，在显示表单时自动按分组显示
- is_wide: 宽字段，显示时占满整行
- is_name: 表示此字段为标题字段，适用于标题字段并不是"name"时，在列表页生成链接
- readonly: 只读
- disabled: 禁用
- hidden: 隐藏，在列表和表单中都不显示
- blackbox: 告知schema忽略此字段的类型验证
- allowedValues: 可选项范围
- seachable: 可搜索

### permissions 权限
Object权限分以下类型
- allowCreate: 可创建
- allowDelete: 可删除
- allowEdit: 可编辑
- allowRead: 可查看owner=自己的记录
- modifyAllRecords: 可修改所有人的记录
- viewAllRecords: 可查看所有人的记录
- actions [text]字段，用来控制显示哪些actions
- listviews [text]字段，用来控制显示哪些listviews
- related_objects 字段，用来控制相关列表中显示哪些内容
- fields [text] ，当前用户的可见字段，数据库中如果没有配置此属性，则表示不限制。
- readonly_fields [text] ，当前用户不能编辑的字段
备注：一个人可以属于多个权限集。如果多个权限集中定义了同一个object的权限，大部分属性取最大权限集合。除了以下属性：readonly_fields取最小权限集合。

API
- object权限：Creator.getPermissions(object_name)
- record权限：Creator.getRecordPermissions(object_name, record, userId)

### PermissionSet 权限集
管理员可以设定权限集，用于定义每一个用户对app, object, object field的访问权限。
- 每个对象可以预定义两个权限集 admin, user。工作区管理员享有admin权限。
- 自定义权限集时需要指定对应的用户。
- 多个权限集可以叠加，以相对较高权限为最终用户权限。
- 权限集中可以设定用户授权访问的Apps
- 可以为具体对象指定权限。
- 可以为具体字段指定权限。
