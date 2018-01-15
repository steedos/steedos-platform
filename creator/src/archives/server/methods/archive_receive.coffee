Meteor.methods
	archive_receive: (selectedIds) ->
		selectedIds.forEach (selectedId)->
			collection = Creator.Collections["archive_records"]
			collection.update({_id:selectedId},{$set:{is_received:true,received:new Date(),received_by:Meteor.userId()}})