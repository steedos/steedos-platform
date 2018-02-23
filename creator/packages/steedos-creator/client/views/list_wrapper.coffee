
Template.creator_list_wrapper.onRendered ->

Template.creator_list_wrapper.helpers Creator.helpers

Template.creator_list_wrapper.helpers

	list_template: ()->
		return "creator_#{FlowRouter.getParam('template')}"

	recordsTotalCount: ()->
		return Template.instance().recordsTotal.get()
	
	list_data: ()->
		return {total: Template.instance().recordsTotal}

	list_views: ()->
		return Creator.getListViews()

	custom_view: ()->
		return Creator.Collections.object_listviews.find({object_name: Session.get("object_name")})

	list_view: ()->
		list_view = Creator.getListView(Session.get("object_name"), Session.get("list_view_id"))
		if list_view?.name != Session.get("list_view_id") and !list_view?._id
			Session.set("list_view_id", list_view.name)
		return list_view

	actions: ()->
		actions = Creator.getActions()
		permissions = Creator.getPermissions()

		# 如果是在权限中设置了action，就不需要判断action的visible属性
		if permissions.actions
			return actions
		else
			actions = _.filter actions, (action)->
				if action.on == "list"
					if typeof action.visible == "function"
						return action.visible()
					else
						return action.visible
				else
					return false
			return actions

	is_custom_list_view: ()->
		if Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
			return true
		else
			return false

	is_filter_list_disabled: ()->
		unless Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
			return "disabled"

	is_filter_changed: ()->
		list_view_obj = Creator.Collections.object_listviews.findOne(Session.get("list_view_id"))
		if list_view_obj
			original_filter_scope = list_view_obj.filter_scope
			original_filter_items = list_view_obj.filters
			current_filter_scope = Session.get("filter_scope")
			current_filter_items = Session.get("filter_items")
			if original_filter_scope == current_filter_scope and JSON.stringify(original_filter_items) == JSON.stringify(current_filter_items)
				return false
			else
				return true

Template.creator_list_wrapper.events

	'click .list-action-custom': (event) ->
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, this

	'click .list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this.name)
		## 强制重新加载Render Tabular，包含columns
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)

	'click .custom-list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this._id)
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			obj = Creator.Collections.object_listviews.findOne(list_view_id)
			filter_items = obj.filters || []
			filter_scope = obj.filter_scope
			Session.set("filter_items", filter_items)
			Session.set("filter_scope", filter_scope)
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)

	'click .btn-filter-list': (event, template)->
		$(event.currentTarget).toggleClass("slds-is-selected")
		$(".filter-list-container").toggleClass("slds-hide")

	'click .close-filter-panel': (event, template)->
		$(".btn-filter-list").removeClass("slds-is-selected")
		$(".filter-list-container").addClass("slds-hide")
	
	'click .add-list-view': (event, template)->
		$(".btn-add-list-view").click()

	'click .cancel-change': (event, template)->
		list_view_id = Session.get("list_view_id")
		filters = Creator.Collections.object_listviews.findOne(list_view_id).filters || []
		filter_scope = Creator.Collections.object_listviews.findOne(list_view_id).filter_scope
		Session.set("filter_items", filters)
		Session.set("filter_scope", filter_scope)

	'click .save-change': (event, template)->
		list_view_id = Session.get("list_view_id")
		filter_items = Session.get("filter_items")
		filter_scope = Session.get("filter_scope")
		filter_items = _.map filter_items, (obj) ->
			if _.isEmpty(obj)
				return false
			else
				return obj
		filter_items = _.compact(filter_items)
		Session.set "list_view_visible", false
		Meteor.call "update_filters", list_view_id, filter_items, filter_scope, (error, result) ->
			Session.set "list_view_visible", true
			if error 
				console.log "error", error 
			else if result
				Session.set("filter_items", filter_items)
		#$(event.currentTarget).toggleClass("slds-is-selected")
		$(".filter-list-container").toggleClass("slds-hide")

	'click .filters-save-as': (event, template)->
		filter_items = Session.get("filter_items")
		filter_items = _.map filter_items, (obj) ->
			if _.isEmpty(obj)
				return false
			else
				return obj
		filter_items = _.compact(filter_items)
		Session.set "cmDoc", {filters: filter_items}
		$(".btn-add-list-view").click()
		$(".filter-list-container").toggleClass("slds-hide")

	'click .select-fields-to-display': (event, template)->
		Modal.show("select_fields")

	'click .delete-list-view': (event, template)->
		list_view_id = Session.get("list_view_id")
		Session.set "cmDoc", {_id: list_view_id}
		$(".btn-delete-list-view").click()

	'click .btn-refresh': (event, template)->
		Template.creator_grid.refresh()


Template.creator_list_wrapper.onCreated ->
	this.recordsTotal = new ReactiveVar(0)

Template.creator_list_wrapper.onDestroyed ->
	object_name = Session.get("object_name")
	if object_name
		Creator.TabularSelectedIds[object_name] = []
	