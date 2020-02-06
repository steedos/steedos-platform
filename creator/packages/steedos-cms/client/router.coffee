checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;
		# Steedos.redirectToSignIn(context.path)


cmsSpaceRoutes = FlowRouter.group
	prefix: '/cms',
	name: 'cmsSpace',
	triggersEnter: [ checkUserSigned ],

cmsSpaceRoutes.route '/', 
	action: (params, queryParams)->
		if Steedos.isMobile()
			BlazeLayout.render 'cmsLayout',
				main: "cms_home_mobile"
		else
			Tracker.autorun (c)->
				if Steedos.subsBootstrap.ready() and Steedos.subs["Sites"].ready()
					spaceId = Steedos.spaceId()
					if spaceId
						siteId = Session.get("siteId")
						if siteId
							unless db.cms_sites.findOne({space:spaceId, _id: siteId})
								siteId = null

						unless siteId
							site = db.cms_sites.findOne({space:spaceId}, {sort: {order: 1, created: 1}})
							siteId = site?._id
						if siteId
							c.stop()
							FlowRouter.go "/cms/s/#{siteId}"

cmsSpaceRoutes.route '/s/:siteId/', 
	action: (params, queryParams)->
		CMS.setSiteId params.siteId
		Session.set("siteCategoryId", null)
		Session.set("siteTag", null)
		Session.set("postId", null)

		BlazeLayout.render 'cmsLayout',
			main: "cms_main"
		
		$(".cms-main").removeClass("post-show")

		Tracker.afterFlush ->
			if !Steedos.isMobile() and !Steedos.isAndroidOrIOS()
				$(".post-list").perfectScrollbar("update")

cmsSpaceRoutes.route '/s/:siteId/p/:postId', 
	action: (params, queryParams)->
		CMS.setSiteId params.siteId
		Session.set("siteCategoryId", null)
		Session.set("postId", params.postId)

		BlazeLayout.render 'cmsLayout',
			main: "cms_main"

		Tracker.afterFlush ->
			if !Steedos.isMobile() and !Steedos.isAndroidOrIOS()
				$(".post-detail").perfectScrollbar("update")

cmsSpaceRoutes.route '/s/:siteId/c/:siteCategoryId',
	action: (params, queryParams)->
		CMS.setSiteId params.siteId
		Session.set("siteCategoryId", params.siteCategoryId)
		Session.set("postId", null)

		BlazeLayout.render 'cmsLayout',
			main: "cms_main"

		$(".cms-main").removeClass("post-show")

		Tracker.afterFlush ->
			if !Steedos.isMobile() and !Steedos.isAndroidOrIOS()
				$(".post-list").perfectScrollbar("update")

cmsSpaceRoutes.route '/s/:siteId/c/:siteCategoryId/p/:postId',
	action: (params, queryParams)->
		CMS.setSiteId params.siteId
		Session.set("siteCategoryId", params.siteCategoryId)
		Session.set("postId", params.postId)

		BlazeLayout.render 'cmsLayout',
			main: "cms_main"

		Tracker.afterFlush ->
			if !Steedos.isMobile() and !Steedos.isAndroidOrIOS()
				$(".post-detail").perfectScrollbar("update")
