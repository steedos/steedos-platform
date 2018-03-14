Meteor.methods
	isAuthorized: (userId,clientId) ->
        count = authCodesCollection.find({'userId':userId,'clientId':clientId}).count()
        console.log "---count---",count
        if count > 0
            return true
        else
            return false