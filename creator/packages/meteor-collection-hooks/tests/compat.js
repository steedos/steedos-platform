/* global Tinytest Meteor Mongo InsecureLogin */
/* eslint-disable no-new */

Tinytest.add('compat - legacy "new Meteor.Collection" should not throw an exception', function (test) {
  try {
    new Meteor.Collection(null)
    test.ok()
  } catch (e) {
    test.fail(e.message)
  }
})

Tinytest.add('compat - "new Mongo.Collection" should not throw an exception', function (test) {
  try {
    new Mongo.Collection(null)
    test.ok()
  } catch (e) {
    test.fail(e.message)
  }
})

Tinytest.addAsync('compat - hooks should work for "new Meteor.Collection"', function (test, next) {
  simpleCountTest(new Meteor.Collection(null), test, next)
})

Tinytest.addAsync('compat - hooks should work for "new Mongo.Collection"', function (test, next) {
  simpleCountTest(new Mongo.Collection(null), test, next)
})

function simpleCountTest (collection, test, next) {
  collection.allow({
    insert: function () { return true },
    update: function () { return true },
    remove: function () { return true }
  })

  var counts = {
    before: {
      insert: 0,
      update: 0,
      remove: 0
    },
    after: {
      insert: 0,
      update: 0,
      remove: 0
    }
  }

  collection.before.insert(function (userId, doc) { counts.before.insert++ })
  collection.before.update(function (userId, doc) { counts.before.update++ })
  collection.before.remove(function (userId, doc) { counts.before.remove++ })

  collection.after.insert(function (userId, doc) { counts.after.insert++ })
  collection.after.update(function (userId, doc) { counts.after.update++ })
  collection.after.remove(function (userId, doc) { counts.after.remove++ })

  InsecureLogin.ready(function () {
    collection.insert({_id: '1', start_value: true}, function (err, id) {
      if (err) throw err
      collection.update({_id: id}, {$set: {update_value: true}}, function (err) {
        if (err) throw err
        collection.remove({_id: id}, function (nil) {
          test.equal(counts.before.insert, 1, 'before insert should have 1 count')
          test.equal(counts.before.update, 1, 'before update should have 1 count')
          test.equal(counts.before.remove, 1, 'before remove should have 1 count')
          test.equal(counts.after.insert, 1, 'after insert should have 1 count')
          test.equal(counts.after.update, 1, 'after update should have 1 count')
          test.equal(counts.after.remove, 1, 'after remove should have 1 count')
          next()
        })
      })
    })
  })
}
