if Meteor.isServer
    Meteor.methods
        updateUserAvatar: (avatar) ->
                if not @userId?
                        return

                db.users.update({_id: @userId}, {$set: {avatar: avatar}})  