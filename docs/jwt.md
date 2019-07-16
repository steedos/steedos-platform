---
title: JWT
---
### 关于JWT
- Json web token (JWT), 是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准.该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。
- 官网：[https://jwt.io/](https://jwt.io/)

### 使用JWT单点登录到Steedos应用中
- 以[华炎合同管理系统](https://github.com/steedos/steedos-contracts-app)为例，在本地启动合同管理系统访问地址为`http://127.0.0.1:5000`
- 进入系统后在`设置-高级`里新建`OAuth2应用`, `客户端ID`作为生成JWT的payload.iss的值，`密钥`则作为生成JWT时的secret值
- 生成JWT过程如下,以nodejs为例：
```js
var jwt = require('jsonwebtoken');
var username = 'Administrator'; // 用户名用于识别当前用户身份
var iss = 'e37DceLdtx2Qedc6o'; // OAuth2应用的客户端ID
var secret = '7q5G21ymbDxqBcAFzyKPro84FKDN6FclMOkz5rZ_kUg'; // OAuth2应用的密钥
var redirect_url = 'http://127.0.0.1:5000/app/admin/OAuth2Clients/grid/all'; // 跳转地址
var token = jwt.sign({ username: username, redirect_url: redirect_url, iss: iss }, secret);
console.log('token: ', token);
```
- 生成好token之后即可访问单点登录接口`GET /api-v2/jwt/sso`，并设置hearder如：
```js
fetch('http://127.0.0.1:5000/api-v2/jwt/sso', {
  headers: {
    'Authorization': 'Bearer ' + token // JWT传输token方式
  }
})
```
- 请求成功则会跳转到redirect_url，完成单点登录
