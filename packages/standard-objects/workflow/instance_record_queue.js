if (!db.instance_record_queue) {
    db.instance_record_queue = new Meteor.Collection('instance_record_queue')
}