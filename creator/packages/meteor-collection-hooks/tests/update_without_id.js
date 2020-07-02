/* global Tinytest Meteor Mongo _ */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('update - server collection documents should have extra properties added before and after being updated despite selector not being _id', function (test, next) {
  var collection = new Collection(null)

  var retries = 0
  var retry = function (func, expect, cb) {
    if (++retries >= 5) return Meteor.bindEnvironment(cb)
    Meteor.setTimeout(function () {
      var r = func()
      if (expect(r)) return cb(r)
      retry(func, expect, cb)
    }, 100)
  }

  collection.before.update(function (userId, doc, fieldNames, modifier, options) {
    if (_.contains(fieldNames, 'test')) {
      modifier.$set.before_update_value = true
    }
  })

  collection.after.update(function (userId, doc, fieldNames, modifier, options) {
    if (_.contains(fieldNames, 'test')) {
      collection.update({_id: doc._id}, {$set: {after_update_value: true}})
    }
  })

  collection.insert({not_an_id: 'testing'}, function (err, id1) {
    if (err) throw err
    collection.insert({not_an_id: 'testing'}, function (err, id2) {
      if (err) throw err
      collection.insert({not_an_id: 'testing'}, function (err, id3) {
        if (err) throw err
        collection.update({not_an_id: 'testing'}, {$set: {not_an_id: 'newvalue', test: true}}, {multi: true})

        // retry a few times because the after.update's call to update doesn't block
        retry(function () {
          return collection.find({not_an_id: 'newvalue', before_update_value: true, after_update_value: true}).count()
        }, function (r) {
          return r > 0
        }, function (r) {
          test.equal(r, 3, 'number of docs found should be 3')
          next()
        })
      })
    })
  })
})
