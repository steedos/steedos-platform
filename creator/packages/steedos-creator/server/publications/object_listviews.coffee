Meteor.publish "object_listviews", (object_name, spaceId)->
    userId = this.userId
    return Creator.getCollection("object_listviews").find({object_name: object_name, space: spaceId ,"$or":[{owner: userId}, {shared: true}]})