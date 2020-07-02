Meteor.methods
	get_contacts_limit: (space)->
		# 根据当前用户所属组织，查询出当前用户限定的组织查看范围
		# 返回的isLimit为true表示限定在当前用户所在组织范围，organizations值记录额外的组织范围
		# 返回的isLimit为false表示不限定组织范围，即表示能看整个工作区的组织
		# 默认返回限定在当前用户所属组织
		check space, String
		reValue =
			isLimit: true
			outside_organizations: []
		unless this.userId
			return reValue
		isLimit = false
		outside_organizations = []
		setting = db.space_settings.findOne({space: space, key: "contacts_view_limits"})
		limits = setting?.values || [];

		if limits.length
			myOrgs = db.organizations.find({space: space, users: this.userId}, {fields:{_id: 1}})
			myOrgIds = myOrgs.map (n) ->
				return n._id
			unless myOrgIds.length
				return reValue
			
			myLitmitOrgIds = []
			for limit in limits
				froms = limit.froms
				tos = limit.tos
				fromsChildren = db.organizations.find({space: space, parents: {$in: froms}}, {fields:{_id: 1}})
				fromsChildrenIds = fromsChildren?.map (n) ->
					return n._id
				for myOrgId in myOrgIds
					tempIsLimit = false
					if froms.indexOf(myOrgId) > -1
						tempIsLimit = true
					else
						if fromsChildrenIds.indexOf(myOrgId) > -1
							tempIsLimit = true
					if tempIsLimit
						isLimit = true
						outside_organizations.push tos
						myLitmitOrgIds.push myOrgId

			myLitmitOrgIds = _.uniq myLitmitOrgIds
			if myLitmitOrgIds.length < myOrgIds.length
				# 如果受限的组织个数小于用户所属组织的个数，则说明当前用户至少有一个组织是不受限的
				isLimit = false
				outside_organizations = []
			else
				outside_organizations = _.uniq _.flatten outside_organizations

		if isLimit
			toOrgs = db.organizations.find({space: space, _id: {$in: outside_organizations}}, {fields:{_id: 1, parents: 1}}).fetch()
			# 把outside_organizations中有父子节点关系的节点筛选出来并取出最外层节点
			# 把outside_organizations中有属于用户所属组织的子孙节点的节点删除
			orgs = _.filter toOrgs, (org) ->
				parents = org.parents or []
				return _.intersection(parents, outside_organizations).length < 1 and _.intersection(parents, myOrgIds).length < 1
			outside_organizations = orgs.map (n) ->
				return n._id

		reValue.isLimit = isLimit
		reValue.outside_organizations = outside_organizations
		return reValue
