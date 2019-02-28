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

multiple: 多选。 false/true
defaultValue： 默认值。支持公式，eg: "{user.organization.name}" ，当前用户主部门。String
reference_to: 关联对象，从关联对象中选择记录。String/Array
depend_on: 相关项，用于filters、optionsFunction。值为表单上的字段，当depend_on中的字段值发生变化时，会清空当前字段值及选择项。Array
filters: 过滤器，按照配置的条件显示满足条件的选择项。eg: [["site", "$eq", "{site}"]]
optionsFunction: 返回options的函数，有一个参数 values, 可以获取当前记录的字段值，eg: values.name 获取当前记录名称。返回的options格式为： [{label: LABEL, value: VALUE}, {label: LABEL1, value: VALUE1, icon: icon},...]，
defaultIcon: 选项的图标

TODO:
filters相关功能测试到未生效
filters格式应该是[["name", "=", "c"]]这种
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