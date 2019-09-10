---
title: 过滤条件 filters
---

过滤条件语法，用于向数据库查询数据。

## 过滤条件

### 过滤器语法
使用数组的格式定义一个或多个过滤条件。例如以下过滤器用于查询本月创建的，责任人是本人的数据。
```yml
filters: [["priority", "=", ],["owner","=","{userId}"],["created", "=", this_month]]
filters: [["status", "=", ["closed","open"]]]
filters: [["age", "between", [20,30]]]
```

### 运算符 operation
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

## 组合过滤

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

## 过滤条件值为数组时的增强功能

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

## 公式字段支持

过滤条件中允许指定当前状态相关属性值为value
- "{userId}"：当前登录用户id
- "{spaceId}"：当前当前所在工作区
- "{user.xxx}"：当前登录用户信息，如user.name,user.mobile,user.email,user.company_id等
- 其他所有Steedos.USER_CONTEXT中能取到的变量值

实例：
- [["assignees", "=", "{userId}"]]


## 函数支持

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

## 日期、时间字段与时区
日期和时间类型的字段，在数据库中保存的都是UTC时间。其中日期类型字段对应的是00:00:00。

查询日期时间类型字段时，必须先把时间转换为UTC时间格式再执行查询。

例如想要查询 创建日期为北京时间下午13:00以前的文档，需要先将北京时间转换为GMT时间再执行查询。
```js
[["created","<=","2019-08-06T07:00:00Z"]]
```