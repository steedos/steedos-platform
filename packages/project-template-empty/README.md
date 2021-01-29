# 华炎魔方项目快速向导

本项目基于华炎魔方低代码引擎，可以通过配置化的方式快速开发企业应用程序。

## 运行项目

本项目是一个标准的nodejs项目，运行前需要安装依赖包。

```
yarn
yarn start
```

> 如果你安装依赖包遇到问题，可以从华炎魔方官网[下载快速安装版](https://www.steedos.com/help/deploy/)，已经预装了所有的依赖包。

## 数据库

华炎魔方使用 mongodb 4.2+ 数据库，可以通过配置 MONGO_URL 环境变量，指定数据库连接。

## 附件

华炎魔方中上传的附件默认保存在本项目的 storage 文件夹中。也可以通过修改 steedos-config 更改保存路径，或是保存到阿里云或S3存储中。

## 关于元数据

元数据是华炎魔方技术架构的核心。华炎魔方使用元数据定义对象，字段，配置，代码，逻辑和页面布局，并基于这些元数据自动生成系统的数据结构以及Steedos应用程序的用户界面和自动化逻辑。

元数据可以导入到华炎魔方中，可以在可视化界面中进行修改，也可以通过Steedos DX工具与代码同步。具体请参考[开发文档](https://www.steedos.com/developer)。

## 项目目录

```sh
[steedos-project]
├── steedos-app/main/default
│   ├── applications
│   │   └── custom-app.app.yml
│   └── objects
│       └── custom-object
│           ├── buttons
│           │   └── custom-button.button.yml
│           │   └── custom-button.button.js
│           ├── fields
│           │   └── name.field.yml
│           │   └── custom-field.field.yml
│           │   └── ...
│           ├── listviews
│           │   └── all.listview.yml
│           │   └── recent.listview.yml
│           │   └── custom_listview.listview.yml
│           ├── permissions
│           │   └── user.permission.yml
│           │   └── admin.permission.yml
│           │   └── custom_permission.permission.yml
│           └── custom-object.object.yml
│           └──...
├── steedos-packages
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
├── steedos-config.yml
└── yarn.lock
```

- public: 此文件夹用于保存静态资源文件，服务启动是会自动加载。
- steedos-app: 用于保存项目元数据和源码，华炎魔方启动是会自动加载其中的元数据。使用华炎魔方DX工具同步元数据时，默认同步到此文件夹中。
- steedos-packages: 当你的项目需要分包管理时，可以使用此文件夹。你也可以把第三方软件包复制到此文件夹中，华炎魔方启动时会自动加载其中的元数据。
- .env: 环境变量配置文件，可以配置端口、URL等环境变量。
- .env.local: 可以手工创建此文件，用于保存本地开发环境的配置。此文件不会上传到GitHub中。
- steedos-config.yml: 华炎魔方配置文件，具体参考 (官方文档)[https://www.steedos.com/help/deploy/steedos-config]。
- package.json: 用于配置本项目依赖的npm包。如果需要升级 steedos 内核版本，也是修改此文件。

## 了解更多

- [视频](https://www.steedos.com/videos/)
- [安装部署](https://www.steedos.com/help/deploy/)
- [设置与维护华炎魔方](https://www.steedos.com/help/admin)
- [开发文档](https://www.steedos.com/developer)
- [华炎魔方平台源码](https://github.com/steedos/steedos-platform/)
