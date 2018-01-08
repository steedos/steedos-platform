Meteor.methods
	archive_destroy: (selectedIds) ->
		selectedIds.forEach (selectedId)->
			collection = Creator.Collections["archive_records"]
			collection.update({_id:selectedId},{$set:{is_destroy:false,destroyed_by:Meteor.userId()}})