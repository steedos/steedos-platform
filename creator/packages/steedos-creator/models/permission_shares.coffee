Creator.Objects.permission_shares = 
	name: "permission_shares"
	label: "共享规则"
	icon: "user"
	fields:
		name: 
			label: "名称"
			type: "text"
			required: true
			searchable:true
			index:true
		object_name: 
			label: "对象名"
			type: "lookup"
			optionsFunction: ()->
				_options = []
				_.forEach Creator.Objects, (o, k)->
					if o.enable_shares
						_options.push { label: o.label, value: k, icon: o.icon }
				return _options
			required: true
		filters: 
			label: "过滤条件"
			type: "[Object]"
			# omit: true
		# "filters.$":
		# 	blackbox: true
		# 	omit: true
		"filters.$.field": 
			label: "字段名"
			type: "text"
		"filters.$.operation": 
			label: "操作符"
			type: "select"
			defaultValue: "="
			options: ()->
				return Creator.getFieldOperation()
		"filters.$.value": 
			label: "字段值"
			# type: "text"
			blackbox: true
		organizations:
			label: "授权组织"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			defaultValue: []
		users:
			label: "授权用户"
			type: "lookup"
			reference_to: "users"
			multiple: true
			defaultValue: []
		permissions:
			label: "访问权限"
			type: "select"
			sortable: true
			defaultValue: "r"
			hidden: true
			options: [
				{label: "只读", value: "r"},
				{label: "读写", value: "w"},
			]
	list_views:
		all:
			label: "所有共享规则"
			filter_scope: "space"
			columns: ["name", "object_name"]
		mine:
			label: "我的共享规则"
			filter_scope: "mine"
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 

	triggers:
		"after.insert.server.sharing":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				object_name = doc.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_shares
					# 查找出所有满足条件的记录，并同步相关共享规则
					collection = Creator.getCollection(object_name)
					selector = { space: doc.space }
					if doc.filters
						filters = Creator.formatFiltersToMongo(doc.filters)
						selector["$and"] = filters
					push = { sharing: { "u": doc.users, "o": doc.organizations, "p": doc.permissions, "r": doc._id } }
					collection.direct.update(selector, {$push: push}, {multi: true})

		"after.update.server.sharing":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				object_name = doc.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_shares
					# 查找出所有满足条件的记录，并同步相关共享规则
					collection = Creator.getCollection(object_name)
					preObjectName = this.previous.object_name
					if preObjectName != object_name
						# 如果修改了object_name，则应该移除老的object_name对应的记录中的共享规则
						preCollection = Creator.getCollection(preObjectName)
					else
						preCollection = collection
					selector = { space: doc.space, "sharing": { $elemMatch: { r:doc._id } } }
					pull = { sharing: { r:doc._id } }
					preCollection.direct.update(selector, {$pull: pull}, {multi: true})
					selector = { space: doc.space }
					if doc.filters
						filters = Creator.formatFiltersToMongo(doc.filters)
						selector["$and"] = filters
					push = { sharing: { "u": doc.users, "o": doc.organizations, "p": doc.permissions, "r": doc._id } }
					collection.direct.update(selector, {$push: push}, {multi: true})
		"after.remove.server.sharing":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				object_name = doc.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_shares
					# 移除当前共享规则相关的所有记录的共享规则数据
					collection = Creator.getCollection(object_name)
					selector = { space: doc.space, "sharing": { $elemMatch: { r:doc._id } } }
					pull = { sharing: { r:doc._id } }
					collection.direct.update(selector, {$pull: pull}, {multi: true})