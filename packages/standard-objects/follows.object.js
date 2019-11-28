Meteor.publish('myFollows', function(space_id){
  var collection = Creator.getCollection("follows", space_id)
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

if(Meteor.isServer){
  Creator.getObjectFollowers = function(spaceId, object_name){
    return Creator.getCollection("follows").find({space: spaceId, object_name: object_name}, {fields: {owner: 1}});
  };
  Creator.getRecordFollowers = function(recordId, spaceId, object_name){
    var recordFollowers = [];
		var objectFollowers = Creator.getObjectFollowers(spaceId, object_name);
    var record = Creator.getCollection(object_name).findOne(recordId);
    if(record){
      objectFollowers.forEach(function(objectFollower){
        if(objectFollower && objectFollower.owner){
          var recordPermissions = Creator.getRecordPermissions(object_name, record, objectFollower.owner, spaceId);
          if(recordPermissions.allowRead){
            recordFollowers.push(objectFollower.owner);
          }
        }
      })
    }
    return recordFollowers
  }
}