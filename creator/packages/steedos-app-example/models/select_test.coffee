if Meteor.isDevelopment
	Creator.Objects.selectTest =
		name: "selectTest"
		label: "selectTest"
		icon: "forecasts"
		enable_files: true
		enable_api: true
		fields:
			name:
				label: "名称"
				type: "text"
				defaultValue: ""
				description: ""
				inlineHelpText: ""
				required: true
#			select:
#				label: "Select"
#				type: "select"
#				multiple: true
#				options: ()->
#					return [{label: "A", value: "a"}, {label: "B", value: "b"}]
			objects:
				label: "对象"
				type: "lookup"
				reference_to: "objects"
				required: true
				multiple: true
				optionsFunction: ()->
					_options = []
					_.forEach Creator.objectsByName, (o, object_name)->
						_options.push {label: o.label, value: o.name, icon: o.icon}
					return _options
#			create:
#				label: "创建",
#				type: "lookup"
#				reference_to: "objects"
#				create: true
#				createFunction: (lookup_field)->
#					console.log("createFunction...")
#					Modal.show("CreatorObjectModal", {
#						collection: 'Creator.Collections.objects',
#						formId: "newObject",
#						object_name: "objects",
#						operation: "insert",
#						onSuccess: (operation, result)->
#							console.log("result", result)
#							lookup_field.addItems([{label:result.value.name, value: result._id}], result._id)
#					})
		list_views:
			recent:
				filter_scope: "space"
				columns: ["name", "objects"]
			all:
				filter_scope: "space"
				columns: ["name", "objects"]
			mine:
				filter_scope: "mine"
