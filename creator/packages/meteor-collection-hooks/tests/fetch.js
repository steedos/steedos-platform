/* global Tinytest Meteor Mongo InsecureLogin _ */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('general - local collection documents should only have fetched fields', function (test, next) {
  var collection = new Collection(null)

  function same (arr1, arr2) {
    return arr1.length === arr2.length && _.intersection(arr1, arr2).length === arr1.length
  }

  function start (nil, id) {
    var fields = ['fetch_value1', 'fetch_value2']

    collection.after.update(function (userId, doc, fieldNames, modifier) {
      var docKeys = _.without(_.keys(doc), '_id')
      test.equal(same(docKeys, fields), true)
      next()
    }, {
      fetch: fields
    })

    collection.update({_id: id}, {$set: {update_value: true}})
  }

  InsecureLogin.ready(function () {
    collection.insert({
      nonfetch_value1: true,
      nonfetch_value2: true,
      nonfetch_value3: true,
      fetch_value1: true,
      fetch_value2: true
    }, start)
  })
})
