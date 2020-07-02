# 软件包

### 导出数据
```
{
    apps:[{}], 软件包选中的apps
    objects:[{}], 选中的object及其fields, list_views, triggers, actions, permission_set等
    list_views:[{}], 软件包选中的list_views
    permissions:[{}], 软件包选中的权限集
    permission_objects:[{}], 软件包选中的权限对象
    reports:[{}] 软件包选中的报表
}
```

### 导入数据
	- 权限: 工作区管理员
	- 校验:
		1 app 如果已经存在,则抛出异常
		2 object 如果已经存在,则抛出异常
		3 如果object.triggers 有再服务端运行的,单当前工作区不是企业版,则抛出异常
		4 app.objects 中所引用的object如果不存在(检查范围为本次导入的object及原工作区已经有的object),则抛出异常
		5 list_views对应的object如果不存在,则抛出异常
		6 permission_set 在db中校验,如果permission_set.name 已经有对应的记录,则抛出异常
		7 permission_set.assigned_apps ,如果指定的app不存在,则抛出异常
		8 permission_objects如果权限集中指定的object_name不存在,则抛出异常
		9 permission_object.permission_set_id如果找不到对应的permission_set ,则抛出异常
		10 reports中指定的object如果不存在, 则抛出异常
		
	- 导入过程:
		1 持久化Apps
		2 持久化objects: 创建object时，会自动添加all view、recent view
		3 持久化list_views
		4 持久化permission_set
		5 持久化permission_objects
		6 持久化reports