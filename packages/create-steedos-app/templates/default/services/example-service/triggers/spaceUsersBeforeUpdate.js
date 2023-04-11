module.exports = {
  trigger: { objectName: 'space_users', when: ['before.update']},
  async handler(ctx) {
    this.broker.logger.warn('spaceUsersBeforeUpdate', ctx)
  }
}