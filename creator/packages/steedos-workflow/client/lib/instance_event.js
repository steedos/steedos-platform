InstanceEvent = {};

InstanceEvent.before = {}


function getFlowEvent(flowId) {
	var flow = WorkflowManager.getFlow(flowId);
	if(flow){
		return flow.events;
	}
}

InstanceEvent.initEvents = function(flowId) {

	//解除绑定
	$(".instance-form").unbind('instance-before-submit')
	$(".instance-form").unbind('instance-before-save')
	$("#ins_upload_main_attach").unbind('instance-before-upload')
	$("#ins_attach_version").unbind('instance-before-upload')
	$("#ins_upload_normal_attach").unbind('instance-before-upload')
	$("#ins_attach_version").unbind('instance-before-upload')
	$(".instance-forward-modal").unbind('onload')
	$(".instance-distribute-modal").unbind('onload')
	$("body").unbind('after-save')


	var eventStr = getFlowEvent(flowId);
	if(eventStr){
		try {
			eval(eventStr);
		} catch (e) {

			toastr.error(TAPi18n.__("flows_events_error") + e);

			console.error('flow Event Error: ' + e);
		}
	}
}

/*
 * return true：继续执行; false 中断后续操作
 *  "instance-before-submit" / "instance-before-upload"
 */
InstanceEvent.run = function (element, eventName, content) {
	var ins = WorkflowManager.getInstance();

	if(!ins)
		return true;

	var eventStr = getFlowEvent(ins.flow);

	if(!eventStr)
		return true;

	if(!content){
		content = {};
	}

	var event = jQuery.Event(eventName, content);

	element.trigger(event);

	return !event.isDefaultPrevented();
}

/*
* return true：继续执行; false 中断后续操作
*/
InstanceEvent.before.instanceSubmit = function() {
	var ins = WorkflowManager.getInstance();

	if(!ins)
		return true;

	var eventStr = getFlowEvent(ins.flow);

	if(!eventStr)
		return true;

	var event = jQuery.Event("instance-before-submit", {
		// instance: instance
	});

	$(".instance-form").trigger(event);

	return !event.isDefaultPrevented();
}