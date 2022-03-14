## 集成 Amis
- 集成Amis 设计器
- 集成Amis 渲染器

## 新增对象
- 新增对象Pages，用于保存 amis schema
  - 详细页面添加按钮：设计器，点击后打开Amis设计器
- 新增对象Pages assignment, 用于记录page分配。 


## 调整页面渲染引擎

- 自定义应用

- 列表页面

- 详细页面

- 表单页面

## 将 Steedos React 组件 整合到 Amis
- 列表组件：
    - 没有react组件：切换列表视图
    - 没有react组件：列表按钮
    - 没有react组件：下载列表数据
    - 没有react组件：自定义列表
    - 没有react组件：过滤器
    - 数据展示:
        - Table
        - Tree Table
- 记录详细
    - 各种字段类型
- 相关表
    - 是否显示总数
    - 按钮
    - 快速编辑
- 相关表快速链接
    - 相关表名称
    - 相关表记录总数

## 页面布局设计器（无法使用Amis 实现）
- 分组
- 选对象字段
    - 根据对象的定义，将对象的字段转化为Amis的自定义组件，供用户使用。
- 选对象按钮
- 选子表

## 服务端
- amis service
    - actions
        - getDefaultSchema(type, app, objectApiName, recordId): 获取默认Schema
        - API：getMeSchema(type, app, objectApiName, recordId): 获取分配的Schema
        - amis的配套接口