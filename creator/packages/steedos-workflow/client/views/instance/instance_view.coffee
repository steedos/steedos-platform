Template.instance_view.helpers
	instance: ->
		Session.get("change_date")
		if (Session.get("instanceId"))
			steedos_instance = WorkflowManager.getInstance();
			return steedos_instance;


	unequals: (a, b) ->
		return !(a == b)

	# 只有在流程属性上设置tableStype 为true 并且不是手机版才返回true.
	isTableView: (formId)->
		form = WorkflowManager.getForm(formId);

		if Steedos.isMobile()
			return false

		if form?.instance_style == 'table'
			return true
		# return true
		return false;

	readOnlyView: ()->
		steedos_instance = WorkflowManager.getInstance();
		if steedos_instance
			return InstanceReadOnlyTemplate.getInstanceView(db.users.findOne({_id: Meteor.userId()}), Session.get("spaceId"), steedos_instance);

	isIReadable: ()->
		ins = WorkflowManager.getInstance();
		if InstanceManager.isCC(ins)
			return false
		return ApproveManager.isReadOnly();

	instanceStyle: (formId)->
		form = WorkflowManager.getForm(formId);

		if Steedos.isMobile()
			return "instance-default"

		if form?.instance_style == 'table'
			return "instance-table"
		return "instance-default";

	showTracesView: (form, form_version)->
		return TracesTemplate.helpers.showTracesView(form, form_version)

	tracesTemplateName: (formId)->
		form = WorkflowManager.getForm(formId);

		if Steedos.isMobile()
			return "instance_traces"

		if form?.instance_style == 'table'
			return "instance_traces_table"
		# return true
		return "instance_traces";

	instance_box_style: ->
		box = Session.get("box")
		if box == "inbox" || box == "draft"
			judge = Session.get("judge")
			if judge
				if (judge == "approved")
					return "box-success"
				else if (judge == "rejected")
					return "box-danger"
		ins = WorkflowManager.getInstance();
		if ins && ins.final_decision
			if ins.final_decision == "approved"
				return "box-success"
			else if (ins.final_decision == "rejected")
				return "box-danger"

	formDescription: ->
		ins = WorkflowManager.getInstance();
		if ins
			return WorkflowManager.getForm(ins.form)?.description?.replace(/\n/g,"<br/>")

	get_priority_class: ()->
		ins = WorkflowManager.getInstance()
		if !ins
			return ""

		priorityClass = ""
		priorityValue = ins.values?.priority
		switch priorityValue
			when "特急"
				priorityClass = "instance-priority-danger"
			when "紧急"
				priorityClass = "instance-priority-warning"
			when "办文"
				priorityClass = "instance-priority-muted"

		return priorityClass

	box: ()->
		return Session.get("box");

	isInbox: ()->
		return InstanceManager.isInbox()

	tracesListData: (instance)->
		return instance.traces

	notDistributeAndDraft: (state)->
		ins = WorkflowManager.getInstance()
		if ins
			if state is 'draft' and !ins.distribute_from_instance
				return false

		return true

	showPickApproveUsers: ()->
		return WorkflowManager.getFlow(WorkflowManager.getInstance().flow).allow_select_step;

Template.instance_view.onCreated ->
	Form_formula.initFormScripts()
	Session.set("instance_submitting", false);

Template.instance_view.onRendered ->

	ins = WorkflowManager.getInstance();

	form_version = db.form_versions.findOne({_id: ins.form_version})

	flow_version = db.flow_versions.findOne({_id: ins.flow_version})

	if Session.get("box") == 'draft' && (form_version.latest != true || flow_version.latest != true)
		InstanceManager.saveIns();

	Form_formula.runFormScripts("instanceform", "onload");

	if Session.get("box") == "inbox"
		InstanceManager.setApproveHaveRead(Session.get("instanceId"))

	$(".workflow-main").addClass("instance-show")

	# isNeedActiveSuggestion = Session.get("box") == "inbox" and WorkflowManager.getInstance()?.state == "pending"
	isNeedActiveSuggestion = true
	if !Steedos.isMobile() && !Steedos.isPad()
		# 增加.css("right","-1px")代码是为了fix掉perfectScrollbar会造成右侧多出空白的问题
		$('.instance').perfectScrollbar().css("right","-1px")
		if isNeedActiveSuggestion
			$('.instance').on 'ps-y-reach-end', ->
				# if this.scrollTop == 0
				# 	# 内容高度不足于出现滚动条时也会触发该事件，需要排除掉。
				# 	return
				unless $('.instance-wrapper .instance-view').hasClass 'suggestion-active'
					$('.instance-wrapper .instance-view').toggleClass 'suggestion-active'
					InstanceManager.fixInstancePosition(true)
	else if isNeedActiveSuggestion
		preScrollTop = 0
		loap = 0
		$(".instance").scroll (event)->
			clearTimeout loap
			self = this
			# 这里增加setTimeout除了优化性能外，更重要的是解决触发次数过多造成的动画效果不流畅问题
			loap = setTimeout ->
				scrollTop = self.scrollTop
				scrollH = self.scrollHeight
				viewH = $(self).innerHeight()
				diffValue = (scrollH-viewH) - scrollTop
				if diffValue < 20
					if scrollTop >= preScrollTop
						unless $('.instance-wrapper .instance-view').hasClass 'suggestion-active'
							$('.instance-wrapper .instance-view').toggleClass 'suggestion-active'
							InstanceManager.fixInstancePosition(true)
					preScrollTop = scrollTop
			,100

	if Steedos.isMobile()
		Steedos.bindSwipeBackEvent(".instance-wrapper", (event,options)->
			$(".btn-instance-back").trigger("click")
		)

	if Session.get("box") == "inbox" || Session.get("box") == "draft"
		console.log("onRendered 160...")
		Session.set("instance_next_user_recalculate", Random.id())

	$("body").removeClass("loading")

	# 草稿状态申请单对应的流程已被禁用则提示用户
	if ins.state is 'draft'
		flow = db.flows.findOne({_id: ins.flow},{fields:{state: 1, name: 1}})
		if flow and flow.state is 'disabled'
			swal({
				title: t('workflow_flow_state_disabled', {name: flow.name}),
				confirmButtonText: t("OK"),
				type: 'warning'
			})

Template.instance_view.onDestroyed ->
	Session.set("instance_next_user_recalculate", null)
	Steedos.subs["instance_data"].clear()

Template.instance_view.events
	'change .instance-view .form-control,.instance-view .suggestion-control,.instance-view .checkbox input,.instance-view .af-radio-group input,.instance-view .af-checkbox-group input': (event, template) ->
		Session.set("instance_change", true);

	'typeahead:change .form-control': (event) ->
		Session.set("instance_change", true)

	'change #ins_upload_main_attach': (event, template)->
		# 正文最多只能有一个
		main_attach_count = cfs.instances.find({
			'metadata.instance': Session.get("instanceId"),
			'metadata.current': true,
			'metadata.main': true
		}).count()

		if main_attach_count >= 1
			toastr.warning  TAPi18n.__("instance_attach_main_only_one")
			return


		if event.target.files.length > 0
			if !InstanceEvent.run($("#ins_upload_main_attach"), "instance-before-upload")
				$("#ins_upload_main_attach").val('')
				return

		InstanceManager.uploadAttach(event.target.files, false, true)

		$("#ins_upload_main_attach").val('')

	'change #ins_upload_normal_attach': (event, template)->
		if event.target.files.length > 0
			if !InstanceEvent.run($("#ins_upload_normal_attach"), "instance-before-upload")
				$("#ins_upload_normal_attach").val('')
				return

		InstanceManager.uploadAttach(event.target.files, false, false)

		$("#ins_upload_normal_attach").val('')

	'click .btn-instance-back': (event)->
		backURL = "/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box")
		FlowRouter.go(backURL)


	'click #ins_new_main_file': (event, template)->
		Session.set('attach_parent_id', "")
		Session.set('attach_instance_id', Session.get("instanceId"))
		Session.set('attach_space_id', Session.get("spaceId"))
		Session.set('attach_box', Session.get("box"))
		# 正文最多只有一个
		main_attach_count = cfs.instances.find({
			'metadata.instance': Session.get('attach_instance_id'),
			'metadata.current': true,
			'metadata.main': true
		}).count()

		if main_attach_count >= 1
			toastr.warning  TAPi18n.__("instance_attach_main_only_one")
			return

		arg = "Steedos.User.isNewFile"

		# 默认文件名为文件标题
		formattedInsName = WorkflowManager.getInstance().name.replace(/\r/g,"").replace(/\n/g,"")
		newFileName = formattedInsName + '.doc'

		downloadUrl = window.location.origin + "/word/demo.doc"

		# 如果设置了正文模板则使用流程正文模板
		ins = WorkflowManager.getInstance()
		flow_main_attach_template = Creator.getCollection('cms_files').findOne({ space: ins.space, 'parent.o': 'flows', 'parent.ids': ins.flow, name: '正文.docx' })
		if flow_main_attach_template
			newFileName = formattedInsName + '.docx'
			downloadUrl = window.location.origin + "/api/files/files/#{flow_main_attach_template.versions[0]}"

		NodeManager.downloadFile(downloadUrl, newFileName, arg)

	'click #nextStepUsers': (event, template)->

		error = event.target.dataset.error
		error_type = event.target.dataset.error_type
		error_code = event.target.dataset.error_code

#		console.log("error", error)
#
#		console.log("error_type", error_type)
#
#		console.log("error_code", error_code)

		if error && error_type

			console.log(ApproveManager.isReadOnly());

			NextStepUser.handleException({error: error_type, reason: error, error_code: error_code})

#			event.preventDefault()
#
#			event.stopPropagation()

			return false;

	'change #nextStepUsers': (event, template)->
		InstanceManager.checkNextStepUser()
