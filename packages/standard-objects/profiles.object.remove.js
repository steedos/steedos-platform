Meteor.publish("profiles", function (spaceId) {
  var userId = this.userId
  if (!userId)
      throw new Meteor.Error("401", "Authentication is required and has not been provided.")

  if (db.space_users.findOne({ user: userId, space: spaceId })) {
      return Creator.Collections["profiles"].find({ space: spaceId }, { fields: { _id: 1, space: 1, name: 1, code: 1 } })
  }
  return [];
});