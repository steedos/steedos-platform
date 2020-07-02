## Steedos OAuth2

Steedos OAuth2包，将Creator项目作为一个OAuth认证服务器。管理员通过配置第三方授权应用，可实现第三方应用可通过调用相关接口，申请授权登录。

#### OAuth2流程

![OAuthWebSequenceWithConfig](https://github.com/steedos/creator/blob/master/packages/steedos-oauth2-server/documentation/OAuthWebSequenceWithConfig.png)

=========================================

## 使用指南

#### 管理员 - 配置应用

管理员登录Creator后，进入“OAauth2配置”项目，配置第三方应用。

 - 配置参数
   - 名称：第三方应用的简称或全称，用于显示在授权页面
   - 是否激活：默认是激活，只有激活状态的第三方应用才使用授权功能
   - 回调URL：第三方应用的URL，用于接收授权码
   - 客户端ID：系统自动生成第三方应用的唯一标识，不可修改
   - Secret： 系统自动生成的Secret密钥

#### 开发人员 - 调试接口

管理员将需要授权应用配置完成以后，开发人员需要获取对应的客户端ID和Secret，并根据流程，调取相应的API接口传入相应的参数。

=========================================

## 开发文档

第三方应用的参数在Creator中配置完成以后，可开发授权流程。具体流程说明如下：

#### 1.获取授权码code
从第三方应用跳转至Creator的授权页面，并传入相应参数。例如：

```
https://cn.steedos.com/oauth2/?response_type=code&client_id=hP9ZbuFJajynA847n&
redirect_uri=http://127.0.0.1:3099/api/steedos_oauth2&scope=email&state=123456
```
 - 参数说明
   - response_type：默认是code
   - client_id：自动生成的客户端ID
   - redirect_uri：用于接收授权码的URL，需和配置的URL保持一致
   - scope：返回信息
   - state：状态验证

#### 2.返回授权码链接
授权页面校验参数后，生成授权码，并返回给redirect_uri。例如：
```
https://cn.xxx.com/?code=WTReatHCQ5Y6ujnGh&state=123456
```

#### 3.获取access_token
第三方应用根据返回的授权码链接，获取到授权码code，并使用post调用token接口，并传入相应参数获取token。相应信息如下：

获取token接口URL：https://cn.steedos.com/oauth2/token/

参数： 
{ 
  grant_type: 'authorization_code', 
  client_id: '第三方应用的客户端ID', 
  client_secret: '第三方应用的Secret', 
  code: '获取的授权码' 
} 

#### 4.根据access_token获取当前用户
Creator校验code通过后，将返回access_token。开发人员根据返回的access_token，并使用get调用getIdentity接口，并传入相应参数。相应信息如下：

获取用户信息getIdentity接口URL：https://cn.steedos.com/oauth2/getIdentity/

参数：
{
  access_token: '返回的access_token'
}

调用成功后，Creator会将当前的用户信息返回。

=========================================

## 样例
这是一个Meteor应用,示范了从OAuth认证的过程。
https://github.com/prime-8-consulting/meteor-oauth2/tree/master/examples

认真检查这个应用的所有样例，你可以了解到更多认证的过程。
