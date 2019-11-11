/// Default Accounts Config vars

var AccountGlobalConfigs = {
    verificationRetriesWaitTime: 10 * 60 * 1000,
    verificationWaitTime: 30 * 1000,
    verificationCodeLength: 4,
    verificationMaxRetries: 2,
    forbidClientAccountCreation: false,
    sendPhoneVerificationCodeOnCreation: true
};

_.defaults(Accounts._options, AccountGlobalConfigs);


/// Phone

var Phone = require('phone');

/// BCRYPT

var bcrypt = NpmModuleBcrypt;
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);

// User records have a 'services.phone.bcrypt' field on them to hold
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
var getPasswordString = function(password) {
    if (typeof password === "string") {
        password = SHA256(password);
    } else { // 'password' is an object
        if (password.algorithm !== "sha-256") {
            throw new Meteor.Error(403, "Invalid password hash algorithm. " +
                "Only 'sha-256' is allowed.");
        }
        password = password.digest;
    }
    return password;
};

// Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//
var hashPassword = function(password) {
    password = getPasswordString(password);
    return bcryptHash(password, Accounts._bcryptRounds);
};

// Check whether the provided password matches the bcrypt'ed password in
// the database user record. `password` can be a string (in which case
// it will be run through SHA256 before bcrypt) or an object with
// properties `digest` and `algorithm` (in which case we bcrypt
// `password.digest`).
//
Accounts._checkPhonePassword = function(user, password) {
    var result = {
        userId: user._id
    };

    password = getPasswordString(password);

    if (!bcryptCompare(password, user.services.phone.bcrypt)) {
        result.error = new Meteor.Error(403, "Incorrect password");
    }

    return result;
};
var checkPassword = Accounts._checkPhonePassword;

///
/// LOGIN
///

// Users can specify various keys to identify themselves with.
// @param user {Object} with `id` or `phone`.
// @returns A selector to pass to mongo to get the user record.

var selectorFromUserQuery = function(user) {
    if (user.id)
        return {
            _id: user.id
        };
    else if (user.phone)
        return {
            'phone.number': user.phone
        };
    throw new Meteor.Error(403, "shouldn't happen (validation missed something)");
};

var findUserFromUserQuery = function(user) {
    var selector = selectorFromUserQuery(user);

    var user = Meteor.users.findOne(selector);
    if (!user)
        throw new Meteor.Error(403, "User not found");

    return user;
};

// XXX maybe this belongs in the check package
var NonEmptyString = Match.Where(function(x) {
    check(x, String);
    return x.length > 0;
});

var userQueryValidator = Match.Where(function(user) {
    check(user, {
        id: Match.Optional(NonEmptyString),
        phone: Match.Optional(NonEmptyString)
    });
    if (_.keys(user).length !== 1)
        throw new Match.Error("User property must have exactly one field");
    return true;
});

var passwordValidator = Match.OneOf(
    String, {
        digest: String,
        algorithm: String
    }
);

// Handler to login with a phone.
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
Accounts.registerLoginHandler("phone", function(options) {
    if (!options.password || options.srp)
        return undefined; // don't handle

    check(options, {
        user: userQueryValidator,
        password: passwordValidator
    });

    var user = findUserFromUserQuery(options.user);

    if (!user.services || !user.services.phone || !(user.services.phone.bcrypt || user.services.phone.srp))
        throw new Meteor.Error(403, "User has no password set");

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

    return checkPassword(
        user,
        options.password
    );
});

// Handler to login using the SRP upgrade path. To use this login
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
Accounts.registerLoginHandler("phone", function(options) {
    if (!options.srp || !options.password)
        return undefined; // don't handle

    check(options, {
        user: userQueryValidator,
        srp: String,
        password: passwordValidator
    });

    var user = findUserFromUserQuery(options.user);

    // Check to see if another simultaneous login has already upgraded
    // the user record to bcrypt.
    if (user.services && user.services.phone &&
        user.services.phone.bcrypt)
        return checkPassword(user, options.password);

    if (!(user.services && user.services.phone && user.services.phone.srp))
        throw new Meteor.Error(403, "User has no password set");

    var v1 = user.services.phone.srp.verifier;
    var v2 = SRP.generateVerifier(
        null, {
            hashedIdentityAndPassword: options.srp,
            salt: user.services.phone.srp.salt
        }
    ).verifier;
    if (v1 !== v2)
        return {
            userId: user._id,
            error: new Meteor.Error(403, "Incorrect password")
        };

    // Upgrade to bcrypt on successful login.
    var salted = hashPassword(options.password);
    Meteor.users.update(
        user._id, {
            $unset: {
                'services.phone.srp': 1
            },
            $set: {
                'services.phone.bcrypt': salted
            }
        }
    );

    return {
        userId: user._id
    };
});

// Force change the users phone password.

/**
 * @summary Forcibly change the password for a user.
 * @locus Server
 * @param {String} userId The id of the user to update.
 * @param {String} newPassword A new password for the user.
 */
Accounts.setPhonePassword = function(userId, newPlaintextPassword) {
    var user = Meteor.users.findOne(userId);
    if (!user)
        throw new Meteor.Error(403, "User not found");

    Meteor.users.update({
        _id: user._id
    }, {
        $unset: {
            'services.phone.srp': 1, // XXX COMPAT WITH 0.8.1.3
            'services.phone.verify': 1,
            'services.resume.loginTokens': 1
        },
        $set: {
            'services.phone.bcrypt': hashPassword(newPlaintextPassword)
        }
    });
};

///
/// Send phone VERIFICATION code
///

// send the user a sms with a code that can be used to verify number

/**
 * @summary Send an SMS with a code the user can use verify their phone number with.
 * @locus Server
 * @param {String} userId The id of the user to send email to.
 * @param {String} [phone] Optional. Which phone of the user's to send the SMS to. This phone must be in the user's `phones` list. Defaults to the first unverified phone in the list.
 */
Accounts.sendPhoneVerificationCode = function(userId, phone) {
    // XXX Also generate a link using which someone can delete this
    // account if they own said number but weren't those who created
    // this account.

    // Make sure the user exists, and phone is one of their phones.
    var user = Meteor.users.findOne(userId);
    if (!user)
        throw new Meteor.Error(403, "Can't find user");
    // pick the first unverified phone if we weren't passed an phone.
    if (!phone && user.phone) {
        phone = user.phone && user.phone.number;
    }
    // make sure we have a valid phone
    if (!phone)
        throw new Meteor.Error(403, "No such phone for user.");

    var locale = Steedos.locale(userId, true);
    // If sent more than max retry wait
    var waitTimeBetweenRetries = Accounts._options.verificationWaitTime;
    var maxRetryCounts = Accounts._options.verificationMaxRetries;

    var verifyObject = {
        numOfRetries: 0
    };
    if (user.services && user.services.phone && user.services.phone.verify) {
        verifyObject = user.services.phone.verify;
    }

    var curTime = new Date();
    // Check if last retry was too soon
    var nextRetryDate = verifyObject && verifyObject.lastRetry && new Date(verifyObject.lastRetry.getTime() + waitTimeBetweenRetries);
    if (nextRetryDate && nextRetryDate > curTime) {
        var waitTimeInSec = Math.ceil(Math.abs((nextRetryDate - curTime) / 1000)),
            errMsg = TAPi18n.__('accounts_phone_too_often_retries', {
                s: waitTimeInSec
            }, locale);
        throw new Meteor.Error(403, errMsg);
    }
    // Check if there where too many retries
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
    });

    // before passing to template, update user object with new token
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
            };
            // 发送手机短信
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
};

// Send SMS with code to user.
Meteor.methods({
    requestPhoneVerification: function(phone, locale, checkVerified) {
        if (phone) {
            check(phone, String);
            // Change phone format to international SMS format
            phone = normalizePhone(phone);
        }

        if (!phone) {
            throw new Meteor.Error(403, "accounts_phone_invalid");
        }

        var userId = this.userId;
        if (!userId) {
            // Get user by phone number
            var userOptions = {
                'phone.number': phone,
            };

            if(checkVerified){
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
        }
        else{
            // 已登录用户，有可能需要手机号已验证才发验证码，比如通过手机号找回密码
            if(checkVerified){
                var validUser = Meteor.users.findOne({
                    _id: userId,
                    'phone.number': phone,
                    'phone.verified': true
                });
                if(!validUser){
                    var errMsg = TAPi18n.__('accounts_phone_verify_fail', {}, locale);
                    throw new Meteor.Error(403, errMsg);
                }
            }
        }
        Accounts.sendPhoneVerificationCode(userId, phone);
    }
});

// Take code from sendVerificationPhone SMS, mark the phone as verified,
// Change password if needed
// and log them in.
Meteor.methods({
    verifyPhone: function(phone, mobile, code, newPassword) {
        var self = this;
        // Check if needs to change password
        var userId = this.userId;

        return Accounts._loginMethod(
            self,
            "verifyPhone",
            arguments,
            "phone",
            function() {
                check(code, String);
                check(mobile, String);
                check(phone, String);

                if (!code) {
                    throw new Meteor.Error(403, "Code is must be provided to method");
                }
                // Change phone format to international SMS format
                phone = normalizePhone(phone);
                if(!phone){
                    throw new Meteor.Error(403, "accounts_phone_invalid")
                    return false;
                }

                var user;
                // 因绑定修改手机号要求先验证通过才更新手机号，所以这里不可以通过手机号找用户，只能找当前登录用户
                // 这样的话，对于已登录用户来说，就只能验证自己的手机号了
                if(userId){
                    user = Meteor.users.findOne({
                        "_id": userId
                    });
                }
                else{
                    user = Meteor.users.findOne({
                        "phone.number": phone
                    });
                }


                if (!user)
                    throw new Meteor.Error(403, "accounts_phone_invalid");

                // Verify code is accepted or master code
                if (!user.services.phone || !user.services.phone.verify || !user.services.phone.verify.code ||
                    (user.services.phone.verify.code != code && !isMasterCode(code))) {
                    throw new Meteor.Error(403, "accounts_phone_code_invalid");
                }

                var setOptions = {
                        'phone.verified': true,
                        'phone.modified': new Date()
                    },
                    unSetOptions = {
                        'services.phone.verify': 1
                    };

                if(userId){
                    // 当用户验证绑定自己的手机号时，把手机号一起改掉，就不用再单独调用修改手机号的接口了
                    setOptions['phone.number'] = phone;
                    setOptions['phone.mobile'] = mobile;
                }
                var resetToOldToken;
                // If needs to update password
                if (newPassword) {
                    check(newPassword, passwordValidator);
                    var hashed = hashPassword(newPassword);

                    // NOTE: We're about to invalidate tokens on the user, who we might be
                    // logged in as. Make sure to avoid logging ourselves out if this
                    // happens. But also make sure not to leave the connection in a state
                    // of having a bad token set if things fail.
                    var oldToken = Accounts._getLoginToken(self.connection.id);
                    Accounts._setLoginToken(user._id, self.connection, null);
                    resetToOldToken = function() {
                        Accounts._setLoginToken(user._id, self.connection, oldToken);
                    };

                    setOptions['services.phone.bcrypt'] = hashed;
                    unSetOptions['services.phone.srp'] = 1;

                    // 增加该行代码执行meteor内置的密码设置功能
                    Accounts.setPassword(user._id, newPassword);
                }

                try {
                    var query = {
                        _id: user._id,
                        // 'phone.number': phone,//手机号登录不要求验证通过，所以这个条件要去掉
                        'services.phone.verify.code': code
                    };
                    // Allow master code from settings
                    if (isMasterCode(code)) {
                        delete query['services.phone.verify.code'];
                    }
                    // 验证通过后，可以也需要把重复的手机号全部清除，以免后面更新手机号时报唯一性索引的错
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
                    });
                    // Update the user record by:
                    // - Changing the password to the new one
                    // - Forgetting about the verification code that was just used
                    // - Verifying the phone, since they got the code via sms to phone.
                    var affectedRecords = Meteor.users.update(
                        query, {
                            $set: setOptions,
                            $unset: unSetOptions
                        });
                    if (affectedRecords !== 1){
                        var errMsg = userId ? "accounts_phone_code_update_fail" : "accounts_phone_not_exist";
                        return {
                            userId: user._id,
                            error: new Meteor.Error(403, errMsg)
                        };
                    }

                    successfulVerification(user._id);
                } catch (err) {
                    if(resetToOldToken){
                        resetToOldToken();
                    }
                    throw err;
                }

                // Replace all valid login tokens with new ones (changing
                // password should invalidate existing sessions).
                // Accounts._clearAllLoginTokens(user._id);

                return {
                    userId: user._id
                };
            }
        );
    }
});

///
/// CREATING USERS
///

// Shared createUser function called from the createUser method, both
// if originates in client or server code. Calls user provided hooks,
// does the actual user insertion.
//
// returns the user id
var createUser = function(options) {
    // Unknown keys allowed, because a onCreateUserHook can take arbitrary
    // options.
    check(options, Match.ObjectIncluding({
        phone: Match.Optional(String),
        password: Match.Optional(passwordValidator)
    }));

    var phone = options.phone;
    if (!phone)
        throw new Meteor.Error(400, "Need to set phone");

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
        if (match[1].indexOf('users.$phone.number') !== -1)
            throw new Meteor.Error(403, "Phone number already exists, failed on creation.");
        throw e;
    }
};

// method for create user. Requests come from the client.
Meteor.methods({
    createUserWithPhone: function(options) {
        var self = this;

        check(options, Object);
        if (options.phone) {
            check(options.phone, String);
            // Change phone format to international SMS format
            options.phone = normalizePhone(options.phone);
        }

        return Accounts._loginMethod(
            self,
            "createUserWithPhone",
            arguments,
            "phone",
            function() {
                if (Accounts._options.forbidClientAccountCreation)
                    return {
                        error: new Meteor.Error(403, "Signups forbidden")
                    };

                // Create user. result contains id and token.
                var userId = createUser(options);
                // safety belt. createUser is supposed to throw on error. send 500 error
                // instead of sending a verification email with empty userid.
                if (!userId)
                    throw new Meteor.Error(403, "createUser failed to insert new user");

                // If `Accounts._options.sendPhoneVerificationCodeOnCreation` is set, register
                // a token to verify the user's primary phone, and send it to
                // by sms.
                if (options.phone && Accounts._options.sendPhoneVerificationCodeOnCreation) {
                    Accounts.sendPhoneVerificationCode(userId, options.phone);
                }

                // client gets logged in as the new user afterwards.
                return {
                    userId: userId
                };
            }
        );
    }
});

// Create user directly on the server.
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
Accounts.createUserWithPhone = function(options, callback) {
    options = _.clone(options);

    // XXX allow an optional callback?
    if (callback) {
        throw new Meteor.Error(403, "Accounts.createUser with callback not supported on the server yet.");
    }

    return createUser(options);
};

///
/// PASSWORD-SPECIFIC INDEXES ON USERS
///
Meteor.users._ensureIndex('phone.number', {
    unique: 1,
    sparse: 1
});

// cn平台发生过验证码重复的问题，所以去掉唯一性索引约束
Meteor.users._ensureIndex('services.phone.verify.code', {
    // unique: 1,
    sparse: 1
});

/*** Control published data *********/
Meteor.startup(function() {
    /** Publish phones to the client **/
    Meteor.publish(null, function() {
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
        update: function(userId, doc, fieldNames, modifier, options) {
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
Accounts.onPhoneVerification = function(func) {
    return onPhoneVerificationHook.register(func);
};

var successfulVerification = function(userId) {
    onPhoneVerificationHook.each(function(callback) {
        callback(userId);
        return true;
    });
};

// Give each login hook callback a fresh cloned copy of the attempt
// object, but don't clone the connection.
//
var cloneAttemptWithConnection = function(connection, attempt) {
    var clonedAttempt = EJSON.clone(attempt);
    clonedAttempt.connection = connection;
    return clonedAttempt;
};
/************* Helper functions ********************/

// Return normalized phone format
var normalizePhone = function(phone) {
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
var isMasterCode = function(code) {
    return code && Accounts._options.phoneVerificationMasterCode &&
        code == Accounts._options.phoneVerificationMasterCode;
};

/**
 * Get random phone verification code
 * @param length
 * @returns {string}
 */
var getRandomCode = function(length) {
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
var getRandomDigit = function() {
    return Math.floor((Math.random() * 9) + 1);
};