Meteor.methods
    'object_workflows.get': (spaceId, userId) ->
        check spaceId, String
        check userId, String

        if Creator.Collections["space_users"].find({space: spaceId, user: userId}).count() is 0
            throw new Meteor.Error 'not-authorized'

        ows = Creator.getCollection('object_workflows').find({ space: spaceId }, { fields: { object_name: 1, flow_id: 1, space: 1 } }).fetch()
        _.each ows,(o) ->
            o.flow_name = Creator.getCollection('flows').findOne(o.flow_id, { fields: { name: 1 } })?.name

        return ows