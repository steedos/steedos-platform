---
title: 认证
---

每当用户想要访问受保护的路由或资源时，通常使用Authorization header。header的内容应如下所示：
`Authorization: Bearer <token>`
token是用户登陆后在前端设置的cookie里的`X-Auth-Token`或者是local storage中的`Meteor.loginToken`
