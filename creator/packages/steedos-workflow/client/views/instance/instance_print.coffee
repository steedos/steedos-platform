Template.instancePrint.helpers
	hasInstance: ()->
		Session.get("instanceId");
		instance = WorkflowManager.getInstance();
		if instance
			return true
		return false

	instance: ()->
		return WorkflowManager.getInstance();

	# 只有在流程属性上设置tableStype 为true 并且不是手机版才返回true.
	isTableView: (formId)->
		form = WorkflowManager.getForm(formId);

		if Steedos.isMobile()
			return false

		if form?.instance_style == 'table'
			return true
		return false

	unequals: (a, b) ->
		return !(a == b)

	enableAmisform: ()->
		return InstanceManager.isAmisForm()

	readOnlyView: ()->
		steedos_instance = WorkflowManager.getInstance();
		if steedos_instance
			return InstanceReadOnlyTemplate.getInstanceView(db.users.findOne({_id: Meteor.userId()}), Session.get("spaceId"), steedos_instance);

	formDescription: ->
		ins = WorkflowManager.getInstance();
		if ins
			return WorkflowManager.getForm(ins.form)?.description?.replace(/\n/g,"<br/>")
	printButton:->		 
		 return t('instance_print')

	isShowAttachments: ->
		return Template.instance().isShowAttachments?.get()

	isShowTraces: ->
		return Template.instance().isShowTraces?.get()

	isShowTracesSimplify: ->
		return Template.instance().isShowTracesSimplify?.get()

	simplifyTraces: (traces)->
		startEndStepIds = []
		_.each WorkflowManager.getInstanceSteps(), (s)->
			if s.step_type == "start" || s.step_type == "end"
				startEndStepIds.push(s._id)
		if _.isEmpty startEndStepIds
			return []
		steps = {}
		traces.forEach (t, index)->
			if ['rejected', 'relocated', 'retrieved', 'returned'].includes(t.judge) || startEndStepIds.includes(t.step)
				delete traces[index]
				return
			t.approves?.forEach (a, idx)->
				if ['reassigned', 'retrieved', 'returned', 'rejected'].includes(a.judge) || ['cc', 'forward', 'distribute'].includes(a.type)
					delete t.approves[idx]
					return
			if _.has steps, t.step
				delete traces[steps[t.step]]
			steps[t.step] = index

		return traces

Template.instancePrint.step = 1;

Template.instancePrint.plusFontSize = (node)->
	if node?.children()
		node.children().each (i, n) ->
			cn = $(n)

			if !["STYLE"].includes(cn.prop("tagName")) && (cn?.contents().filter(-> @nodeType == 3).text().trim() || ["INPUT",
				"TEXTEAR"].includes(cn.prop("tagName")))
				if cn?.css("font-size") && cn?.css("font-size") != cn?.parent().prop("style").fontSize
					thisFZ = cn.css("font-size")
					unit = thisFZ.slice(-2)
					cn.css("font-size", parseFloat(thisFZ, 10) + Template.instancePrint.step + unit);

			if cn?.children().length > 0 && cn?.children("br").length < cn?.children().length
				Template.instancePrint.plusFontSize(cn)


Template.instancePrint.minusFontSize = (node)->
	if node?.children()
		node.children().each (i, n) ->
			cn = $(n)

			if !["STYLE"].includes(cn.prop("tagName")) && (cn?.contents().filter(-> @nodeType == 3).text().trim() || ["INPUT",
				"TEXTEAR"].includes(cn.prop("tagName")))
				if cn?.css("font-size") && cn?.css("font-size") != cn?.parent().prop("style").fontSize
					thisFZ = cn.css("font-size")
					unit = thisFZ.slice(-2)
					cn.css("font-size", parseFloat(thisFZ, 10) - Template.instancePrint.step + unit);

			if cn?.children().length > 0 && cn?.children("br").length < cn?.children().length
				Template.instancePrint.minusFontSize(cn)

Template.instancePrint.events
#    "change #print_traces_checkbox": (event, template) ->
#        if event.target.checked
#            $(".instance-traces").show()
#        else
#            $(".instance-traces").hide()

	"change #print_attachments_checkbox": (event, template) ->
		if event.target.checked
			$(".instance_attachments").show()
		else
			$(".instance_attachments").hide()

	"click #instance_to_print": (event, template) ->
		$(".toast").hide()
		if $(".box-body", $(".instance-traces")).is(":hidden")
			$(".instance-traces").addClass("no-print")
		else
			$(".instance-traces").removeClass("no-print")

		window.print()

	"click #font-plus": (event, template) ->
		Template.instancePrint.plusFontSize $(".instance")

	"click #font-minus": (event, template) ->
		Template.instancePrint.minusFontSize $(".instance")

	"click .cbx-print-attachments": (event, template) ->
		isChecked = $(event.currentTarget).is(':checked')
		template.isShowAttachments.set(isChecked)
		if isChecked
			localStorage.setItem "print_is_show_attachments", isChecked
		else
			localStorage.removeItem "print_is_show_attachments"

	"click .cbx-print-traces": (event, template) ->
		isChecked = $(event.currentTarget).is(':checked')
		template.isShowTraces.set(isChecked)
		if isChecked
			localStorage.setItem "print_is_show_traces", isChecked
		else
			localStorage.removeItem "print_is_show_traces"

	"click .cbx-print-traces-simplify": (event, template) ->
		isChecked = $(event.currentTarget).is(':checked')
		template.isShowTracesSimplify.set(isChecked)
		if isChecked
			localStorage.setItem "print_is_show_traces_simplify", isChecked
		else
			localStorage.removeItem "print_is_show_traces_simplify"

	"change input[name='printWidthA4']": (event, template)->
		$('#printWidth').val(event.target.value).trigger('change')

	"change #printWidth": (event, template)->
		$(".instance-print .content-wrapper").width(event.target.value + 'mm')

Template.instancePrint.onCreated ->
	Form_formula.initFormScripts()
	this.isShowAttachments = new ReactiveVar(false)
	this.isShowTraces = new ReactiveVar(false)
	this.isShowTracesSimplify = new ReactiveVar(false)

Template.instancePrint.onRendered ->

	$("body").css("background-image","");
	$("body").css("background","silver");

	$("body").css("position","static");

	# package twbs:bootstrap 中写了table table-bordered的打印样式,会导致申请单打印时, border异常, 因此在打印时,异常子表的这2个class
	$(".autoform-table").removeClass('table table-bordered');

	$("#tracesCollapse")?.click()

	Form_formula.runFormScripts("instanceform", "onload");
	# if window.navigator.userAgent.toLocaleLowerCase().indexOf("chrome") < 0
	# 	toastr.warning(TAPi18n.__("instance_chrome_print_warning"))

	if localStorage.getItem("print_is_show_attachments") == 'true'
		Template.instance().isShowAttachments.set(true)
		$(".instance-print .cbx-print-attachments").attr("checked",true)
	if localStorage.getItem("print_is_show_traces") == 'true'
		Template.instance().isShowTraces.set(true)
		$(".instance-print .cbx-print-traces").attr("checked",true)
	if localStorage.getItem("print_is_show_traces_simplify") == 'true'
		Template.instance().isShowTracesSimplify.set(true)
		$(".instance-print .cbx-print-traces-simplify").attr("checked",true)

	# 判断html字段中是否只有table标签，如果是，则加上样式类steedos-html-table-only，其会实现表格撑滿的样式
	htmlFieldContainer = $(".instance-print .instance .steedos-html")
	htmlFieldContainer.each (key, item)->
		htmlItem = $(item);
		if htmlItem.find("> table").length == htmlItem.children().length
			htmlItem.addClass("steedos-html-table-only")