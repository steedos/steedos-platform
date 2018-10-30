/* global Tinytest Meteor Mongo InsecureLogin CollectionHooks */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

var collection = new Collection('test_collection_for_find_findone_userid')

var beforeFindUserId
var afterFindUserId
var beforeFindOneUserId
var afterFindOneUserId
var beforeFindWithinPublish
var afterFindWithinPublish
var beforeFindOneWithinPublish
var afterFindOneWithinPublish

// Don't declare hooks in publish method, as it is problematic
collection.before.find(function (userId, selector, options) {
  if (options && options.test) { // ignore other calls to find (caused by insert/update)
    beforeFindUserId = userId

    if (CollectionHooks.isWithinPublish) {
      beforeFindWithinPublish = CollectionHooks.isWithinPublish()
    }
  }
})

collection.after.find(function (userId, selector, options, result) {
  if (options && options.test) { // ignore other calls to find (caused by insert/update)
    afterFindUserId = userId

    if (CollectionHooks.isWithinPublish) {
      afterFindWithinPublish = CollectionHooks.isWithinPublish()
    }
  }
})

collection.before.findOne(function (userId, selector, options) {
  if (options && options.test) { // ignore other calls to find (caused by insert/update)
    beforeFindOneUserId = userId

    if (CollectionHooks.isWithinPublish) {
      beforeFindOneWithinPublish = CollectionHooks.isWithinPublish()
    }
  }
})

collection.after.findOne(function (userId, selector, options, result) {
  if (options && options.test) { // ignore other calls to find (caused by insert/update)
    afterFindOneUserId = userId

    if (CollectionHooks.isWithinPublish) {
      afterFindOneWithinPublish = CollectionHooks.isWithinPublish()
    }
  }
})

if (Meteor.isServer) {
  var serverTestsAdded = false
  var publishContext = null

  Tinytest.add('general - isWithinPublish is false outside of publish function', function (test) {
    test.equal(CollectionHooks.isWithinPublish(), false)
  })

  Meteor.publish('test_publish_for_find_findone_userid', function () {
    // Reset test values on each connection
    publishContext = null

    beforeFindUserId = null
    afterFindUserId = null
    beforeFindOneUserId = null
    afterFindOneUserId = null

    beforeFindWithinPublish = false
    afterFindWithinPublish = false
    beforeFindOneWithinPublish = false
    afterFindOneWithinPublish = false

    // Check publish context
    publishContext = this

    // Trigger hooks
    collection.find({}, {test: 1})
    collection.findOne({}, {test: 1})

    if (!serverTestsAdded) {
      serverTestsAdded = true

      // Our monkey-patch of Meteor.publish should preserve the value of 'this'.
      Tinytest.add('general - this (context) preserved in publish functions', function (test) {
        test.isTrue(publishContext && publishContext.userId)
      })

      Tinytest.add('find - userId available to before find hook when within publish context', function (test) {
        test.notEqual(beforeFindUserId, null)
        test.equal(beforeFindWithinPublish, true)
      })

      Tinytest.add('find - userId available to after find hook when within publish context', function (test) {
        test.notEqual(afterFindUserId, null)
        test.equal(afterFindWithinPublish, true)
      })

      Tinytest.add('findone - userId available to before findOne hook when within publish context', function (test) {
        test.notEqual(beforeFindOneUserId, null)
        test.equal(beforeFindOneWithinPublish, true)
      })

      Tinytest.add('findone - userId available to after findOne hook when within publish context', function (test) {
        test.notEqual(afterFindOneUserId, null)
        test.equal(afterFindOneWithinPublish, true)
      })
    }
  })
}

if (Meteor.isClient) {
  (function () {
    function cleanup () {
      beforeFindUserId = null
      afterFindUserId = null
      beforeFindOneUserId = null
      afterFindOneUserId = null
    }

    function withLogin (testFunc) {
      return function () {
        // grab arguments passed to testFunc (i.e. 'test')
        var context = this
        var args = arguments

        function wrapper (cb) {
          InsecureLogin.ready(function () {
            cleanup()
            var err

            try {
              var result = testFunc.apply(context, args)
              cb(null, result)
            } catch (error) {
              err = error
              cb(err)
            } finally {
              cleanup()
            }
          })
        }

        return Meteor.wrapAsync(wrapper) // Don't run this function, just wrap it
      }
    }

    // Run client tests.
    // TODO: Somehow, Tinytest.add / addAsync doesn't work inside InsecureLogin.ready().
    // Hence, we add these tests wrapped synchronously with a login hook.

    // Ideally, this function should wrap the test functions.
    Tinytest.add('find - userId available to before find hook', withLogin(function (test) {
      collection.find({}, {test: 1})
      test.notEqual(beforeFindUserId, null)
    }))

    Tinytest.add('find - userId available to after find hook', withLogin(function (test) {
      collection.find({}, {test: 1})
      test.notEqual(afterFindUserId, null)
    }))

    Tinytest.add('findone - userId available to before findOne hook', withLogin(function (test) {
      collection.findOne({}, {test: 1})
      test.notEqual(beforeFindOneUserId, null)
    }))

    Tinytest.add('findone - userId available to after findOne hook', withLogin(function (test) {
      collection.findOne({}, {test: 1})
      test.notEqual(afterFindOneUserId, null)
    }))

    InsecureLogin.ready(function () {
      // Run server tests
      Meteor.subscribe('test_publish_for_find_findone_userid')
    })
  })()
}
