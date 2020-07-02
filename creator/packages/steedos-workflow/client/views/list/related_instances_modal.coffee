Template.related_instances_modal.helpers
	instances_doc: ->
		return db.instances.findOne({_id: Session.get("instanceId")});

#	selectedOptions: ->
#		opts = AutoForm.getFieldValue("related_instances", "related_instances");
#		if opts
#			return opts
#		else
#			return ""
	schema: ->
		return db.instances._simpleSchema;

	seletec_length: ->
		return Session.get("related_instances").length

Template.related_instances_modal.onCreated ()->
	related_instances = WorkflowManager.getInstance()?.related_instances || []
	TabularTables.related_instances_tabular.related_instances = related_instances
	Session.set("related_instances", related_instances)

Template.related_instances_modal.events
	'click .btn-submit-related-instances': ()->
		$("#related_instances").submit();
		$(".btn-data-dismiss").click();

	'click tbody > tr': (event, template) ->
		$("input", event.currentTarget).click()

	'click .related-instances-list-checkbox': (event, template)->
		ids = Session.get("related_instances");
		_id = event.currentTarget.value
		if event.currentTarget.checked
			ids.push _id
		else
			ids.remove(ids.indexOf(_id))
		ids = _.compact(ids)
		ids = _.uniq(ids)
		Session.set("related_instances", ids)
		TabularTables.related_instances_tabular.related_instances = ids
		event.stopPropagation()

	'click .save-instances-related': (event, template)->
		Meteor.call "update_instance_related", Session.get("instanceId"), Session.get("related_instances"), (error, result)->
			if error
				toastr.error(error)
			Modal.hide(template)
			InstanceEvent.run($(".save-instances-related"), "after-save", {related_instances: result})

	'click #reverse': (event, template) ->
		$('.related-instances-list-checkbox', $(".related-instances-table")).each ->
			$(this).prop('checked', !event.target.checked).trigger('click')

Template.related_instances_modal.onDestroyed ->
	TabularTables.related_instances_tabular.related_instances = []
