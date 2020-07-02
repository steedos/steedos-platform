/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('upsert - hooks should all fire the appropriate number of times', function (test, next) {
  var collection = new Collection(null)
  var counts = {
    before: {
      insert: 0,
      update: 0,
      remove: 0,
      upsert: 0
    },
    after: {
      insert: 0,
      update: 0,
      remove: 0,
      upsert: 0
    }
  }

  collection.before.insert(function () { counts.before.insert++ })
  collection.before.update(function () { counts.before.update++ })
  collection.before.remove(function () { counts.before.remove++ })
  collection.before.upsert(function () { counts.before.upsert++ })

  collection.after.insert(function () { counts.after.insert++ })
  collection.after.update(function () { counts.after.update++ })
  collection.after.remove(function () { counts.after.remove++ })
  collection.after.upsert(function () { counts.after.upsert++ })

  InsecureLogin.ready(function () {
    collection.remove({test: true}, function (err) {
      if (err) throw err
      collection.upsert({test: true}, {test: true, step: 'insert'}, function (err, obj) {
        if (err) throw err
        collection.upsert(obj.insertedId, {test: true, step: 'update'}, function (err) {
          if (err) throw err
          test.equal(counts.before.insert, 0, 'before.insert should be 0')
          test.equal(counts.before.update, 0, 'before.update should be 0')
          test.equal(counts.before.remove, 0, 'before.remove should be 0')
          test.equal(counts.before.upsert, 2, 'before.insert should be 2')
          test.equal(counts.after.insert, 1, 'after.insert should be 1')
          test.equal(counts.after.update, 1, 'after.update should be 1')
          test.equal(counts.after.remove, 0, 'after.remove should be 0')
          test.equal(counts.after.upsert, 0, 'after.upsert should be 0')
          next()
        })
      })
    })
  })
})

if (Meteor.isServer) {
  Tinytest.add('upsert - hooks should all fire the appropriate number of times in a synchronous environment', function (test) {
    var collection = new Collection(null)
    var counts = {
      before: {
        insert: 0,
        update: 0,
        remove: 0,
        upsert: 0
      },
      after: {
        insert: 0,
        update: 0,
        remove: 0,
        upsert: 0
      }
    }

    collection.before.insert(function () { counts.before.insert++ })
    collection.before.update(function () { counts.before.update++ })
    collection.before.remove(function () { counts.before.remove++ })
    collection.before.upsert(function () { counts.before.upsert++ })

    collection.after.insert(function () { counts.after.insert++ })
    collection.after.update(function () { counts.after.update++ })
    collection.after.remove(function () { counts.after.remove++ })
    collection.after.upsert(function () { counts.after.upsert++ })

    collection.remove({test: true})
    var obj = collection.upsert({test: true}, {test: true, step: 'insert'})
    collection.upsert(obj.insertedId, {test: true, step: 'update'})

    test.equal(counts.before.insert, 0, 'before.insert should be 0')
    test.equal(counts.before.update, 0, 'before.update should be 0')
    test.equal(counts.before.remove, 0, 'before.remove should be 0')
    test.equal(counts.before.upsert, 2, 'before.insert should be 2')
    test.equal(counts.after.insert, 1, 'after.insert should be 1')
    test.equal(counts.after.update, 1, 'after.update should be 1')
    test.equal(counts.after.remove, 0, 'after.remove should be 0')
    test.equal(counts.after.upsert, 0, 'after.upsert should be 0')
  })
}

Tinytest.addAsync('issue #156 - upsert after.insert should have a correct doc using $set', function (test, next) {
  var collection = new Collection(null)

  collection.after.insert(function (userId, doc) {
    test.isNotUndefined(doc, 'doc should not be undefined')
    test.isNotUndefined(doc._id, 'doc should have an _id property')
    test.isNotUndefined(doc.test, 'doc should have a test property')
    test.equal(doc.step, 'insert-async', 'doc should have a step property equal to insert-async')
    next()
  })

  collection.remove({test: true})
  collection.upsert({test: true}, {$set: {test: true, step: 'insert-async'}})
})

if (Meteor.isServer) {
  Tinytest.add('issue #156 - upsert after.insert should have a correct doc using $set in synchronous environment', function (test) {
    var collection = new Collection(null)

    collection.after.insert(function (userId, doc) {
      test.isNotUndefined(doc, 'doc should not be undefined')
      test.isNotUndefined(doc._id, 'doc should have an _id property')
      test.isNotUndefined(doc.test, 'doc should have a test property')
      test.equal(doc.step, 'insert-sync', 'doc should have a step property equal to insert-sync')
    })

    collection.remove({test: true})
    collection.upsert({test: true}, {$set: {test: true, step: 'insert-sync'}})
  })
}
