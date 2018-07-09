WeixinTemplateMessageQueue.collection = new Mongo.Collection('_weixin_template_message_queue');

var _validateDocument = function (doc) {

	check(doc, {
		appid: String,
		info: Object,
		sent: Match.Optional(Boolean),
		sending: Match.Optional(Number),
		createdAt: Date,
		createdBy: Match.OneOf(String, null)
	});

};

WeixinTemplateMessageQueue.send = function (appid, options, sending) {
	var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null
	var doc = _.extend({
		createdAt: new Date(),
		createdBy: currentUser
	});

	doc.appid = appid;

	if (Match.test(options, Object)) {
		doc.info = _.pick(options, 'touser', 'template_id', 'page', 'form_id', 'data', 'emphasis_keyword');
	}

	doc.sent = false;

	if (!sending) {
		doc.sending = 0;
	} else {
		doc.sending = sending;
	}

	_validateDocument(doc);

	return WeixinTemplateMessageQueue.collection.insert(doc);
};