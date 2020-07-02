
	Meteor.publish 'instances_list', (spaceId, box, flowId)->

		unless this.userId
			return this.ready()
		
		unless spaceId
			return this.ready()

		query = {space: spaceId}
		if box == "inbox"
			query.inbox_users = this.userId;
		else if box == "outbox"
			query.outbox_users = this.userId;
		else if box == "draft"
			query.submitter = this.userId;
			query.state = "draft"
		else if box == "pending"
			query.submitter = this.userId;
			query.state = "pending"
		else if box == "completed"
			query.submitter = this.userId;
			query.state = "completed"
		else if box == "monitor"
			query.flow = flowId;
			query.state = {$in: ["pending","completed"]};
		else
			query.state = "none"

		return db.instances.find(query, {fields: {name:1, created:1, form:1, flow: 1, space:1, modified:1, applicant: 1, is_archived:1, form_version: 1, flow_version: 1}})

