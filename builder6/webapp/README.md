# Steedos WebApp

Steedos WebApp 是一个基于 React 的 Web 应用程序，用于展示和管理 Steedos 应用程序的数据。替代了 Steedos 2.x 中的 Meteor Clint。

## 开发

```bash
yarn
yarn dev
```

## 构建

构建后会生成 dist 文件夹，@steedos/server 启动时会默认加载此文件夹，并将所有非API路由重定位到此 App。

```bash 
yarn build
```
