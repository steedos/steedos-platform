# Creator内核Meteor包简介

这里每个文件夹都是一个标准的Meteor包。

## autoupdate

我们本地化了名为 [autoupdate](https://github.com/meteor/meteor/tree/master/packages/autoupdate) 的Meteor内核包，用于客户端自动更新脚本代码。

## boilerplate-generator

meteor 模板生成器

## check-npm-versions

我们本地化了名为 [check-npm-versions](https://github.com/Meteor-Community-Packages/check-npm-versions) 的Meteor包，强制应用中预安装指定版本的npm包，这样就可以在Meteor代码中使用这些npm包。

如果你正在编写一个Meteor包，它依赖了一些npm包，使用该包就可以强制这些依赖包的正确版本已预先安装到项目中。

## coffeescript-compiler

使用该包可以允许在Meteor项目中编写coffeescript代码。

## dynamic-import

使用该包可以允许在Meteor项目中编写`module.dynamicImport`语句来动态加载依赖模块。

## francocatena-status

我们本地化了名为 [francocatena-status](https://atmospherejs.com/francocatena/status) 的Meteor包，用于在界面上显示与服务端连接状态。

## meteor-autoform-5.8.0

我们本地化了名为 [aldeed:autoform](https://atmospherejs.com/aldeed/autoform) 的Meteor包，这是一个在Meteor项目中可以根据字段类型自动生成表单UI的包。

这是华炎魔方上一代表单控件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新表单实现相关功能了。

> 要想在对象上使用新表单功能，需要把对象上的version属性配置为2，不配置的话默认还是使用上一代表单控件。

## meteor-collection-hooks

我们本地化了名为 [meteor-collection-hooks](https://github.com/Meteor-Community-Packages/meteor-collection-hooks) 的Meteor包，这是一个扩展了Mongo.Collection的包，有了它，就可以在Meteor项目中编写before/after hooks来实现触发器。

## meteor-moment

我们本地化了名为 [momentjs:moment](https://atmospherejs.com/momentjs/moment) 的Meteor包，有了它，就可以在Meteor中使用 [momentjs](https://github.com/moment/moment) 了。

## meteor-moment-timezone

我们本地化了名为 [momentjs:moment](https://github.com/acreeger/meteor-moment-timezone/) 的Meteor包，有了它，就可以在Meteor中使用 [moment timezone](https://momentjs.com/timezone/) 了。

## meteor-mrt-moment

我们本地化了名为 `mrt:moment` 的Meteor包，用于作废项目中引用的该包代码。

## meteor-selectize

这是实现下拉框UI控件的Meteor包。

这是华炎魔方上一代下拉框控件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## meteor-simple-json-routes

我们本地化了名为 [simple:json-routes](https://atmospherejs.com/simple/json-routes) 的Meteor包，有了它，就可以在Meteor项目中定义API路由。

## meteor-simple-schema-i18n

我们本地化了名为 [gwendall:simple-schema-i18n](https://atmospherejs.com/gwendall/simple-schema-i18n) 的Meteor包，使用它可以在Meteor项目中实现Schema国际化。

## meteor-slip

我们把名为 [slip](https://github.com/pornel/slip) 的npm包转换为Meteor包了以便在Meteor项目中可以使用该包相关功能，它可以用于在触摸屏上的列表中进行交互滑动和重新排序。

## meteor-tabular

我们本地化了名为 [aldeed:tabular](https://github.com/Meteor-Community-Packages/meteor-tabular) 的Meteor包，使用它可以在Meteor项目中以一种高效的方式显示响应式数据列表。

目前应该只有审批王应用在使用该包，其他地方均已换成 [Ag-Grid](https://github.com/ag-grid/ag-grid) 了。

## socket-stream-client

我们本地化了名为 [socket-stream-client](https://github.com/meteor/meteor/tree/devel/packages/socket-stream-client) 的Meteor内核包。

## steedos-api

该Meteor包中实现了一些供调用的华炎魔方内核功能API接口，比如审批王附件相关接口。

## steedos-api-authenticate-user

json router 的认证中间件

## steedos-app-chat

消息模块

## steedos-app-workflow

该包中实现了审批王应用中一些内核功能。

## steedos-application-package

已作废。软件包导入

## steedos-audit

已作废。

## steedos-autoform

该包实现了上一代华炎魔方各种字段类型对应的UI组件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## steedos-autoform-dx-date-box

该包实现了上一代华炎魔方日期以及日期时间字段类型对应的UI组件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## steedos-autoform-file

该包实现了上一代华炎魔方附件字段类型对应的UI组件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## steedos-autoform-filesize

该包实现了上一代华炎魔方附件字段类型对应的UI组件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## steedos-autoform-location

该包实现了上一代华炎魔方地理位置字段类型对应的UI组件。

## steedos-autoform-lookup

该包实现了上一代华炎魔方相关表，即lookup字段类型对应的UI组件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## steedos-autoform-markdown

该包实现了上一代华炎魔方markdown字段类型对应的UI组件，目前大部分表单已经升级为使用其他开源控件实现相关功能了。

## steedos-autoform-tags

该包实现了上一代华炎魔方tag字段类型对应的UI组件，目前大部分表单已经升级为使用 [Ant Design](https://ant.design/) 作为新控件库实现相关功能了。

## steedos-base

该包是上一代华炎魔方基础功能包。

## steedos-bootstrap

我们本地化了名为 [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap) 的Meteor包，有了它，就可以在Meteor中使用 [Bootstrap](https://getbootstrap.com/) 了。

## steedos-creator

这是我们基于 [Meteor](https://www.meteor.com/) 开发的上一代华炎魔方内核功能包，包括华炎魔方主UI界面以及各种内核业务功能的代码原来都是放在这里的。

最新版本的华炎魔方已经把包括前端UI组件和后端核心业务功能在内的大量功能用标准的 [npm](https://www.npmjs.com/) 工程重新开发了。

## steedos-creator-autoform-modals

我们本地化了名为 [yogiben:autoform-modals](https://github.com/yogiben/meteor-autoform-modals) 的Meteor包，使用它可以在Meteor项目中实现弹出Modal窗口。

这是上一代华炎魔方实现弹出窗口UI组件功能包，目前可能只有审批王应用在使用该包，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-devexpress

上一代华炎魔方使用了 [devexpress](https://js.devexpress.com/) 中大量UI组件，该包通过加载华炎魔方中用到的devexpress相关功能模块，以便在Meteor项目中可以调用它们。

## steedos-formbuilder

该包基于开源项目 [formBuilder](https://github.com/kevinchappell/formBuilder) 实现了审批王应用中的表单设计器。

## steedos-huaweipush

该包实现了华为手机APP推送消息相关功能。

## steedos-i18n

该包实现了在Meteor项目中使用国际化翻译相关功能。

## steedos-instance-record-queue

申请单、台账数据之间同步队列

## steedos-lightning-design-system

华炎魔方依赖了 [lightning-design-system](https://github.com/salesforce/design-system-react)，该包实现在Meteor项目中使用它们。

## steedos-logger

该包实现了上一代华炎魔方在浏览器上查看服务端日志的功能。

## steedos-mailqueue

该包实现服务端邮件队列相关功能，用于按队列次序依次发送邮件。

## steedos-meteor-fix

meteor mongo mongoOptions 初始化

## steedos-mini-web

已作废。

## steedos-oauth2-messenger

已作废。

## steedos-oauth2-server

Steedos OAuth2包，将Creator项目作为一个OAuth认证服务器。管理员通过配置第三方授权应用，可实现让第三方应用通过调用相关接口，申请授权登录。

## steedos-object-database

该包实现了上一代华炎魔方对象模型基础功能，新版相关功能已经迁移到 [模板项目](https://github.com/steedos/steedos-platform/tree/2.1/packages/standard-objects) 中了。

## steedos-object-webhooks-queue

该包实现服务端webhooks队列相关功能，用于按队列次序依次执行webhooks。

## steedos-objects

该包实现了上一代华炎魔方对象模型内核功能，新版相关功能已经迁移到 [模板项目](https://github.com/steedos/steedos-platform/tree/2.1/packages/standard-objects) 中了。

## steedos-objects-billing

作废。

## steedos-objects-core

该包中包含上一代华炎魔方部分上传附件相关业务逻辑，新版相关功能已经迁移到 [模板项目](https://github.com/steedos/steedos-platform/tree/2.1/packages/standard-objects) 中了。

## steedos-objects-to-yaml

该包用于把creator中的对象转为yaml格式内容，已作废。

## steedos-odata

上一代华炎魔方OData接口功能是在这个包中实现的。

## steedos-pay

已作废。

## steedos-post

已作废。

## steedos-qcloud-smsqueue

该包基于腾讯云实现了服务端待发送短信队列相关功能，用于按队列次序依次发送短信。

## steedos-smsqueue

该包基于阿里云实现了服务端待发送短信队列相关功能，用于按队列次序依次发送短信。

## steedos-theme

该包实现了上一代华炎魔方很多样式皮肤功能。

## steedos-users-import

该包实现了上一代华炎魔方用户导入功能，已作废，新版华炎魔方支持了统一的数据导入功能。

## steedos-webkit-notification

该包实现了华炎魔方桌面客户端消息推送功能。

## steedos-weixin

已作废。

## steedos-weixin-aes

已作废。

## steedos-weixin-template-message-queue

已作废。

## steedos-workflow

该包实现了审批王应用核心业务功能，包括前端UI和后端审批业务逻辑。

## steedos-workflow-chart

该包基于 [mermaid-js](https://github.com/mermaid-js/mermaid) 实现了审批王应该中查看流程图功能。

## tap-i18n

我们本地化了名为 [tap:i18n](https://github.com/TAPevents/tap-i18n) 的Meteor包，使用它可以在Meteor项目中实现国际化翻译相关功能。

