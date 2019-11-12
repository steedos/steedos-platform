---
title: steedos-config
---

## 配置文件

steedos-config.yml 用于配置系统参数，位于每个项目的根目录。

### 数据源

```yml
datasources:
  default:
    connection:
      url: mongodb://127.0.0.1/steedos

```

### 插件

配置当前项目中启用的插件。
> 请注意，在启用插件前，请确保插件源码通过 yarn add 的方式加入到项目中。

```yml
plugins:
  - "@steedos/app-contracts"
  - "@steedos/accounts"
```

### 登录界面配置

配置登录界面相关参数，例如是否允许注册、是否允许修改密码、是否允许创建企业。

```yml
tenant:
  _id:
  name: Steedos
  logo_url:
  background_url:
  enable_register: true
  enable_forget_password: true
  enable_create_tenant: true
```

### Web服务URL

```yml
services:
  steedos: /
```

### 文件存储

配置附件存储的相关参数。

附件可以保存在本地，也可以保存在阿里云或是AWS S3服务中。

```yml
public:
  cfs:
    storage: local
cfs:
  local:
    folder: /storage
  aliyun:
    region:
    internal: false,
    bucket:
    folder:
    accessKeyId:
    secretAccessKey:
  aws:
    region:
    bucket:
    folder:
    accessKeyId:
    secretAccessKey:
```

### 邮件配置

配置SMTP服务的相关参数，用于系统发送推送邮件。

```yml
email:
  host:
  port: 465
  username:
  password:
  secure: true
  from:
```

### 发送短信配置

配置手机短信服务，用于通过手机短信登录和接受账户提醒消息。

```yml
sms:
  twilio:
    FROM:
    ACCOUNT_SID:
    AUTH_TOKEN:
  qcloud:
    smsqueue_interval: 1000
    sdkappid:
    appkey:
    signname:
```

### 密码规则配置

配置密码的校验规则，例如最小长度，是否必须包含数字、大写字母、小写字母和字符。

```yml
password:
  minimum_length: 10
  lowercase: true
  number: true
  uppercase: true
  symbol: true
```
