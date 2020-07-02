MailQueue.collection = new Mongo.Collection('_mail_queue');

var _validateDocument = function(mail) {

	check(mail, {
		mail: Object,
		sent: Match.Optional(Boolean),
		sending: Match.Optional(Match.Integer),
		createdAt: Date,
		createdBy: Match.OneOf(String, null)
	});

};

MailQueue.send = function(options) {
	var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null
	var mail = _.extend({
		createdAt: new Date(),
		createdBy: currentUser
	});

	if (Match.test(options, Object)) {
		mail.mail = _.pick(options, 'from', 'to', 'cc', 'bcc', 'replyTo', 'subject', 'text', 'html', 'headers', 'attachments', 'mailComposer');
	}

	mail.sent = false;
	mail.sending = 0;

	_validateDocument(mail);

	return MailQueue.collection.insert(mail);
};