recent_aggregate = (created_by, _records, callback)->
	Creator.Collections.object_recent_viewed.rawCollection().aggregate [
		{$match: {created_by: created_by}},
		{$group: {_id: {object_name: "$record.o", record_id: "$record.ids"}, maxCreated: {$max: "$created"}}},
		{$sort: {maxCreated: -1}},
		{$limit: 10}
	], (err, data)->
		if err
			throw new Error(err)

		data.forEach (doc) ->
			console.log "doc", doc
			_records.push doc._id

		if callback && _.isFunction(callback)
			callback()
		return

async_recent_aggregate = Meteor.wrapAsync(recent_aggregate)

search_object = (space, object_name,userId, searchText)->
	data = new Array()

	if searchText
		_object = Creator.getObject(object_name)	 	
		permissions = Creator.getObjectPermissions(space, userId,object_name)
		_object_collection = Creator.getCollection(object_name)
		if permissions.allowRead or permissions.viewAllRecords
			if _object && _object_collection
				query = {}
				query_or = []
				_object_name_key = ''
				objFields = Creator.getObject(object_name).fields
				read_fields = permissions.readable_fields
				fields = {_id: 1}
				_.each objFields, (field,field_name)->
					if field.searchable
						subquery = {}
						if read_fields.indexOf(field_name)> -1
							fields[field_name] = 1
							if field.is_name
								_object_name_key = field_name
						search_Keywords = searchText.split(" ")
						search_Keywords.forEach (keyword)->	
							subquery[field_name] = {$regex: keyword.trim()}
							query_or.push subquery
				if query_or.length>0
					query.$or = query_or
					query.space = {$in: [space]}
					if not permissions.viewAllRecords
						if permissions.allowRead
							query.owner = userId
					records = _object_collection.find(query, {fields: fields, sort: {modified: -1}, limit: 5}).fetch()
					records.forEach (record)->
						data.push {_id: record._id, _name: record[_object_name_key], _object_name: object_name}

	return data

Meteor.methods
	'object_recent_record': ()->
		data = new Array()
		records = new Array()

		async_recent_aggregate(this.userId, records)

		records.forEach (item)->
			console.log item
			record_object = Creator.getObject(item.object_name)

			if !record_object
				return

			record_object_collection = Creator.getCollection(item.object_name)

			if record_object && record_object_collection
				fields = {_id: 1}

				fields[record_object.NAME_FIELD_KEY] = 1

				record = record_object_collection.findOne(item.record_id[0], {fields: fields})
				if record
					data.push {_id: record._id, _name: record[record_object.NAME_FIELD_KEY], _object_name: item.object_name}

		return data

	'object_record_search': (options)->
		self = this

		data = new Array()

		searchText = options.searchText
		space = options.space

		_.forEach Creator.objectsByName, (_object, name)->
			if _object.enable_search
				object_record = search_object(space, _object.name, self.userId, searchText)
				data = data.concat(object_record)

		return data
