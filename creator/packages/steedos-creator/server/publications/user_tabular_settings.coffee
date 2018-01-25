Meteor.publish "user_tabular_settings", (object_name)->
    userId = this.userId
    return Creator.Collections.settings.find({object_name: object_name, record_id: "object_listviews", owner: userId})
