/* global Tinytest Meteor Mongo CollectionHooks */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('optional-previous - update hook should not prefetch previous, via hook option param', function (test, next) {
  var collection = new Collection(null)

  collection.after.update(function (userId, doc, fieldNames, modifier, options) {
    if (doc && doc._id === 'test') {
      test.equal(!!this.previous, false)
      next()
    }
  }, {fetchPrevious: false})

  collection.insert({_id: 'test', test: 1}, function () {
    collection.update({_id: 'test'}, {$set: {test: 1}})
  })
})

Tinytest.addAsync('optional-previous - update hook should not prefetch previous, via collection option param', function (test, next) {
  var collection = new Collection(null)

  collection.hookOptions.after.update = {fetchPrevious: false}

  collection.after.update(function (userId, doc, fieldNames, modifier, options) {
    if (doc && doc._id === 'test') {
      test.equal(!!this.previous, false)
      next()
    }
  })

  collection.insert({_id: 'test', test: 1}, function () {
    collection.update({_id: 'test'}, {$set: {test: 1}})
  })
})

if (Meteor.isServer) {
  // The following tests run only on the server due to their requirement for
  // running synchronously. Because the 'fetchPrevious' flag is set on a global
  // (and is meant to be used globally), it has side-effects with our other tests.
  // If we could run this test synchronously on the client, we would. That being
  // said, we aren't testing the difference between server and client, as the
  // functionality is the same for either, so testing only the server is
  // acceptable in this case.

  Tinytest.add('optional-previous - update hook should not prefetch previous, via defaults param variation 1: after.update', function (test) {
    var collection = new Collection(null)

    CollectionHooks.defaults.after.update = {fetchPrevious: false}

    collection.after.update(function (userId, doc, fieldNames, modifier, options) {
      if (options && options.test) {
        test.equal(!!this.previous, false)
      }
    })

    CollectionHooks.defaults.after.update = {}

    collection.insert({_id: 'test', test: 1})
    collection.update({_id: 'test'}, {$set: {test: 1}})
  })

  Tinytest.add('optional-previous - update hook should not prefetch previous, via defaults param variation 2: after.all', function (test) {
    var collection = new Collection(null)

    CollectionHooks.defaults.after.all = {fetchPrevious: false}

    collection.after.update(function (userId, doc, fieldNames, modifier, options) {
      if (options && options.test) {
        test.equal(!!this.previous, false)
      }
    })

    CollectionHooks.defaults.after.all = {}

    collection.insert({_id: 'test', test: 1})
    collection.update({_id: 'test'}, {$set: {test: 1}})
  })

  Tinytest.add('optional-previous - update hook should not prefetch previous, via defaults param variation 3: all.update', function (test) {
    var collection = new Collection(null)

    CollectionHooks.defaults.all.update = {fetchPrevious: false}

    collection.after.update(function (userId, doc, fieldNames, modifier, options) {
      if (options && options.test) {
        test.equal(!!this.previous, false)
      }
    })

    CollectionHooks.defaults.all.update = {}

    collection.insert({_id: 'test', test: 1})
    collection.update({_id: 'test'}, {$set: {test: 1}})
  })

  Tinytest.add('optional-previous - update hook should not prefetch previous, via defaults param variation 4: all.all', function (test) {
    var collection = new Collection(null)

    CollectionHooks.defaults.all.all = {fetchPrevious: false}

    collection.after.update(function (userId, doc, fieldNames, modifier, options) {
      if (options && options.test) {
        test.equal(!!this.previous, false)
      }
    })

    CollectionHooks.defaults.all.all = {}

    collection.insert({_id: 'test', test: 1})
    collection.update({_id: 'test'}, {$set: {test: 1}})
  })
}
