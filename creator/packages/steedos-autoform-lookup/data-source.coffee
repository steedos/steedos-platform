@DataSource = {}

DataSource.Odata = {}

DataSource.Method = {}

###
var searchVal = {
	searchText: searchText,
	values: values || [],
	params: params || null,
	selected: _.pluck(seleted, 'value'),
	filterQuery: filterQuery,
	options_limit: optionsLimit
};
###
DataSource.Odata.lookup_options = (options)->
	object = Creator.getObject(options.params.reference_to, options.params.space)
	name_field_key = object.NAME_FIELD_KEY
	query = {}
	if options.params.space
		query.space = options.params.space
		sort = options?.sort
		selected = options?.selected || []
		options_limit = options?.options_limit || 10

		filters = []
		console.log('options.filterQuery', options.filterQuery);
		if !_.isEmpty(options.filterQuery)
			filters.push(options.filterQuery)
		searchFilter = ""
		valueFilter = []
		selectedFilter = []

		if options.searchText
			searchFilter = "(contains(tolower(#{name_field_key}),'#{encodeURIComponent(Creator.convertSpecialCharacter(options.searchText))}'))"

		if options?.values?.length
			_.each options.values, (item)->
				valueFilter.push("(_id eq '#{item}')")
			filters.push "(#{valueFilter.join(' or ')})"
		else
			if selected.length > 0
				_.each selected, (item)->
					selectedFilter.push("(_id ne '#{item}')")
				filters.push "(#{selectedFilter.join(' and ')})"
			if searchFilter
				filters.push searchFilter

		odataOptions = {
			$top: options_limit,
			$orderby: 'created desc',
			$select: "#{name_field_key}"
		};

		orderby = []
		if sort && _.isObject(sort)
			_.each sort, (v, k) ->
				if k
					if v == -1
						orderby.push "#{k} desc"
					else if v == 1
						orderby.push "#{k} asc"

		if orderby.length > 0
			odataOptions.$orderby = orderby.join(",")

		if filters.length > 0
			odataOptions.$filter = "(#{filters.join(" and ")})"

		result = Creator.odata.query(object.name, odataOptions, true)

		options = []
		_.each result, (item)->
			options.push
				label: item[name_field_key]
				value: item._id
		return options

	return []

DataSource.Method.lookup_options = (methodName, searchVal, callback)->
	Meteor.call methodName, searchVal, callback