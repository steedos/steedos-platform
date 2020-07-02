Meteor.publish 'cms_posts_home',(siteId)->

	unless this.userId
		return this.ready()

	userId = this.userId

	userSpacesId = db.space_users.find({user:userId}).fetch().getProperty("space")
	organizations = []

	userSpacesId.forEach (spaceId) ->
		organizations = organizations.concat(Steedos.getUserOrganizations(spaceId,userId,true)) 

	return db.cms_posts.find({
		$and: [
			{
				site: siteId
			},
			{
				$or: [{
					visibility:{$exists:false}
				},{
					visibility:{$ne:"private"}
				},{
					author:userId
				},{
					"members.organizations":{$in:organizations}
				},{
					"members.users":{$in:[userId]}
				}]
			}
		]
	},{sort:{postDate:-1},limit:5})


