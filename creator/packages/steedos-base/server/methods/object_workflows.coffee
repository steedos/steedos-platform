Meteor.methods
    'object_workflows.get': (spaceId, userId) ->
        check spaceId, String
        check userId, String

        curSpaceUser = Creator.Collections["space_users"].findOne({space: spaceId, user: userId}, {fields: {organizations: 1}})
        if !curSpaceUser
            throw new Meteor.Error 'not-authorized'

        organizations = Creator.getCollection('organizations').find({
            _id: {
                $in: curSpaceUser.organizations
            }
        }, {fields: {parents: 1}}).fetch()

        ows = Creator.getCollection('object_workflows').find({ space: spaceId }, { fields: { object_name: 1, flow_id: 1, space: 1 } }).fetch()
        _.each ows,(o) ->
            fl = Creator.getCollection('flows').findOne(o.flow_id, { fields: { name: 1, perms: 1 } })
            if fl
                o.flow_name = fl.name
                o.can_add = false

                perms = fl.perms
                if perms
                    if perms.users_can_add && perms.users_can_add.includes(userId)
                        o.can_add = true
                    else if perms.orgs_can_add && perms.orgs_can_add.length > 0
                        if curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_add).length > 0
                            o.can_add = true
                        else
                            if organizations
                                o.can_add = _.some organizations, (org)->
                                    return org.parents && _.intersection(org.parents, perms.orgs_can_add).length > 0

        ows = ows.filter (n)->
            return n.flow_name

        return ows