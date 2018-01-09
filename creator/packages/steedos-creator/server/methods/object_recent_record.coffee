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

search_object = (space, object_name, searchText)->
	data = new Array()

	if searchText

		_object = Creator.getObject(object_name)

		_object_collection = Creator.getCollection(object_name)

		if _object && _object_collection

			_object_name_key = _object.NAME_FIELD_KEY

			query = {}

			search_Keywords = searchText.split(" ")

			query_and = []

			search_Keywords.forEach (keyword)->
				subquery = {}
				subquery[_object_name_key] = {$regex: keyword.trim()}
				query_and.push subquery

			query.$and = query_and
			query.space = {$in: [space]}

			fields = {_id: 1}
			fields[_object_name_key] = 1

			records = _object_collection.find(query, {fields: fields, sort: {modified: -1}, limit: 5})

			records.forEach (record)->
				data.push {_id: record._id, _name: record[_object_name_key], _object_name: object_name}

	return data

Meteor.methods
	'object_recent_record': ()->
		data = new Array()
		records = new Array()

		async_recent_aggregate(this.userId, records)

		records.forEach (item)->

			record_object = Creator.getObject(item.object_name)

			record_object_collection = Creator.getCollection(item.object_name)

			if record_object && record_object_collection
				fields = {_id: 1}

				fields[record_object.NAME_FIELD_KEY] = 1

				record = record_object_collection.findOne(item.record_id, {fields: fields})
				if record
					data.push {_id: record._id, _name: record[record_object.NAME_FIELD_KEY], _object_name: item.object_name}

		return data

	'object_record_search': (options)->
		data = new Array()

		searchText = options.searchText
		space = options.space

		_.forEach Creator.objectsByName, (_object, name)->
			if _object.enable_search
				object_record = search_object(space, _object.name, searchText)
				data = data.concat(object_record)

		return data
