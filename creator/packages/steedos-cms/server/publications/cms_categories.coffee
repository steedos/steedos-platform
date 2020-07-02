Meteor.publish 'cms_categories', (siteId)->

	unless this.userId
		return this.ready()
	
	unless siteId
		return this.ready()

	site = db.cms_sites.findOne(siteId)
	unless site
		return this.ready()


	selector = {}

	# disable category admins
	# if site.admins and this.userId in site.admins
	# 	selector = 
	# 		site: siteId
	# else
	# 	selector = {$and: [{site: siteId},{$or: [{admins: null},{admins: this.userId}]}]}
	
	selector = 
			site: siteId
	return db.cms_categories.find(selector, {sort: {order: 1}})