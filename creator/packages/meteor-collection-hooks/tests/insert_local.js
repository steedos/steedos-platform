/* global Tinytest Meteor Mongo InsecureLogin */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('insert - local collection document should have extra property added before being inserted', function (test, next) {
  var collection = new Collection(null)
  var tmp = {}

  collection.before.insert(function (userId, doc) {
    tmp.typeof_userId = typeof userId
    doc.before_insert_value = true
  })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true}, function (err, id) {
      if (err) throw err
      if (Meteor.isServer) {
        test.equal(tmp.typeof_userId, 'undefined', 'Local collection on server should NOT know about a userId')
      } else {
        test.equal(tmp.typeof_userId, 'string', 'There should be a userId on the client')
      }
      test.equal(collection.find({start_value: true, before_insert_value: true}).count(), 1)
      next()
    })
  })
})

Tinytest.addAsync('insert - local collection should fire after-insert hook', function (test, next) {
  var collection = new Collection(null)

  collection.after.insert(function (userId, doc) {
    if (Meteor.isServer) {
      test.equal(typeof userId, 'undefined', 'Local collection on server should NOT know about a userId')
    } else {
      test.equal(typeof userId, 'string', 'There should be a userId on the client')
    }

    test.notEqual(doc.start_value, undefined, 'doc should have start_value')
    test.notEqual(this._id, undefined, 'should provide inserted _id on this')

    next()
  })

  InsecureLogin.ready(function () {
    collection.insert({start_value: true})
  })
})
