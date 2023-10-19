微服务软件包
===

可以使用微服务方式扩展化验魔方。

## 启动服务

```sh
yarn start:services
```

启动服务之后，为华炎魔方服务扩展了以下API

- hello, 获取当前登录用户: http://127.0.0.1:5000/service/api/example-service/hello/jack
- me, 获取当前登录用户: http://127.0.0.1:5000/service/api/example-service/me

## 参考

- [Moleculer Nodejs](https://moleculer.services/zh/)