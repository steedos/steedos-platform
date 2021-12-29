# 华炎魔方内核NPM包简介

这里每个文件夹都是一个标准的NPM包。

## accounts

基于开源项目 https://github.com/accounts-js/accounts 开发的华炎魔方登录账户相关的服务端功能。

## auth

解析、验证接口中用户认证信息、缓存登录用户基本信息，提供获取当前登录用户信息，即`UserSession`相关的内核函数。

## cli

steedos-cli相关功能都是在该npm包中实现的，华炎魔方DX，即用于同步代码的Visual Studio Code 插件依赖了该包中相关功能。

## clinet

此包用于创建客户端连接，方便对数据执行数据库操作

## community
应该没用了，可以删除

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

该包中定义了华炎魔方[meteor](https://www.meteor.com/) 运行时

## migrate

？更多说明？作废？

## mongodb-bi-connector

将系统对象转换为mongodb bi schema ，允许用户使用SQL创建查询，并使用Tableau， MicroStrategy和 Qlik等现有的关系商业智能工具可视化，图形化和报告其MongoDB数据。[MongoDB BI Connector](https://www.mongodb.com/zh-cn/products/bi-connector)

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
