Template.headerSearch.onCreated ()->
	this.openItem = new ReactiveVar(false)
	this.searchText = new ReactiveVar()
	this.recentItems = new ReactiveVar([])
	this.searchItems = new ReactiveVar([])
	self = this;
	this.inputFocus = ()->
		Meteor.defer ()->
			$input = $(self.find('input'));
			$input.focus();

	this.search = ()->
		this.clearSearchItems()
		searchText =this.searchText.get()
		if searchText
			_.forEach Creator.objectsByName, (_object, name)->
				if _object.enable_search
					Meteor.call 'object_record_search', {objectName: _object.name, searchText: searchText, space: Session.get("spaceId")}, (error, result)->
						if error
							console.error('object_record_search method error:', error);
						searchItems = self.searchItems.get()
						searchItems = searchItems.concat(result)
						self.searchItems.set(searchItems)

	this.clearSearchItems = ()->
		this.searchItems.set([])


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
		t.searchText.set($(e.target).val())
		t.search()

	'click #option-00,#option-01': (e, t)->
		toastr.info("TODO#68")