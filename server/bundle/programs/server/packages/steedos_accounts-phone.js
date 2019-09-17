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
  "phone": "1.0.x",
  "twilio": "^1.10.0",
  "stream-buffers": "^0.2.5"
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy1waG9uZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy1waG9uZS9zbXNfc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmFjY291bnRzLXBob25lL3Bob25lX3NlcnZlci5qcyJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJyZXF1aXJlIiwiRnV0dXJlIiwiVHdpbGlvIiwiU01TIiwiU01TVGVzdCIsIm5leHRfZGV2bW9kZV9zbXNfaWQiLCJvdXRwdXRfc3RyZWFtIiwicHJvY2VzcyIsInN0ZG91dCIsIm92ZXJyaWRlT3V0cHV0U3RyZWFtIiwic3RyZWFtIiwicmVzdG9yZU91dHB1dFN0cmVhbSIsImRldk1vZGVTZW5kIiwib3B0aW9ucyIsImRldm1vZGVfc21zX2lkIiwid3JpdGUiLCJmdXR1cmUiLCJmcm9tIiwidG8iLCJib2R5Iiwic2VuZEhvb2tzIiwiaG9va1NlbmQiLCJmIiwicHVzaCIsInNlbmQiLCJpIiwibGVuZ3RoIiwidHdpbGlvIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJzbXMiLCJjbGllbnQiLCJBQ0NPVU5UX1NJRCIsIkFVVEhfVE9LRU4iLCJGUk9NIiwic2VuZFNNU1N5bmMiLCJ3cmFwQXN5bmMiLCJzZW5kTWVzc2FnZSIsInJlc3VsdCIsImVyciIsInJlc3BvbnNlRGF0YSIsIkVycm9yIiwibWVzc2FnZSIsInBob25lVGVtcGxhdGVzIiwidGV4dCIsInVzZXIiLCJjb2RlIiwiQWNjb3VudEdsb2JhbENvbmZpZ3MiLCJ2ZXJpZmljYXRpb25SZXRyaWVzV2FpdFRpbWUiLCJ2ZXJpZmljYXRpb25XYWl0VGltZSIsInZlcmlmaWNhdGlvbkNvZGVMZW5ndGgiLCJ2ZXJpZmljYXRpb25NYXhSZXRyaWVzIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwic2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZU9uQ3JlYXRpb24iLCJfIiwiZGVmYXVsdHMiLCJBY2NvdW50cyIsIl9vcHRpb25zIiwiUGhvbmUiLCJiY3J5cHQiLCJOcG1Nb2R1bGVCY3J5cHQiLCJiY3J5cHRIYXNoIiwiaGFzaCIsImJjcnlwdENvbXBhcmUiLCJjb21wYXJlIiwiZ2V0UGFzc3dvcmRTdHJpbmciLCJwYXNzd29yZCIsIlNIQTI1NiIsImFsZ29yaXRobSIsImRpZ2VzdCIsImhhc2hQYXNzd29yZCIsIl9iY3J5cHRSb3VuZHMiLCJfY2hlY2tQaG9uZVBhc3N3b3JkIiwidXNlcklkIiwiX2lkIiwic2VydmljZXMiLCJwaG9uZSIsImVycm9yIiwiY2hlY2tQYXNzd29yZCIsInNlbGVjdG9yRnJvbVVzZXJRdWVyeSIsImlkIiwiZmluZFVzZXJGcm9tVXNlclF1ZXJ5Iiwic2VsZWN0b3IiLCJ1c2VycyIsImZpbmRPbmUiLCJOb25FbXB0eVN0cmluZyIsIk1hdGNoIiwiV2hlcmUiLCJ4IiwiY2hlY2siLCJTdHJpbmciLCJ1c2VyUXVlcnlWYWxpZGF0b3IiLCJPcHRpb25hbCIsImtleXMiLCJwYXNzd29yZFZhbGlkYXRvciIsIk9uZU9mIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJzcnAiLCJ1bmRlZmluZWQiLCJ2ZXJpZmllciIsIm5ld1ZlcmlmaWVyIiwiU1JQIiwiZ2VuZXJhdGVWZXJpZmllciIsImlkZW50aXR5Iiwic2FsdCIsIkVKU09OIiwic3RyaW5naWZ5IiwiZm9ybWF0IiwidjEiLCJ2MiIsImhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQiLCJzYWx0ZWQiLCJ1cGRhdGUiLCIkdW5zZXQiLCIkc2V0Iiwic2V0UGhvbmVQYXNzd29yZCIsIm5ld1BsYWludGV4dFBhc3N3b3JkIiwic2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZSIsIm51bWJlciIsImxvY2FsZSIsIlN0ZWVkb3MiLCJ3YWl0VGltZUJldHdlZW5SZXRyaWVzIiwibWF4UmV0cnlDb3VudHMiLCJ2ZXJpZnlPYmplY3QiLCJudW1PZlJldHJpZXMiLCJ2ZXJpZnkiLCJjdXJUaW1lIiwiRGF0ZSIsIm5leHRSZXRyeURhdGUiLCJsYXN0UmV0cnkiLCJnZXRUaW1lIiwid2FpdFRpbWVJblNlYyIsIk1hdGgiLCJjZWlsIiwiYWJzIiwiZXJyTXNnIiwiVEFQaTE4biIsIl9fIiwicyIsImdldFJhbmRvbUNvZGUiLCJfZW5zdXJlIiwicGFyYW1zIiwiU01TUXVldWUiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIkpTT04iLCJSZWNOdW0iLCJzdWJzdHJpbmciLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsIm1zZyIsImUiLCJjb25zb2xlIiwibWV0aG9kcyIsInJlcXVlc3RQaG9uZVZlcmlmaWNhdGlvbiIsImNoZWNrVmVyaWZpZWQiLCJub3JtYWxpemVQaG9uZSIsInVzZXJPcHRpb25zIiwiZXhpc3RpbmdVc2VyIiwiZmllbGRzIiwidmFsaWRVc2VyIiwidmVyaWZ5UGhvbmUiLCJtb2JpbGUiLCJuZXdQYXNzd29yZCIsInNlbGYiLCJfbG9naW5NZXRob2QiLCJhcmd1bWVudHMiLCJpc01hc3RlckNvZGUiLCJzZXRPcHRpb25zIiwidW5TZXRPcHRpb25zIiwicmVzZXRUb09sZFRva2VuIiwiaGFzaGVkIiwib2xkVG9rZW4iLCJfZ2V0TG9naW5Ub2tlbiIsImNvbm5lY3Rpb24iLCJfc2V0TG9naW5Ub2tlbiIsInNldFBhc3N3b3JkIiwicXVlcnkiLCIkbmUiLCJhZmZlY3RlZFJlY29yZHMiLCJzdWNjZXNzZnVsVmVyaWZpY2F0aW9uIiwiY3JlYXRlVXNlciIsIk9iamVjdEluY2x1ZGluZyIsInZlcmlmaWVkIiwiaW5zZXJ0VXNlckRvYyIsIm5hbWUiLCJtYXRjaCIsImluZGV4T2YiLCJjcmVhdGVVc2VyV2l0aFBob25lIiwiT2JqZWN0IiwiY2FsbGJhY2siLCJjbG9uZSIsIl9lbnN1cmVJbmRleCIsInVuaXF1ZSIsInNwYXJzZSIsInN0YXJ0dXAiLCJwdWJsaXNoIiwiZmluZCIsInJlYWR5IiwiZGVueSIsImRvYyIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsIm9uUGhvbmVWZXJpZmljYXRpb25Ib29rIiwiSG9vayIsImRlYnVnUHJpbnRFeGNlcHRpb25zIiwib25QaG9uZVZlcmlmaWNhdGlvbiIsImZ1bmMiLCJyZWdpc3RlciIsImVhY2giLCJjbG9uZUF0dGVtcHRXaXRoQ29ubmVjdGlvbiIsImF0dGVtcHQiLCJjbG9uZWRBdHRlbXB0IiwiYWRtaW5QaG9uZU51bWJlcnMiLCJwaG9uZVZlcmlmaWNhdGlvbk1hc3RlckNvZGUiLCJvdXRwdXQiLCJnZXRSYW5kb21EaWdpdCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMsNkJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsV0FBUyxPQURPO0FBRWhCLFlBQVUsU0FGTTtBQUdoQixvQkFBa0I7QUFIRixDQUFELEVBSWIsd0JBSmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNKQSxJQUFJSyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxlQUFELENBQXBCOztBQUNBLElBQUlFLE1BQU0sR0FBR0YsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBRUFHLEdBQUcsR0FBRyxFQUFOO0FBQ0FDLE9BQU8sR0FBRyxFQUFWO0FBRUEsSUFBSUMsbUJBQW1CLEdBQUcsQ0FBMUI7QUFDQSxJQUFJQyxhQUFhLEdBQUdDLE9BQU8sQ0FBQ0MsTUFBNUIsQyxDQUVBOztBQUNBSixPQUFPLENBQUNLLG9CQUFSLEdBQStCLFVBQVVDLE1BQVYsRUFBa0I7QUFDN0NMLHFCQUFtQixHQUFHLENBQXRCO0FBQ0FDLGVBQWEs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QUFiLENBQVA7QUFDSCxDQU5EO0FBUUE7Ozs7Ozs7QUFLQSxJQUFJNEYsWUFBWSxHQUFHLFVBQVMxSCxJQUFULEVBQWU7QUFDOUIsU0FBT0EsSUFBSSxJQUFJVSxRQUFRLENBQUNDLFFBQVQsQ0FBa0I4SiwyQkFBMUIsSUFDSHpLLElBQUksSUFBSVUsUUFBUSxDQUFDQyxRQUFULENBQWtCOEosMkJBRDlCO0FBRUgsQ0FIRDtBQUtBOzs7Ozs7O0FBS0EsSUFBSTVFLGFBQWEsR0FBRyxVQUFTakgsTUFBVCxFQUFpQjtBQUNqQ0EsUUFBTSxHQUFHQSxNQUFNLElBQUksQ0FBbkI7QUFDQSxNQUFJOEwsTUFBTSxHQUFHLEVBQWI7O0FBQ0EsU0FBTzlMLE1BQU0sS0FBSyxDQUFsQixFQUFxQjtBQUVqQjhMLFVBQU0sSUFBSUMsY0FBYyxFQUF4QjtBQUNIOztBQUNELFNBQU9ELE1BQVA7QUFDSCxDQVJEO0FBVUE7Ozs7OztBQUlBLElBQUlDLGNBQWMsR0FBRyxZQUFXO0FBQzVCLFNBQU9yRixJQUFJLENBQUNzRixLQUFMLENBQVl0RixJQUFJLENBQUN1RixNQUFMLEtBQWdCLENBQWpCLEdBQXNCLENBQWpDLENBQVA7QUFDSCxDQUZELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMtcGhvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmaXggd2FybmluZzogeHh4IG5vdCBpbnN0YWxsZWRcclxucmVxdWlyZShcInN0cmVhbS1idWZmZXJzL3BhY2thZ2UuanNvblwiKTtcclxuXHJcbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJwaG9uZVwiOiBcIjEuMC54XCIsXHJcblx0XCJ0d2lsaW9cIjogXCJeMS4xMC4wXCIsXHJcblx0XCJzdHJlYW0tYnVmZmVyc1wiOiBcIl4wLjIuNVwiXHJcbn0sICdzdGVlZG9zOmFjY291bnRzLXBob25lJyk7IiwidmFyIEZ1dHVyZSA9IHJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKTtcclxudmFyIFR3aWxpbyA9IHJlcXVpcmUoJ3R3aWxpbycpO1xyXG5cclxuU01TID0ge307XHJcblNNU1Rlc3QgPSB7fTtcclxuXHJcbnZhciBuZXh0X2Rldm1vZGVfc21zX2lkID0gMDtcclxudmFyIG91dHB1dF9zdHJlYW0gPSBwcm9jZXNzLnN0ZG91dDtcclxuXHJcbi8vIFRlc3RpbmcgaG9va3NcclxuU01TVGVzdC5vdmVycmlkZU91dHB1dFN0cmVhbSA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcclxuICAgIG5leHRfZGV2bW9kZV9zbXNfaWQgPSAwO1xyXG4gICAgb3V0cHV0X3N0cmVhbSA9IHN0cmVhbTtcclxufTtcclxuXHJcblNNU1Rlc3QucmVzdG9yZU91dHB1dFN0cmVhbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIG91dHB1dF9zdHJlYW0gPSBwcm9jZXNzLnN0ZG91dDtcclxufTtcclxuXHJcbnZhciBkZXZNb2RlU2VuZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB2YXIgZGV2bW9kZV9zbXNfaWQgPSBuZXh0X2Rldm1vZGVfc21zX2lkKys7XHJcblxyXG4gICAgdmFyIHN0cmVhbSA9IG91dHB1dF9zdHJlYW07XHJcblxyXG4gICAgLy8gVGhpcyBhcHByb2FjaCBkb2VzIG5vdCBwcmV2ZW50IG90aGVyIHdyaXRlcnMgdG8gc3Rkb3V0IGZyb20gaW50ZXJsZWF2aW5nLlxyXG4gICAgc3RyZWFtLndyaXRlKFwiPT09PT09IEJFR0lOIFNNUyAjXCIgKyBkZXZtb2RlX3Ntc19pZCArIFwiID09PT09PVxcblwiKTtcclxuICAgIHN0cmVhbS53cml0ZShcIihTTVMgbm90IHNlbnQ7IHRvIGVuYWJsZSBzZW5kaW5nLCBzZXQgdGhlIFRXSUxJT19DUkVERU5USUFMUyBcIiArXHJcbiAgICAgICAgXCJlbnZpcm9ubWVudCB2YXJpYWJsZS4pXFxuXCIpO1xyXG4gICAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XHJcbiAgICBzdHJlYW0ud3JpdGUoXCJGcm9tOlwiICsgb3B0aW9ucy5mcm9tICsgXCJcXG5cIik7XHJcbiAgICBzdHJlYW0ud3JpdGUoXCJUbzpcIiArIG9wdGlvbnMudG8gKyBcIlxcblwiKTtcclxuICAgIHN0cmVhbS53cml0ZShcIlRleHQ6XCIgKyBvcHRpb25zLmJvZHkgKyBcIlxcblwiKTtcclxuICAgIHN0cmVhbS53cml0ZShcIj09PT09PSBFTkQgU01TICNcIiArIGRldm1vZGVfc21zX2lkICsgXCIgPT09PT09XFxuXCIpO1xyXG4gICAgZnV0dXJlWydyZXR1cm4nXSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1vY2sgb3V0IHNtcyBzZW5kaW5nIChlZywgZHVyaW5nIGEgdGVzdC4pIFRoaXMgaXMgcHJpdmF0ZSBmb3Igbm93LlxyXG4gKlxyXG4gKiBmIHJlY2VpdmVzIHRoZSBhcmd1bWVudHMgdG8gU01TLnNlbmQgYW5kIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBnb1xyXG4gKiBhaGVhZCBhbmQgc2VuZCB0aGUgZW1haWwgKG9yIGF0IGxlYXN0LCB0cnkgc3Vic2VxdWVudCBob29rcyksIG9yXHJcbiAqIGZhbHNlIHRvIHNraXAgc2VuZGluZy5cclxuICovXHJcbnZhciBzZW5kSG9va3MgPSBbXTtcclxuU01TVGVzdC5ob29rU2VuZCA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICBzZW5kSG9va3MucHVzaChmKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZW5kIGFuIHNtcy5cclxuICpcclxuICogQ29ubmVjdHMgdG8gdHdpbGlvIHZpYSB0aGUgQ09ORklHX1ZBUlMgZW52aXJvbm1lbnRcclxuICogdmFyaWFibGUuIElmIHVuc2V0LCBwcmludHMgZm9ybWF0dGVkIG1lc3NhZ2UgdG8gc3Rkb3V0LiBUaGUgXCJmcm9tXCIgb3B0aW9uXHJcbiAqIGlzIHJlcXVpcmVkLCBhbmQgYXQgbGVhc3Qgb25lIG9mIFwidG9cIiwgXCJmcm9tXCIsIGFuZCBcImJvZHlcIiBtdXN0IGJlIHByb3ZpZGVkO1xyXG4gKiBhbGwgb3RoZXIgb3B0aW9ucyBhcmUgb3B0aW9uYWwuXHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zXHJcbiAqIEBwYXJhbSBvcHRpb25zLmZyb20ge1N0cmluZ30gLSBUaGUgc2VuZGluZyBTTVMgbnVtYmVyXHJcbiAqIEBwYXJhbSBvcHRpb25zLnRvIHtTdHJpbmd9IC0gVGhlIHJlY2VpdmVyIFNNUyBudW1iZXJcclxuICogQHBhcmFtIG9wdGlvbnMuYm9keSB7U3RyaW5nfSAgLSBUaGUgY29udGVudCBvZiB0aGUgU01TXHJcbiAqL1xyXG5TTVMuc2VuZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbmRIb29rcy5sZW5ndGg7IGkrKylcclxuICAgICAgICBpZiAoIXNlbmRIb29rc1tpXShvcHRpb25zKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIHR3aWxpbyA9IE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3Muc21zICYmIE1ldGVvci5zZXR0aW5ncy5zbXMudHdpbGlvO1xyXG4gICAgaWYgKHR3aWxpbykge1xyXG4gICAgICAgIHZhciBjbGllbnQgPSBUd2lsaW8odHdpbGlvLkFDQ09VTlRfU0lELCB0d2lsaW8uQVVUSF9UT0tFTik7XHJcbiAgICAgICAgLy8gSW5jbHVkZSBGUk9NIGluIG9wdGlvbnMgaWYgaXQgaXMgZGVmaW5lZC4gXHJcbiAgICAgICAgdHdpbGlvLkZST00gJiYgKG9wdGlvbnMuZnJvbSA9IHR3aWxpby5GUk9NKTtcclxuICAgICAgICAvLyBTZW5kIFNNUyAgQVBJIGFzeW5jIGZ1bmNcclxuICAgICAgICB2YXIgc2VuZFNNU1N5bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGNsaWVudC5zZW5kTWVzc2FnZSwgY2xpZW50KTtcclxuICAgICAgICAvLyBjYWxsIHRoZSBzeW5jIHZlcnNpb24gb2Ygb3VyIEFQSSBmdW5jIHdpdGggdGhlIHBhcmFtZXRlcnMgZnJvbSB0aGUgbWV0aG9kIGNhbGxcclxuICAgICAgICB2YXIgcmVzdWx0ID0gc2VuZFNNU1N5bmMob3B0aW9ucywgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2VEYXRhKSB7IC8vdGhpcyBmdW5jdGlvbiBpcyBleGVjdXRlZCB3aGVuIGEgcmVzcG9uc2UgaXMgcmVjZWl2ZWQgZnJvbSBUd2lsaW9cclxuICAgICAgICAgICAgaWYgKGVycikgeyAvLyBcImVyclwiIGlzIGFuIGVycm9yIHJlY2VpdmVkIGR1cmluZyB0aGUgcmVxdWVzdCwgaWYgYW55XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiRXJyb3Igc2VuZGluZyBTTVMgXCIsIGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkZXZNb2RlU2VuZChvcHRpb25zKTtcclxuICAgIH1cclxufTtcclxuXHJcblNNUy5waG9uZVRlbXBsYXRlcyA9IHtcclxuICAgIGZyb206ICcrOTcyNTQ1OTk5OTk5JyxcclxuICAgIHRleHQ6IGZ1bmN0aW9uICh1c2VyLCBjb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuICfjgJBTdGVlZG9z44CRICcgKyBjb2RlICsgJyBpcyB5b3VyIFN0ZWVkb3MgdmVyaWZpY2F0aW9uIGNvZGUuJztcclxuICAgIH1cclxufTtcclxuXHJcbiIsIi8vLyBEZWZhdWx0IEFjY291bnRzIENvbmZpZyB2YXJzXHJcblxyXG52YXIgQWNjb3VudEdsb2JhbENvbmZpZ3MgPSB7XHJcbiAgICB2ZXJpZmljYXRpb25SZXRyaWVzV2FpdFRpbWU6IDEwICogNjAgKiAxMDAwLFxyXG4gICAgdmVyaWZpY2F0aW9uV2FpdFRpbWU6IDMwICogMTAwMCxcclxuICAgIHZlcmlmaWNhdGlvbkNvZGVMZW5ndGg6IDQsXHJcbiAgICB2ZXJpZmljYXRpb25NYXhSZXRyaWVzOiAyLFxyXG4gICAgZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uOiBmYWxzZSxcclxuICAgIHNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGVPbkNyZWF0aW9uOiB0cnVlXHJcbn07XHJcblxyXG5fLmRlZmF1bHRzKEFjY291bnRzLl9vcHRpb25zLCBBY2NvdW50R2xvYmFsQ29uZmlncyk7XHJcblxyXG5cclxuLy8vIFBob25lXHJcblxyXG52YXIgUGhvbmUgPSByZXF1aXJlKCdwaG9uZScpO1xyXG5cclxuLy8vIEJDUllQVFxyXG5cclxudmFyIGJjcnlwdCA9IE5wbU1vZHVsZUJjcnlwdDtcclxudmFyIGJjcnlwdEhhc2ggPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5oYXNoKTtcclxudmFyIGJjcnlwdENvbXBhcmUgPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5jb21wYXJlKTtcclxuXHJcbi8vIFVzZXIgcmVjb3JkcyBoYXZlIGEgJ3NlcnZpY2VzLnBob25lLmJjcnlwdCcgZmllbGQgb24gdGhlbSB0byBob2xkXHJcbi8vIHRoZWlyIGhhc2hlZCBwYXNzd29yZHMgKHVubGVzcyB0aGV5IGhhdmUgYSAnc2VydmljZXMucGhvbmUuc3JwJ1xyXG4vLyBmaWVsZCwgaW4gd2hpY2ggY2FzZSB0aGV5IHdpbGwgYmUgdXBncmFkZWQgdG8gYmNyeXB0IHRoZSBuZXh0IHRpbWVcclxuLy8gdGhleSBsb2cgaW4pLlxyXG4vL1xyXG4vLyBXaGVuIHRoZSBjbGllbnQgc2VuZHMgYSBwYXNzd29yZCB0byB0aGUgc2VydmVyLCBpdCBjYW4gZWl0aGVyIGJlIGFcclxuLy8gc3RyaW5nICh0aGUgcGxhaW50ZXh0IHBhc3N3b3JkKSBvciBhbiBvYmplY3Qgd2l0aCBrZXlzICdkaWdlc3QnIGFuZFxyXG4vLyAnYWxnb3JpdGhtJyAobXVzdCBiZSBcInNoYS0yNTZcIiBmb3Igbm93KS4gVGhlIE1ldGVvciBjbGllbnQgYWx3YXlzIHNlbmRzXHJcbi8vIHBhc3N3b3JkIG9iamVjdHMgeyBkaWdlc3Q6ICosIGFsZ29yaXRobTogXCJzaGEtMjU2XCIgfSwgYnV0IEREUCBjbGllbnRzXHJcbi8vIHRoYXQgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gU0hBIGNhbiBqdXN0IHNlbmQgcGxhaW50ZXh0IHBhc3N3b3JkcyBhc1xyXG4vLyBzdHJpbmdzLlxyXG4vL1xyXG4vLyBXaGVuIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgYSBwbGFpbnRleHQgcGFzc3dvcmQgYXMgYSBzdHJpbmcsIGl0IGFsd2F5c1xyXG4vLyBoYXNoZXMgaXQgd2l0aCBTSEEyNTYgYmVmb3JlIHBhc3NpbmcgaXQgaW50byBiY3J5cHQuIFdoZW4gdGhlIHNlcnZlclxyXG4vLyByZWNlaXZlcyBhIHBhc3N3b3JkIGFzIGFuIG9iamVjdCwgaXQgYXNzZXJ0cyB0aGF0IHRoZSBhbGdvcml0aG0gaXNcclxuLy8gXCJzaGEtMjU2XCIgYW5kIHRoZW4gcGFzc2VzIHRoZSBkaWdlc3QgdG8gYmNyeXB0LlxyXG5cclxuLy8gR2l2ZW4gYSAncGFzc3dvcmQnIGZyb20gdGhlIGNsaWVudCwgZXh0cmFjdCB0aGUgc3RyaW5nIHRoYXQgd2Ugc2hvdWxkXHJcbi8vIGJjcnlwdC4gJ3Bhc3N3b3JkJyBjYW4gYmUgb25lIG9mOlxyXG4vLyAgLSBTdHJpbmcgKHRoZSBwbGFpbnRleHQgcGFzc3dvcmQpXHJcbi8vICAtIE9iamVjdCB3aXRoICdkaWdlc3QnIGFuZCAnYWxnb3JpdGhtJyBrZXlzLiAnYWxnb3JpdGhtJyBtdXN0IGJlIFwic2hhLTI1NlwiLlxyXG4vL1xyXG52YXIgZ2V0UGFzc3dvcmRTdHJpbmcgPSBmdW5jdGlvbihwYXNzd29yZCkge1xyXG4gICAgaWYgKHR5cGVvZiBwYXNzd29yZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHBhc3N3b3JkID0gU0hBMjU2KHBhc3N3b3JkKTtcclxuICAgIH0gZWxzZSB7IC8vICdwYXNzd29yZCcgaXMgYW4gb2JqZWN0XHJcbiAgICAgICAgaWYgKHBhc3N3b3JkLmFsZ29yaXRobSAhPT0gXCJzaGEtMjU2XCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW52YWxpZCBwYXNzd29yZCBoYXNoIGFsZ29yaXRobS4gXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJPbmx5ICdzaGEtMjU2JyBpcyBhbGxvd2VkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFzc3dvcmQgPSBwYXNzd29yZC5kaWdlc3Q7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFzc3dvcmQ7XHJcbn07XHJcblxyXG4vLyBVc2UgYmNyeXB0IHRvIGhhc2ggdGhlIHBhc3N3b3JkIGZvciBzdG9yYWdlIGluIHRoZSBkYXRhYmFzZS5cclxuLy8gYHBhc3N3b3JkYCBjYW4gYmUgYSBzdHJpbmcgKGluIHdoaWNoIGNhc2UgaXQgd2lsbCBiZSBydW4gdGhyb3VnaFxyXG4vLyBTSEEyNTYgYmVmb3JlIGJjcnlwdCkgb3IgYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBgZGlnZXN0YCBhbmRcclxuLy8gYGFsZ29yaXRobWAgKGluIHdoaWNoIGNhc2Ugd2UgYmNyeXB0IGBwYXNzd29yZC5kaWdlc3RgKS5cclxuLy9cclxudmFyIGhhc2hQYXNzd29yZCA9IGZ1bmN0aW9uKHBhc3N3b3JkKSB7XHJcbiAgICBwYXNzd29yZCA9IGdldFBhc3N3b3JkU3RyaW5nKHBhc3N3b3JkKTtcclxuICAgIHJldHVybiBiY3J5cHRIYXNoKHBhc3N3b3JkLCBBY2NvdW50cy5fYmNyeXB0Um91bmRzKTtcclxufTtcclxuXHJcbi8vIENoZWNrIHdoZXRoZXIgdGhlIHByb3ZpZGVkIHBhc3N3b3JkIG1hdGNoZXMgdGhlIGJjcnlwdCdlZCBwYXNzd29yZCBpblxyXG4vLyB0aGUgZGF0YWJhc2UgdXNlciByZWNvcmQuIGBwYXNzd29yZGAgY2FuIGJlIGEgc3RyaW5nIChpbiB3aGljaCBjYXNlXHJcbi8vIGl0IHdpbGwgYmUgcnVuIHRocm91Z2ggU0hBMjU2IGJlZm9yZSBiY3J5cHQpIG9yIGFuIG9iamVjdCB3aXRoXHJcbi8vIHByb3BlcnRpZXMgYGRpZ2VzdGAgYW5kIGBhbGdvcml0aG1gIChpbiB3aGljaCBjYXNlIHdlIGJjcnlwdFxyXG4vLyBgcGFzc3dvcmQuZGlnZXN0YCkuXHJcbi8vXHJcbkFjY291bnRzLl9jaGVja1Bob25lUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xyXG4gICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICB1c2VySWQ6IHVzZXIuX2lkXHJcbiAgICB9O1xyXG5cclxuICAgIHBhc3N3b3JkID0gZ2V0UGFzc3dvcmRTdHJpbmcocGFzc3dvcmQpO1xyXG5cclxuICAgIGlmICghYmNyeXB0Q29tcGFyZShwYXNzd29yZCwgdXNlci5zZXJ2aWNlcy5waG9uZS5iY3J5cHQpKSB7XHJcbiAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbnZhciBjaGVja1Bhc3N3b3JkID0gQWNjb3VudHMuX2NoZWNrUGhvbmVQYXNzd29yZDtcclxuXHJcbi8vL1xyXG4vLy8gTE9HSU5cclxuLy8vXHJcblxyXG4vLyBVc2VycyBjYW4gc3BlY2lmeSB2YXJpb3VzIGtleXMgdG8gaWRlbnRpZnkgdGhlbXNlbHZlcyB3aXRoLlxyXG4vLyBAcGFyYW0gdXNlciB7T2JqZWN0fSB3aXRoIGBpZGAgb3IgYHBob25lYC5cclxuLy8gQHJldHVybnMgQSBzZWxlY3RvciB0byBwYXNzIHRvIG1vbmdvIHRvIGdldCB0aGUgdXNlciByZWNvcmQuXHJcblxyXG52YXIgc2VsZWN0b3JGcm9tVXNlclF1ZXJ5ID0gZnVuY3Rpb24odXNlcikge1xyXG4gICAgaWYgKHVzZXIuaWQpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgX2lkOiB1c2VyLmlkXHJcbiAgICAgICAgfTtcclxuICAgIGVsc2UgaWYgKHVzZXIucGhvbmUpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgJ3Bob25lLm51bWJlcic6IHVzZXIucGhvbmVcclxuICAgICAgICB9O1xyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwic2hvdWxkbid0IGhhcHBlbiAodmFsaWRhdGlvbiBtaXNzZWQgc29tZXRoaW5nKVwiKTtcclxufTtcclxuXHJcbnZhciBmaW5kVXNlckZyb21Vc2VyUXVlcnkgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICB2YXIgc2VsZWN0b3IgPSBzZWxlY3RvckZyb21Vc2VyUXVlcnkodXNlcik7XHJcblxyXG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShzZWxlY3Rvcik7XHJcbiAgICBpZiAoIXVzZXIpXHJcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBub3QgZm91bmRcIik7XHJcblxyXG4gICAgcmV0dXJuIHVzZXI7XHJcbn07XHJcblxyXG4vLyBYWFggbWF5YmUgdGhpcyBiZWxvbmdzIGluIHRoZSBjaGVjayBwYWNrYWdlXHJcbnZhciBOb25FbXB0eVN0cmluZyA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHgpIHtcclxuICAgIGNoZWNrKHgsIFN0cmluZyk7XHJcbiAgICByZXR1cm4geC5sZW5ndGggPiAwO1xyXG59KTtcclxuXHJcbnZhciB1c2VyUXVlcnlWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XHJcbiAgICBjaGVjayh1c2VyLCB7XHJcbiAgICAgICAgaWQ6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKSxcclxuICAgICAgICBwaG9uZTogTWF0Y2guT3B0aW9uYWwoTm9uRW1wdHlTdHJpbmcpXHJcbiAgICB9KTtcclxuICAgIGlmIChfLmtleXModXNlcikubGVuZ3RoICE9PSAxKVxyXG4gICAgICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcihcIlVzZXIgcHJvcGVydHkgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGZpZWxkXCIpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn0pO1xyXG5cclxudmFyIHBhc3N3b3JkVmFsaWRhdG9yID0gTWF0Y2guT25lT2YoXHJcbiAgICBTdHJpbmcsIHtcclxuICAgICAgICBkaWdlc3Q6IFN0cmluZyxcclxuICAgICAgICBhbGdvcml0aG06IFN0cmluZ1xyXG4gICAgfVxyXG4pO1xyXG5cclxuLy8gSGFuZGxlciB0byBsb2dpbiB3aXRoIGEgcGhvbmUuXHJcbi8vXHJcbi8vIFRoZSBNZXRlb3IgY2xpZW50IHNldHMgb3B0aW9ucy5wYXNzd29yZCB0byBhbiBvYmplY3Qgd2l0aCBrZXlzXHJcbi8vICdkaWdlc3QnIChzZXQgdG8gU0hBMjU2KHBhc3N3b3JkKSkgYW5kICdhbGdvcml0aG0nIChcInNoYS0yNTZcIikuXHJcbi8vXHJcbi8vIEZvciBvdGhlciBERFAgY2xpZW50cyB3aGljaCBkb24ndCBoYXZlIGFjY2VzcyB0byBTSEEsIHRoZSBoYW5kbGVyXHJcbi8vIGFsc28gYWNjZXB0cyB0aGUgcGxhaW50ZXh0IHBhc3N3b3JkIGluIG9wdGlvbnMucGFzc3dvcmQgYXMgYSBzdHJpbmcuXHJcbi8vXHJcbi8vIChJdCBtaWdodCBiZSBuaWNlIGlmIHNlcnZlcnMgY291bGQgdHVybiB0aGUgcGxhaW50ZXh0IHBhc3N3b3JkXHJcbi8vIG9wdGlvbiBvZmYuIE9yIG1heWJlIGl0IHNob3VsZCBiZSBvcHQtaW4sIG5vdCBvcHQtb3V0P1xyXG4vLyBBY2NvdW50cy5jb25maWcgb3B0aW9uPylcclxuLy9cclxuLy8gTm90ZSB0aGF0IG5laXRoZXIgcGFzc3dvcmQgb3B0aW9uIGlzIHNlY3VyZSB3aXRob3V0IFNTTC5cclxuLy9cclxuQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIoXCJwaG9uZVwiLCBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICBpZiAoIW9wdGlvbnMucGFzc3dvcmQgfHwgb3B0aW9ucy5zcnApXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZG9uJ3QgaGFuZGxlXHJcblxyXG4gICAgY2hlY2sob3B0aW9ucywge1xyXG4gICAgICAgIHVzZXI6IHVzZXJRdWVyeVZhbGlkYXRvcixcclxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRWYWxpZGF0b3JcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciB1c2VyID0gZmluZFVzZXJGcm9tVXNlclF1ZXJ5KG9wdGlvbnMudXNlcik7XHJcblxyXG4gICAgaWYgKCF1c2VyLnNlcnZpY2VzIHx8ICF1c2VyLnNlcnZpY2VzLnBob25lIHx8ICEodXNlci5zZXJ2aWNlcy5waG9uZS5iY3J5cHQgfHwgdXNlci5zZXJ2aWNlcy5waG9uZS5zcnApKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcclxuXHJcbiAgICBpZiAoIXVzZXIuc2VydmljZXMucGhvbmUuYmNyeXB0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnBhc3N3b3JkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSBjbGllbnQgaGFzIHByZXNlbnRlZCBhIHBsYWludGV4dCBwYXNzd29yZCwgYW5kIHRoZSB1c2VyIGlzXHJcbiAgICAgICAgICAgIC8vIG5vdCB1cGdyYWRlZCB0byBiY3J5cHQgeWV0LiBXZSBkb24ndCBhdHRlbXB0IHRvIHRlbGwgdGhlIGNsaWVudFxyXG4gICAgICAgICAgICAvLyB0byB1cGdyYWRlIHRvIGJjcnlwdCwgYmVjYXVzZSBpdCBtaWdodCBiZSBhIHN0YW5kYWxvbmUgRERQXHJcbiAgICAgICAgICAgIC8vIGNsaWVudCBkb2Vzbid0IGtub3cgaG93IHRvIGRvIHN1Y2ggYSB0aGluZy5cclxuICAgICAgICAgICAgdmFyIHZlcmlmaWVyID0gdXNlci5zZXJ2aWNlcy5waG9uZS5zcnA7XHJcbiAgICAgICAgICAgIHZhciBuZXdWZXJpZmllciA9IFNSUC5nZW5lcmF0ZVZlcmlmaWVyKG9wdGlvbnMucGFzc3dvcmQsIHtcclxuICAgICAgICAgICAgICAgIGlkZW50aXR5OiB2ZXJpZmllci5pZGVudGl0eSxcclxuICAgICAgICAgICAgICAgIHNhbHQ6IHZlcmlmaWVyLnNhbHRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodmVyaWZpZXIudmVyaWZpZXIgIT09IG5ld1ZlcmlmaWVyLnZlcmlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkluY29ycmVjdCBwYXNzd29yZFwiKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUZWxsIHRoZSBjbGllbnQgdG8gdXNlIHRoZSBTUlAgdXBncmFkZSBwcm9jZXNzLlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJvbGQgcGFzc3dvcmQgZm9ybWF0XCIsIEVKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdzcnAnLFxyXG4gICAgICAgICAgICAgICAgaWRlbnRpdHk6IHVzZXIuc2VydmljZXMucGhvbmUuc3JwLmlkZW50aXR5XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNoZWNrUGFzc3dvcmQoXHJcbiAgICAgICAgdXNlcixcclxuICAgICAgICBvcHRpb25zLnBhc3N3b3JkXHJcbiAgICApO1xyXG59KTtcclxuXHJcbi8vIEhhbmRsZXIgdG8gbG9naW4gdXNpbmcgdGhlIFNSUCB1cGdyYWRlIHBhdGguIFRvIHVzZSB0aGlzIGxvZ2luXHJcbi8vIGhhbmRsZXIsIHRoZSBjbGllbnQgbXVzdCBwcm92aWRlOlxyXG4vLyAgIC0gc3JwOiBIKGlkZW50aXR5ICsgXCI6XCIgKyBwYXNzd29yZClcclxuLy8gICAtIHBhc3N3b3JkOiBhIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzICdkaWdlc3QnIGFuZCAnYWxnb3JpdGhtJ1xyXG4vL1xyXG4vLyBXZSB1c2UgYG9wdGlvbnMuc3JwYCB0byB2ZXJpZnkgdGhhdCB0aGUgY2xpZW50IGtub3dzIHRoZSBjb3JyZWN0XHJcbi8vIHBhc3N3b3JkIHdpdGhvdXQgZG9pbmcgYSBmdWxsIFNSUCBmbG93LiBPbmNlIHdlJ3ZlIGNoZWNrZWQgdGhhdCwgd2VcclxuLy8gdXBncmFkZSB0aGUgdXNlciB0byBiY3J5cHQgYW5kIHJlbW92ZSB0aGUgU1JQIGluZm9ybWF0aW9uIGZyb20gdGhlXHJcbi8vIHVzZXIgZG9jdW1lbnQuXHJcbi8vXHJcbi8vIFRoZSBjbGllbnQgZW5kcyB1cCB1c2luZyB0aGlzIGxvZ2luIGhhbmRsZXIgYWZ0ZXIgdHJ5aW5nIHRoZSBub3JtYWxcclxuLy8gbG9naW4gaGFuZGxlciAoYWJvdmUpLCB3aGljaCB0aHJvd3MgYW4gZXJyb3IgdGVsbGluZyB0aGUgY2xpZW50IHRvXHJcbi8vIHRyeSB0aGUgU1JQIHVwZ3JhZGUgcGF0aC5cclxuLy9cclxuLy8gWFhYIENPTVBBVCBXSVRIIDAuOC4xLjNcclxuQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIoXCJwaG9uZVwiLCBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICBpZiAoIW9wdGlvbnMuc3JwIHx8ICFvcHRpb25zLnBhc3N3b3JkKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIGRvbid0IGhhbmRsZVxyXG5cclxuICAgIGNoZWNrKG9wdGlvbnMsIHtcclxuICAgICAgICB1c2VyOiB1c2VyUXVlcnlWYWxpZGF0b3IsXHJcbiAgICAgICAgc3JwOiBTdHJpbmcsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkVmFsaWRhdG9yXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgdXNlciA9IGZpbmRVc2VyRnJvbVVzZXJRdWVyeShvcHRpb25zLnVzZXIpO1xyXG5cclxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiBhbm90aGVyIHNpbXVsdGFuZW91cyBsb2dpbiBoYXMgYWxyZWFkeSB1cGdyYWRlZFxyXG4gICAgLy8gdGhlIHVzZXIgcmVjb3JkIHRvIGJjcnlwdC5cclxuICAgIGlmICh1c2VyLnNlcnZpY2VzICYmIHVzZXIuc2VydmljZXMucGhvbmUgJiZcclxuICAgICAgICB1c2VyLnNlcnZpY2VzLnBob25lLmJjcnlwdClcclxuICAgICAgICByZXR1cm4gY2hlY2tQYXNzd29yZCh1c2VyLCBvcHRpb25zLnBhc3N3b3JkKTtcclxuXHJcbiAgICBpZiAoISh1c2VyLnNlcnZpY2VzICYmIHVzZXIuc2VydmljZXMucGhvbmUgJiYgdXNlci5zZXJ2aWNlcy5waG9uZS5zcnApKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcclxuXHJcbiAgICB2YXIgdjEgPSB1c2VyLnNlcnZpY2VzLnBob25lLnNycC52ZXJpZmllcjtcclxuICAgIHZhciB2MiA9IFNSUC5nZW5lcmF0ZVZlcmlmaWVyKFxyXG4gICAgICAgIG51bGwsIHtcclxuICAgICAgICAgICAgaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZDogb3B0aW9ucy5zcnAsXHJcbiAgICAgICAgICAgIHNhbHQ6IHVzZXIuc2VydmljZXMucGhvbmUuc3JwLnNhbHRcclxuICAgICAgICB9XHJcbiAgICApLnZlcmlmaWVyO1xyXG4gICAgaWYgKHYxICE9PSB2MilcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAvLyBVcGdyYWRlIHRvIGJjcnlwdCBvbiBzdWNjZXNzZnVsIGxvZ2luLlxyXG4gICAgdmFyIHNhbHRlZCA9IGhhc2hQYXNzd29yZChvcHRpb25zLnBhc3N3b3JkKTtcclxuICAgIE1ldGVvci51c2Vycy51cGRhdGUoXHJcbiAgICAgICAgdXNlci5faWQsIHtcclxuICAgICAgICAgICAgJHVuc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAnc2VydmljZXMucGhvbmUuc3JwJzogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAnc2VydmljZXMucGhvbmUuYmNyeXB0Jzogc2FsdGVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXNlcklkOiB1c2VyLl9pZFxyXG4gICAgfTtcclxufSk7XHJcblxyXG4vLyBGb3JjZSBjaGFuZ2UgdGhlIHVzZXJzIHBob25lIHBhc3N3b3JkLlxyXG5cclxuLyoqXHJcbiAqIEBzdW1tYXJ5IEZvcmNpYmx5IGNoYW5nZSB0aGUgcGFzc3dvcmQgZm9yIGEgdXNlci5cclxuICogQGxvY3VzIFNlcnZlclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBpZCBvZiB0aGUgdXNlciB0byB1cGRhdGUuXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuZXdQYXNzd29yZCBBIG5ldyBwYXNzd29yZCBmb3IgdGhlIHVzZXIuXHJcbiAqL1xyXG5BY2NvdW50cy5zZXRQaG9uZVBhc3N3b3JkID0gZnVuY3Rpb24odXNlcklkLCBuZXdQbGFpbnRleHRQYXNzd29yZCkge1xyXG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VySWQpO1xyXG4gICAgaWYgKCF1c2VyKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgbm90IGZvdW5kXCIpO1xyXG5cclxuICAgIE1ldGVvci51c2Vycy51cGRhdGUoe1xyXG4gICAgICAgIF9pZDogdXNlci5faWRcclxuICAgIH0sIHtcclxuICAgICAgICAkdW5zZXQ6IHtcclxuICAgICAgICAgICAgJ3NlcnZpY2VzLnBob25lLnNycCc6IDEsIC8vIFhYWCBDT01QQVQgV0lUSCAwLjguMS4zXHJcbiAgICAgICAgICAgICdzZXJ2aWNlcy5waG9uZS52ZXJpZnknOiAxLFxyXG4gICAgICAgICAgICAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zJzogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAnc2VydmljZXMucGhvbmUuYmNyeXB0JzogaGFzaFBhc3N3b3JkKG5ld1BsYWludGV4dFBhc3N3b3JkKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuLy8vXHJcbi8vLyBTZW5kIHBob25lIFZFUklGSUNBVElPTiBjb2RlXHJcbi8vL1xyXG5cclxuLy8gc2VuZCB0aGUgdXNlciBhIHNtcyB3aXRoIGEgY29kZSB0aGF0IGNhbiBiZSB1c2VkIHRvIHZlcmlmeSBudW1iZXJcclxuXHJcbi8qKlxyXG4gKiBAc3VtbWFyeSBTZW5kIGFuIFNNUyB3aXRoIGEgY29kZSB0aGUgdXNlciBjYW4gdXNlIHZlcmlmeSB0aGVpciBwaG9uZSBudW1iZXIgd2l0aC5cclxuICogQGxvY3VzIFNlcnZlclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBpZCBvZiB0aGUgdXNlciB0byBzZW5kIGVtYWlsIHRvLlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW3Bob25lXSBPcHRpb25hbC4gV2hpY2ggcGhvbmUgb2YgdGhlIHVzZXIncyB0byBzZW5kIHRoZSBTTVMgdG8uIFRoaXMgcGhvbmUgbXVzdCBiZSBpbiB0aGUgdXNlcidzIGBwaG9uZXNgIGxpc3QuIERlZmF1bHRzIHRvIHRoZSBmaXJzdCB1bnZlcmlmaWVkIHBob25lIGluIHRoZSBsaXN0LlxyXG4gKi9cclxuQWNjb3VudHMuc2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZSA9IGZ1bmN0aW9uKHVzZXJJZCwgcGhvbmUpIHtcclxuICAgIC8vIFhYWCBBbHNvIGdlbmVyYXRlIGEgbGluayB1c2luZyB3aGljaCBzb21lb25lIGNhbiBkZWxldGUgdGhpc1xyXG4gICAgLy8gYWNjb3VudCBpZiB0aGV5IG93biBzYWlkIG51bWJlciBidXQgd2VyZW4ndCB0aG9zZSB3aG8gY3JlYXRlZFxyXG4gICAgLy8gdGhpcyBhY2NvdW50LlxyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgdXNlciBleGlzdHMsIGFuZCBwaG9uZSBpcyBvbmUgb2YgdGhlaXIgcGhvbmVzLlxyXG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VySWQpO1xyXG4gICAgaWYgKCF1c2VyKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkNhbid0IGZpbmQgdXNlclwiKTtcclxuICAgIC8vIHBpY2sgdGhlIGZpcnN0IHVudmVyaWZpZWQgcGhvbmUgaWYgd2Ugd2VyZW4ndCBwYXNzZWQgYW4gcGhvbmUuXHJcbiAgICBpZiAoIXBob25lICYmIHVzZXIucGhvbmUpIHtcclxuICAgICAgICBwaG9uZSA9IHVzZXIucGhvbmUgJiYgdXNlci5waG9uZS5udW1iZXI7XHJcbiAgICB9XHJcbiAgICAvLyBtYWtlIHN1cmUgd2UgaGF2ZSBhIHZhbGlkIHBob25lXHJcbiAgICBpZiAoIXBob25lKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIk5vIHN1Y2ggcGhvbmUgZm9yIHVzZXIuXCIpO1xyXG5cclxuICAgIHZhciBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSh1c2VySWQsIHRydWUpO1xyXG4gICAgLy8gSWYgc2VudCBtb3JlIHRoYW4gbWF4IHJldHJ5IHdhaXRcclxuICAgIHZhciB3YWl0VGltZUJldHdlZW5SZXRyaWVzID0gQWNjb3VudHMuX29wdGlvbnMudmVyaWZpY2F0aW9uV2FpdFRpbWU7XHJcbiAgICB2YXIgbWF4UmV0cnlDb3VudHMgPSBBY2NvdW50cy5fb3B0aW9ucy52ZXJpZmljYXRpb25NYXhSZXRyaWVzO1xyXG5cclxuICAgIHZhciB2ZXJpZnlPYmplY3QgPSB7XHJcbiAgICAgICAgbnVtT2ZSZXRyaWVzOiAwXHJcbiAgICB9O1xyXG4gICAgaWYgKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5waG9uZSAmJiB1c2VyLnNlcnZpY2VzLnBob25lLnZlcmlmeSkge1xyXG4gICAgICAgIHZlcmlmeU9iamVjdCA9IHVzZXIuc2VydmljZXMucGhvbmUudmVyaWZ5O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjdXJUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIC8vIENoZWNrIGlmIGxhc3QgcmV0cnkgd2FzIHRvbyBzb29uXHJcbiAgICB2YXIgbmV4dFJldHJ5RGF0ZSA9IHZlcmlmeU9iamVjdCAmJiB2ZXJpZnlPYmplY3QubGFzdFJldHJ5ICYmIG5ldyBEYXRlKHZlcmlmeU9iamVjdC5sYXN0UmV0cnkuZ2V0VGltZSgpICsgd2FpdFRpbWVCZXR3ZWVuUmV0cmllcyk7XHJcbiAgICBpZiAobmV4dFJldHJ5RGF0ZSAmJiBuZXh0UmV0cnlEYXRlID4gY3VyVGltZSkge1xyXG4gICAgICAgIHZhciB3YWl0VGltZUluU2VjID0gTWF0aC5jZWlsKE1hdGguYWJzKChuZXh0UmV0cnlEYXRlIC0gY3VyVGltZSkgLyAxMDAwKSksXHJcbiAgICAgICAgICAgIGVyck1zZyA9IFRBUGkxOG4uX18oJ2FjY291bnRzX3Bob25lX3Rvb19vZnRlbl9yZXRyaWVzJywge1xyXG4gICAgICAgICAgICAgICAgczogd2FpdFRpbWVJblNlY1xyXG4gICAgICAgICAgICB9LCBsb2NhbGUpO1xyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBlcnJNc2cpO1xyXG4gICAgfVxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgd2hlcmUgdG9vIG1hbnkgcmV0cmllc1xyXG4gICAgLy8gaWYgKHZlcmlmeU9iamVjdC5udW1PZlJldHJpZXMgPiBtYXhSZXRyeUNvdW50cykge1xyXG4gICAgLy8gICAgIC8vIENoZWNrIGlmIHBhc3NlZCBlbm91Z2ggdGltZSBzaW5jZSBsYXN0IHJldHJ5XHJcbiAgICAvLyAgICAgdmFyIHdhaXRUaW1lQmV0d2Vlbk1heFJldHJpZXMgPSBBY2NvdW50cy5fb3B0aW9ucy52ZXJpZmljYXRpb25SZXRyaWVzV2FpdFRpbWU7XHJcbiAgICAvLyAgICAgbmV4dFJldHJ5RGF0ZSA9IG5ldyBEYXRlKHZlcmlmeU9iamVjdC5sYXN0UmV0cnkuZ2V0VGltZSgpICsgd2FpdFRpbWVCZXR3ZWVuTWF4UmV0cmllcyk7XHJcbiAgICAvLyAgICAgaWYgKG5leHRSZXRyeURhdGUgPiBjdXJUaW1lKSB7XHJcbiAgICAvLyAgICAgICAgIHZhciB3YWl0VGltZUluTWluID0gTWF0aC5jZWlsKE1hdGguYWJzKChuZXh0UmV0cnlEYXRlIC0gY3VyVGltZSkgLyA2MDAwMCkpLFxyXG4gICAgLy8gICAgICAgICAgICAgZXJyTXNnID0gVEFQaTE4bi5fXygnYWNjb3VudHNfcGhvbmVfdG9vX21hbnlfcmV0cmllcycse206d2FpdFRpbWVJbk1pbn0sbG9jYWxlKTtcclxuICAgIC8vICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZyk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgdmVyaWZ5T2JqZWN0LmNvZGUgPSBnZXRSYW5kb21Db2RlKEFjY291bnRzLl9vcHRpb25zLnZlcmlmaWNhdGlvbkNvZGVMZW5ndGgpO1xyXG4gICAgdmVyaWZ5T2JqZWN0LnBob25lID0gcGhvbmU7XHJcbiAgICB2ZXJpZnlPYmplY3QubGFzdFJldHJ5ID0gY3VyVGltZTtcclxuICAgIHZlcmlmeU9iamVjdC5udW1PZlJldHJpZXMrKztcclxuXHJcbiAgICBNZXRlb3IudXNlcnMudXBkYXRlKHtcclxuICAgICAgICBfaWQ6IHVzZXJJZFxyXG4gICAgfSwge1xyXG4gICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgJ3NlcnZpY2VzLnBob25lLnZlcmlmeSc6IHZlcmlmeU9iamVjdFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGJlZm9yZSBwYXNzaW5nIHRvIHRlbXBsYXRlLCB1cGRhdGUgdXNlciBvYmplY3Qgd2l0aCBuZXcgdG9rZW5cclxuICAgIE1ldGVvci5fZW5zdXJlKHVzZXIsICdzZXJ2aWNlcycsICdwaG9uZScpO1xyXG4gICAgdXNlci5zZXJ2aWNlcy5waG9uZS52ZXJpZnkgPSB2ZXJpZnlPYmplY3Q7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdG86IHBob25lLFxyXG4gICAgICAgIGZyb206IFNNUy5waG9uZVRlbXBsYXRlcy5mcm9tLFxyXG4gICAgICAgIGJvZHk6IFNNUy5waG9uZVRlbXBsYXRlcy50ZXh0KHVzZXIsIHZlcmlmeU9iamVjdC5jb2RlKVxyXG4gICAgfTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLnNtcyAmJiBNZXRlb3Iuc2V0dGluZ3Muc21zLnR3aWxpbykge1xyXG4gICAgICAgICAgICBTTVMuc2VuZChvcHRpb25zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdmVyaWZ5T2JqZWN0LmNvZGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8g5Y+R6YCB5omL5py655+t5L+hXHJcbiAgICAgICAgICAgIFNNU1F1ZXVlLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgRm9ybWF0OiAnSlNPTicsXHJcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcclxuICAgICAgICAgICAgICAgIFBhcmFtU3RyaW5nOiBKU09OLnN0cmluZ2lmeShwYXJhbXMpLFxyXG4gICAgICAgICAgICAgICAgUmVjTnVtOiBwaG9uZS5zdWJzdHJpbmcoMyksXHJcbiAgICAgICAgICAgICAgICBTaWduTmFtZTogJ09B57O757ufJyxcclxuICAgICAgICAgICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182MzM3MDQ1NScsXHJcbiAgICAgICAgICAgICAgICBtc2c6IFRBUGkxOG4uX18oJ3Ntcy5tb2JpbGVfdmVyaWZpY2F0aW9uX2NvZGUudGVtcGxhdGUnLCBwYXJhbXMsIGxvY2FsZSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignU01TIEZhaWxlZCwgU29tZXRoaW5nIGJhZCBoYXBwZW5lZCEnLCBlKTtcclxuICAgICAgICB2YXIgZXJyTXNnID0gVEFQaTE4bi5fXygnYWNjb3VudHNfcGhvbmVfc21zX2ZhaWxlZCcsIHt9LCBsb2NhbGUpO1xyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBlcnJNc2cpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gU2VuZCBTTVMgd2l0aCBjb2RlIHRvIHVzZXIuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgIHJlcXVlc3RQaG9uZVZlcmlmaWNhdGlvbjogZnVuY3Rpb24ocGhvbmUsIGxvY2FsZSwgY2hlY2tWZXJpZmllZCkge1xyXG4gICAgICAgIGlmIChwaG9uZSkge1xyXG4gICAgICAgICAgICBjaGVjayhwaG9uZSwgU3RyaW5nKTtcclxuICAgICAgICAgICAgLy8gQ2hhbmdlIHBob25lIGZvcm1hdCB0byBpbnRlcm5hdGlvbmFsIFNNUyBmb3JtYXRcclxuICAgICAgICAgICAgcGhvbmUgPSBub3JtYWxpemVQaG9uZShwaG9uZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXBob25lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdXNlcklkID0gdGhpcy51c2VySWQ7XHJcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcclxuICAgICAgICAgICAgLy8gR2V0IHVzZXIgYnkgcGhvbmUgbnVtYmVyXHJcbiAgICAgICAgICAgIHZhciB1c2VyT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICdwaG9uZS5udW1iZXInOiBwaG9uZSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmKGNoZWNrVmVyaWZpZWQpe1xyXG4gICAgICAgICAgICAgICAgdXNlck9wdGlvbnNbJ3Bob25lLnZlcmlmaWVkJ10gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlck9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdfaWQnOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdVc2VyKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VySWQgPSBleGlzdGluZ1VzZXIgJiYgZXhpc3RpbmdVc2VyLl9pZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdXNlciB3aXRoIHBob25lIG51bWJlclxyXG4gICAgICAgICAgICAgICAgLy8gdXNlcklkID0gY3JlYXRlVXNlcih7cGhvbmU6cGhvbmV9KTtcclxuICAgICAgICAgICAgICAgIC8vIOaaguaXtuS4jeWFgeiuuOmAmui/h+aJi+acuuWIm+W7uuaWsOi0puaIt++8jOWboOS4uuWPr+iDveS8mui3n+ayoeaciemFjee9ruaJi+acuuWPt+eahOiAgei0puaIt+WGsueqgVxyXG4gICAgICAgICAgICAgICAgdmFyIGVyck1zZyA9IFRBUGkxOG4uX18oJ2FjY291bnRzX3Bob25lX3VzZXJfbm90X2ZvdW5kJywge30sIGxvY2FsZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgZXJyTXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAvLyDlt7LnmbvlvZXnlKjmiLfvvIzmnInlj6/og73pnIDopoHmiYvmnLrlj7flt7Lpqozor4HmiY3lj5Hpqozor4HnoIHvvIzmr5TlpoLpgJrov4fmiYvmnLrlj7fmib7lm57lr4bnoIFcclxuICAgICAgICAgICAgaWYoY2hlY2tWZXJpZmllZCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIF9pZDogdXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgICdwaG9uZS5udW1iZXInOiBwaG9uZSxcclxuICAgICAgICAgICAgICAgICAgICAncGhvbmUudmVyaWZpZWQnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmKCF2YWxpZFVzZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJNc2cgPSBUQVBpMThuLl9fKCdhY2NvdW50c19waG9uZV92ZXJpZnlfZmFpbCcsIHt9LCBsb2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBlcnJNc2cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFjY291bnRzLnNlbmRQaG9uZVZlcmlmaWNhdGlvbkNvZGUodXNlcklkLCBwaG9uZSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLy8gVGFrZSBjb2RlIGZyb20gc2VuZFZlcmlmaWNhdGlvblBob25lIFNNUywgbWFyayB0aGUgcGhvbmUgYXMgdmVyaWZpZWQsXHJcbi8vIENoYW5nZSBwYXNzd29yZCBpZiBuZWVkZWRcclxuLy8gYW5kIGxvZyB0aGVtIGluLlxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICB2ZXJpZnlQaG9uZTogZnVuY3Rpb24ocGhvbmUsIG1vYmlsZSwgY29kZSwgbmV3UGFzc3dvcmQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgbmVlZHMgdG8gY2hhbmdlIHBhc3N3b3JkXHJcbiAgICAgICAgdmFyIHVzZXJJZCA9IHRoaXMudXNlcklkO1xyXG5cclxuICAgICAgICByZXR1cm4gQWNjb3VudHMuX2xvZ2luTWV0aG9kKFxyXG4gICAgICAgICAgICBzZWxmLFxyXG4gICAgICAgICAgICBcInZlcmlmeVBob25lXCIsXHJcbiAgICAgICAgICAgIGFyZ3VtZW50cyxcclxuICAgICAgICAgICAgXCJwaG9uZVwiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrKGNvZGUsIFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICBjaGVjayhtb2JpbGUsIFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICBjaGVjayhwaG9uZSwgU3RyaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJDb2RlIGlzIG11c3QgYmUgcHJvdmlkZWQgdG8gbWV0aG9kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gQ2hhbmdlIHBob25lIGZvcm1hdCB0byBpbnRlcm5hdGlvbmFsIFNNUyBmb3JtYXRcclxuICAgICAgICAgICAgICAgIHBob25lID0gbm9ybWFsaXplUGhvbmUocGhvbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXBob25lKXtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19waG9uZV9pbnZhbGlkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB1c2VyO1xyXG4gICAgICAgICAgICAgICAgLy8g5Zug57uR5a6a5L+u5pS55omL5py65Y+36KaB5rGC5YWI6aqM6K+B6YCa6L+H5omN5pu05paw5omL5py65Y+377yM5omA5Lul6L+Z6YeM5LiN5Y+v5Lul6YCa6L+H5omL5py65Y+35om+55So5oi377yM5Y+q6IO95om+5b2T5YmN55m75b2V55So5oi3XHJcbiAgICAgICAgICAgICAgICAvLyDov5nmoLfnmoTor53vvIzlr7nkuo7lt7LnmbvlvZXnlKjmiLfmnaXor7TvvIzlsLHlj6rog73pqozor4Hoh6rlt7HnmoTmiYvmnLrlj7fkuoZcclxuICAgICAgICAgICAgICAgIGlmKHVzZXJJZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogdXNlcklkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmUubnVtYmVyXCI6IHBob25lXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdXNlcilcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19waG9uZV9pbnZhbGlkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFZlcmlmeSBjb2RlIGlzIGFjY2VwdGVkIG9yIG1hc3RlciBjb2RlXHJcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXIuc2VydmljZXMucGhvbmUgfHwgIXVzZXIuc2VydmljZXMucGhvbmUudmVyaWZ5IHx8ICF1c2VyLnNlcnZpY2VzLnBob25lLnZlcmlmeS5jb2RlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKHVzZXIuc2VydmljZXMucGhvbmUudmVyaWZ5LmNvZGUgIT0gY29kZSAmJiAhaXNNYXN0ZXJDb2RlKGNvZGUpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2NvZGVfaW52YWxpZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2V0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Bob25lLnZlcmlmaWVkJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Bob25lLm1vZGlmaWVkJzogbmV3IERhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdW5TZXRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2VydmljZXMucGhvbmUudmVyaWZ5JzogMVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodXNlcklkKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyDlvZPnlKjmiLfpqozor4Hnu5Hlrproh6rlt7HnmoTmiYvmnLrlj7fml7bvvIzmiormiYvmnLrlj7fkuIDotbfmlLnmjonvvIzlsLHkuI3nlKjlho3ljZXni6zosIPnlKjkv67mlLnmiYvmnLrlj7fnmoTmjqXlj6PkuoZcclxuICAgICAgICAgICAgICAgICAgICBzZXRPcHRpb25zWydwaG9uZS5udW1iZXInXSA9IHBob25lO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldE9wdGlvbnNbJ3Bob25lLm1vYmlsZSddID0gbW9iaWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHJlc2V0VG9PbGRUb2tlbjtcclxuICAgICAgICAgICAgICAgIC8vIElmIG5lZWRzIHRvIHVwZGF0ZSBwYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1Bhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2sobmV3UGFzc3dvcmQsIHBhc3N3b3JkVmFsaWRhdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaGFzaGVkID0gaGFzaFBhc3N3b3JkKG5ld1Bhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogV2UncmUgYWJvdXQgdG8gaW52YWxpZGF0ZSB0b2tlbnMgb24gdGhlIHVzZXIsIHdobyB3ZSBtaWdodCBiZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvZ2dlZCBpbiBhcy4gTWFrZSBzdXJlIHRvIGF2b2lkIGxvZ2dpbmcgb3Vyc2VsdmVzIG91dCBpZiB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFwcGVucy4gQnV0IGFsc28gbWFrZSBzdXJlIG5vdCB0byBsZWF2ZSB0aGUgY29ubmVjdGlvbiBpbiBhIHN0YXRlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb2YgaGF2aW5nIGEgYmFkIHRva2VuIHNldCBpZiB0aGluZ3MgZmFpbC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkVG9rZW4gPSBBY2NvdW50cy5fZ2V0TG9naW5Ub2tlbihzZWxmLmNvbm5lY3Rpb24uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFjY291bnRzLl9zZXRMb2dpblRva2VuKHVzZXIuX2lkLCBzZWxmLmNvbm5lY3Rpb24sIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc2V0VG9PbGRUb2tlbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBY2NvdW50cy5fc2V0TG9naW5Ub2tlbih1c2VyLl9pZCwgc2VsZi5jb25uZWN0aW9uLCBvbGRUb2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0T3B0aW9uc1snc2VydmljZXMucGhvbmUuYmNyeXB0J10gPSBoYXNoZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5TZXRPcHRpb25zWydzZXJ2aWNlcy5waG9uZS5zcnAnXSA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWinuWKoOivpeihjOS7o+eggeaJp+ihjG1ldGVvcuWGhee9rueahOWvhueggeiuvue9ruWKn+iDvVxyXG4gICAgICAgICAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXIuX2lkLCBuZXdQYXNzd29yZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogdXNlci5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICdwaG9uZS5udW1iZXInOiBwaG9uZSwvL+aJi+acuuWPt+eZu+W9leS4jeimgeaxgumqjOivgemAmui/h++8jOaJgOS7pei/meS4quadoeS7tuimgeWOu+aOiVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2VydmljZXMucGhvbmUudmVyaWZ5LmNvZGUnOiBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBbGxvdyBtYXN0ZXIgY29kZSBmcm9tIHNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTWFzdGVyQ29kZShjb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcXVlcnlbJ3NlcnZpY2VzLnBob25lLnZlcmlmeS5jb2RlJ107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOmqjOivgemAmui/h+WQju+8jOWPr+S7peS5n+mcgOimgeaKiumHjeWkjeeahOaJi+acuuWPt+WFqOmDqOa4hemZpO+8jOS7peWFjeWQjumdouabtOaWsOaJi+acuuWPt+aXtuaKpeWUr+S4gOaAp+e0ouW8leeahOmUmVxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAncGhvbmUubnVtYmVyJzogcGhvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG5lOiB1c2VyLl9pZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdW5zZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibW9iaWxlXCI6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBob25lXCI6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlcnZpY2VzLnBob25lXCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgdXNlciByZWNvcmQgYnk6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLSBDaGFuZ2luZyB0aGUgcGFzc3dvcmQgdG8gdGhlIG5ldyBvbmVcclxuICAgICAgICAgICAgICAgICAgICAvLyAtIEZvcmdldHRpbmcgYWJvdXQgdGhlIHZlcmlmaWNhdGlvbiBjb2RlIHRoYXQgd2FzIGp1c3QgdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIC0gVmVyaWZ5aW5nIHRoZSBwaG9uZSwgc2luY2UgdGhleSBnb3QgdGhlIGNvZGUgdmlhIHNtcyB0byBwaG9uZS5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWZmZWN0ZWRSZWNvcmRzID0gTWV0ZW9yLnVzZXJzLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHNldE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdW5zZXQ6IHVuU2V0T3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWZmZWN0ZWRSZWNvcmRzICE9PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVyck1zZyA9IHVzZXJJZCA/IFwiYWNjb3VudHNfcGhvbmVfY29kZV91cGRhdGVfZmFpbFwiIDogXCJhY2NvdW50c19waG9uZV9ub3RfZXhpc3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIGVyck1zZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NmdWxWZXJpZmljYXRpb24odXNlci5faWQpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzZXRUb09sZFRva2VuKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRUb09sZFRva2VuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIGFsbCB2YWxpZCBsb2dpbiB0b2tlbnMgd2l0aCBuZXcgb25lcyAoY2hhbmdpbmdcclxuICAgICAgICAgICAgICAgIC8vIHBhc3N3b3JkIHNob3VsZCBpbnZhbGlkYXRlIGV4aXN0aW5nIHNlc3Npb25zKS5cclxuICAgICAgICAgICAgICAgIC8vIEFjY291bnRzLl9jbGVhckFsbExvZ2luVG9rZW5zKHVzZXIuX2lkKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vL1xyXG4vLy8gQ1JFQVRJTkcgVVNFUlNcclxuLy8vXHJcblxyXG4vLyBTaGFyZWQgY3JlYXRlVXNlciBmdW5jdGlvbiBjYWxsZWQgZnJvbSB0aGUgY3JlYXRlVXNlciBtZXRob2QsIGJvdGhcclxuLy8gaWYgb3JpZ2luYXRlcyBpbiBjbGllbnQgb3Igc2VydmVyIGNvZGUuIENhbGxzIHVzZXIgcHJvdmlkZWQgaG9va3MsXHJcbi8vIGRvZXMgdGhlIGFjdHVhbCB1c2VyIGluc2VydGlvbi5cclxuLy9cclxuLy8gcmV0dXJucyB0aGUgdXNlciBpZFxyXG52YXIgY3JlYXRlVXNlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIC8vIFVua25vd24ga2V5cyBhbGxvd2VkLCBiZWNhdXNlIGEgb25DcmVhdGVVc2VySG9vayBjYW4gdGFrZSBhcmJpdHJhcnlcclxuICAgIC8vIG9wdGlvbnMuXHJcbiAgICBjaGVjayhvcHRpb25zLCBNYXRjaC5PYmplY3RJbmNsdWRpbmcoe1xyXG4gICAgICAgIHBob25lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxyXG4gICAgICAgIHBhc3N3b3JkOiBNYXRjaC5PcHRpb25hbChwYXNzd29yZFZhbGlkYXRvcilcclxuICAgIH0pKTtcclxuXHJcbiAgICB2YXIgcGhvbmUgPSBvcHRpb25zLnBob25lO1xyXG4gICAgaWYgKCFwaG9uZSlcclxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJOZWVkIHRvIHNldCBwaG9uZVwiKTtcclxuXHJcbiAgICB2YXIgZXhpc3RpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xyXG4gICAgICAgICdwaG9uZS5udW1iZXInOiBwaG9uZVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGV4aXN0aW5nVXNlcikge1xyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgd2l0aCB0aGlzIHBob25lIG51bWJlciBhbHJlYWR5IGV4aXN0c1wiKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdXNlciA9IHtcclxuICAgICAgICBzZXJ2aWNlczoge31cclxuICAgIH07XHJcbiAgICBpZiAob3B0aW9ucy5wYXNzd29yZCkge1xyXG4gICAgICAgIHZhciBoYXNoZWQgPSBoYXNoUGFzc3dvcmQob3B0aW9ucy5wYXNzd29yZCk7XHJcbiAgICAgICAgdXNlci5zZXJ2aWNlcy5waG9uZSA9IHtcclxuICAgICAgICAgICAgYmNyeXB0OiBoYXNoZWRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVzZXIucGhvbmUgPSB7XHJcbiAgICAgICAgbnVtYmVyOiBwaG9uZSxcclxuICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gQWNjb3VudHMuaW5zZXJ0VXNlckRvYyhvcHRpb25zLCB1c2VyKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgLy8gWFhYIHN0cmluZyBwYXJzaW5nIHN1Y2tzLCBtYXliZVxyXG4gICAgICAgIC8vIGh0dHBzOi8vamlyYS5tb25nb2RiLm9yZy9icm93c2UvU0VSVkVSLTMwNjkgd2lsbCBnZXQgZml4ZWQgb25lIGRheVxyXG4gICAgICAgIGlmIChlLm5hbWUgIT09ICdNb25nb0Vycm9yJykgdGhyb3cgZTtcclxuICAgICAgICB2YXIgbWF0Y2ggPSBlLmVyci5tYXRjaCgvRTExMDAwIGR1cGxpY2F0ZSBrZXkgZXJyb3IgaW5kZXg6IChbXiBdKykvKTtcclxuICAgICAgICBpZiAoIW1hdGNoKSB0aHJvdyBlO1xyXG4gICAgICAgIGlmIChtYXRjaFsxXS5pbmRleE9mKCd1c2Vycy4kcGhvbmUubnVtYmVyJykgIT09IC0xKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJQaG9uZSBudW1iZXIgYWxyZWFkeSBleGlzdHMsIGZhaWxlZCBvbiBjcmVhdGlvbi5cIik7XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIG1ldGhvZCBmb3IgY3JlYXRlIHVzZXIuIFJlcXVlc3RzIGNvbWUgZnJvbSB0aGUgY2xpZW50LlxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICBjcmVhdGVVc2VyV2l0aFBob25lOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xyXG4gICAgICAgIGlmIChvcHRpb25zLnBob25lKSB7XHJcbiAgICAgICAgICAgIGNoZWNrKG9wdGlvbnMucGhvbmUsIFN0cmluZyk7XHJcbiAgICAgICAgICAgIC8vIENoYW5nZSBwaG9uZSBmb3JtYXQgdG8gaW50ZXJuYXRpb25hbCBTTVMgZm9ybWF0XHJcbiAgICAgICAgICAgIG9wdGlvbnMucGhvbmUgPSBub3JtYWxpemVQaG9uZShvcHRpb25zLnBob25lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBBY2NvdW50cy5fbG9naW5NZXRob2QoXHJcbiAgICAgICAgICAgIHNlbGYsXHJcbiAgICAgICAgICAgIFwiY3JlYXRlVXNlcldpdGhQaG9uZVwiLFxyXG4gICAgICAgICAgICBhcmd1bWVudHMsXHJcbiAgICAgICAgICAgIFwicGhvbmVcIixcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQWNjb3VudHMuX29wdGlvbnMuZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJTaWdudXBzIGZvcmJpZGRlblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHVzZXIuIHJlc3VsdCBjb250YWlucyBpZCBhbmQgdG9rZW4uXHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlcklkID0gY3JlYXRlVXNlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIC8vIHNhZmV0eSBiZWx0LiBjcmVhdGVVc2VyIGlzIHN1cHBvc2VkIHRvIHRocm93IG9uIGVycm9yLiBzZW5kIDUwMCBlcnJvclxyXG4gICAgICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBzZW5kaW5nIGEgdmVyaWZpY2F0aW9uIGVtYWlsIHdpdGggZW1wdHkgdXNlcmlkLlxyXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VySWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiY3JlYXRlVXNlciBmYWlsZWQgdG8gaW5zZXJ0IG5ldyB1c2VyXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIGBBY2NvdW50cy5fb3B0aW9ucy5zZW5kUGhvbmVWZXJpZmljYXRpb25Db2RlT25DcmVhdGlvbmAgaXMgc2V0LCByZWdpc3RlclxyXG4gICAgICAgICAgICAgICAgLy8gYSB0b2tlbiB0byB2ZXJpZnkgdGhlIHVzZXIncyBwcmltYXJ5IHBob25lLCBhbmQgc2VuZCBpdCB0b1xyXG4gICAgICAgICAgICAgICAgLy8gYnkgc21zLlxyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMucGhvbmUgJiYgQWNjb3VudHMuX29wdGlvbnMuc2VuZFBob25lVmVyaWZpY2F0aW9uQ29kZU9uQ3JlYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBBY2NvdW50cy5zZW5kUGhvbmVWZXJpZmljYXRpb25Db2RlKHVzZXJJZCwgb3B0aW9ucy5waG9uZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2xpZW50IGdldHMgbG9nZ2VkIGluIGFzIHRoZSBuZXcgdXNlciBhZnRlcndhcmRzLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLy8gQ3JlYXRlIHVzZXIgZGlyZWN0bHkgb24gdGhlIHNlcnZlci5cclxuLy9cclxuLy8gVW5saWtlIHRoZSBjbGllbnQgdmVyc2lvbiwgdGhpcyBkb2VzIG5vdCBsb2cgeW91IGluIGFzIHRoaXMgdXNlclxyXG4vLyBhZnRlciBjcmVhdGlvbi5cclxuLy9cclxuLy8gcmV0dXJucyB1c2VySWQgb3IgdGhyb3dzIGFuIGVycm9yIGlmIGl0IGNhbid0IGNyZWF0ZVxyXG4vL1xyXG4vLyBYWFggYWRkIGFub3RoZXIgYXJndW1lbnQgKFwic2VydmVyIG9wdGlvbnNcIikgdGhhdCBnZXRzIHNlbnQgdG8gb25DcmVhdGVVc2VyLFxyXG4vLyB3aGljaCBpcyBhbHdheXMgZW1wdHkgd2hlbiBjYWxsZWQgZnJvbSB0aGUgY3JlYXRlVXNlciBtZXRob2Q/IGVnLCBcImFkbWluOlxyXG4vLyB0cnVlXCIsIHdoaWNoIHdlIHdhbnQgdG8gcHJldmVudCB0aGUgY2xpZW50IGZyb20gc2V0dGluZywgYnV0IHdoaWNoIGEgY3VzdG9tXHJcbi8vIG1ldGhvZCBjYWxsaW5nIEFjY291bnRzLmNyZWF0ZVVzZXIgY291bGQgc2V0P1xyXG4vL1xyXG5BY2NvdW50cy5jcmVhdGVVc2VyV2l0aFBob25lID0gZnVuY3Rpb24ob3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIFhYWCBhbGxvdyBhbiBvcHRpb25hbCBjYWxsYmFjaz9cclxuICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY291bnRzLmNyZWF0ZVVzZXIgd2l0aCBjYWxsYmFjayBub3Qgc3VwcG9ydGVkIG9uIHRoZSBzZXJ2ZXIgeWV0LlwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3JlYXRlVXNlcihvcHRpb25zKTtcclxufTtcclxuXHJcbi8vL1xyXG4vLy8gUEFTU1dPUkQtU1BFQ0lGSUMgSU5ERVhFUyBPTiBVU0VSU1xyXG4vLy9cclxuTWV0ZW9yLnVzZXJzLl9lbnN1cmVJbmRleCgncGhvbmUubnVtYmVyJywge1xyXG4gICAgdW5pcXVlOiAxLFxyXG4gICAgc3BhcnNlOiAxXHJcbn0pO1xyXG5cclxuLy8gY27lubPlj7Dlj5HnlJ/ov4fpqozor4HnoIHph43lpI3nmoTpl67popjvvIzmiYDku6XljrvmjonllK/kuIDmgKfntKLlvJXnuqbmnZ9cclxuTWV0ZW9yLnVzZXJzLl9lbnN1cmVJbmRleCgnc2VydmljZXMucGhvbmUudmVyaWZ5LmNvZGUnLCB7XHJcbiAgICAvLyB1bmlxdWU6IDEsXHJcbiAgICBzcGFyc2U6IDFcclxufSk7XHJcblxyXG4vKioqIENvbnRyb2wgcHVibGlzaGVkIGRhdGEgKioqKioqKioqL1xyXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcclxuICAgIC8qKiBQdWJsaXNoIHBob25lcyB0byB0aGUgY2xpZW50ICoqL1xyXG4gICAgTWV0ZW9yLnB1Ymxpc2gobnVsbCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcklkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdwaG9uZSc6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8qKiBEaXNhYmxlIHVzZXIgcHJvZmlsZSBlZGl0aW5nICoqL1xyXG4gICAgTWV0ZW9yLnVzZXJzLmRlbnkoe1xyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2RpZmllci4kc2V0LnBob25lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxuXHJcbi8qKioqKioqKioqKioqIFBob25lIHZlcmlmaWNhdGlvbiBob29rICoqKioqKioqKioqKiovXHJcblxyXG4vLyBDYWxsYmFjayBleGNlcHRpb25zIGFyZSBwcmludGVkIHdpdGggTWV0ZW9yLl9kZWJ1ZyBhbmQgaWdub3JlZC5cclxudmFyIG9uUGhvbmVWZXJpZmljYXRpb25Ib29rID0gbmV3IEhvb2soe1xyXG4gICAgZGVidWdQcmludEV4Y2VwdGlvbnM6IFwib25QaG9uZVZlcmlmaWNhdGlvbiBjYWxsYmFja1wiXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEBzdW1tYXJ5IFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFmdGVyIGEgcGhvbmUgdmVyaWZpY2F0aW9uIGF0dGVtcHQgc3VjY2VlZHMuXHJcbiAqIEBsb2N1cyBTZXJ2ZXJcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gcGhvbmUgdmVyaWZpY2F0aW9uIGlzIHN1Y2Nlc3NmdWwuXHJcbiAqL1xyXG5BY2NvdW50cy5vblBob25lVmVyaWZpY2F0aW9uID0gZnVuY3Rpb24oZnVuYykge1xyXG4gICAgcmV0dXJuIG9uUGhvbmVWZXJpZmljYXRpb25Ib29rLnJlZ2lzdGVyKGZ1bmMpO1xyXG59O1xyXG5cclxudmFyIHN1Y2Nlc3NmdWxWZXJpZmljYXRpb24gPSBmdW5jdGlvbih1c2VySWQpIHtcclxuICAgIG9uUGhvbmVWZXJpZmljYXRpb25Ib29rLmVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayh1c2VySWQpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vLyBHaXZlIGVhY2ggbG9naW4gaG9vayBjYWxsYmFjayBhIGZyZXNoIGNsb25lZCBjb3B5IG9mIHRoZSBhdHRlbXB0XHJcbi8vIG9iamVjdCwgYnV0IGRvbid0IGNsb25lIHRoZSBjb25uZWN0aW9uLlxyXG4vL1xyXG52YXIgY2xvbmVBdHRlbXB0V2l0aENvbm5lY3Rpb24gPSBmdW5jdGlvbihjb25uZWN0aW9uLCBhdHRlbXB0KSB7XHJcbiAgICB2YXIgY2xvbmVkQXR0ZW1wdCA9IEVKU09OLmNsb25lKGF0dGVtcHQpO1xyXG4gICAgY2xvbmVkQXR0ZW1wdC5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuICAgIHJldHVybiBjbG9uZWRBdHRlbXB0O1xyXG59O1xyXG4vKioqKioqKioqKioqKiBIZWxwZXIgZnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLy8gUmV0dXJuIG5vcm1hbGl6ZWQgcGhvbmUgZm9ybWF0XHJcbnZhciBub3JtYWxpemVQaG9uZSA9IGZ1bmN0aW9uKHBob25lKSB7XHJcbiAgICAvLyBJZiBwaG9uZSBlcXVhbHMgdG8gb25lIG9mIGFkbWluIHBob25lIG51bWJlcnMgcmV0dXJuIGl0IGFzLWlzXHJcbiAgICBpZiAocGhvbmUgJiYgQWNjb3VudHMuX29wdGlvbnMuYWRtaW5QaG9uZU51bWJlcnMgJiYgQWNjb3VudHMuX29wdGlvbnMuYWRtaW5QaG9uZU51bWJlcnMuaW5kZXhPZihwaG9uZSkgIT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gcGhvbmU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUGhvbmUocGhvbmUpWzBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIGNvZGUgaXMgdGhlIGRlZmluZWQgbWFzdGVyIGNvZGVcclxuICogQHBhcmFtIGNvZGVcclxuICogQHJldHVybnMgeyp8Ym9vbGVhbn1cclxuICovXHJcbnZhciBpc01hc3RlckNvZGUgPSBmdW5jdGlvbihjb2RlKSB7XHJcbiAgICByZXR1cm4gY29kZSAmJiBBY2NvdW50cy5fb3B0aW9ucy5waG9uZVZlcmlmaWNhdGlvbk1hc3RlckNvZGUgJiZcclxuICAgICAgICBjb2RlID09IEFjY291bnRzLl9vcHRpb25zLnBob25lVmVyaWZpY2F0aW9uTWFzdGVyQ29kZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgcmFuZG9tIHBob25lIHZlcmlmaWNhdGlvbiBjb2RlXHJcbiAqIEBwYXJhbSBsZW5ndGhcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbnZhciBnZXRSYW5kb21Db2RlID0gZnVuY3Rpb24obGVuZ3RoKSB7XHJcbiAgICBsZW5ndGggPSBsZW5ndGggfHwgNDtcclxuICAgIHZhciBvdXRwdXQgPSBcIlwiO1xyXG4gICAgd2hpbGUgKGxlbmd0aC0tID4gMCkge1xyXG5cclxuICAgICAgICBvdXRwdXQgKz0gZ2V0UmFuZG9tRGlnaXQoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHJhbmRvbSAxLTkgZGlnaXRcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXHJcbnZhciBnZXRSYW5kb21EaWdpdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5KSArIDEpO1xyXG59OyJdfQ==
