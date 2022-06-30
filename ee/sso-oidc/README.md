<!--
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 17:03:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-29 15:45:29
 * @Description: 
-->
## 单点登录服务

需要配置以下环境变量
```
SSO_OIDC_CONFIG_URL= 必填
SSO_OIDC_CLIENT_ID= 必填
SSO_OIDC_CLIENT_SECRET= 必填
SSO_OIDC_REQUIRE_LOCAL_ACCOUNT= 是否需要本地账户. 选填, 默认值false.
SSO_OIDC_NAME= 选填,默认Steedos
SSO_OIDC_LOGO= 选填,默认/images/logo.png
```


sso接口:

- `POST /api/global/auth/oidc/login`
- body
```
{
    accessToken: oidc accessToken
}
```