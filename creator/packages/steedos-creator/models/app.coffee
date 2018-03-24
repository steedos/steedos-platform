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
				appsObjects = Creator.getAppsObjects()
				allObjects = _.keys(Creator.objectsByName)
				unusedObjects = _.difference allObjects, appsObjects
				_options = []
				_.forEach unusedObjects, (object_name)->
					o = Creator.getObject(object_name)
					if o.space == Session.get("spaceId")
						_options.push {label: o.label, value: o.name, icon: o.icon}
				return _options
		visible:
			type: "boolean"
		sort:
			type: "number"
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