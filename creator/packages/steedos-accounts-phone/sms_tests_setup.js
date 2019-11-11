//
// a mechanism to intercept emails sent to addressing including
// the string "intercept", storing them in an array that can then
// be retrieved using the getInterceptedSMS method
//
var interceptedSMS = {}; // (phone) -> (array of options)

var streamBuffers = require('stream-buffers');
var stream = new streamBuffers.WritableStreamBuffer;
SMSTest.overrideOutputStream(stream);

SMSTest.hookSend(function (options) {
//    console.log('in1', options, options.to);
    var to = options.to;
    if (!to) {
        return true; // go ahead and send
    } else {
        if (!interceptedSMS[to])
            interceptedSMS[to] = [];

        interceptedSMS[to].push(options);
        return false; // skip sending
    }
});

Meteor.methods({
    getInterceptedSMS: function (phone) {
        check(phone, String);
        return interceptedSMS[phone];
    },

    addPhoneForTestAndVerify: function (phone) {
        check(phone, String);
        Meteor.users.update(
            {_id: this.userId},
            {$push: {phone: {number: phone, verified: false}}});
        Accounts.sendPhoneVerificationCode(this.userId, phone);
    },

    createUserOnServer: function (phone) {
        check(phone, String);
        var userId = Accounts.createUserWithPhone({phone: phone});
        Accounts.sendPhoneVerificationCode(this.userId, phone);
        return Meteor.users.findOne(userId);
    }
});