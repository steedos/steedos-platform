Meteor.publish 'cms_sites', (spaces)->

	unless this.userId
		return this.ready()
	
	check spaces, Array

	unless spaces.length
		return this.ready()


	user = this.userId
	return db.cms_sites.find({
			$and : [
				{space: {$in:spaces}}
				{$or:[{visibility:{$ne:"private"}}, {admins:user}, {owner:user}]}
			]
		},{
			fields: {space:1,type:1,name:1,owner:1,visibility:1,admins:1,cover:1,avatar:1,order:1,created:1,is_needto_limit_unit:1}
		}
	)