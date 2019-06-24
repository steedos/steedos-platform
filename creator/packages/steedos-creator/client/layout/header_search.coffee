
search_object = (object_name, searchText)->

	object = Creator.getObject(object_name)

	object_name_key = object?.NAME_FIELD_KEY

	if !object_name_key
		return []

	filters = []

	search_Keywords = searchText.replace(/'/g, "''").split(" ")

	search_Keywords.forEach (keyword)->
		filters.push "(contains(tolower(#{object_name_key}),'#{encodeURIComponent(Creator.convertSpecialCharacter(keyword.trim()))}'))"

	odata_options = {
		$top: 5
		$select: "#{object_name_key}"
	}

	if filters.length > 0
		odata_options.$filter = "(#{filters.join(' and ')})"

	result = Creator.odata.query(object_name, odata_options, true)

	data = []

	_.each result, (item)->
		data.push {_id: item._id, _name: item[object_name_key], _object_name: object_name}

	return data;


Template.headerSearch.onCreated ()->
	this.openItem = new ReactiveVar(false)
	this.searchText = new ReactiveVar()
	this.recentItems = new ReactiveVar([])
	this.searchItems = new ReactiveVar([])
	this.is_searching = new ReactiveVar(false)
	self = this;
	this.inputFocus = ()->
		Meteor.defer ()->
			$input = $(self.find('input'));
			$input.focus();

	this.search = ()->
#		this.clearSearchItems()
		searchText =this.searchText.get()
		if searchText
			self.is_searching.set(true)
			searchData = []
			_.forEach Creator.objectsByName, (_object, name)->
				if _object.enable_search
					object_record = search_object(_object.name, searchText)
					searchData = searchData.concat(object_record)
			self.searchItems.set(searchData)
			self.is_searching.set(false)
		else
			self.is_searching.set(false)

	this.clearSearchItems = ()->
		this.searchItems.set([])

Template.headerSearch.helpers Creator.helpers

Template.headerSearch.helpers
	open_item: ()->
		return Template.instance().openItem.get()

	recentItems: ()->
		return Template.instance().recentItems.get()

	record_object: (object_name)->
		return Creator.getObject(object_name)

	record_href: (object_name,record_id)->
		return Creator.getObjectUrl(object_name,record_id)

	object_label: ()->
		return Creator.getObject(Session.get("object_name"))?.label || ""

	is_search: ()->
		return !_.isEmpty(Template.instance().searchText.get())

	searchText: ()->
		return Template.instance().searchText.get()

	searchItems: ()->
		return Template.instance().searchItems.get()

	highlight: (label)->
		searchText = Template.instance().searchText.get()
		if searchText && _.isString(searchText)
			search_Keywords = searchText.trim().split(" ")
			search_Keywords.forEach (keyword)->
				keyword = Creator.convertSpecialCharacter(keyword)
				keyword = keyword.trim()
				if keyword
					reg = new RegExp(keyword, "g")
					label = label?.replace(reg, '<mark>' + keyword + '</mark>')
		return label

	is_searching: ()->
		return Template.instance().is_searching.get()

Template.headerSearch.events
	'click #global-search': (e, t)->
		t.openItem.set(true)
		if !t.searchText.get()
			Meteor.call 'object_recent_record', Session.get("spaceId"),(error, result)->
				if error
					console.error('object_recent_record method error:', error);
				t.recentItems.set(result)

	'click .slds-lookup__item-action': (e, t)->
		t.openItem.set(false)

	'click .slds-lookup__menu': (e, t)->
		if t.openItem.get()
			t.inputFocus()

	'focus input#global-search':  (e, t)->
		t.openItem.set(true)
		Meteor.clearTimeout(t.timeoutId);

	'blur input#global-search': (e, t)->
		t.timeoutId = Meteor.setTimeout ()->
			t.openItem.set(false);
		, 500

	'keyup input#global-search': (e, t)->

		searchText = $(e.target).val().trim()

		if searchText == t.searchText.get()
			return

		Meteor.clearTimeout(t.search_timeoutId);

		t.is_searching.set(true);

		t.searchText.set(searchText)

		t.search_timeoutId = Meteor.setTimeout ()->
			t.search()
		, 1000

	'click #option-00,#option-01': (e, t)->
		app_id = Session.get "app_id"
		search_text = t.searchText.get()
		url = "/app/#{app_id}/search/#{search_text}"
		FlowRouter.go url
	
	'keydown input#global-search': (e, t)->
		if e.keyCode == "13" or e.key == "Enter"
			$("#option-00").click()