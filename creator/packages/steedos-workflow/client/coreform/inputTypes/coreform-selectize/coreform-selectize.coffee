getSelected = (tag)->
	if !tag[0].selectize
		return ;
	if tag[0].selectize.settings.maxItems == 1
		return tag[0].selectize?.options[tag.val()]
	else
		if _.isString(tag.val())
			vals= tag.val().split(',')
			return _.filter(tag[0].selectize.options, (item)->
				return _.include(vals, item._id)
			)

AutoForm.addInputType "steedos-selectize", {
	template: "afSteedosSelectize"
	valueOut: ()->
		return SelectizeManager.valueOutformat getSelected(this)
	valueIn: (val,a,b)->
		return val
	contextAdjust:  (context) ->
		context.atts.class = "form-control";
		return context;
}

Template.afSteedosSelectize.helpers
	isReadOnly: ()->
		atts = _.clone(this.atts);
		if atts.hasOwnProperty("disabled") || atts.hasOwnProperty("readonly")
			return true;
		return false;
	readonlyValue: ()->
		value = this.value
		is_multiselect = this.atts.multiple
		if value
			if is_multiselect
				value = _.pluck(value, '@label').toString()
			else
				value = value['@label']
			return value
		return ''

Template.afSteedosSelectize.events
	'click .slds-pill__remove': (e, t)->
		t.selectize[0].selectize.removeItem(e.target.parentNode.dataset.value);
		t.selectize[0].selectize.focus();

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
	multiple = this.data.atts.multiple

	maxItems = 1
	if multiple
		maxItems = null

	value = this.data.value

	self = this


	selectizeRender = {
		option: (item, escape) ->
			return '<div>' +
				'<span class="title">' +
				'<span class="name">' + escape(item[key]) + '</span>' +
				'</span>' +
				'</div>';
	}

	if multiple
		selectizeRender.item = (item, escape) ->
			return '<span class="slds-pill slds-pill_link">
							<a href="javascript:void(0);" class="slds-pill__action">
							<span class="slds-pill__label">' + escape(item[key]) + '</span></a>
							<button class="slds-button slds-button_icon slds-button_icon slds-pill__remove" type="button">
								<svg class="slds-button__icon" aria-hidden="true">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="close">
									<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z"></path></svg>
								</svg>
							</button>
						</span>'

	this.selectize = $("##{this.data.atts.id}").selectize {
		valueField: '_id',
		labelField: key,
		searchField: [key].concat(search_field.split(',')),
		options: [],
		create: false,
		maxItems: maxItems,
		preload: true,
		render: selectizeRender,
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
	self = this
	if value
		if _.isArray(value)
			_.each value, (_val)->
				self.selectize[0].selectize.addOption(_val)
			self.selectize[0].selectize.setValue(_.pluck(value, '_id'))
		else
			self.selectize[0].selectize.addOption(value)
			self.selectize[0].selectize.setValue(value._id)

	firstNode = this.view.firstNode()

	$(".selectize-control", firstNode).removeClass("form-control");
	$(".selectize-input", firstNode).addClass("form-control");

	$(".selectize-dropdown", firstNode).removeClass("form-control");

	$(".selectize-dropdown", firstNode).perfectScrollbar();

