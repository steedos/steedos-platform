// intentionally initialize later so that we can debug tests after
// they fail without trying to recreate a user with the same phone
// address
var phone1;
var code;

Accounts._isolateLoginTokenForTest();

testAsyncMulti("accounts sms - verification flow", [
    function (test, expect) {
        phone1 = '+97254580'+ (Math.abs(Math.floor(Math.random() * 1000 - 1000)) + 1000);
        Accounts.createUserWithPhone({phone: phone1, password: 'foobar'},
            expect(function (error) {
                test.equal(error, undefined);
                test.isFalse(Accounts.isPhoneVerified(), 'User phone should not be verified');
            }));
    },
    function (test, expect) {
        Accounts.requestPhoneVerification(phone1, expect(function (error) {
            test.equal(error, undefined);
            test.isFalse(Accounts.isPhoneVerified(), 'User phone should not be verified');
        }));
    },
    function (test, expect) {
        Accounts.connection.call(
            "getInterceptedSMS", phone1, expect(function (error, result) {
                test.equal(error, undefined);
                test.notEqual(result, undefined);
                test.isFalse(Accounts.isPhoneVerified(), 'User phone should not be verified');

                test.equal(result.length, 2); // the first is the phone verification
                var options = result[1];

                var re = new RegExp("Welcome your invitation code is: (.*)")
                test.notEqual(null, options.body);
                var match = options.body.match(re);
                test.equal(phone1, options.to);
                test.notEqual(null, options.from);
                code = match[1];
            }));
    },
    function (test, expect) {
        Accounts.verifyPhone(phone1, code, "newPassword", expect(function(error) {
            test.isFalse(error);
            test.isTrue(Accounts.isPhoneVerified(), 'User phone should be verified');
        }));
    },
    function (test, expect) {
        Meteor.logout(expect(function (error) {
            test.equal(error, undefined);
            test.equal(Meteor.user(), null);
            test.isFalse(Accounts.isPhoneVerified(), 'User phone should not be verified');
        }));
    },
    function (test, expect) {
        Meteor.loginWithPhoneAndPassword(
            {phone: phone1}, "newPassword",
            expect(function (error) {
                test.isFalse(error);
                test.isTrue(Accounts.isPhoneVerified(), 'User phone should be verified');
            }));
    },
    function (test, expect) {
        Meteor.logout(expect(function (error) {
            test.equal(error, undefined);
            test.equal(Meteor.user(), null);
            test.isFalse(Accounts.isPhoneVerified(), 'User phone should not be verified');
        }));
    }
]);





