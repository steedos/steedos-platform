# 华炎魔方企业版项目模板

在平台源码根目录启动服务时，默认启动的是与该项目文件夹同级目录下的华炎魔方社区版模板项目，对应的，该项目是用于在源码中运行企业版项目调式华炎魔方源码。

## 目录说明

### .steedos

该文件夹是一个独立的npm项目，在该项目中可以定义要在华炎魔方项目中引用哪些软件包。
这里定义的软件包都可以在“设置”应用的“应用程序->软件包”界面上看到，且在界面上手动安装的软件包会回写到该文件夹的相关配置文件中。

更多详情请参考文档：[软件包发布与安装](https://www.steedos.cn/docs/developer/package)。

#### .steedos/package.json

这是npm项目的配置文件，可以在`dependencies`中定义要安装哪些软件包到本地。

#### .steedos/steedos-packages.yml

在该文件中可以配置当前华炎魔方项目要引用哪些软件包，包括之前在`package.json`文件依赖项中定义的软件包也需要在这里引用才能生效。
每个软件包可以定义的属性说明如下：

```yml
'@steedos-labs/oa': # 软件包名称
  enable: true #是否启用该软件包
  version: 2.1.20 # 软件包版本号
  description: '' # 软件包备注
  local: false # 是否是本地项目下的软件包，只要不是安装到`.steedos/node_modules`文件夹下的软件包都应该设置为true
  path: .steedos/node_modules/@steedos-labs/oa #软件包所在文件目录，所有软件包都必须在这里填写软件包所在硬盘目录
```

### .vscode

该文件夹中保存的是vscode编辑器的配置文件，其中setting.json文件中定义了低代码开发时，编写yaml配置文件需要符合的schemas规范。

### jsreport-app

这是一个独立的 [JsReport](https://jsreport.net/) 项目，用于设计各种报表。详情请参考 [JsReport报表开发向导](https://www.steedos.cn/docs/developer/jsreport)。

### node-red-app

这是一个独立的 [Node-Red](https://nodered.org/) 项目，可以通过可视化开发方式，连接SAP、用友、金蝶等主流业务系统及各种数据库，实现各种集成业务需求。详情请参考 [与现有业务系统整合](https://www.steedos.cn/docs/developer/node-red)。

### services

该文件夹内存放的是华炎魔方微服务相关配置文件，目前内置三个微服务，另外每个软件包都要求以微服务形式加入到华炎魔方。

### steedos-app

这是每个魔方项目内置的默认软件包文件夹，华炎魔方启动时会自动加载每个软件包中的元数据和相关代码。
使用华炎魔方 DX 工具同步元数据时，默认同步到此文件夹中，详情请参考 [同步元数据](https://www.steedos.cn/docs/developer/getting-started#%E5%90%8C%E6%AD%A5%E5%85%83%E6%95%B0%E6%8D%AE)。

### steedos-packages

当项目需要分包管理时，可以把各个软件包文件夹存放到该文件夹中，软件包开发完成后可以发布到NPM仓库中，也可以发布到华炎魔方应用市场售卖。
如果需要，也可以把第三方软件包复制到此文件夹中，华炎魔方启动时会自动加载其中每个软件包的元数据及相关代码。

### storage

这是魔方项目存放附件到本地时，附件文件所在文件夹，您也可以选择把附件存入云服务，这样的话，该文件夹就始终是空的。

### moleculer.config.js

使用moleculer运行服务时的配置文件。

### .env

环境变量配置文件，可以配置端口、URL 等环境变量，与`.env.local`文件的主要区别是该文件可以提交到git仓库中。

### .env.local

环境变量配置文件，用于保存本地环境的配置，会覆盖`.env`文件中的配置。
该文件中可以存放密钥等敏感信息，已加入到`.gitignore`文件清单，不会提交到git仓库中。

### steedos-config.yml

华炎魔方配置文件，详情请参考文档 [环境变量、系统参数配置向导](https://www.steedos.cn/docs/deploy/steedos-config)。

### package.json

华炎魔方项目是一个标准的NPM项目，该文件用于配置项目依赖的 npm 包。
如果需要升级魔方平台内核版本，也是修改此文件，详情请参考文档 [升级已有老版本项目](https://www.steedos.cn/docs/deploy/upgrade)。
