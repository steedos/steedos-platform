# db.webhooks = new Meteor.Collection('webhooks')

# Creator.Objects.webhooks =
# 	name: "webhooks"
# 	icon: "metrics"
# 	label: "Webhooks"
# 	fields:
# 		flow:
# 			label: "流程"
# 			type: "lookup"
# 			reference_to: "flows"
# 			is_name: true
# 			required:true
# 			create: false

# 		payload_url:
# 			label: "URL"
# 			type: "text"
# 			regEx: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
# 			required:true

# 		content_type:
# 			label: "请求数据格式"
# 			type: "text"
# 			defaultValue: "application/json"
# 			hidden: true

# 		active:
# 			label: "激活"
# 			type: "boolean"
# 			defaultValue: false

# 		description:
# 			type: "text"
# 			label: "描述"

# 	list_views:
# 		all:
# 			label: "所有"
# 			filter_scope: "space"
# 			columns: ["flow","payload_url","active","description"]

# 	permission_set:
# 		user:
# 			allowCreate: false
# 			allowDelete: false
# 			allowEdit: false
# 			allowRead: true
# 			modifyAllRecords: false
# 			viewAllRecords: true
# 		admin:
# 			allowCreate: true
# 			allowDelete: true
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: true

# if Meteor.isServer
# 	db.webhooks._ensureIndex({
# 		"flow": 1
# 	},{background: true})

# 	db.webhooks.allow
# 		insert: (userId, doc) ->
# 			if (!Steedos.isSpaceAdmin(doc.space, userId))
# 				return false
# 			else
# 				return true

# 		update: (userId, doc) ->
# 			if (!Steedos.isSpaceAdmin(doc.space, userId))
# 				return false
# 			else
# 				return true

# 		remove: (userId, doc) ->
# 			if (!Steedos.isSpaceAdmin(doc.space, userId))
# 				return false
# 			else
# 				return true


# db.webhooks.helpers
# 	flow_name: ()->
# 		f = db.flows.findOne({_id: this.flow}, {fields: {name: 1}})
# 		return f && f.name

# new Tabular.Table
# 	name: "Webhooks",
# 	collection: db.webhooks,
# 	columns: [
# 		{
# 			data: "flow"
# 			render: (val, type, doc) ->
# 				f = db.flows.findOne({_id: doc.flow}, {fields: {name: 1}})
# 				return f && f.name
# 		}
# 		{
# 			data: "payload_url"
# 		}
# 		{
# 			data: "active"
# 		}
# 		{
# 			data: "description"
# 		}
# 	]
# 	dom: "tp"
# 	lengthChange: false
# 	ordering: false
# 	pageLength: 10
# 	info: false
# 	extraFields: ["space", "content_type"]
# 	searching: true
# 	autoWidth: false
# 	changeSelector: (selector, userId) ->
# 		unless userId
# 			return {_id: -1}
# 		return selector