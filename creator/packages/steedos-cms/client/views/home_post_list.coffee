Template.home_post_list.helpers CMS.helpers

Template.home_post_list.onRendered ->
	if !Steedos.isMobile()
		$(".post-list").perfectScrollbar()