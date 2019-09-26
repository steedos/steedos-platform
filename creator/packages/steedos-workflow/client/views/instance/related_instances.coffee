Template.related_instances.helpers RelatedInstances.helpers


Template.related_instances.events
	'click .ins-related-delete': (event, template)->
		Meteor.call("remove_related", Session?.get("instanceId"), this._id)

	'click #related_instace': (event, template)->
		event.preventDefault();
		Steedos.openWindow(Steedos.absoluteUrl("workflow/space/"+this.space+"/view/readonly/" + this._id + '?hide_traces=0'))