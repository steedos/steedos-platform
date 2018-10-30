/* global Tinytest Meteor InsecureLogin FS */

var fsCollection = new FS.Collection('testfiles', {
  stores: [
    new FS.Store.FileSystem('testfiles', {path: '/tmp'})
  ]
})

var dataUri = 'data:image/gifbase64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'

if (Meteor.isServer) {
  fsCollection.files.allow({
    insert: function () { return true },
    update: function () { return true },
    remove: function () { return true }
  })

  Meteor.publish('testfilespublish', function () {
    return fsCollection.find()
  })
} else {
  Meteor.subscribe('testfilespublish')
}

var counts = {}

function reset () {
  counts = {
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
}

fsCollection.files.before.insert(function () { counts.before.insert++ })
fsCollection.files.before.update(function () { counts.before.update++ })
fsCollection.files.before.remove(function () { counts.before.remove++ })

fsCollection.files.after.insert(function () { counts.after.insert++ })
fsCollection.files.after.update(function () { counts.after.update++ })
fsCollection.files.after.remove(function () { counts.after.remove++ })

Tinytest.addAsync('CollectionFS - ensure insert, update, remove hooks work properly', function (test, next) {
  function _insert (callback) {
    var testFile = new FS.File(dataUri)
    fsCollection.insert(testFile, function (err, fileObj) {
      if (err) throw err
      testFile.name('collectionfs-test-' + (Meteor.isServer ? 'SERVER' : 'CLIENT') + '.gif')

      // TODO: find a better way to wait for the file to be written
      Meteor.setTimeout(function () {
        callback(err, fileObj)
      }, 100)
    })
  }

  function _update (id, callback) {
    fsCollection.files.update(id, {$set: {'metadata.test': 1}}, function (err) {
      if (err) throw err
      callback(err)
    })
  }

  function _remove (id, callback) {
    fsCollection.remove(id, function (err) {
      if (err) throw err
      callback(err)
    })
  }

  InsecureLogin.ready(function () {
    reset()
    _insert(function (nil, fileObj) {
      _update(fileObj._id, function (nil) {
        _remove(fileObj._id, function (nil) {
          // update is called multiple times to update various properties. I
          // have not nailed down exactly how many times as it seems to change
          // between 3 and 4 for the size of gif I'm using in this test.

          console.log('counts:', JSON.stringify(counts))

          test.equal(counts.before.insert, 1)
          test.isTrue(counts.before.update > 0)
          test.equal(counts.before.remove, 1)

          test.equal(counts.after.insert, 1)
          test.isTrue(counts.before.update > 0)
          test.equal(counts.after.remove, 1)

          next()
        })
      })
    })
  })
})
