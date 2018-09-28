Meteor.startup ->
    if db and db.avatars and cfs
        cfs.avatars = db.avatars