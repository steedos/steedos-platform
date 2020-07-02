QcloudSMSQueue.collection = SMSQueue.collection;

var _validateDocument = function(sms) {

	check(sms, {
		sms: Object,
		sent: Match.Optional(Boolean),
		sending: Match.Optional(Match.Integer),
		createdAt: Date,
		createdBy: Match.OneOf(String, null)
	});

};

QcloudSMSQueue.send = function(options) {
	var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null
	var sms = _.extend({
		createdAt: new Date(),
		createdBy: currentUser
	});

	if (Match.test(options, Object)) {
		sms.sms = _.pick(options, 'Format', 'Action', 'ParamString', 'RecNum', 'SignName', 'TemplateCode', 'msg');
	}

	sms.sent = false;
	sms.sending = 0;

	_validateDocument(sms);

	return QcloudSMSQueue.collection.insert(sms);
};