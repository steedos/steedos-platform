db.users_changelogs = new Meteor.Collection('users_changelogs')

db.users_changelogs._simpleSchema = new SimpleSchema
  # 日期，记录事件发生的时间，格式：YYYYMMDD
  change_date:
    type: Date
  # 操作者
  operator:
    type: String
  # 工作区
  space:
    type: String
  # add（增加）delete（删除）enable（启用）disable（停用）
  operation:
    type: String
  # 对象，user_id
  user:
    type: String
  # 工作区中启用的用户数
  user_count:
    type: Number
  # 创建时间
  created:
    type: Date
  # 创建人
  created_by:
    type: String


if Meteor.isServer
  db.users_changelogs.before.insert (userId, doc) ->
    doc.change_date = moment().format('YYYYMMDD');
    doc.created = new Date();
    doc.created_by = userId;

