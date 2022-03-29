# 华炎魔方模板项目

该项目是通过`steedos cli`命令行创建魔方项目时会自动生成的模板项目，比如执行`npx create-steedos-app my-app`会自动创建一个名为`my-app`的项目。

## 开发环境

我们推荐使用GitPod来在线开发华炎魔方项目，这样可以免去安装开发环境的繁琐过程，如果需要本地搭建开发环境可以参考以下Gitpod配置文件，它们分别描述了部署开发环境及启动华炎魔方项目的具体过程：

- [.gitpod.Dockerfile](.gitpod.Dockerfile)
- [.gitpod.yml](.gitpod.yml)

## 开发前准备

- **激活华炎魔方**：请参考该 [文档](https://www.steedos.cn/docs/deploy/deploy-activate)，注册华炎魔方门户账户，并准备好后续运行项目时激活华炎魔方依赖的两个环境变量。

- **注册GitPod账户**：如果没有 [Gitlab](https://gitlab.steedos.cn/) 账户，请注册并使用浏览器登录它们。

- **Fork项目**：请Fork本项目到本地，后续我们使用GitPod在线开发Fork后的项目的话就可以把开发后的代码提交到Git仓库。
也可以执行以下命令来创建一个新项目，然后把该项目提交到Git仓库，而不是Fork本项目来创建自己的魔方项目。```npx create-steedos-app my-app```

## 运行项目

只要在浏览器中输入地址 `https://vscode.steedos.cn/#{之前Fork下来的Git仓库地址}`即可使用 Gitpod 启动远程开发环境，远程开发环境已经安装并初始化好必须的组件，包括 nodejs, mongodb, redis, vscode 等。

比如访问地址 <https://vscode.steedos.cn/#https://github.com/steedos/steedos-project-template> 即可在线运行该Git仓库项目，可以把`#`号后面的Git仓库地址换成您希望运行的任何华炎魔方项目的Git仓库地址。

在浏览器中打开项目后，会自动执行`yarn`指令安装项目依赖项，并自动执行`yarn start`指令运行项目。

第一次运行项目时可以在控制台看到提示“请配置环境变量STEEDOS_CLOUD_SPACE_ID和STEEDOS_CLOUD_API_KEY”，但是我们也可以看到项目运行起来后自动打开了一个浏览器窗口访问运行好的华炎魔方，只是因为没有激活华炎魔方没有账户可以登录使用所以显示了激活华炎魔方的初始化界面。

请在云平台”管理控制台”应用的“我的魔方”中找到对应的私有部署记录，并在该初始化界面中输入点击私有部署记录详细界面右上角“复制激活参数”按钮复制的内容，其中已经包含了激活华炎魔方需要的两个环境变量，提交后会自动把相关环境变量值保存到`.env.local`文件并且页面会自动跳转到登录界面，使用私有部署的华炎魔方初始账户登录即可进入系统主界面了。

```
[metadata]
METADATA_SERVER=https://5000-rose-fowl-9ece4ams.ws-us25.gitpod.io
METADATA_APIKEY=#会自动填充为初始界面中输入的环境变量值

[steedos-cloud]
STEEDOS_CLOUD_SPACE_ID=#会自动填充为初始界面中输入的环境变量值
STEEDOS_CLOUD_API_KEY=#会自动填充为初始界面中输入的环境变量值
```

其中METADATA_SERVER 和 METADATA_APIKEY这两个环境变量是用于同步元数据，详细请参考文档 [同步元数据](https://beta.steedos.cn/docs/developer/getting-started#%E5%90%8C%E6%AD%A5%E5%85%83%E6%95%B0%E6%8D%AE)。

## 开发项目

- **零代码开发**：可以参考文档 [如何创建自定义应用程序？](https://www.steedos.cn/docs/admin/create_object) 在界面上开发业务需求，开发完成后可以参考 [同步元数据](https://www.steedos.cn/docs/developer/getting-started#%E5%90%8C%E6%AD%A5%E5%85%83%E6%95%B0%E6%8D%AE) 把代码同步到 GitPod 本地，然后本地代码可以提交到 Git仓库中。

- **低代码开发**：可以参考文档 [开发人员快速向导](https://www.steedos.cn/docs/developer/getting-started) 在GitPod中在线写代码来开发业务需求。

## 软件包

项目开发完成后，可以发布为软件包，发布后的软件包可以直接安装到测试环境或生产环境中直接使用，还可以在华炎魔方应用市场中定价售卖发布后的软件包，详细请参考教程 [软件包发布与安装](https://www.steedos.cn/docs/developer/package)。

## 目录说明

- **.steedos**：该文件夹是一个独立的npm项目，在该项目中可以定义要在华炎魔方项目中引用哪些软件包。
这里定义的软件包都可以在“设置”应用的“应用程序->软件包”界面上看到，且在界面上手动安装的软件包会回写到该文件夹的相关配置文件中。
更多详情请参考文档：[软件包发布与安装](https://www.steedos.cn/docs/developer/package)。

  - **.steedos/package.json**：这是npm项目的配置文件，可以在`dependencies`中定义要安装哪些软件包到本地。

  - **.steedos/steedos-packages.yml**：在该文件中可以配置当前华炎魔方项目要引用哪些软件包，包括之前在`package.json`文件依赖项中定义的软件包也需要在这里引用才能生效。
  每个软件包可以定义的属性说明如下：

    ```yml
    '@steedos-labs/oa': # 软件包名称
      enable: true #是否启用该软件包
      version: 2.1.20 # 软件包版本号
      description: '' # 软件包备注
      local: false # 是否是本地项目下的软件包，只要不是安装到`.steedos/node_modules`文件夹下的软件包都应该设置为true
      path: .steedos/node_modules/@steedos-labs/oa #软件包所在文件目录，所有软件包都必须在这里填写软件包所在硬盘目录
    ```

- **.vscode**：该文件夹中保存的是vscode编辑器的配置文件，其中setting.json文件中定义了低代码开发时，编写yaml配置文件需要符合的schemas规范。

- **jsreport-app**：这是一个独立的 [JsReport](https://jsreport.net/) 项目，用于设计各种报表。详情请参考 [JsReport报表开发向导](https://www.steedos.cn/docs/developer/jsreport)。

- **node-red-app**：这是一个独立的 [Node-Red](https://nodered.org/) 项目，可以通过可视化开发方式，连接SAP、用友、金蝶等主流业务系统及各种数据库，实现各种集成业务需求。详情请参考 [与现有业务系统整合](https://www.steedos.cn/docs/developer/node-red)。

- **services**：该文件夹内存放的是华炎魔方微服务相关配置文件，目前内置三个微服务，另外每个软件包都要求以微服务形式加入到华炎魔方。

- **steedos-app**：这是每个魔方项目内置的默认软件包文件夹，华炎魔方启动时会自动加载每个软件包中的元数据和相关代码。
使用华炎魔方 DX 工具同步元数据时，默认同步到此文件夹中，详情请参考 [同步元数据](https://www.steedos.cn/docs/developer/getting-started#%E5%90%8C%E6%AD%A5%E5%85%83%E6%95%B0%E6%8D%AE)。

- **steedos-packages**：当项目需要分包管理时，可以把各个软件包文件夹存放到该文件夹中，软件包开发完成后可以发布到NPM仓库中，也可以发布到华炎魔方应用市场售卖。
如果需要，也可以把第三方软件包复制到此文件夹中，华炎魔方启动时会自动加载其中每个软件包的元数据及相关代码。

- **storage**：这是魔方项目存放附件到本地时，附件文件所在文件夹，您也可以选择把附件存入云服务，这样的话，该文件夹就始终是空的。

- **moleculer.config.js**：使用moleculer运行服务时的配置文件。

- **.env**：环境变量配置文件，可以配置端口、URL 等环境变量，与`.env.local`文件的主要区别是该文件可以提交到git仓库中。

- **.env.local**：环境变量配置文件，用于保存本地环境的配置，会覆盖`.env`文件中的配置。
该文件中可以存放密钥等敏感信息，已加入到`.gitignore`文件清单，不会提交到git仓库中。

- **steedos-config.yml**：华炎魔方配置文件，详情请参考文档 [环境变量、系统参数配置向导](https://www.steedos.cn/docs/deploy/steedos-config)。

- **package.json**：华炎魔方项目是一个标准的NPM项目，该文件用于配置项目依赖的 npm 包。
如果需要升级魔方平台内核版本，也是修改此文件，详情请参考文档 [升级已有老版本项目](https://www.steedos.cn/docs/deploy/upgrade)。
