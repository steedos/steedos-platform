Template.record_search_list.onCreated ()->
	this.sidebarList = new ReactiveVar([])
	this.searchResult = new ReactiveVar()
	this.selectObject = new ReactiveVar()
	this.showGrid = new ReactiveVar(true)

Template.record_search_list.onRendered ->
	self = this
	this.autorun ->
		searchText = Session.get("search_text")
		Meteor.call 'object_record_search', {searchText: searchText, space: Session.get("spaceId")}, (error, result)->
			if error
				console.error('object_record_search method error:', error);

			if result and result.length > 0
				searchResult = _.groupBy(result, "_object_name")
				sidebarList = _.keys(searchResult)
				self.searchResult.set(searchResult)			
				self.sidebarList.set(sidebarList)
			# console.log "record_search_list",JSON.stringify(result)


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
		search_result = Template.instance().searchResult.get()
		obj = _.pick(search_result, object_name)
		ids = obj[object_name].getProperty("_id")
		return ids

	search_result: ()->
		return Template.instance().searchResult.get()
	
	show_grid: ()->
		return Template.instance().showGrid.get()

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
		 
