Meteor.methods
	# 用户获取lookup 、master_detail类型字段的选项值
	"creator.object_options": (options)->
		if options?.params?.reference_to

			object = Creator.getObject(options.params.reference_to)

			name_field_key = object.NAME_FIELD_KEY

			query = {}
			if options.params.space
				query.space = options.params.space

				sort = options?.sort

				selected = options?.selected || []

				if options.searchText
					searchTextQuery = {}
					searchTextQuery[name_field_key] = {$regex: options.searchText}

				if options?.values?.length
					if options.searchText
						query.$or = [{_id: {$in: options.values}}, searchTextQuery]
					else
						query.$or = [{_id: {$in: options.values}}]
				else
					if options.searchText
						_.extend(query, searchTextQuery)
					query._id = {$nin: selected}

				collection = object.db

				if options.filterQuery
					_.extend query, options.filterQuery

				query_options = {limit: 10}

				if sort && _.isObject(sort)
					query_options.sort = sort

				if collection
					try
						records = collection.find(query, query_options).fetch()
						results = []
						_.each records, (record)->
							results.push
								label: record[name_field_key]
								value: record._id
						return results
					catch e
						throw new Meteor.Error 500, e.message + "-->" + JSON.stringify(options)
		return [] 