Steedos.subs["Site"] = new SubsManager()
Steedos.subs["SitePost"] = new SubsManager()

Meteor.startup ()->
	Tracker.autorun (c)->
		if Session.get("siteId") and Meteor.userId()
			Steedos.subs["Site"].subscribe "cms_categories", Session.get("siteId")
			Steedos.subs["Site"].subscribe "cms_tags", Session.get("siteId")

	Tracker.autorun (c)->
		if Session.get("postId")
			Steedos.subs["SitePost"].subscribe "cms_post", Session.get("siteId"), Session.get("postId")
			Steedos.subs["SitePost"].subscribe "cfs_posts", Session.get("postId")

Steedos.subs["Sites"] = new SubsManager()

Meteor.startup ()->
	Tracker.autorun ->
		if Meteor.userId() and Session.get("spaceId")
			spaces = Steedos.spaces()?.fetch().getProperty("_id")
			Steedos.subs["Sites"].subscribe "cms_sites", spaces


Steedos.subs["CmsUnreads"] = new SubsManager()

Meteor.startup ()->
	Tracker.autorun ->
		if Meteor.userId()
			Steedos.subs["CmsUnreads"].subscribe 'cms_unreads'

	Tracker.autorun ->
		unless Meteor.userId()
			Steedos.subs["CmsUnreads"].clear()
			Steedos.subs["Sites"].clear()
			Steedos.subs["SitePost"].clear()
			Steedos.subs["Site"].clear()

	Tracker.autorun ->
		if Meteor.userId() and Steedos.subs["CmsUnreads"].ready()
			lastUnread = db.cms_unreads.findOne({user:Meteor.userId()},{sort:{created:-1}})
			unless lastUnread
				return
			lastUnreadCreatedTime = lastUnread.created		
			unreadCount = db.cms_unreads.find({user:Meteor.userId()}).fetch().length
			isNeedtoToastr = true

			if clickTime = localStorage.getItem("cms.notification_click:"+Meteor.userId())
				clickTime = parseInt(clickTime)
				if clickTime < lastUnreadCreatedTime.getTime()
					isNeedtoToastr = true
				else
					isNeedtoToastr = false

			if lastUnread
				Steedos.subs["SitePost"].subscribe "cms_post", lastUnread.site, lastUnread.post
				post = db.cms_posts.findOne(lastUnread.post)
				if post && isNeedtoToastr
					toastr.clear $(".toast-info")
					toastr.info(null,"您有#{unreadCount}篇文章未读",{
						closeButton: true,
						timeOut: 0,
						extendedTimeOut: 0,
						onclick: ->
							localStorage.setItem("cms.notification_click:"+Meteor.userId(),new Date().getTime().toString())
							if post.category
								FlowRouter.go("/cms/s/#{post.site}/c/#{post.category}/p/#{post._id}")
							else
								FlowRouter.go("/cms/s/#{post.site}/p/#{post._id}")
						onCloseClick: ->
							localStorage.setItem("cms.notification_click:"+Meteor.userId(),new Date().getTime().toString())
					})

	Tracker.autorun ->
		unless Meteor.userId()
			toastr.clear $(".toast-info")

# Steedos.subs["CmsHomePosts"] = new SubsManager
# 	cacheLimit: 99

# Tracker.autorun ->
# 	if Meteor.userId() and Steedos.subs["Sites"].ready()
# #		siteIds = db.cms_sites.find({space:{$in:Steedos.spaces().fetch().getProperty("_id")}}).fetch().getProperty("_id")
# 		siteIds = db.cms_sites.find({space: Session.get("spaceId")}).fetch().getProperty("_id")
# 		siteIds.forEach (siteId)->
# 			Steedos.subs["CmsHomePosts"].subscribe 'cms_posts_home',siteId


Meteor.startup ()->
	Tracker.autorun (c)->
		if Meteor.userId() and Steedos.subs["Sites"].ready()
			spaceId = Session.get("spaceId")
			siteCount = db.cms_sites.find({space: spaceId}).count();
			if siteCount == 0
				Meteor.call "space_blogs_init", spaceId, (error, result) ->


Steedos.subs["organizationsNames"] = new SubsManager()
Steedos.subs["usersNames"] = new SubsManager()

Meteor.startup ()->
	Tracker.autorun (c)->
		if Meteor.userId() and Session.get("postId") and Steedos.subs["SitePost"].ready()
			postId = Session.get("postId")
			postObj = db.cms_posts.findOne(postId)
			members = postObj?.members || {}
			if members.organizations?.length > 0
				Steedos.subs["organizationsNames"].subscribe "posts_organizations_name", members.organizations
			if members.users?.length > 0
				Steedos.subs["usersNames"].subscribe "posts_users_name", members.users




