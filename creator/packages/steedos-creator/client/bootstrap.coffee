Creator.isLoadingSpace = new ReactiveVar(true)

Creator.bootstrap = (callback)->
	Creator.isLoadingSpace.set(true)
	spaceId = Session.get("spaceId")
	unless spaceId
		return
	Meteor.call "creator.bootstrap", spaceId, (error, result)->
		if error or !result
			console.log error
		else
			if result.space._id != spaceId
				Steedos.setSpaceId(result.space._id)

			Creator.Objects = result.objects

			_.each Creator.Objects, (object, object_name)->
				Creator.loadObjects object, object_name

			_.each result.objects, (res_object, object_name)->
				if object_name == "contacts"
					console.log "_.each result.objects,contacts:", res_object
				object = Creator.getObject(object_name)
				permissions = res_object.permissions
				unless object
					return
				object.permissions.set(permissions)
				_.each object.fields, (field, field_name)->
					f = object.fields[field_name]
					if f and !f.omit
						fs = object.schema._schema[field_name]
						if !fs.autoform
							fs.autoform = {}
						if _.indexOf(permissions.readable_fields, field_name) > -1
							field.hidden = false
							field.omit = false
							fs.autoform.omit = false
							if _.indexOf(permissions.editable_fields, field_name) < 0
								f.readonly = true
								fs.autoform.readonly = true
								fs.autoform.disabled = true
						else
							field.hidden = true
							field.omit = true
							fs.autoform.omit = true

			_.each result.assigned_apps, (app_name)->
				Creator.Apps[app_name]?.visible = true

		if _.isFunction(callback)
			callback()

		Creator.isLoadingSpace.set(false)

Meteor.startup ->
	Tracker.autorun ->
		Creator.objects_initialized.set(false)
		Creator.bootstrap ()->
			Creator.objects_initialized.set(true)