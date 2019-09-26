if (!db.deleted_instances) {
  db.deleted_instances = new Meteor.Collection('deleted_instances');
}