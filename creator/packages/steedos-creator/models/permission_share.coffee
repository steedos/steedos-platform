Creator.Objects.permission_shares = 
	name: "permission_shares"
	label: "共享规则"
	icon: "assigned_resource"
	fields:
		name: 
			label: "名称"
			type: "text"
			required: true
			searchable:true
			index:true
		object_name: 
			label: "对象"
			type: "lookup"
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, k)->
					if o.enable_share and !o.hidden
						_options.push { label: o.label, value: k, icon: o.icon }
				return _options
			required: true
		filters: 
			label: "过滤条件"
			type: "grid"
			# omit: true
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
		"before.insert.server.sharing":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if _.isEmpty(doc.organizations) and _.isEmpty(doc.users)
					throw new Meteor.Error 500, "请在授权组织或授权用户中至少填写一个值"

		"before.update.server.sharing":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				errMsg = t "creator_permission_share_miss"
				if fieldNames.length == 1
					if fieldNames.indexOf("organizations") > -1
						if _.isEmpty(modifier.$set.organizations) and _.isEmpty(doc.users)
							throw new Meteor.Error 500, errMsg
					else if fieldNames.indexOf("users") > -1
						if _.isEmpty(doc.organizations) and _.isEmpty(modifier.$set.users)
							throw new Meteor.Error 500, errMsg
				else if _.isEmpty(modifier.$set.organizations) and _.isEmpty(modifier.$set.users)
					throw new Meteor.Error 500, errMsg
					
		"after.insert.server.sharing":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				object_name = doc.object_name
				# 查找出所有满足条件的记录，并同步相关共享规则
				collection = Creator.getCollection(object_name)
				# 批量更新数据需要调用mongo的initializeUnorderedBulkOp函数优化性能
				bulk = collection.rawCollection().initializeUnorderedBulkOp()
				selector = { space: doc.space }
				if doc.filters
					filters = Creator.formatFiltersToMongo(doc.filters, { extend: false })
					selector["$and"] = filters
				push = { sharing: { "u": doc.users, "o": doc.organizations, "r": doc._id } }
				bulk.find(selector).update({$push: push})
				# collection.direct.update(selector, {$push: push}, {multi: true})
				bulk.execute()

		"after.update.server.sharing":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				object_name = doc.object_name
				# 查找出所有满足条件的记录，并同步相关共享规则
				collection = Creator.getCollection(object_name)
				preObjectName = this.previous.object_name
				if preObjectName != object_name
					# 如果修改了object_name，则应该移除老的object_name对应的记录中的共享规则
					preCollection = Creator.getCollection(preObjectName)
				else
					preCollection = collection
				# 批量更新数据需要调用mongo的initializeUnorderedBulkOp函数优化性能
				preBulk = preCollection.rawCollection().initializeUnorderedBulkOp()
				bulk = collection.rawCollection().initializeUnorderedBulkOp()
				selector = { space: doc.space, "sharing": { $elemMatch: { r:doc._id } } }
				pull = { sharing: { r:doc._id } }
				preBulk.find(selector).update({$pull: pull})
				# preCollection.direct.update(selector, {$pull: pull}, {multi: true})
				preBulk.execute()
				selector = { space: doc.space }
				if doc.filters
					filters = Creator.formatFiltersToMongo(doc.filters, { extend: false })
					selector["$and"] = filters
				push = { sharing: { "u": doc.users, "o": doc.organizations, "r": doc._id } }
				bulk.find(selector).update({$push: push})
				# collection.direct.update(selector, {$push: push}, {multi: true})
				bulk.execute()

		"after.remove.server.sharing":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				object_name = doc.object_name
				# 移除当前共享规则相关的所有记录的共享规则数据
				collection = Creator.getCollection(object_name)
				# 批量更新数据需要调用mongo的initializeUnorderedBulkOp函数优化性能
				bulk = collection.rawCollection().initializeUnorderedBulkOp()
				selector = { space: doc.space, "sharing": { $elemMatch: { r:doc._id } } }
				pull = { sharing: { r:doc._id } }
				bulk.find(selector).update({$pull: pull})
				# collection.direct.update(selector, {$pull: pull}, {multi: true})
				bulk.execute()
				