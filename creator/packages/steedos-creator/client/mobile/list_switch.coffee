displayListGrid = (object_name, app_id, list_view_id, name_field_key, icon, self)->
	if self.dxListInstance
		self.dxListInstance.dispose()

	if list_view_id == "recent"
		url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/recent"
	else
		url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	filter = Creator.getODataFilter(list_view_id, object_name)
	DevExpress.ui.setTemplateEngine("underscore");
	list_options = 
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
			$("<div>").html("<p class='slds-truncate'>#{data[name_field_key]}</p>").addClass("weui-cell__bd weui-cell_primary slds-truncate").appendTo(result)
			$("<span>").addClass("weui-cell__ft").appendTo(result)
			return result

	self.dxListInstance = self.$("#gridContainer").dxList(list_options).dxList('instance')

Template.listSwitch.onRendered ->
	self = this
	templateData = Template.instance().data

	module.dynamicImport('devextreme/ui/list').then (dxList)->
		DevExpress.ui.dxList = dxList;
		object_name = templateData.object_name
		app_id = templateData.app_id
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		icon = Creator.getObject(object_name).icon

		self.$("#list_switch").removeClass "hidden"	
		self.$("#list_switch").animateCss "fadeInRight", ->

			self.autorun (c)->
				list_view_id = self.list_view_id.get()
				if Steedos.spaceId() and Creator.subs["CreatorListViews"].ready() and !Creator.isloading() and list_view_id
					displayListGrid(object_name, app_id, list_view_id, name_field_key, icon, self)
			
			self.autorun (c)->
				if Session.get("reload_dxlist")
					self.$("#gridContainer").dxList("reload")

Template.listSwitch.helpers Creator.helpers

Template.listSwitch.helpers
	list_view_label: ()->
		return Template.instance().list_view_label?.get()

	list_views: ()->
		object_name = Template.instance().data.object_name
		return Creator.getListViews(object_name)

	allowCreate: ()->
		object_name = Template.instance().data.object_name
		return Creator.getPermissions(object_name).allowCreate

	collection: ()->
		object_name = Template.instance().data.object_name
		return "Creator.Collections." + object_name

	collectionName: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).label

	object_label: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).label

	custom_list_views: ()->
		object_name = Template.instance().data.object_name
		return Creator.Collections.object_listviews.find({object_name: object_name}).fetch()

	getListViewUrl: (list_view_id)->
		app_id = Template.instance().data.app_id
		object_name = Template.instance().data.object_name
		return Creator.getSwitchListUrl(object_name, app_id, list_view_id)
	
	object_icon: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).icon

Template.listSwitch.events
	'click .list-switch-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$("#list_switch").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app'

	'click .add-list-item': (event, template)->
		Session.set("reload_dxlist", false)
		template.$(".btn-add-list-item").click()

	'click .list-name': (event, template)->
		template.$(".switch-list-mask").css({"opacity": "1", "display": "block"})
		template.$(".switch-list-actionsheet").css({"opacity": "1", "display": "block"})
		template.$(".switch-list-actionsheet").addClass("weui-actionsheet_toggle")

	'click .weui-actionsheet__cell': (event, template)->
		template.$(".switch-list-mask").css({"opacity": "0", "display": "none"})
		template.$(".switch-list-actionsheet").css({"opacity": "0", "display": "none"})
		template.$(".switch-list-actionsheet").removeClass("weui-actionsheet_toggle")

	'click .switch-list-mask': (event, template)->
		template.$(".switch-list-mask").css({"opacity": "0", "display": "none"})
		template.$(".switch-list-actionsheet").css({"opacity": "0", "display": "none"})
		template.$(".switch-list-actionsheet").removeClass("weui-actionsheet_toggle")

	'click .switch-list': (event, template)->
		template.list_view_id.set(this._id)
		template.list_view_label.set(this.label)


Template.listSwitch.onCreated ->
	self = this
	self.list_view_id = new ReactiveVar()
	self.list_view_label = new ReactiveVar()
	self.autorun (c)->
		if Creator.bootstrapLoaded.get() and Creator.subs["CreatorListViews"].ready()
			object_name = Template.instance().data.object_name
			list_views = Creator.getListViews(object_name)
			if list_views.length
				self.list_view_id.set(list_views[0].name)
				self.list_view_label.set(list_views[0].label)
			else
				custom_list_views = Creator.Collections.object_listviews.find({object_name: object_name}).fetch()
				if custom_list_views.length
					self.list_view_id.set(custom_list_views[0]._id)
					self.list_view_label.set(custom_list_views[0].name)
			c.stop()
	
AutoForm.hooks addListItem:
	onSuccess: (formType, result)->
		$('#afModal').modal 'hide'
		Session.set("reload_dxlist", true)
		if result.type == "post"
			app_id = Session.get("app_id")
			object_name = result.object_name
			record_id = result._id
			record_url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
			FlowRouter.go record_url
, false