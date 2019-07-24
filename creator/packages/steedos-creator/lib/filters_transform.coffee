@FiltersTransform = {}

getOperation = (type)->
	if ["date", "datetime", "currency", "number"].includes(type)
		return "between"
	else if ["text", "textarea", "html"].includes(type)
		return "contains"
	else
		return "="

FiltersTransform.queryToFilters = (standard_query)->
	if !standard_query
		return
	query = standard_query.query
	object_name = standard_query.object_name
	object_fields = Creator.getObject(object_name).fields
	filters = []
	_.each query, (v, k)->
		if object_fields[k]
			type = object_fields[k].type
			if ["date", "datetime", "currency", "number"].includes(type)
				filters.push({field: k, operation: getOperation(type), start_value: v, value: [v]})
			else if ["text", "textarea", "html"].includes(type)
				if _.isString(v)
					filters.push({field: k, operation: getOperation(type), value: v})
				else if _.isArray(v)
					filters.push({field: k, operation: "=", value: v})
			else if ["boolean"].includes(type)
				filters.push({field: k, operation: "=", value: v})
			else
				filters.push({field: k, operation: getOperation(type), value: v})
		else
			k = k.replace(/(_endLine)$/, "")
			type = object_fields[k].type
			if object_fields[k] and ["date", "datetime", "currency", "number"].includes(type)
				filter = _.find(filters, (f)->
					return f.field == k
				)
				if filter
					console.log('filter', filter);
					filter.end_value = v
					filter.value.push(v)
				else
					filters.push({field: k, operation: getOperation(type), end_value: v, value: [null, v]})

	return filters