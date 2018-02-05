Meteor.methods
	'report_data': (options)->
		console.log "report_data,options:", options
		check(options, Object)
		space = options.space
		fields = options.fields
		object_name = options.object_name
		filter_scope = options.filter_scope
		filters = options.filters
		filterFields = {}
		compoundFields = []
		objectFields = Creator.getObject(object_name)?.fields
		_.each fields, (item, index)->
			splits = item.split(".")
			name = splits[0]
			objectField = objectFields[name]
			if splits.length > 1 and objectField
				childKey = item.replace name + ".", ""
				compoundFields.push({name: name, childKey: childKey, field: objectField})
			filterFields[name] = 1

		selector = {}
		userId = this.userId
		selector.space = space
		if filter_scope == "spacex"
			selector.space = 
				$in: [null,space]
		else if filter_scope == "mine"
			selector.owner = userId

		if filters and filters.length > 0
			filters = _.map filters, (obj)->
				query = {}
				if obj.operation == "EQUALS"
					query[obj.field] = 
						$eq: obj.value
				else if obj.operation == "NOT_EQUAL"
					query[obj.field] = 
						$ne: obj.value
				else if obj.operation == "LESS_THAN"
					query[obj.field] = 
						$lt: obj.value
				else if obj.operation == "GREATER_THAN"
					query[obj.field] = 
						$gt: obj.value
				else if obj.operation == "LESS_OR_EQUAL"
					query[obj.field] = 
						$lte: obj.value
				else if obj.operation == "GREATER_OR_EQUAL"
					query[obj.field] = 
						$gte: obj.value
				else if obj.operation == "CONTAINS"
					reg = new RegExp(obj.value, "i")
					query[obj.field] = 
						$regex: reg
				else if obj.operation == "NOT_CONTAIN"
					reg = new RegExp("^((?!" + obj.value + ").)*$", "i")
					query[obj.field] = 
						$regex: reg
				else if obj.operation == "STARTS_WITH"
					reg = new RegExp("^" + obj.value, "i")
					query[obj.field] = 
						$regex: reg
				return query
			selector["$and"] = filters

		result = Creator.getCollection(object_name).find(selector, fields: filterFields).fetch()
		if compoundFields.length
			result = result.map (item,index)->
				_.each compoundFields, (compoundFieldItem, index)->
					itemKey = compoundFieldItem.name + "*%*" + compoundFieldItem.childKey.replace(/\./g, "*%*")
					itemValue = item[compoundFieldItem.name]
					type = compoundFieldItem.field.type
					if ["lookup", "master_detail"].indexOf(type) > -1
						reference_to = compoundFieldItem.field.reference_to
						compoundFilterFields = {}
						compoundFilterFields[compoundFieldItem.childKey] = 1
						referenceItem = Creator.getCollection(reference_to).findOne {_id: itemValue}, fields: compoundFilterFields
						if referenceItem
							item[itemKey] = referenceItem[compoundFieldItem.childKey]
					else if type == "select"
						options = compoundFieldItem.field.options
						item[itemKey] = _.findWhere(options, {value: itemValue})?.label or itemValue
					else
						item[itemKey] = itemValue
				return item
			console.log "result:", result
			return result
		else
			return result

