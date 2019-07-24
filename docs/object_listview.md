---
title: 列表视图
---

列表视图可以对业务数据进行分类，让最终用户更方便的浏览。 例如对于任务(Task)对象，可以定义待办任务、已办任务、交办任务等多个视图。

## 实例
```yaml
list_views:
	open:
		label: "进行中"
		columns: ["name", "category", "level", "tags", "created"]
		filters: [["status", "=", "open"]]
		filter_fields: ["category", "level", "tags"]
		sort: [["created", "desc"]]
```

## 列表视图属性

### 基本属性
- 列表视图名称(name):必填，是视图唯一名称。
- 显示名称(label):列表视图名称为显示名称，如果没填写，则显示为列表视图名称。
- 过滤范围(filter_scope): 有两个选项“我的(mine)”和“工作区(space)”，分别表示只能查看当前登录用户的数据和当前工作区的数据。默认为space。

### 过滤条件 filters
可以设定列表视图的[过滤条件(filters)](object_filter.md)，只有符合过滤条件的数据才会显示在列表中。
```yaml
filters: [["status", "=", "open"]]
```

### 列 columns
定义在列表视图显示的列(columns)：列表上显示哪些字段，以及显示的先后顺序。
columns需定义为数组，元素为可以是字段名称，也可以是一个列描述对象。

### 模式 mode
```yaml
mode: "standard" # or "virtual" | "infinite"
```

简要定义：
```yaml
columns: ["name", "category", "level", "tags", "created"]
```

高级定义：
```yaml
columns: 
  - name
  - field: category 
    width: 100
    label: "分类"
    wrap: true
    handlebar: ""
  - level
  - tags
  - created
```
列描述对象属性如下：
- field: 字段名。
- width: 字段宽度，不填写为自动宽度。
- wrap: 显示此字段时是否自动换行，默认为不换行，超出部分显示为... 。
- label: 列标题，默认为字段名。
- handlebar: 使用模版生成字段内容，在模版中能取到当前列表视图上的字段。

### 排序规则 sort
定了列表数据的排序规则，可以设定多个字段的组合排序。如果未指定，默认的排序规则是按创建时间倒序排列，也就是如下代码：
```yaml
sort: [["created", "desc"]]
```

### 用户筛选字段 filter_fields
列表视图的右侧有过滤器，用户点击进入后默认就有这些默认的过滤字段，可快速设置过滤条件，显示出符合条件的数据。
filter_fields需定义为数组，元素为对象的字段名称。
```
filter_fields: ["category", "level", "tags"]
```

### 默认视图(is_default)
将此视图设置为默认，用户打开此对象，自动选中此视图。

## 用户自定义视图
系统运行时，最终用户可以在界面上自定义视图。除了设定以上属性外，还可以配置以下参数：

### 共享 shared
设置是否共享该视图给工作区其他人员。只有工作区管理员可以创建共享视图，共享的视图工作区内所有用户都能看到，非共享的视图只有创建者自己可用。


## 界面展示
定义好列表视图之后，Steedos会为自动生成功能完整的数据浏览与操作界面，包括：
- 使用列表方式显示数据，支持分页、排序等基本功能
- 双击单元格可以快速编辑单个字段
- 选中多条记录，可以快速更新单个字段
- 用户可以拖拉调整字段宽度或字段显示的先后顺序
- 用户可以在过滤器中，基于过滤字段（默认和自定义的）来设置筛选条件，显示过滤后的对象记录

![电脑、手机界面展示](assets/mac_ipad_iphone_list.png)
