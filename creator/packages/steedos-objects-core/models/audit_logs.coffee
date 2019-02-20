db.audit_logs = new Meteor.Collection('audit_logs')

db.audit_logs._simpleSchema = new SimpleSchema

	c_name: 
		type: String,
	c_action:
		type: String,
	object_id:
		type: String,
	object_name:
		type: String,
	value_previous:
		type: Object,
		optional: true,
		blackbox: true
	value:
		type: Object,
		optional: true,
		blackbox: true
	created_by:
		type: String,
	created_by_name:
		type: String,
	created:
		type: Date,


if Meteor.isClient

    db.audit_logs._simpleSchema.i18n("audit_logs")

db.audit_logs.attachSchema(db.audit_logs._simpleSchema)