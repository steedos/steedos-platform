Meteor.methods
	archive_export: (object_name) ->
		result = Creator.Export2xml(object_name)
		return result