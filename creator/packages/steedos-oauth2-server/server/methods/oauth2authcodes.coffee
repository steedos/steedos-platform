Meteor.methods
	isAuthorized: (userId,clientId) ->
        count = authCodesCollection.find({'userId':userId,'clientId':clientId}).count()
        if count > 0
            return true
        else
            return false