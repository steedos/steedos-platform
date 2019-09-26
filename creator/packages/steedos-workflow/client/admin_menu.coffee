if Meteor.isClient

	onclick = (parent, _id) ->
		$(".treeview-menu a[class^='admin-menu-']").removeClass("selected")
		$(".treeview-menu a.admin-menu-#{_id}").addClass("selected")
		unless $(".admin-menu-#{parent}").closest("li").hasClass("active")
				$(".admin-menu-#{parent}").trigger("click")


	# 审批王
	# Steedos.addAdminMenu
	# 	_id: "workflow"
	# 	title: "Steedos Workflow"
	# 	app: "workflow"
	# 	icon: "ion ion-ios-list-outline"
	# 	roles: ["space_admin"]
	# 	sort: 30

	# 岗位
	# Steedos.addAdminMenu
	# 	_id: "flow_roles"
	# 	title: "flow_roles"
	# 	app: "workflow"
	# 	icon: "ion ion-ios-grid-view-outline"
	# 	url: "/admin/workflow/flow_roles"
	# 	sort: 20
	# 	parent: "workflow"


	# 流程设计器
	# Steedos.addAdminMenu
	# 	_id: "workflow_designer"
	# 	title: "Workflow Designer"
	# 	app: "workflow"
	# 	icon: "ion ion-ios-shuffle"
	# 	url: "/workflow/designer"
	# 	sort: 40
	# 	parent: "workflow"
	# 	onclick: ->
	# 		if Steedos.isMobile()
	# 			swal({
	# 				title: t("workflow_designer_use_pc"),
	# 				confirmButtonText: t("OK")
	# 			})


	# 统计分析
	# Steedos.addAdminMenu
	# 	_id: "steedos_tableau"
	# 	title: "steedos_tableau"
	# 	icon: "ion ion-ios-pie-outline"
	# 	sort: 2500
	# 	roles: []
	# 	url: "/tableau/info"
	# 	parent: "workflow"
	# 	onclick: ->
	# 		if Steedos.isMobile()
	# 			swal({
	# 				title: t("workflow_designer_use_pc"),
	# 				confirmButtonText: t("OK")
	# 			})

	# # 流程委托
	# Steedos.addAdminMenu
	# 	_id: "process_delegation_rules"
	# 	title: "process_delegation_rules"
	# 	icon: "ion ion-ios-americanfootball-outline"
	# 	sort: 3000
	# 	roles: []
	# 	url: "/admin/workflow/process_delegation_rules"
	# 	parent: "workflow"