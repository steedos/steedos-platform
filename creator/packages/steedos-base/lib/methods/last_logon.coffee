if Meteor.isServer
        Meteor.methods
                updateUserLastLogon: () ->
                        if not @userId?
                                return

                        db.users.update({_id: @userId}, {$set: {last_logon: new Date()}})  


if Meteor.isClient
        Accounts.onLogin ()->
            Meteor.call 'updateUserLastLogon'