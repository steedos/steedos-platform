Accounts-Phone
=========================

Accounts-Phone is a Meteor package that let you authenticate by phone number.
The package use SMS code verification to verify the user account.
The package is based and inspired by Meteor Accounts-Password package.

## Installation

In a Meteor app directory, enter:

```
$ meteor add okland:accounts-phone
```


Via Bower:
```
$ bower install accounts-phone
```

Add to your index.html

```
<script src="bower_components/accounts-base-client-side/dist/accounts-base-client-side.bundle.min.js"></script>
<script src="bower_components/accounts-phone/dist/accounts-phone.bundle.min.js"></script>
```

## Examples

Let's say you want to register new user and verify him using his phone number

Verify phone number - Create user if not exists

```js
var userPhone = '+972545999999';
// Request for sms phone verification -- please note before receiving SMS you should Follow the SMS Integration tutorial below
Accounts.requestPhoneVerification(userPhone, function(){});
//Debug:  Verify the user phone isn't confirmed it.
console.log('Phone verification status is :', Accounts.isPhoneVerified());

// After receiving SMS let user enter his code and verify account by sending it to the server
var verificationCode = 'CodeRecivedBySMS';

Accounts.verifyPhone(userPhone, verificationCode, function(){});
//Debug:  Verify the user phone is confirmed.
console.log('Phone verification status is :', Accounts.isPhoneVerified());
```

## SMS Integration

If you are using twilio :
 you can just put your twilio credentials on server.
```js
SMS.twilio = {FROM: 'XXXXXXXXXXXX', ACCOUNT_SID: 'XXXXXXXXXXXXXXXXXXXXX', AUTH_TOKEN: 'XXXXXXXXXXXXXXXXXXXX'};
```

otherwise you can just override the function
```js
 SMS.send = function (options) {};
```
  Where the parameter options is an object containing :
      * @param options
      * @param options.from {String} - The sending SMS number
      * @param options.to {String} - The receiver SMS number
      * @param options.body {String}  - The content of the SMS

Moreover to control the Sending number and the message content you can override the phone Template

```js
  SMS.phoneTemplates = {
    from: '+9729999999',
    text: function (user, code) {
        return 'Welcome your invitation code is: ' + code;
    }
  };
```

* Note: it can only be done on server


## Simple API
```js

 /**
  * @summary Request a new verification code. create user if not exist
  * @locus Client
  * @param {String} phone -  The phone we send the verification code to.
  * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
  */
 Accounts.requestPhoneVerification = function (phone, callback)  {  };

 /**
  * @summary Marks the user's phone as verified. Optional change passwords, Logs the user in afterwards..
  * @locus Client
  * @param {String} phone - The phone number we want to verify.
  * @param {String} code - The code retrieved in the SMS.
  * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
  */
 Accounts.verifyPhone = function (phone, code, callback) {...};


 /**
  * Returns whether the current user phone is verified
  * @returns {boolean} Whether the user phone is verified
  */
 Accounts.isPhoneVerified = function () {  };

```

## Settings - you can control

 - verificationCodeLength    : The length of the verification code
 - verificationMaxRetries    : The number of SMS verification tries before verification temporary lock
 - verificationRetriesWaitTime : The verification lock time after max retries
 - verificationWaitTime      : The verification lock time if between two retries
 - sendPhoneVerificationCodeOnCreation  : Whether to send phone number verification on user creation
 - forbidClientAccountCreation: Don't let client create user on server
 - phoneVerificationMasterCode: Optional master code if exists let user verify account by entering this code  for example  '1234'
 - adminPhoneNumbers: Optional array of admin phone numbers - don't need to be valid phone numbers for example  ['+972123456789', '+972987654321']


 In order to change those settings just override the property under :

 Accounts._options

 For example to change the verificationMaxRetries to 3 all we need to do is:
```js
Accounts._options.verificationMaxRetries = 3;
```


## More code samples


Creating new user
```js
  // Create a user.

  var options = {phone:'+972545999999'};
  // You can also create user with password
  options.password = 'VeryHardPassword';


  Accounts.createUserWithPhone(options, function (){});
  // Debug: Verify the user phone isn't confirmed it.
  console.log('Phone verification status is :', Accounts.isPhoneVerified());
```

```js
 var userPhone = '+972545999999';
 // Request for sms phone verification -- please note before receiving SMS you should Follow the SMS Integration tutorial below
 Accounts.requestPhoneVerification(userPhone, function(){});
 //Debug:  Verify the user phone isn't confirmed it.
 console.log('Phone verification status is :', Accounts.isPhoneVerified());

 // After receiving SMS let user enter his code and verify account by sending it to the server
 var verificationCode = 'CodeRecivedBySMS';
 var newPassword = null;
 // You can keep your old password by sending null in the password field
 Accounts.verifyPhone(userPhone, verificationCode, function(){});
 //Debug:  Verify the user phone is confirmed.
 console.log('Phone verification status is :', Accounts.isPhoneVerified());
```

Login existing user - Requires creating user with password


```js

 var userPhone = '+972545999999';
 var password = 'VerySecure';
 var callback = function() {};
 Accounts.createUserWithPhone({phone:userPhone, password:password}, function (){});

 Meteor.loginWithPhoneAndPassword({phone:userPhone}, password, callback);
```

## Full API
```js

 /**
  * @summary Log the user in with a password.
  * @locus Client
  * @param {Object | String} user Either a string interpreted as a phone; or an object with a single key: `phone` or `id`.
  * @param {String} password The user's password.
  * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
  */
 Meteor.loginWithPhoneAndPassword = function (selector, password, callback) {  };

 /**
  * @summary Create a new user.
  * @locus Anywhere
  * @param {Object} options
  * @param {String} options.phone The user's full phone number.
  * @param {String} options.password The user's password. This is __not__ sent in plain text over the wire.
  * @param {Object} options.profile The user's profile, typically including the `name` field.
  * @param {Function} [callback] Client only, optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
  */
 Accounts.createUserWithPhone = function (options, callback) { };

 /**
  * @summary Request a new verification code.
  * @locus Client
  * @param {String} phone -  The phone we send the verification code to.
  * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
  */
 Accounts.requestPhoneVerification = function (phone, callback)  {  };

 /**
  * @summary Marks the user's phone as verified. Optional change passwords, Logs the user in afterwards..
  * @locus Client
  * @param {String} phone - The phone number we want to verify.
  * @param {String} code - The code retrieved in the SMS.
  * @param {String} newPassword, Optional, A new password for the user. This is __not__ sent in plain text over the wire.
  * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
  */
 Accounts.verifyPhone = function (phone, code, newPassword, callback) {...};


 /**
  * Returns whether the current user phone is verified
  * @returns {boolean} Whether the user phone is verified
  */
 Accounts.isPhoneVerified = function () {  };


/**
 * @summary Register a callback to be called after a phone verification attempt succeeds.
 * @locus Server
 * @param {Function} func The callback to be called when phone verification is successful.
 *                   Function gets the userId of the new verified user as first argument
 */
Accounts.onPhoneVerification = function (func) { };
```



