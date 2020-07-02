/* global Tinytest Meteor Mongo InsecureLogin _ */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

var collection1 = new Collection('test_update_collection1')

if (Meteor.isServer) {
  Tinytest.addAsync('update - collection1 document should have extra property added to it before it is updated', function (test, next) {
    var tmp = {}

    function start () {
      collection1.before.update(function (userId, doc, fieldNames, modifier) {
        // There should be no userId because the update was initiated
        // on the server -- there's no correlation to any specific user
        tmp.userId = userId  // HACK: can't test here directly otherwise refreshing test stops execution here
        modifier.$set.before_update_value = true
      })

      collection1.update({start_value: true}, {$set: {update_value: true}}, {multi: true}, function (err) {
        if (err) throw err
        test.equal(collection1.find({start_value: true, update_value: true, before_update_value: true}).count(), 2)
        test.equal(tmp.userId, undefined)
        next()
      })
    }

    collection1.remove({})

    // Add two documents
    collection1.insert({start_value: true}, function () {
      collection1.insert({start_value: true}, function () {
        start()
      })
    })
  })
}

var collection2 = new Collection('test_update_collection2')

if (Meteor.isServer) {
  // full client-side access
  collection2.allow({
    insert: function () { return true },
    update: function () { return true },
    remove: function () { return true }
  })

  Meteor.methods({
    test_update_reset_collection2: function () {
      collection2.remove({})
    }
  })

  Meteor.publish('test_update_publish_collection2', function () {
    return collection2.find()
  })

  collection2.before.update(function (userId, doc, fieldNames, modifier) {
    modifier.$set.server_value = true
  })
}

if (Meteor.isClient) {
  Meteor.subscribe('test_update_publish_collection2')

  Tinytest.addAsync('update - collection2 document should have client-added and server-added extra properties added to it before it is updated', function (test, next) {
    var c = 0
    var n = function () { if (++c === 2) { next() } }

    function start (err, id) {
      if (err) throw err

      collection2.before.update(function (userId, doc, fieldNames, modifier) {
        // Insert is initiated on the client, a userId must be present
        test.notEqual(userId, undefined)

        test.equal(fieldNames.length, 1)
        test.equal(fieldNames[0], 'update_value')

        modifier.$set.client_value = true
      })

      collection2.after.update(function (userId, doc, fieldNames, modifier) {
        test.equal(doc.update_value, true)
        test.equal(_.has(this.previous, 'update_value'), false)
        n()
      })

      collection2.update({_id: id}, {$set: {update_value: true}}, function (err) {
        if (err) throw err
        test.equal(collection2.find({start_value: true, client_value: true, server_value: true}).count(), 1)
        n()
      })
    }

    InsecureLogin.ready(function () {
      Meteor.call('test_update_reset_collection2', function (nil, result) {
        collection2.insert({start_value: true}, start)
      })
    })
  })
}
