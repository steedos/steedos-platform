/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('findone - selector should be {} when called without arguments', function (test, next) {
  var collection = new Collection(null)

  collection.before.findOne(function (userId, selector, options) {
    test.equal(selector, {})
    next()
  })

  collection.findOne()
})

Tinytest.addAsync('findone - selector should have extra property', function (test, next) {
  var collection = new Collection(null)

  collection.before.findOne(function (userId, selector, options) {
    if (options && options.test) {
      delete selector.bogus_value
      selector.before_findone = true
    }
  })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true, before_findone: true}, function (err, id) {
      if (err) throw err
      test.notEqual(collection.findOne({start_value: true, bogus_value: true}, {test: 1}), undefined)
      next()
    })
  })
})

Tinytest.addAsync('findone - tmp variable should have property added after the find', function (test, next) {
  var collection = new Collection(null)
  var tmp = {}

  collection.after.findOne(function (userId, selector, options) {
    if (options && options.test) {
      tmp.after_findone = true
    }
  })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, function (err, id) {
      if (err) throw err
      collection.findOne({start_value: true}, {test: 1})
      test.equal(tmp.after_findone, true)
      next()
    })
  })
})
