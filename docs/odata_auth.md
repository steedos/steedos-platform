身份验证
===

ODATA接口均以"/api/odata/v4/"开头，访问ODATA接口必须提供用户身份信息，用户只能在权限范围内进行数据查询和修改。用户可以通过oauth2协议获取并验证。

## 1. Auth Token验证
调用ODATA接口时，需在请求的headers中包含如下信息

 - X-Auth-Token

 用户登录自动生成的Token验证码

 - X-User-Id

 用户ID

以ODATA查询接口的请求为例

HTTP 请求
```bash
curl
     -X GET https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts
     -H "X-Auth-Token: f2KpRW7KeN9aPmjSZ" 
     -H "X-User-Id: fbdpsNf4oHiX79vMJ"
```

## 2.OAuth2验证
[待完善]

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