---
title: 过滤条件
---

过滤条件可用于对业务数据进行过滤。比如：
- 定义视图时，可以同时定义过滤条件，每个视图都有自己的过滤器，通过过滤器可以为视图列表内容设置过滤条件。

### 支持的运算符
- "=": 等于
- "<>": 不等于
- ">": 大于
- ">=": 大于等于
- "<": 小于
- "<=": 小于等于
- "startswith": 以...开始
- "contains": 包含...
- "notcontains": 不包含...
- "between": 范围

实例：
- [["field1", "=", true],["field2","<=",new Date()],["field3", ">", 20]]
- [["status", "=", ["closed","open"]]]
- [["age", "between", [20,30]]]

### “非”(not)操作

可以在当前过滤条件的基础上取反，例如：
-  ["not", ["value", "=", 3]]

### “与(and)”、“或(or)”操作

多个过滤器可以通过“与(and)”、“或(or)”操作进行组合，例如：
- [ [ "value", ">", 3 ], "and", [ "value", "<", 7 ] ]
- [ [ "value", ">", 7 ], "or", [ "value", "<", 3 ] ]

如果不指定“与(and)”、“或(or)”操作，系统默认按照“与(and)”操作执行过滤。所以下两种写法结果相同：
- [ [ "value", ">", 3 ], "and", [ "value", "<", 7 ] ]
- [ [ "value", ">", 3 ], [ "value", "<", 7 ] ]

### 过滤条件值为数组时的增强功能

运算符为"="时，条件自动按"or"裂变连接成多个过滤条件，类似实现了"in"操作功能，所以下两种写法结果相同：
- [["status", "in", ["closed","open"]]]
- [ [ "status", "=", "closed" ], "or", [ "status", "=", "open" ] ]

运算符为"<>"时，条件自动按"and"裂变连接成多个过滤条件，所以下两种写法结果相同：
- [["status", "not in", ["closed","open"]]]
- [ [ "status", "<>", "closed" ], "and", [ "status", "<>", "open" ] ]

运算符为"between"时，条件自动转换成">="及"<="运算符对应的过滤条件，以下各组效果相同：
- [["age", "between", [20,30]]] 等效于 [ [ "age", ">=", 20 ], "and", [ "age", "<=", 30 ] ]
- [["age", "between", [null,30]]] 等效于 [ [ "age", "<=", 30 ] ]
- [["age", "between", [20,null]]] 等效于 [ [ "age", ">=", 20 ] ]

> between只支持数值及日期时间类型，且过滤值必须是两个元素的数组格式

其他情况一律自动按"or"裂变连接成多个过滤条件
- [["tag", "contains", ["start","end"]]] 等效于 [ [ "tag", "contains", "start" ], "or", [ "tag", "contains", "end" ] ]

### 公式字段支持

过滤条件中允许指定当前状态相关属性值为value
- "{userId}"：当前登录用户id
- "{spaceId}"：当前当前所在工作区
- "{user.xxx}"：当前登录用户信息，如user.name,user.mobile,user.email,user.company_id等
- 其他所有Steedos.USER_CONTEXT中能取到的变量值

实例：
- [["assignees", "=", "{userId}"]]

### 支持过滤条件为Object格式
```
[["object_name", "=", "project_issues"]]
```
等效于：
```
{
	"field": "object_name",
	"operation": "=",
	"value": "project_issues"
}
```

### 函数支持

支持两种function方式：
1. 整个filters为function，如：
```
filters: ()->
	return [[["object_name","=","project_issues"],'or',["object_name","=","tasks"]]]
```
2. filters内的filter.value为function，如：
```
filters: [["object_name", "=", ()->
	return "project_issues"
]]
```
或
```
filters: [{
	"field": "object_name"
	"operation": "="
	"value": ()->
		return "project_issues"
}]
```

### 代码中定义的过滤条件与视图过滤器中设置的过滤条件并存
如果两都并存的话，视图显示范围将是两者取"and"运算符连接起来的过滤结果！

### 关于日期、时间字段与时区
以下各组方式是等效的，它们都是用utc格式定义时间值：
- [["created","<=",new Date("2019-05-25T06:44:44.000Z")]]
- [["created","<=","2019-05-25T06:44:44.000Z"]]
- [["created","<=",new Date("2019-05-25T06:44:44Z")]]
- [["created","<=","2019-05-25T06:44:44Z"]]

以本地时间为中国北京时间为例，以上utc方式等效于：
- [["created","<=",new Date("2019-05-25 14:44:44")]]
- [["created","<=","2019-05-25 14:44:44"]]

以上utc格式及本地时间格式都将转换为OData Query：`(created le 2019-05-25T06:44:44Z)`

> between操作符中的日期、时间字段规则同上

> 注意yml格式文件中日期、时间字段加引号与不加引号是有区别的：
- 不加引号的话，是定义Date对象，且2019-05-25T06:44:44.000Z、2019-05-25 06:44:44都是utc格式，不支持本地时间写法
- 加引号的话，是定义string，且'2019-05-25T06:44:44.000Z'、'2019-05-25 06:44:44'是有区别的，前者会被识别为utc，后者会被识别为本地时间

以下是定义`created <= 2019-05-25T06:44:44Z`的yml格式写法，它们是等效的：
```
filters:
  - 
    - 
      - created
      - '<='
      - 2019-05-25T06:44:44Z
```
==
```
filters:
  - 
    - 
      - created
      - '<='
      - '2019-05-25T06:44:44Z'
```
==

```
filters:
  - 
    - 
      - created
      - '<='
      - 2019-05-25 06:44:44
```
==

```
filters:
  - 
    - 
      - created
      - '<='
      - '2019-05-25 14:44:44'
```

> 以上日期、时间字段与时区规则只适用于数据库中值存储的是date对象，不支持数据库中直接存储为字符串的方式，以mongodb为例：
- 支持`ISODate("2009-05-17T16:00:00.000Z")`这种存储方式，不支持存储为`"2009-05-17T16:00:00.000Z"`的时间字段比较
- 如果存储为字符串的话，比较时会存在时区偏差现象