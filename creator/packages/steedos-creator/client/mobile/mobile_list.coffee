### TO DO LIST
	1.支持$in操作符，实现recent视图
	$eq, $ne, $lt, $gt, $lte, $gte
###

initFilter = (list_view_id, object_name)->
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	custom_list_view = Creator.Collections.object_listviews.findOne(list_view_id)
	selector = []
	if custom_list_view
		filter_scope = custom_list_view.filter_scope
		filters = custom_list_view.filters
		if filter_scope == "mine"
			selector.push ["owner", "=", Meteor.userId()]
		else if filter_scope == "space"
			selector.push ["space", "=", Steedos.spaceId()]

		if filters and filters.length > 0
			selector.push "and"
			filters = _.map filters, (obj)->
				return [obj.field, obj.operation, obj.value]
			
			filters = Creator.formatFiltersToDev(filters)
			_.each filters, (filter)->
				selector.push filter
	else
		if spaceId and userId
			list_view = Creator.getListView(object_name, list_view_id)
			if list_view.filter_scope == "spacex"
				selector.push ["space", "=", null], "or", ["space", "=", space]
			else if object_name == "users"
				selector.push ["_id", "=", userId]
			else if object_name == "spaces"
				selector.push ["_id", "=", spaceId]
			else
				selector.push ["space", "=", spaceId]

			if list_view_id == "recent"
				viewed = Creator.Collections.object_recent_viewed.find({object_name: object_name}).fetch()
				record_ids = _.pluck(viewed, "record_id")
				record_ids = _.uniq(record_ids)
				record_ids = record_ids.join(",or,").split(",")
				id_selector = _.map record_ids, (_id)->
					if _id != "or"
						return ["_id", "=", _id]
					else
						return _id
				selector.push "and", id_selector

			# $eq, $ne, $lt, $gt, $lte, $gte
			# [["is_received", "$eq", true],["destroy_date","$lte",new Date()],["is_destroyed", "$eq", false]]
			if list_view.filters
				filters = Creator.formatFiltersToDev(list_view.filters)
				if filters and filters.length > 0
					selector.push "and"
					_.each filters, (filter)->
						selector.push filter

				if list_view.filter_scope == "mine"
					selector.push "and", ["owner", "=", userId]
			else
				permissions = Creator.getPermissions(object_name)
				if permissions.viewAllRecords
					if list_view.filter_scope == "mine"
						selector.push "and", ["owner", "=", userId]
				else if permissions.allowRead
					selector.push "and", ["owner", "=", userId]
	return selector

displayListGrid = (object_name, app_id, list_view_id, name_field_key, icon)->
	url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	filter = initFilter(list_view_id, object_name)
	DevExpress.ui.setTemplateEngine("underscore");
	self.$("#gridContainer").dxList({
		dataSource: {
			store: {
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl(url)
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = Meteor.userId()
					request.headers['X-Space-Id'] = Steedos.spaceId()
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				onLoading: (loadOptions)->
					console.log loadOptions
					return

			},
			select: [
				name_field_key, "_id"
			],
			filter: filter
		},
		height: "auto"
		searchEnabled: true
		searchExpr: name_field_key,
		pageLoadMode: "scrollBottom"
		pullRefreshEnabled: true
		itemTemplate: (data, index)->
			record_url = Creator.getObjectUrl(object_name, data._id, app_id)
			result = $("<a>").addClass("weui-cell weui-cell_access weui-cell-profile record-item").attr("href", record_url)
			$("<div>").html(Blaze.toHTMLWithData Template.steedos_icon, {class: "slds-icon slds-page-header__icon", source: "standard-sprite", name: icon}).addClass("weui-cell__hd").appendTo(result)
			$("<div>").html("<p>#{data[name_field_key]}</p>").addClass("weui-cell__bd weui-cell_primary").appendTo(result)
			return result
	});

Template.mobileList.onRendered ->
	self = this

	self.$(".mobile-list").removeClass "hidden"
	self.$(".mobile-list").animateCss "fadeInRight"

	object_name = Template.instance().data.object_name
	app_id = Template.instance().data.app_id
	list_view_id = Template.instance().data.list_view_id
	name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
	icon = Creator.getObject(object_name).icon

	self.autorun (c)->
		if Steedos.spaceId() and Creator.subs["CreatorListViews"].ready() and !Creator.isloading()
			displayListGrid(object_name, app_id, list_view_id, name_field_key, icon)
	
	self.autorun (c)->
		if Session.get("reload_dxlist")
			self.$("#gridContainer").dxList("reload")
		
Template.mobileList.helpers
	icon: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).icon

	name_field_key: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).NAME_FIELD_KEY

	record_url: (record_id)->
		object_name = Template.instance().data.object_name
		app_id = Template.instance().data.app_id
		return Creator.getObjectUrl(object_name, record_id, app_id)

	object_name: ()->
		return Template.instance().data.object_name
	
	app_id: ()->
		return Template.instance().data.app_id

	collection: ()->
		object_name = Template.instance().data.object_name
		return "Creator.Collections." + object_name

	collectionName: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).label

	allowCreate: ()->
		object_name = Template.instance().data.object_name
		return Creator.getPermissions(object_name).allowCreate
	
Template.mobileList.events
	'click .mobile-list-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		template.$(".mobile-list").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			urlQuery.pop()
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'

	'click .add-list-item': (event, template)->
		Session.set("reload_dxlist", false)
		template.$(".btn-add-list-item").click()

AutoForm.hooks addListItem:
	onSuccess: (formType, result)->
		Session.set("reload_dxlist", true)
		console.log "onSuccess:----------------", result