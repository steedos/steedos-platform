ObjectWebhooksQueue.collection = new Mongo.Collection('object_webhooks_queue');

var _validateDocument = function (webhook) {

	check(webhook, {
		webhook: Object,
		sent: Match.Optional(Boolean),
		sending: Match.Optional(Match.Integer),
		createdAt: Date,
		createdBy: Match.OneOf(String, null)
	});

};

ObjectWebhooksQueue.send = function (options) {
	var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null
	var webhook = _.extend({
		createdAt: new Date(),
		createdBy: currentUser
	});

	if (Match.test(options, Object)) {
		webhook.webhook = _.pick(options, 'data', 'payload_url', 'content_type', 'action', 'actionUserInfo', 'objectName', 'objectDisplayName', 'nameFieldKey', 'redirectUrl');
	}

	webhook.sent = false;
	webhook.sending = 0;

	_validateDocument(webhook);

	return ObjectWebhooksQueue.collection.insert(webhook);
};