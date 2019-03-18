触发器 triggers
===

对于记录的增删改操作，可设定自动执行的脚本。同一个事件可以定义多个trigger，但不能重名。

脚本触发时间(when)：
- "before.insert": 数据新增前执行。
- "before.update": 数据修改前执行。
- "before.remove": 数据删除前执行。
- "after.insert": 数据新增后执行。
- "after.update": 数据修改后执行。
- "after.remove": 数据删除后执行。

脚本执行位置(on): 
- "server": 在服务端执行，通常用于编写业务逻辑。
- "client": 在客户端执行，通常用于数据校验和显示提示信息。

脚本(todo): 编写脚本，脚本中可以使用以下变量
- 当前对象名称：this.object_name

脚本返回值：
- 如果return的是false，则中断操作，如在before.insert里return false,则不执行insert操作。