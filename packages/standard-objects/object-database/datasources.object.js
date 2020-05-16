const auth = require("@steedos/auth");
const _ = require("underscore");

Meteor.publish("datasources", function(spaceId) {
    var userId = this.userId
    if(!userId)
        throw new Meteor.Error("401", "Authentication is required and has not been provided.")
    
    if(db.space_users.findOne({user: userId, space: spaceId})){
        console.log('{space: spaceId}', {space: spaceId});
        return Creator.Collections["datasources"].find({space: spaceId}, {fields: {_id:1, space:1, name: 1}})
    }
    return [];
  });