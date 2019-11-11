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

getQueryFiltersStr = (query, search_field)->
	filtersStr = "";
	if query && search_field
		query = query.replace(new RegExp('\''), '')
		_.each query.split(' '), (text)->
			if !_.isEmpty(text)
				filtersOrStr = "";
				_.each search_field.split(','), (field)->
					if !_.isEmpty(field)
						if _.isEmpty(filtersOrStr)
							filtersOrStr = "(contains(tolower(#{field}), '#{encodeURIComponent(Creator.convertSpecialCharacter(text))}'))"
						else
							filtersOrStr = "#{filtersOrStr} or " + "(contains(tolower(#{field}), '#{encodeURIComponent(Creator.convertSpecialCharacter(text))}'))"

				if !_.isEmpty(filtersOrStr)
					if _.isEmpty(filtersStr)
						filtersStr = filtersOrStr
					else
						filtersStr = "#{filtersStr} and #{filtersOrStr}"
	return filtersStr
DataSource.Odata.lookup_options = (options)->
	object = Creator.getObject(options.params.reference_to, options.params.space)
	name_field_key = object.NAME_FIELD_KEY
	idFieldName = object.idFieldName
	query = {}
	if options.params.space
		query.space = options.params.space
		sort = options?.sort
		selected = options?.selected || []
		options_limit = options?.options_limit || 10

		filters = []
#		console.log('options.filterQuery', options.filterQuery);
		if !_.isEmpty(options.filterQuery)
			if(!_.isString(options.filterQuery) && !_.isArray(options.filterQuery))
				_fqstring = [];
				_.each(options.filterQuery, (v, k)->
					_fqstring.push("(#{k} #{_.keys(v)[0]} '#{_.values(v)[0]}')")
				)
				filters.push "(#{_fqstring.join(' and ')})"
			else
				filters.push(options.filterQuery)
		searchFilter = ""
		valueFilter = []
		selectedFilter = []

		if options.searchText
			searchFilter = getQueryFiltersStr(options.searchText.trim(), name_field_key)

		if options?.values?.length
			_.each options.values, (item)->
				valueFilter.push("(#{idFieldName} eq '#{item}')")
			filters.push "(#{valueFilter.join(' or ')})"
		else
			if selected.length > 0
				_.each selected, (item)->
					selectedFilter.push("(#{idFieldName} ne '#{item}')")
				filters.push "(#{selectedFilter.join(' and ')})"
			if searchFilter
				filters.push searchFilter

		odataOptions = {
			$top: options_limit,
			$select: "#{name_field_key}"
		};

		if !object.database_name || object.database_name == 'meteor-mongo'
			odataOptions.$orderby = 'created desc'

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