Meteor.publish "user_tabular_settings", (object_name)->
    userId = this.userId
    return Creator.Collections.settings.find({object_name: {$in: object_name}, record_id: {$in: ["object_listviews", "object_gridviews"]}, owner: userId})
