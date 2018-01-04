recent_aggregate = (created_by, _records, callback)->
	Creator.Collections.object_recent_viewed.rawCollection().aggregate [
		{$match: {created_by: created_by}},
		{$group: {_id: {object_name: "$object_name", record_id: "$record_id"}, maxCreated: {$max: "$created"}}},
		{$sort: {maxCreated: -1}},
		{$limit: 10}
	], (err, data)->
		if err
			throw new Error(err)

		data.forEach (doc) ->
			_records.push doc._id

		if callback && _.isFunction(callback)
			callback()
		return

async_recent_aggregate = Meteor.wrapAsync(recent_aggregate)

Meteor.methods
	'object_recent_record': ()->
		data = new Array()
		records = new Array()

		async_recent_aggregate(this.userId, records)

		records.forEach (item)->

			record_object = Creator.getObject(item.object_name)

			record_object_collection = Creator.getCollection(item.object_name)

			fields = {_id: 1}

			fields[record_object.NAME_FIELD_KEY] = 1

			if record_object && record_object_collection
				record = record_object_collection.findOne(item.record_id, {fields: fields})
				if record
					record._object_name = item.object_name
					data.push record

		return data