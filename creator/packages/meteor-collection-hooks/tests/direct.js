/* global Tinytest Meteor Mongo _ */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

_.each([null, 'direct_collection_test'], function (ctype) {
  Tinytest.add('direct - hooks should not be fired when using .direct (collection type ' + ctype + ')', function (test) {
    // console.log('-------', ctype)

    var collection = new Collection(ctype, {connection: null})
    var hookCount = 0

    // The server will make a call to find when findOne is called, which adds 2 extra counts
    // Update will make calls to find with options forwarded, which adds 4 extra counts
    var hookCountTarget = Meteor.isServer ? 16 : 14

    // Full permissions on collection
    collection.allow({
      insert: function () { return true },
      update: function () { return true },
      remove: function () { return true }
    })

    collection.before.insert(function (userId, doc) {
      if (doc && doc.test) {
        hookCount++
        // console.log(ctype, ': before insert', hookCount)
      }
    })

    collection.after.insert(function (userId, doc) {
      if (doc && doc.test) {
        hookCount++
        // console.log(ctype, ': after insert', hookCount)
      }
    })

    collection.before.update(function (userId, doc, fieldNames, modifier, options) {
      if (options && options.test) {
        hookCount++
        // console.log(ctype, ': before update', hookCount)
      }
    })

    collection.after.update(function (userId, doc, fieldNames, modifier, options) {
      if (options && options.test) {
        hookCount++
        // console.log(ctype, ': after update', hookCount)
      }
    })

    collection.before.remove(function (userId, doc) {
      if (doc && doc._id === 'test') {
        hookCount++
        // console.log(ctype, ': before remove', hookCount)
      }
    })

    collection.after.remove(function (userId, doc) {
      if (doc && doc._id === 'test') {
        hookCount++
        // console.log(ctype, ': after remove', hookCount)
      }
    })

    collection.before.find(function (userId, selector, options) {
      if (options && options.test) {
        hookCount++
        // console.log(ctype, ': before find', hookCount)
      }
    })

    collection.after.find(function (userId, selector, options, result) {
      if (options && options.test) {
        hookCount++
        // console.log(ctype, ': after find', hookCount)
      }
    })

    collection.before.findOne(function (userId, selector, options) {
      if (options && options.test) {
        hookCount++
        // console.log(ctype, ': before findOne', hookCount)
      }
    })

    collection.after.findOne(function (userId, selector, options, result) {
      if (options && options.test) {
        hookCount++
        // console.log(ctype, ': after findOne', hookCount)
      }
    })

    collection.insert({_id: 'test', test: 1})
    collection.update({_id: 'test'}, {$set: {test: 1}}, {test: 1})
    collection.find({}, {test: 1})
    collection.findOne({}, {test: 1})
    collection.remove({_id: 'test'})

    test.equal(hookCount, hookCountTarget)

    // These should in no way affect the hookCount, which is essential in proving
    // that the direct calls are functioning as intended
    collection.direct.insert({_id: 'test', test: 1})

    collection.direct.update({_id: 'test'}, {$set: {test: 1}}, {test: 1})

    var cursor = collection.direct.find({}, {test: 1})
    var count = cursor.count()
    test.equal(count, 1)

    var doc = collection.direct.findOne({}, {test: 1})
    test.equal(doc.test, 1)

    collection.direct.remove({_id: 'test'})

    test.equal(hookCount, hookCountTarget)
  })
})

_.each([{}, {connection: null}], function (conntype, i) {
  _.each([null, 'direct_collection_test_stringid'], function (ctype) {
    var cname = ctype && (ctype + i)
    Tinytest.add('direct - update and remove should allow removing by _id string (' + cname + ', ' + JSON.stringify(conntype) + ')', function (test) {
      var collection = new Collection(cname, conntype)

      // Full permissions on collection
      collection.allow({
        insert: function () { return true },
        update: function () { return true },
        remove: function () { return true }
      })

      function hasCountAndTestValue (count, value) {
        var cursor = collection.direct.find({_id: 'testid', test: value})
        test.equal(cursor.count(), count)
      }

      collection.direct.remove({_id: 'testid'})
      collection.direct.insert({_id: 'testid', test: 1})
      hasCountAndTestValue(1, 1)
      collection.direct.update('testid', {$set: {test: 2}})
      hasCountAndTestValue(1, 2)
      collection.direct.remove('testid')
      hasCountAndTestValue(0, 2)
    })
  })
})

if (Meteor.isServer) {
  Tinytest.add('direct - Meteor.users.direct.insert should return _id, not an object', function (test) {
    Meteor.users.remove('directinserttestid')

    var result = Meteor.users.direct.insert({_id: 'directinserttestid', test: 1})
    test.isFalse(_.isObject(result))
  })
}
