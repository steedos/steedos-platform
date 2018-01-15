_eval = Npm.require('eval')
@db = {}
@InstanceManager = {}

# cfs.instances = new Mongo.Collection("cfs.instances.filerecord")
db.instances = new Meteor.Collection('instances')
db.flows = new Meteor.Collection('flows')
db.forms = new Meteor.Collection('forms')

InstanceManager.handlerInstanceByFieldMap = (ins, field_map) ->
	res = ins
	if ins
		if !field_map

			flow = db.flows.findOne({_id: ins.flow});

			if flow?.field_map
				field_map = flow.field_map

		if field_map
			context = _.clone(ins)

			context._ = _

			script = "var instances = #{field_map}; exports.instances = instances";
			try
				res = _eval(script, "handlerInstanceByFieldMap", context, false).instances
			catch e
				console.log e
	return res