InstanceNumberRules = {};

InstanceNumberRules.instanceNumberBuilder = (element, name) ->
	Meteor.call "instanceNumberBuilder", Session.get("spaceId"), name, (error, result) ->
		if error
			toastr.error(t("instance_number_rules_number_builder_error_not_exist") + error.reason, t("instance_number_rules_number_builder_error_title"))
		else
			element?.val(result).trigger("change")
			InstanceManager.saveIns();