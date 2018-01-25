Meteor.publish "object_listviews", (object_name)->
    userId = this.userId
    return Creator.Collections.object_listviews.find(object_name: object_name, owner: userId)