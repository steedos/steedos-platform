Creator.Objects.application_package =
	name: "application_package"
	icon: "custom.custom42"
	label: "软件包"
	fields:
		name:
			type: "text"
			label: "名称"
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
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, k)->
					if !o.hidden
						_options.push { label: o.label, value: k, icon: o.icon }
				return _options

		list_views:
			type: "lookup"
			label: "列表视图"
			multiple: true
			reference_to: "object_listviews"
			optionsMethod: "creator.listviews_options"
		permission_set:
			type: "lookup"
			label: "权限组"
			multiple: true
			reference_to: "permission_set"
		permission_objects:
			type: "lookup"
			label: "权限集"
			multiple: true
			reference_to: "permission_objects"
		reports:
			type: "lookup"
			label: "报表"
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
