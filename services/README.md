# 华炎魔方微服务内核NPM包简介

这里每个文件夹都是一个标准的NPM包。

## service-accounts

以微服务方式获取用户相关信息，如`getUserSession`。

## service-api

提供微服务API接口，比如Graphql API、元数据对象action。

## service-charts

以微服务方式实现仪表盘报表中查询和图表相关功能，使用说明请参考文档 [仪表盘开发向导](https://www.steedos.cn/docs/developer/dashboard) 中查询和图表小节。

## service-cloud-init

环境初始化：工作区、账户、已购买软件包安装

## service-fields-indexs

以微服务方式实现为字段创建索引。

## service-metadata

以微服务方式实现元数据与缓存服务通信。

## service-metadata-apps

以微服务方式实现“应用”元数据与缓存服务通信。

## service-metadata-layouts

以微服务方式实现“页面布局”元数据与缓存服务通信。

## service-metadata-objects

以微服务方式实现“对象”元数据与缓存服务通信，包括对象之前相关表及主表子表关系、公式字段及其关系链，汇总字段及其关系链等。

## service-metadata-permissionsets

以微服务方式实现“简档”和“权限集”元数据与缓存服务通信。

## service-metadata-server

管理内核微服务之间的加载、依赖关系

## service-metadata-tabs

以微服务方式实现“选项卡”元数据与缓存服务通信，使用说明请参考文档 [选项卡](https://www.steedos.cn/docs/admin/create_object#%E9%80%89%E9%A1%B9%E5%8D%A1)。

## service-metadata-translations

以微服务方式实现国际化资源元数据与缓存服务通信。

## service-metadata-triggers

以微服务方式实现“对象触发器”元数据与缓存服务通信，使用说明请参考文档 [触发器](https://www.steedos.cn/docs/developer/getting-started#%E8%A7%A6%E5%8F%91%E5%99%A8)。

## service-meteor-package-loader

以微服务方式实现加载系统标准对象。
？

## service-mongodb-server

以微服务方式实现启动默认的mongodb数据库服务。
？

## service-node-red

以微服务方式实现启动Node-Rede服务，使用说明请参考文档 [与现有业务系统整合](https://www.steedos.cn/docs/developer/node-red)。
？

## service-package-loader

以微服务方式实现加载自定义对象。
？

## service-package-registry

以微服务方式实现加载软件包，使用说明请参考文档 [软件包发布与安装](https://beta.steedos.cn/docs/developer/package)。
？

## service-packages

以微服务方式提供软件包相关元数据操作，比如软件包安装、卸载时对缓存数据的操作。
？

## service-pages

以微服务方式实现仪表盘报表中查询和图表相关功能，使用说明请参考文档 [仪表盘开发向导](https://www.steedos.cn/docs/developer/dashboard) 中页面，即仪表盘小节。

## service-steedos-server

以微服务方式启动魔方服务。
？

## service-workflow

以微服务方式提供审批王应用相关功能，比如创建申请单。
？

## service-community

管理社区版相关依赖及服务

## service-enterprise

管理企业版相关依赖及服务