Meteor.startup ->
    Migrations.add
        version: 3
        name: '给space_users表email字段赋值'
        up: ->
            console.log 'version 3 up'
            console.time 'upgrade_space_user_email'
            try
                collection = db.space_users
                collection.find({email: {$exists: false}}, {fields: {user: 1}}).forEach (su)->
                    if su.user
                        u = db.users.findOne({_id: su.user}, {fields: {emails: 1}})
                        if u && u.emails && u.emails.length > 0
                            if /^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(u.emails[0].address)
                                address = u.emails[0].address
                                collection.direct.update(su._id, {$set: {email: address}})
                        

            catch e
                console.error e

            console.timeEnd 'upgrade_space_user_email'
        down: ->
            console.log 'version 3 down'
