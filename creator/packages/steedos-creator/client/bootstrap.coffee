Creator.isLoadingSpace = new ReactiveVar(true)

Meteor.startup ->
	Tracker.autorun ->
		Creator.isLoadingSpace.set(true)
		Meteor.call "creator.bootstrap", Session.get("spaceId"), (error, result)->
			if error or !result
				console.log error
			else
				if result.space._id != Session.get("spaceId")
					Steedos.setSpaceId(result.space._id)
				_.each result.objects, (permissions, object_name)->
					object = Creator.getObject(object_name)
					unless object
						return
					object.permissions.set(permissions)
					if permissions.fields?.length
						_.each object.fields, (field, field_name)->
							fs = object.schema._schema[field_name]
							if !fs.autoform
								fs.autoform = {}
							if _.indexOf(permissions.fields, field_name)>=0
								field.hidden = false
								field.omit = false
								fs.autoform.omit = false
							else
								field.hidden = true
								field.omit = true
								fs.autoform.omit = true
					else
						permissions.fields = _.keys(object.fields)
					_.each permissions.readonly_fields, (field_name)->
						f = object.fields[field_name]
						if f
							fs = object.schema._schema[field_name]
							if !fs.autoform
								fs.autoform = {}
							f.readonly = true
							fs.autoform.readonly = true
							fs.autoform.disabled = true

				_.each result.assigned_apps, (app_name)->
					Creator.Apps[app_name]?.visible = true

			Creator.isLoadingSpace.set(false)