(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var Hook = Package['callback-hook'].Hook;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var SMS, SMSTest;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:accounts-phone":{"checkNpm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_accounts-phone/checkNpm.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

// fix warning: xxx not installed
require("stream-buffers/package.json");

checkNpmVersions({
  "phone": ">=1.0.12",
  "twilio": ">=1.10.0",
  "stream-buffers": ">=0.2.5"
}, 'steedos:accounts-phone');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms_server.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_accounts-phone/sms_server.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Future = require('fibers/future');

var Twilio = require('twilio');

SMS = {};
SMSTest = {};
var next_devmode_sms_id = 0;
var output_stream = process.stdout; // Testing hooks

SMSTest.overrideOutputStream = function (stream) {
  next_devmode_sms_id = 0;
  output_stream = stream;
};

SMSTest.restoreOutputStream = function () {
  output_stream = process.stdout;
};

var devModeSend = function (options) {
  var devmode_sms_id = next_devmode_sms_id++;
  var stream = output_stream; // This approach does not prevent other writers to stdout from interleaving.

  stream.write("====== BEGIN SMS #" + devmode_sms_id + " ======\n");
  stream.write("(SMS not sent; to enable sending, set the TWILIO_CREDENTIALS " + "environment variable.)\n");
  var future = new Future();
  stream.write("From:" + options.from + "\n");
  stream.write("To:" + options.to + "\n");
  stream.write("Text:" + options.body + "\n");
  stream.write("====== END SMS #" + devmode_sms_id + " ======\n");
  future['return']();
};
/**
 * Mock out sms sending (eg, during a test.) This is private for now.
 *
 * f receives the arguments to SMS.send and should return true to go
 * ahead and send the email (or at least, try subsequent hooks), or
 * false to skip sending.
 */


var sendHooks = [];

SMSTest.hookSend = function (f) {
  sendHooks.push(f);
};
/**
 * Send an sms.
 *
 * Connects to twilio via the CONFIG_VARS environment
 * variable. If unset, prints formatted message to stdout. The "from" option
 * is required, and at least one of "to", "from", and "body" must be provided;
 * all other options are optional.
 *
 * @param options
 * @param options.from {String} - The sending SMS number
 * @param options.to {String} - The receiver SMS number
 * @param options.body {String}  - The content of the SMS
 */


SMS.send = function (options) {
  for (var i = 0; i < sendHooks.length; i++) if (!sendHooks[i](options)) return;

  var twilio = Meteor.settings && Meteor.settings.sms && Meteor.settings.sms.twilio;

  if (twilio) {
    var client = Twilio(twilio.ACCOUNT_SID, twilio.AUTH_TOKEN); // Include FROM in options if it is defined. 

    twilio.FROM && (options.from = twilio.FROM); // Send SMS  API async func

    var sendSMSSync = Meteor.wrapAsync(client.sendMessage, client); // call the sync version of our API func with the parameters from the method call

    var result = sendSMSSync(options, function (err, responseData) {
      //this function is executed when a response is received from Twilio
      if (err) {
        // "err" is an error received during the request, if any
        throw new Meteor.Error("Error sending SMS ", err.message);
      }

      return responseData;
    });
    return result;
  } else {
    devModeSend(options);
  }
};

SMS.phoneTemplates = {
  from: '+972545999999',
  text: function (user, code) {
    return '【Steedos】 ' + code + ' is your Steedos verification code.';
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"phone_server.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_accounts-phone/phone_server.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/// Default Accounts Config vars
var AccountGlobalConfigs = {
  verificationRetriesWaitTime: 10 * 60 * 1000,
  verificationWaitTime: 30 * 1000,
  verificationCodeLength: 4,
  verificationMaxRetries: 2,
  forbidClientAccountCreation: false,
  sendPhoneVerificationCodeOnCreation: true
};

_.defaults(Accounts._options, AccountGlobalConfigs); /// Phone


var Phone = require('phone'); /// BCRYPT


var bcrypt = NpmModuleBcrypt;
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare); // User records have a 'services.phone.bcrypt' field on them to hold
// their hashed passwords (unless they have a 'services.phone.srp'
// field, in which case they will be upgraded to bcrypt the next time
// they log in).
//
// When the client sends a password to the server, it can either be a
// string (the plaintext password) or an object with keys 'digest' and
// 'algorithm' (must be "sha-256" for now). The Meteor client always sends
// password objects { digest: *, algorithm: "sha-256" }, but DDP clients
// that don't have access to SHA can just send plaintext passwords as
// strings.
//
// When the server receives a plaintext password as a string, it always
// hashes it with SHA256 before passing it into bcrypt. When the server
// receives a password as an object, it asserts that the algorithm is
// "sha-256" and then passes the digest to bcrypt.
// Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//

var getPasswordString = function (password) {
  if (typeof password === "string") {
    password = SHA256(password);
  } else {
    // 'password' is an object
    if (password.algorithm !== "sha-256") {
      throw new Meteor.Error(403, "Invalid password hash algorithm. " + "Only 'sha-256' is allowed.");
    }

    password = password.digest;
  }

  return password;
}; // Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//


var hashPassword = function (password) {
  password = getPasswordString(password);
  return bcryptHash(password, Accounts._bcryptRounds);
}; // Check whether the provided password matches the bcrypt'ed password in
// the database user record. `password` can be a string (in which case
// it will be run through SHA256 before bcrypt) or an object with
// properties `digest` and `algorithm` (in which case we bcrypt
// `password.digest`).
//


Accounts._checkPhonePassword = function (user, password) {
  var result = {
    userId: user._id
  };
  password = getPasswordString(password);

  if (!bcryptCompare(password, user.services.phone.bcrypt)) {
    result.error = new Meteor.Error(403, "Incorrect password");
  }

  return result;
};

var checkPassword = Accounts._checkPhonePassword; ///
/// LOGIN
///
// Users can specify various keys to identify themselves with.
// @param user {Object} with `id` or `phone`.
// @returns A selector to pass to mongo to get the user record.

var selectorFromUserQuery = function (user) {
  if (user.id) return {
    _id: user.id
  };else if (user.phone) return {
    'phone.number': user.phone
  };
  throw new Meteor.Error(403, "shouldn't happen (validation missed something)");
};

var findUserFromUserQuery = function (user) {
  var selector = selectorFromUserQuery(user);
  var user = Meteor.users.findOne(selector);
  if (!user) throw new Meteor.Error(403, "User not found");
  return user;
}; // XXX maybe this belongs in the check package


var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});
var userQueryValidator = Match.Where(function (user) {
  check(user, {
    id: Match.Optional(NonEmptyString),
    phone: Match.Optional(NonEmptyString)
  });
  if (_.keys(user).length !== 1) throw new Match.Error("User property must have exactly one field");
  return true;
});
var passwordValidator = Match.OneOf(String, {
  digest: String,
  algorithm: String
}); // Handler to login with a phone.
//
// The Meteor client sets options.password to an object with keys
// 'digest' (set to SHA256(password)) and 'algorithm' ("sha-256").
//
// For other DDP clients which don't have access to SHA, the handler
// also accepts the plaintext password in options.password as a string.
//
// (It might be nice if servers could turn the plaintext password
// option off. Or maybe it should be opt-in, not opt-out?
// Accounts.config option?)
//
// Note that neither password option is secure without SSL.
//

Accounts.registerLoginHandler("phone", function (options) {
  if (!options.password || options.srp) return undefined; // don't handle

  check(options, {
    user: userQueryValidator,
    password: passwordValidator
  });
  var user = findUserFromUserQuery(options.user);
  if (!user.services || !user.services.phone || !(user.services.phone.bcrypt || user.services.phone.srp)) throw new Meteor.Error(403, "User has no password set");

  if (!user.services.phone.bcrypt) {
    if (typeof options.password === "string") {
      // The client has presented a plaintext password, and the user is
      // not upgraded to bcrypt yet. We don't attempt to tell the client
      // to upgrade to bcrypt, because it might be a standalone DDP
      // client doesn't know how to do such a thing.
      var verifier = user.services.phone.srp;
      var newVerifier = SRP.generateVerifier(options.password, {
        identity: verifier.identity,
        salt: verifier.salt
      });

      if (verifier.verifier !== newVerifier.verifier) {
        return {
          userId: user._id,
          error: new Meteor.Error(403, "Incorrect password")
        };
      }

      return {
        userId: user._id
      };
    } else {
      // Tell the client to use the SRP upgrade process.
      throw new Meteor.Error(400, "old password format", EJSON.stringify({
        format: 'srp',
        identity: user.services.phone.srp.identity
      }));
    }
  }

  return checkPassword(user, options.password);
}); // Handler to login using the SRP upgrade path. To use this login
// handler, the client must provide:
//   - srp: H(identity + ":" + password)
//   - password: a string or an object with properties 'digest' and 'algorithm'
//
// We use `options.srp` to verify that the client knows the correct
// password without doing a full SRP flow. Once we've checked that, we
// upgrade the user to bcrypt and remove the SRP information from the
// user document.
//
// The client ends up using this login handler after trying the normal
// login handler (above), which throws an error telling the client to
// try the SRP upgrade path.
//
// XXX COMPAT WITH 0.8.1.3

Accounts.registerLoginHandler("phone", function (options) {
  if (!options.srp || !options.password) return undefined; // don't handle

  check(options, {
    user: userQueryValidator,
    srp: String,
    password: passwordValidator
  });
  var user = findUserFromUserQuery(options.user); // Check to see if another simultaneous login has already upgraded
  // the user record to bcrypt.

  if (user.services && user.services.phone && user.services.phone.bcrypt) return checkPassword(user, options.password);
  if (!(user.services && user.services.phone && user.services.phone.srp)) throw new Meteor.Error(403, "User has no password set");
  var v1 = user.services.phone.srp.verifier;
  var v2 = SRP.generateVerifier(null, {
    hashedIdentityAndPassword: options.srp,
    salt: user.services.phone.srp.salt
  }).verifier;
  if (v1 !== v2) return {
    userId: user._id,
    error: new Meteor.Error(403, "Incorrect password")
  }; // Upgrade to bcrypt on successful login.

  var salted = hashPassword(options.password);
  Meteor.users.update(user._id, {
    $unset: {
      'services.phone.srp': 1
    },
    $set: {
      'services.phone.bcrypt': salted
    }
  });
  return {
    userId: user._id
  };
}); // Force change the users phone password.

/**
 * @summary Forcibly change the password for a user.
 * @locus Server
 * @param {String} userId The id of the user to update.
 * @param {String} newPassword A new password for the user.
 */

Accounts.setPhonePassword = function (userId, newPlaintextPassword) {
  var user = Meteor.users.findOne(userId);
  if (!user) throw new Meteor.Error(403, "User not found");
  Meteor.users.update({
    _id: user._id
  }, {
    $unset: {
      'services.phone.srp': 1,
      // XXX COMPAT WITH 0.8.1.3
      'services.phone.verify': 1,
      'services.resume.loginTokens': 1
    },
    $set: {
      'services.phone.bcrypt': hashPassword(newPlaintextPassword)
    }
  });
}; ///
/// Send phone VERIFICATION code
///
// send the user a sms with a code that can be used to verify number

/**
 * @summary Send an SMS with a code the user can use verify their phone number with.
 * @locus Server
 * @param {String} userId The id of the user to send email to.
 * @param {String} [phone] Optional. Which phone of the user's to send the SMS to. This phone must be in the user's `phones` list. Defaults to the first unverified phone in the list.
 */


Accounts.sendPhoneVerificationCode = function (userId, phone) {
  // XXX Also generate a link using which someone can delete this
  // account if they own said number but weren't those who created
  // this account.
  // Make sure the user exists, and phone is one of their phones.
  var user = Meteor.users.findOne(userId);
  if (!user) throw new Meteor.Error(403, "Can't find user"); // pick the first unverified phone if we weren't passed an phone.

  if (!phone && user.phone) {
    phone = user.phone && user.phone.number;
  } // make sure we have a valid phone


  if (!phone) throw new Meteor.Error(403, "No such phone for user.");
  var locale = Steedos.locale(userId, true); // If sent more than max retry wait

  var waitTimeBetweenRetries = Accounts._options.verificationWaitTime;
  var maxRetryCounts = Accounts._options.verificationMaxRetries;
  var verifyObject = {
    numOfRetries: 0
  };

  if (user.services && user.services.phone && user.services.phone.verify) {
    verifyObject = user.services.phone.verify;
  }

  var curTime = new Date(); // Check if last retry was too soon

  var nextRetryDate = verifyObject && verifyObject.lastRetry && new Date(verifyObject.lastRetry.getTime() + waitTimeBetweenRetries);

  if (nextRetryDate && nextRetryDate > curTime) {
    var waitTimeInSec = Math.ceil(Math.abs((nextRetryDate - curTime) / 1000)),
        errMsg = TAPi18n.__('accounts_phone_too_often_retries', {
      s: waitTimeInSec
    }, locale);

    throw new Meteor.Error(403, errMsg);
  } // Check if there where too many retries
  // if (verifyObject.numOfRetries > maxRetryCounts) {
  //     // Check if passed enough time since last retry
  //     var waitTimeBetweenMaxRetries = Accounts._options.verificationRetriesWaitTime;
  //     nextRetryDate = new Date(verifyObject.lastRetry.getTime() + waitTimeBetweenMaxRetries);
  //     if (nextRetryDate > curTime) {
  //         var waitTimeInMin = Math.ceil(Math.abs((nextRetryDate - curTime) / 60000)),
  //             errMsg = TAPi18n.__('accounts_phone_too_many_retries',{m:waitTimeInMin},locale);
  //         throw new Meteor.Error(403, errMsg);
  //     }
  // }


  verifyObject.code = getRandomCode(Accounts._options.verificationCodeLength);
  verifyObject.phone = phone;
  verifyObject.lastRetry = curTime;
  verifyObject.numOfRetries++;
  Meteor.users.update({
    _id: userId
  }, {
    $set: {
      'services.phone.verify': verifyObject
    }
  }); // before passing to template, update user object with new token

  Meteor._ensure(user, 'services', 'phone');

  user.services.phone.verify = verifyObject;
  var options = {
    to: phone,
    from: SMS.phoneTemplates.from,
    body: SMS.phoneTemplates.text(user, verifyObject.code)
  };

  try {
    if (Meteor.settings && Meteor.settings.sms && Meteor.settings.sms.twilio) {
      SMS.send(options);
    } else {
      var params = {
        code: verifyObject.code
      }; // 发送手机短信

      SMSQueue.send({
        Format: 'JSON',
        Action: 'SingleSendSms',
        ParamString: JSON.stringify(params),
        RecNum: phone.substring(3),
        SignName: 'OA系统',
        TemplateCode: 'SMS_63370455',
        msg: TAPi18n.__('sms.mobile_verification_code.template', params, locale)
      });
    }
  } catch (e) {
    console.error('SMS Failed, Something bad happened!', e);

    var errMsg = TAPi18n.__('accounts_phone_sms_failed', {}, locale);

    throw new Meteor.Error(403, errMsg);
  }
}; // Send SMS with code to user.


Meteor.methods({
  requestPhoneVerification: function (phone, locale, checkVerified) {
    if (phone) {
      check(phone, String); // Change phone format to international SMS format

      phone = normalizePhone(phone);
    }

    if (!phone) {
      throw new Meteor.Error(403, "accounts_phone_invalid");
    }

    var userId = this.userId;

    if (!userId) {
      // Get user by phone number
      var userOptions = {
        'phone.number': phone
      };

      if (checkVerified) {
        userOptions['phone.verified'] = true;
      }

      var existingUser = Meteor.users.findOne(userOptions, {
        fields: {
          '_id': 1
        }
      });

      if (existingUser) {
        userId = existingUser && existingUser._id;
      } else {
        // Create new user with phone number
        // userId = createUser({phone:phone});
        // 暂时不允许通过手机创建新账户，因为可能会跟没有配置手机号的老账户冲突
        var errMsg = TAPi18n.__('accounts_phone_user_not_found', {}, locale);

        throw new Meteor.Error(403, errMsg);
      }
    } else {
      // 已登录用户，有可能需要手机号已验证才发验证码，比如通过手机号找回密码
      if (checkVerified) {
        var validUser = Meteor.users.findOne({
          _id: userId,
          'phone.number': phone,
          'phone.verified': true
        });

        if (!validUser) {
          var errMsg = TAPi18n.__('accounts_phone_verify_fail', {}, locale);

          throw new Meteor.Error(403, errMsg);
        }
      }
    }

    Accounts.sendPhoneVerificationCode(userId, phone);
  }
}); // Take code from sendVerificationPhone SMS, mark the phone as verified,
// Change password if needed
// and log them in.

Meteor.methods({
  verifyPhone: function (phone, mobile, code, newPassword) {
    var self = this; // Check if needs to change password

    var userId = this.userId;
    return Accounts._loginMethod(self, "verifyPhone", arguments, "phone", function () {
      check(code, String);
      check(mobile, String);
      check(phone, String);

      if (!code) {
        throw new Meteor.Error(403, "Code is must be provided to method");
      } // Change phone format to international SMS format


      phone = normalizePhone(phone);

      if (!phone) {
        throw new Meteor.Error(403, "accounts_phone_invalid");
        return false;
      }

      var user; // 因绑定修改手机号要求先验证通过才更新手机号，所以这里不可以通过手机号找用户，只能找当前登录用户
      // 这样的话，对于已登录用户来说，就只能验证自己的手机号了

      if (userId) {
        user = Meteor.users.findOne({
          "_id": userId
        });
      } else {
        user = Meteor.users.findOne({
          "phone.number": phone
        });
      }

      if (!user) throw new Meteor.Error(403, "accounts_phone_invalid"); // Verify code is accepted or master code

      if (!user.services.phone || !user.services.phone.verify || !user.services.phone.verify.code || user.services.phone.verify.code != code && !isMasterCode(code)) {
        throw new Meteor.Error(403, "accounts_phone_code_invalid");
      }

      var setOptions = {
        'phone.verified': true,
        'phone.modified': new Date()
      },
          unSetOptions = {
        'services.phone.verify': 1
      };

      if (userId) {
        // 当用户验证绑定自己的手机号时，把手机号一起改掉，就不用再单独调用修改手机号的接口了
        setOptions['phone.number'] = phone;
        setOptions['phone.mobile'] = mobile;
      }

      var resetToOldToken; // If needs to update password

      if (newPassword) {
        check(newPassword, passwordValidator);
        var hashed = hashPassword(newPassword); // NOTE: We're about to invalidate tokens on the user, who we might be
        // logged in as. Make sure to avoid logging ourselves out if this
        // happens. But also make sure not to leave the connection in a state
        // of having a bad token set if things fail.

        var oldToken = Accounts._getLoginToken(self.connection.id);

        Accounts._setLoginToken(user._id, self.connection, null);

        resetToOldToken = function () {
          Accounts._setLoginToken(user._id, self.connection, oldToken);
        };

        setOptions['services.phone.bcrypt'] = hashed;
        unSetOptions['services.phone.srp'] = 1; // 增加该行代码执行meteor内置的密码设置功能

        Accounts.setPassword(user._id, newPassword);
      }

      try {
        var query = {
          _id: user._id,
          // 'phone.number': phone,//手机号登录不要求验证通过，所以这个条件要去掉
          'services.phone.verify.code': code
        }; // Allow master code from settings

        if (isMasterCode(code)) {
          delete query['services.phone.verify.code'];
        } // 验证通过后，可以也需要把重复的手机号全部清除，以免后面更新手机号时报唯一性索引的错


        Meteor.users.update({
          'phone.number': phone,
          _id: {
            $ne: user._id
          }
        }, {
          $unset: {
            "mobile": 1,
            "phone": 1,
            "services.phone": 1
          }
        }); // Update the user record by:
        // - Changing the password to the new one
        // - Forgetting about the verification code that was just used
        // - Verifying the phone, since they got the code via sms to phone.

        var affectedRecords = Meteor.users.update(query, {
          $set: setOptions,
          $unset: unSetOptions
        });

        if (affectedRecords !== 1) {
          var errMsg = userId ? "accounts_phone_code_update_fail" : "accounts_phone_not_exist";
          return {
            userId: user._id,
            error: new Meteor.Error(403, errMsg)
          };
        }

        successfulVerification(user._id);
      } catch (err) {
        if (resetToOldToken) {
          resetToOldToken();
        }

        throw err;
      } // Replace all valid login tokens with new ones (changing
      // password should invalidate existing sessions).
      // Accounts._clearAllLoginTokens(user._id);


      return {
        userId: user._id
      };
    });
  }
}); ///
/// CREATING USERS
///
// Shared createUser function called from the createUser method, both
// if originates in client or server code. Calls user provided hooks,
// does the actual user insertion.
//
// returns the user id

var createUser = function (options) {
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary
  // options.
  check(options, Match.ObjectIncluding({
    phone: Match.Optional(String),
    password: Match.Optional(passwordValidator)
  }));
  var phone = options.phone;
  if (!phone) throw new Meteor.Error(400, "Need to set phone");
  var existingUser = Meteor.users.findOne({
    'phone.number': phone
  });

  if (existingUser) {
    throw new Meteor.Error(403, "User with this phone number already exists");
  }

  var user = {
    services: {}
  };

  if (options.password) {
    var hashed = hashPassword(options.password);
    user.services.phone = {
      bcrypt: hashed
    };
  }

  user.phone = {
    number: phone,
    verified: false
  };

  try {
    return Accounts.insertUserDoc(options, user);
  } catch (e) {
    // XXX string parsing sucks, maybe
    // https://jira.mongodb.org/browse/SERVER-3069 will get fixed one day
    if (e.name !== 'MongoError') throw e;
    var match = e.err.match(/E11000 duplicate key error index: ([^ ]+)/);
    if (!match) throw e;
    if (match[1].indexOf('users.$phone.number') !== -1) throw new Meteor.Error(403, "Phone number already exists, failed on creation.");
    throw e;
  }
}; // method for create user. Requests come from the client.


Meteor.methods({
  createUserWithPhone: function (options) {
    var self = this;
    check(options, Object);

    if (options.phone) {
      check(options.phone, String); // Change phone format to international SMS format

      options.phone = normalizePhone(options.phone);
    }

    return Accounts._loginMethod(self, "createUserWithPhone", arguments, "phone", function () {
      if (Accounts._options.forbidClientAccountCreation) return {
        error: new Meteor.Error(403, "Signups forbidden")
      }; // Create user. result contains id and token.

      var userId = createUser(options); // safety belt. createUser is supposed to throw on error. send 500 error
      // instead of sending a verification email with empty userid.

      if (!userId) throw new Meteor.Error(403, "createUser failed to insert new user"); // If `Accounts._options.sendPhoneVerificationCodeOnCreation` is set, register
      // a token to verify the user's primary phone, and send it to
      // by sms.

      if (options.phone && Accounts._options.sendPhoneVerificationCodeOnCreation) {
        Accounts.sendPhoneVerificationCode(userId, options.phone);
      } // client gets logged in as the new user afterwards.


      return {
        userId: userId
      };
    });
  }
}); // Create user directly on the server.
//
// Unlike the client version, this does not log you in as this user
// after creation.
//
// returns userId or throws an error if it can't create
//
// XXX add another argument ("server options") that gets sent to onCreateUser,
// which is always empty when called from the createUser method? eg, "admin:
// true", which we want to prevent the client from setting, but which a custom
// method calling Accounts.createUser could set?
//

Accounts.createUserWithPhone = function (options, callback) {
  options = _.clone(options); // XXX allow an optional callback?

  if (callback) {
    throw new Meteor.Error(403, "Accounts.createUser with callback not supported on the server yet.");
  }

  return createUser(options);
}; ///
/// PASSWORD-SPECIFIC INDEXES ON USERS
///


Meteor.users._ensureIndex('phone.number', {
  unique: 1,
  sparse: 1
}); // cn平台发生过验证码重复的问题，所以去掉唯一性索引约束


Meteor.users._ensureIndex('services.phone.verify.code', {
  // unique: 1,
  sparse: 1
});
/*** Control published data *********/


Meteor.startup(function () {
  /** Publish phones to the client **/
  Meteor.publish(null, function () {
    if (this.userId) {
      return Meteor.users.find({
        _id: this.userId
      }, {
        fields: {
          'phone': 1
        }
      });
    } else {
      this.ready();
    }
  });
  /** Disable user profile editing **/

  Meteor.users.deny({
    update: function (userId, doc, fieldNames, modifier, options) {
      if (modifier.$set.phone) {
        return true;
      } else {
        return false;
      }
    }
  });
});
/************* Phone verification hook *************/
// Callback exceptions are printed with Meteor._debug and ignored.

var onPhoneVerificationHook = new Hook({
  debugPrintExceptions: "onPhoneVerification callback"
});
/**
 * @summary Register a callback to be called after a phone verification attempt succeeds.
 * @locus Server
 * @param {Function} func The callback to be called when phone verification is successful.
 */

Accounts.onPhoneVerification = function (func) {
  return onPhoneVerificationHook.register(func);
};

var successfulVerification = function (userId) {
  onPhoneVerificationHook.each(function (callback) {
    callback(userId);
    return true;
  });
}; // Give each login hook callback a fresh cloned copy of the attempt
// object, but don't clone the connection.
//


var cloneAttemptWithConnection = function (connection, attempt) {
  var clonedAttempt = EJSON.clone(attempt);
  clonedAttempt.connection = connection;
  return clonedAttempt;
};
/************* Helper functions ********************/
// Return normalized phone format


var normalizePhone = function (phone) {
  // If phone equals to one of admin phone numbers return it as-is
  if (phone && Accounts._options.adminPhoneNumbers && Accounts._options.adminPhoneNumbers.indexOf(phone) != -1) {
    return phone;
  }

  return Phone(phone)[0];
};
/**
 * Check whether the given code is the defined master code
 * @param code
 * @returns {*|boolean}
 */


var isMasterCode = function (code) {
  return code && Accounts._options.phoneVerificationMasterCode && code == Accounts._options.phoneVerificationMasterCode;
};
/**
 * Get random phone verification code
 * @param length
 * @returns {string}
 */


var getRandomCode = function (length) {
  length = length || 4;
  var output = "";

  while (length-- > 0) {
    output += getRandomDigit();
  }

  return output;
};
/**
 * Return random 1-9 digit
 * @returns {number}
 */


var getRandomDigit = function () {
  return Math.floor(Math.random() * 9 + 1);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:accounts-phone/checkNpm.js");
require("/node_modules/meteor/steedos:accounts-phone/sms_server.js");
require("/node_modules/meteor/steedos:accounts-phone/phone_server.js");

/* Exports */
Package._define("steedos:accounts-phone", {
  SMS: SMS,
  SMSTest: SMSTest
});

})();

//# sourceURL=meteor://💻app/packages/steedos_accounts-phone.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy1waG9uZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy1waG9uZS9zbXNfc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmFjY291bnRzLXBob25lL3Bob25lX3NlcnZlci5qcyJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJyZXF1aXJlIiwiRnV0dXJlIiwiVHdpbGlvIiwiU01TIiwiU01TVGVzdCIsIm5leHRfZGV2bW9kZV9zbXNfaWQiLCJvdXRwdXRfc3RyZWFtIiwicHJvY2VzcyIsInN0ZG91dCIsIm92ZXJyaWRlT3V0cHV0U3RyZWFtIiwic3RyZWFtIiwicmVzdG9yZU91dHB1dFN0cmVhbSIsImRldk1vZGVTZW5kIiwib3B0aW9ucyIsImRldm1vZGVfc21zX2lkIiwid3JpdGUiLCJmdXR1cmUiLCJmcm9tIiwidG8iLCJib2R5Iiwic2VuZEhvb2tzIiwiaG9va1NlbmQiLCJmIiwicHVzaCIsInNlbmQiLCJpIiwibGVuZ3RoIiwidHdpbGlvIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJzbXMiLCJjbGllbnQiLCJBQ0NPVU5UX1NJRCIsIkFVVEhfVE9LRU4iLCJGUk9NIiwic2VuZFNNU1N5bmMiLCJ3cmFwQXN5bmMiLCJzZW5kTWVzc2FnZSIsInJlc3VsdCIsImVyciIsInJlc3BvbnNlRGF0YSIsIkVycm9yIiwibWVzc2FnZSIsInBob25lVGVtcGxhdGVzIiwidGV4dCIsInVzZXIiLCJjb2RlIiwiQWNjb3VudEdsb2JhbENvbmZpZ3MiLCJ2ZXJpZmljYXRpb25SZXRyaWVzV2FpdFRpbWUiLCJ2ZXJpZmljYXRpb25XYWl0VGltZSIsInZlcmlmaWNhdGlvbkNvZGVMZW5ndGgiLCJ2ZXJpZmljYXRpb25NYXhSZXRyaWVzIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwic2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZU9uQ3JlYXRpb24iLCJfIiwiZGVmYXVsdHMiLCJBY2NvdW50cyIsIl9vcHRpb25zIiwiUGhvbmUiLCJiY3J5cHQiLCJOcG1Nb2R1bGVCY3J5cHQiLCJiY3J5cHRIYXNoIiwiaGFzaCIsImJjcnlwdENvbXBhcmUiLCJjb21wYXJlIiwiZ2V0UGFzc3dvcmRTdHJpbmciLCJwYXNzd29yZCIsIlNIQTI1NiIsImFsZ29yaXRobSIsImRpZ2VzdCIsImhhc2hQYXNzd29yZCIsIl9iY3J5cHRSb3VuZHMiLCJfY2hlY2tQaG9uZVBhc3N3b3JkIiwidXNlcklkIiwiX2lkIiwic2VydmljZXMiLCJwaG9uZSIsImVycm9yIiwiY2hlY2tQYXNzd29yZCIsInNlbGVjdG9yRnJvbVVzZXJRdWVyeSIsImlkIiwiZmluZFVzZXJGcm9tVXNlclF1ZXJ5Iiwic2VsZWN0b3IiLCJ1c2VycyIsImZpbmRPbmUiLCJOb25FbXB0eVN0cmluZyIsIk1hdGNoIiwiV2hlcmUiLCJ4IiwiY2hlY2siLCJTdHJpbmciLCJ1c2VyUXVlcnlWYWxpZGF0b3IiLCJPcHRpb25hbCIsImtleXMiLCJwYXNzd29yZFZhbGlkYXRvciIsIk9uZU9mIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJzcnAiLCJ1bmRlZmluZWQiLCJ2ZXJpZmllciIsIm5ld1ZlcmlmaWVyIiwiU1JQIiwiZ2VuZXJhdGVWZXJpZmllciIsImlkZW50aXR5Iiwic2FsdCIsIkVKU09OIiwic3RyaW5naWZ5IiwiZm9ybWF0IiwidjEiLCJ2MiIsImhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQiLCJzYWx0ZWQiLCJ1cGRhdGUiLCIkdW5zZXQiLCIkc2V0Iiwic2V0UGhvbmVQYXNzd29yZCIsIm5ld1BsYWludGV4dFBhc3N3b3JkIiwic2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZSIsIm51bWJlciIsImxvY2FsZSIsIlN0ZWVkb3MiLCJ3YWl0VGltZUJldHdlZW5SZXRyaWVzIiwibWF4UmV0cnlDb3VudHMiLCJ2ZXJpZnlPYmplY3QiLCJudW1PZlJldHJpZXMiLCJ2ZXJpZnkiLCJjdXJUaW1lIiwiRGF0ZSIsIm5leHRSZXRyeURhdGUiLCJsYXN0UmV0cnkiLCJnZXRUaW1lIiwid2FpdFRpbWVJblNlYyIsIk1hdGgiLCJjZWlsIiwiYWJzIiwiZXJyTXNnIiwiVEFQaTE4biIsIl9fIiwicyIsImdldFJhbmRvbUNvZGUiLCJfZW5zdXJlIiwicGFyYW1zIiwiU01TUXVldWUiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIkpTT04iLCJSZWNOdW0iLCJzdWJzdHJpbmciLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsIm1zZyIsImUiLCJjb25zb2xlIiwibWV0aG9kcyIsInJlcXVlc3RQaG9uZVZlcmlmaWNhdGlvbiIsImNoZWNrVmVyaWZpZWQiLCJub3JtYWxpemVQaG9uZSIsInVzZXJPcHRpb25zIiwiZXhpc3RpbmdVc2VyIiwiZmllbGRzIiwidmFsaWRVc2VyIiwidmVyaWZ5UGhvbmUiLCJtb2JpbGUiLCJuZXdQYXNzd29yZCIsInNlbGYiLCJfbG9naW5NZXRob2QiLCJhcmd1bWVudHMiLCJpc01hc3RlckNvZGUiLCJzZXRPcHRpb25zIiwidW5TZXRPcHRpb25zIiwicmVzZXRUb09sZFRva2VuIiwiaGFzaGVkIiwib2xkVG9rZW4iLCJfZ2V0TG9naW5Ub2tlbiIsImNvbm5lY3Rpb24iLCJfc2V0TG9naW5Ub2tlbiIsInNldFBhc3N3b3JkIiwicXVlcnkiLCIkbmUiLCJhZmZlY3RlZFJlY29yZHMiLCJzdWNjZXNzZnVsVmVyaWZpY2F0aW9uIiwiY3JlYXRlVXNlciIsIk9iamVjdEluY2x1ZGluZyIsInZlcmlmaWVkIiwiaW5zZXJ0VXNlckRvYyIsIm5hbWUiLCJtYXRjaCIsImluZGV4T2YiLCJjcmVhdGVVc2VyV2l0aFBob25lIiwiT2JqZWN0IiwiY2FsbGJhY2siLCJjbG9uZSIsIl9lbnN1cmVJbmRleCIsInVuaXF1ZSIsInNwYXJzZSIsInN0YXJ0dXAiLCJwdWJsaXNoIiwiZmluZCIsInJlYWR5IiwiZGVueSIsImRvYyIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsIm9uUGhvbmVWZXJpZmljYXRpb25Ib29rIiwiSG9vayIsImRlYnVnUHJpbnRFeGNlcHRpb25zIiwib25QaG9uZVZlcmlmaWNhdGlvbiIsImZ1bmMiLCJyZWdpc3RlciIsImVhY2giLCJjbG9uZUF0dGVtcHRXaXRoQ29ubmVjdGlvbiIsImF0dGVtcHQiLCJjbG9uZWRBdHRlbXB0IiwiYWRtaW5QaG9uZU51bWJlcnMiLCJwaG9uZVZlcmlmaWNhdGlvbk1hc3RlckNvZGUiLCJvdXRwdXQiLCJnZXRSYW5kb21EaWdpdCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMsNkJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsV0FBUyxVQURPO0FBRWhCLFlBQVUsVUFGTTtBQUdoQixvQkFBa0I7QUFIRixDQUFELEVBSWIsd0JBSmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNKQSxJQUFJSyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxlQUFELENBQXBCOztBQUNBLElBQUlFLE1BQU0sR0FBR0YsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBRUFHLEdBQUcsR0FBRyxFQUFOO0FBQ0FDLE9BQU8sR0FBRyxFQUFWO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUcsQ0FBMUI7QUFDQSxJQUFJQyxhQUFhLEdBQUdDLE9BQU8sQ0FBQ0MsTUFBNUIsQyxDQUVBOztBQUNBSixPQUFPLENBQUNLLG9CQUFSLEdBQStCLFVBQVVDLE1BQVYsRUFBa0I7QUFDN0NMLHFCQUFtQixHQUFHLENBQXRCO0FBQ0FDLGVBQWEs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QUFiLENBQVA7QUFDSCxDQU5EO0FBUUE7Ozs7Ozs7QUFLQSxJQUFJNEYsWUFBWSxHQUFHLFVBQVMxSCxJQUFULEVBQWU7QUFDOUIsU0FBT0EsSUFBSSxJQUFJVSxRQUFRLENBQUNDLFFBQVQsQ0FBa0I4SiwyQkFBMUIsSUFDSHpLLElBQUksSUFBSVUsUUFBUSxDQUFDQyxRQUFULENBQWtCOEosMkJBRDlCO0FBRUgsQ0FIRDtBQUtBOzs7Ozs7O0FBS0EsSUFBSTVFLGFBQWEsR0FBRyxVQUFTakgsTUFBVCxFQUFpQjtBQUNqQ0EsUUFBTSxHQUFHQSxNQUFNLElBQUksQ0FBbkI7QUFDQSxNQUFJOEwsTUFBTSxHQUFHLEVBQWI7O0FBQ0EsU0FBTzlMLE1BQU0sS0FBSyxDQUFsQixFQUFxQjtBQUVqQjhMLFVBQU0sSUFBSUMsY0FBYyxFQUF4QjtBQUNIOztBQUNELFNBQU9ELE1BQVA7QUFDSCxDQVJEO0FBVUE7Ozs7OztBQUlBLElBQUlDLGNBQWMsR0FBRyxZQUFXO0FBQzVCLFNBQU9yRixJQUFJLENBQUNzRixLQUFMLENBQVl0RixJQUFJLENBQUN1RixNQUFMLEtBQWdCLENBQWpCLEdBQXNCLENBQWpDLENBQVA7QUFDSCxDQUZELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMtcGhvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmaXggd2FybmluZzogeHh4IG5vdCBpbnN0YWxsZWRcbnJlcXVpcmUoXCJzdHJlYW0tYnVmZmVycy9wYWNrYWdlLmpzb25cIik7XG5cbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcInBob25lXCI6IFwiPj0xLjAuMTJcIixcblx0XCJ0d2lsaW9cIjogXCI+PTEuMTAuMFwiLFxuXHRcInN0cmVhbS1idWZmZXJzXCI6IFwiPj0wLjIuNVwiXG59LCAnc3RlZWRvczphY2NvdW50cy1waG9uZScpOyIsInZhciBGdXR1cmUgPSByZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG52YXIgVHdpbGlvID0gcmVxdWlyZSgndHdpbGlvJyk7XG5cblNNUyA9IHt9O1xuU01TVGVzdCA9IHt9O1xuXG52YXIgbmV4dF9kZXZtb2RlX3Ntc19pZCA9IDA7XG52YXIgb3V0cHV0X3N0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0O1xuXG4vLyBUZXN0aW5nIGhvb2tzXG5TTVNUZXN0Lm92ZXJyaWRlT3V0cHV0U3RyZWFtID0gZnVuY3Rpb24gKHN0cmVhbSkge1xuICAgIG5leHRfZGV2bW9kZV9zbXNfaWQgPSAwO1xuICAgIG91dHB1dF9zdHJlYW0gPSBzdHJlYW07XG59O1xuXG5TTVNUZXN0LnJlc3RvcmVPdXRwdXRTdHJlYW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgb3V0cHV0X3N0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0O1xufTtcblxudmFyIGRldk1vZGVTZW5kID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZGV2bW9kZV9zbXNfaWQgPSBuZXh0X2Rldm1vZGVfc21zX2lkKys7XG5cbiAgICB2YXIgc3RyZWFtID0gb3V0cHV0X3N0cmVhbTtcblxuICAgIC8vIFRoaXMgYXBwcm9hY2ggZG9lcyBub3QgcHJldmVudCBvdGhlciB3cml0ZXJzIHRvIHN0ZG91dCBmcm9tIGludGVybGVhdmluZy5cbiAgICBzdHJlYW0ud3JpdGUoXCI9PT09PT0gQkVHSU4gU01TICNcIiArIGRldm1vZGVfc21zX2lkICsgXCIgPT09PT09XFxuXCIpO1xuICAgIHN0cmVhbS53cml0ZShcIihTTVMgbm90IHNlbnQ7IHRvIGVuYWJsZSBzZW5kaW5nLCBzZXQgdGhlIFRXSUxJT19DUkVERU5USUFMUyBcIiArXG4gICAgICAgIFwiZW52aXJvbm1lbnQgdmFyaWFibGUuKVxcblwiKTtcbiAgICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgICBzdHJlYW0ud3JpdGUoXCJGcm9tOlwiICsgb3B0aW9ucy5mcm9tICsgXCJcXG5cIik7XG4gICAgc3RyZWFtLndyaXRlKFwiVG86XCIgKyBvcHRpb25zLnRvICsgXCJcXG5cIik7XG4gICAgc3RyZWFtLndyaXRlKFwiVGV4dDpcIiArIG9wdGlvbnMuYm9keSArIFwiXFxuXCIpO1xuICAgIHN0cmVhbS53cml0ZShcIj09PT09PSBFTkQgU01TICNcIiArIGRldm1vZGVfc21zX2lkICsgXCIgPT09PT09XFxuXCIpO1xuICAgIGZ1dHVyZVsncmV0dXJuJ10oKTtcbn07XG5cbi8qKlxuICogTW9jayBvdXQgc21zIHNlbmRpbmcgKGVnLCBkdXJpbmcgYSB0ZXN0LikgVGhpcyBpcyBwcml2YXRlIGZvciBub3cuXG4gKlxuICogZiByZWNlaXZlcyB0aGUgYXJndW1lbnRzIHRvIFNNUy5zZW5kIGFuZCBzaG91bGQgcmV0dXJuIHRydWUgdG8gZ29cbiAqIGFoZWFkIGFuZCBzZW5kIHRoZSBlbWFpbCAob3IgYXQgbGVhc3QsIHRyeSBzdWJzZXF1ZW50IGhvb2tzKSwgb3JcbiAqIGZhbHNlIHRvIHNraXAgc2VuZGluZy5cbiAqL1xudmFyIHNlbmRIb29rcyA9IFtdO1xuU01TVGVzdC5ob29rU2VuZCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgc2VuZEhvb2tzLnB1c2goZik7XG59O1xuXG4vKipcbiAqIFNlbmQgYW4gc21zLlxuICpcbiAqIENvbm5lY3RzIHRvIHR3aWxpbyB2aWEgdGhlIENPTkZJR19WQVJTIGVudmlyb25tZW50XG4gKiB2YXJpYWJsZS4gSWYgdW5zZXQsIHByaW50cyBmb3JtYXR0ZWQgbWVzc2FnZSB0byBzdGRvdXQuIFRoZSBcImZyb21cIiBvcHRpb25cbiAqIGlzIHJlcXVpcmVkLCBhbmQgYXQgbGVhc3Qgb25lIG9mIFwidG9cIiwgXCJmcm9tXCIsIGFuZCBcImJvZHlcIiBtdXN0IGJlIHByb3ZpZGVkO1xuICogYWxsIG90aGVyIG9wdGlvbnMgYXJlIG9wdGlvbmFsLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcGFyYW0gb3B0aW9ucy5mcm9tIHtTdHJpbmd9IC0gVGhlIHNlbmRpbmcgU01TIG51bWJlclxuICogQHBhcmFtIG9wdGlvbnMudG8ge1N0cmluZ30gLSBUaGUgcmVjZWl2ZXIgU01TIG51bWJlclxuICogQHBhcmFtIG9wdGlvbnMuYm9keSB7U3RyaW5nfSAgLSBUaGUgY29udGVudCBvZiB0aGUgU01TXG4gKi9cblNNUy5zZW5kID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbmRIb29rcy5sZW5ndGg7IGkrKylcbiAgICAgICAgaWYgKCFzZW5kSG9va3NbaV0ob3B0aW9ucykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgdmFyIHR3aWxpbyA9IE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3Muc21zICYmIE1ldGVvci5zZXR0aW5ncy5zbXMudHdpbGlvO1xuICAgIGlmICh0d2lsaW8pIHtcbiAgICAgICAgdmFyIGNsaWVudCA9IFR3aWxpbyh0d2lsaW8uQUNDT1VOVF9TSUQsIHR3aWxpby5BVVRIX1RPS0VOKTtcbiAgICAgICAgLy8gSW5jbHVkZSBGUk9NIGluIG9wdGlvbnMgaWYgaXQgaXMgZGVmaW5lZC4gXG4gICAgICAgIHR3aWxpby5GUk9NICYmIChvcHRpb25zLmZyb20gPSB0d2lsaW8uRlJPTSk7XG4gICAgICAgIC8vIFNlbmQgU01TICBBUEkgYXN5bmMgZnVuY1xuICAgICAgICB2YXIgc2VuZFNNU1N5bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGNsaWVudC5zZW5kTWVzc2FnZSwgY2xpZW50KTtcbiAgICAgICAgLy8gY2FsbCB0aGUgc3luYyB2ZXJzaW9uIG9mIG91ciBBUEkgZnVuYyB3aXRoIHRoZSBwYXJhbWV0ZXJzIGZyb20gdGhlIG1ldGhvZCBjYWxsXG4gICAgICAgIHZhciByZXN1bHQgPSBzZW5kU01TU3luYyhvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZURhdGEpIHsgLy90aGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIHdoZW4gYSByZXNwb25zZSBpcyByZWNlaXZlZCBmcm9tIFR3aWxpb1xuICAgICAgICAgICAgaWYgKGVycikgeyAvLyBcImVyclwiIGlzIGFuIGVycm9yIHJlY2VpdmVkIGR1cmluZyB0aGUgcmVxdWVzdCwgaWYgYW55XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIkVycm9yIHNlbmRpbmcgU01TIFwiLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRldk1vZGVTZW5kKG9wdGlvbnMpO1xuICAgIH1cbn07XG5cblNNUy5waG9uZVRlbXBsYXRlcyA9IHtcbiAgICBmcm9tOiAnKzk3MjU0NTk5OTk5OScsXG4gICAgdGV4dDogZnVuY3Rpb24gKHVzZXIsIGNvZGUpIHtcbiAgICAgICAgcmV0dXJuICfjgJBTdGVlZG9z44CRICcgKyBjb2RlICsgJyBpcyB5b3VyIFN0ZWVkb3MgdmVyaWZpY2F0aW9uIGNvZGUuJztcbiAgICB9XG59O1xuXG4iLCIvLy8gRGVmYXVsdCBBY2NvdW50cyBDb25maWcgdmFyc1xuXG52YXIgQWNjb3VudEdsb2JhbENvbmZpZ3MgPSB7XG4gICAgdmVyaWZpY2F0aW9uUmV0cmllc1dhaXRUaW1lOiAxMCAqIDYwICogMTAwMCxcbiAgICB2ZXJpZmljYXRpb25XYWl0VGltZTogMzAgKiAxMDAwLFxuICAgIHZlcmlmaWNhdGlvbkNvZGVMZW5ndGg6IDQsXG4gICAgdmVyaWZpY2F0aW9uTWF4UmV0cmllczogMixcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IGZhbHNlLFxuICAgIHNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGVPbkNyZWF0aW9uOiB0cnVlXG59O1xuXG5fLmRlZmF1bHRzKEFjY291bnRzLl9vcHRpb25zLCBBY2NvdW50R2xvYmFsQ29uZmlncyk7XG5cblxuLy8vIFBob25lXG5cbnZhciBQaG9uZSA9IHJlcXVpcmUoJ3Bob25lJyk7XG5cbi8vLyBCQ1JZUFRcblxudmFyIGJjcnlwdCA9IE5wbU1vZHVsZUJjcnlwdDtcbnZhciBiY3J5cHRIYXNoID0gTWV0ZW9yLndyYXBBc3luYyhiY3J5cHQuaGFzaCk7XG52YXIgYmNyeXB0Q29tcGFyZSA9IE1ldGVvci53cmFwQXN5bmMoYmNyeXB0LmNvbXBhcmUpO1xuXG4vLyBVc2VyIHJlY29yZHMgaGF2ZSBhICdzZXJ2aWNlcy5waG9uZS5iY3J5cHQnIGZpZWxkIG9uIHRoZW0gdG8gaG9sZFxuLy8gdGhlaXIgaGFzaGVkIHBhc3N3b3JkcyAodW5sZXNzIHRoZXkgaGF2ZSBhICdzZXJ2aWNlcy5waG9uZS5zcnAnXG4vLyBmaWVsZCwgaW4gd2hpY2ggY2FzZSB0aGV5IHdpbGwgYmUgdXBncmFkZWQgdG8gYmNyeXB0IHRoZSBuZXh0IHRpbWVcbi8vIHRoZXkgbG9nIGluKS5cbi8vXG4vLyBXaGVuIHRoZSBjbGllbnQgc2VuZHMgYSBwYXNzd29yZCB0byB0aGUgc2VydmVyLCBpdCBjYW4gZWl0aGVyIGJlIGFcbi8vIHN0cmluZyAodGhlIHBsYWludGV4dCBwYXNzd29yZCkgb3IgYW4gb2JqZWN0IHdpdGgga2V5cyAnZGlnZXN0JyBhbmRcbi8vICdhbGdvcml0aG0nIChtdXN0IGJlIFwic2hhLTI1NlwiIGZvciBub3cpLiBUaGUgTWV0ZW9yIGNsaWVudCBhbHdheXMgc2VuZHNcbi8vIHBhc3N3b3JkIG9iamVjdHMgeyBkaWdlc3Q6ICosIGFsZ29yaXRobTogXCJzaGEtMjU2XCIgfSwgYnV0IEREUCBjbGllbnRzXG4vLyB0aGF0IGRvbid0IGhhdmUgYWNjZXNzIHRvIFNIQSBjYW4ganVzdCBzZW5kIHBsYWludGV4dCBwYXNzd29yZHMgYXNcbi8vIHN0cmluZ3MuXG4vL1xuLy8gV2hlbiB0aGUgc2VydmVyIHJlY2VpdmVzIGEgcGxhaW50ZXh0IHBhc3N3b3JkIGFzIGEgc3RyaW5nLCBpdCBhbHdheXNcbi8vIGhhc2hlcyBpdCB3aXRoIFNIQTI1NiBiZWZvcmUgcGFzc2luZyBpdCBpbnRvIGJjcnlwdC4gV2hlbiB0aGUgc2VydmVyXG4vLyByZWNlaXZlcyBhIHBhc3N3b3JkIGFzIGFuIG9iamVjdCwgaXQgYXNzZXJ0cyB0aGF0IHRoZSBhbGdvcml0aG0gaXNcbi8vIFwic2hhLTI1NlwiIGFuZCB0aGVuIHBhc3NlcyB0aGUgZGlnZXN0IHRvIGJjcnlwdC5cblxuLy8gR2l2ZW4gYSAncGFzc3dvcmQnIGZyb20gdGhlIGNsaWVudCwgZXh0cmFjdCB0aGUgc3RyaW5nIHRoYXQgd2Ugc2hvdWxkXG4vLyBiY3J5cHQuICdwYXNzd29yZCcgY2FuIGJlIG9uZSBvZjpcbi8vICAtIFN0cmluZyAodGhlIHBsYWludGV4dCBwYXNzd29yZClcbi8vICAtIE9iamVjdCB3aXRoICdkaWdlc3QnIGFuZCAnYWxnb3JpdGhtJyBrZXlzLiAnYWxnb3JpdGhtJyBtdXN0IGJlIFwic2hhLTI1NlwiLlxuLy9cbnZhciBnZXRQYXNzd29yZFN0cmluZyA9IGZ1bmN0aW9uKHBhc3N3b3JkKSB7XG4gICAgaWYgKHR5cGVvZiBwYXNzd29yZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBwYXNzd29yZCA9IFNIQTI1NihwYXNzd29yZCk7XG4gICAgfSBlbHNlIHsgLy8gJ3Bhc3N3b3JkJyBpcyBhbiBvYmplY3RcbiAgICAgICAgaWYgKHBhc3N3b3JkLmFsZ29yaXRobSAhPT0gXCJzaGEtMjU2XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkludmFsaWQgcGFzc3dvcmQgaGFzaCBhbGdvcml0aG0uIFwiICtcbiAgICAgICAgICAgICAgICBcIk9ubHkgJ3NoYS0yNTYnIGlzIGFsbG93ZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHBhc3N3b3JkID0gcGFzc3dvcmQuZGlnZXN0O1xuICAgIH1cbiAgICByZXR1cm4gcGFzc3dvcmQ7XG59O1xuXG4vLyBVc2UgYmNyeXB0IHRvIGhhc2ggdGhlIHBhc3N3b3JkIGZvciBzdG9yYWdlIGluIHRoZSBkYXRhYmFzZS5cbi8vIGBwYXNzd29yZGAgY2FuIGJlIGEgc3RyaW5nIChpbiB3aGljaCBjYXNlIGl0IHdpbGwgYmUgcnVuIHRocm91Z2hcbi8vIFNIQTI1NiBiZWZvcmUgYmNyeXB0KSBvciBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGBkaWdlc3RgIGFuZFxuLy8gYGFsZ29yaXRobWAgKGluIHdoaWNoIGNhc2Ugd2UgYmNyeXB0IGBwYXNzd29yZC5kaWdlc3RgKS5cbi8vXG52YXIgaGFzaFBhc3N3b3JkID0gZnVuY3Rpb24ocGFzc3dvcmQpIHtcbiAgICBwYXNzd29yZCA9IGdldFBhc3N3b3JkU3RyaW5nKHBhc3N3b3JkKTtcbiAgICByZXR1cm4gYmNyeXB0SGFzaChwYXNzd29yZCwgQWNjb3VudHMuX2JjcnlwdFJvdW5kcyk7XG59O1xuXG4vLyBDaGVjayB3aGV0aGVyIHRoZSBwcm92aWRlZCBwYXNzd29yZCBtYXRjaGVzIHRoZSBiY3J5cHQnZWQgcGFzc3dvcmQgaW5cbi8vIHRoZSBkYXRhYmFzZSB1c2VyIHJlY29yZC4gYHBhc3N3b3JkYCBjYW4gYmUgYSBzdHJpbmcgKGluIHdoaWNoIGNhc2Vcbi8vIGl0IHdpbGwgYmUgcnVuIHRocm91Z2ggU0hBMjU2IGJlZm9yZSBiY3J5cHQpIG9yIGFuIG9iamVjdCB3aXRoXG4vLyBwcm9wZXJ0aWVzIGBkaWdlc3RgIGFuZCBgYWxnb3JpdGhtYCAoaW4gd2hpY2ggY2FzZSB3ZSBiY3J5cHRcbi8vIGBwYXNzd29yZC5kaWdlc3RgKS5cbi8vXG5BY2NvdW50cy5fY2hlY2tQaG9uZVBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICB1c2VySWQ6IHVzZXIuX2lkXG4gICAgfTtcblxuICAgIHBhc3N3b3JkID0gZ2V0UGFzc3dvcmRTdHJpbmcocGFzc3dvcmQpO1xuXG4gICAgaWYgKCFiY3J5cHRDb21wYXJlKHBhc3N3b3JkLCB1c2VyLnNlcnZpY2VzLnBob25lLmJjcnlwdCkpIHtcbiAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIGNoZWNrUGFzc3dvcmQgPSBBY2NvdW50cy5fY2hlY2tQaG9uZVBhc3N3b3JkO1xuXG4vLy9cbi8vLyBMT0dJTlxuLy8vXG5cbi8vIFVzZXJzIGNhbiBzcGVjaWZ5IHZhcmlvdXMga2V5cyB0byBpZGVudGlmeSB0aGVtc2VsdmVzIHdpdGguXG4vLyBAcGFyYW0gdXNlciB7T2JqZWN0fSB3aXRoIGBpZGAgb3IgYHBob25lYC5cbi8vIEByZXR1cm5zIEEgc2VsZWN0b3IgdG8gcGFzcyB0byBtb25nbyB0byBnZXQgdGhlIHVzZXIgcmVjb3JkLlxuXG52YXIgc2VsZWN0b3JGcm9tVXNlclF1ZXJ5ID0gZnVuY3Rpb24odXNlcikge1xuICAgIGlmICh1c2VyLmlkKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgX2lkOiB1c2VyLmlkXG4gICAgICAgIH07XG4gICAgZWxzZSBpZiAodXNlci5waG9uZSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwaG9uZS5udW1iZXInOiB1c2VyLnBob25lXG4gICAgICAgIH07XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwic2hvdWxkbid0IGhhcHBlbiAodmFsaWRhdGlvbiBtaXNzZWQgc29tZXRoaW5nKVwiKTtcbn07XG5cbnZhciBmaW5kVXNlckZyb21Vc2VyUXVlcnkgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gc2VsZWN0b3JGcm9tVXNlclF1ZXJ5KHVzZXIpO1xuXG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShzZWxlY3Rvcik7XG4gICAgaWYgKCF1c2VyKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJVc2VyIG5vdCBmb3VuZFwiKTtcblxuICAgIHJldHVybiB1c2VyO1xufTtcblxuLy8gWFhYIG1heWJlIHRoaXMgYmVsb25ncyBpbiB0aGUgY2hlY2sgcGFja2FnZVxudmFyIE5vbkVtcHR5U3RyaW5nID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24oeCkge1xuICAgIGNoZWNrKHgsIFN0cmluZyk7XG4gICAgcmV0dXJuIHgubGVuZ3RoID4gMDtcbn0pO1xuXG52YXIgdXNlclF1ZXJ5VmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICAgIGNoZWNrKHVzZXIsIHtcbiAgICAgICAgaWQ6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKSxcbiAgICAgICAgcGhvbmU6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKVxuICAgIH0pO1xuICAgIGlmIChfLmtleXModXNlcikubGVuZ3RoICE9PSAxKVxuICAgICAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoXCJVc2VyIHByb3BlcnR5IG11c3QgaGF2ZSBleGFjdGx5IG9uZSBmaWVsZFwiKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG52YXIgcGFzc3dvcmRWYWxpZGF0b3IgPSBNYXRjaC5PbmVPZihcbiAgICBTdHJpbmcsIHtcbiAgICAgICAgZGlnZXN0OiBTdHJpbmcsXG4gICAgICAgIGFsZ29yaXRobTogU3RyaW5nXG4gICAgfVxuKTtcblxuLy8gSGFuZGxlciB0byBsb2dpbiB3aXRoIGEgcGhvbmUuXG4vL1xuLy8gVGhlIE1ldGVvciBjbGllbnQgc2V0cyBvcHRpb25zLnBhc3N3b3JkIHRvIGFuIG9iamVjdCB3aXRoIGtleXNcbi8vICdkaWdlc3QnIChzZXQgdG8gU0hBMjU2KHBhc3N3b3JkKSkgYW5kICdhbGdvcml0aG0nIChcInNoYS0yNTZcIikuXG4vL1xuLy8gRm9yIG90aGVyIEREUCBjbGllbnRzIHdoaWNoIGRvbid0IGhhdmUgYWNjZXNzIHRvIFNIQSwgdGhlIGhhbmRsZXJcbi8vIGFsc28gYWNjZXB0cyB0aGUgcGxhaW50ZXh0IHBhc3N3b3JkIGluIG9wdGlvbnMucGFzc3dvcmQgYXMgYSBzdHJpbmcuXG4vL1xuLy8gKEl0IG1pZ2h0IGJlIG5pY2UgaWYgc2VydmVycyBjb3VsZCB0dXJuIHRoZSBwbGFpbnRleHQgcGFzc3dvcmRcbi8vIG9wdGlvbiBvZmYuIE9yIG1heWJlIGl0IHNob3VsZCBiZSBvcHQtaW4sIG5vdCBvcHQtb3V0P1xuLy8gQWNjb3VudHMuY29uZmlnIG9wdGlvbj8pXG4vL1xuLy8gTm90ZSB0aGF0IG5laXRoZXIgcGFzc3dvcmQgb3B0aW9uIGlzIHNlY3VyZSB3aXRob3V0IFNTTC5cbi8vXG5BY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInBob25lXCIsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMucGFzc3dvcmQgfHwgb3B0aW9ucy5zcnApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIGRvbid0IGhhbmRsZVxuXG4gICAgY2hlY2sob3B0aW9ucywge1xuICAgICAgICB1c2VyOiB1c2VyUXVlcnlWYWxpZGF0b3IsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFZhbGlkYXRvclxuICAgIH0pO1xuXG4gICAgdmFyIHVzZXIgPSBmaW5kVXNlckZyb21Vc2VyUXVlcnkob3B0aW9ucy51c2VyKTtcblxuICAgIGlmICghdXNlci5zZXJ2aWNlcyB8fCAhdXNlci5zZXJ2aWNlcy5waG9uZSB8fCAhKHVzZXIuc2VydmljZXMucGhvbmUuYmNyeXB0IHx8IHVzZXIuc2VydmljZXMucGhvbmUuc3JwKSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBoYXMgbm8gcGFzc3dvcmQgc2V0XCIpO1xuXG4gICAgaWYgKCF1c2VyLnNlcnZpY2VzLnBob25lLmJjcnlwdCkge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMucGFzc3dvcmQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIC8vIFRoZSBjbGllbnQgaGFzIHByZXNlbnRlZCBhIHBsYWludGV4dCBwYXNzd29yZCwgYW5kIHRoZSB1c2VyIGlzXG4gICAgICAgICAgICAvLyBub3QgdXBncmFkZWQgdG8gYmNyeXB0IHlldC4gV2UgZG9uJ3QgYXR0ZW1wdCB0byB0ZWxsIHRoZSBjbGllbnRcbiAgICAgICAgICAgIC8vIHRvIHVwZ3JhZGUgdG8gYmNyeXB0LCBiZWNhdXNlIGl0IG1pZ2h0IGJlIGEgc3RhbmRhbG9uZSBERFBcbiAgICAgICAgICAgIC8vIGNsaWVudCBkb2Vzbid0IGtub3cgaG93IHRvIGRvIHN1Y2ggYSB0aGluZy5cbiAgICAgICAgICAgIHZhciB2ZXJpZmllciA9IHVzZXIuc2VydmljZXMucGhvbmUuc3JwO1xuICAgICAgICAgICAgdmFyIG5ld1ZlcmlmaWVyID0gU1JQLmdlbmVyYXRlVmVyaWZpZXIob3B0aW9ucy5wYXNzd29yZCwge1xuICAgICAgICAgICAgICAgIGlkZW50aXR5OiB2ZXJpZmllci5pZGVudGl0eSxcbiAgICAgICAgICAgICAgICBzYWx0OiB2ZXJpZmllci5zYWx0XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHZlcmlmaWVyLnZlcmlmaWVyICE9PSBuZXdWZXJpZmllci52ZXJpZmllcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbmNvcnJlY3QgcGFzc3dvcmRcIilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUZWxsIHRoZSBjbGllbnQgdG8gdXNlIHRoZSBTUlAgdXBncmFkZSBwcm9jZXNzLlxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwib2xkIHBhc3N3b3JkIGZvcm1hdFwiLCBFSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ3NycCcsXG4gICAgICAgICAgICAgICAgaWRlbnRpdHk6IHVzZXIuc2VydmljZXMucGhvbmUuc3JwLmlkZW50aXR5XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hlY2tQYXNzd29yZChcbiAgICAgICAgdXNlcixcbiAgICAgICAgb3B0aW9ucy5wYXNzd29yZFxuICAgICk7XG59KTtcblxuLy8gSGFuZGxlciB0byBsb2dpbiB1c2luZyB0aGUgU1JQIHVwZ3JhZGUgcGF0aC4gVG8gdXNlIHRoaXMgbG9naW5cbi8vIGhhbmRsZXIsIHRoZSBjbGllbnQgbXVzdCBwcm92aWRlOlxuLy8gICAtIHNycDogSChpZGVudGl0eSArIFwiOlwiICsgcGFzc3dvcmQpXG4vLyAgIC0gcGFzc3dvcmQ6IGEgc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgJ2RpZ2VzdCcgYW5kICdhbGdvcml0aG0nXG4vL1xuLy8gV2UgdXNlIGBvcHRpb25zLnNycGAgdG8gdmVyaWZ5IHRoYXQgdGhlIGNsaWVudCBrbm93cyB0aGUgY29ycmVjdFxuLy8gcGFzc3dvcmQgd2l0aG91dCBkb2luZyBhIGZ1bGwgU1JQIGZsb3cuIE9uY2Ugd2UndmUgY2hlY2tlZCB0aGF0LCB3ZVxuLy8gdXBncmFkZSB0aGUgdXNlciB0byBiY3J5cHQgYW5kIHJlbW92ZSB0aGUgU1JQIGluZm9ybWF0aW9uIGZyb20gdGhlXG4vLyB1c2VyIGRvY3VtZW50LlxuLy9cbi8vIFRoZSBjbGllbnQgZW5kcyB1cCB1c2luZyB0aGlzIGxvZ2luIGhhbmRsZXIgYWZ0ZXIgdHJ5aW5nIHRoZSBub3JtYWxcbi8vIGxvZ2luIGhhbmRsZXIgKGFib3ZlKSwgd2hpY2ggdGhyb3dzIGFuIGVycm9yIHRlbGxpbmcgdGhlIGNsaWVudCB0b1xuLy8gdHJ5IHRoZSBTUlAgdXBncmFkZSBwYXRoLlxuLy9cbi8vIFhYWCBDT01QQVQgV0lUSCAwLjguMS4zXG5BY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInBob25lXCIsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuc3JwIHx8ICFvcHRpb25zLnBhc3N3b3JkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBkb24ndCBoYW5kbGVcblxuICAgIGNoZWNrKG9wdGlvbnMsIHtcbiAgICAgICAgdXNlcjogdXNlclF1ZXJ5VmFsaWRhdG9yLFxuICAgICAgICBzcnA6IFN0cmluZyxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkVmFsaWRhdG9yXG4gICAgfSk7XG5cbiAgICB2YXIgdXNlciA9IGZpbmRVc2VyRnJvbVVzZXJRdWVyeShvcHRpb25zLnVzZXIpO1xuXG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGFub3RoZXIgc2ltdWx0YW5lb3VzIGxvZ2luIGhhcyBhbHJlYWR5IHVwZ3JhZGVkXG4gICAgLy8gdGhlIHVzZXIgcmVjb3JkIHRvIGJjcnlwdC5cbiAgICBpZiAodXNlci5zZXJ2aWNlcyAmJiB1c2VyLnNlcnZpY2VzLnBob25lICYmXG4gICAgICAgIHVzZXIuc2VydmljZXMucGhvbmUuYmNyeXB0KVxuICAgICAgICByZXR1cm4gY2hlY2tQYXNzd29yZCh1c2VyLCBvcHRpb25zLnBhc3N3b3JkKTtcblxuICAgIGlmICghKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5waG9uZSAmJiB1c2VyLnNlcnZpY2VzLnBob25lLnNycCkpXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcblxuICAgIHZhciB2MSA9IHVzZXIuc2VydmljZXMucGhvbmUuc3JwLnZlcmlmaWVyO1xuICAgIHZhciB2MiA9IFNSUC5nZW5lcmF0ZVZlcmlmaWVyKFxuICAgICAgICBudWxsLCB7XG4gICAgICAgICAgICBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkOiBvcHRpb25zLnNycCxcbiAgICAgICAgICAgIHNhbHQ6IHVzZXIuc2VydmljZXMucGhvbmUuc3JwLnNhbHRcbiAgICAgICAgfVxuICAgICkudmVyaWZpZXI7XG4gICAgaWYgKHYxICE9PSB2MilcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXG4gICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIpXG4gICAgICAgIH07XG5cbiAgICAvLyBVcGdyYWRlIHRvIGJjcnlwdCBvbiBzdWNjZXNzZnVsIGxvZ2luLlxuICAgIHZhciBzYWx0ZWQgPSBoYXNoUGFzc3dvcmQob3B0aW9ucy5wYXNzd29yZCk7XG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShcbiAgICAgICAgdXNlci5faWQsIHtcbiAgICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS5zcnAnOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS5iY3J5cHQnOiBzYWx0ZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB1c2VySWQ6IHVzZXIuX2lkXG4gICAgfTtcbn0pO1xuXG4vLyBGb3JjZSBjaGFuZ2UgdGhlIHVzZXJzIHBob25lIHBhc3N3b3JkLlxuXG4vKipcbiAqIEBzdW1tYXJ5IEZvcmNpYmx5IGNoYW5nZSB0aGUgcGFzc3dvcmQgZm9yIGEgdXNlci5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuZXdQYXNzd29yZCBBIG5ldyBwYXNzd29yZCBmb3IgdGhlIHVzZXIuXG4gKi9cbkFjY291bnRzLnNldFBob25lUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VySWQsIG5ld1BsYWludGV4dFBhc3N3b3JkKSB7XG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VySWQpO1xuICAgIGlmICghdXNlcilcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBub3QgZm91bmRcIik7XG5cbiAgICBNZXRlb3IudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB1c2VyLl9pZFxuICAgIH0sIHtcbiAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICAnc2VydmljZXMucGhvbmUuc3JwJzogMSwgLy8gWFhYIENPTVBBVCBXSVRIIDAuOC4xLjNcbiAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS52ZXJpZnknOiAxLFxuICAgICAgICAgICAgJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucyc6IDFcbiAgICAgICAgfSxcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgJ3NlcnZpY2VzLnBob25lLmJjcnlwdCc6IGhhc2hQYXNzd29yZChuZXdQbGFpbnRleHRQYXNzd29yZClcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLy8vXG4vLy8gU2VuZCBwaG9uZSBWRVJJRklDQVRJT04gY29kZVxuLy8vXG5cbi8vIHNlbmQgdGhlIHVzZXIgYSBzbXMgd2l0aCBhIGNvZGUgdGhhdCBjYW4gYmUgdXNlZCB0byB2ZXJpZnkgbnVtYmVyXG5cbi8qKlxuICogQHN1bW1hcnkgU2VuZCBhbiBTTVMgd2l0aCBhIGNvZGUgdGhlIHVzZXIgY2FuIHVzZSB2ZXJpZnkgdGhlaXIgcGhvbmUgbnVtYmVyIHdpdGguXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBpZCBvZiB0aGUgdXNlciB0byBzZW5kIGVtYWlsIHRvLlxuICogQHBhcmFtIHtTdHJpbmd9IFtwaG9uZV0gT3B0aW9uYWwuIFdoaWNoIHBob25lIG9mIHRoZSB1c2VyJ3MgdG8gc2VuZCB0aGUgU01TIHRvLiBUaGlzIHBob25lIG11c3QgYmUgaW4gdGhlIHVzZXIncyBgcGhvbmVzYCBsaXN0LiBEZWZhdWx0cyB0byB0aGUgZmlyc3QgdW52ZXJpZmllZCBwaG9uZSBpbiB0aGUgbGlzdC5cbiAqL1xuQWNjb3VudHMuc2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZSA9IGZ1bmN0aW9uKHVzZXJJZCwgcGhvbmUpIHtcbiAgICAvLyBYWFggQWxzbyBnZW5lcmF0ZSBhIGxpbmsgdXNpbmcgd2hpY2ggc29tZW9uZSBjYW4gZGVsZXRlIHRoaXNcbiAgICAvLyBhY2NvdW50IGlmIHRoZXkgb3duIHNhaWQgbnVtYmVyIGJ1dCB3ZXJlbid0IHRob3NlIHdobyBjcmVhdGVkXG4gICAgLy8gdGhpcyBhY2NvdW50LlxuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGV4aXN0cywgYW5kIHBob25lIGlzIG9uZSBvZiB0aGVpciBwaG9uZXMuXG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VySWQpO1xuICAgIGlmICghdXNlcilcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQ2FuJ3QgZmluZCB1c2VyXCIpO1xuICAgIC8vIHBpY2sgdGhlIGZpcnN0IHVudmVyaWZpZWQgcGhvbmUgaWYgd2Ugd2VyZW4ndCBwYXNzZWQgYW4gcGhvbmUuXG4gICAgaWYgKCFwaG9uZSAmJiB1c2VyLnBob25lKSB7XG4gICAgICAgIHBob25lID0gdXNlci5waG9uZSAmJiB1c2VyLnBob25lLm51bWJlcjtcbiAgICB9XG4gICAgLy8gbWFrZSBzdXJlIHdlIGhhdmUgYSB2YWxpZCBwaG9uZVxuICAgIGlmICghcGhvbmUpXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIk5vIHN1Y2ggcGhvbmUgZm9yIHVzZXIuXCIpO1xuXG4gICAgdmFyIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKHVzZXJJZCwgdHJ1ZSk7XG4gICAgLy8gSWYgc2VudCBtb3JlIHRoYW4gbWF4IHJldHJ5IHdhaXRcbiAgICB2YXIgd2FpdFRpbWVCZXR3ZWVuUmV0cmllcyA9IEFjY291bnRzLl9vcHRpb25zLnZlcmlmaWNhdGlvbldhaXRUaW1lO1xuICAgIHZhciBtYXhSZXRyeUNvdW50cyA9IEFjY291bnRzLl9vcHRpb25zLnZlcmlmaWNhdGlvbk1heFJldHJpZXM7XG5cbiAgICB2YXIgdmVyaWZ5T2JqZWN0ID0ge1xuICAgICAgICBudW1PZlJldHJpZXM6IDBcbiAgICB9O1xuICAgIGlmICh1c2VyLnNlcnZpY2VzICYmIHVzZXIuc2VydmljZXMucGhvbmUgJiYgdXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnkpIHtcbiAgICAgICAgdmVyaWZ5T2JqZWN0ID0gdXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnk7XG4gICAgfVxuXG4gICAgdmFyIGN1clRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIC8vIENoZWNrIGlmIGxhc3QgcmV0cnkgd2FzIHRvbyBzb29uXG4gICAgdmFyIG5leHRSZXRyeURhdGUgPSB2ZXJpZnlPYmplY3QgJiYgdmVyaWZ5T2JqZWN0Lmxhc3RSZXRyeSAmJiBuZXcgRGF0ZSh2ZXJpZnlPYmplY3QubGFzdFJldHJ5LmdldFRpbWUoKSArIHdhaXRUaW1lQmV0d2VlblJldHJpZXMpO1xuICAgIGlmIChuZXh0UmV0cnlEYXRlICYmIG5leHRSZXRyeURhdGUgPiBjdXJUaW1lKSB7XG4gICAgICAgIHZhciB3YWl0VGltZUluU2VjID0gTWF0aC5jZWlsKE1hdGguYWJzKChuZXh0UmV0cnlEYXRlIC0gY3VyVGltZSkgLyAxMDAwKSksXG4gICAgICAgICAgICBlcnJNc2cgPSBUQVBpMThuLl9fKCdhY2NvdW50c19waG9uZV90b29fb2Z0ZW5fcmV0cmllcycsIHtcbiAgICAgICAgICAgICAgICBzOiB3YWl0VGltZUluU2VjXG4gICAgICAgICAgICB9LCBsb2NhbGUpO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgZXJyTXNnKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgd2hlcmUgdG9vIG1hbnkgcmV0cmllc1xuICAgIC8vIGlmICh2ZXJpZnlPYmplY3QubnVtT2ZSZXRyaWVzID4gbWF4UmV0cnlDb3VudHMpIHtcbiAgICAvLyAgICAgLy8gQ2hlY2sgaWYgcGFzc2VkIGVub3VnaCB0aW1lIHNpbmNlIGxhc3QgcmV0cnlcbiAgICAvLyAgICAgdmFyIHdhaXRUaW1lQmV0d2Vlbk1heFJldHJpZXMgPSBBY2NvdW50cy5fb3B0aW9ucy52ZXJpZmljYXRpb25SZXRyaWVzV2FpdFRpbWU7XG4gICAgLy8gICAgIG5leHRSZXRyeURhdGUgPSBuZXcgRGF0ZSh2ZXJpZnlPYmplY3QubGFzdFJldHJ5LmdldFRpbWUoKSArIHdhaXRUaW1lQmV0d2Vlbk1heFJldHJpZXMpO1xuICAgIC8vICAgICBpZiAobmV4dFJldHJ5RGF0ZSA+IGN1clRpbWUpIHtcbiAgICAvLyAgICAgICAgIHZhciB3YWl0VGltZUluTWluID0gTWF0aC5jZWlsKE1hdGguYWJzKChuZXh0UmV0cnlEYXRlIC0gY3VyVGltZSkgLyA2MDAwMCkpLFxuICAgIC8vICAgICAgICAgICAgIGVyck1zZyA9IFRBUGkxOG4uX18oJ2FjY291bnRzX3Bob25lX3Rvb19tYW55X3JldHJpZXMnLHttOndhaXRUaW1lSW5NaW59LGxvY2FsZSk7XG4gICAgLy8gICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgZXJyTXNnKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbiAgICB2ZXJpZnlPYmplY3QuY29kZSA9IGdldFJhbmRvbUNvZGUoQWNjb3VudHMuX29wdGlvbnMudmVyaWZpY2F0aW9uQ29kZUxlbmd0aCk7XG4gICAgdmVyaWZ5T2JqZWN0LnBob25lID0gcGhvbmU7XG4gICAgdmVyaWZ5T2JqZWN0Lmxhc3RSZXRyeSA9IGN1clRpbWU7XG4gICAgdmVyaWZ5T2JqZWN0Lm51bU9mUmV0cmllcysrO1xuXG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAnc2VydmljZXMucGhvbmUudmVyaWZ5JzogdmVyaWZ5T2JqZWN0XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGJlZm9yZSBwYXNzaW5nIHRvIHRlbXBsYXRlLCB1cGRhdGUgdXNlciBvYmplY3Qgd2l0aCBuZXcgdG9rZW5cbiAgICBNZXRlb3IuX2Vuc3VyZSh1c2VyLCAnc2VydmljZXMnLCAncGhvbmUnKTtcbiAgICB1c2VyLnNlcnZpY2VzLnBob25lLnZlcmlmeSA9IHZlcmlmeU9iamVjdDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB0bzogcGhvbmUsXG4gICAgICAgIGZyb206IFNNUy5waG9uZVRlbXBsYXRlcy5mcm9tLFxuICAgICAgICBib2R5OiBTTVMucGhvbmVUZW1wbGF0ZXMudGV4dCh1c2VyLCB2ZXJpZnlPYmplY3QuY29kZSlcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3Muc21zICYmIE1ldGVvci5zZXR0aW5ncy5zbXMudHdpbGlvKSB7XG4gICAgICAgICAgICBTTVMuc2VuZChvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgY29kZTogdmVyaWZ5T2JqZWN0LmNvZGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyDlj5HpgIHmiYvmnLrnn63kv6FcbiAgICAgICAgICAgIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICAgICAgICAgIEZvcm1hdDogJ0pTT04nLFxuICAgICAgICAgICAgICAgIEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuICAgICAgICAgICAgICAgIFBhcmFtU3RyaW5nOiBKU09OLnN0cmluZ2lmeShwYXJhbXMpLFxuICAgICAgICAgICAgICAgIFJlY051bTogcGhvbmUuc3Vic3RyaW5nKDMpLFxuICAgICAgICAgICAgICAgIFNpZ25OYW1lOiAnT0Hns7vnu58nLFxuICAgICAgICAgICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182MzM3MDQ1NScsXG4gICAgICAgICAgICAgICAgbXNnOiBUQVBpMThuLl9fKCdzbXMubW9iaWxlX3ZlcmlmaWNhdGlvbl9jb2RlLnRlbXBsYXRlJywgcGFyYW1zLCBsb2NhbGUpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NNUyBGYWlsZWQsIFNvbWV0aGluZyBiYWQgaGFwcGVuZWQhJywgZSk7XG4gICAgICAgIHZhciBlcnJNc2cgPSBUQVBpMThuLl9fKCdhY2NvdW50c19waG9uZV9zbXNfZmFpbGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBlcnJNc2cpO1xuICAgIH1cbn07XG5cbi8vIFNlbmQgU01TIHdpdGggY29kZSB0byB1c2VyLlxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHJlcXVlc3RQaG9uZVZlcmlmaWNhdGlvbjogZnVuY3Rpb24ocGhvbmUsIGxvY2FsZSwgY2hlY2tWZXJpZmllZCkge1xuICAgICAgICBpZiAocGhvbmUpIHtcbiAgICAgICAgICAgIGNoZWNrKHBob25lLCBTdHJpbmcpO1xuICAgICAgICAgICAgLy8gQ2hhbmdlIHBob25lIGZvcm1hdCB0byBpbnRlcm5hdGlvbmFsIFNNUyBmb3JtYXRcbiAgICAgICAgICAgIHBob25lID0gbm9ybWFsaXplUGhvbmUocGhvbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwaG9uZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfaW52YWxpZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgIC8vIEdldCB1c2VyIGJ5IHBob25lIG51bWJlclxuICAgICAgICAgICAgdmFyIHVzZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICdwaG9uZS5udW1iZXInOiBwaG9uZSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKGNoZWNrVmVyaWZpZWQpe1xuICAgICAgICAgICAgICAgIHVzZXJPcHRpb25zWydwaG9uZS52ZXJpZmllZCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4aXN0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJPcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgICdfaWQnOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdVc2VyKSB7XG4gICAgICAgICAgICAgICAgdXNlcklkID0gZXhpc3RpbmdVc2VyICYmIGV4aXN0aW5nVXNlci5faWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdXNlciB3aXRoIHBob25lIG51bWJlclxuICAgICAgICAgICAgICAgIC8vIHVzZXJJZCA9IGNyZWF0ZVVzZXIoe3Bob25lOnBob25lfSk7XG4gICAgICAgICAgICAgICAgLy8g5pqC5pe25LiN5YWB6K646YCa6L+H5omL5py65Yib5bu65paw6LSm5oi377yM5Zug5Li65Y+v6IO95Lya6Lef5rKh5pyJ6YWN572u5omL5py65Y+355qE6ICB6LSm5oi35Yay56qBXG4gICAgICAgICAgICAgICAgdmFyIGVyck1zZyA9IFRBUGkxOG4uX18oJ2FjY291bnRzX3Bob25lX3VzZXJfbm90X2ZvdW5kJywge30sIGxvY2FsZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vIOW3sueZu+W9leeUqOaIt++8jOacieWPr+iDvemcgOimgeaJi+acuuWPt+W3sumqjOivgeaJjeWPkemqjOivgeegge+8jOavlOWmgumAmui/h+aJi+acuuWPt+aJvuWbnuWvhueggVxuICAgICAgICAgICAgaWYoY2hlY2tWZXJpZmllZCl7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgICAgICAgICAgICdwaG9uZS5udW1iZXInOiBwaG9uZSxcbiAgICAgICAgICAgICAgICAgICAgJ3Bob25lLnZlcmlmaWVkJzogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmKCF2YWxpZFVzZXIpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyTXNnID0gVEFQaTE4bi5fXygnYWNjb3VudHNfcGhvbmVfdmVyaWZ5X2ZhaWwnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEFjY291bnRzLnNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGUodXNlcklkLCBwaG9uZSk7XG4gICAgfVxufSk7XG5cbi8vIFRha2UgY29kZSBmcm9tIHNlbmRWZXJpZmljYXRpb25QaG9uZSBTTVMsIG1hcmsgdGhlIHBob25lIGFzIHZlcmlmaWVkLFxuLy8gQ2hhbmdlIHBhc3N3b3JkIGlmIG5lZWRlZFxuLy8gYW5kIGxvZyB0aGVtIGluLlxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHZlcmlmeVBob25lOiBmdW5jdGlvbihwaG9uZSwgbW9iaWxlLCBjb2RlLCBuZXdQYXNzd29yZCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIENoZWNrIGlmIG5lZWRzIHRvIGNoYW5nZSBwYXNzd29yZFxuICAgICAgICB2YXIgdXNlcklkID0gdGhpcy51c2VySWQ7XG5cbiAgICAgICAgcmV0dXJuIEFjY291bnRzLl9sb2dpbk1ldGhvZChcbiAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICBcInZlcmlmeVBob25lXCIsXG4gICAgICAgICAgICBhcmd1bWVudHMsXG4gICAgICAgICAgICBcInBob25lXCIsXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjaGVjayhjb2RlLCBTdHJpbmcpO1xuICAgICAgICAgICAgICAgIGNoZWNrKG1vYmlsZSwgU3RyaW5nKTtcbiAgICAgICAgICAgICAgICBjaGVjayhwaG9uZSwgU3RyaW5nKTtcblxuICAgICAgICAgICAgICAgIGlmICghY29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJDb2RlIGlzIG11c3QgYmUgcHJvdmlkZWQgdG8gbWV0aG9kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGhvbmUgZm9ybWF0IHRvIGludGVybmF0aW9uYWwgU01TIGZvcm1hdFxuICAgICAgICAgICAgICAgIHBob25lID0gbm9ybWFsaXplUGhvbmUocGhvbmUpO1xuICAgICAgICAgICAgICAgIGlmKCFwaG9uZSl7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgICAgIC8vIOWboOe7keWumuS/ruaUueaJi+acuuWPt+imgeaxguWFiOmqjOivgemAmui/h+aJjeabtOaWsOaJi+acuuWPt++8jOaJgOS7pei/memHjOS4jeWPr+S7pemAmui/h+aJi+acuuWPt+aJvueUqOaIt++8jOWPquiDveaJvuW9k+WJjeeZu+W9leeUqOaIt1xuICAgICAgICAgICAgICAgIC8vIOi/meagt+eahOivne+8jOWvueS6juW3sueZu+W9leeUqOaIt+adpeivtO+8jOWwseWPquiDvemqjOivgeiHquW3seeahOaJi+acuuWPt+S6hlxuICAgICAgICAgICAgICAgIGlmKHVzZXJJZCl7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiB1c2VySWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBob25lLm51bWJlclwiOiBwaG9uZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGlmICghdXNlcilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfaW52YWxpZFwiKTtcblxuICAgICAgICAgICAgICAgIC8vIFZlcmlmeSBjb2RlIGlzIGFjY2VwdGVkIG9yIG1hc3RlciBjb2RlXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyLnNlcnZpY2VzLnBob25lIHx8ICF1c2VyLnNlcnZpY2VzLnBob25lLnZlcmlmeSB8fCAhdXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnkuY29kZSB8fFxuICAgICAgICAgICAgICAgICAgICAodXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnkuY29kZSAhPSBjb2RlICYmICFpc01hc3RlckNvZGUoY29kZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2NvZGVfaW52YWxpZFwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc2V0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdwaG9uZS52ZXJpZmllZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncGhvbmUubW9kaWZpZWQnOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHVuU2V0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS52ZXJpZnknOiAxXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZih1c2VySWQpe1xuICAgICAgICAgICAgICAgICAgICAvLyDlvZPnlKjmiLfpqozor4Hnu5Hlrproh6rlt7HnmoTmiYvmnLrlj7fml7bvvIzmiormiYvmnLrlj7fkuIDotbfmlLnmjonvvIzlsLHkuI3nlKjlho3ljZXni6zosIPnlKjkv67mlLnmiYvmnLrlj7fnmoTmjqXlj6PkuoZcbiAgICAgICAgICAgICAgICAgICAgc2V0T3B0aW9uc1sncGhvbmUubnVtYmVyJ10gPSBwaG9uZTtcbiAgICAgICAgICAgICAgICAgICAgc2V0T3B0aW9uc1sncGhvbmUubW9iaWxlJ10gPSBtb2JpbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXNldFRvT2xkVG9rZW47XG4gICAgICAgICAgICAgICAgLy8gSWYgbmVlZHMgdG8gdXBkYXRlIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgaWYgKG5ld1Bhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrKG5ld1Bhc3N3b3JkLCBwYXNzd29yZFZhbGlkYXRvcik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYXNoZWQgPSBoYXNoUGFzc3dvcmQobmV3UGFzc3dvcmQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IFdlJ3JlIGFib3V0IHRvIGludmFsaWRhdGUgdG9rZW5zIG9uIHRoZSB1c2VyLCB3aG8gd2UgbWlnaHQgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9nZ2VkIGluIGFzLiBNYWtlIHN1cmUgdG8gYXZvaWQgbG9nZ2luZyBvdXJzZWx2ZXMgb3V0IGlmIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFwcGVucy4gQnV0IGFsc28gbWFrZSBzdXJlIG5vdCB0byBsZWF2ZSB0aGUgY29ubmVjdGlvbiBpbiBhIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIG9mIGhhdmluZyBhIGJhZCB0b2tlbiBzZXQgaWYgdGhpbmdzIGZhaWwuXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRUb2tlbiA9IEFjY291bnRzLl9nZXRMb2dpblRva2VuKHNlbGYuY29ubmVjdGlvbi5pZCk7XG4gICAgICAgICAgICAgICAgICAgIEFjY291bnRzLl9zZXRMb2dpblRva2VuKHVzZXIuX2lkLCBzZWxmLmNvbm5lY3Rpb24sIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXNldFRvT2xkVG9rZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFjY291bnRzLl9zZXRMb2dpblRva2VuKHVzZXIuX2lkLCBzZWxmLmNvbm5lY3Rpb24sIG9sZFRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRPcHRpb25zWydzZXJ2aWNlcy5waG9uZS5iY3J5cHQnXSA9IGhhc2hlZDtcbiAgICAgICAgICAgICAgICAgICAgdW5TZXRPcHRpb25zWydzZXJ2aWNlcy5waG9uZS5zcnAnXSA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5aKe5Yqg6K+l6KGM5Luj56CB5omn6KGMbWV0ZW9y5YaF572u55qE5a+G56CB6K6+572u5Yqf6IO9XG4gICAgICAgICAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXIuX2lkLCBuZXdQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB1c2VyLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICdwaG9uZS5udW1iZXInOiBwaG9uZSwvL+aJi+acuuWPt+eZu+W9leS4jeimgeaxgumqjOivgemAmui/h++8jOaJgOS7pei/meS4quadoeS7tuimgeWOu+aOiVxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NlcnZpY2VzLnBob25lLnZlcmlmeS5jb2RlJzogY29kZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAvLyBBbGxvdyBtYXN0ZXIgY29kZSBmcm9tIHNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc01hc3RlckNvZGUoY29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxdWVyeVsnc2VydmljZXMucGhvbmUudmVyaWZ5LmNvZGUnXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDpqozor4HpgJrov4flkI7vvIzlj6/ku6XkuZ/pnIDopoHmiorph43lpI3nmoTmiYvmnLrlj7flhajpg6jmuIXpmaTvvIzku6XlhY3lkI7pnaLmm7TmlrDmiYvmnLrlj7fml7bmiqXllK/kuIDmgKfntKLlvJXnmoTplJlcbiAgICAgICAgICAgICAgICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAncGhvbmUubnVtYmVyJzogcGhvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmU6IHVzZXIuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibW9iaWxlXCI6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZVwiOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZXMucGhvbmVcIjogMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSB1c2VyIHJlY29yZCBieTpcbiAgICAgICAgICAgICAgICAgICAgLy8gLSBDaGFuZ2luZyB0aGUgcGFzc3dvcmQgdG8gdGhlIG5ldyBvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gLSBGb3JnZXR0aW5nIGFib3V0IHRoZSB2ZXJpZmljYXRpb24gY29kZSB0aGF0IHdhcyBqdXN0IHVzZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gLSBWZXJpZnlpbmcgdGhlIHBob25lLCBzaW5jZSB0aGV5IGdvdCB0aGUgY29kZSB2aWEgc21zIHRvIHBob25lLlxuICAgICAgICAgICAgICAgICAgICB2YXIgYWZmZWN0ZWRSZWNvcmRzID0gTWV0ZW9yLnVzZXJzLnVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNldDogc2V0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdW5zZXQ6IHVuU2V0T3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZmZlY3RlZFJlY29yZHMgIT09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVyck1zZyA9IHVzZXJJZCA/IFwiYWNjb3VudHNfcGhvbmVfY29kZV91cGRhdGVfZmFpbFwiIDogXCJhY2NvdW50c19waG9uZV9ub3RfZXhpc3RcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZylcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZnVsVmVyaWZpY2F0aW9uKHVzZXIuX2lkKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzZXRUb09sZFRva2VuKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2V0VG9PbGRUb2tlbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIGFsbCB2YWxpZCBsb2dpbiB0b2tlbnMgd2l0aCBuZXcgb25lcyAoY2hhbmdpbmdcbiAgICAgICAgICAgICAgICAvLyBwYXNzd29yZCBzaG91bGQgaW52YWxpZGF0ZSBleGlzdGluZyBzZXNzaW9ucykuXG4gICAgICAgICAgICAgICAgLy8gQWNjb3VudHMuX2NsZWFyQWxsTG9naW5Ub2tlbnModXNlci5faWQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLl9pZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbi8vL1xuLy8vIENSRUFUSU5HIFVTRVJTXG4vLy9cblxuLy8gU2hhcmVkIGNyZWF0ZVVzZXIgZnVuY3Rpb24gY2FsbGVkIGZyb20gdGhlIGNyZWF0ZVVzZXIgbWV0aG9kLCBib3RoXG4vLyBpZiBvcmlnaW5hdGVzIGluIGNsaWVudCBvciBzZXJ2ZXIgY29kZS4gQ2FsbHMgdXNlciBwcm92aWRlZCBob29rcyxcbi8vIGRvZXMgdGhlIGFjdHVhbCB1c2VyIGluc2VydGlvbi5cbi8vXG4vLyByZXR1cm5zIHRoZSB1c2VyIGlkXG52YXIgY3JlYXRlVXNlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAvLyBVbmtub3duIGtleXMgYWxsb3dlZCwgYmVjYXVzZSBhIG9uQ3JlYXRlVXNlckhvb2sgY2FuIHRha2UgYXJiaXRyYXJ5XG4gICAgLy8gb3B0aW9ucy5cbiAgICBjaGVjayhvcHRpb25zLCBNYXRjaC5PYmplY3RJbmNsdWRpbmcoe1xuICAgICAgICBwaG9uZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICAgICAgcGFzc3dvcmQ6IE1hdGNoLk9wdGlvbmFsKHBhc3N3b3JkVmFsaWRhdG9yKVxuICAgIH0pKTtcblxuICAgIHZhciBwaG9uZSA9IG9wdGlvbnMucGhvbmU7XG4gICAgaWYgKCFwaG9uZSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiTmVlZCB0byBzZXQgcGhvbmVcIik7XG5cbiAgICB2YXIgZXhpc3RpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAncGhvbmUubnVtYmVyJzogcGhvbmVcbiAgICB9KTtcblxuICAgIGlmIChleGlzdGluZ1VzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciB3aXRoIHRoaXMgcGhvbmUgbnVtYmVyIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgIH1cblxuICAgIHZhciB1c2VyID0ge1xuICAgICAgICBzZXJ2aWNlczoge31cbiAgICB9O1xuICAgIGlmIChvcHRpb25zLnBhc3N3b3JkKSB7XG4gICAgICAgIHZhciBoYXNoZWQgPSBoYXNoUGFzc3dvcmQob3B0aW9ucy5wYXNzd29yZCk7XG4gICAgICAgIHVzZXIuc2VydmljZXMucGhvbmUgPSB7XG4gICAgICAgICAgICBiY3J5cHQ6IGhhc2hlZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHVzZXIucGhvbmUgPSB7XG4gICAgICAgIG51bWJlcjogcGhvbmUsXG4gICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gQWNjb3VudHMuaW5zZXJ0VXNlckRvYyhvcHRpb25zLCB1c2VyKTtcbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgLy8gWFhYIHN0cmluZyBwYXJzaW5nIHN1Y2tzLCBtYXliZVxuICAgICAgICAvLyBodHRwczovL2ppcmEubW9uZ29kYi5vcmcvYnJvd3NlL1NFUlZFUi0zMDY5IHdpbGwgZ2V0IGZpeGVkIG9uZSBkYXlcbiAgICAgICAgaWYgKGUubmFtZSAhPT0gJ01vbmdvRXJyb3InKSB0aHJvdyBlO1xuICAgICAgICB2YXIgbWF0Y2ggPSBlLmVyci5tYXRjaCgvRTExMDAwIGR1cGxpY2F0ZSBrZXkgZXJyb3IgaW5kZXg6IChbXiBdKykvKTtcbiAgICAgICAgaWYgKCFtYXRjaCkgdGhyb3cgZTtcbiAgICAgICAgaWYgKG1hdGNoWzFdLmluZGV4T2YoJ3VzZXJzLiRwaG9uZS5udW1iZXInKSAhPT0gLTEpXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJQaG9uZSBudW1iZXIgYWxyZWFkeSBleGlzdHMsIGZhaWxlZCBvbiBjcmVhdGlvbi5cIik7XG4gICAgICAgIHRocm93IGU7XG4gICAgfVxufTtcblxuLy8gbWV0aG9kIGZvciBjcmVhdGUgdXNlci4gUmVxdWVzdHMgY29tZSBmcm9tIHRoZSBjbGllbnQuXG5NZXRlb3IubWV0aG9kcyh7XG4gICAgY3JlYXRlVXNlcldpdGhQaG9uZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICAgICAgaWYgKG9wdGlvbnMucGhvbmUpIHtcbiAgICAgICAgICAgIGNoZWNrKG9wdGlvbnMucGhvbmUsIFN0cmluZyk7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgcGhvbmUgZm9ybWF0IHRvIGludGVybmF0aW9uYWwgU01TIGZvcm1hdFxuICAgICAgICAgICAgb3B0aW9ucy5waG9uZSA9IG5vcm1hbGl6ZVBob25lKG9wdGlvbnMucGhvbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEFjY291bnRzLl9sb2dpbk1ldGhvZChcbiAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICBcImNyZWF0ZVVzZXJXaXRoUGhvbmVcIixcbiAgICAgICAgICAgIGFyZ3VtZW50cyxcbiAgICAgICAgICAgIFwicGhvbmVcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChBY2NvdW50cy5fb3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiU2lnbnVwcyBmb3JiaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB1c2VyLiByZXN1bHQgY29udGFpbnMgaWQgYW5kIHRva2VuLlxuICAgICAgICAgICAgICAgIHZhciB1c2VySWQgPSBjcmVhdGVVc2VyKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIC8vIHNhZmV0eSBiZWx0LiBjcmVhdGVVc2VyIGlzIHN1cHBvc2VkIHRvIHRocm93IG9uIGVycm9yLiBzZW5kIDUwMCBlcnJvclxuICAgICAgICAgICAgICAgIC8vIGluc3RlYWQgb2Ygc2VuZGluZyBhIHZlcmlmaWNhdGlvbiBlbWFpbCB3aXRoIGVtcHR5IHVzZXJpZC5cbiAgICAgICAgICAgICAgICBpZiAoIXVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiY3JlYXRlVXNlciBmYWlsZWQgdG8gaW5zZXJ0IG5ldyB1c2VyXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgYEFjY291bnRzLl9vcHRpb25zLnNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGVPbkNyZWF0aW9uYCBpcyBzZXQsIHJlZ2lzdGVyXG4gICAgICAgICAgICAgICAgLy8gYSB0b2tlbiB0byB2ZXJpZnkgdGhlIHVzZXIncyBwcmltYXJ5IHBob25lLCBhbmQgc2VuZCBpdCB0b1xuICAgICAgICAgICAgICAgIC8vIGJ5IHNtcy5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5waG9uZSAmJiBBY2NvdW50cy5fb3B0aW9ucy5zZW5kUGhvbmVWZXJpZmljYXRpb25Db2RlT25DcmVhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBBY2NvdW50cy5zZW5kUGhvbmVWZXJpZmljYXRpb25Db2RlKHVzZXJJZCwgb3B0aW9ucy5waG9uZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY2xpZW50IGdldHMgbG9nZ2VkIGluIGFzIHRoZSBuZXcgdXNlciBhZnRlcndhcmRzLlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxuLy8gQ3JlYXRlIHVzZXIgZGlyZWN0bHkgb24gdGhlIHNlcnZlci5cbi8vXG4vLyBVbmxpa2UgdGhlIGNsaWVudCB2ZXJzaW9uLCB0aGlzIGRvZXMgbm90IGxvZyB5b3UgaW4gYXMgdGhpcyB1c2VyXG4vLyBhZnRlciBjcmVhdGlvbi5cbi8vXG4vLyByZXR1cm5zIHVzZXJJZCBvciB0aHJvd3MgYW4gZXJyb3IgaWYgaXQgY2FuJ3QgY3JlYXRlXG4vL1xuLy8gWFhYIGFkZCBhbm90aGVyIGFyZ3VtZW50IChcInNlcnZlciBvcHRpb25zXCIpIHRoYXQgZ2V0cyBzZW50IHRvIG9uQ3JlYXRlVXNlcixcbi8vIHdoaWNoIGlzIGFsd2F5cyBlbXB0eSB3aGVuIGNhbGxlZCBmcm9tIHRoZSBjcmVhdGVVc2VyIG1ldGhvZD8gZWcsIFwiYWRtaW46XG4vLyB0cnVlXCIsIHdoaWNoIHdlIHdhbnQgdG8gcHJldmVudCB0aGUgY2xpZW50IGZyb20gc2V0dGluZywgYnV0IHdoaWNoIGEgY3VzdG9tXG4vLyBtZXRob2QgY2FsbGluZyBBY2NvdW50cy5jcmVhdGVVc2VyIGNvdWxkIHNldD9cbi8vXG5BY2NvdW50cy5jcmVhdGVVc2VyV2l0aFBob25lID0gZnVuY3Rpb24ob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBvcHRpb25zID0gXy5jbG9uZShvcHRpb25zKTtcblxuICAgIC8vIFhYWCBhbGxvdyBhbiBvcHRpb25hbCBjYWxsYmFjaz9cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQWNjb3VudHMuY3JlYXRlVXNlciB3aXRoIGNhbGxiYWNrIG5vdCBzdXBwb3J0ZWQgb24gdGhlIHNlcnZlciB5ZXQuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVVc2VyKG9wdGlvbnMpO1xufTtcblxuLy8vXG4vLy8gUEFTU1dPUkQtU1BFQ0lGSUMgSU5ERVhFUyBPTiBVU0VSU1xuLy8vXG5NZXRlb3IudXNlcnMuX2Vuc3VyZUluZGV4KCdwaG9uZS5udW1iZXInLCB7XG4gICAgdW5pcXVlOiAxLFxuICAgIHNwYXJzZTogMVxufSk7XG5cbi8vIGNu5bmz5Y+w5Y+R55Sf6L+H6aqM6K+B56CB6YeN5aSN55qE6Zeu6aKY77yM5omA5Lul5Y675o6J5ZSv5LiA5oCn57Si5byV57qm5p2fXG5NZXRlb3IudXNlcnMuX2Vuc3VyZUluZGV4KCdzZXJ2aWNlcy5waG9uZS52ZXJpZnkuY29kZScsIHtcbiAgICAvLyB1bmlxdWU6IDEsXG4gICAgc3BhcnNlOiAxXG59KTtcblxuLyoqKiBDb250cm9sIHB1Ymxpc2hlZCBkYXRhICoqKioqKioqKi9cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIC8qKiBQdWJsaXNoIHBob25lcyB0byB0aGUgY2xpZW50ICoqL1xuICAgIE1ldGVvci5wdWJsaXNoKG51bGwsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7XG4gICAgICAgICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgICAncGhvbmUnOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKiBEaXNhYmxlIHVzZXIgcHJvZmlsZSBlZGl0aW5nICoqL1xuICAgIE1ldGVvci51c2Vycy5kZW55KHtcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChtb2RpZmllci4kc2V0LnBob25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8qKioqKioqKioqKioqIFBob25lIHZlcmlmaWNhdGlvbiBob29rICoqKioqKioqKioqKiovXG5cbi8vIENhbGxiYWNrIGV4Y2VwdGlvbnMgYXJlIHByaW50ZWQgd2l0aCBNZXRlb3IuX2RlYnVnIGFuZCBpZ25vcmVkLlxudmFyIG9uUGhvbmVWZXJpZmljYXRpb25Ib29rID0gbmV3IEhvb2soe1xuICAgIGRlYnVnUHJpbnRFeGNlcHRpb25zOiBcIm9uUGhvbmVWZXJpZmljYXRpb24gY2FsbGJhY2tcIlxufSk7XG5cbi8qKlxuICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgYSBwaG9uZSB2ZXJpZmljYXRpb24gYXR0ZW1wdCBzdWNjZWVkcy5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHBob25lIHZlcmlmaWNhdGlvbiBpcyBzdWNjZXNzZnVsLlxuICovXG5BY2NvdW50cy5vblBob25lVmVyaWZpY2F0aW9uID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBvblBob25lVmVyaWZpY2F0aW9uSG9vay5yZWdpc3RlcihmdW5jKTtcbn07XG5cbnZhciBzdWNjZXNzZnVsVmVyaWZpY2F0aW9uID0gZnVuY3Rpb24odXNlcklkKSB7XG4gICAgb25QaG9uZVZlcmlmaWNhdGlvbkhvb2suZWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh1c2VySWQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbn07XG5cbi8vIEdpdmUgZWFjaCBsb2dpbiBob29rIGNhbGxiYWNrIGEgZnJlc2ggY2xvbmVkIGNvcHkgb2YgdGhlIGF0dGVtcHRcbi8vIG9iamVjdCwgYnV0IGRvbid0IGNsb25lIHRoZSBjb25uZWN0aW9uLlxuLy9cbnZhciBjbG9uZUF0dGVtcHRXaXRoQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKGNvbm5lY3Rpb24sIGF0dGVtcHQpIHtcbiAgICB2YXIgY2xvbmVkQXR0ZW1wdCA9IEVKU09OLmNsb25lKGF0dGVtcHQpO1xuICAgIGNsb25lZEF0dGVtcHQuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgcmV0dXJuIGNsb25lZEF0dGVtcHQ7XG59O1xuLyoqKioqKioqKioqKiogSGVscGVyIGZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gUmV0dXJuIG5vcm1hbGl6ZWQgcGhvbmUgZm9ybWF0XG52YXIgbm9ybWFsaXplUGhvbmUgPSBmdW5jdGlvbihwaG9uZSkge1xuICAgIC8vIElmIHBob25lIGVxdWFscyB0byBvbmUgb2YgYWRtaW4gcGhvbmUgbnVtYmVycyByZXR1cm4gaXQgYXMtaXNcbiAgICBpZiAocGhvbmUgJiYgQWNjb3VudHMuX29wdGlvbnMuYWRtaW5QaG9uZU51bWJlcnMgJiYgQWNjb3VudHMuX29wdGlvbnMuYWRtaW5QaG9uZU51bWJlcnMuaW5kZXhPZihwaG9uZSkgIT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHBob25lO1xuICAgIH1cbiAgICByZXR1cm4gUGhvbmUocGhvbmUpWzBdO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBjb2RlIGlzIHRoZSBkZWZpbmVkIG1hc3RlciBjb2RlXG4gKiBAcGFyYW0gY29kZVxuICogQHJldHVybnMgeyp8Ym9vbGVhbn1cbiAqL1xudmFyIGlzTWFzdGVyQ29kZSA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gY29kZSAmJiBBY2NvdW50cy5fb3B0aW9ucy5waG9uZVZlcmlmaWNhdGlvbk1hc3RlckNvZGUgJiZcbiAgICAgICAgY29kZSA9PSBBY2NvdW50cy5fb3B0aW9ucy5waG9uZVZlcmlmaWNhdGlvbk1hc3RlckNvZGU7XG59O1xuXG4vKipcbiAqIEdldCByYW5kb20gcGhvbmUgdmVyaWZpY2F0aW9uIGNvZGVcbiAqIEBwYXJhbSBsZW5ndGhcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbnZhciBnZXRSYW5kb21Db2RlID0gZnVuY3Rpb24obGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gbGVuZ3RoIHx8IDQ7XG4gICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgd2hpbGUgKGxlbmd0aC0tID4gMCkge1xuXG4gICAgICAgIG91dHB1dCArPSBnZXRSYW5kb21EaWdpdCgpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gcmFuZG9tIDEtOSBkaWdpdFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xudmFyIGdldFJhbmRvbURpZ2l0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5KSArIDEpO1xufTsiXX0=
