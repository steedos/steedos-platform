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
		icon:
			type: "text"
		icon_slds:
			type: "text"
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
			type: "boolean"
		sort:
			type: "number"
		secret:
			type: String
			max: 16
			min: 16
			optional: true
	list_views:
		default:
			columns: ["name"]
		all:
			filter_scope: "spacex"
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