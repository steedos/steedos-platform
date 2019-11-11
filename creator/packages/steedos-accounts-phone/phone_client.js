// Attempt to log in with phone and password.
//
// @param selector {String|Object} One of the following:
//   - {phone: (phone)}
// @param password {String}
// @param callback {Function(error|undefined)}


/**
 * @summary Log the user in with a password.
 * @locus Client
 * @param {Object | String} user Either a string interpreted as a phone;
 *      or an object with a single key: `phone` or `id`.
 * @param {String} password The user's password.
 * @param {Function} [callback] Optional callback. Called with no arguments on success,
 *      or with a single `Error` argument on failure.
 */
Meteor.loginWithPhoneAndPassword = function (selector, password, callback) {
    if (typeof selector === 'string')
        selector = {phone: selector};

    Accounts.callLoginMethod({
        methodArguments: [
            {
                user    : selector,
                password: Accounts._hashPassword(password)
            }
        ],
        userCallback   : function (error, result) {
            if (error && error.error === 400 &&
                error.reason === 'old password format') {
                // The "reason" string should match the error thrown in the
                // password login handler in password_server.js.

                // XXX COMPAT WITH 0.8.1.3
                // If this user's last login was with a previous version of
                // Meteor that used SRP, then the server throws this error to
                // indicate that we should try again. The error includes the
                // user's SRP identity. We provide a value derived from the
                // identity and the password to prove to the server that we know
                // the password without requiring a full SRP flow, as well as
                // SHA256(password), which the server bcrypts and stores in
                // place of the old SRP information for this user.
                srpUpgradePath({
                    upgradeError     : error,
                    userSelector     : selector,
                    plaintextPassword: password
                }, callback);
            }
            else if (error) {
                callback && callback(error);
            } else {
                callback && callback();
            }
        }
    });
};

Accounts._hashPassword = function (password) {
    return {
        digest   : SHA256(password),
        algorithm: "sha-256"
    };
};

// XXX COMPAT WITH 0.8.1.3
// The server requested an upgrade from the old SRP password format,
// so supply the needed SRP identity to login. Options:
//   - upgradeError: the error object that the server returned to tell
//     us to upgrade from SRP to bcrypt.
//   - userSelector: selector to retrieve the user object
//   - plaintextPassword: the password as a string
var srpUpgradePath = function (options, callback) {
    var details;
    try {
        details = EJSON.parse(options.upgradeError.details);
    } catch (e) {}
    if (!(details && details.format === 'srp')) {
        callback && callback(
            new Meteor.Error(400, "Password is old. Please reVerify phone again"));
    } else {
        Accounts.callLoginMethod({
            methodArguments: [
                {
                    user    : options.userSelector,
                    srp     : SHA256(details.identity + ":" + options.plaintextPassword),
                    password: Accounts._hashPassword(options.plaintextPassword)
                }
            ],
            userCallback   : callback
        });
    }
};

// Attempt to log in as a new user.

/**
 * @summary Create a new user with phone.
 * @locus Anywhere
 * @param {Object} options
 * @param {String} options.phone The user's full phone number.
 * @param {String} options.password, Optional -- (optional) The user's password. This is __not__ sent in plain text over the wire.
 * @param {Object} options.profile The user's profile, typically including the `name` field.
 * @param {Function} [callback] Client only, optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */
Accounts.createUserWithPhone = function (options, callback) {
    options = _.clone(options); // we'll be modifying options

    // If no password was given create random one
    if (typeof options.password !== 'string' || !options.password) {
        options.password = Math.random().toString(36).slice(-8);
    }

    // Replace password with the hashed password.
    options.password = Accounts._hashPassword(options.password);

    Accounts.callLoginMethod({
        methodName     : 'createUserWithPhone',
        methodArguments: [options],
        userCallback   : callback
    });
};


// Sends an sms to a user with a code to verify his number.
//
// @param phone: (phone)
// @param callback (optional) {Function(error|undefined)}

/**
 * @summary Request a new verification code.
 * @locus Client
 * @param {String} phone -  The phone we send the verification code to.
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */
Accounts.requestPhoneVerification = function (phone, checkVerified, callback) {
    if (!phone)
        throw new Error("Must pass phone");
    if(callback === undefined){
        callback = checkVerified;
        checkVerified = false;
    }
    locale = Steedos.locale(true);
    Accounts.connection.call("requestPhoneVerification", phone, locale, checkVerified, callback);
};

// Verify phone number -
// Based on a code ( received by SMS ) originally created by
// Accounts.verifyPhone, optionally change password and then logs in the matching user.
//
// @param code {String}
// @param newPassword (optional) {String}
// @param callback (optional) {Function(error|undefined)}

/**
 * @summary Marks the user's phone as verified. Optional change passwords, Logs the user in afterwards..
 * @locus Client
 * @param {String} phone - The phone number we want to verify.
 * @param {String} code - The code retrieved in the SMS.
 * @param {String} newPassword, Optional, A new password for the user. This is __not__ sent in plain text over the wire.
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */
Accounts.verifyPhone = function (phone, mobile, code, newPassword, callback) {
    check(code, String);
    check(phone, String);

    var hashedPassword;

    if (newPassword) {
        // If didn't gave newPassword and only callback was given
        if (typeof(newPassword) === 'function') {
            callback = newPassword;
        } else {
            check(newPassword, String);
            hashedPassword = Accounts._hashPassword(newPassword);
        }
    }
    Accounts.callLoginMethod({
        methodName     : 'verifyPhone',
        methodArguments: [phone, mobile, code, hashedPassword],
        userCallback   : callback});
};

/**
 * Returns whether the current user phone is verified
 * @returns {boolean} Whether the user phone is verified
 */
Accounts.isPhoneVerified = function () {
    var me = Meteor.user();
    return !!(me && me.phone && me.phone.verified);
};

