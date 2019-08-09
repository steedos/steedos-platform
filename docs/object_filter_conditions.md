---
title: 筛选条件
---

定义视图或报表时，可以同时定义筛选条件，只有符合筛选条件的数据才显示在视图/报表中。

业务人员可以在前台界面修改筛选条件。

## 配置筛选条件

### 筛选条件

使用数组的格式定义一个或多个筛选条件。例如以下筛选器用于查询本月创建的，责任人是本人的数据。

```yml
filter_conditions:
  - field: priority
    operation: =
    value:
    required: true
  - field: owner
    operation: =
    value: {userId}
    readonly: true
  - field: created
    operation: =
    value: this_month
```

### 字段名 field

此筛选条件对应的字段名，必须设置。

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

### 只读 readonly

表示此筛选条件只读，业务人员在界面上不得修改。通常用来控制权限，确保用户只能看到授权的数据。

### 必填 required

表示此筛选条件必须设定，业务人员在界面上必须选中了value，才会显示列表视图或报表。

## 筛选逻辑 filter_logic

筛选器中配置的多个筛选条件，默认使用 and 逻辑进行组合。

下一个版本，用户可以自定义逻辑。

```yml
filter_logic: 1 OR 2
filter_logic: (1 OR 2) AND 3
filter_logic: NOT (1 OR 2)
```

## 筛选值 value

定义筛选条件的筛选值或筛选范围。

### 值为空

当值为空时，表示由业务人员在界面上手工选择筛选值。

### 值为数组

以下筛选条件用于查询 priority 是 (high or normal) 的数据。

```yml
filter_conditions:
  - field: priority
    operation: =
    value:
      - high
      - normal
```

其中的 = 替换为 contains，效果相同。

以下筛选条件用于查询 priority 不是 (high or normal) 的数据。

```yml
filter_conditions:
  - field: priority
    operation: <>
    value:
      - high
      - normal
```

其中的 <> 替换为 notcontains，效果相同。

以下筛选条件用于查询 age 在 20～30 之间的数据。

```yml
filter_conditions:
  - field: age
    operation: between
    value:
      - 20
      - 30
```

> between只支持数值及日期时间类型，且筛选值必须是两个元素的数组格式

### 值为公式

筛选条件中允许指定userContext中的变量值，例如：

```yml
value: {userId}
value: {spaceId}
value: {name}
```

### 值为日期、时间

日期和时间类型的字段，在数据库中保存的都是UTC时间。其中日期类型字段对应的是00:00:00。

查询日期时间类型字段时，必须先把时间转换为UTC时间格式再执行查询。

例如想要查询 创建日期为北京时间下午13:00以前的文档，需要先将北京时间转换为GMT时间再执行查询。

```yml
filter_conditions:
  - field: created
    operation: <=
    value: "2019-08-06T07:00:00Z"
```

### 值为函数

```yml
filter_conditions:
  - field: object_name
  - operation: =
  - value: !!js/function |
      function () {
        return "project_issues"
      }
```

## filters

用户定义的 filter_conditions 和 filter_logic，Steedos组合计算之后，成为用于查询数据的 [过滤条件 filters](object_filter) 。
