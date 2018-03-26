Template.reportView.onCreated ->
	this.is_chart_open = new ReactiveVar()
	this.is_chart_disabled = new ReactiveVar(false)
	this.report_settings = new ReactiveVar()
	this.dataGridInstance = new ReactiveVar()
	this.pivotGridInstance = new ReactiveVar()

Template.reportView.onRendered ->
	self = this

	self.$(".report-view").removeClass "hidden"
	self.$(".report-view").animateCss "fadeInRight"

Template.reportView.helpers
	report_content_params: ()->
		return {
			is_chart_open: Template.instance().is_chart_open
			is_chart_disabled: Template.instance().is_chart_disabled
			report_settings: Template.instance().report_settings
			dataGridInstance: Template.instance().dataGridInstance
			pivotGridInstance: Template.instance().pivotGridInstance
		}

Template.reportView.events
	'click .report-view-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$(".report-view").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'