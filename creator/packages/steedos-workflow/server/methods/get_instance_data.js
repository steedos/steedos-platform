Meteor.methods({

	get_instance_data: function (instance_id, formCached, flowCached) {

		check(instance_id, String);
		check(formCached, Boolean);
		check(flowCached, Boolean);

		var instance = db.instances.findOne(instance_id);

		if (!instance)
			return {
				instance: null
			};

		if (formCached && flowCached)
			return {
				instance: instance
			};

		if (!formCached) {
			var form = db.forms.findOne(instance.form);
			var form_version = {};
			if (form.current._id == instance.form_version) {
				form_version = form.current;
			}
			else {
				form_version = _.where(form.historys, {_id: instance.form_version})[0];
			}
		}


		if (!flowCached) {
			var flow = db.flows.findOne(instance.flow);
			var flow_version = {};
			if (flow.current._id == instance.flow_version) {
				flow_version = flow.current;
			}
			else {
				flow_version = _.where(flow.historys, {_id: instance.flow_version})[0];
			}
		}

		return {
			instance: instance,
			form_version: form_version,
			flow_version: flow_version
		}

	}

});
