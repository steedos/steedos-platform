Steedos.OdataClient = require('odata-client');

AutoForm.addInputType "steedos-selectize", {
	template: "afSteedosSelectize"
	valueOut: ()->
		return SelectizeManager.valueOutformat this[0].selectize?.options[this.val()]
	valueIn: (val,a,b)->
		return val
	contextAdjust:  (context) ->
		context.atts.class = "form-control";
		return context;
}

Template.afSteedosSelectize.onCreated ()->
	if !SelectizeManager.getCreatorService(this.data.atts)
		toastr.error('settings.public.webservices.creator.url', 'Missing configuration')
		throw new Meteor.Error("Not find settings.public.webservices.creator.url")
	this.data.atts.class = 'form-control'

Template.afSteedosSelectize.onRendered ()->
	key = '@label' || 'name'

	service = SelectizeManager.getService(this.data.atts)
	objectName = this.data.atts.related_object
	formula = this.data.atts.formula
	code = this.data.atts.name
	search_field = this.data.atts.search_field
	filters = this.data.atts.filters

	value = this.data.value

	self = this

	this.selectize = $("##{this.data.atts.id}").selectize {
		valueField: '_id',
		labelField: key,
		searchField: [key],
		options: [],
		create: false,
		maxItems: 1,
		preload: true,
		render: {
			option: (item, escape) ->
				return '<div>' +
					'<span class="title">' +
					'<span class="name">' + escape(item[key]) + '</span>' +
					'</span>' +
					'</div>';
		},
		score: (search) ->
			score = this.getScoreFunction(search);
			return  (item) ->
				return score(item);
		,
		load: (query, callback) ->
			if this.lastquery != query
				this.lastquery = query;
				if self.st
					clearTimeout(self.st)
				self.st = setTimeout ()->
					SelectizeManager.dataFunc(self.selectize, service, objectName, {code: code, formula: formula, query: query, search_field: search_field, filters: filters}, callback);
				, 100
		,
		onFocus: SelectizeManager.onFocus,
		onBlur: SelectizeManager.onBlur,
		onItemAdd: SelectizeManager.onItemAdd,
		onItemRemove: SelectizeManager.onItemAdd,
		onChange: SelectizeManager.onChange,
		onClear: SelectizeManager.onClear,
		onDelete: SelectizeManager.onDelete,
		onOptionAdd: SelectizeManager.onOptionAdd,
		onOptionRemove: SelectizeManager.onOptionRemove,
		onDropdownOpen: SelectizeManager.onDropdownOpen,
		onDropdownClose: SelectizeManager.onDropdownClose,
		onType: SelectizeManager.onType,
		onLoad: SelectizeManager.onLoad,
	}

	if value
		this.selectize[0].selectize.addOption(value)
		this.selectize[0].selectize.setValue(value._id)

	firstNode = this.view.firstNode()

	$(".selectize-control", firstNode).removeClass("form-control");
	$(".selectize-input", firstNode).addClass("form-control");

	$(".selectize-dropdown", firstNode).removeClass("form-control");

	$(".selectize-dropdown", firstNode).perfectScrollbar();

