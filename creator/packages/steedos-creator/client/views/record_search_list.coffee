Template.record_search_list.onCreated ()->
	this.sidebarList = new ReactiveVar([])
	this.searchResult = new ReactiveVar()
	this.selectObject = new ReactiveVar()
	this.showGrid = new ReactiveVar(true)
	this.objectsRecordsTotal = new ReactiveVar({})

Template.record_search_list.onRendered ->
	self = this
	this.autorun ->
		searchText = Session.get("search_text")
		self.showGrid.set(false)
		self.selectObject.set(null)

		sidebarList = _.pluck(_.filter(Creator.objectsByName, (obj)->
			return obj.enable_search && obj.NAME_FIELD_KEY
		), 'name');
		self.sidebarList.set(sidebarList)
		self.showGrid.set(true)
#		Meteor.call 'object_record_search', {searchText: searchText, space: Session.get("spaceId")}, (error, result)->
#			if error
#				console.error('object_record_search method error:', error);
#			if result
#				searchResult = _.groupBy(result, "_object_name")
#				sidebarList = _.keys(searchResult)
#				self.searchResult.set(searchResult)
#				self.sidebarList.set(sidebarList)
#			self.showGrid.set(true)


Template.record_search_list.helpers 
	sidebar_list: ()->
		return Template.instance().sidebarList.get()

	label: (object_name)->
		obj = Creator.getObject(object_name)
		if !obj
			return object_name
		else
			return obj.label || obj.name
	
	is_selected: (object_name)->
		select_object = Template.instance().selectObject.get()
		if !object_name and !select_object
			return true
		else if object_name == select_object
			return true

		return false

	select_object: ()->
		return Template.instance().selectObject.get()

	calc_result_ids: (object_name)->
		if true
			return []
		search_result = Template.instance().searchResult.get()
		obj = _.pick(search_result, object_name)
		if obj[object_name]
			ids = obj[object_name].getProperty("_id")
		else
			ids = []
		return ids

	search_result: ()->
		return Template.instance().searchResult.get()
	
	show_grid: ()->
		return Template.instance().showGrid.get()

	objectsRecordsTotal: ()->
		return Template.instance().objectsRecordsTotal

	show_object_item: (object_name)->
		objectsRecordsTotal = Template.instance().objectsRecordsTotal.get()
		if !_.isEmpty(objectsRecordsTotal) and object_name
			return objectsRecordsTotal[object_name] > 0

Template.record_search_list.events 
	"click .object-li": (event, template) -> 
		template.showGrid.set(false)
		template.selectObject.set(this.toString())
		Tracker.afterFlush -> 
			template.showGrid.set(true)

	"click .all": (event, template) ->
		template.showGrid.set(false)
		template.selectObject.set(null)
		Tracker.afterFlush -> 
			template.showGrid.set(true)
		 
