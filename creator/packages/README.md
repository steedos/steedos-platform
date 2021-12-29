# Creator内核Meteor包简介

这里每个文件夹都是一个标准的Meteor包。

## autoupdate

我们本地化了名为 [autoupdate](https://github.com/meteor/meteor/tree/master/packages/autoupdate) 的Meteor内核包，用于客户端自动更新脚本代码。

## boilerplate-generator

?

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

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## meteor-collection-hooks

我们本地化了名为 [meteor-collection-hooks](https://github.com/Meteor-Community-Packages/meteor-collection-hooks) 的Meteor包，这是一个扩展了Mongo.Collection的包，有了它，就可以在Meteor项目中编写before/after hooks来实现触发器。

还在用？作废？

## meteor-moment

我们本地化了名为 [momentjs:moment](https://atmospherejs.com/momentjs/moment) 的Meteor包，有了它，就可以在Meteor中使用 [momentjs](https://github.com/moment/moment) 了。

## meteor-moment-timezone

我们本地化了名为 [momentjs:moment](https://github.com/acreeger/meteor-moment-timezone/) 的Meteor包，有了它，就可以在Meteor中使用 [moment timezone](https://momentjs.com/timezone/) 了。

## meteor-mrt-moment

我们本地化了名为 `mrt:moment` 的Meteor包，用于作废项目中引用的该包代码。

## meteor-selectize

这是实现下拉框UI控件的Meteor包。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

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

？

## steedos-app-chat

？还有用？作废？

## steedos-app-tableau

该包使用 [aldeed:tabular](https://github.com/Meteor-Community-Packages/meteor-tabular) 实现了审批王应用中一些列表界面。

## steedos-app-workflow

该包中实现了审批王应用中一些内核功能。

## steedos-application-package

作废？？？老版本软件包？

## steedos-audit

作废？？审计功能都迁移到standard-objects中了？

## steedos-autoform

该包实现了上一代各种字段类型对应的UI组件。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-autoform-dx-date-box

该包实现了上一代日期以及日期时间字段类型对应的UI组件。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-autoform-file

该包实现了上一代附件字段类型相关功能。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-autoform-filesize

该包实现了上一代附件字段类型相关功能。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-autoform-location

该包实现了上一代地理位置字段类型相关功能。

已作废。

## steedos-autoform-lookup

该包实现了上一代相关表，即lookup字段类型相关功能。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-autoform-markdown

该包实现了上一代markdown字段类型相关功能。

已作废，相关功能已经用其他开源控件替换了。

## steedos-autoform-tags

该包实现了上一代tag字段类型相关功能。

已作废，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-base

该包是上一代华炎魔方基础功能包。

已作废？？？？

## steedos-bootstrap

我们本地化了名为 [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap) 的Meteor包，有了它，就可以在Meteor中使用 [Bootstrap](https://getbootstrap.com/) 了。

已作废？？？？

## steedos-creator

这是我们基于 [Meteor](https://www.meteor.com/) 开发的上一代华炎魔方内核功能包，包括华炎魔方主UI界面以及各种内核业务功能的代码原来都是放在这里的。

最新版本的华炎魔方已经把包括前端UI组件和后端核心业务功能在内的大量功能用标准的 [npm](https://www.npmjs.com/) 工程重新开发了。

## steedos-creator-autoform-modals

我们本地化了名为 [yogiben:autoform-modals](https://github.com/yogiben/meteor-autoform-modals) 的Meteor包，使用它可以在Meteor项目中实现弹出Modal窗口。

目前可能只有审批王应用在使用该包，相关功能已经用 [Ant Design](https://ant.design/) 替换了。

## steedos-devexpress

上一代华炎魔方使用了 [devexpress](https://js.devexpress.com/) 中大量UI组件，该包通过加载华炎魔方中用到的devexpress相关功能模块，以便在Meteor项目中可以调用它们。

## steedos-formbuilder

该包基于开源项目 [formBuilder](https://github.com/kevinchappell/formBuilder) 实现了审批王应用中的表单设计器。

## steedos-huaweipush

还在用？作废？？

## steedos-i18n

还在用？作废？？

## steedos-instance-record-queue

还在用？作废？？

## steedos-lightning-design-system

华炎魔方依赖了 [lightning-design-system](https://github.com/salesforce/design-system-react)，该包实现在Meteor项目中使用它们。

看起来作废了？

## steedos-logger

还在用？作废？？

## steedos-mailqueue

该包实现服务端邮件队列相关功能，用于按队列次序依次发送邮件。

## steedos-meteor-fix

？？







## accounts

基于开源项目 https://github.com/accounts-js/accounts 开发的华炎魔方登录账户相关的服务端功能。

## auth

解析、验证接口中用户认证信息、缓存登录用户基本信息，提供获取当前登录用户信息，即`UserSession`相关的内核函数。

## cli

steedos-cli相关功能都是在该npm包中实现的，华炎魔方DX，即用于同步代码的Visual Studio Code 插件依赖了该包中相关功能。

## clinet

?迁移到app-builder中了？还有用吗？

## community

？

## core

华炎魔方内核功能包，该包中实现了元数据、元数据国际化资源、插件、Creator等内核功能的初始化，还有OData接口，Bootstrap接口等内核功能也是在该包中实现的。

?请包老师帮check补充下？

## create-steedos-app

该包中实现了 `npx create-steedos-app` 相关命令行功能，用于创建一个华炎魔方项目，创建出来的是一个模板项目，而不是空的魔方项目，华炎魔方模板项目说明请参考文档 [华炎魔方模板项目](https://github.com/steedos/steedos-platform/blob/2.1/steedos-projects/project-template/README.md)。

## create-steedos-node-red-app

该包中实现了 `npx create-steedos-node-red-app` 相关命令行功能，用于创建一个Node-Red项目，使用说明请参考文档 [与现有业务系统整合](https://www.steedos.cn/docs/developer/node-red)。

## data-import

该包中实现了数据导入相关服务端接口功能，使用说明请参考文档 [如何导入对象数据](https://www.steedos.cn/docs/admin/import)。

## design-system-react

该包把开源前端组件包`design-system-react`本地化了。

## filters

该包实现了华炎魔方数组格式的过滤条件规范，可以把数组格式的过滤条件转换为OData字符串格式的过滤条件，它适用于华炎魔方ObjectQL,GrqphQL等需要过滤数据的地方，使用方法请参考文档 [ObjectQL服务端语法说明](https://www.steedos.cn/docs/developer/objectql)，[GraphQL API 向导](https://www.steedos.cn/docs/developer/graphql-api)，。

## formula

该包把开源公式引擎包 [formulon](https://github.com/leifg/formulon) 本地化了，用于增加自己一些适用于华炎魔方的公式功能，使用说明请参考文档 [通过公式计算字段值](https://www.steedos.cn/docs/admin/field_type#%E9%80%9A%E8%BF%87%E5%85%AC%E5%BC%8F%E8%AE%A1%E7%AE%97%E5%AD%97%E6%AE%B5%E5%80%BC)，[公式运算符和函数](https://www.steedos.cn/docs/admin/functions)。

内核包`@steedos/objectql`是基于该包实现公式字段、验证规则等与公式引擎相关功能的。

## i18n

该包实现了元数据国际化相关内核功能，`@steedos/core`包中初始化元数据国际化资源时也依赖了该包中提供的相关内核函数。

## metadata-api

该包实现了元数据同步API相关功能。

？更多说明？

## metadata-core

该包是元数据同步功能内核包，其内实现了元数据同步相关内核功能。

？更多说明？

## meteor-bundle-dependencies

该包中定义了华炎魔方运行时依赖的 [meteor](https://www.meteor.com/) 相关包。

？更多说明？

## meteor-bundle-runner

？更多说明？

## migrate

？更多说明？作废？

## mongodb-bi-connector

？更多说明？作废？

## node-red-app-template

该包是运行`npx create-steedos-node-red-app`命令时创建的Node-Red项目的模板。

？没错吧？

## objectql

该包是华炎魔方实现对象模型相关功能的内核包，包括对象数据的增删改查、各种元数据注册及动态加载、公式运算、工作流规则、GraphQL接口、连接MongoDB、My SQL等各种数据库驱动等功能都是在该包中实现的，使用说明请参考文档 [ObjectQL服务端语法说明](https://www.steedos.cn/docs/developer/objectql)。

？更多说明？

## plugin-enterprise

企业版华炎魔方才能使用的插件包，内含放开分部级权限相关功能的配置文件，现在已经作为所有魔方项目都默认加载的免费插件了。

## process

该包实现了批准过程相关功能，使用说明请参考文档 [批准过程](https://www.steedos.cn/docs/admin/auto_process#%E6%89%B9%E5%87%86%E8%BF%87%E7%A8%8B)。

## react

该包是华炎魔方上一代前端React组件库。

## schemas

使用低代码模式在yml文件中定义元数据时，需要有相关规范和编写时的帮助提示，所有的元数据的规范和提示都是在这个包中定义的。

需要在魔方项目的`.vscode/settings.json`文件中的`yaml.schemas`小节引用该包中的相关`schemas.json`文件才能生效，华炎魔方模板项目中已经默认正确配置过了，您不需要手动配置它们。

## standard-objects

该包中定义了内核标准对象及其业务代码。

## steedos-oauth2-messenger

还在用？

## steedos-plugin-dingtalk

该包实现了把华炎魔方集成到钉钉，以便在钉钉客户端中使用华炎魔方，使用说明请参考文档 [钉钉集成](https://www.steedos.cn/docs/admin/integration#%E9%92%89%E9%92%89%E9%9B%86%E6%88%90)

## steedos-plugin-qywx

该包实现了把华炎魔方集成到企业微信，以便在企业微信客户端中使用华炎魔方，使用说明请参考文档 [企业微信集成](https://www.steedos.cn/docs/admin/integration#%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E9%9B%86%E6%88%90)

## steedos-plugin-schema-builder

该包实现了展示对象关系图功能。

## tailwind

该包把开源前端css包`tailwind`本地化了。

## webapp

该包实现了华炎魔方账户登录、注册、忘记密码等相关功能的前端UI界面。

## workflow

该包实现了审批王应用的流程设计器相关功能。
？应该没错吧？