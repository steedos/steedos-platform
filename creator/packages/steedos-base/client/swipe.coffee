Meteor.startup ->
	# 手机上左右滑动切换sidebar
	unless Steedos.isMobile()
		Steedos.bindSwipeBackEvent = (selector, fun)->
			return
		return
	isSwiping = false
	startX = 0
	startY = 0
	loapTime = 0
	offsetX = 0
	offsetY = 0
	movingX = 0
	swipeStartTime = 0
	isSidebarOpen = false
	sidebar = null
	contentWrapper = null
	contentWrapperShadow = null
	isStarted = false
	minStartX = 80
	maxStartY = 10
	$("body").on("swipe", (event, options)->
		isStarted = false
		isSidebarOpen = $("body").hasClass('sidebar-open')
		# if !isSidebarOpen and options.startEvnt.position.x > 40
		#   如果要把效果设置为:"只能从手机左侧边缘滑动才能触发切换sidebar的显示与隐藏"，就放开该判断语句
		# 	return
		if isSidebarOpen and options.startEvnt.position.x < 40
			isStarted = true
		unless $(".main-sidebar").length
			return
		if options.direction != "left" and options.direction != "right"
			return
		else if options.direction == "right" and isSidebarOpen
			return
		else if options.direction == "left" and !isSidebarOpen
			return
		sidebar = $(".main-sidebar")
		contentWrapper = $(".skin-admin-lte>.wrapper>.content-wrapper")
		contentWrapperShadow = $(".content-wrapper-shadow")
		if contentWrapper.hasClass("no-sidebar") || $("body").hasClass("no-sidebar")
			return
		isSwiping = true
		swipeStartTime = options.startEvnt.time
		startX = options.startEvnt.position.x
		startY = options.startEvnt.position.y
		$("body").addClass "sidebar-swapping"
	);
	$("body").on("swipeend", (event, options)->
		unless isSwiping
			return
		isSwiping = false
		$("body").removeClass "sidebar-swapping"
		sidebar.css("transform","")
		contentWrapper.css("transform","")
		contentWrapperShadow.css("opacity","")
		action = ""
		if loapTime - swipeStartTime > 300
			# 长按移动时间超过300ms则以最后停留位置为准决定打开或关闭左侧菜单
			if movingX > -(230 - 115)
				action = "open"
			else
				action = "close"
		else if options.direction == "right"
			action = "open"
		else
			action = "close"

		if isStarted
			if action == "open"
				unless isSidebarOpen
					$("body").addClass('sidebar-open')
			else if action == "close"
				if isSidebarOpen
					$("body").removeClass('sidebar-open');
					$("body").removeClass('sidebar-collapse')

		sidebar = null
		contentWrapper = null
		contentWrapperShadow = null
	);
	$("body").on("tapmove", (event, options)->
		unless isSwiping
			return
		loapTime = options.time
		offsetX = options.position.x - startX
		offsetY = options.position.y - startY
		if isSwiping
			if isSidebarOpen
				if offsetX > 0
					offsetX = 0
				else if offsetX < -230 
					offsetX = -230
				sidebarX = offsetX
				wrapperX = 230+offsetX
				isStarted = true
			else
				if offsetX < 0
					offsetX = 0
				else if offsetX > 230 
					offsetX = 230
				sidebarX = -(230-offsetX)
				wrapperX = offsetX
				if offsetX > minStartX && (offsetY < maxStartY && offsetY > -maxStartY)
					isStarted = true

			if isStarted
				sidebar.css("transform","translate(#{sidebarX}px, 0)")
				contentWrapper.css("transform","translate(#{wrapperX}px, 0)")
				movingX = sidebarX
				contentWrapperShadow.css("opacity",(230+movingX)/230)
	)


	# swipe相关事件不支持在Template.xxx.events中集成
	# 某些界面不需要左右滑动切换左侧sidebar功能，而需要向右滑动来触发返回上一界面功能
	isSwipeBacking = false
	Steedos.bindSwipeBackEvent = (selector, fun)->
		# 为阻止向右滑动打开左侧sidebar功能，需要同时阻止touchmove/tapmove、swipe、swiperight(如果有绑定该事件的话)事件冒泡
		$(selector).on("tapmove", (event, options)->
			# swipe事件的event.stopPropagation功能，需要额外阻止touchmove事件冒泡来达到
			event.stopPropagation()
		)
		$(selector).on("swipe", (event, options)->
			event.stopPropagation()
			if options.startEvnt.position.x < 40
				isSwipeBacking = true
		)
		$(selector).on("swipeend", (event, options)->
			event.stopPropagation()
			unless isSwipeBacking
				return
			isSwipeBacking = false
			if options.direction == "right" and fun
				fun(event, options)
		)
