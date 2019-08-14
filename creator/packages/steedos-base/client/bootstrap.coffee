Creator.bootstrapLoaded = new ReactiveVar(false)

Creator.bootstrap = (spaceId, callback)->
	if Meteor.loggingIn() || Meteor.loggingOut()
		return
	unless spaceId and Meteor.userId()
		return
	Creator.bootstrapLoaded.set(false)
	url = Steedos.absoluteUrl "/api/bootstrap/#{spaceId}"
	$.ajax
		type: "get"
		url: url
		dataType: "json"
		#contentType: "application/json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
		error: (jqXHR, textStatus, errorThrown) ->
				error = jqXHR.responseJSON
				console.error error
				if error?.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error?.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)
		success: (result) ->
			# if result.space._id != spaceId
			# 	Steedos.setSpaceId(result.space._id)

			Creator.Objects = result.objects
			object_listviews = result.object_listviews
			Creator.object_workflows = result.object_workflows
			isSpaceAdmin = Steedos.isSpaceAdmin()

			Session.set "user_permission_sets", result.user_permission_sets

			_.each Creator.Objects, (object, object_name)->
				_object_listviews = object_listviews[object_name]
				_.each _object_listviews, (_object_listview)->
					if _.isString(_object_listview.options)
						_object_listview.options = JSON.parse(_object_listview.options)
					if _object_listview.api_name
						_key = _object_listview.api_name
					else
						_key = _object_listview._id
					object.list_views[_key] = _object_listview
				Creator.loadObjects object, object_name

			_.each result.apps, (app, key) ->
				if !app._id
					app._id = key
				if app.is_creator
					if isSpaceAdmin
						# 如果是工作区管理员应该强制把is_creator的应该显示出来
						app.visible = true
				else
					# 非creator应该一律不显示
					app.visible = false
			
			sortedApps = _.sortBy _.values(result.apps), 'sort'
			# 按钮sort排序次序设置Creator.Apps值
			Creator.Apps = {}
			adminApp = {}
			_.each sortedApps, (n) ->
				if n._id == "admin"
					adminApp = n
				else
					Creator.Apps[n._id] = n
			
			# admin菜单显示在最后
			Creator.Apps.admin = adminApp

			apps = result.assigned_apps
			if apps.length
				_.each Creator.Apps, (app, key)->
					if apps.indexOf(key) > -1
						app.visible = app.is_creator
					else
						app.visible = false
			
			Creator.Menus = result.assigned_menus

			if _.isFunction(callback)
				callback()

			Creator.bootstrapLoaded.set(true)

Meteor.startup ->
	Tracker.autorun ->
		spaceId = Session.get("spaceId")
		Creator.bootstrap spaceId, ()->
			return
		Setup.validate()
