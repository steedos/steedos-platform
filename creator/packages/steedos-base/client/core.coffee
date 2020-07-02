# 实现定时更新变量
# 在函数中执行Steedos.deps?.miniute?.depend()即可让函数定时执行并更新template
Steedos.deps = {
	miniute: new Tracker.Dependency
};
Meteor.startup ->
	Meteor.setInterval ->
		Steedos.deps.miniute.changed();
	, 600 * 1000

	Tracker.autorun ->
		unless Meteor.userId()
			toastr.clear()

	Tracker.autorun ->
		if Meteor.status().status == 'connected'
			$("body").removeClass("offline")
		else
			$("body").addClass("offline")
		
	if Steedos.isMobile()
		$(window).resize ->
			if $(".modal.in").length
				setTimeout ()->
					Steedos.setModalMaxHeight()
				,500

	Steedos.loadingTimeCount = 0
	Meteor.setInterval ->
		isLoading = $("body").hasClass("loading")
		if isLoading
			Steedos.loadingTimeCount++
		else
			Steedos.loadingTimeCount = 0
		if Steedos.loadingTimeCount > 12
			$(".loading-text a").removeClass("hide")
		else
			$(".loading-text a").addClass("hide")
	, 5 * 1000

	$.jstree.defaults.core.themes.variant = "large"