@ObjectGrid = {}
@GridExport = {}

FilterTypesMap = {
	'equals': '=',
	'notEqual': '!=',
	'contains': 'contains',
	'notContains': 'notcontains',
	'startsWith': 'startswith',
	'endsWith': '=',
	'lessThan': '<',
	'lessThanOrEqual': '<=',
	'greaterThan': '>',
	'greaterThanOrEqual': '>=',
	'empty': 'empty'
}

filterModelToOdataFilters = (filterModel)->
	filters = []
	_.forEach(filterModel, (value, key)->
		if value.type == 'between'
			if(value.filterType == "number")
				filters.push([key, "between", [value.numberFrom, value.numberTo]]);
			else
				if value.filter
					filters.push([key, value.type, value.filter]);
				else
					filters.push([key, "between", [value.dateFrom, value.dateTo]]);
		else
			if !_.isEmpty(value.filter)
				filter = [key, FilterTypesMap[value.type], value.filter];
				filters.push(filter);
			else if value.operator
				filter = [];
				if value.condition1
					filter.push([key, FilterTypesMap[value.condition1.type], value.condition1.filter]);

				filter.push(value.operator.toLocaleLowerCase());
				if value.condition2
					filter.push([key, FilterTypesMap[value.condition2.type], value.condition2.filter]);

				filters.push(filter);

	)
	return filters

ObjectGrid.getFilters = (object_name, list_view_id, is_related, related_object_name, record_id)->
	defaultListViewComponentName = Steedos.Page.Listview.getDefaultName(object_name, list_view_id);
	if(window.gridRefs && window.gridRefs[defaultListViewComponentName] && window.gridRefs[defaultListViewComponentName].current)
		grid = window.gridRefs[defaultListViewComponentName].current;
	else
		grid = window.gridRef.current;
	select = [];
	defaultFilters = Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id)
	userFilters = filterModelToOdataFilters(grid.api.getFilterModel());
	filters = _.compact([].concat(defaultFilters).concat(userFilters))
	return filters

GridExport.excel = (object_name, list_view_id, is_related, related_object_name, record_id, mainRecordName, relatedList)->
	defaultListViewComponentName = Steedos.Page.Listview.getDefaultName(object_name, list_view_id);
	if(window.gridRefs && window.gridRefs[defaultListViewComponentName] && window.gridRefs[defaultListViewComponentName].current)
		grid = window.gridRefs[defaultListViewComponentName].current;
	else
		grid = window.gridRef.current;
	select = [];
	_.each(grid.props.columnDefs, (columnDef)->
		if columnDef && columnDef.field
			select.push(columnDef.field)
	);

	sort = [];
	_.forEach(grid.api.getSortModel(), (sortField)->
		sort.push([sortField.colId, sortField.sort])
	);

	defaultFilters = Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id, relatedList)
	userFilters = filterModelToOdataFilters(grid.api.getFilterModel());
	filters = _.compact([].concat(defaultFilters).concat(userFilters))
	$filter = SteedosFilters.formatFiltersToODataQuery(filters)
	if is_related
		filename = mainRecordName + "-" + Creator.getObject(related_object_name).label
	else
		filename = Creator.getObject(object_name).label + "-" + Creator.getListView(object_name, list_view_id)?.label
	orders = [];
	_.map(sort,(value)->
		if value[1]=='desc'
			order2 = value[0] + ' desc'
		else
			order2 = value[0]
		orders.push(order2);
	)
	order = orders.join(",")
	filename = encodeURIComponent(filename)
	if is_related
		url = "/api/record/export/#{related_object_name}?$select=#{select.toString()}&filename="+filename
	else
		url = "/api/record/export/#{object_name}?$select=#{select.toString()}&filename="+filename

	if sort.length > 0
		url = url + "&$orderby=" + order;

	if $filter
		url = url + "&$filter=" + $filter;
	if Meteor.isCordova
		Steedos.cordovaDownload(encodeURI(Steedos.absoluteUrl(url)), filename + ".xlsx");
	else
		window.open url


