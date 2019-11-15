---
title: 简介
---

开放数据协议（Open Data Protocol，缩写OData）是一种描述如何创建和访问Restful服务的OASIS标准。该标准由微软发起，前三个版本1.0、2.0、3.0都是微软开放标准。第四个版本4.0于2014年3月17日在OASIS投票通过成为开放工业标准。

Steedos API 遵循 OData 协议，开发人员定义的所有业务对象，均可自动生成标准 OData 接口。


## 访问地址

 All API access is through HTTP(S) requests at `your-steedos-url.com/api/v4`. All request and response bodies are `application/json`.

<!-- When using endpoints that require a user id, the string `me` can be used in place of the user id to indicate the action is to be taken for the logged in user. -->

## 接口返回状态码说明
- 200：请求执行成功
- 400：无法成功解析请求，URL在语法或语义上可能不正确
- 401：未进行身份验证
- 403：没有访问该实体的权限
- 404：未找到相关记录
- 405：不能对该记录执行此请求
- 406：无法满足实体/实体容器/实体集在接受标头中指定的请求格式
- 413：返回数据过大
- 500：内部服务器错误
- 501：服务不可用