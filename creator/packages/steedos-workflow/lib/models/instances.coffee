# db.instances = new Meteor.Collection('instances')

# db.instances._simpleSchema = new SimpleSchema({
# 	related_instances: {
# 		type: [String],
# 		optional: true,
# 		autoform: {
# 			type: "universe-select",
# 			afFieldInput: {
# 				multiple: true,
# 				optionsMethod: "getRelatedInstancesOptions"
# 			}
# 		}
# 	}
# })

# #db.instances.attachSchema db.instances._simpleSchema

# #db.instances.helpers
# #	applicant_name: ->
# #		applicant = db.space_users.findOne({user: this.applicant});
# #		if applicant
# #			return applicant.name;
# #		else
# #			return ""

# if Meteor.isServer
# 	db.instances.allow

# 		insert: (userId, event) ->
# 			return false

# 		update: (userId, event) ->
# 			if event.state == "draft" && (event.applicant == userId || event.submitter == userId)
# 				return true
# 			else
# 				return false

# 		remove: (userId, event) ->
# 			return false

# 	Meteor.methods
# 		getRelatedInstancesOptions: (options)->
# 			uid = this.userId;
# 			searchText = options.searchText;
# 			values = options.values;
# 			instanceId = options.params

# 			selectedOPtions = []

# #			Meteor.wrapAsync((callback) ->
# #				Meteor.setTimeout (->
# #					callback()
# #					return
# #				), 1000
# #				return
# #			)()

# 			options = new Array();

# 			instances = new Array();

# 			if instanceId
# 				instance = db.instances.findOne(instanceId, { fields: { related_instances: 1 } })
# 				if instance
# 					selectedOPtions = instance.related_instances

# 			if searchText
# 				pinyin = /^[a-zA-Z\']*$/.test(searchText)
# 				if (pinyin && searchText.length > 8) || (!pinyin && searchText.length > 1)
# #					console.log "searchText is #{searchText}"
# 					query = {state: {$in: ["pending", "completed"]}, name: {$regex: searchText},$or: [{submitter: uid}, {applicant: uid}, {inbox_users: uid}, {outbox_users: uid}, {cc_users: uid}]}

# 					if selectedOPtions && _.isArray(selectedOPtions)
# 						query._id = {$nin: selectedOPtions}

# 					instances = db.instances.find(query, {limit: 10, fields: {name: 1, flow: 1, applicant_name: 1}}).fetch()

# 			else if values.length
# 				instances = db.instances.find({_id: {$in: values}}, {fields: {name: 1, flow: 1, applicant_name: 1}}).fetch();


# 			instances.forEach (instance)->
# 				flow = db.flows.findOne({_id: instance.flow}, {fields: {name: 1}});
# 				options.push({label: "[" + flow?.name + "]" + instance.name + ", "+ instance.applicant_name, value: instance._id});

# 			return options;

# 	# 全文检索同步字段置位unset
# 	db.instances.before.update (userId, doc, fieldNames, modifier, options) ->
# 		modifier.$unset = modifier.$unset || {};
# 		modifier.$unset.is_recorded = 1;

# 	if Meteor.settings.cron?.instancerecordqueue_interval
# 		db.instances.after.update (userId, doc, fieldNames, modifier, options) ->
# 			if doc.state is 'completed'
# 				uuflowManager.triggerRecordInstanceQueue doc._id, doc.record_ids, doc.current_step_name

# if Meteor.isServer
# 	db.instances._ensureIndex({
# 		"space": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"submitter": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"applicant": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"outbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"inbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"space": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"state": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_archived": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"created": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"_id": 1,
# 		"submit_date": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"space": 1,
# 		"flow": 1,
# 		"state": 1,
# 		"submit_date": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"created": 1,
# 		"modified": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"final_decision": 1,
# 		"submitter": 1,
# 		"applicant": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"space": 1,
# 		"modified": 1,
# 		"outbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"modified": 1,
# 		"final_decision": 1,
# 		"submitter": 1,
# 		"applicant": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"space": 1,
# 		"outbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"space": 1,
# 		"modified": 1,
# 		"submit_date": 1,
# 		"outbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"space": 1,
# 		"submit_date": 1,
# 		"outbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"flow": 1,
# 		"modified": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"flow": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"flow": 1,
# 		"submit_date": 1,
# 		"modified": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"flow": 1,
# 		"submit_date": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"submitter": 1,
# 		"applicant": 1,
# 		"inbox_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"is_deleted": 1,
# 		"state": 1,
# 		"space": 1,
# 		"is_archive": 1,
# 		"submitter": 1,
# 		"applicant": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"modified": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"modified": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"cc_users": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"space": 1,
# 		"state": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"keywords": "hashed",
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"space": 1,
# 		"submit_date": 1,
# 		"is_deleted": 1,
# 		"final_decision": 1,
# 		"state": 1
# 	},{background: true})

# 	db.instances._ensureIndex({
# 		"traces.approves.type": 1,
# 		"traces.approves.handler": 1
# 	},{background: true})

# 	# 全文检索同步字段
# 	db.instances._ensureIndex({
# 		"is_recorded": 1
# 	},{background: true})