---
title: 对象权限
---

可以为[权限组](permission_set.md)对应的用户设定对象级别的权限。当一个用户属于多个权限组时，实际拥有的权限为各权限组权限的叠加。

## 基本属性

### 对象名 object_name

此对象权限适用的对象名。

### 权限组 permission_set

此业务对象对应的权限组。

## 记录创建

### 允许创建 allowCreate

用户可以创建记录。在列表视图的右上角，显示新建按钮。调用API接口创建记录时，服务端也会判断此权限。

## 所有者权限

Steedos 为每个业务对象内置了 所有者(owner) 字段，默认值为记录的创建人。

### 允许查看 allowRead

用户可以查看所有者是自己的记录。

### 允许修改 allowEdit

用户可以查看、编辑所有者是自己的记录。

### 允许删除 allowDelete

用户可以查看、编辑并删除所有者是自己的记录。

## 单位级权限

Steedos 为每个业务对象内置了 所属单位(company_ids) 字段，默认值为记录创建人的所属单位。

### 查看本单位 viewCompanyRecords

用户可以查看本单位的记录。

### 修改本单位 modifyCompanyRecords

用户可以查看并修改本单位的记录，也可以执行删除操作。

## 全局管理权限

通过配置以下权限，授权用户查看/修改所有单位的业务记录。

### 查看所有记录 viewAllRecords

用户可以查看对象中所有单位的所有记录。

### 修改所有记录 modifyAllRecords

用户可以查看并修改对象中所有单位的所有记录。

## 字段级权限

可以配置用户对指定字段的查看与编辑权限。

### 可见字段 fields

指定用户在界面上可以查看的字段。

值为字段名数组。数组中字段的先后顺序也是查看界面上字段显示的先后顺序。

如果未配置，可见字段默认值为 ['ALL_FIELDS'] ，表示可以查看所有字段。此时界面上字段的显示顺序以业务对象中定义的顺序为准。

```yml
permission_set:
  user:
    fields: ['amount', 'owner', 'created']
```

以上配置表示：普通用户只能查看三个字段。

### 可编辑字段 fieldsEditable

默认情况下，可见字段均可编辑。如果特殊指定，可以配置此属性。

```yml
permission_set:
  user:
    fieldsEditable: ['amount']
```

以上配置表示：用户可以查看所有字段（未配置自动取默认值），但是只能修改 amount 字段。

## 可见列表视图 listViews

设定用户可以查看的[列表视图](./listview.md)。

值为列表视图名数组。数组中的顺序，就是界面上显示的列表视图可选项顺序。其中第一个为默认列表视图。

```yml
permission_set:
  user:
    listViews: ['all', 'mine', 'recent']
```

如果未配置，列表视图默认值为 ['ALL_LISTVIEWS'] ，表示可以查看所有列表视图。此时界面上列表视图的显示顺序以业务对象中定义的顺序为准。

## 可见相关对象 relatedObjects

设定记录查看界面，用户可以查看到的相关记录列表。

值为对象名数组，数组中的对象名先后顺序，就是用户界面上相关记录显示的先后顺序。

```yml
permission_set:
  user:
    relatedObjects: ['files', 'tasks', 'payments']
```

以上配置表示：普通用户在查看记录时，可以查看到相关的 文件(files)、任务(tasks)、付款(payments) 记录。

如果未配置，可见相关对象默认值为 ['ALL_RELATED_OBJECTS'] ，表示可以查看所有相关对象。此时界面上相关对象的显示顺序以业务对象中定义的顺序为准。

## 可见操作按钮 actions

设定记录查看界面，用户可以查看到的 [操作按钮](./object_action.md)。

值为操作按钮名，数组中的操作按钮先后顺序，就是用户界面上操作按钮显示的先后顺序。

```yml
permission_set:
  user:
    actions: ['standard_edit', 'upgrade']
```

以上配置表示：普通用户在查看记录时，可以查看到标准的编辑(standard_edit)按钮和自定义的升级(updade)按钮。

如果未配置，可见操作按钮默认值为 ['ALL_ACTIONS'] ，表示可以查看所有操作按钮。此时界面上操作按钮的显示顺序以业务对象中定义的顺序为准。

![对象权限设置页面](assets/permission_objects.png)
