module.exports =  {
  rest: { method: 'GET', path: '/graphql' },
  // 在微服务中查询数据库
  async handler(ctx) {
    return await this.broker.call('api.graphql', {
      query: `
        query {
          space_users(filters: ["user", "=", "${ctx.meta.user.userId}"]) {
            name
            organization__expand {
              name
            }
          }
        }
      `},
      // 如果查询 GraphQL 需要带上当前用户的权限，需要传入 user 属性。
      {
        user: ctx.meta.user
      }
    )
  },
}