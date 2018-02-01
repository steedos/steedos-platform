Template.mobileList.onRendered ->
	self = this

	self.$(".mobile-list").removeClass "hidden"
	self.$(".mobile-list").animateCss "fadeInRight"

	DevExpress.ui.setTemplateEngine("underscore");

	$("#gridContainer").dxList({
		dataSource: {
			store: {
				type: "odata",
				version: 4,
				url: 'http://192.168.0.60:5000/api/odata/v4/'+Steedos.spaceId()+'/companies',
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = '5194c66ef4a563537a000003';
					request.headers['X-Space-Id'] = '51ae9b1a8e296a29c9000001';
					request.headers['X-Auth-Token'] = 'orHOAa1lK7RcM-vtcwSp28w67wAi6LZpsMBEM2DX4AY';
				onLoading: (loadOptions)->
					console.log loadOptions
					return

			},
			select: [
				"name",
				"description"
			]
		},
		height: "100%"
		searchEnabled: true
		pageLoadMode: "scrollBottom"
		pullRefreshEnabled: true
		itemTemplate: $("#item-template")
	});

Template.mobileList.helpers
	icon: ()->
		return "timesheet"

Template.mobileList.events
	'click .mobile-list-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		template.$(".mobile-list").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			if lastUrl
				urlQuery.pop()
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'