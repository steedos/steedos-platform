Meteor.methods
	archive_renew: (selectedIds,space) ->
		console.log selectedIds
		selectedIds.forEach (selectedId)->
			collection = Creator.Collections["archive_borrow"]
			doc = collection.findOne({_id:selectedId})
			now = new Date()
			doc.start_date = now
			doc.end_date =new Date(now.getTime()+7*24*3600*1000)
			collection.remove({_id:selectedId},(error,result)->
				if !error
					collection.insert doc
					return result
				else
					return error
				)