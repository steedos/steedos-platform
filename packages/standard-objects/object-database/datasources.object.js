const _ = require("underscore");
var objectql = require('@steedos/objectql');
var schema = objectql.getSteedosSchema();

Meteor.publish("datasources", function (spaceId) {
    var userId = this.userId
    if (!userId)
        throw new Meteor.Error("401", "Authentication is required and has not been provided.")

    if (db.space_users.findOne({ user: userId, space: spaceId })) {
        return Creator.Collections["datasources"].find({ space: spaceId }, { fields: { _id: 1, space: 1, name: 1 } })
    }
    return [];
});

Creator.Objects['datasources'].methods = {
    testConnection: async function (req, res) {
        var userSession = req.user
            var recordId = req.params._id;
            var spaceId = userSession.spaceId
            let doc = await objectql.getObject('datasources').findOne(recordId, {filters: `(space eq ${spaceId})`});
            if(doc){
                try {
                    let datasourceName =  `${recordId}_${spaceId}_${doc.name}__test`
                    doc.name = datasourceName
                    var datasource = schema.addDataSource(doc.name, doc, true); 
                    await datasource._adapter.init({});
                    await datasource.close();
                    return res.send({ok: 1});
                } catch (error) {
                    await datasource.close();
                    return res.status(500).send({error: error.toString()});
                }
            }
            return res.status(404).send({error: 'not find'});
    }
}