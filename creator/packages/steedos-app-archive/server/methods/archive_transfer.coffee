Meteor.methods
	archive_transfer: (selectedIds) ->
		selectedIds.forEach (selectedId)->
			collection = Creator.Collections["archive_records"]
			collection.update({_id:selectedId,is_receive:true},{$set:{is_transfer:false,transfered_by:Meteor.userId()}},(error,result)->
				if !error
					return result
				else
					return error
				)