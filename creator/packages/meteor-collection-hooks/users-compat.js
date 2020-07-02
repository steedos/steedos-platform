/* global CollectionHooks Meteor Mongo */

if (Meteor.users) {
  // If Meteor.users has been instantiated, attempt to re-assign its prototype:
  CollectionHooks.reassignPrototype(Meteor.users)

  // Next, give it the hook aspects:
  var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection
  CollectionHooks.extendCollectionInstance(Meteor.users, Collection)
}
