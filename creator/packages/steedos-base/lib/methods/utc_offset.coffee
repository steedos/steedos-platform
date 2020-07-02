# if Meteor.isServer

#         Meteor.methods
#                 updateUserUtcOffset: (utcOffset) ->
#                         if not @userId?
#                                 return

#                         db.users.update({_id: @userId}, {$set: {utcOffset: utcOffset}})  


# if Meteor.isClient
#         Meteor.startup ->
#                 Tracker.autorun (c)->
#                         user = Meteor.user()
#                         # 系统启动时，可能取不到 user.utcOffset 字段
#                         if user and user.utcOffset
#                                 utcOffset = moment().utcOffset() / 60
#                                 if user.utcOffset isnt utcOffset
#                                         Meteor.call 'updateUserUtcOffset', utcOffset, (e,r)->
#                                                 c.stop()

# 维护utcOffset字段的逻辑迁移至/api/v4/users/validate接口，当前台调用此接口时传入utcOffset