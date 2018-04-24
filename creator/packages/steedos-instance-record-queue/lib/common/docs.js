InstanceRecordQueue.collection = new Mongo.Collection('instance_record_queue');

var _validateDocument = function(doc) {

	check(doc, {
		info: Object,
		sent: Match.Optional(Boolean),
		sending: Match.Optional(Match.Integer),
		createdAt: Date,
		createdBy: Match.OneOf(String, null)
	});

};

InstanceRecordQueue.send = function(options) {
	var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null
	var doc = _.extend({
		createdAt: new Date(),
		createdBy: currentUser
	});

	if (Match.test(options, Object)) {
		doc.info = _.pick(options, 'instance_id', 'records', 'sync_date', 'instance_finish_date', 'step_name');
	}

	doc.sent = false;
	doc.sending = 0;

	_validateDocument(doc);

	return InstanceRecordQueue.collection.insert(doc);
};