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

Meteor.startup ->
	Meteor.defer ->
		# workflow_three_columns = localStorage.getItem("workflow_three_columns")
		# if workflow_three_columns and workflow_three_columns == "off"
		# 	$("body").removeClass("three-columns")
		# else
		# 	$("body").addClass("three-columns")
		# Workflow.renderListLayout localStorage.getItem("workflow_show_as")
		if !Steedos.isMobile()
			Workflow.renderListLayout localStorage.getItem("workflow_show_as") 
			$(window).resize ->
				Workflow.renderListLayout()