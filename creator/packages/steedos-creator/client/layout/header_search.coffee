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
			Meteor.call 'object_record_search', {searchText: searchText, space: Session.get("spaceId")}, (error, result)->
				if error
					console.error('object_record_search method error:', error);
				self.searchItems.set(result)
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
			search_Keywords = searchText.split(" ")
			search_Keywords.forEach (keyword)->
				keyword = keyword.trim()
				if keyword
					reg = new RegExp(keyword, "g")
					label = label.replace(reg, '<mark>' + keyword + '</mark>')
		return label

	is_searching: ()->
		return Template.instance().is_searching.get()

Template.headerSearch.events
	'click #global-search': (e, t)->
		t.openItem.set(true)
		if !t.searchText.get()
			Meteor.call 'object_recent_record', (error, result)->
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

		t.searchText.set(searchText)
		t.search_timeoutId = Meteor.setTimeout ()->
			t.search()
		, 300

	'click #option-00,#option-01': (e, t)->
		toastr.info("TODO#68")