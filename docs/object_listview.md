列表视图 listview
===

列表视图可以对业务数据进行分类，让最终用户更方便的浏览。 例如对于任务(Task)对象，可以定义待办任务、已办任务、交办任务等多个视图。

对象创建时，系统会自动生成一个显示“全部”数据的列表视图。

### 列表视图属性
- 列表视图名称(name):必填，是视图唯一名称。
- 显示名称(label):列表视图名称为显示名称，如果没填写，则显示为列表视图名称。
- 对象(object_name)：视图所属对象，新建视图时会自动设置为当前所在对象。
- 过滤范围(label):必填，列表视图限制在什么范围，有两个选项“我的(mine)”和“工作区(space)”，分别表示只能查看当前登录用户的数据和当前工作区的数据。
- [过滤条件(filters)](object_filter.md): 只有符合过滤条件的数据才会显示在视图中
- 需要显示的列(columns)：数组，元素为所属对象的字段名称，列表上显示哪些字段。
- 默认排序规则(sort)：可以设置默认的排序字段和排序方式。
- 默认过滤字段(filter_fields)：数组，元素为所属对象的字段名称。列表视图的右侧有过滤器，用户点击进入后默认就有这些默认的过滤字段，可快速设置过滤条件，显示出符合条件的数据。
- 共享视图到工作区(shared)：是否共享该视图给工作区其他人员看，工作区管理员可以将视图设定为共享，共享的视图工作区内所有用户都能看到，非共享的视图只有创建者自己可用。
- 是否为默认视图(is_default)：新建自定义对象时，系统为其自动添加的默认视图。

实例：
```
list_views:
	open:
		label: "进行中"
		columns: ["name", "category", "level", "tags", "created"]
		filter_scope: "space"
		filters: [["status", "=", "open"]]
		filter_fields: ["category", "level", "tags", "company_id", "owner"]
	closed:
		label: "已关闭"
		columns: ["name", "category", "level", "tags", "created"]
		filter_scope: "space"
		filters: [["status", "=", "closed"]]
		filter_fields: ["category", "level", "tags", "company_id", "owner"]
	all:
		label: "所有"
		columns: ["name", "category", "level", "status", "tags", "created"]
		filter_scope: "space"
		filter_fields: ["category", "level", "status", "tags", "company_id", "owner"]
```

定义好列表视图之后，Creator会为自动生成功能完整的数据浏览与操作界面，包括：
- 使用列表方式显示数据，支持分页、排序等基本功能
- 双击单元格可以快速编辑单个字段
- 选中多条记录，可以快速更新单个字段
- 用户可以拖拉调整字段宽度或字段显示的先后顺序
- 用户可以在过滤器中，基于过滤字段（默认和自定义的）来设置筛选条件，显示过滤后的对象记录

![电脑、手机界面展示](images/mac_ipad_iphone_list.png)
