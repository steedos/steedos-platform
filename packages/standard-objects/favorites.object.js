const getSessionByUserId = require('@steedos/auth').getSessionByUserId
const objectql = require('@steedos/objectql')
const getObject = objectql.getObject
const wrapAsync = objectql.wrapAsync

Meteor.publish('myFavorites', function(space_id){
  var collection = Creator.getCollection("favorites", space_id)
  if(!this.userId){
    return this.ready()
  }
  if(!space_id){
    return this.ready()
  }
  if(!collection){
    return this.ready()
  }
  return collection.find({space: space_id, owner: this.userId})
})