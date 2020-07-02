/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

var collection = new Collection('test_remove_allow_collection')

if (Meteor.isServer) {
  // full client-side access
  collection.allow({
    insert: function () { return true },
    update: function () { return true },
    remove: function (userId, doc) { return doc.allowed }
  })

  Meteor.methods({
    test_remove_allow_reset_collection: function () {
      collection.remove({})
    }
  })

  Meteor.publish('test_remove_allow_publish_collection', function () {
    return collection.find()
  })
}

if (Meteor.isClient) {
  Meteor.subscribe('test_remove_allow_publish_collection')

  Tinytest.addAsync('remove - only one of two collection documents should be allowed to be removed', function (test, next) {
    collection.before.remove(function (userId, doc) {
      test.equal(doc.start_value, true)
    })

    InsecureLogin.ready(function () {
      Meteor.call('test_remove_allow_reset_collection', function (nil, result) {
        function start (id1, id2) {
          collection.remove({_id: id1}, function (err1) {
            collection.remove({_id: id2}, function (err2) {
              test.equal(collection.find({start_value: true}).count(), 1, 'only one document should remain')
              next()
            })
          })
        }

        // Insert two documents
        collection.insert({start_value: true, allowed: true}, function (err1, id1) {
          collection.insert({start_value: true, allowed: false}, function (err2, id2) {
            start(id1, id2)
          })
        })
      })
    })
  })
}
