Meteor.methods
	"creator.object_options": (options)->
		if options?.params?.reference_to
			query = {}
			if options.params.space
				query.space =
					$in: [null, options.params.space]
				if options.searchText 
					query.name = {$regex: options.searchText}
				collection = Creator.Collections[options.params.reference_to]
				if collection
					records = collection.find(query, {limit: 10}).fetch()
					results = []
					_.each records, (record)->
						results.push
							label: record.name
							value: record._id
					return results

		return [] 