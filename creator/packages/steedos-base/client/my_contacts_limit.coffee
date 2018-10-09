Meteor.startup ->
	if Meteor.isClient
		# 默认配置为限制在本单位范围
		Steedos.my_contacts_limit = 
			isLimit: true
			outside_organizations: []
		Tracker.autorun (c)->
			if Steedos.subsBootstrap.ready("my_spaces")
				spaceId = Steedos.spaceId()
				unless spaceId
					return
				if Steedos.isSpaceAdmin()
					# 工作区管理员肯定不会有任何限制
					Steedos.my_contacts_limit.isLimit = false
					Session.set("is_my_contacts_limit_loaded", true);
					return
				Meteor.call "get_contacts_limit", spaceId, (error, results)->
					Session.set("is_my_contacts_limit_loaded", true);
					if results
						Steedos.my_contacts_limit = results
					if error
						toastr.error(t(error.reason))