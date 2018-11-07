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
			type: "url"
			required: false
			hidden: true
		icon:
			type:'text'
			hidden:true
		icon_slds:
			label: "图标"
			type: "lookup"
			optionsFunction: ()->
				options = []
				_.forEach Creator.resources.sldsIcons.standard, (svg)->
					options.push {value: svg, label: svg, icon: svg}
				return options
		description:
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
			label: "可见性"
			type: "boolean"
		sort:
			type: "number"
			defaultValue: 9100
		is_creator:
			type:"boolean"
			label: "creator应用"
			hidden:true
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