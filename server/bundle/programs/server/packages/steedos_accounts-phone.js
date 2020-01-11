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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy1waG9uZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy1waG9uZS9zbXNfc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmFjY291bnRzLXBob25lL3Bob25lX3NlcnZlci5qcyJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJyZXF1aXJlIiwiRnV0dXJlIiwiVHdpbGlvIiwiU01TIiwiU01TVGVzdCIsIm5leHRfZGV2bW9kZV9zbXNfaWQiLCJvdXRwdXRfc3RyZWFtIiwicHJvY2VzcyIsInN0ZG91dCIsIm92ZXJyaWRlT3V0cHV0U3RyZWFtIiwic3RyZWFtIiwicmVzdG9yZU91dHB1dFN0cmVhbSIsImRldk1vZGVTZW5kIiwib3B0aW9ucyIsImRldm1vZGVfc21zX2lkIiwid3JpdGUiLCJmdXR1cmUiLCJmcm9tIiwidG8iLCJib2R5Iiwic2VuZEhvb2tzIiwiaG9va1NlbmQiLCJmIiwicHVzaCIsInNlbmQiLCJpIiwibGVuZ3RoIiwidHdpbGlvIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJzbXMiLCJjbGllbnQiLCJBQ0NPVU5UX1NJRCIsIkFVVEhfVE9LRU4iLCJGUk9NIiwic2VuZFNNU1N5bmMiLCJ3cmFwQXN5bmMiLCJzZW5kTWVzc2FnZSIsInJlc3VsdCIsImVyciIsInJlc3BvbnNlRGF0YSIsIkVycm9yIiwibWVzc2FnZSIsInBob25lVGVtcGxhdGVzIiwidGV4dCIsInVzZXIiLCJjb2RlIiwiQWNjb3VudEdsb2JhbENvbmZpZ3MiLCJ2ZXJpZmljYXRpb25SZXRyaWVzV2FpdFRpbWUiLCJ2ZXJpZmljYXRpb25XYWl0VGltZSIsInZlcmlmaWNhdGlvbkNvZGVMZW5ndGgiLCJ2ZXJpZmljYXRpb25NYXhSZXRyaWVzIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwic2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZU9uQ3JlYXRpb24iLCJfIiwiZGVmYXVsdHMiLCJBY2NvdW50cyIsIl9vcHRpb25zIiwiUGhvbmUiLCJiY3J5cHQiLCJOcG1Nb2R1bGVCY3J5cHQiLCJiY3J5cHRIYXNoIiwiaGFzaCIsImJjcnlwdENvbXBhcmUiLCJjb21wYXJlIiwiZ2V0UGFzc3dvcmRTdHJpbmciLCJwYXNzd29yZCIsIlNIQTI1NiIsImFsZ29yaXRobSIsImRpZ2VzdCIsImhhc2hQYXNzd29yZCIsIl9iY3J5cHRSb3VuZHMiLCJfY2hlY2tQaG9uZVBhc3N3b3JkIiwidXNlcklkIiwiX2lkIiwic2VydmljZXMiLCJwaG9uZSIsImVycm9yIiwiY2hlY2tQYXNzd29yZCIsInNlbGVjdG9yRnJvbVVzZXJRdWVyeSIsImlkIiwiZmluZFVzZXJGcm9tVXNlclF1ZXJ5Iiwic2VsZWN0b3IiLCJ1c2VycyIsImZpbmRPbmUiLCJOb25FbXB0eVN0cmluZyIsIk1hdGNoIiwiV2hlcmUiLCJ4IiwiY2hlY2siLCJTdHJpbmciLCJ1c2VyUXVlcnlWYWxpZGF0b3IiLCJPcHRpb25hbCIsImtleXMiLCJwYXNzd29yZFZhbGlkYXRvciIsIk9uZU9mIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJzcnAiLCJ1bmRlZmluZWQiLCJ2ZXJpZmllciIsIm5ld1ZlcmlmaWVyIiwiU1JQIiwiZ2VuZXJhdGVWZXJpZmllciIsImlkZW50aXR5Iiwic2FsdCIsIkVKU09OIiwic3RyaW5naWZ5IiwiZm9ybWF0IiwidjEiLCJ2MiIsImhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQiLCJzYWx0ZWQiLCJ1cGRhdGUiLCIkdW5zZXQiLCIkc2V0Iiwic2V0UGhvbmVQYXNzd29yZCIsIm5ld1BsYWludGV4dFBhc3N3b3JkIiwic2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZSIsIm51bWJlciIsImxvY2FsZSIsIlN0ZWVkb3MiLCJ3YWl0VGltZUJldHdlZW5SZXRyaWVzIiwibWF4UmV0cnlDb3VudHMiLCJ2ZXJpZnlPYmplY3QiLCJudW1PZlJldHJpZXMiLCJ2ZXJpZnkiLCJjdXJUaW1lIiwiRGF0ZSIsIm5leHRSZXRyeURhdGUiLCJsYXN0UmV0cnkiLCJnZXRUaW1lIiwid2FpdFRpbWVJblNlYyIsIk1hdGgiLCJjZWlsIiwiYWJzIiwiZXJyTXNnIiwiVEFQaTE4biIsIl9fIiwicyIsImdldFJhbmRvbUNvZGUiLCJfZW5zdXJlIiwicGFyYW1zIiwiU01TUXVldWUiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIkpTT04iLCJSZWNOdW0iLCJzdWJzdHJpbmciLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsIm1zZyIsImUiLCJjb25zb2xlIiwibWV0aG9kcyIsInJlcXVlc3RQaG9uZVZlcmlmaWNhdGlvbiIsImNoZWNrVmVyaWZpZWQiLCJub3JtYWxpemVQaG9uZSIsInVzZXJPcHRpb25zIiwiZXhpc3RpbmdVc2VyIiwiZmllbGRzIiwidmFsaWRVc2VyIiwidmVyaWZ5UGhvbmUiLCJtb2JpbGUiLCJuZXdQYXNzd29yZCIsInNlbGYiLCJfbG9naW5NZXRob2QiLCJhcmd1bWVudHMiLCJpc01hc3RlckNvZGUiLCJzZXRPcHRpb25zIiwidW5TZXRPcHRpb25zIiwicmVzZXRUb09sZFRva2VuIiwiaGFzaGVkIiwib2xkVG9rZW4iLCJfZ2V0TG9naW5Ub2tlbiIsImNvbm5lY3Rpb24iLCJfc2V0TG9naW5Ub2tlbiIsInNldFBhc3N3b3JkIiwicXVlcnkiLCIkbmUiLCJhZmZlY3RlZFJlY29yZHMiLCJzdWNjZXNzZnVsVmVyaWZpY2F0aW9uIiwiY3JlYXRlVXNlciIsIk9iamVjdEluY2x1ZGluZyIsInZlcmlmaWVkIiwiaW5zZXJ0VXNlckRvYyIsIm5hbWUiLCJtYXRjaCIsImluZGV4T2YiLCJjcmVhdGVVc2VyV2l0aFBob25lIiwiT2JqZWN0IiwiY2FsbGJhY2siLCJjbG9uZSIsIl9lbnN1cmVJbmRleCIsInVuaXF1ZSIsInNwYXJzZSIsInN0YXJ0dXAiLCJwdWJsaXNoIiwiZmluZCIsInJlYWR5IiwiZGVueSIsImRvYyIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsIm9uUGhvbmVWZXJpZmljYXRpb25Ib29rIiwiSG9vayIsImRlYnVnUHJpbnRFeGNlcHRpb25zIiwib25QaG9uZVZlcmlmaWNhdGlvbiIsImZ1bmMiLCJyZWdpc3RlciIsImVhY2giLCJjbG9uZUF0dGVtcHRXaXRoQ29ubmVjdGlvbiIsImF0dGVtcHQiLCJjbG9uZWRBdHRlbXB0IiwiYWRtaW5QaG9uZU51bWJlcnMiLCJwaG9uZVZlcmlmaWNhdGlvbk1hc3RlckNvZGUiLCJvdXRwdXQiLCJnZXRSYW5kb21EaWdpdCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMsNkJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsV0FBUyxVQURPO0FBRWhCLFlBQVUsVUFGTTtBQUdoQixvQkFBa0I7QUFIRixDQUFELEVBSWIsd0JBSmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNKQSxJQUFJSyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxlQUFELENBQXBCOztBQUNBLElBQUlFLE1BQU0sR0FBR0YsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBRUFHLEdBQUcsR0FBRyxFQUFOO0FBQ0FDLE9BQU8sR0FBRyxFQUFWO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUcsQ0FBMUI7QUFDQSxJQUFJQyxhQUFhLEdBQUdDLE9BQU8sQ0FBQ0MsTUFBNUIsQyxDQUVBOztBQUNBSixPQUFPLENBQUNLLG9CQUFSLEdBQStCLFVBQVVDLE1BQVYsRUFBa0I7QUFDN0NMLHFCQUFtQixHQUFHLENBQXRCO0FBQ0FDLGVBQWEs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QUFiLENBQVA7QUFDSCxDQU5EO0FBUUE7Ozs7Ozs7QUFLQSxJQUFJNEYsWUFBWSxHQUFHLFVBQVMxSCxJQUFULEVBQWU7QUFDOUIsU0FBT0EsSUFBSSxJQUFJVSxRQUFRLENBQUNDLFFBQVQsQ0FBa0I4SiwyQkFBMUIsSUFDSHpLLElBQUksSUFBSVUsUUFBUSxDQUFDQyxRQUFULENBQWtCOEosMkJBRDlCO0FBRUgsQ0FIRDtBQUtBOzs7Ozs7O0FBS0EsSUFBSTVFLGFBQWEsR0FBRyxVQUFTakgsTUFBVCxFQUFpQjtBQUNqQ0EsUUFBTSxHQUFHQSxNQUFNLElBQUksQ0FBbkI7QUFDQSxNQUFJOEwsTUFBTSxHQUFHLEVBQWI7O0FBQ0EsU0FBTzlMLE1BQU0sS0FBSyxDQUFsQixFQUFxQjtBQUVqQjhMLFVBQU0sSUFBSUMsY0FBYyxFQUF4QjtBQUNIOztBQUNELFNBQU9ELE1BQVA7QUFDSCxDQVJEO0FBVUE7Ozs7OztBQUlBLElBQUlDLGNBQWMsR0FBRyxZQUFXO0FBQzVCLFNBQU9yRixJQUFJLENBQUNzRixLQUFMLENBQVl0RixJQUFJLENBQUN1RixNQUFMLEtBQWdCLENBQWpCLEdBQXNCLENBQWpDLENBQVA7QUFDSCxDQUZELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMtcGhvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmaXggd2FybmluZzogeHh4IG5vdCBpbnN0YWxsZWRcclxucmVxdWlyZShcInN0cmVhbS1idWZmZXJzL3BhY2thZ2UuanNvblwiKTtcclxuXHJcbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJwaG9uZVwiOiBcIj49MS4wLjEyXCIsXHJcblx0XCJ0d2lsaW9cIjogXCI+PTEuMTAuMFwiLFxyXG5cdFwic3RyZWFtLWJ1ZmZlcnNcIjogXCI+PTAuMi41XCJcclxufSwgJ3N0ZWVkb3M6YWNjb3VudHMtcGhvbmUnKTsiLCJ2YXIgRnV0dXJlID0gcmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xyXG52YXIgVHdpbGlvID0gcmVxdWlyZSgndHdpbGlvJyk7XHJcblxyXG5TTVMgPSB7fTtcclxuU01TVGVzdCA9IHt9O1xyXG5cclxudmFyIG5leHRfZGV2bW9kZV9zbXNfaWQgPSAwO1xyXG52YXIgb3V0cHV0X3N0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0O1xyXG5cclxuLy8gVGVzdGluZyBob29rc1xyXG5TTVNUZXN0Lm92ZXJyaWRlT3V0cHV0U3RyZWFtID0gZnVuY3Rpb24gKHN0cmVhbSkge1xyXG4gICAgbmV4dF9kZXZtb2RlX3Ntc19pZCA9IDA7XHJcbiAgICBvdXRwdXRfc3RyZWFtID0gc3RyZWFtO1xyXG59O1xyXG5cclxuU01TVGVzdC5yZXN0b3JlT3V0cHV0U3RyZWFtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgb3V0cHV0X3N0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0O1xyXG59O1xyXG5cclxudmFyIGRldk1vZGVTZW5kID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHZhciBkZXZtb2RlX3Ntc19pZCA9IG5leHRfZGV2bW9kZV9zbXNfaWQrKztcclxuXHJcbiAgICB2YXIgc3RyZWFtID0gb3V0cHV0X3N0cmVhbTtcclxuXHJcbiAgICAvLyBUaGlzIGFwcHJvYWNoIGRvZXMgbm90IHByZXZlbnQgb3RoZXIgd3JpdGVycyB0byBzdGRvdXQgZnJvbSBpbnRlcmxlYXZpbmcuXHJcbiAgICBzdHJlYW0ud3JpdGUoXCI9PT09PT0gQkVHSU4gU01TICNcIiArIGRldm1vZGVfc21zX2lkICsgXCIgPT09PT09XFxuXCIpO1xyXG4gICAgc3RyZWFtLndyaXRlKFwiKFNNUyBub3Qgc2VudDsgdG8gZW5hYmxlIHNlbmRpbmcsIHNldCB0aGUgVFdJTElPX0NSRURFTlRJQUxTIFwiICtcclxuICAgICAgICBcImVudmlyb25tZW50IHZhcmlhYmxlLilcXG5cIik7XHJcbiAgICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZTtcclxuICAgIHN0cmVhbS53cml0ZShcIkZyb206XCIgKyBvcHRpb25zLmZyb20gKyBcIlxcblwiKTtcclxuICAgIHN0cmVhbS53cml0ZShcIlRvOlwiICsgb3B0aW9ucy50byArIFwiXFxuXCIpO1xyXG4gICAgc3RyZWFtLndyaXRlKFwiVGV4dDpcIiArIG9wdGlvbnMuYm9keSArIFwiXFxuXCIpO1xyXG4gICAgc3RyZWFtLndyaXRlKFwiPT09PT09IEVORCBTTVMgI1wiICsgZGV2bW9kZV9zbXNfaWQgKyBcIiA9PT09PT1cXG5cIik7XHJcbiAgICBmdXR1cmVbJ3JldHVybiddKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTW9jayBvdXQgc21zIHNlbmRpbmcgKGVnLCBkdXJpbmcgYSB0ZXN0LikgVGhpcyBpcyBwcml2YXRlIGZvciBub3cuXHJcbiAqXHJcbiAqIGYgcmVjZWl2ZXMgdGhlIGFyZ3VtZW50cyB0byBTTVMuc2VuZCBhbmQgc2hvdWxkIHJldHVybiB0cnVlIHRvIGdvXHJcbiAqIGFoZWFkIGFuZCBzZW5kIHRoZSBlbWFpbCAob3IgYXQgbGVhc3QsIHRyeSBzdWJzZXF1ZW50IGhvb2tzKSwgb3JcclxuICogZmFsc2UgdG8gc2tpcCBzZW5kaW5nLlxyXG4gKi9cclxudmFyIHNlbmRIb29rcyA9IFtdO1xyXG5TTVNUZXN0Lmhvb2tTZW5kID0gZnVuY3Rpb24gKGYpIHtcclxuICAgIHNlbmRIb29rcy5wdXNoKGYpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbmQgYW4gc21zLlxyXG4gKlxyXG4gKiBDb25uZWN0cyB0byB0d2lsaW8gdmlhIHRoZSBDT05GSUdfVkFSUyBlbnZpcm9ubWVudFxyXG4gKiB2YXJpYWJsZS4gSWYgdW5zZXQsIHByaW50cyBmb3JtYXR0ZWQgbWVzc2FnZSB0byBzdGRvdXQuIFRoZSBcImZyb21cIiBvcHRpb25cclxuICogaXMgcmVxdWlyZWQsIGFuZCBhdCBsZWFzdCBvbmUgb2YgXCJ0b1wiLCBcImZyb21cIiwgYW5kIFwiYm9keVwiIG11c3QgYmUgcHJvdmlkZWQ7XHJcbiAqIGFsbCBvdGhlciBvcHRpb25zIGFyZSBvcHRpb25hbC5cclxuICpcclxuICogQHBhcmFtIG9wdGlvbnNcclxuICogQHBhcmFtIG9wdGlvbnMuZnJvbSB7U3RyaW5nfSAtIFRoZSBzZW5kaW5nIFNNUyBudW1iZXJcclxuICogQHBhcmFtIG9wdGlvbnMudG8ge1N0cmluZ30gLSBUaGUgcmVjZWl2ZXIgU01TIG51bWJlclxyXG4gKiBAcGFyYW0gb3B0aW9ucy5ib2R5IHtTdHJpbmd9ICAtIFRoZSBjb250ZW50IG9mIHRoZSBTTVNcclxuICovXHJcblNNUy5zZW5kID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VuZEhvb2tzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGlmICghc2VuZEhvb2tzW2ldKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgdHdpbGlvID0gTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5zbXMgJiYgTWV0ZW9yLnNldHRpbmdzLnNtcy50d2lsaW87XHJcbiAgICBpZiAodHdpbGlvKSB7XHJcbiAgICAgICAgdmFyIGNsaWVudCA9IFR3aWxpbyh0d2lsaW8uQUNDT1VOVF9TSUQsIHR3aWxpby5BVVRIX1RPS0VOKTtcclxuICAgICAgICAvLyBJbmNsdWRlIEZST00gaW4gb3B0aW9ucyBpZiBpdCBpcyBkZWZpbmVkLiBcclxuICAgICAgICB0d2lsaW8uRlJPTSAmJiAob3B0aW9ucy5mcm9tID0gdHdpbGlvLkZST00pO1xyXG4gICAgICAgIC8vIFNlbmQgU01TICBBUEkgYXN5bmMgZnVuY1xyXG4gICAgICAgIHZhciBzZW5kU01TU3luYyA9IE1ldGVvci53cmFwQXN5bmMoY2xpZW50LnNlbmRNZXNzYWdlLCBjbGllbnQpO1xyXG4gICAgICAgIC8vIGNhbGwgdGhlIHN5bmMgdmVyc2lvbiBvZiBvdXIgQVBJIGZ1bmMgd2l0aCB0aGUgcGFyYW1ldGVycyBmcm9tIHRoZSBtZXRob2QgY2FsbFxyXG4gICAgICAgIHZhciByZXN1bHQgPSBzZW5kU01TU3luYyhvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZURhdGEpIHsgLy90aGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIHdoZW4gYSByZXNwb25zZSBpcyByZWNlaXZlZCBmcm9tIFR3aWxpb1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7IC8vIFwiZXJyXCIgaXMgYW4gZXJyb3IgcmVjZWl2ZWQgZHVyaW5nIHRoZSByZXF1ZXN0LCBpZiBhbnlcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJFcnJvciBzZW5kaW5nIFNNUyBcIiwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZURhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRldk1vZGVTZW5kKG9wdGlvbnMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuU01TLnBob25lVGVtcGxhdGVzID0ge1xyXG4gICAgZnJvbTogJys5NzI1NDU5OTk5OTknLFxyXG4gICAgdGV4dDogZnVuY3Rpb24gKHVzZXIsIGNvZGUpIHtcclxuICAgICAgICByZXR1cm4gJ+OAkFN0ZWVkb3PjgJEgJyArIGNvZGUgKyAnIGlzIHlvdXIgU3RlZWRvcyB2ZXJpZmljYXRpb24gY29kZS4nO1xyXG4gICAgfVxyXG59O1xyXG5cclxuIiwiLy8vIERlZmF1bHQgQWNjb3VudHMgQ29uZmlnIHZhcnNcclxuXHJcbnZhciBBY2NvdW50R2xvYmFsQ29uZmlncyA9IHtcclxuICAgIHZlcmlmaWNhdGlvblJldHJpZXNXYWl0VGltZTogMTAgKiA2MCAqIDEwMDAsXHJcbiAgICB2ZXJpZmljYXRpb25XYWl0VGltZTogMzAgKiAxMDAwLFxyXG4gICAgdmVyaWZpY2F0aW9uQ29kZUxlbmd0aDogNCxcclxuICAgIHZlcmlmaWNhdGlvbk1heFJldHJpZXM6IDIsXHJcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IGZhbHNlLFxyXG4gICAgc2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZU9uQ3JlYXRpb246IHRydWVcclxufTtcclxuXHJcbl8uZGVmYXVsdHMoQWNjb3VudHMuX29wdGlvbnMsIEFjY291bnRHbG9iYWxDb25maWdzKTtcclxuXHJcblxyXG4vLy8gUGhvbmVcclxuXHJcbnZhciBQaG9uZSA9IHJlcXVpcmUoJ3Bob25lJyk7XHJcblxyXG4vLy8gQkNSWVBUXHJcblxyXG52YXIgYmNyeXB0ID0gTnBtTW9kdWxlQmNyeXB0O1xyXG52YXIgYmNyeXB0SGFzaCA9IE1ldGVvci53cmFwQXN5bmMoYmNyeXB0Lmhhc2gpO1xyXG52YXIgYmNyeXB0Q29tcGFyZSA9IE1ldGVvci53cmFwQXN5bmMoYmNyeXB0LmNvbXBhcmUpO1xyXG5cclxuLy8gVXNlciByZWNvcmRzIGhhdmUgYSAnc2VydmljZXMucGhvbmUuYmNyeXB0JyBmaWVsZCBvbiB0aGVtIHRvIGhvbGRcclxuLy8gdGhlaXIgaGFzaGVkIHBhc3N3b3JkcyAodW5sZXNzIHRoZXkgaGF2ZSBhICdzZXJ2aWNlcy5waG9uZS5zcnAnXHJcbi8vIGZpZWxkLCBpbiB3aGljaCBjYXNlIHRoZXkgd2lsbCBiZSB1cGdyYWRlZCB0byBiY3J5cHQgdGhlIG5leHQgdGltZVxyXG4vLyB0aGV5IGxvZyBpbikuXHJcbi8vXHJcbi8vIFdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIHBhc3N3b3JkIHRvIHRoZSBzZXJ2ZXIsIGl0IGNhbiBlaXRoZXIgYmUgYVxyXG4vLyBzdHJpbmcgKHRoZSBwbGFpbnRleHQgcGFzc3dvcmQpIG9yIGFuIG9iamVjdCB3aXRoIGtleXMgJ2RpZ2VzdCcgYW5kXHJcbi8vICdhbGdvcml0aG0nIChtdXN0IGJlIFwic2hhLTI1NlwiIGZvciBub3cpLiBUaGUgTWV0ZW9yIGNsaWVudCBhbHdheXMgc2VuZHNcclxuLy8gcGFzc3dvcmQgb2JqZWN0cyB7IGRpZ2VzdDogKiwgYWxnb3JpdGhtOiBcInNoYS0yNTZcIiB9LCBidXQgRERQIGNsaWVudHNcclxuLy8gdGhhdCBkb24ndCBoYXZlIGFjY2VzcyB0byBTSEEgY2FuIGp1c3Qgc2VuZCBwbGFpbnRleHQgcGFzc3dvcmRzIGFzXHJcbi8vIHN0cmluZ3MuXHJcbi8vXHJcbi8vIFdoZW4gdGhlIHNlcnZlciByZWNlaXZlcyBhIHBsYWludGV4dCBwYXNzd29yZCBhcyBhIHN0cmluZywgaXQgYWx3YXlzXHJcbi8vIGhhc2hlcyBpdCB3aXRoIFNIQTI1NiBiZWZvcmUgcGFzc2luZyBpdCBpbnRvIGJjcnlwdC4gV2hlbiB0aGUgc2VydmVyXHJcbi8vIHJlY2VpdmVzIGEgcGFzc3dvcmQgYXMgYW4gb2JqZWN0LCBpdCBhc3NlcnRzIHRoYXQgdGhlIGFsZ29yaXRobSBpc1xyXG4vLyBcInNoYS0yNTZcIiBhbmQgdGhlbiBwYXNzZXMgdGhlIGRpZ2VzdCB0byBiY3J5cHQuXHJcblxyXG4vLyBHaXZlbiBhICdwYXNzd29yZCcgZnJvbSB0aGUgY2xpZW50LCBleHRyYWN0IHRoZSBzdHJpbmcgdGhhdCB3ZSBzaG91bGRcclxuLy8gYmNyeXB0LiAncGFzc3dvcmQnIGNhbiBiZSBvbmUgb2Y6XHJcbi8vICAtIFN0cmluZyAodGhlIHBsYWludGV4dCBwYXNzd29yZClcclxuLy8gIC0gT2JqZWN0IHdpdGggJ2RpZ2VzdCcgYW5kICdhbGdvcml0aG0nIGtleXMuICdhbGdvcml0aG0nIG11c3QgYmUgXCJzaGEtMjU2XCIuXHJcbi8vXHJcbnZhciBnZXRQYXNzd29yZFN0cmluZyA9IGZ1bmN0aW9uKHBhc3N3b3JkKSB7XHJcbiAgICBpZiAodHlwZW9mIHBhc3N3b3JkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgcGFzc3dvcmQgPSBTSEEyNTYocGFzc3dvcmQpO1xyXG4gICAgfSBlbHNlIHsgLy8gJ3Bhc3N3b3JkJyBpcyBhbiBvYmplY3RcclxuICAgICAgICBpZiAocGFzc3dvcmQuYWxnb3JpdGhtICE9PSBcInNoYS0yNTZcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbnZhbGlkIHBhc3N3b3JkIGhhc2ggYWxnb3JpdGhtLiBcIiArXHJcbiAgICAgICAgICAgICAgICBcIk9ubHkgJ3NoYS0yNTYnIGlzIGFsbG93ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXNzd29yZCA9IHBhc3N3b3JkLmRpZ2VzdDtcclxuICAgIH1cclxuICAgIHJldHVybiBwYXNzd29yZDtcclxufTtcclxuXHJcbi8vIFVzZSBiY3J5cHQgdG8gaGFzaCB0aGUgcGFzc3dvcmQgZm9yIHN0b3JhZ2UgaW4gdGhlIGRhdGFiYXNlLlxyXG4vLyBgcGFzc3dvcmRgIGNhbiBiZSBhIHN0cmluZyAoaW4gd2hpY2ggY2FzZSBpdCB3aWxsIGJlIHJ1biB0aHJvdWdoXHJcbi8vIFNIQTI1NiBiZWZvcmUgYmNyeXB0KSBvciBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGBkaWdlc3RgIGFuZFxyXG4vLyBgYWxnb3JpdGhtYCAoaW4gd2hpY2ggY2FzZSB3ZSBiY3J5cHQgYHBhc3N3b3JkLmRpZ2VzdGApLlxyXG4vL1xyXG52YXIgaGFzaFBhc3N3b3JkID0gZnVuY3Rpb24ocGFzc3dvcmQpIHtcclxuICAgIHBhc3N3b3JkID0gZ2V0UGFzc3dvcmRTdHJpbmcocGFzc3dvcmQpO1xyXG4gICAgcmV0dXJuIGJjcnlwdEhhc2gocGFzc3dvcmQsIEFjY291bnRzLl9iY3J5cHRSb3VuZHMpO1xyXG59O1xyXG5cclxuLy8gQ2hlY2sgd2hldGhlciB0aGUgcHJvdmlkZWQgcGFzc3dvcmQgbWF0Y2hlcyB0aGUgYmNyeXB0J2VkIHBhc3N3b3JkIGluXHJcbi8vIHRoZSBkYXRhYmFzZSB1c2VyIHJlY29yZC4gYHBhc3N3b3JkYCBjYW4gYmUgYSBzdHJpbmcgKGluIHdoaWNoIGNhc2VcclxuLy8gaXQgd2lsbCBiZSBydW4gdGhyb3VnaCBTSEEyNTYgYmVmb3JlIGJjcnlwdCkgb3IgYW4gb2JqZWN0IHdpdGhcclxuLy8gcHJvcGVydGllcyBgZGlnZXN0YCBhbmQgYGFsZ29yaXRobWAgKGluIHdoaWNoIGNhc2Ugd2UgYmNyeXB0XHJcbi8vIGBwYXNzd29yZC5kaWdlc3RgKS5cclxuLy9cclxuQWNjb3VudHMuX2NoZWNrUGhvbmVQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIHVzZXJJZDogdXNlci5faWRcclxuICAgIH07XHJcblxyXG4gICAgcGFzc3dvcmQgPSBnZXRQYXNzd29yZFN0cmluZyhwYXNzd29yZCk7XHJcblxyXG4gICAgaWYgKCFiY3J5cHRDb21wYXJlKHBhc3N3b3JkLCB1c2VyLnNlcnZpY2VzLnBob25lLmJjcnlwdCkpIHtcclxuICAgICAgICByZXN1bHQuZXJyb3IgPSBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbmNvcnJlY3QgcGFzc3dvcmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxudmFyIGNoZWNrUGFzc3dvcmQgPSBBY2NvdW50cy5fY2hlY2tQaG9uZVBhc3N3b3JkO1xyXG5cclxuLy8vXHJcbi8vLyBMT0dJTlxyXG4vLy9cclxuXHJcbi8vIFVzZXJzIGNhbiBzcGVjaWZ5IHZhcmlvdXMga2V5cyB0byBpZGVudGlmeSB0aGVtc2VsdmVzIHdpdGguXHJcbi8vIEBwYXJhbSB1c2VyIHtPYmplY3R9IHdpdGggYGlkYCBvciBgcGhvbmVgLlxyXG4vLyBAcmV0dXJucyBBIHNlbGVjdG9yIHRvIHBhc3MgdG8gbW9uZ28gdG8gZ2V0IHRoZSB1c2VyIHJlY29yZC5cclxuXHJcbnZhciBzZWxlY3RvckZyb21Vc2VyUXVlcnkgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICBpZiAodXNlci5pZClcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBfaWQ6IHVzZXIuaWRcclxuICAgICAgICB9O1xyXG4gICAgZWxzZSBpZiAodXNlci5waG9uZSlcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAncGhvbmUubnVtYmVyJzogdXNlci5waG9uZVxyXG4gICAgICAgIH07XHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJzaG91bGRuJ3QgaGFwcGVuICh2YWxpZGF0aW9uIG1pc3NlZCBzb21ldGhpbmcpXCIpO1xyXG59O1xyXG5cclxudmFyIGZpbmRVc2VyRnJvbVVzZXJRdWVyeSA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgIHZhciBzZWxlY3RvciA9IHNlbGVjdG9yRnJvbVVzZXJRdWVyeSh1c2VyKTtcclxuXHJcbiAgICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHNlbGVjdG9yKTtcclxuICAgIGlmICghdXNlcilcclxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJVc2VyIG5vdCBmb3VuZFwiKTtcclxuXHJcbiAgICByZXR1cm4gdXNlcjtcclxufTtcclxuXHJcbi8vIFhYWCBtYXliZSB0aGlzIGJlbG9uZ3MgaW4gdGhlIGNoZWNrIHBhY2thZ2VcclxudmFyIE5vbkVtcHR5U3RyaW5nID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24oeCkge1xyXG4gICAgY2hlY2soeCwgU3RyaW5nKTtcclxuICAgIHJldHVybiB4Lmxlbmd0aCA+IDA7XHJcbn0pO1xyXG5cclxudmFyIHVzZXJRdWVyeVZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgIGNoZWNrKHVzZXIsIHtcclxuICAgICAgICBpZDogTWF0Y2guT3B0aW9uYWwoTm9uRW1wdHlTdHJpbmcpLFxyXG4gICAgICAgIHBob25lOiBNYXRjaC5PcHRpb25hbChOb25FbXB0eVN0cmluZylcclxuICAgIH0pO1xyXG4gICAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggIT09IDEpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKFwiVXNlciBwcm9wZXJ0eSBtdXN0IGhhdmUgZXhhY3RseSBvbmUgZmllbGRcIik7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufSk7XHJcblxyXG52YXIgcGFzc3dvcmRWYWxpZGF0b3IgPSBNYXRjaC5PbmVPZihcclxuICAgIFN0cmluZywge1xyXG4gICAgICAgIGRpZ2VzdDogU3RyaW5nLFxyXG4gICAgICAgIGFsZ29yaXRobTogU3RyaW5nXHJcbiAgICB9XHJcbik7XHJcblxyXG4vLyBIYW5kbGVyIHRvIGxvZ2luIHdpdGggYSBwaG9uZS5cclxuLy9cclxuLy8gVGhlIE1ldGVvciBjbGllbnQgc2V0cyBvcHRpb25zLnBhc3N3b3JkIHRvIGFuIG9iamVjdCB3aXRoIGtleXNcclxuLy8gJ2RpZ2VzdCcgKHNldCB0byBTSEEyNTYocGFzc3dvcmQpKSBhbmQgJ2FsZ29yaXRobScgKFwic2hhLTI1NlwiKS5cclxuLy9cclxuLy8gRm9yIG90aGVyIEREUCBjbGllbnRzIHdoaWNoIGRvbid0IGhhdmUgYWNjZXNzIHRvIFNIQSwgdGhlIGhhbmRsZXJcclxuLy8gYWxzbyBhY2NlcHRzIHRoZSBwbGFpbnRleHQgcGFzc3dvcmQgaW4gb3B0aW9ucy5wYXNzd29yZCBhcyBhIHN0cmluZy5cclxuLy9cclxuLy8gKEl0IG1pZ2h0IGJlIG5pY2UgaWYgc2VydmVycyBjb3VsZCB0dXJuIHRoZSBwbGFpbnRleHQgcGFzc3dvcmRcclxuLy8gb3B0aW9uIG9mZi4gT3IgbWF5YmUgaXQgc2hvdWxkIGJlIG9wdC1pbiwgbm90IG9wdC1vdXQ/XHJcbi8vIEFjY291bnRzLmNvbmZpZyBvcHRpb24/KVxyXG4vL1xyXG4vLyBOb3RlIHRoYXQgbmVpdGhlciBwYXNzd29yZCBvcHRpb24gaXMgc2VjdXJlIHdpdGhvdXQgU1NMLlxyXG4vL1xyXG5BY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInBob25lXCIsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIGlmICghb3B0aW9ucy5wYXNzd29yZCB8fCBvcHRpb25zLnNycClcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBkb24ndCBoYW5kbGVcclxuXHJcbiAgICBjaGVjayhvcHRpb25zLCB7XHJcbiAgICAgICAgdXNlcjogdXNlclF1ZXJ5VmFsaWRhdG9yLFxyXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFZhbGlkYXRvclxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHVzZXIgPSBmaW5kVXNlckZyb21Vc2VyUXVlcnkob3B0aW9ucy51c2VyKTtcclxuXHJcbiAgICBpZiAoIXVzZXIuc2VydmljZXMgfHwgIXVzZXIuc2VydmljZXMucGhvbmUgfHwgISh1c2VyLnNlcnZpY2VzLnBob25lLmJjcnlwdCB8fCB1c2VyLnNlcnZpY2VzLnBob25lLnNycCkpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBoYXMgbm8gcGFzc3dvcmQgc2V0XCIpO1xyXG5cclxuICAgIGlmICghdXNlci5zZXJ2aWNlcy5waG9uZS5iY3J5cHQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMucGFzc3dvcmQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgLy8gVGhlIGNsaWVudCBoYXMgcHJlc2VudGVkIGEgcGxhaW50ZXh0IHBhc3N3b3JkLCBhbmQgdGhlIHVzZXIgaXNcclxuICAgICAgICAgICAgLy8gbm90IHVwZ3JhZGVkIHRvIGJjcnlwdCB5ZXQuIFdlIGRvbid0IGF0dGVtcHQgdG8gdGVsbCB0aGUgY2xpZW50XHJcbiAgICAgICAgICAgIC8vIHRvIHVwZ3JhZGUgdG8gYmNyeXB0LCBiZWNhdXNlIGl0IG1pZ2h0IGJlIGEgc3RhbmRhbG9uZSBERFBcclxuICAgICAgICAgICAgLy8gY2xpZW50IGRvZXNuJ3Qga25vdyBob3cgdG8gZG8gc3VjaCBhIHRoaW5nLlxyXG4gICAgICAgICAgICB2YXIgdmVyaWZpZXIgPSB1c2VyLnNlcnZpY2VzLnBob25lLnNycDtcclxuICAgICAgICAgICAgdmFyIG5ld1ZlcmlmaWVyID0gU1JQLmdlbmVyYXRlVmVyaWZpZXIob3B0aW9ucy5wYXNzd29yZCwge1xyXG4gICAgICAgICAgICAgICAgaWRlbnRpdHk6IHZlcmlmaWVyLmlkZW50aXR5LFxyXG4gICAgICAgICAgICAgICAgc2FsdDogdmVyaWZpZXIuc2FsdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2ZXJpZmllci52ZXJpZmllciAhPT0gbmV3VmVyaWZpZXIudmVyaWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLl9pZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRlbGwgdGhlIGNsaWVudCB0byB1c2UgdGhlIFNSUCB1cGdyYWRlIHByb2Nlc3MuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIm9sZCBwYXNzd29yZCBmb3JtYXRcIiwgRUpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGZvcm1hdDogJ3NycCcsXHJcbiAgICAgICAgICAgICAgICBpZGVudGl0eTogdXNlci5zZXJ2aWNlcy5waG9uZS5zcnAuaWRlbnRpdHlcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hlY2tQYXNzd29yZChcclxuICAgICAgICB1c2VyLFxyXG4gICAgICAgIG9wdGlvbnMucGFzc3dvcmRcclxuICAgICk7XHJcbn0pO1xyXG5cclxuLy8gSGFuZGxlciB0byBsb2dpbiB1c2luZyB0aGUgU1JQIHVwZ3JhZGUgcGF0aC4gVG8gdXNlIHRoaXMgbG9naW5cclxuLy8gaGFuZGxlciwgdGhlIGNsaWVudCBtdXN0IHByb3ZpZGU6XHJcbi8vICAgLSBzcnA6IEgoaWRlbnRpdHkgKyBcIjpcIiArIHBhc3N3b3JkKVxyXG4vLyAgIC0gcGFzc3dvcmQ6IGEgc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgJ2RpZ2VzdCcgYW5kICdhbGdvcml0aG0nXHJcbi8vXHJcbi8vIFdlIHVzZSBgb3B0aW9ucy5zcnBgIHRvIHZlcmlmeSB0aGF0IHRoZSBjbGllbnQga25vd3MgdGhlIGNvcnJlY3RcclxuLy8gcGFzc3dvcmQgd2l0aG91dCBkb2luZyBhIGZ1bGwgU1JQIGZsb3cuIE9uY2Ugd2UndmUgY2hlY2tlZCB0aGF0LCB3ZVxyXG4vLyB1cGdyYWRlIHRoZSB1c2VyIHRvIGJjcnlwdCBhbmQgcmVtb3ZlIHRoZSBTUlAgaW5mb3JtYXRpb24gZnJvbSB0aGVcclxuLy8gdXNlciBkb2N1bWVudC5cclxuLy9cclxuLy8gVGhlIGNsaWVudCBlbmRzIHVwIHVzaW5nIHRoaXMgbG9naW4gaGFuZGxlciBhZnRlciB0cnlpbmcgdGhlIG5vcm1hbFxyXG4vLyBsb2dpbiBoYW5kbGVyIChhYm92ZSksIHdoaWNoIHRocm93cyBhbiBlcnJvciB0ZWxsaW5nIHRoZSBjbGllbnQgdG9cclxuLy8gdHJ5IHRoZSBTUlAgdXBncmFkZSBwYXRoLlxyXG4vL1xyXG4vLyBYWFggQ09NUEFUIFdJVEggMC44LjEuM1xyXG5BY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInBob25lXCIsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIGlmICghb3B0aW9ucy5zcnAgfHwgIW9wdGlvbnMucGFzc3dvcmQpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZG9uJ3QgaGFuZGxlXHJcblxyXG4gICAgY2hlY2sob3B0aW9ucywge1xyXG4gICAgICAgIHVzZXI6IHVzZXJRdWVyeVZhbGlkYXRvcixcclxuICAgICAgICBzcnA6IFN0cmluZyxcclxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRWYWxpZGF0b3JcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciB1c2VyID0gZmluZFVzZXJGcm9tVXNlclF1ZXJ5KG9wdGlvbnMudXNlcik7XHJcblxyXG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGFub3RoZXIgc2ltdWx0YW5lb3VzIGxvZ2luIGhhcyBhbHJlYWR5IHVwZ3JhZGVkXHJcbiAgICAvLyB0aGUgdXNlciByZWNvcmQgdG8gYmNyeXB0LlxyXG4gICAgaWYgKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5waG9uZSAmJlxyXG4gICAgICAgIHVzZXIuc2VydmljZXMucGhvbmUuYmNyeXB0KVxyXG4gICAgICAgIHJldHVybiBjaGVja1Bhc3N3b3JkKHVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xyXG5cclxuICAgIGlmICghKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5waG9uZSAmJiB1c2VyLnNlcnZpY2VzLnBob25lLnNycCkpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBoYXMgbm8gcGFzc3dvcmQgc2V0XCIpO1xyXG5cclxuICAgIHZhciB2MSA9IHVzZXIuc2VydmljZXMucGhvbmUuc3JwLnZlcmlmaWVyO1xyXG4gICAgdmFyIHYyID0gU1JQLmdlbmVyYXRlVmVyaWZpZXIoXHJcbiAgICAgICAgbnVsbCwge1xyXG4gICAgICAgICAgICBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkOiBvcHRpb25zLnNycCxcclxuICAgICAgICAgICAgc2FsdDogdXNlci5zZXJ2aWNlcy5waG9uZS5zcnAuc2FsdFxyXG4gICAgICAgIH1cclxuICAgICkudmVyaWZpZXI7XHJcbiAgICBpZiAodjEgIT09IHYyKVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXHJcbiAgICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbmNvcnJlY3QgcGFzc3dvcmRcIilcclxuICAgICAgICB9O1xyXG5cclxuICAgIC8vIFVwZ3JhZGUgdG8gYmNyeXB0IG9uIHN1Y2Nlc3NmdWwgbG9naW4uXHJcbiAgICB2YXIgc2FsdGVkID0gaGFzaFBhc3N3b3JkKG9wdGlvbnMucGFzc3dvcmQpO1xyXG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShcclxuICAgICAgICB1c2VyLl9pZCwge1xyXG4gICAgICAgICAgICAkdW5zZXQ6IHtcclxuICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS5zcnAnOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS5iY3J5cHQnOiBzYWx0ZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1c2VySWQ6IHVzZXIuX2lkXHJcbiAgICB9O1xyXG59KTtcclxuXHJcbi8vIEZvcmNlIGNoYW5nZSB0aGUgdXNlcnMgcGhvbmUgcGFzc3dvcmQuXHJcblxyXG4vKipcclxuICogQHN1bW1hcnkgRm9yY2libHkgY2hhbmdlIHRoZSBwYXNzd29yZCBmb3IgYSB1c2VyLlxyXG4gKiBAbG9jdXMgU2VydmVyXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZS5cclxuICogQHBhcmFtIHtTdHJpbmd9IG5ld1Bhc3N3b3JkIEEgbmV3IHBhc3N3b3JkIGZvciB0aGUgdXNlci5cclxuICovXHJcbkFjY291bnRzLnNldFBob25lUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VySWQsIG5ld1BsYWludGV4dFBhc3N3b3JkKSB7XHJcbiAgICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJJZCk7XHJcbiAgICBpZiAoIXVzZXIpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBub3QgZm91bmRcIik7XHJcblxyXG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7XHJcbiAgICAgICAgX2lkOiB1c2VyLl9pZFxyXG4gICAgfSwge1xyXG4gICAgICAgICR1bnNldDoge1xyXG4gICAgICAgICAgICAnc2VydmljZXMucGhvbmUuc3JwJzogMSwgLy8gWFhYIENPTVBBVCBXSVRIIDAuOC4xLjNcclxuICAgICAgICAgICAgJ3NlcnZpY2VzLnBob25lLnZlcmlmeSc6IDEsXHJcbiAgICAgICAgICAgICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMnOiAxXHJcbiAgICAgICAgfSxcclxuICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS5iY3J5cHQnOiBoYXNoUGFzc3dvcmQobmV3UGxhaW50ZXh0UGFzc3dvcmQpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vLy9cclxuLy8vIFNlbmQgcGhvbmUgVkVSSUZJQ0FUSU9OIGNvZGVcclxuLy8vXHJcblxyXG4vLyBzZW5kIHRoZSB1c2VyIGEgc21zIHdpdGggYSBjb2RlIHRoYXQgY2FuIGJlIHVzZWQgdG8gdmVyaWZ5IG51bWJlclxyXG5cclxuLyoqXHJcbiAqIEBzdW1tYXJ5IFNlbmQgYW4gU01TIHdpdGggYSBjb2RlIHRoZSB1c2VyIGNhbiB1c2UgdmVyaWZ5IHRoZWlyIHBob25lIG51bWJlciB3aXRoLlxyXG4gKiBAbG9jdXMgU2VydmVyXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyIHRvIHNlbmQgZW1haWwgdG8uXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbcGhvbmVdIE9wdGlvbmFsLiBXaGljaCBwaG9uZSBvZiB0aGUgdXNlcidzIHRvIHNlbmQgdGhlIFNNUyB0by4gVGhpcyBwaG9uZSBtdXN0IGJlIGluIHRoZSB1c2VyJ3MgYHBob25lc2AgbGlzdC4gRGVmYXVsdHMgdG8gdGhlIGZpcnN0IHVudmVyaWZpZWQgcGhvbmUgaW4gdGhlIGxpc3QuXHJcbiAqL1xyXG5BY2NvdW50cy5zZW5kUGhvbmVWZXJpZmljYXRpb25Db2RlID0gZnVuY3Rpb24odXNlcklkLCBwaG9uZSkge1xyXG4gICAgLy8gWFhYIEFsc28gZ2VuZXJhdGUgYSBsaW5rIHVzaW5nIHdoaWNoIHNvbWVvbmUgY2FuIGRlbGV0ZSB0aGlzXHJcbiAgICAvLyBhY2NvdW50IGlmIHRoZXkgb3duIHNhaWQgbnVtYmVyIGJ1dCB3ZXJlbid0IHRob3NlIHdobyBjcmVhdGVkXHJcbiAgICAvLyB0aGlzIGFjY291bnQuXHJcblxyXG4gICAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGV4aXN0cywgYW5kIHBob25lIGlzIG9uZSBvZiB0aGVpciBwaG9uZXMuXHJcbiAgICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJJZCk7XHJcbiAgICBpZiAoIXVzZXIpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQ2FuJ3QgZmluZCB1c2VyXCIpO1xyXG4gICAgLy8gcGljayB0aGUgZmlyc3QgdW52ZXJpZmllZCBwaG9uZSBpZiB3ZSB3ZXJlbid0IHBhc3NlZCBhbiBwaG9uZS5cclxuICAgIGlmICghcGhvbmUgJiYgdXNlci5waG9uZSkge1xyXG4gICAgICAgIHBob25lID0gdXNlci5waG9uZSAmJiB1c2VyLnBob25lLm51bWJlcjtcclxuICAgIH1cclxuICAgIC8vIG1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgcGhvbmVcclxuICAgIGlmICghcGhvbmUpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiTm8gc3VjaCBwaG9uZSBmb3IgdXNlci5cIik7XHJcblxyXG4gICAgdmFyIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKHVzZXJJZCwgdHJ1ZSk7XHJcbiAgICAvLyBJZiBzZW50IG1vcmUgdGhhbiBtYXggcmV0cnkgd2FpdFxyXG4gICAgdmFyIHdhaXRUaW1lQmV0d2VlblJldHJpZXMgPSBBY2NvdW50cy5fb3B0aW9ucy52ZXJpZmljYXRpb25XYWl0VGltZTtcclxuICAgIHZhciBtYXhSZXRyeUNvdW50cyA9IEFjY291bnRzLl9vcHRpb25zLnZlcmlmaWNhdGlvbk1heFJldHJpZXM7XHJcblxyXG4gICAgdmFyIHZlcmlmeU9iamVjdCA9IHtcclxuICAgICAgICBudW1PZlJldHJpZXM6IDBcclxuICAgIH07XHJcbiAgICBpZiAodXNlci5zZXJ2aWNlcyAmJiB1c2VyLnNlcnZpY2VzLnBob25lICYmIHVzZXIuc2VydmljZXMucGhvbmUudmVyaWZ5KSB7XHJcbiAgICAgICAgdmVyaWZ5T2JqZWN0ID0gdXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGN1clRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gQ2hlY2sgaWYgbGFzdCByZXRyeSB3YXMgdG9vIHNvb25cclxuICAgIHZhciBuZXh0UmV0cnlEYXRlID0gdmVyaWZ5T2JqZWN0ICYmIHZlcmlmeU9iamVjdC5sYXN0UmV0cnkgJiYgbmV3IERhdGUodmVyaWZ5T2JqZWN0Lmxhc3RSZXRyeS5nZXRUaW1lKCkgKyB3YWl0VGltZUJldHdlZW5SZXRyaWVzKTtcclxuICAgIGlmIChuZXh0UmV0cnlEYXRlICYmIG5leHRSZXRyeURhdGUgPiBjdXJUaW1lKSB7XHJcbiAgICAgICAgdmFyIHdhaXRUaW1lSW5TZWMgPSBNYXRoLmNlaWwoTWF0aC5hYnMoKG5leHRSZXRyeURhdGUgLSBjdXJUaW1lKSAvIDEwMDApKSxcclxuICAgICAgICAgICAgZXJyTXNnID0gVEFQaTE4bi5fXygnYWNjb3VudHNfcGhvbmVfdG9vX29mdGVuX3JldHJpZXMnLCB7XHJcbiAgICAgICAgICAgICAgICBzOiB3YWl0VGltZUluU2VjXHJcbiAgICAgICAgICAgIH0sIGxvY2FsZSk7XHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZyk7XHJcbiAgICB9XHJcbiAgICAvLyBDaGVjayBpZiB0aGVyZSB3aGVyZSB0b28gbWFueSByZXRyaWVzXHJcbiAgICAvLyBpZiAodmVyaWZ5T2JqZWN0Lm51bU9mUmV0cmllcyA+IG1heFJldHJ5Q291bnRzKSB7XHJcbiAgICAvLyAgICAgLy8gQ2hlY2sgaWYgcGFzc2VkIGVub3VnaCB0aW1lIHNpbmNlIGxhc3QgcmV0cnlcclxuICAgIC8vICAgICB2YXIgd2FpdFRpbWVCZXR3ZWVuTWF4UmV0cmllcyA9IEFjY291bnRzLl9vcHRpb25zLnZlcmlmaWNhdGlvblJldHJpZXNXYWl0VGltZTtcclxuICAgIC8vICAgICBuZXh0UmV0cnlEYXRlID0gbmV3IERhdGUodmVyaWZ5T2JqZWN0Lmxhc3RSZXRyeS5nZXRUaW1lKCkgKyB3YWl0VGltZUJldHdlZW5NYXhSZXRyaWVzKTtcclxuICAgIC8vICAgICBpZiAobmV4dFJldHJ5RGF0ZSA+IGN1clRpbWUpIHtcclxuICAgIC8vICAgICAgICAgdmFyIHdhaXRUaW1lSW5NaW4gPSBNYXRoLmNlaWwoTWF0aC5hYnMoKG5leHRSZXRyeURhdGUgLSBjdXJUaW1lKSAvIDYwMDAwKSksXHJcbiAgICAvLyAgICAgICAgICAgICBlcnJNc2cgPSBUQVBpMThuLl9fKCdhY2NvdW50c19waG9uZV90b29fbWFueV9yZXRyaWVzJyx7bTp3YWl0VGltZUluTWlufSxsb2NhbGUpO1xyXG4gICAgLy8gICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgZXJyTXNnKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICB2ZXJpZnlPYmplY3QuY29kZSA9IGdldFJhbmRvbUNvZGUoQWNjb3VudHMuX29wdGlvbnMudmVyaWZpY2F0aW9uQ29kZUxlbmd0aCk7XHJcbiAgICB2ZXJpZnlPYmplY3QucGhvbmUgPSBwaG9uZTtcclxuICAgIHZlcmlmeU9iamVjdC5sYXN0UmV0cnkgPSBjdXJUaW1lO1xyXG4gICAgdmVyaWZ5T2JqZWN0Lm51bU9mUmV0cmllcysrO1xyXG5cclxuICAgIE1ldGVvci51c2Vycy51cGRhdGUoe1xyXG4gICAgICAgIF9pZDogdXNlcklkXHJcbiAgICB9LCB7XHJcbiAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAnc2VydmljZXMucGhvbmUudmVyaWZ5JzogdmVyaWZ5T2JqZWN0XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gYmVmb3JlIHBhc3NpbmcgdG8gdGVtcGxhdGUsIHVwZGF0ZSB1c2VyIG9iamVjdCB3aXRoIG5ldyB0b2tlblxyXG4gICAgTWV0ZW9yLl9lbnN1cmUodXNlciwgJ3NlcnZpY2VzJywgJ3Bob25lJyk7XHJcbiAgICB1c2VyLnNlcnZpY2VzLnBob25lLnZlcmlmeSA9IHZlcmlmeU9iamVjdDtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICB0bzogcGhvbmUsXHJcbiAgICAgICAgZnJvbTogU01TLnBob25lVGVtcGxhdGVzLmZyb20sXHJcbiAgICAgICAgYm9keTogU01TLnBob25lVGVtcGxhdGVzLnRleHQodXNlciwgdmVyaWZ5T2JqZWN0LmNvZGUpXHJcbiAgICB9O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3Muc21zICYmIE1ldGVvci5zZXR0aW5ncy5zbXMudHdpbGlvKSB7XHJcbiAgICAgICAgICAgIFNNUy5zZW5kKG9wdGlvbnMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB2ZXJpZnlPYmplY3QuY29kZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyDlj5HpgIHmiYvmnLrnn63kv6FcclxuICAgICAgICAgICAgU01TUXVldWUuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBGb3JtYXQ6ICdKU09OJyxcclxuICAgICAgICAgICAgICAgIEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxyXG4gICAgICAgICAgICAgICAgUGFyYW1TdHJpbmc6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyksXHJcbiAgICAgICAgICAgICAgICBSZWNOdW06IHBob25lLnN1YnN0cmluZygzKSxcclxuICAgICAgICAgICAgICAgIFNpZ25OYW1lOiAnT0Hns7vnu58nLFxyXG4gICAgICAgICAgICAgICAgVGVtcGxhdGVDb2RlOiAnU01TXzYzMzcwNDU1JyxcclxuICAgICAgICAgICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLm1vYmlsZV92ZXJpZmljYXRpb25fY29kZS50ZW1wbGF0ZScsIHBhcmFtcywgbG9jYWxlKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdTTVMgRmFpbGVkLCBTb21ldGhpbmcgYmFkIGhhcHBlbmVkIScsIGUpO1xyXG4gICAgICAgIHZhciBlcnJNc2cgPSBUQVBpMThuLl9fKCdhY2NvdW50c19waG9uZV9zbXNfZmFpbGVkJywge30sIGxvY2FsZSk7XHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBTZW5kIFNNUyB3aXRoIGNvZGUgdG8gdXNlci5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgcmVxdWVzdFBob25lVmVyaWZpY2F0aW9uOiBmdW5jdGlvbihwaG9uZSwgbG9jYWxlLCBjaGVja1ZlcmlmaWVkKSB7XHJcbiAgICAgICAgaWYgKHBob25lKSB7XHJcbiAgICAgICAgICAgIGNoZWNrKHBob25lLCBTdHJpbmcpO1xyXG4gICAgICAgICAgICAvLyBDaGFuZ2UgcGhvbmUgZm9ybWF0IHRvIGludGVybmF0aW9uYWwgU01TIGZvcm1hdFxyXG4gICAgICAgICAgICBwaG9uZSA9IG5vcm1hbGl6ZVBob25lKHBob25lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghcGhvbmUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfaW52YWxpZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB1c2VySWQgPSB0aGlzLnVzZXJJZDtcclxuICAgICAgICBpZiAoIXVzZXJJZCkge1xyXG4gICAgICAgICAgICAvLyBHZXQgdXNlciBieSBwaG9uZSBudW1iZXJcclxuICAgICAgICAgICAgdmFyIHVzZXJPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgJ3Bob25lLm51bWJlcic6IHBob25lLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYoY2hlY2tWZXJpZmllZCl7XHJcbiAgICAgICAgICAgICAgICB1c2VyT3B0aW9uc1sncGhvbmUudmVyaWZpZWQnXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBleGlzdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyT3B0aW9ucywge1xyXG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ19pZCc6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1VzZXIpIHtcclxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IGV4aXN0aW5nVXNlciAmJiBleGlzdGluZ1VzZXIuX2lkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyB1c2VyIHdpdGggcGhvbmUgbnVtYmVyXHJcbiAgICAgICAgICAgICAgICAvLyB1c2VySWQgPSBjcmVhdGVVc2VyKHtwaG9uZTpwaG9uZX0pO1xyXG4gICAgICAgICAgICAgICAgLy8g5pqC5pe25LiN5YWB6K646YCa6L+H5omL5py65Yib5bu65paw6LSm5oi377yM5Zug5Li65Y+v6IO95Lya6Lef5rKh5pyJ6YWN572u5omL5py65Y+355qE6ICB6LSm5oi35Yay56qBXHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyTXNnID0gVEFQaTE4bi5fXygnYWNjb3VudHNfcGhvbmVfdXNlcl9ub3RfZm91bmQnLCB7fSwgbG9jYWxlKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBlcnJNc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8vIOW3sueZu+W9leeUqOaIt++8jOacieWPr+iDvemcgOimgeaJi+acuuWPt+W3sumqjOivgeaJjeWPkemqjOivgeegge+8jOavlOWmgumAmui/h+aJi+acuuWPt+aJvuWbnuWvhueggVxyXG4gICAgICAgICAgICBpZihjaGVja1ZlcmlmaWVkKXtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZFVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB1c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3Bob25lLm51bWJlcic6IHBob25lLFxyXG4gICAgICAgICAgICAgICAgICAgICdwaG9uZS52ZXJpZmllZCc6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYoIXZhbGlkVXNlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVyck1zZyA9IFRBUGkxOG4uX18oJ2FjY291bnRzX3Bob25lX3ZlcmlmeV9mYWlsJywge30sIGxvY2FsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgQWNjb3VudHMuc2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZSh1c2VySWQsIHBob25lKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBUYWtlIGNvZGUgZnJvbSBzZW5kVmVyaWZpY2F0aW9uUGhvbmUgU01TLCBtYXJrIHRoZSBwaG9uZSBhcyB2ZXJpZmllZCxcclxuLy8gQ2hhbmdlIHBhc3N3b3JkIGlmIG5lZWRlZFxyXG4vLyBhbmQgbG9nIHRoZW0gaW4uXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgIHZlcmlmeVBob25lOiBmdW5jdGlvbihwaG9uZSwgbW9iaWxlLCBjb2RlLCBuZXdQYXNzd29yZCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAvLyBDaGVjayBpZiBuZWVkcyB0byBjaGFuZ2UgcGFzc3dvcmRcclxuICAgICAgICB2YXIgdXNlcklkID0gdGhpcy51c2VySWQ7XHJcblxyXG4gICAgICAgIHJldHVybiBBY2NvdW50cy5fbG9naW5NZXRob2QoXHJcbiAgICAgICAgICAgIHNlbGYsXHJcbiAgICAgICAgICAgIFwidmVyaWZ5UGhvbmVcIixcclxuICAgICAgICAgICAgYXJndW1lbnRzLFxyXG4gICAgICAgICAgICBcInBob25lXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2soY29kZSwgU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrKG1vYmlsZSwgU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrKHBob25lLCBTdHJpbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkNvZGUgaXMgbXVzdCBiZSBwcm92aWRlZCB0byBtZXRob2RcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGhvbmUgZm9ybWF0IHRvIGludGVybmF0aW9uYWwgU01TIGZvcm1hdFxyXG4gICAgICAgICAgICAgICAgcGhvbmUgPSBub3JtYWxpemVQaG9uZShwaG9uZSk7XHJcbiAgICAgICAgICAgICAgICBpZighcGhvbmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXI7XHJcbiAgICAgICAgICAgICAgICAvLyDlm6Dnu5Hlrprkv67mlLnmiYvmnLrlj7fopoHmsYLlhYjpqozor4HpgJrov4fmiY3mm7TmlrDmiYvmnLrlj7fvvIzmiYDku6Xov5nph4zkuI3lj6/ku6XpgJrov4fmiYvmnLrlj7fmib7nlKjmiLfvvIzlj6rog73mib7lvZPliY3nmbvlvZXnlKjmiLdcclxuICAgICAgICAgICAgICAgIC8vIOi/meagt+eahOivne+8jOWvueS6juW3sueZu+W9leeUqOaIt+adpeivtO+8jOWwseWPquiDvemqjOivgeiHquW3seeahOaJi+acuuWPt+S6hlxyXG4gICAgICAgICAgICAgICAgaWYodXNlcklkKXtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiB1c2VySWRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVmVyaWZ5IGNvZGUgaXMgYWNjZXB0ZWQgb3IgbWFzdGVyIGNvZGVcclxuICAgICAgICAgICAgICAgIGlmICghdXNlci5zZXJ2aWNlcy5waG9uZSB8fCAhdXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnkgfHwgIXVzZXIuc2VydmljZXMucGhvbmUudmVyaWZ5LmNvZGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAodXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnkuY29kZSAhPSBjb2RlICYmICFpc01hc3RlckNvZGUoY29kZSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfY29kZV9pbnZhbGlkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZXRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAncGhvbmUudmVyaWZpZWQnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAncGhvbmUubW9kaWZpZWQnOiBuZXcgRGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB1blNldE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS52ZXJpZnknOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih1c2VySWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOW9k+eUqOaIt+mqjOivgee7keWumuiHquW3seeahOaJi+acuuWPt+aXtu+8jOaKiuaJi+acuuWPt+S4gOi1t+aUueaOie+8jOWwseS4jeeUqOWGjeWNleeLrOiwg+eUqOS/ruaUueaJi+acuuWPt+eahOaOpeWPo+S6hlxyXG4gICAgICAgICAgICAgICAgICAgIHNldE9wdGlvbnNbJ3Bob25lLm51bWJlciddID0gcGhvbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0T3B0aW9uc1sncGhvbmUubW9iaWxlJ10gPSBtb2JpbGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzZXRUb09sZFRva2VuO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgbmVlZHMgdG8gdXBkYXRlIHBhc3N3b3JkXHJcbiAgICAgICAgICAgICAgICBpZiAobmV3UGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVjayhuZXdQYXNzd29yZCwgcGFzc3dvcmRWYWxpZGF0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoYXNoZWQgPSBoYXNoUGFzc3dvcmQobmV3UGFzc3dvcmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSdyZSBhYm91dCB0byBpbnZhbGlkYXRlIHRva2VucyBvbiB0aGUgdXNlciwgd2hvIHdlIG1pZ2h0IGJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9nZ2VkIGluIGFzLiBNYWtlIHN1cmUgdG8gYXZvaWQgbG9nZ2luZyBvdXJzZWx2ZXMgb3V0IGlmIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAvLyBoYXBwZW5zLiBCdXQgYWxzbyBtYWtlIHN1cmUgbm90IHRvIGxlYXZlIHRoZSBjb25uZWN0aW9uIGluIGEgc3RhdGVcclxuICAgICAgICAgICAgICAgICAgICAvLyBvZiBoYXZpbmcgYSBiYWQgdG9rZW4gc2V0IGlmIHRoaW5ncyBmYWlsLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRUb2tlbiA9IEFjY291bnRzLl9nZXRMb2dpblRva2VuKHNlbGYuY29ubmVjdGlvbi5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWNjb3VudHMuX3NldExvZ2luVG9rZW4odXNlci5faWQsIHNlbGYuY29ubmVjdGlvbiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRUb09sZFRva2VuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFjY291bnRzLl9zZXRMb2dpblRva2VuKHVzZXIuX2lkLCBzZWxmLmNvbm5lY3Rpb24sIG9sZFRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRPcHRpb25zWydzZXJ2aWNlcy5waG9uZS5iY3J5cHQnXSA9IGhhc2hlZDtcclxuICAgICAgICAgICAgICAgICAgICB1blNldE9wdGlvbnNbJ3NlcnZpY2VzLnBob25lLnNycCddID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5aKe5Yqg6K+l6KGM5Luj56CB5omn6KGMbWV0ZW9y5YaF572u55qE5a+G56CB6K6+572u5Yqf6IO9XHJcbiAgICAgICAgICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlci5faWQsIG5ld1Bhc3N3b3JkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB1c2VyLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gJ3Bob25lLm51bWJlcic6IHBob25lLC8v5omL5py65Y+355m75b2V5LiN6KaB5rGC6aqM6K+B6YCa6L+H77yM5omA5Lul6L+Z5Liq5p2h5Lu26KaB5Y675o6JXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS52ZXJpZnkuY29kZSc6IGNvZGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFsbG93IG1hc3RlciBjb2RlIGZyb20gc2V0dGluZ3NcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNNYXN0ZXJDb2RlKGNvZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxdWVyeVsnc2VydmljZXMucGhvbmUudmVyaWZ5LmNvZGUnXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6aqM6K+B6YCa6L+H5ZCO77yM5Y+v5Lul5Lmf6ZyA6KaB5oqK6YeN5aSN55qE5omL5py65Y+35YWo6YOo5riF6Zmk77yM5Lul5YWN5ZCO6Z2i5pu05paw5omL5py65Y+35pe25oql5ZSv5LiA5oCn57Si5byV55qE6ZSZXHJcbiAgICAgICAgICAgICAgICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdwaG9uZS5udW1iZXInOiBwaG9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmU6IHVzZXIuX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1bnNldDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb2JpbGVcIjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZXMucGhvbmVcIjogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSB1c2VyIHJlY29yZCBieTpcclxuICAgICAgICAgICAgICAgICAgICAvLyAtIENoYW5naW5nIHRoZSBwYXNzd29yZCB0byB0aGUgbmV3IG9uZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIC0gRm9yZ2V0dGluZyBhYm91dCB0aGUgdmVyaWZpY2F0aW9uIGNvZGUgdGhhdCB3YXMganVzdCB1c2VkXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLSBWZXJpZnlpbmcgdGhlIHBob25lLCBzaW5jZSB0aGV5IGdvdCB0aGUgY29kZSB2aWEgc21zIHRvIHBob25lLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZmZlY3RlZFJlY29yZHMgPSBNZXRlb3IudXNlcnMudXBkYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNldDogc2V0T3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1bnNldDogdW5TZXRPcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZmZlY3RlZFJlY29yZHMgIT09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyTXNnID0gdXNlcklkID8gXCJhY2NvdW50c19waG9uZV9jb2RlX3VwZGF0ZV9mYWlsXCIgOiBcImFjY291bnRzX3Bob25lX25vdF9leGlzdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKDQwMywgZXJyTXNnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc2Z1bFZlcmlmaWNhdGlvbih1c2VyLl9pZCk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNldFRvT2xkVG9rZW4pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldFRvT2xkVG9rZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgYWxsIHZhbGlkIGxvZ2luIHRva2VucyB3aXRoIG5ldyBvbmVzIChjaGFuZ2luZ1xyXG4gICAgICAgICAgICAgICAgLy8gcGFzc3dvcmQgc2hvdWxkIGludmFsaWRhdGUgZXhpc3Rpbmcgc2Vzc2lvbnMpLlxyXG4gICAgICAgICAgICAgICAgLy8gQWNjb3VudHMuX2NsZWFyQWxsTG9naW5Ub2tlbnModXNlci5faWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLl9pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLy8vXHJcbi8vLyBDUkVBVElORyBVU0VSU1xyXG4vLy9cclxuXHJcbi8vIFNoYXJlZCBjcmVhdGVVc2VyIGZ1bmN0aW9uIGNhbGxlZCBmcm9tIHRoZSBjcmVhdGVVc2VyIG1ldGhvZCwgYm90aFxyXG4vLyBpZiBvcmlnaW5hdGVzIGluIGNsaWVudCBvciBzZXJ2ZXIgY29kZS4gQ2FsbHMgdXNlciBwcm92aWRlZCBob29rcyxcclxuLy8gZG9lcyB0aGUgYWN0dWFsIHVzZXIgaW5zZXJ0aW9uLlxyXG4vL1xyXG4vLyByZXR1cm5zIHRoZSB1c2VyIGlkXHJcbnZhciBjcmVhdGVVc2VyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgLy8gVW5rbm93biBrZXlzIGFsbG93ZWQsIGJlY2F1c2UgYSBvbkNyZWF0ZVVzZXJIb29rIGNhbiB0YWtlIGFyYml0cmFyeVxyXG4gICAgLy8gb3B0aW9ucy5cclxuICAgIGNoZWNrKG9wdGlvbnMsIE1hdGNoLk9iamVjdEluY2x1ZGluZyh7XHJcbiAgICAgICAgcGhvbmU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXHJcbiAgICAgICAgcGFzc3dvcmQ6IE1hdGNoLk9wdGlvbmFsKHBhc3N3b3JkVmFsaWRhdG9yKVxyXG4gICAgfSkpO1xyXG5cclxuICAgIHZhciBwaG9uZSA9IG9wdGlvbnMucGhvbmU7XHJcbiAgICBpZiAoIXBob25lKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIk5lZWQgdG8gc2V0IHBob25lXCIpO1xyXG5cclxuICAgIHZhciBleGlzdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XHJcbiAgICAgICAgJ3Bob25lLm51bWJlcic6IHBob25lXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoZXhpc3RpbmdVc2VyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciB3aXRoIHRoaXMgcGhvbmUgbnVtYmVyIGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB1c2VyID0ge1xyXG4gICAgICAgIHNlcnZpY2VzOiB7fVxyXG4gICAgfTtcclxuICAgIGlmIChvcHRpb25zLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgdmFyIGhhc2hlZCA9IGhhc2hQYXNzd29yZChvcHRpb25zLnBhc3N3b3JkKTtcclxuICAgICAgICB1c2VyLnNlcnZpY2VzLnBob25lID0ge1xyXG4gICAgICAgICAgICBiY3J5cHQ6IGhhc2hlZFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdXNlci5waG9uZSA9IHtcclxuICAgICAgICBudW1iZXI6IHBob25lLFxyXG4gICAgICAgIHZlcmlmaWVkOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBBY2NvdW50cy5pbnNlcnRVc2VyRG9jKG9wdGlvbnMsIHVzZXIpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAvLyBYWFggc3RyaW5nIHBhcnNpbmcgc3Vja3MsIG1heWJlXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9qaXJhLm1vbmdvZGIub3JnL2Jyb3dzZS9TRVJWRVItMzA2OSB3aWxsIGdldCBmaXhlZCBvbmUgZGF5XHJcbiAgICAgICAgaWYgKGUubmFtZSAhPT0gJ01vbmdvRXJyb3InKSB0aHJvdyBlO1xyXG4gICAgICAgIHZhciBtYXRjaCA9IGUuZXJyLm1hdGNoKC9FMTEwMDAgZHVwbGljYXRlIGtleSBlcnJvciBpbmRleDogKFteIF0rKS8pO1xyXG4gICAgICAgIGlmICghbWF0Y2gpIHRocm93IGU7XHJcbiAgICAgICAgaWYgKG1hdGNoWzFdLmluZGV4T2YoJ3VzZXJzLiRwaG9uZS5udW1iZXInKSAhPT0gLTEpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlBob25lIG51bWJlciBhbHJlYWR5IGV4aXN0cywgZmFpbGVkIG9uIGNyZWF0aW9uLlwiKTtcclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gbWV0aG9kIGZvciBjcmVhdGUgdXNlci4gUmVxdWVzdHMgY29tZSBmcm9tIHRoZSBjbGllbnQuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgIGNyZWF0ZVVzZXJXaXRoUGhvbmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucGhvbmUpIHtcclxuICAgICAgICAgICAgY2hlY2sob3B0aW9ucy5waG9uZSwgU3RyaW5nKTtcclxuICAgICAgICAgICAgLy8gQ2hhbmdlIHBob25lIGZvcm1hdCB0byBpbnRlcm5hdGlvbmFsIFNNUyBmb3JtYXRcclxuICAgICAgICAgICAgb3B0aW9ucy5waG9uZSA9IG5vcm1hbGl6ZVBob25lKG9wdGlvbnMucGhvbmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEFjY291bnRzLl9sb2dpbk1ldGhvZChcclxuICAgICAgICAgICAgc2VsZixcclxuICAgICAgICAgICAgXCJjcmVhdGVVc2VyV2l0aFBob25lXCIsXHJcbiAgICAgICAgICAgIGFyZ3VtZW50cyxcclxuICAgICAgICAgICAgXCJwaG9uZVwiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChBY2NvdW50cy5fb3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlNpZ251cHMgZm9yYmlkZGVuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdXNlci4gcmVzdWx0IGNvbnRhaW5zIGlkIGFuZCB0b2tlbi5cclxuICAgICAgICAgICAgICAgIHZhciB1c2VySWQgPSBjcmVhdGVVc2VyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgLy8gc2FmZXR5IGJlbHQuIGNyZWF0ZVVzZXIgaXMgc3VwcG9zZWQgdG8gdGhyb3cgb24gZXJyb3IuIHNlbmQgNTAwIGVycm9yXHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIHNlbmRpbmcgYSB2ZXJpZmljYXRpb24gZW1haWwgd2l0aCBlbXB0eSB1c2VyaWQuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXJJZClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJjcmVhdGVVc2VyIGZhaWxlZCB0byBpbnNlcnQgbmV3IHVzZXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgYEFjY291bnRzLl9vcHRpb25zLnNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGVPbkNyZWF0aW9uYCBpcyBzZXQsIHJlZ2lzdGVyXHJcbiAgICAgICAgICAgICAgICAvLyBhIHRva2VuIHRvIHZlcmlmeSB0aGUgdXNlcidzIHByaW1hcnkgcGhvbmUsIGFuZCBzZW5kIGl0IHRvXHJcbiAgICAgICAgICAgICAgICAvLyBieSBzbXMuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5waG9uZSAmJiBBY2NvdW50cy5fb3B0aW9ucy5zZW5kUGhvbmVWZXJpZmljYXRpb25Db2RlT25DcmVhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIEFjY291bnRzLnNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGUodXNlcklkLCBvcHRpb25zLnBob25lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjbGllbnQgZ2V0cyBsb2dnZWQgaW4gYXMgdGhlIG5ldyB1c2VyIGFmdGVyd2FyZHMuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBDcmVhdGUgdXNlciBkaXJlY3RseSBvbiB0aGUgc2VydmVyLlxyXG4vL1xyXG4vLyBVbmxpa2UgdGhlIGNsaWVudCB2ZXJzaW9uLCB0aGlzIGRvZXMgbm90IGxvZyB5b3UgaW4gYXMgdGhpcyB1c2VyXHJcbi8vIGFmdGVyIGNyZWF0aW9uLlxyXG4vL1xyXG4vLyByZXR1cm5zIHVzZXJJZCBvciB0aHJvd3MgYW4gZXJyb3IgaWYgaXQgY2FuJ3QgY3JlYXRlXHJcbi8vXHJcbi8vIFhYWCBhZGQgYW5vdGhlciBhcmd1bWVudCAoXCJzZXJ2ZXIgb3B0aW9uc1wiKSB0aGF0IGdldHMgc2VudCB0byBvbkNyZWF0ZVVzZXIsXHJcbi8vIHdoaWNoIGlzIGFsd2F5cyBlbXB0eSB3aGVuIGNhbGxlZCBmcm9tIHRoZSBjcmVhdGVVc2VyIG1ldGhvZD8gZWcsIFwiYWRtaW46XHJcbi8vIHRydWVcIiwgd2hpY2ggd2Ugd2FudCB0byBwcmV2ZW50IHRoZSBjbGllbnQgZnJvbSBzZXR0aW5nLCBidXQgd2hpY2ggYSBjdXN0b21cclxuLy8gbWV0aG9kIGNhbGxpbmcgQWNjb3VudHMuY3JlYXRlVXNlciBjb3VsZCBzZXQ/XHJcbi8vXHJcbkFjY291bnRzLmNyZWF0ZVVzZXJXaXRoUGhvbmUgPSBmdW5jdGlvbihvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgb3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucyk7XHJcblxyXG4gICAgLy8gWFhYIGFsbG93IGFuIG9wdGlvbmFsIGNhbGxiYWNrP1xyXG4gICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQWNjb3VudHMuY3JlYXRlVXNlciB3aXRoIGNhbGxiYWNrIG5vdCBzdXBwb3J0ZWQgb24gdGhlIHNlcnZlciB5ZXQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjcmVhdGVVc2VyKG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLy8vXHJcbi8vLyBQQVNTV09SRC1TUEVDSUZJQyBJTkRFWEVTIE9OIFVTRVJTXHJcbi8vL1xyXG5NZXRlb3IudXNlcnMuX2Vuc3VyZUluZGV4KCdwaG9uZS5udW1iZXInLCB7XHJcbiAgICB1bmlxdWU6IDEsXHJcbiAgICBzcGFyc2U6IDFcclxufSk7XHJcblxyXG4vLyBjbuW5s+WPsOWPkeeUn+i/h+mqjOivgeeggemHjeWkjeeahOmXrumimO+8jOaJgOS7peWOu+aOieWUr+S4gOaAp+e0ouW8lee6puadn1xyXG5NZXRlb3IudXNlcnMuX2Vuc3VyZUluZGV4KCdzZXJ2aWNlcy5waG9uZS52ZXJpZnkuY29kZScsIHtcclxuICAgIC8vIHVuaXF1ZTogMSxcclxuICAgIHNwYXJzZTogMVxyXG59KTtcclxuXHJcbi8qKiogQ29udHJvbCBwdWJsaXNoZWQgZGF0YSAqKioqKioqKiovXHJcbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xyXG4gICAgLyoqIFB1Ymxpc2ggcGhvbmVzIHRvIHRoZSBjbGllbnQgKiovXHJcbiAgICBNZXRlb3IucHVibGlzaChudWxsLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy51c2VySWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHtcclxuICAgICAgICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3Bob25lJzogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlYWR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqIERpc2FibGUgdXNlciBwcm9maWxlIGVkaXRpbmcgKiovXHJcbiAgICBNZXRlb3IudXNlcnMuZGVueSh7XHJcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG1vZGlmaWVyLiRzZXQucGhvbmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuLyoqKioqKioqKioqKiogUGhvbmUgdmVyaWZpY2F0aW9uIGhvb2sgKioqKioqKioqKioqKi9cclxuXHJcbi8vIENhbGxiYWNrIGV4Y2VwdGlvbnMgYXJlIHByaW50ZWQgd2l0aCBNZXRlb3IuX2RlYnVnIGFuZCBpZ25vcmVkLlxyXG52YXIgb25QaG9uZVZlcmlmaWNhdGlvbkhvb2sgPSBuZXcgSG9vayh7XHJcbiAgICBkZWJ1Z1ByaW50RXhjZXB0aW9uczogXCJvblBob25lVmVyaWZpY2F0aW9uIGNhbGxiYWNrXCJcclxufSk7XHJcblxyXG4vKipcclxuICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgYSBwaG9uZSB2ZXJpZmljYXRpb24gYXR0ZW1wdCBzdWNjZWVkcy5cclxuICogQGxvY3VzIFNlcnZlclxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiBwaG9uZSB2ZXJpZmljYXRpb24gaXMgc3VjY2Vzc2Z1bC5cclxuICovXHJcbkFjY291bnRzLm9uUGhvbmVWZXJpZmljYXRpb24gPSBmdW5jdGlvbihmdW5jKSB7XHJcbiAgICByZXR1cm4gb25QaG9uZVZlcmlmaWNhdGlvbkhvb2sucmVnaXN0ZXIoZnVuYyk7XHJcbn07XHJcblxyXG52YXIgc3VjY2Vzc2Z1bFZlcmlmaWNhdGlvbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xyXG4gICAgb25QaG9uZVZlcmlmaWNhdGlvbkhvb2suZWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrKHVzZXJJZCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8vIEdpdmUgZWFjaCBsb2dpbiBob29rIGNhbGxiYWNrIGEgZnJlc2ggY2xvbmVkIGNvcHkgb2YgdGhlIGF0dGVtcHRcclxuLy8gb2JqZWN0LCBidXQgZG9uJ3QgY2xvbmUgdGhlIGNvbm5lY3Rpb24uXHJcbi8vXHJcbnZhciBjbG9uZUF0dGVtcHRXaXRoQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKGNvbm5lY3Rpb24sIGF0dGVtcHQpIHtcclxuICAgIHZhciBjbG9uZWRBdHRlbXB0ID0gRUpTT04uY2xvbmUoYXR0ZW1wdCk7XHJcbiAgICBjbG9uZWRBdHRlbXB0LmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG4gICAgcmV0dXJuIGNsb25lZEF0dGVtcHQ7XHJcbn07XHJcbi8qKioqKioqKioqKioqIEhlbHBlciBmdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4vLyBSZXR1cm4gbm9ybWFsaXplZCBwaG9uZSBmb3JtYXRcclxudmFyIG5vcm1hbGl6ZVBob25lID0gZnVuY3Rpb24ocGhvbmUpIHtcclxuICAgIC8vIElmIHBob25lIGVxdWFscyB0byBvbmUgb2YgYWRtaW4gcGhvbmUgbnVtYmVycyByZXR1cm4gaXQgYXMtaXNcclxuICAgIGlmIChwaG9uZSAmJiBBY2NvdW50cy5fb3B0aW9ucy5hZG1pblBob25lTnVtYmVycyAmJiBBY2NvdW50cy5fb3B0aW9ucy5hZG1pblBob25lTnVtYmVycy5pbmRleE9mKHBob25lKSAhPSAtMSkge1xyXG4gICAgICAgIHJldHVybiBwaG9uZTtcclxuICAgIH1cclxuICAgIHJldHVybiBQaG9uZShwaG9uZSlbMF07XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gY29kZSBpcyB0aGUgZGVmaW5lZCBtYXN0ZXIgY29kZVxyXG4gKiBAcGFyYW0gY29kZVxyXG4gKiBAcmV0dXJucyB7Knxib29sZWFufVxyXG4gKi9cclxudmFyIGlzTWFzdGVyQ29kZSA9IGZ1bmN0aW9uKGNvZGUpIHtcclxuICAgIHJldHVybiBjb2RlICYmIEFjY291bnRzLl9vcHRpb25zLnBob25lVmVyaWZpY2F0aW9uTWFzdGVyQ29kZSAmJlxyXG4gICAgICAgIGNvZGUgPT0gQWNjb3VudHMuX29wdGlvbnMucGhvbmVWZXJpZmljYXRpb25NYXN0ZXJDb2RlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCByYW5kb20gcGhvbmUgdmVyaWZpY2F0aW9uIGNvZGVcclxuICogQHBhcmFtIGxlbmd0aFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGdldFJhbmRvbUNvZGUgPSBmdW5jdGlvbihsZW5ndGgpIHtcclxuICAgIGxlbmd0aCA9IGxlbmd0aCB8fCA0O1xyXG4gICAgdmFyIG91dHB1dCA9IFwiXCI7XHJcbiAgICB3aGlsZSAobGVuZ3RoLS0gPiAwKSB7XHJcblxyXG4gICAgICAgIG91dHB1dCArPSBnZXRSYW5kb21EaWdpdCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gcmFuZG9tIDEtOSBkaWdpdFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKi9cclxudmFyIGdldFJhbmRvbURpZ2l0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDkpICsgMSk7XHJcbn07Il19
