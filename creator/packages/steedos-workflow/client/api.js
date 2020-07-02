Workflow.getInstance = function() {
	var instance = WorkflowManager.getInstance();

	if (!instance)
		return;

	if (instance.state == "draft") {
		var selected_applicant = $("input[name='ins_applicant']")[0].dataset.values;
		if (instance.applicant != selected_applicant) {
			var space_id = instance.space;
			var applicant = SteedosDataManager.spaceUserRemote.findOne({
				space: space_id,
				user: selected_applicant
			}, {
				fields: {
					organization: 1,
					name: 1
				}
			});
			var org_id = applicant.organization;
			var organization = SteedosDataManager.organizationRemote.findOne(org_id, {
				fields: {
					name: 1,
					fullname: 1
				}
			});

			instance.applicant = selected_applicant;
			instance.applicant_name = applicant.name;
			instance.applicant_organization = org_id;
			instance.applicant_organization_name = organization.name;
			instance.applicant_organization_fullname = organization.fullname;
		}
	}

	// instance = _.clone(instance)  //不允许调用方修改instance对象

	return instance;
}

Workflow.getMyApprove = function() {
	return InstanceManager.getMyApprove();
}


Workflow.getInstanceAttachments = function(instanceId, approveId) {

	if (approveId) {
		return cfs.instances.find({
			"metadata.instance": instanceId
		}).fetch()
	} else {
		return cfs.instances.find({
			"metadata.approve": approveId
		}).fetch()
	}
}