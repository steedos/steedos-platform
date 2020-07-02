Meteor.publish 'autoformFileDoc', (collectionName, docId) ->
  check collectionName, String
  check docId, String

  collection = FS._collections[collectionName] or global[collectionName]
  if collection
    collection.find
      _id: docId
