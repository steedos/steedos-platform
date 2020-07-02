Template.instance_traces_table.helpers(TracesTemplate.helpers);

Template.instance_traces_table.events(TracesTemplate.events)

Template.instance_traces_table.onRendered(function() {
	Tracker.autorun(
		function() {
			var ins = WorkflowManager.getInstance();
			if (!ins)
				return
			var instance_ids = [];
			_.each(TracesManager.getTracesListData(ins), function(t) {
				_.each(t.approves, function(a) {
					if (a.type == 'distribute') {
						instance_ids.push(a.forward_instance)
					}
				})
			})
			if (!_.isEmpty(instance_ids)) {
				Steedos.subs["distributed_instances"].subscribe('distributed_instances_state_by_ids', instance_ids)
			}
		}
	)

})


Template.instance_traces_table.onCreated(function() {
	self = this;
	myApprove = InstanceManager.getCurrentApprove()
	self.myApprove = new ReactiveVar(myApprove);
})