Meteor.methods
	archive_transfer: (selectedIds) ->
		selectedIds.forEach (selectedId)->
			collection = Creator.Collections["archive_records"]
			collection.update({_id:selectedId},{$set:{is_transfer:false,transfered_by:Meteor.userId()}})