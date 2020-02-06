CMS = {}

if Meteor.isServer
	CMS.getPostMembers = (doc,isModifierSet)->
		organizations = if isModifierSet then doc["members.organizations"] else doc?.members?.organizations
		users = if isModifierSet then doc["members.users"] else doc?.members?.users
		members = []
		siteId = doc.site
		postId = doc._id
		if doc.visibility == "private"
			if organizations?.length or users?.length
				if users?.length
					members = users
				if organizations?.length
					db.organizations.find(_id:{$in:organizations},{fields: {_id: 1}}).forEach (organizationItem)->
						organizationUsers = organizationItem.calculateUsers(true)
						members = members.concat(organizationUsers)
		else
			site = db.cms_sites.findOne(siteId,{fields:{space:1}})
			siteSpaceId = site.space
			if siteSpaceId
				members = db.space_users.find({space:siteSpaceId},{fields:{user:1}}).fetch().getProperty("user")
		return _.uniq members


if Meteor.isClient
	CMS.setSiteId = (siteId)->
		Session.set("siteId", siteId)
		unless siteId
			return
		site = db.cms_sites.findOne({_id:siteId})
		spaceId = site?.space
		if spaceId
			Steedos.setSpaceId spaceId