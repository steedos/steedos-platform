module.exports = {
  rest: { method: 'GET', path: '/objectql' },
  async handler(ctx) {
    return await this.broker.call(
      'objectql.find', 
      {
        objectName: 'space_users',
        query: {
          filters: ['user', '=', ctx.meta.user.userId]
        },
      },
      // 如果查询需要带上当前用户的权限，需要传入 user 属性。
      {
        user: ctx.meta.user
      }
    );
  }
}