Creator.Objects.permission_share = 
	name: "permission_share"
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
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options
			required: true
		filter_scope:
			label: "过虑范围"
			type: "select"
			defaultValue: "space"
			# omit: true
			options: [
				{label: "所有", value: "space"},
				{label: "与我相关", value: "mine"}
			]
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

		"after.update.server.sharing":
			on: "server"
			when: "after.update"
			# todo: (userId, doc)->
			todo: (userId, doc, fieldNames, modifier, options)->
				# db = Creator.getCollection(doc.object_name)
				console.log "after.update.server.sharing======doc:", doc
				# console.log "after.update.server.sharing======fieldNames:", fieldNames
				# console.log "after.update.server.sharing======modifier:", modifier
				# console.log "after.update.server.sharing======options:", options
				console.log "after.update.server.sharing======this.previous:", this.previous
				console.log "after.update.server.sharing======this.previous2:", JSON.stringify(this.previous)
		"after.remove.server.sharing":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->