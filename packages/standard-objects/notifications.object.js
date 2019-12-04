const objectql = require('@steedos/objectql')

Creator.Objects['notifications'].methods = {
    markReadAll: async function (req, res) {
        let userSession = req.user;
        let error;
        let updatedCount = await objectql.getObject("notifications").updateMany([
            ["space", "=", userSession.spaceId],
            ["owner", "=", userSession.userId],
            [["is_read", "=", null], 'or', ["is_read", "=", false]]
        ], {
            is_read: true
        }).catch((ex) => {
            console.error(ex);
            error = ex;
            return 0;
        });
        if(error){
            res.status(500).send({
                "error": error,
                "success": false
            });
        }
        else{
            return res.send({
                markedCount: updatedCount,
                "success": true
            });
        }
    }
}

Meteor.publish('my_notifications', function(spaceId){
    var collection = Creator.getCollection("notifications");
    if(!this.userId){
        return this.ready()
    }
    if(!spaceId){
        return this.ready()
    }
    if(!collection){
        return this.ready()
    }
    return collection.find({space: spaceId, owner: this.userId}, {fields: {space: 1, owner: 1, name: 1, is_read: 1}})
})
