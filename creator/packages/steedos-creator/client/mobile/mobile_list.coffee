displayListGrid = (object_name, app_id, list_view_id, name_field_key, icon)->
	url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	filter = Creator.getODataFilter(list_view_id, object_name)
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
		height: "100%"
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

	listName: ()->
		return Template.instance().data.list_view_id
	
Template.mobileList.events
	'click .mobile-list-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$(".mobile-list").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
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
		record_id = result
		app_id = FlowRouter._current.params.app_id
		object_name = FlowRouter._current.params.object_name
		record_url = Creator.getObjectUrl(object_name, record_id, app_id)
		FlowRouter.go record_url