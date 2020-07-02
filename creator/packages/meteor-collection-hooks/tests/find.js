/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('find - selector should be {} when called without arguments', function (test, next) {
  var collection = new Collection(null)

  collection.before.find(function (userId, selector, options) {
    test.equal(selector, {})
    next()
  })

  collection.find()
})

Tinytest.addAsync('find - selector should have extra property', function (test, next) {
  var collection = new Collection(null)

  collection.before.find(function (userId, selector, options) {
    if (options && options.test) {
      delete selector.bogus_value
      selector.before_find = true
    }
  })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true, before_find: true}, function (err, id) {
      if (err) throw err
      test.equal(collection.find({start_value: true, bogus_value: true}, {test: 1}).count(), 1)
      next()
    })
  })
})

Tinytest.addAsync('find - tmp variable should have property added after the find', function (test, next) {
  var collection = new Collection(null)
  var tmp = {}

  collection.after.find(function (userId, selector, options) {
    if (options && options.test) {
      tmp.after_find = true
    }
  })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, function (err, id) {
      if (err) throw err
      collection.find({start_value: true}, {test: 1})
      test.equal(tmp.after_find, true)
      next()
    })
  })
})
