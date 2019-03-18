字段公式
===

可以为字段设定默认值公式。

### 公式取值
- 取一个字段的值：使用“{”和“}” (注意都是半角)将字段名扩起来，如：{price}
- 基于当前用户的系统变量：包括姓名、角色、部门等
 - ID: {userId}
 - 姓名：{user.name}
 - 所在部门（当申请人属于多个部门时，为所在主部门的全路径）： {user.organization.fullname}
 - 所在部门（最底层部门名）： {user.organization.name}
 - 角色名： {user.roles}
 - 手机： {user.mobile}
 - 固定电话： {user.work_phone}
 - 职务： {user.position}
- 取当前工作区的信息
 - ID: {spaceId}

### 公式计算
 - 加：{field1}+{field2}
 - 减：{field1}-{field2}
 - 乘：{field1}*{field2}
 - 除：{field1}/{field2}

### 子表汇总
对于master_detail类型字段，可以进行汇总：
 - 合计:   sum({object_name.field_name})
 - 平均值：average({object_name.field_name})
 - 计数：  count({object_name.field_name})
 - 最大值：max({object_name.field_name})
 - 最小值：min({object_name.field_name})
当子表中的记录有增删改时，会自动重新计算对应主表中的记录。