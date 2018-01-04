Template.headerSearch.onCreated ()->
	this.openItem = new ReactiveVar(false)
	this.items = new ReactiveVar([])
	self = this;
	this.inputFocus = ()->
		Meteor.defer ()->
			$input = $(self.find('input'));
			$input.focus();

Template.headerSearch.helpers
	open_item: ()->
		return Template.instance().openItem.get()

	items: ()->
		return Template.instance().items.get()

	record_object: (object_name)->
		return Creator.getObject(object_name)

	record_href: (object_name,record_id)->
		return Creator.getObjectUrl(object_name,record_id)

Template.headerSearch.events
	'click #global-search': (e, t)->
		t.openItem.set(true)
		Meteor.call 'object_recent_record', (error, result)->
			if error
				console.error('object_recent_record method error:', error);
			t.items.set(result)

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
