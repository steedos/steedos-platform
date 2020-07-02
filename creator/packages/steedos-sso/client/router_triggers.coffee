# checkAndLogin = (context)->
# 	if Accounts._storedUserId()
# 		if context?.queryParams?["X-User-Id"] && Meteor?.userId() != context?.queryParams?["X-User-Id"]
# 			SteedosSSO.login(context)
# 	else
# 		SteedosSSO.login(context)


# FlowRouter.triggers.enter([checkAndLogin]);
