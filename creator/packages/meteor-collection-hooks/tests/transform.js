/* global Tinytest Meteor Mongo InsecureLogin _ */

var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection

Tinytest.addAsync('general - hook callbacks should have this.transform function that works', function (test, next) {
  var collection = new Collection(null, {
    transform: function (doc) {
      return _.extend(doc, {isTransformed: true})
    }
  })

  collection.allow({
    insert: function () { return true },
    update: function () { return true },
    remove: function () { return true }
  })

  var counts = {
    before: {
      insert: 0,
      update: 0,
      remove: 0
    },
    after: {
      insert: 0,
      update: 0,
      remove: 0
    }
  }

  collection.before.insert(function (userId, doc) { if (_.isFunction(this.transform) && this.transform().isTransformed) { counts.before.insert++ } })
  collection.before.update(function (userId, doc) { if (_.isFunction(this.transform) && this.transform().isTransformed) { counts.before.update++ } })
  collection.before.remove(function (userId, doc) { if (_.isFunction(this.transform) && this.transform().isTransformed) { counts.before.remove++ } })

  collection.after.insert(function (userId, doc) { if (_.isFunction(this.transform) && this.transform().isTransformed) { counts.after.insert++ } })
  collection.after.update(function (userId, doc) { if (_.isFunction(this.transform) && this.transform().isTransformed) { counts.after.update++ } })
  collection.after.remove(function (userId, doc) { if (_.isFunction(this.transform) && this.transform().isTransformed) { counts.after.remove++ } })

  InsecureLogin.ready(function () {
    // TODO: does it make sense to pass an _id on insert just to get this test
    // to pass? Probably not. Think more on this -- it could be that we simply
    // shouldn't be running a .transform() in a before.insert -- how will we
    // know the _id? And that's what transform is complaining about.
    collection.insert({_id: '1', start_value: true}, function (err, id) {
      if (err) throw err
      collection.update({_id: id}, {$set: {update_value: true}}, function (err) {
        if (err) throw err
        collection.remove({_id: id}, function (nil) {
          test.equal(counts.before.insert, 1, 'before insert should have 1 count')
          test.equal(counts.before.update, 1, 'before update should have 1 count')
          test.equal(counts.before.remove, 1, 'before remove should have 1 count')
          test.equal(counts.after.insert, 1, 'after insert should have 1 count')
          test.equal(counts.after.update, 1, 'after update should have 1 count')
          test.equal(counts.after.remove, 1, 'after remove should have 1 count')
          next()
        })
      })
    })
  })
})
