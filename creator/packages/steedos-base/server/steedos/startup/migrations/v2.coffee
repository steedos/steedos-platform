Meteor.startup ->
    Migrations.add
        version: 2
        name: '组织结构允许一个人属于多个部门 #379'
        up: ->
            console.log 'version 2 up'
            console.time 'upgrade_space_user'
            try
                collection = db.space_users
                collection.find({organizations: {$exists: false}}, {fields: {organization: 1}}).forEach (su)->
                    if su.organization
                        collection.direct.update(su._id, {$set: {organizations: [su.organization]}})

            catch e
                console.error e

            console.timeEnd 'upgrade_space_user'
        down: ->
            console.log 'version 2 down'
