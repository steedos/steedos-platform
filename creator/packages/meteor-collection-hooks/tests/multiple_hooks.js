/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('general - multiple hooks should all fire the appropriate number of times', function (test, next) {
  var collection = new Collection(null)
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

  collection.before.insert(function () { counts.before.insert++ })
  collection.before.update(function () { counts.before.update++ })
  collection.before.remove(function () { counts.before.remove++ })

  collection.before.insert(function () { counts.before.insert++ })
  collection.before.update(function () { counts.before.update++ })
  collection.before.remove(function () { counts.before.remove++ })

  collection.after.insert(function () { counts.after.insert++ })
  collection.after.update(function () { counts.after.update++ })
  collection.after.remove(function () { counts.after.remove++ })

  collection.after.insert(function () { counts.after.insert++ })
  collection.after.update(function () { counts.after.update++ })
  collection.after.remove(function () { counts.after.remove++ })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, function (err, id) {
      if (err) throw err
      collection.update({_id: id}, {$set: {}}, function (err) {
        if (err) throw err
        collection.remove({_id: id}, function (nil) {
          test.equal(counts.before.insert, 2)
          test.equal(counts.before.update, 2)
          test.equal(counts.before.remove, 2)
          test.equal(counts.after.insert, 2)
          test.equal(counts.after.update, 2)
          test.equal(counts.after.remove, 2)
          next()
        })
      })
    })
  })
})
