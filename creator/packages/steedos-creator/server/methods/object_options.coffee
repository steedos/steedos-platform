Meteor.methods
	"creator.object_options": (options)->
		if options?.params?.reference_to
			query = {}
			if options.params.space
				query.space =
					$in: [null, options.params.space]

				selected = options?.selected || []

				if options?.values?.length
					if options.searchText
						query.$or = [{_id: {$in: options.values}}, {name:{$regex: options.searchText}}]
					else
						query.$or = [{_id: {$in: options.values}}]
				else
					if options.searchText
						query.name = {$regex: options.searchText}
					query._id = {$nin: selected}

				collection = Creator.Collections[options.params.reference_to]

				if options.filterQuery
					_.extend query, options.filterQuery

				if collection
					records = collection.find(query, {limit: 10}).fetch()
					results = []
					_.each records, (record)->
						results.push
							label: record.name
							value: record._id
					return results
		return [] 