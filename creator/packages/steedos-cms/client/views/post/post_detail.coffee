Template.cms_post_detail.onCreated ->
	this.reactivePostUsers = new ReactiveVar([])
	this.reactivePostOrgainztions = new ReactiveVar([])

Template.cms_post_detail.helpers CMS.helpers

Template.cms_post_detail.helpers
	members: ()->
		postId = Session.get "postId"
		members = db.cms_posts.findOne(postId)?.members
		if members
			organizationIds = members.organizations || []
			userIds = members.users || []

			organizationNames = organizationIds.map (id, index) ->
				return db.organizations.findOne({_id: id})?.name

			userNames = userIds.map (id, index)->
				return db.users.findOne({_id: id})?.name

			memberNames = _.union(organizationNames, userNames).join("，")
			return memberNames
		else
			return


Template.cms_post_detail.onRendered ->
	$(".cms-main").addClass("post-show")
	$('.swipebox' ).swipebox();
	if !Steedos.isMobile() and !Steedos.isAndroidOrIOS()
		$(".post-detail").perfectScrollbar();

	this.autorun ->
		userId = Steedos.userId()
		postId = Session.get "postId"
		siteId = Session.get "siteId"
		spaceId = Session.get "spaceId"

		# cms_reads相关逻辑
		if userId and postId and siteId and spaceId
			read = db.cms_reads.findOne {user: userId, post: postId},{fields:{_id:1}}
			readId = read?._id
			Meteor.call 'addPostViewer', { postId, siteId, spaceId, readId }, (error, is_suc) ->
				unless is_suc
					console.error error
					toastr.error(error)

		# cms_unreads相关逻辑
		if postId
			selection = 
				post: postId
				user: Meteor.userId()
			unread = db.cms_unreads.findOne selection,{fields:{_id:1}}
			if unread
				db.cms_unreads.remove unread._id

	if Steedos.isMobile()
		Steedos.bindSwipeBackEvent(".post-wrapper", (event,options)->
			$(".btn-post-back").trigger("click")
		)

Template.cms_post_detail.events
		"click .post-attachment": (event, template)->
			#在手机上弹出窗口显示附件
			if (Steedos.isMobile())
				Steedos.openWindow(event.target.getAttribute("href"))
				event.stopPropagation()
				return false

		"click .post-attachment-android-app": (event, template)->
			url = event.target.dataset.downloadurl
			filename = this.original.name
			rev = this._id
			length = this.original.size
			Steedos.cordovaDownload(url, filename, rev, length)

		"click .btn-preview-post": (e,t)->
			url = Meteor.absoluteUrl("site/#{Session.get("siteId")}/p/#{Session.get("postId")}")
			Steedos.openWindow(url)
