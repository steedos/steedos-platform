Meteor.startup ()->
	TabularTables.cms_posts_tabular = new Tabular.Table({
		name: "cms_posts_tabular",
		collection: db.cms_posts,
		pub: "cms_posts_tabular",
		createdRow: (row,data,dataIndex) ->
			if Meteor.isClient
				if data._id == FlowRouter.current().params.postId
					$(row).addClass "selected"
		drawCallback: (settings)->
			if !Steedos.isMobile()
				$(".post-list").scrollTop(0).ready ->
					$(".post-list").perfectScrollbar("update")
		columns: [
			{
				data: "title", 
				render:  (val, type, doc) ->
					postDateString = moment(doc.postDate).format('YYYY-MM-DD');
					postDateFromNow = Steedos.momentReactiveFromNow(doc.postDate);
					unreadClass = ""
					# if db.cms_unreads.findOne({user: Steedos.userId(), post: doc._id})
					# 	unreadClass = "unread"
					return """
						<div class="ion ion-record #{unreadClass}"></div>
						<div class="post-name #{unreadClass}">#{doc.title}</div>
						<div class="post-postDate" title="#{postDateString}">#{postDateFromNow}</div>
						<div class='post-author'>#{doc.author_name}</div>
					"""
			},
			{
				data: "postDate",
				visible: false
			}
		],
		dom: "tp",
		order:[[1,"desc"]]
		extraFields: ["title", "author_name", "postDate", "site", "category"],
		lengthChange: false,
		pageLength: 10,
		info: false,
		searching: true,
		responsive: 
			details: false
		autoWidth: false,
		changeSelector: (selector, userId) ->
			unless userId
				return {make_a_bad_selector: 1}
			site = selector.site
			unless site
				if selector?.$and?.length > 0
					site = selector.$and.getProperty('site')[0]
			unless site
				return {make_a_bad_selector: 1}
			site = db.cms_sites.findOne(site,{fields:{space: 1}})
			unless site
				return {make_a_bad_selector: 1}
			space_user = db.space_users.findOne({user: userId,space:site.space}, {fields: {_id: 1}})
			unless space_user
				return {make_a_bad_selector: 1}
			return selector
		pagingType: "numbers"
	});