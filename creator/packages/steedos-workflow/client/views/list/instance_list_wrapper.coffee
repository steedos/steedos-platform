Template.instance_list_wrapper.helpers

	objectIcon: ->
		return "task"

	objectLabel: ->
		return "Workflow"

	objectSearchLabel: ->
		return "申请单"

	btnToggleColumnsIcon: ->
		return Template.instance()?.btnToggleColumnsIcon.get()
	
	enabledExport: ->
		flowId = Session.get("flowId")
		unless flowId
			return false
		spaceId = Session.get("spaceId");
		if !spaceId
			return false;
		space = db.spaces.findOne(spaceId);
		if !space
			return false;
		if Session.get("box") == "monitor"
			if space.admins.contains(Meteor.userId())
				return true;
			else
				flow_ids = WorkflowManager.getMyAdminOrMonitorFlows()
				if flow_ids.includes(flowId)
					return true
				return false;
		else
			return false;

	boxName: ->
		if Session.get("box")
			return t(Session.get("box"))

	hasFlowId: ->
		return !!Session.get("flowId");

	isShowMenu: ->
		# if Session.get("box") == 'inbox'
		# 	inboxInstances = InstanceManager.getUserInboxInstances();
		# 	if inboxInstances.length > 0
		# 		return true

		# return false;
		# return Steedos.isMobile() or $(window).width() < 1280;
		return !Session.get("isWorkflowSidebarOpen");

	sidebar: ()->
		# return $(window).width() >= 1280;
		# return !Steedos.isMobile()
		return Session.get("isWorkflowSidebarOpen")

	isWorkflowShowAsItemSelected: (item)->
		return Session.get("workflow_show_as") == item

Template.instance_list_wrapper.onCreated ->
	self = this;
	self.btnToggleColumnsIcon = new ReactiveVar("expand_alt")

Template.instance_list_wrapper.onRendered ->
	self = this;
	unless $("body").hasClass("three-columns")
		self.btnToggleColumnsIcon.set("contract_alt")

Template.instance_list_wrapper.events

	'click .dropdown-menu li a.export-thismonth': (event) ->
		InstanceManager.exportIns(event.currentTarget.type);

	'click .dropdown-menu li a.export-pro': (event) ->
		if !Steedos.isLegalVersion('',"workflow.professional")
			Steedos.spaceUpgradedModal()
			return;
		InstanceManager.exportIns(event.currentTarget.type);

	'click #instance_search_button': (event) ->
		dataTable = $(".datatable-instances").DataTable();
		dataTable.search(
			Steedos.convertSpecialCharacter($('#instance_search').val()),
		).draw();
		Session.set('instance_search_val', $('#instance_search').val())

	'keypress #instance_search': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-instances").DataTable();
			dataTable.search(
				$('#instance_search').val(),
			).draw();
			Session.set('instance_search_val', $('#instance_search').val())

	'click [name="show_all_ins"]': (event) ->
		Session.set("flowId", undefined);

	'click .list-action-custom-standard_new': (event) ->
		#判断是否为欠费工作区
		if WorkflowManager.isArrearageSpace()
			toastr.error(t("spaces_isarrearageSpace"));
			return;

		WorkflowManager.alertFlowListModel
			title: t("Fill in form")
			subTitle: t("Select a flow")
			helpUrl: t("new_help")
			callBack: (options)->
				if options?.flow
					InstanceManager.newIns(options.flow)

	'click [name="show_flows_btn"]': (event) ->
		WorkflowManager.alertFlowListModel
			title: t("workflow_export_filter")
			showType: "show"
			clearable: true
			callBack: (options)->
				if options?.flow
					Session.set("flowId", options.flow)
				else
					Session.set("flowId", undefined)
				
				if options?.categorie
					Session.set("categorie_id", options.categorie)
				else
					Session.set("categorie_id", undefined)

	'click .list-action-custom-standard_query': (event, template) ->
		Modal.show("instance_more_search_modal")

	'click #sidebarOffcanvas': ()->
		if !Steedos.isMobile() && !Steedos.isPad()
			if !$("body").hasClass("sidebar-collapse")
				$(".treeview-menu").perfectScrollbar()
			else
				$('.treeview-menu').perfectScrollbar('destroy');

	'click .btn-toggle-columns': (event, template)->
		if Session.get("instanceId")
			backURL = "/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box")
			FlowRouter.go(backURL)
		currentTarget = $(event.currentTarget)
		icon = currentTarget.find("i")
		$("body").toggleClass("three-columns")
		$(window).trigger("resize")
		if $("body").hasClass("three-columns")
			template.btnToggleColumnsIcon.set("expand_alt")
			localStorage.removeItem("workflow_three_columns")
		else
			template.btnToggleColumnsIcon.set("contract_alt")
			localStorage.setItem("workflow_three_columns", "off")

	'click .btn-toggle-show-as': (event, template)->
		if Session.get("instanceId")
			backURL = "/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box")
			FlowRouter.go(backURL)
		columns = event.currentTarget.dataset?.columns
		Workflow.renderListLayout columns
		if $("body").hasClass("three-columns")
			template.btnToggleColumnsIcon.set("expand_alt")
		else
			template.btnToggleColumnsIcon.set("contract_alt")
		localStorage.setItem("workflow_show_as", columns)

	'click .btn-toggle-workflow-menu': (event, template)->
		$("body").toggleClass("sidebar-open")

	'click .tabular-introduction': ()->
		Modal.show("tableau_introduction_modal")

	'click th.flow-filter,.tabular-filter-by-flow': ()->
		WorkflowManager.alertFlowListModel
			title: t("workflow_export_filter")
			showType: "show"
			clearable: true
			helpUrl: t("export_filter_help")
			categorie: Session.get("categorie_id")
			flow: Session.get("flowId")
			callBack: (options)->
				if options?.flow
					Session.set("flowId", options.flow)
				else
					Session.set("flowId", undefined)
				
				if options?.categorie
					Session.set("categorie_id", options.categorie)
				else
					Session.set("categorie_id", undefined)


	'click .set-process-delegation-rules': ()->
		if !Steedos.isLegalVersion('',"workflow.professional")
			Steedos.spaceUpgradedModal()
			return;
		FlowRouter.go('/admin/workflow/process_delegation_rules')
	
	'click .slds-page-header--object-home .slds-page-header__title .dx-treeview-toggle-item-visibility': (event) ->
		# 视图下拉菜单中如果有dxTreeView，则应该让点击展开折叠树节点时不隐藏弹出层
		event.stopPropagation()