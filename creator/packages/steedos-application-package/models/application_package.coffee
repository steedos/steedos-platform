Creator.Objects.application_package =
	name: "application_package"
	icon: "custom.custom42"
	label: "软件包"
	fields:
		name:
			type: "text"
		apps:
			type: "lookup"
			label: "应用"
			type: "lookup"
			reference_to: "apps"
			multiple: true
			optionsFunction: ()->
				_options = []
				_.forEach Creator.Apps, (o, k)->
					_options.push {label: o.name, value: k, icon: o.icon_slds}
				return _options
		objects:
			type: "lookup"
			label: "对象"
			reference_to: "objects"
			multiple: true
			required: true
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, k)->
					if !o.hidden
						_options.push { label: o.label, value: k, icon: o.icon }
				return _options

		list_views:
			type: "lookup"
			multiple: true
			defaultIcon: "lead_list"
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				list_views = _object.list_views
				_.forEach list_views, (f, k)->
					if k != "default" and (!_.has(f, "shared") || f.shared)
						_options.push {label: f.label || f.name || k, value: f._id}
				return _options
		permission_set:
			type: "lookup"
			multiple: true
			reference_to: "permission_set"
		permission_objects:
			type: "lookup"
			multiple: true
			reference_to: "permission_objects"
		reports:
			type: "lookup"
			multiple: true
			reference_to: "reports"
	list_views:
		all:
			columns: ["name"]
			filter_scope: "space"
	actions:
		export:
			label: "导出"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				console.log("导出#{object_name}->#{record_id}")
				url = Steedos.absoluteUrl "/api/creator/app_package/export/#{Session.get("spaceId")}/#{record_id}"
				window.open(url)
#				$.ajax
#					type: "post"
#					url: url
#					dataType: "json"
#					beforeSend: (request) ->
#						request.setRequestHeader('X-User-Id', Meteor.userId())
#						request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
#					error: (jqXHR, textStatus, errorThrown) ->
#						error = jqXHR.responseJSON
#						console.error error
#						if error?.reason
#							toastr?.error?(TAPi18n.__(error.reason))
#						else if error?.message
#							toastr?.error?(TAPi18n.__(error.message))
#						else
#							toastr?.error?(error)
#					success: (result) ->
#						console.log("result...................#{result}")

		import:
			label: "导入"
			visible: true
			on: "list"
			todo: (object_name)->
				console.log("object_name", object_name)
				Modal.show("APPackageImportModal")
