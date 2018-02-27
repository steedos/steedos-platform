Meteor.methods
	'report_data': (options)->
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

		# if filters and filters.length > 0
		# 	filters = _.map filters, (obj)->
		# 		return [obj.field, obj.operation, obj.value]
			
		# 	filters = Creator.formatFiltersToMongo(filters)
		# 	# if filters.field
		selector["$and"] = filters
		cursor = Creator.getCollection(object_name).find(selector, fields: filterFields)
		if cursor.count() > 10000
			return []
		result = cursor.fetch()
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
					unless item[itemKey]
						item[itemKey] = "--"
				return item
			return result
		else
			return result

