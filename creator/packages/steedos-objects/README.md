Steedos Objects 
===

Steedos Objects 用于定义Steedos中的对象。

[关于对象的详细说明，请参考此文档。](https://github.com/steedos/help/blob/master/zh-cn/creator/object.md)

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
