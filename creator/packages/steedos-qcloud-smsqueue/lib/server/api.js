var isConfigured = false;
var sendWorker = function(task, interval) {

	if (QcloudSMSQueue.debug) {
		console.log('QcloudSMSQueue: Send worker started, using interval: ' + interval);
	}

	return Meteor.setInterval(function() {
		try {
			task();
		} catch (error) {
			if (QcloudSMSQueue.debug) {
				console.log('QcloudSMSQueue: Error while sending: ' + error.message);
			}
		}
	}, interval);
};

// var SMS = require('aliyun-sms-node'),
// 	smsSender;

var sdkappid, appkey;

var request = require('superagent'),
	sha256 = require('sha256');

function getRand(bit) {

	bit = bit || 10000000;

	return Math.round(Math.random() * bit);
};

//send text message
function sendTextMsg(sdkappid, appkey, phone, msg) {

	if (!phone || /1\d{12}/.test(phone)) {
		return console.log('invalid phone number');
	}

	var url = 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid={sdkappid}&random={random}';

	var rand = getRand(),
		time = Math.round(+new Date() / 1000),
		sig = sha256('appkey=' + appkey + '&random=' + rand + '&time=' + time + '&mobile=' + phone);

	var content = {
		"tel": { //如需使用国际电话号码通用格式，如："+8613788888888" ，请使用sendisms接口见下注
			"nationcode": "86", //国家码
			"mobile": phone //手机号码
		},
		"type": 0, //0:普通短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
		"msg": msg, //utf8编码 
		"sig": sig, //app凭证，具体计算方式见下注
		"time": time, //unix时间戳，请求发起时间，如果和系统时间相差超过10分钟则会返回失败
		"extend": "", //通道扩展码，可选字段，默认没有开通(需要填空)。
		//在短信回复场景中，腾讯server会原样返回，开发者可依此区分是哪种类型的回复
		"ext": "" //用户的session内容，腾讯server回包中会原样返回，可选字段，不需要就填空。
	};
	url = url.replace('{sdkappid}', sdkappid)
		.replace('{random}', rand);
	request
		.post(url)
		.send(content)
		.end(function(err, res) {
			if (err) {
				return console.error(err);
			}
		});
};

/*
	options: {
		// Controls the sending interval
		sendInterval: Match.Optional(Number),
		// Controls the sending batch size per interval
		sendBatchSize: Match.Optional(Number),
		// Allow optional keeping notifications in collection
		keepSMS: Match.Optional(Boolean)
	}
*/
QcloudSMSQueue.Configure = function(options) {
	var self = this;
	options = _.extend({
		sendTimeout: 60000, // Timeout period for sms send
	}, options);

	// Block multiple calls
	if (isConfigured) {
		throw new Error('QcloudSMSQueue.Configure should not be called more than once!');
	}

	isConfigured = true;

	// Add debug info
	if (QcloudSMSQueue.debug) {
		console.log('QcloudSMSQueue.Configure', options);
	}

	// smsSender = new SMS({
	// 	AccessKeyId: options.accessKeyId,
	// 	AccessKeySecret: options.accessKeySecret
	// });

	sdkappid = options.sdkappid;
	appkey = options.appkey;
	signname = options.signname || "";

	self.sendSMS = function(sms) {
		if (QcloudSMSQueue.debug) {
			console.log("sendSMS");
			console.log(sms);
		}

		// smsSender.send(sms.sms).catch(err => {
		// 	console.error(err)
		// });

		sendTextMsg(sdkappid, appkey, sms.sms.RecNum, (sms.signname || signname) + sms.sms.msg);
	}

	// Universal send function
	var _querySend = function(options) {

		if (self.sendSMS) {
			self.sendSMS(options);
		}

		return {
			sms: [options._id]
		};
	};

	self.serverSend = function(options) {
		options = options || {};
		return _querySend(options);
	};


	// This interval will allow only one sms to be sent at a time, it
	// will check for new sms at every `options.sendInterval`
	// (default interval is 15000 ms)
	//
	// It looks in sms collection to see if theres any pending
	// sms, if so it will try to reserve the pending sms.
	// If successfully reserved the send is started.
	//
	// If sms.query is type string, it's assumed to be a json string
	// version of the query selector. Making it able to carry `$` properties in
	// the mongo collection.
	//
	// Pr. default sms are removed from the collection after send have
	// completed. Setting `options.keepSMS` will update and keep the
	// sms eg. if needed for historical reasons.
	//
	// After the send have completed a "send" event will be emitted with a
	// status object containing sms id and the send result object.
	//
	var isSending = false;

	if (options.sendInterval !== null) {

		// This will require index since we sort sms by createdAt
		QcloudSMSQueue.collection._ensureIndex({
			createdAt: 1
		});
		QcloudSMSQueue.collection._ensureIndex({
			sent: 1
		});
		QcloudSMSQueue.collection._ensureIndex({
			sending: 1
		});


		var sendSMS = function(sms) {
			// Reserve sms
			var now = +new Date();
			var timeoutAt = now + options.sendTimeout;
			var reserved = QcloudSMSQueue.collection.update({
				_id: sms._id,
				sent: false, // xxx: need to make sure this is set on create
				sending: {
					$lt: now
				}
			}, {
				$set: {
					sending: timeoutAt,
				}
			});

			// Make sure we only handle sms reserved by this
			// instance
			if (reserved) {

				// Send the sms
				var result = QcloudSMSQueue.serverSend(sms);

				if (!options.keepSMS) {
					// Pr. Default we will remove sms
					QcloudSMSQueue.collection.remove({
						_id: sms._id
					});
				} else {

					// Update the sms
					QcloudSMSQueue.collection.update({
						_id: sms._id
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

				// Emit the send
				self.emit('send', {
					sms: sms._id,
					result: result
				});

			} // Else could not reserve
		}; // EO sendSMS

		sendWorker(function() {

			if (isSending) {
				return;
			}
			// Set send fence
			isSending = true;

			var batchSize = options.sendBatchSize || 1;

			var now = +new Date();

			// Find sms that are not being or already sent
			var pendingSMS = QcloudSMSQueue.collection.find({
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
					}
				]
			}, {
				// Sort by created date
				sort: {
					createdAt: 1
				},
				limit: batchSize
			});

			pendingSMS.forEach(function(sms) {
				try {
					sendSMS(sms);
				} catch (error) {

					if (QcloudSMSQueue.debug) {
						console.log('QcloudSMSQueue: Could not send sms id: "' + sms._id + '", Error: ' + error.message);
					}
				}
			}); // EO forEach

			// Remove the send fence
			isSending = false;
		}, options.sendInterval || 15000); // Default every 15th sec

	} else {
		if (QcloudSMSQueue.debug) {
			console.log('QcloudSMSQueue: Send server is disabled');
		}
	}

};