{ workflowMethods } = require('@steedos/workflow')
_eval = require('eval')

Meteor.methods
	instanceNumberBuilder: (spaceId, name)->
		return workflowMethods.instanceNumberBuilder.apply(this, arguments)
