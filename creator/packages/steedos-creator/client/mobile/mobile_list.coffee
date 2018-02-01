Template.mobileList.onRendered ->
	this.$(".mobile-list").removeClass "hidden"
	this.$(".mobile-list").animateCss "fadeInRight"
	DevExpress.ui.setTemplateEngine("underscore");

	object_name = Template.instance().data.object_name
	app_id = Template.instance().data.app_id
	list_view_id = Template.instance().data.list_view_id
	url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY

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
				name_field_key
			]
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