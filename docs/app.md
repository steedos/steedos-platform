---
title: 应用
---

应用可以把业务对象按功能、按业务类型进行分类。例如Salesforce定义了以下应用：销售、市场、服务、内容、社区等。

业务人员可以从左上角的开始菜单选择需要访问的应用。选中应用后，默认进入应用配置的第一个业务对象的列表视图。

点击界面顶端的业务对象导航菜单，可以切换到其他业务对象。

系统预定义了一个“设置”应用。普通用户可以设置用户参数，管理员可以修改系统参数。

![电脑、手机界面展示](assets/mac_mobile_list.png)

管理员可以在权限集中配置应用的访问权限，如果一个用户属于多个权限集，则最终可访问的应用为个权限集的叠加。

## 应用

```yaml
_id: crm
name: 客户
description: 管理客户，以及相关的联系人、任务和日程。
icon_slds: folder
is_creator: true
objects:
  - accounts
  - contacts
  - tasks
  - events  
mobile_objects:
  - accounts
  - contacts
```

### _id

应用的API名称，必须符合变量的命名规范。

### 应用名称 name

应用在界面上的显示名称，可以使用中文名称。

### 应用图标 icon_slds

必须配置。对应 [LIGHTNING DESIGN SYSTEM 中的Standard Icons图标](https://www.lightningdesignsystem.com/icons/#standard) 中的图标名称。

### 可见 visible

如果配置为false，可将应用隐藏。

### 排序号

控制应用在开始菜单中显示的先后顺序。

### 电脑端菜单 objects

使用数组格式定义此应用中显示的对象清单，系统按照定义的先后顺序显示为业务对象Tab。点击业务对象名称，进入业务对象列表界面。

除了可以配置当前项目中的业务对象，也可以配置系统内置的[标准业务对象](standard_objects.md)。

## 手机端菜单 mobile_objects

使用数组格式定义在手机端主菜单中显示的对象清单，系统按照定义的先后顺序显示为业务对象菜单。

## 门户 dashboard

如果配置了此参数，在电脑端会自动加上“首页”Tab，按照配置自动生成应用首页。

```yml
dashboard:
  pending_tasks:
    label: 待办任务
    position: LEFT
    type: object
    objectName: tasks
    filters: [['assignees', '=', '{userId}'], ['state', '<>', 'complete']]
    columns:
      - field: name
        label: 名称
        wrap: true
        href: true
      - field: priority
        label: 优先级
        width: 14rem
        wrap: false
    illustration: 
      path: "/assets/images/illustrations/empty-state-not-available-in-lightning.svg#not-available-in-lightning",
      heading: ""
      messageBody: "没有找到待办任务"
    showAllLink: true
    noHeader: true
    unborderedRow: true
```

### 标题 label

显示在 widget 左上角。

### 类型 type

内置 widget 类型。目前支持以下类型：

- object: 以表格的形式显示对象的列表数据。
- apps: 显示 apps 清单，点击可以跳转到对应的应用。
- react: 显示react component内容，是一个function，返回react node节点。
- email: 显示当前用户的未读邮件。

### 对象 object_name

查询的对象。

### 筛选条件 filters

在 widget 中只显示符合筛选条件的数据。

### 列表数据排序规则 sort

type为object时，设置widget列表排序规则，支持字符串和数组两种格式：

```
sort: "modified desc, name"
```

```
sort: [["due_date", "desc"], ["state"]],
```

### 列 columns

设定显示的列，以及列的属性。

#### columns.field

设定列的字段名

#### columns.label

设定列的显示文字

#### columns.width

设定列的宽度，为空则自适应，可设置为rex，百分比，像素等，例如：14rex，20%，80px，推荐用rex单位

#### columns.wrap

设定列是否换行，默认为false，设置为true时，文字超出会换行显示，为false时则会显示为省略号

#### columns.hidden

设定列是否隐藏，默认为false，设置为true时，该列将不显示，不过数据会加载到内存中

#### columns.onClick

设定列的单击行为，可设置为一个函数，点击将执行该函数

#### columns.href

设定列的是否显示为链接，默认为false

#### columns.format

设定列的渲染函数，该函数可变更列内容显示规则

```yml
dashboard:
  pending_tasks:
    ...
    ...
    footer: !<tag:yaml.org,2002:js/function> |- 
      function (children, data, options) {
        let objectName = options.objectName;
        let url = `/app/-/${objectName}/view/${data.id}`;
        if (window.__meteor_runtime_config__)
          url = window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;

        return (
          <a target="_blank" href={url} title={children}>
            {children}
          </a>
        )
      }
```

### 显示查看全部链接 showAllLink

是否显示查看全部链接，设置为true，type为object时，会在底部显示查看全部链接，默认值false

### 链接打开方式 hrefTarget

链接打开方式，设置为"_blank"，type为object时，包括列表及底部显示的查看全部链接都会从新窗口中打开，默认值为空

### 底部显示内容 footer

底部显示内容，type为object时，通过把该属性设置为一个函数，可定制底部显示内容，该函数会覆盖showAllLink、hrefTarget属性


```yml
dashboard:
  pending_tasks:
    ...
    ...
    footer: !<tag:yaml.org,2002:js/function> |- 
      function (options) {
        let objectName = options.objectName;
        return (
          <a href={`/app/-/${objectName}`} target="_blank">
            查看全部任务
          </a>
        )
      }
```

### 不显示表头 noHeader

是否不显示表头，设置为true，type为object时，会隐藏表头，默认值false

### 不显示行分隔线 unborderedRow

是否不显示行分隔线，设置为true，type为object时，会隐藏表格的行分隔线，默认值false

### 数据空白时显示效果 illustration

当数据内容空白时，其显示效果可通过该属性来配置，type为object时有效

#### illustration.heading
当数据内容空白时，显示大标题文字

#### illustration.messageBody
当数据内容空白时，显示小标题文字

#### illustration.path
当数据内容空白时，要显示的图标路径

### 位置 position

显示 widget 的位置，可选项：

- LEFT: 显示在左侧
- CENTER_TOP: 显示在中间栏顶部
- CENTER_BOTTOM_LEFT: 显示在中间栏底部左侧
- CENTER_BOTTOM_RIGHT: 显示在中间栏底部右侧
- RIGHT: 显示在右侧

### 手机版效果 mobile

是否显示为手机版效果，即窄屏效果，默认值false，type为apps时有效

### 显示App的object列表 showAllItems

type为apps时是否显示app对应的object列表，默认值false，`为true的功能暂时未实现`

### 新窗口打开应用

type为apps时，点击应用链接时是否新窗口中打开应用，通过把应用设置为新窗口中打开即可，即app.is_new_window为true的应用将从新窗口中打开

### 组件 component

显示 react component内容，可选项，type为react时必填，是一个function，返回react node节点，比如：
```
const styled = require('styled-components').default;
let CenterDiv = styled.div`
  text-align: center;
  height: 230px;
  background: #fff;
  border: solid 1px #eee;
  border-radius: 4px;
  margin-bottom: 12px;
`;
return <CenterDiv className="testReact1">react component</CenterDiv>;
```

