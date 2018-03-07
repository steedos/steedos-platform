Meteor.publish "object_listviews", (object_name)->
    userId = this.userId
    return Creator.getCollection("object_listviews").find(object_name: object_name, owner: userId)