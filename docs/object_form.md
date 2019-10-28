---
title: 对象表单
---

## 表单触发器

### initialValues

表单初始化数据时执行。

initialValues 可以定义为同步函数或是异步函数。

```
form:
  initialValues: function () {
      return {
          name: "Hello World",
          code: "hello_world
      }
  }
```

### onSubmit

表单提交时执行。传入表单中的字段值，如果成功返回undefined，如果失败返回错误数组。

onSubmit 可以定义为同步函数或是异步函数。

```
form:
  onSubmit: function (formValues) {
      return {
          // 调用 ajax 查询服务端
          code: "code 字段不能重复"
      }
  }
```

### validate

表单字段修改时执行。传入表单中的字段值，如果成功返回undefined，如果失败返回错误数组。

validate 可以定义为同步函数或是异步函数。

```
form:
  validate: function (formValues) {
      return {
          // 调用 ajax 查询服务端
          code: "code 字段不能重复"
      }
  }
```
