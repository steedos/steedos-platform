const graphqlQuerySpaceUsers = require('./api/graphqlQuerySpaceUsers');
const objectqlQuerySpaceUsers = require('./api/objectqlQuerySpaceUsers');

const spaceUsersBeforeUpdate = require('./triggers/spaceUsersBeforeUpdate');

module.exports = {
  name: "example-service",

  actions: {
    hello: {
      // 使用微服务方式定义 API 接口。
      // 访问地址： GET /service/api/example-service/hello/:name
      rest: { method: 'GET', path: '/hello/:name' },
      handler(ctx) {
        return {
          data: 'Welcome ' + ctx.params.name
        }
      }
    },
    me: {
      rest: { method: 'GET', path: '/me' },
      // 在微服务中获取当前登录的用户信息
      async handler(ctx) {
        return ctx.meta.user
      }
    },
    graphqlQuerySpaceUsers,
    objectqlQuerySpaceUsers,
    spaceUsersBeforeUpdate
  }
}