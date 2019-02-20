Template.filter_logic.onCreated ->
	self = this
	self.showFilterLogic = new ReactiveVar()
	self.filterLogic = new ReactiveVar("")
	self.autorun -> 
		list_view_obj = Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
		if list_view_obj
			if list_view_obj.filter_logic
				self.showFilterLogic.set(true)
				self.filterLogic.set(list_view_obj.filter_logic)
			else
				self.showFilterLogic.set(false)
		else
			self.showFilterLogic.set(false)


Template.filter_logic.helpers 
	default_filter_logic: ()->
		Template.instance().filterLogic?.get()

	show_filter_logic: ()->
		return Template.instance().showFilterLogic?.get()
		 

Template.filter_logic.events 
	'click .add_filter_logic': (e, t)->
		filter_items = Session.get "filter_items"
		arr = []
		i = 0
		while i < filter_items.length
			arr.push(i + 1)
			i++

		val = arr.join(" AND ")
		t.showFilterLogic.set(true)
		t.filterLogic.set(val)
		

	'click .remove_filter_logic': (e, t)->
		t.filterLogic.set("")
		t.showFilterLogic.set(false)
		 
