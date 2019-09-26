TracesTemplate.helpers =
	equals: (a, b) ->
		a == b
	empty: (a) ->
		if a
			a.toString().trim().length < 1
		else
			true
	unempty: (a) ->
		if a
			a.toString().trim().length > 0
		else
			false

	append: (a, b) ->
		a + b

	dateFormat: (date) ->
			if Steedos.isMobile() && date?.getFullYear() == (new Date).getFullYear()
				return $.format.date new Date(date), "MM-dd HH:mm"
			else
				return $.format.date new Date(date), "yyyy-MM-dd HH:mm"

	getStepName: (stepId) ->
		step = WorkflowManager.getInstanceStep(stepId)
		if step
			return step.name
		null
	showDeleteButton: (approved) ->
		if approved and approved.type == 'cc' and approved.from_user == Meteor.userId() and approved.is_finished != true and !Session.get("instancePrint")
			return true
		false
	isShowModificationButton: (approved) ->
		approve_admins = Meteor.settings?.public?.workflow?.approve_admins
		if approve_admins?.length
			isShow = approve_admins?.contains Meteor.userId()
		unless isShow
			return false
		return approved.handler == Meteor.userId()
	isEditing: () ->
		 return Template.instance().is_editing?.get()
	isShowDescription: (approved)->
		# debugger
		if TracesTemplate.helpers.isShowModificationButton approved
			return true
		return approved.description?.toString().trim().length > 0
	isCC: (approved) ->
		if approved and approved.type == 'cc'
			return true
		false
	getApproveStatusIcon: (approveJudge) ->
		#已结束的显示为核准/驳回/取消申请，并显示处理状态图标
		approveStatusIcon = undefined
		switch approveJudge
			when 'approved'
				# 已核准
				approveStatusIcon = 'ion ion-checkmark-round'
			when 'rejected'
				# 已驳回
				approveStatusIcon = 'ion ion-close-round'
			when 'terminated'
				# 已取消
				approveStatusIcon = 'fa fa-ban'
			when 'reassigned'
				# 转签核
				approveStatusIcon = 'ion ion-android-contact'
			when 'relocated'
				# 重定位
				approveStatusIcon = 'ion ion-arrow-shrink'
			when 'retrieved'
				# 已取回
				approveStatusIcon = 'fa fa-undo'
			else
				approveStatusIcon = ''
				break
		approveStatusIcon
	getApproveStatusText: (approveJudge) ->
		if Meteor.isServer
			locale = Template.instance().view.template.steedosData.locale
			if locale.toLocaleLowerCase() == 'zh-cn'
				locale = "zh-CN"
		else
			locale = Session.get("TAPi18n::loaded_lang")
		#已结束的显示为核准/驳回/取消申请，并显示处理状态图标
		approveStatusText = undefined
		switch approveJudge
			when 'approved'
				# 已核准
				approveStatusText = TAPi18n.__('Instance State approved', {}, locale)
			when 'rejected'
				# 已驳回
				approveStatusText = TAPi18n.__('Instance State rejected', {}, locale)
			when 'terminated'
				# 已取消
				approveStatusText = TAPi18n.__('Instance State terminated', {}, locale)
			when 'reassigned'
				# 转签核
				approveStatusText = TAPi18n.__('Instance State reassigned', {}, locale)
			when 'relocated'
				# 重定位
				approveStatusText = TAPi18n.__('Instance State relocated', {}, locale)
			when 'retrieved'
				# 已取回
				approveStatusText = TAPi18n.__('Instance State retrieved', {}, locale)
			when 'returned'
				# 已退回
				approveStatusText = TAPi18n.__('Instance State returned', {}, locale)
			when 'readed'
				# 已阅
				approveStatusText = TAPi18n.__('Instance State readed', {}, locale)
			else
				approveStatusText = ''
				break
		approveStatusText
	_t: (key)->
		return TAPi18n.__(key)

	myApproveDescription: (approveId)->
		if Meteor.isClient
			if Session.get("box") == 'inbox'
				myApprove = Template.instance()?.myApprove?.get()
				if myApprove && myApprove.id == approveId
					if !Session.get("instance_my_approve_description")
						return myApprove?.description || ""
					return Session.get("instance_my_approve_description")
	isForward: (approved) ->
		if approved and approved.type == 'forward'
			return true
		false
	showForwardDeleteButton: (approve) ->
		if db.instances.find(approve.forward_instance).count() is 0
			return false
		if approve and approve.type == 'forward' and approve.from_user == Meteor.userId() and !Session.get("instancePrint") and approve.judge isnt 'terminated'
			return true
		false
	markDownToHtml: (markDownString)->
		if markDownString
			renderer = new Markdown.Renderer();
			renderer.link = ( href, title, text ) ->
				return "<a target='_blank' href='#{href}' title='#{title}'>#{text}</a>"
			return Spacebars.SafeString(Markdown(markDownString, {renderer:renderer}))
	isDistribute: (approve) ->
		if approve and approve.type == 'distribute'
			return true
		false
	showDistributeDeleteButton: (approve) ->
		if db.instances.find(approve.forward_instance).count() is 0
			return false

		if approve and approve.type == 'distribute' and !Session.get("instancePrint") and approve.judge isnt 'terminated' and Steedos.isLegalVersion('',"workflow.enterprise")
			# 流程管理员和系统管理员，可以执行任何情况下的文件取消分发
			ins = db.instances.findOne({_id: approve.instance}, {fields: {flow: 1, space: 1}})
			if ins and ins.flow and ins.space
				if WorkflowManager.hasFlowAdminPermission(ins.flow, ins.space, Meteor.userId())
					return true

			if approve.from_user == Meteor.userId()
				return true

		false

	finishDateSchema: () ->
		if Steedos.isAndroidOrIOS()
			return new SimpleSchema({
				finish_date: {
					autoform: {
						type: "datetime-local"
					},
					optional: false,
					type: Date
				}
			})
		else
			return new SimpleSchema({
				finish_date: {
					autoform: {
						type: "bootstrap-datetimepicker"
						readonly: true
						dateTimePickerOptions:{
							format: "YYYY-MM-DD HH:mm",
							ignoreReadonly:true,
							locale: Session.get("TAPi18n::loaded_lang"),
							widgetPositioning:{
								horizontal: 'right'
							}
						}
					},
					optional: false,
					type: Date
				}
			})

	finishDateValues: () ->
		return {
			finish_date:this.finish_date
		};

	###
    	此函数用于控制是否显示traces view
    	true: 显示traces view,签核历程按钮点击后是直接定位到traces view
    	false: 不显示traces view，签核历程按钮点击后,以Modal 方式显示traces view
	###
	showTracesView: (form, form_version)->
#		return !(InstanceManager.isTableStyle(form) && InstanceformTemplate.helpers.includesOpinionField(form, form_version))

		show_modal_traces_list = db.space_settings.findOne({space: Session.get("spaceId"), key: "show_modal_traces_list"})?.values || false

		return !show_modal_traces_list

	getInstanceStateText: (instance_id)->
		if Meteor.isServer
			locale = Template.instance().view.template.steedosData.locale
			if locale.toLocaleLowerCase() == 'zh-cn'
				locale = "zh-CN"
		else
			locale = Session.get("TAPi18n::loaded_lang")

		ins = db.instances.findOne({_id: instance_id}, {fields: {state: 1, is_read: 1}})
		if not ins
			return TAPi18n.__('instance_deleted', {}, locale)

		text = ''
		if ins.state is 'completed'
			text = TAPi18n.__('completed', {}, locale)
		else if ins.state is 'pending'
			text = TAPi18n.__('pending', {}, locale)
		else if ins.state is 'draft'
			if ins.is_read
				text = TAPi18n.__('instance_approve_read', {}, locale)
			else
				text = TAPi18n.__('instance_approve_not_yet_handled', {}, locale)

		return text

	getInstanceStateColor: (instance_id)->
		ins = db.instances.findOne({_id: instance_id}, {fields: {state: 1, is_read: 1}})
		if not ins
			return ""

		cla = ''
		if ins.state is 'draft'
			if ins.is_read
				cla = 'blue'
			else
				cla = 'red'
		return cla

	firstTrace: (index)->
		return index is 0

	last_distribute_from: (instance_id)->
		ins = db.instances.findOne({_id: instance_id, distribute_from_instance: {$exists: true}},{fields:{created: 1, created_by: 1}})
		if ins
			dis_info = {}
			user = {}
			if Meteor.isClient
				user = UUflow_api.getNameForUser(ins.created_by)
			else if Meteor.isServer
				user = db.users.findOne({_id: ins.created_by}, {fields: {name: 1}})

			if user.name
				dis_info.from_user_name = user.name
				dis_info.created = ins.created

			if not _.isEmpty(dis_info)
				return dis_info
		return

	isCCOrDistributeOrForwardTerminated: (approve)->
		if (approve.type is 'cc' or approve.type is 'distribute' or approve.type is 'forward') and approve.judge is 'terminated'
			return true
		return false

	judgeTerminated: (judge)->
		return judge is 'terminated'

	instanceExists: (instance_id)->
		return !!db.instances.find(instance_id).count()

	agentDescription: (userName)->
		if Meteor.isServer
			locale = Template.instance().view.template.steedosData.locale
			if locale.toLocaleLowerCase() == 'zh-cn'
				locale = "zh-CN"
		else
			locale = Session.get("TAPi18n::loaded_lang")

		return TAPi18n.__('process_delegation_rules_description', {userName: userName}, locale)
	traceName: (instance_id, traceId)->
		return _.find(db.instances.findOne(instance_id, {fields: {traces: 1}})?.traces, (trace)->
					return trace._id ==  traceId
		)?.name
if Meteor.isServer
	TracesTemplate.helpers.dateFormat = (date)->
		if date
			utcOffset = Template.instance().view.template.steedosData.utcOffset
			return InstanceReadOnlyTemplate.formatDate(date, utcOffset);

	TracesTemplate.helpers._t = (key)->
		locale = Template.instance().view.template.steedosData.locale
		return TAPi18n.__(key, {}, locale)

	TracesTemplate.helpers.showDeleteButton = (approved) ->
		return false;

TracesTemplate.events =
	'click .cc-approve-remove': (event, template) ->
		event.stopPropagation()
		if event.currentTarget.dataset.calling * 1 != 1
			event.currentTarget.dataset.calling = 1
			$("i",event.currentTarget).addClass("fa-spin")
			instanceId = Session.get('instanceId')
			approveId = event.target.dataset.approve
			# CALL 删除approve函数。
			$("body").addClass("loading")
			Meteor.call 'cc_remove', instanceId, approveId, (err, result) ->
				$("body").removeClass("loading")
				if err
					toastr.error err
					event.currentTarget.dataset.calling = 0
					$("i",event.currentTarget).removeClass("fa-spin")
				if result == true
					toastr.success(TAPi18n.__("remove_cc_approve"));
					if $(".instance-trace-detail-modal").length
						Modal.hide "instance_trace_detail_modal"
				return
			return

	'click .instance-trace-detail-modal .btn-cc-approve-remove': (event, template) ->
		instanceId = Session.get('instanceId')
		approveId = event.target.dataset.approve
		# CALL 删除approve函数。
		$("body").addClass("loading")
		Meteor.call 'cc_remove', instanceId, approveId, (err, result) ->
			$("body").removeClass("loading")
			if err
				toastr.error err
			if result == true
				toastr.success(TAPi18n.__("remove_cc_approve"));
				Modal.hide "instance_trace_detail_modal"
			return
		return

	'click .approve-item,.approve-description': (event, template) ->
		Modal.show "instance_trace_detail_modal", this

	'taphold .approve-item,.approve-description': (event, template) ->
		Modal.show "instance_trace_detail_modal", this

	'tapend .approve-item,.approve-description': (event, template) ->
		# 上述长按打开approve详细窗口的事件taphold会触发打开窗口后的touchend事件，造成长按打开窗口后一放手窗口就又关掉了
		# 这里只能通过阻止tapend事件(不可以用touchend事件，因为会影响taphold功能，造成没有长按效果时也会触发taphold事件)冒泡来避免问题。
		event.stopPropagation()
		event.preventDefault()
		return false

	'click .instance-trace-detail-modal .btn-forward-approve-remove': (event, template) ->
		instanceId = Session.get('instanceId')
		approveId = event.target.dataset.approve
		traceId = event.target.dataset.trace
		# CALL 删除approve函数。
		$("body").addClass("loading")
		Meteor.call 'forward_remove', instanceId, traceId, approveId, (err, result) ->
			$("body").removeClass("loading")
			if err
				toastr.error TAPi18n.__(err.reason)
			if result == true
				toastr.success(TAPi18n.__("instance_approve_forward_remove_success"));
				Modal.hide "instance_trace_detail_modal"
			return
		return

	'click .instance-trace-detail-modal .btn-forward-instance-look': (event, template) ->
		forward_space = event.target.dataset.forwardspace
		forward_instance = event.target.dataset.forwardinstance
		Steedos.openWindow(Steedos.absoluteUrl("workflow/space/" + forward_space + "/view/readonly/" + forward_instance))

	'click .btn-modification'	: (event, template) ->
		template.is_editing.set(!template.is_editing.get());
		unless Steedos.isAndroidOrIOS()
			Tracker.afterFlush ->
				# 显示日志的时候把滚动条往下移点，让日期控件显示出一部分，以避免用户看不到日期控件
				$("#instance_trace_detail_modal #finish_input").on "dp.show", () ->
					$(".modal-body").scrollTop(100)

	'click .btn-cancelBut' : (event, template) ->

		template.is_editing.set(!template.is_editing.get());

	'click .btn-saveBut' : (event, template) ->
		# template.is_editing.set(!template.is_editing.get())

		instanceId = Session.get('instanceId')
		approveId = event.target.dataset.approve
		traceId = event.target.dataset.trace
		opinion_input = $('#opinion_input').val()
		finish_input = AutoForm.getFieldValue("finish_date", "finishDateAutoForm")

		$("body").addClass("loading")
		Meteor.call 'change_approve_info', instanceId, traceId, approveId, opinion_input, finish_input, (err, result)->
			$("body").removeClass("loading")
			if err
				toastr.error TAPi18n.__(err.reason)
			if result == true
				toastr.success(t("instance_approve_modal_modificationsave"))
				Modal.hide "instance_trace_detail_modal"
			return

	'click .instance-trace-detail-modal .btn-distribute-approve-remove': (event, template) ->
		Modal.allowMultiple = true
		Modal.show 'cancel_distribute_modal'
