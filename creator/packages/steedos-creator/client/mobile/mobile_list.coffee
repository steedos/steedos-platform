### TO DO LIST
	1.支持$in操作符，实现recent视图
###

initFilter = (list_view_id, object_name)->
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
			filters = _.map filters, (obj)->
				if obj.operation == "EQUALS"
					query = [obj.field, "=", obj.value]
				else if obj.operation == "NOT_EQUAL"
					query = ["!", [obj.field, "=", obj.value]]
				else if obj.operation == "LESS_THAN"
					query = [obj.field, "<", obj.value]
				else if obj.operation == "GREATER_THAN"
					query = [obj.field, ">", obj.value]
				else if obj.operation == "LESS_OR_EQUAL"
					query = [obj.field, "<=", obj.value]
				else if obj.operation == "GREATER_OR_EQUAL"
					query = [obj.field, ">=", obj.value]
				else if obj.operation == "CONTAINS"
					query = [obj.field, "contains", obj.value]
				else if obj.operation == "NOT_CONTAIN"
					query = [obj.field, "notcontains", obj.value]
				else if obj.operation == "STARTS_WITH"
					query = [obj.field, "startswith", obj.value]
				
				selector.push "and", query
	else
		# TODO
		if Session.get("spaceId") and Meteor.userId()
			list_view = Creator.getListView(object_name, Session.get("list_view_id"))
			if list_view.filter_scope == "spacex"
				selector.push ["space", "=", null], "or", ["space", "=", space]
			else if object_name == "users"
				selector.push ["_id", "=", Meteor.userId()]
			else if object_name == "spaces"
				selector.push ["_id", "=", Session.get("spaceId")]
			else
				selector.push ["space", "=", Session.get("spaceId")]

			if Session.get("list_view_id") == "recent"
				# TODO，目前不支持$in转换
				return selector
			
			if list_view.filters
				# TODO
				return selector
	return selector

Template.mobileList.onRendered ->
	this.$(".mobile-list").removeClass "hidden"
	this.$(".mobile-list").animateCss "fadeInRight"

	object_name = Template.instance().data.object_name
	app_id = Template.instance().data.app_id
	list_view_id = Template.instance().data.list_view_id
	name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
	
	this.autorun (c)->
		if Steedos.spaceId() and Creator.subs["CreatorListViews"].ready()
			c.stop()
			url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
			filter = initFilter(list_view_id, object_name)
			console.log filter
			DevExpress.ui.setTemplateEngine("underscore");
			$("#gridContainer").dxList({
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
				height: "100%"
				searchEnabled: true
				searchExpr: name_field_key,
				pageLoadMode: "scrollBottom"
				pullRefreshEnabled: true
				itemTemplate: $("#item-template")
			});

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