db.apps = new Meteor.Collection('apps')

# db.apps._simpleSchema = new SimpleSchema

Creator.Objects.apps = 
	name: "apps"
	label: "应用"
	icon: "apps"
	fields:
		name: 
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
		url:
			label: "链接"
			type: "url"
			required: true
		icon:
			label: "图标"
			type:'text'
			required: true
			defaultValue: "ion-ios-color-filter-outline"
		icon_slds:
			label: "图标"
			type: "lookup"
			optionsFunction: ()->
				options = []
				_.forEach Creator.resources.sldsIcons.standard, (svg)->
					options.push {value: svg, label: svg, icon: svg}
				return options
		description:
			label: "描述"
			type: "textarea"
			is_wide: true
		objects:
			label: "对象"
			type: "lookup"
			required: true
			multiple: true
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, object_name)->
					_options.push {label: o.label, value: o.name, icon: o.icon}
				return _options
		visible:
			label: "是否可见"
			type: "boolean"
		sort:
			label: "排序"
			type: "number"
			defaultValue: 9100
		is_creator:
			type:"boolean"
			label: "creator应用"
			defaultValue:true
		unique_id:
			type: 'text',
			hidden: true
		version:
			type: 'text',
			hidden: true
		from:
			type: 'select',
			options: '默认:0,定制:1,商城:2'
			hidden: true
		auth_name:
			label: "验证域名"
			type:'text'
		secret:
			label: "API 密钥"
			type:'text'
			max: 16
			min: 16
			is_wide:true
		mobile:
			type: "boolean"
			label: "在移动应用中显示"
			defaultValue: false
		is_use_ie: 
			type: "boolean"
			label: "使用IE打开(需使用Steedos桌面客户端)"
			defaultValue: false
		is_use_iframe: 
			type: "boolean"
			label: "使用iframe打开"
			defaultValue: false
		is_new_window:
			type: "boolean"
			label: "新窗口打开"
			defaultValue: false
		on_click:
			type:'textarea'
			label: "链接脚本"
			rows: 10
			is_wide:true
		members:
			type: 'object',
			label: "授权对象"
			is_wide:true
		"members.users": 
			type: "lookup"
			label: "授权人员"
			reference_to: "users"
			multiple: true
		"members.organizations": 
			type: "lookup"
			label: "授权部门"
			reference_to: "organizations"
			multiple: true

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["name", "objects", "visible", "sort"]
	
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
	
	triggers:
		"before.insert.server.apps": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)-> 
				doc.icon = doc.icon_slds
		"after.update.server.apps":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.icon_slds
					Creator.getCollection("apps").direct.update({_id: doc._id}, {$set:	{icon:modifier.$set.icon_slds}}) 



# if Meteor.isClient
# 	db.apps._simpleSchema.i18n("apps")

# db.apps.attachSchema db.apps._simpleSchema;

db.apps.isInternalApp = (url) ->
	if url and db.apps.INTERNAL_APPS
		for app_url in db.apps.INTERNAL_APPS
			if url.startsWith(app_url)
				return true
	return false

if Meteor.isServer
	db.apps.allow 
		insert: (userId, doc) ->
			if (!Steedos.isSpaceAdmin(doc.space, userId))
				return false
			else
				return true

		update: (userId, doc) ->
			if (!Steedos.isSpaceAdmin(doc.space, userId))
				return false
			else
				return true

		remove: (userId, doc) ->
			if (!Steedos.isSpaceAdmin(doc.space, userId))
				return false
			else
				return true

if Meteor.isServer

	# db.apps.before.insert (userId, doc) ->
	# 	doc.internal = db.apps.isInternalApp(doc.url)
	# 	return

	db.apps.before.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {};
		# modifier.$unset = modifier.$unset || {};

		# if modifier.$set.url
		# 	modifier.$set.internal = db.apps.isInternalApp(modifier.$set.url)
		# 	delete modifier.$unset.internal

