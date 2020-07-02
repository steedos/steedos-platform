
Template.instance_trace_detail_modal.helpers(TracesTemplate.helpers);

Template.instance_trace_detail_modal.events(TracesTemplate.events)

Template.instance_trace_detail_modal.onRendered(function () {
	
})
Template.instance_trace_detail_modal.onCreated(function () {
	this.is_editing = new ReactiveVar(false);
})