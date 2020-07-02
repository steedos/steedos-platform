/* global Tinytest Meteor Mongo InsecureLogin _ */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('update - local collection documents should have extra property added before being updated', function (test, next) {
  var collection = new Collection(null)

  function start () {
    collection.before.update(function (userId, doc, fieldNames, modifier) {
      // There should be a userId if we're running on the client.
      // Since this is a local collection, the server should NOT know
      // about any userId
      if (Meteor.isServer) {
        test.equal(userId, undefined)
      } else {
        test.notEqual(userId, undefined)
      }

      test.equal(fieldNames.length, 1)
      test.equal(fieldNames[0], 'update_value')

      modifier.$set.before_update_value = true
    })

    collection.update({start_value: true}, {$set: {update_value: true}}, {multi: true}, function (err) {
      if (err) throw err
      test.equal(collection.find({start_value: true, update_value: true, before_update_value: true}).count(), 2)
      next()
    })
  }

  InsecureLogin.ready(function () {
    // Add two documents
    collection.insert({start_value: true}, function () {
      collection.insert({start_value: true}, function () {
        start()
      })
    })
  })
})

Tinytest.addAsync('update - local collection should fire after-update hook', function (test, next) {
  var collection = new Collection(null)
  var c = 0
  var n = function () { if (++c === 2) { next() } }

  function start () {
    collection.after.update(function (userId, doc, fieldNames, modifier) {
      // There should be a userId if we're running on the client.
      // Since this is a local collection, the server should NOT know
      // about any userId
      if (Meteor.isServer) {
        test.equal(userId, undefined)
      } else {
        test.notEqual(userId, undefined)
      }

      test.equal(fieldNames.length, 1)
      test.equal(fieldNames[0], 'update_value')

      test.equal(doc.update_value, true)
      test.equal(_.has(this.previous || {}, 'update_value'), false)

      n()
    })

    collection.update({start_value: true}, {$set: {update_value: true}}, {multi: true})
  }

  InsecureLogin.ready(function () {
    // Add two documents
    collection.insert({start_value: true}, function () {
      collection.insert({start_value: true}, function () {
        start()
      })
    })
  })
})

Tinytest.addAsync('update - local collection should fire before-update hook without options in update and still fire end-callback', function (test, next) {
  var collection = new Collection(null)

  function start () {
    collection.before.update(function (userId, doc, fieldNames, modifier) {
      modifier.$set.before_update_value = true
    })

    collection.update({start_value: true}, {$set: {update_value: true}}, function (err) {
      if (err) throw err
      test.equal(collection.find({start_value: true, update_value: true, before_update_value: true}).count(), 1)
      next()
    })
  }

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, start)
  })
})

Tinytest.addAsync('update - local collection should fire after-update hook without options in update and still fire end-callback', function (test, next) {
  var collection = new Collection(null)
  var c = 0
  var n = function () { if (++c === 2) { next() } }

  function start () {
    collection.after.update(function (userId, doc, fieldNames, modifier) {
      n()
    })

    collection.update({start_value: true}, {$set: {update_value: true}}, function (err) {
      if (err) throw err
      n()
    })
  }

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, start)
  })
})
