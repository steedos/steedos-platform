/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('remove - local collection document should affect external variable before being removed', function (test, next) {
  var collection = new Collection(null)

  function start (nil, id) {
    var external = 0

    collection.before.remove(function (userId, doc) {
      // There should be a userId if we're running on the client.
      // Since this is a local collection, the server should NOT know
      // about any userId
      if (Meteor.isServer) {
        test.equal(userId, undefined)
      } else {
        test.notEqual(userId, undefined)
      }
      test.equal(doc.start_value, true)
      external = 1
    })

    collection.remove({_id: id}, function (err) {
      if (err) throw err
      test.equal(collection.find({start_value: true}).count(), 0)
      test.equal(external, 1)
      next()
    })
  }

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, start)
  })
})

Tinytest.addAsync('remove - local collection should fire after-remove hook and affect external variable', function (test, next) {
  var collection = new Collection(null)
  var external = 0

  var c = 0
  var n = function () {
    if (++c === 2) {
      test.equal(external, 1)
      next()
    }
  }

  function start (nil, id) {
    collection.after.remove(function (userId, doc) {
      // There should be a userId if we're running on the client.
      // Since this is a local collection, the server should NOT know
      // about any userId
      if (Meteor.isServer) {
        test.equal(userId, undefined)
      } else {
        test.notEqual(userId, undefined)
      }

      // The doc should contain a copy of the original doc
      test.equal(doc._id, id)
      external = 1

      n()
    })

    collection.remove({_id: id}, function (err) {
      if (err) throw err
      test.equal(collection.find({start_value: true}).count(), 0)
      n()
    })
  }

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, start)
  })
})
