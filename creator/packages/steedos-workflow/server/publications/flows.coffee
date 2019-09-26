Meteor.publish 'flows', (spaceId)->
	unless this.userId
		return this.ready()

	unless spaceId
		return this.ready()

	# 第一次订阅时初始化工作区
	if db.flows.find({space: spaceId}).count() == 0
		db.spaces.createTemplateFormAndFlow(spaceId)

	return db.flows.find({space: spaceId}, {
		fields: {
			name: 1,
			form: 1,
			state: 1,
			perms: 1,
			space: 1,
			company_id: 1,
			sort_no: 1
		}
	})


Meteor.publish 'flow_version', (spaceId, flowId, versionId) ->
	unless this.userId
		return this.ready()

	unless spaceId
		return this.ready()

	unless flowId
		return this.ready()

	unless versionId
		return this.ready()


	self = this;

	getFlowVersion = (id , versionId)->
		flow = db.flows.findOne({_id : id});
		if flow
			flow_version = flow.current
			flow_version.latest = true

			if flow_version._id != versionId
				flow_version = flow.historys.findPropertyByPK("_id", versionId)
				flow_version.latest = false

			return flow_version
	handle = db.flows.find({_id: flowId}, {fields: {_id: 1, "current.modified": 1}}).observeChanges {
		changed: (id)->
			self.changed("flow_versions", versionId, getFlowVersion(id, versionId));
	}


	self.added("flow_versions", versionId, getFlowVersion(flowId, versionId));
	self.ready();
	self.onStop ()->
		handle.stop()

Meteor.publish 'distribute_optional_flows', (flow_ids)->
	unless this.userId
		return this.ready()

	unless flow_ids
		return this.ready()

	return db.flows.find({_id: {$in: flow_ids}}, {
		fields: {
			name: 1,
			form: 1,
			state: 1,
			perms: 1,
			space: 1,
			distribute_optional_users: 1,
			distribute_to_self: 1,
			distribute_end_notification: 1,
			company_id: 1
		}
	})

Meteor.publish 'flow', (spaceId, flowId)->
	unless this.userId
		return this.ready()

	unless spaceId
		return this.ready()

	unless flowId
		return this.ready()


	return db.flows.find({_id: flowId, space: spaceId}, {
		fields: {
			print_template: 1,
			instance_template: 1,
			events: 1,
			distribute_optional_users: 1,
			distribute_to_self: 1,
			upload_after_being_distributed: 1,
			distribute_end_notification: 1,
			company_id: 1
		}
	})

Meteor.publishComposite 'flows_tabular', (tableName, ids, fields)->
	check(tableName, String);
	check(ids, Array);
	check(fields, Match.Optional(Object));

	unless this.userId
		return this.ready()

	this.unblock()

	find: ->
		this.unblock()
		db.flows.find {_id: {$in: ids}}, fields: fields

	children: [
		{
			find: (flow) ->
				@unblock()
				# Publish the related user
				db.space_users.find {
					space: flow.space,
					user: flow.current.modified_by
				}, fields:
					space: 1
					user: 1
					name: 1
		},
		{
			find: (flow) ->
				@unblock()
				# Publish the related user
				db.forms.find {
					space: flow.space,
					_id: flow.form
				}, fields:
					space: 1
					_id: 1
					name: 1,
					category: 1
		},
		{
			find: (flow) ->
				@unblock()
				# Publish the related user
				db.categories.find {
					space: flow.space
				}, fields:
					space: 1
					_id: 1
					name: 1
		}
	]