var isConfigured = false;
var sendWorker = function (task, interval) {

	if (WeixinTemplateMessageQueue.debug) {
		console.log('WeixinTemplateMessageQueue: Send worker started, using interval: ' + interval);
	}

	return Meteor.setInterval(function () {
		try {
			task();
		} catch (error) {
			console.log('WeixinTemplateMessageQueue: Error while sending: ' + error.message);
		}
	}, interval);
};

/*
	options: {
		// Controls the sending interval
		sendInterval: Match.Optional(Number),
		// Controls the sending batch size per interval
		sendBatchSize: Match.Optional(Number),
		// Allow optional keeping notifications in collection
		keepDocs: Match.Optional(Boolean)
	}
*/
WeixinTemplateMessageQueue.Configure = function (options) {
	var self = this;
	options = _.extend({
		sendTimeout: 60000, // Timeout period
	}, options);

	// Block multiple calls
	if (isConfigured) {
		throw new Error('WeixinTemplateMessageQueue.Configure should not be called more than once!');
	}

	isConfigured = true;

	// Add debug info
	if (WeixinTemplateMessageQueue.debug) {
		console.log('WeixinTemplateMessageQueue.Configure', options);
	}

	self.sendDoc = function (doc) {
		if (WeixinTemplateMessageQueue.debug) {
			console.log("sendDoc");
			console.log(doc);
		}

		WXMini.sendTemplateMessage(doc.appid, doc.info);

	}

	// Universal send function
	var _querySend = function (doc) {

		if (self.sendDoc) {
			self.sendDoc(doc);
		}

		return {
			doc: [doc._id]
		};
	};

	self.serverSend = function (doc) {
		doc = doc || {};
		return _querySend(doc);
	};


	// This interval will allow only one doc to be sent at a time, it
	// will check for new docs at every `options.sendInterval`
	// (default interval is 15000 ms)
	//
	// It looks in docs collection to see if theres any pending
	// docs, if so it will try to reserve the pending doc.
	// If successfully reserved the send is started.
	//
	// If doc.query is type string, it's assumed to be a json string
	// version of the query selector. Making it able to carry `$` properties in
	// the mongo collection.
	//
	// Pr. default docs are removed from the collection after send have
	// completed. Setting `options.keepDocs` will update and keep the
	// doc eg. if needed for historical reasons.
	//
	// After the send have completed a "send" event will be emitted with a
	// status object containing doc id and the send result object.
	//
	var isSendingDoc = false;

	if (options.sendInterval !== null) {

		// This will require index since we sort docs by createdAt
		WeixinTemplateMessageQueue.collection._ensureIndex({
			createdAt: 1
		});
		WeixinTemplateMessageQueue.collection._ensureIndex({
			sent: 1
		});
		WeixinTemplateMessageQueue.collection._ensureIndex({
			sending: 1
		});


		var sendDoc = function (doc) {
			// Reserve doc
			var now = +new Date();
			var timeoutAt = now + options.sendTimeout;
			var reserved = WeixinTemplateMessageQueue.collection.update({
				_id: doc._id,
				sent: false, // xxx: need to make sure this is set on create
				sending: {
					$lt: now
				}
			}, {
				$set: {
					sending: timeoutAt,
				}
			});

			// Make sure we only handle docs reserved by this
			// instance
			if (reserved) {

				// Send
				var result = WeixinTemplateMessageQueue.serverSend(doc);

				if (!options.keepDocs) {
					// Pr. Default we will remove docs
					WeixinTemplateMessageQueue.collection.remove({
						_id: doc._id
					});
				} else {

					// Update
					WeixinTemplateMessageQueue.collection.update({
						_id: doc._id
					}, {
						$set: {
							// Mark as sent
							sent: true,
							// Set the sent date
							sentAt: new Date(),
							// Not being sent anymore
							sending: 0
						}
					});

				}

				// // Emit the send
				// self.emit('send', {
				// 	doc: doc._id,
				// 	result: result
				// });

			} // Else could not reserve
		}; // EO sendDoc

		sendWorker(function () {

			if (isSendingDoc) {
				return;
			}
			// Set send fence
			isSendingDoc = true;

			var batchSize = options.sendBatchSize || 1;

			var now = +new Date();

			// Find docs that are not being or already sent
			var pendingDocs = WeixinTemplateMessageQueue.collection.find({
				$and: [
					// Message is not sent
					{
						sent: false
					},
					// And not being sent by other instances
					{
						sending: {
							$lt: now
						}
					},
					// And no error
					{
						errMsg: {
							$exists: false
						}
					}
				]
			}, {
				// Sort by created date
				sort: {
					createdAt: 1
				},
				limit: batchSize
			});

			pendingDocs.forEach(function (doc) {
				try {
					sendDoc(doc);
				} catch (error) {
					console.error(error.stack);
					console.log('WeixinTemplateMessageQueue: Could not send doc id: "' + doc._id + '", Error: ' + error.message);
					WeixinTemplateMessageQueue.collection.update({
						_id: doc._id
					}, {
						$set: {
							// error message
							errMsg: error.message
						}
					});
				}
			}); // EO forEach

			// Remove the send fence
			isSendingDoc = false;
		}, options.sendInterval || 15000); // Default every 15th sec

	} else {
		if (WeixinTemplateMessageQueue.debug) {
			console.log('WeixinTemplateMessageQueue: Send server is disabled');
		}
	}

};