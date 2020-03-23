getIsSidebarShouldBeOpen = ()->
	return $(window).width() >= 1280

Workflow.renderListColumns = ()->
	Template.instance_list._tableColumns();
	if !Steedos.isMobile() and !Steedos.isPad()
		$(".instance-list").perfectScrollbar("update");

Workflow.renderListLayout = (columns)->
	isThreeColumns = true
	isSidebarOpen = true
	switch columns
		when "1"
			# 列表
			isThreeColumns = false
			isSidebarOpen = false
		when "2"
			# 列表 ｜ 记录
			isThreeColumns = true
			isSidebarOpen = false
		when "3"
			# 菜单 ｜ 列表 ｜ 记录
			isThreeColumns = true
			isSidebarOpen = true
		else
			# 自动适应
			isThreeColumns = true
			isSidebarOpen = getIsSidebarShouldBeOpen()
	if isThreeColumns
		$("body").addClass("three-columns")
	else
		$("body").removeClass("three-columns")
	Workflow.renderListColumns()
	if isSidebarOpen
		Session.set("isWorkflowSidebarOpen", true)
	else
		Session.set("isWorkflowSidebarOpen", false)

	# workflow_show_as存入Session是为了下拉框勾选效果显示当前选中的是哪个项
	if columns
		Session.set("workflow_show_as", columns)
	else
		if isSidebarOpen
			Session.set("workflow_show_as", "3")
		else
			Session.set("workflow_show_as", "2")

Workflow.checkInstanceMaxUnfoldedButtonsCount = ()->
	# 刷新或第一次进入时判断为手机，则不执行该函数，workflow_max_unfolded_buttons_count值保持为空值
	maxUnfoldedCount = 3
	if Steedos.isMobile()
		# 这里只是PC上窗口变小为手机时的效果
		maxUnfoldedCount = 2
	else
		width = $(".creator-content-wrapper .instance-wrapper").outerWidth()
		if width < 400
			maxUnfoldedCount = 3
		else if width < 500
			maxUnfoldedCount = 4
		else if width < 600
			maxUnfoldedCount = 6
		else
			maxUnfoldedCount = 7
	Session.set("workflow_max_unfolded_buttons_count", maxUnfoldedCount)

Meteor.startup ->
	Meteor.defer ->
		if !Steedos.isMobile()
			Workflow.renderListLayout localStorage.getItem("workflow_show_as") 
			$(window).resize ->
				Workflow.renderListLayout()
				Workflow.checkInstanceMaxUnfoldedButtonsCount()
