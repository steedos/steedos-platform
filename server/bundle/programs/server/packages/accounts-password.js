(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var EJSON = Package.ejson.EJSON;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-password":{"email_templates.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-password/email_templates.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
const greet = welcomeMsg => (user, url) => {
  const greeting = user.profile && user.profile.name ? "Hello ".concat(user.profile.name, ",") : "Hello,";
  return "".concat(greeting, "\n\n").concat(welcomeMsg, ", simply click the link below.\n\n").concat(url, "\n\nThanks.\n");
};
/**
 * @summary Options to customize emails sent from the Accounts system.
 * @locus Server
 * @importFromPackage accounts-base
 */


Accounts.emailTemplates = {
  from: "Accounts Example <no-reply@example.com>",
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
  resetPassword: {
    subject: () => "How to reset your password on ".concat(Accounts.emailTemplates.siteName),
    text: greet("To reset your password")
  },
  verifyEmail: {
    subject: () => "How to verify email address on ".concat(Accounts.emailTemplates.siteName),
    text: greet("To verify your account email")
  },
  enrollAccount: {
    subject: () => "An account has been created for you on ".concat(Accounts.emailTemplates.siteName),
    text: greet("To start using the service")
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"password_server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-password/password_server.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
/// BCRYPT
const bcrypt = NpmModuleBcrypt;
const bcryptHash = Meteor.wrapAsync(bcrypt.hash);
const bcryptCompare = Meteor.wrapAsync(bcrypt.compare); // Utility for grabbing user

const getUserById = id => Meteor.users.findOne(id); // User records have a 'services.password.bcrypt' field on them to hold
// their hashed passwords (unless they have a 'services.password.srp'
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


Accounts._bcryptRounds = () => Accounts._options.bcryptRounds || 10; // Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//


const getPasswordString = password => {
  if (typeof password === "string") {
    password = SHA256(password);
  } else {
    // 'password' is an object
    if (password.algorithm !== "sha-256") {
      throw new Error("Invalid password hash algorithm. " + "Only 'sha-256' is allowed.");
    }

    password = password.digest;
  }

  return password;
}; // Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//


const hashPassword = password => {
  password = getPasswordString(password);
  return bcryptHash(password, Accounts._bcryptRounds());
}; // Extract the number of rounds used in the specified bcrypt hash.


const getRoundsFromBcryptHash = hash => {
  let rounds;

  if (hash) {
    const hashSegments = hash.split('$');

    if (hashSegments.length > 2) {
      rounds = parseInt(hashSegments[2], 10);
    }
  }

  return rounds;
}; // Check whether the provided password matches the bcrypt'ed password in
// the database user record. `password` can be a string (in which case
// it will be run through SHA256 before bcrypt) or an object with
// properties `digest` and `algorithm` (in which case we bcrypt
// `password.digest`).
//


Accounts._checkPassword = (user, password) => {
  const result = {
    userId: user._id
  };
  const formattedPassword = getPasswordString(password);
  const hash = user.services.password.bcrypt;
  const hashRounds = getRoundsFromBcryptHash(hash);

  if (!bcryptCompare(formattedPassword, hash)) {
    result.error = handleError("Incorrect password", false);
  } else if (hash && Accounts._bcryptRounds() != hashRounds) {
    // The password checks out, but the user's bcrypt hash needs to be updated.
    Meteor.defer(() => {
      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          'services.password.bcrypt': bcryptHash(formattedPassword, Accounts._bcryptRounds())
        }
      });
    });
  }

  return result;
};

const checkPassword = Accounts._checkPassword; ///
/// ERROR HANDLER
///

const handleError = function (msg) {
  let throwError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const error = new Meteor.Error(403, Accounts._options.ambiguousErrorMessages ? "Something went wrong. Please check your credentials." : msg);

  if (throwError) {
    throw error;
  }

  return error;
}; ///
/// LOGIN
///


Accounts._findUserByQuery = query => {
  let user = null;

  if (query.id) {
    user = getUserById(query.id);
  } else {
    let fieldName;
    let fieldValue;

    if (query.username) {
      fieldName = 'username';
      fieldValue = query.username;
    } else if (query.email) {
      fieldName = 'emails.address';
      fieldValue = query.email;
    } else {
      throw new Error("shouldn't happen (validation missed something)");
    }

    let selector = {};
    selector[fieldName] = fieldValue;
    user = Meteor.users.findOne(selector); // If user is not found, try a case insensitive lookup

    if (!user) {
      selector = selectorForFastCaseInsensitiveLookup(fieldName, fieldValue);
      const candidateUsers = Meteor.users.find(selector).fetch(); // No match if multiple candidates are found

      if (candidateUsers.length === 1) {
        user = candidateUsers[0];
      }
    }
  }

  return user;
};
/**
 * @summary Finds the user with the specified username.
 * First tries to match username case sensitively; if that fails, it
 * tries case insensitively; but if more than one user matches the case
 * insensitive search, it returns null.
 * @locus Server
 * @param {String} username The username to look for
 * @returns {Object} A user if found, else null
 * @importFromPackage accounts-base
 */


Accounts.findUserByUsername = username => Accounts._findUserByQuery({
  username
});
/**
 * @summary Finds the user with the specified email.
 * First tries to match email case sensitively; if that fails, it
 * tries case insensitively; but if more than one user matches the case
 * insensitive search, it returns null.
 * @locus Server
 * @param {String} email The email address to look for
 * @returns {Object} A user if found, else null
 * @importFromPackage accounts-base
 */


Accounts.findUserByEmail = email => Accounts._findUserByQuery({
  email
}); // Generates a MongoDB selector that can be used to perform a fast case
// insensitive lookup for the given fieldName and string. Since MongoDB does
// not support case insensitive indexes, and case insensitive regex queries
// are slow, we construct a set of prefix selectors for all permutations of
// the first 4 characters ourselves. We first attempt to matching against
// these, and because 'prefix expression' regex queries do use indexes (see
// http://docs.mongodb.org/v2.6/reference/operator/query/regex/#index-use),
// this has been found to greatly improve performance (from 1200ms to 5ms in a
// test with 1.000.000 users).


const selectorForFastCaseInsensitiveLookup = (fieldName, string) => {
  // Performance seems to improve up to 4 prefix characters
  const prefix = string.substring(0, Math.min(string.length, 4));
  const orClause = generateCasePermutationsForString(prefix).map(prefixPermutation => {
    const selector = {};
    selector[fieldName] = new RegExp("^".concat(Meteor._escapeRegExp(prefixPermutation)));
    return selector;
  });
  const caseInsensitiveClause = {};
  caseInsensitiveClause[fieldName] = new RegExp("^".concat(Meteor._escapeRegExp(string), "$"), 'i');
  return {
    $and: [{
      $or: orClause
    }, caseInsensitiveClause]
  };
}; // Generates permutations of all case variations of a given string.


const generateCasePermutationsForString = string => {
  let permutations = [''];

  for (let i = 0; i < string.length; i++) {
    const ch = string.charAt(i);
    permutations = [].concat(...permutations.map(prefix => {
      const lowerCaseChar = ch.toLowerCase();
      const upperCaseChar = ch.toUpperCase(); // Don't add unneccesary permutations when ch is not a letter

      if (lowerCaseChar === upperCaseChar) {
        return [prefix + ch];
      } else {
        return [prefix + lowerCaseChar, prefix + upperCaseChar];
      }
    }));
  }

  return permutations;
};

const checkForCaseInsensitiveDuplicates = (fieldName, displayName, fieldValue, ownUserId) => {
  // Some tests need the ability to add users with the same case insensitive
  // value, hence the _skipCaseInsensitiveChecksForTest check
  const skipCheck = Object.prototype.hasOwnProperty.call(Accounts._skipCaseInsensitiveChecksForTest, fieldValue);

  if (fieldValue && !skipCheck) {
    const matchedUsers = Meteor.users.find(selectorForFastCaseInsensitiveLookup(fieldName, fieldValue)).fetch();

    if (matchedUsers.length > 0 && ( // If we don't have a userId yet, any match we find is a duplicate
    !ownUserId || // Otherwise, check to see if there are multiple matches or a match
    // that is not us
    matchedUsers.length > 1 || matchedUsers[0]._id !== ownUserId)) {
      handleError("".concat(displayName, " already exists."));
    }
  }
}; // XXX maybe this belongs in the check package


const NonEmptyString = Match.Where(x => {
  check(x, String);
  return x.length > 0;
});
const userQueryValidator = Match.Where(user => {
  check(user, {
    id: Match.Optional(NonEmptyString),
    username: Match.Optional(NonEmptyString),
    email: Match.Optional(NonEmptyString)
  });
  if (Object.keys(user).length !== 1) throw new Match.Error("User property must have exactly one field");
  return true;
});
const passwordValidator = Match.OneOf(String, {
  digest: String,
  algorithm: String
}); // Handler to login with a password.
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

Accounts.registerLoginHandler("password", options => {
  if (!options.password || options.srp) return undefined; // don't handle

  check(options, {
    user: userQueryValidator,
    password: passwordValidator
  });

  const user = Accounts._findUserByQuery(options.user);

  if (!user) {
    handleError("User not found");
  }

  if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp)) {
    handleError("User has no password set");
  }

  if (!user.services.password.bcrypt) {
    if (typeof options.password === "string") {
      // The client has presented a plaintext password, and the user is
      // not upgraded to bcrypt yet. We don't attempt to tell the client
      // to upgrade to bcrypt, because it might be a standalone DDP
      // client doesn't know how to do such a thing.
      const verifier = user.services.password.srp;
      const newVerifier = SRP.generateVerifier(options.password, {
        identity: verifier.identity,
        salt: verifier.salt
      });

      if (verifier.verifier !== newVerifier.verifier) {
        return {
          userId: Accounts._options.ambiguousErrorMessages ? null : user._id,
          error: handleError("Incorrect password", false)
        };
      }

      return {
        userId: user._id
      };
    } else {
      // Tell the client to use the SRP upgrade process.
      throw new Meteor.Error(400, "old password format", EJSON.stringify({
        format: 'srp',
        identity: user.services.password.srp.identity
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

Accounts.registerLoginHandler("password", options => {
  if (!options.srp || !options.password) {
    return undefined; // don't handle
  }

  check(options, {
    user: userQueryValidator,
    srp: String,
    password: passwordValidator
  });

  const user = Accounts._findUserByQuery(options.user);

  if (!user) {
    handleError("User not found");
  } // Check to see if another simultaneous login has already upgraded
  // the user record to bcrypt.


  if (user.services && user.services.password && user.services.password.bcrypt) {
    return checkPassword(user, options.password);
  }

  if (!(user.services && user.services.password && user.services.password.srp)) {
    handleError("User has no password set");
  }

  const v1 = user.services.password.srp.verifier;
  const v2 = SRP.generateVerifier(null, {
    hashedIdentityAndPassword: options.srp,
    salt: user.services.password.srp.salt
  }).verifier;

  if (v1 !== v2) {
    return {
      userId: Accounts._options.ambiguousErrorMessages ? null : user._id,
      error: handleError("Incorrect password", false)
    };
  } // Upgrade to bcrypt on successful login.


  const salted = hashPassword(options.password);
  Meteor.users.update(user._id, {
    $unset: {
      'services.password.srp': 1
    },
    $set: {
      'services.password.bcrypt': salted
    }
  });
  return {
    userId: user._id
  };
}); ///
/// CHANGING
///

/**
 * @summary Change a user's username. Use this instead of updating the
 * database directly. The operation will fail if there is an existing user
 * with a username only differing in case.
 * @locus Server
 * @param {String} userId The ID of the user to update.
 * @param {String} newUsername A new username for the user.
 * @importFromPackage accounts-base
 */

Accounts.setUsername = (userId, newUsername) => {
  check(userId, NonEmptyString);
  check(newUsername, NonEmptyString);
  const user = getUserById(userId);

  if (!user) {
    handleError("User not found");
  }

  const oldUsername = user.username; // Perform a case insensitive check for duplicates before update

  checkForCaseInsensitiveDuplicates('username', 'Username', newUsername, user._id);
  Meteor.users.update({
    _id: user._id
  }, {
    $set: {
      username: newUsername
    }
  }); // Perform another check after update, in case a matching user has been
  // inserted in the meantime

  try {
    checkForCaseInsensitiveDuplicates('username', 'Username', newUsername, user._id);
  } catch (ex) {
    // Undo update if the check fails
    Meteor.users.update({
      _id: user._id
    }, {
      $set: {
        username: oldUsername
      }
    });
    throw ex;
  }
}; // Let the user change their own password if they know the old
// password. `oldPassword` and `newPassword` should be objects with keys
// `digest` and `algorithm` (representing the SHA256 of the password).
//
// XXX COMPAT WITH 0.8.1.3
// Like the login method, if the user hasn't been upgraded from SRP to
// bcrypt yet, then this method will throw an 'old password format'
// error. The client should call the SRP upgrade login handler and then
// retry this method again.
//
// UNLIKE the login method, there is no way to avoid getting SRP upgrade
// errors thrown. The reasoning for this is that clients using this
// method directly will need to be updated anyway because we no longer
// support the SRP flow that they would have been doing to use this
// method previously.


Meteor.methods({
  changePassword: function (oldPassword, newPassword) {
    check(oldPassword, passwordValidator);
    check(newPassword, passwordValidator);

    if (!this.userId) {
      throw new Meteor.Error(401, "Must be logged in");
    }

    const user = getUserById(this.userId);

    if (!user) {
      handleError("User not found");
    }

    if (!user.services || !user.services.password || !user.services.password.bcrypt && !user.services.password.srp) {
      handleError("User has no password set");
    }

    if (!user.services.password.bcrypt) {
      throw new Meteor.Error(400, "old password format", EJSON.stringify({
        format: 'srp',
        identity: user.services.password.srp.identity
      }));
    }

    const result = checkPassword(user, oldPassword);

    if (result.error) {
      throw result.error;
    }

    const hashed = hashPassword(newPassword); // It would be better if this removed ALL existing tokens and replaced
    // the token for the current connection with a new one, but that would
    // be tricky, so we'll settle for just replacing all tokens other than
    // the one for the current connection.

    const currentToken = Accounts._getLoginToken(this.connection.id);

    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        'services.password.bcrypt': hashed
      },
      $pull: {
        'services.resume.loginTokens': {
          hashedToken: {
            $ne: currentToken
          }
        }
      },
      $unset: {
        'services.password.reset': 1
      }
    });
    return {
      passwordChanged: true
    };
  }
}); // Force change the users password.

/**
 * @summary Forcibly change the password for a user.
 * @locus Server
 * @param {String} userId The id of the user to update.
 * @param {String} newPassword A new password for the user.
 * @param {Object} [options]
 * @param {Object} options.logout Logout all current connections with this userId (default: true)
 * @importFromPackage accounts-base
 */

Accounts.setPassword = (userId, newPlaintextPassword, options) => {
  options = _objectSpread({
    logout: true
  }, options);
  const user = getUserById(userId);

  if (!user) {
    throw new Meteor.Error(403, "User not found");
  }

  const update = {
    $unset: {
      'services.password.srp': 1,
      // XXX COMPAT WITH 0.8.1.3
      'services.password.reset': 1
    },
    $set: {
      'services.password.bcrypt': hashPassword(newPlaintextPassword)
    }
  };

  if (options.logout) {
    update.$unset['services.resume.loginTokens'] = 1;
  }

  Meteor.users.update({
    _id: user._id
  }, update);
}; ///
/// RESETTING VIA EMAIL
///
// Utility for plucking addresses from emails


const pluckAddresses = function () {
  let emails = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return emails.map(email => email.address);
}; // Method called by a user to request a password reset email. This is
// the start of the reset process.


Meteor.methods({
  forgotPassword: options => {
    check(options, {
      email: String
    });
    const user = Accounts.findUserByEmail(options.email);

    if (!user) {
      handleError("User not found");
    }

    const emails = pluckAddresses(user.emails);
    const caseSensitiveEmail = emails.find(email => email.toLowerCase() === options.email.toLowerCase());
    Accounts.sendResetPasswordEmail(user._id, caseSensitiveEmail);
  }
});
/**
 * @summary Generates a reset token and saves it into the database.
 * @locus Server
 * @param {String} userId The id of the user to generate the reset token for.
 * @param {String} email Which address of the user to generate the reset token for. This address must be in the user's `emails` list. If `null`, defaults to the first email in the list.
 * @param {String} reason `resetPassword` or `enrollAccount`.
 * @param {Object} [extraTokenData] Optional additional data to be added into the token record.
 * @returns {Object} Object with {email, user, token} values.
 * @importFromPackage accounts-base
 */

Accounts.generateResetToken = (userId, email, reason, extraTokenData) => {
  // Make sure the user exists, and email is one of their addresses.
  const user = getUserById(userId);

  if (!user) {
    handleError("Can't find user");
  } // pick the first email if we weren't passed an email.


  if (!email && user.emails && user.emails[0]) {
    email = user.emails[0].address;
  } // make sure we have a valid email


  if (!email || !pluckAddresses(user.emails).includes(email)) {
    handleError("No such email for user.");
  }

  const token = Random.secret();
  const tokenRecord = {
    token,
    email,
    when: new Date()
  };

  if (reason === 'resetPassword') {
    tokenRecord.reason = 'reset';
  } else if (reason === 'enrollAccount') {
    tokenRecord.reason = 'enroll';
  } else if (reason) {
    // fallback so that this function can be used for unknown reasons as well
    tokenRecord.reason = reason;
  }

  if (extraTokenData) {
    Object.assign(tokenRecord, extraTokenData);
  }

  Meteor.users.update({
    _id: user._id
  }, {
    $set: {
      'services.password.reset': tokenRecord
    }
  }); // before passing to template, update user object with new token

  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
  return {
    email,
    user,
    token
  };
};
/**
 * @summary Generates an e-mail verification token and saves it into the database.
 * @locus Server
 * @param {String} userId The id of the user to generate the  e-mail verification token for.
 * @param {String} email Which address of the user to generate the e-mail verification token for. This address must be in the user's `emails` list. If `null`, defaults to the first unverified email in the list.
 * @param {Object} [extraTokenData] Optional additional data to be added into the token record.
 * @returns {Object} Object with {email, user, token} values.
 * @importFromPackage accounts-base
 */


Accounts.generateVerificationToken = (userId, email, extraTokenData) => {
  // Make sure the user exists, and email is one of their addresses.
  const user = getUserById(userId);

  if (!user) {
    handleError("Can't find user");
  } // pick the first unverified email if we weren't passed an email.


  if (!email) {
    const emailRecord = (user.emails || []).find(e => !e.verified);
    email = (emailRecord || {}).address;

    if (!email) {
      handleError("That user has no unverified email addresses.");
    }
  } // make sure we have a valid email


  if (!email || !pluckAddresses(user.emails).includes(email)) {
    handleError("No such email for user.");
  }

  const token = Random.secret();
  const tokenRecord = {
    token,
    // TODO: This should probably be renamed to "email" to match reset token record.
    address: email,
    when: new Date()
  };

  if (extraTokenData) {
    Object.assign(tokenRecord, extraTokenData);
  }

  Meteor.users.update({
    _id: user._id
  }, {
    $push: {
      'services.email.verificationTokens': tokenRecord
    }
  }); // before passing to template, update user object with new token

  Meteor._ensure(user, 'services', 'email');

  if (!user.services.email.verificationTokens) {
    user.services.email.verificationTokens = [];
  }

  user.services.email.verificationTokens.push(tokenRecord);
  return {
    email,
    user,
    token
  };
};
/**
 * @summary Creates options for email sending for reset password and enroll account emails.
 * You can use this function when customizing a reset password or enroll account email sending.
 * @locus Server
 * @param {Object} email Which address of the user's to send the email to.
 * @param {Object} user The user object to generate options for.
 * @param {String} url URL to which user is directed to confirm the email.
 * @param {String} reason `resetPassword` or `enrollAccount`.
 * @returns {Object} Options which can be passed to `Email.send`.
 * @importFromPackage accounts-base
 */


Accounts.generateOptionsForEmail = (email, user, url, reason) => {
  const options = {
    to: email,
    from: Accounts.emailTemplates[reason].from ? Accounts.emailTemplates[reason].from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates[reason].subject(user)
  };

  if (typeof Accounts.emailTemplates[reason].text === 'function') {
    options.text = Accounts.emailTemplates[reason].text(user, url);
  }

  if (typeof Accounts.emailTemplates[reason].html === 'function') {
    options.html = Accounts.emailTemplates[reason].html(user, url);
  }

  if (typeof Accounts.emailTemplates.headers === 'object') {
    options.headers = Accounts.emailTemplates.headers;
  }

  return options;
}; // send the user an email with a link that when opened allows the user
// to set a new password, without the old password.

/**
 * @summary Send an email with a link the user can use to reset their password.
 * @locus Server
 * @param {String} userId The id of the user to send email to.
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 * @param {Object} [extraTokenData] Optional additional data to be added into the token record.
 * @returns {Object} Object with {email, user, token, url, options} values.
 * @importFromPackage accounts-base
 */


Accounts.sendResetPasswordEmail = (userId, email, extraTokenData) => {
  const {
    email: realEmail,
    user,
    token
  } = Accounts.generateResetToken(userId, email, 'resetPassword', extraTokenData);
  const url = Accounts.urls.resetPassword(token);
  const options = Accounts.generateOptionsForEmail(realEmail, user, url, 'resetPassword');
  Email.send(options);
  return {
    email: realEmail,
    user,
    token,
    url,
    options
  };
}; // send the user an email informing them that their account was created, with
// a link that when opened both marks their email as verified and forces them
// to choose their password. The email must be one of the addresses in the
// user's emails field, or undefined to pick the first email automatically.
//
// This is not called automatically. It must be called manually if you
// want to use enrollment emails.

/**
 * @summary Send an email with a link the user can use to set their initial password.
 * @locus Server
 * @param {String} userId The id of the user to send email to.
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 * @param {Object} [extraTokenData] Optional additional data to be added into the token record.
 * @returns {Object} Object with {email, user, token, url, options} values.
 * @importFromPackage accounts-base
 */


Accounts.sendEnrollmentEmail = (userId, email, extraTokenData) => {
  const {
    email: realEmail,
    user,
    token
  } = Accounts.generateResetToken(userId, email, 'enrollAccount', extraTokenData);
  const url = Accounts.urls.enrollAccount(token);
  const options = Accounts.generateOptionsForEmail(realEmail, user, url, 'enrollAccount');
  Email.send(options);
  return {
    email: realEmail,
    user,
    token,
    url,
    options
  };
}; // Take token from sendResetPasswordEmail or sendEnrollmentEmail, change
// the users password, and log them in.


Meteor.methods({
  resetPassword: function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    const token = args[0];
    const newPassword = args[1];
    return Accounts._loginMethod(this, "resetPassword", args, "password", () => {
      check(token, String);
      check(newPassword, passwordValidator);
      const user = Meteor.users.findOne({
        "services.password.reset.token": token
      });

      if (!user) {
        throw new Meteor.Error(403, "Token expired");
      }

      const {
        when,
        reason,
        email
      } = user.services.password.reset;

      let tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();

      if (reason === "enroll") {
        tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();
      }

      const currentTimeMs = Date.now();
      if (currentTimeMs - when > tokenLifetimeMs) throw new Meteor.Error(403, "Token expired");
      if (!pluckAddresses(user.emails).includes(email)) return {
        userId: user._id,
        error: new Meteor.Error(403, "Token has invalid email address")
      };
      const hashed = hashPassword(newPassword); // NOTE: We're about to invalidate tokens on the user, who we might be
      // logged in as. Make sure to avoid logging ourselves out if this
      // happens. But also make sure not to leave the connection in a state
      // of having a bad token set if things fail.

      const oldToken = Accounts._getLoginToken(this.connection.id);

      Accounts._setLoginToken(user._id, this.connection, null);

      const resetToOldToken = () => Accounts._setLoginToken(user._id, this.connection, oldToken);

      try {
        // Update the user record by:
        // - Changing the password to the new one
        // - Forgetting about the reset token that was just used
        // - Verifying their email, since they got the password reset via email.
        const affectedRecords = Meteor.users.update({
          _id: user._id,
          'emails.address': email,
          'services.password.reset.token': token
        }, {
          $set: {
            'services.password.bcrypt': hashed,
            'emails.$.verified': true
          },
          $unset: {
            'services.password.reset': 1,
            'services.password.srp': 1
          }
        });
        if (affectedRecords !== 1) return {
          userId: user._id,
          error: new Meteor.Error(403, "Invalid email")
        };
      } catch (err) {
        resetToOldToken();
        throw err;
      } // Replace all valid login tokens with new ones (changing
      // password should invalidate existing sessions).


      Accounts._clearAllLoginTokens(user._id);

      return {
        userId: user._id
      };
    });
  }
}); ///
/// EMAIL VERIFICATION
///
// send the user an email with a link that when opened marks that
// address as verified

/**
 * @summary Send an email with a link the user can use verify their email address.
 * @locus Server
 * @param {String} userId The id of the user to send email to.
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
 * @param {Object} [extraTokenData] Optional additional data to be added into the token record.
 * @returns {Object} Object with {email, user, token, url, options} values.
 * @importFromPackage accounts-base
 */

Accounts.sendVerificationEmail = (userId, email, extraTokenData) => {
  // XXX Also generate a link using which someone can delete this
  // account if they own said address but weren't those who created
  // this account.
  const {
    email: realEmail,
    user,
    token
  } = Accounts.generateVerificationToken(userId, email, extraTokenData);
  const url = Accounts.urls.verifyEmail(token);
  const options = Accounts.generateOptionsForEmail(realEmail, user, url, 'verifyEmail');
  Email.send(options);
  return {
    email: realEmail,
    user,
    token,
    url,
    options
  };
}; // Take token from sendVerificationEmail, mark the email as verified,
// and log them in.


Meteor.methods({
  verifyEmail: function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    const token = args[0];
    return Accounts._loginMethod(this, "verifyEmail", args, "password", () => {
      check(token, String);
      const user = Meteor.users.findOne({
        'services.email.verificationTokens.token': token
      });
      if (!user) throw new Meteor.Error(403, "Verify email link expired");
      const tokenRecord = user.services.email.verificationTokens.find(t => t.token == token);
      if (!tokenRecord) return {
        userId: user._id,
        error: new Meteor.Error(403, "Verify email link expired")
      };
      const emailsRecord = user.emails.find(e => e.address == tokenRecord.address);
      if (!emailsRecord) return {
        userId: user._id,
        error: new Meteor.Error(403, "Verify email link is for unknown address")
      }; // By including the address in the query, we can use 'emails.$' in the
      // modifier to get a reference to the specific object in the emails
      // array. See
      // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)
      // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull

      Meteor.users.update({
        _id: user._id,
        'emails.address': tokenRecord.address
      }, {
        $set: {
          'emails.$.verified': true
        },
        $pull: {
          'services.email.verificationTokens': {
            address: tokenRecord.address
          }
        }
      });
      return {
        userId: user._id
      };
    });
  }
});
/**
 * @summary Add an email address for a user. Use this instead of directly
 * updating the database. The operation will fail if there is a different user
 * with an email only differing in case. If the specified user has an existing
 * email only differing in case however, we replace it.
 * @locus Server
 * @param {String} userId The ID of the user to update.
 * @param {String} newEmail A new email address for the user.
 * @param {Boolean} [verified] Optional - whether the new email address should
 * be marked as verified. Defaults to false.
 * @importFromPackage accounts-base
 */

Accounts.addEmail = (userId, newEmail, verified) => {
  check(userId, NonEmptyString);
  check(newEmail, NonEmptyString);
  check(verified, Match.Optional(Boolean));

  if (verified === void 0) {
    verified = false;
  }

  const user = getUserById(userId);
  if (!user) throw new Meteor.Error(403, "User not found"); // Allow users to change their own email to a version with a different case
  // We don't have to call checkForCaseInsensitiveDuplicates to do a case
  // insensitive check across all emails in the database here because: (1) if
  // there is no case-insensitive duplicate between this user and other users,
  // then we are OK and (2) if this would create a conflict with other users
  // then there would already be a case-insensitive duplicate and we can't fix
  // that in this code anyway.

  const caseInsensitiveRegExp = new RegExp("^".concat(Meteor._escapeRegExp(newEmail), "$"), 'i');
  const didUpdateOwnEmail = user.emails.reduce((prev, email) => {
    if (caseInsensitiveRegExp.test(email.address)) {
      Meteor.users.update({
        _id: user._id,
        'emails.address': email.address
      }, {
        $set: {
          'emails.$.address': newEmail,
          'emails.$.verified': verified
        }
      });
      return true;
    } else {
      return prev;
    }
  }, false); // In the other updates below, we have to do another call to
  // checkForCaseInsensitiveDuplicates to make sure that no conflicting values
  // were added to the database in the meantime. We don't have to do this for
  // the case where the user is updating their email address to one that is the
  // same as before, but only different because of capitalization. Read the
  // big comment above to understand why.

  if (didUpdateOwnEmail) {
    return;
  } // Perform a case insensitive check for duplicates before update


  checkForCaseInsensitiveDuplicates('emails.address', 'Email', newEmail, user._id);
  Meteor.users.update({
    _id: user._id
  }, {
    $addToSet: {
      emails: {
        address: newEmail,
        verified: verified
      }
    }
  }); // Perform another check after update, in case a matching user has been
  // inserted in the meantime

  try {
    checkForCaseInsensitiveDuplicates('emails.address', 'Email', newEmail, user._id);
  } catch (ex) {
    // Undo update if the check fails
    Meteor.users.update({
      _id: user._id
    }, {
      $pull: {
        emails: {
          address: newEmail
        }
      }
    });
    throw ex;
  }
};
/**
 * @summary Remove an email address for a user. Use this instead of updating
 * the database directly.
 * @locus Server
 * @param {String} userId The ID of the user to update.
 * @param {String} email The email address to remove.
 * @importFromPackage accounts-base
 */


Accounts.removeEmail = (userId, email) => {
  check(userId, NonEmptyString);
  check(email, NonEmptyString);
  const user = getUserById(userId);
  if (!user) throw new Meteor.Error(403, "User not found");
  Meteor.users.update({
    _id: user._id
  }, {
    $pull: {
      emails: {
        address: email
      }
    }
  });
}; ///
/// CREATING USERS
///
// Shared createUser function called from the createUser method, both
// if originates in client or server code. Calls user provided hooks,
// does the actual user insertion.
//
// returns the user id


const createUser = options => {
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary
  // options.
  check(options, Match.ObjectIncluding({
    username: Match.Optional(String),
    email: Match.Optional(String),
    password: Match.Optional(passwordValidator)
  }));
  const {
    username,
    email,
    password
  } = options;
  if (!username && !email) throw new Meteor.Error(400, "Need to set a username or email");
  const user = {
    services: {}
  };

  if (password) {
    const hashed = hashPassword(password);
    user.services.password = {
      bcrypt: hashed
    };
  }

  if (username) user.username = username;
  if (email) user.emails = [{
    address: email,
    verified: false
  }]; // Perform a case insensitive check before insert

  checkForCaseInsensitiveDuplicates('username', 'Username', username);
  checkForCaseInsensitiveDuplicates('emails.address', 'Email', email);
  const userId = Accounts.insertUserDoc(options, user); // Perform another check after insert, in case a matching user has been
  // inserted in the meantime

  try {
    checkForCaseInsensitiveDuplicates('username', 'Username', username, userId);
    checkForCaseInsensitiveDuplicates('emails.address', 'Email', email, userId);
  } catch (ex) {
    // Remove inserted user if the check fails
    Meteor.users.remove(userId);
    throw ex;
  }

  return userId;
}; // method for create user. Requests come from the client.


Meteor.methods({
  createUser: function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    const options = args[0];
    return Accounts._loginMethod(this, "createUser", args, "password", () => {
      // createUser() above does more checking.
      check(options, Object);
      if (Accounts._options.forbidClientAccountCreation) return {
        error: new Meteor.Error(403, "Signups forbidden")
      }; // Create user. result contains id and token.

      const userId = createUser(options); // safety belt. createUser is supposed to throw on error. send 500 error
      // instead of sending a verification email with empty userid.

      if (!userId) throw new Error("createUser failed to insert new user"); // If `Accounts._options.sendVerificationEmail` is set, register
      // a token to verify the user's primary email, and send it to
      // that address.

      if (options.email && Accounts._options.sendVerificationEmail) Accounts.sendVerificationEmail(userId, options.email); // client gets logged in as the new user afterwards.

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

Accounts.createUser = (options, callback) => {
  options = _objectSpread({}, options); // XXX allow an optional callback?

  if (callback) {
    throw new Error("Accounts.createUser with callback not supported on the server yet.");
  }

  return createUser(options);
}; ///
/// PASSWORD-SPECIFIC INDEXES ON USERS
///


Meteor.users._ensureIndex('services.email.verificationTokens.token', {
  unique: 1,
  sparse: 1
});

Meteor.users._ensureIndex('services.password.reset.token', {
  unique: 1,
  sparse: 1
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/accounts-password/email_templates.js");
require("/node_modules/meteor/accounts-password/password_server.js");

/* Exports */
Package._define("accounts-password");

})();

//# sourceURL=meteor://💻app/packages/accounts-password.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWNjb3VudHMtcGFzc3dvcmQvZW1haWxfdGVtcGxhdGVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9hY2NvdW50cy1wYXNzd29yZC9wYXNzd29yZF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiZ3JlZXQiLCJ3ZWxjb21lTXNnIiwidXNlciIsInVybCIsImdyZWV0aW5nIiwicHJvZmlsZSIsIm5hbWUiLCJBY2NvdW50cyIsImVtYWlsVGVtcGxhdGVzIiwiZnJvbSIsInNpdGVOYW1lIiwiTWV0ZW9yIiwiYWJzb2x1dGVVcmwiLCJyZXBsYWNlIiwicmVzZXRQYXNzd29yZCIsInN1YmplY3QiLCJ0ZXh0IiwidmVyaWZ5RW1haWwiLCJlbnJvbGxBY2NvdW50IiwiX29iamVjdFNwcmVhZCIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJjcnlwdCIsIk5wbU1vZHVsZUJjcnlwdCIsImJjcnlwdEhhc2giLCJ3cmFwQXN5bmMiLCJoYXNoIiwiYmNyeXB0Q29tcGFyZSIsImNvbXBhcmUiLCJnZXRVc2VyQnlJZCIsImlkIiwidXNlcnMiLCJmaW5kT25lIiwiX2JjcnlwdFJvdW5kcyIsIl9vcHRpb25zIiwiYmNyeXB0Um91bmRzIiwiZ2V0UGFzc3dvcmRTdHJpbmciLCJwYXNzd29yZCIsIlNIQTI1NiIsImFsZ29yaXRobSIsIkVycm9yIiwiZGlnZXN0IiwiaGFzaFBhc3N3b3JkIiwiZ2V0Um91bmRzRnJvbUJjcnlwdEhhc2giLCJyb3VuZHMiLCJoYXNoU2VnbWVudHMiLCJzcGxpdCIsImxlbmd0aCIsInBhcnNlSW50IiwiX2NoZWNrUGFzc3dvcmQiLCJyZXN1bHQiLCJ1c2VySWQiLCJfaWQiLCJmb3JtYXR0ZWRQYXNzd29yZCIsInNlcnZpY2VzIiwiaGFzaFJvdW5kcyIsImVycm9yIiwiaGFuZGxlRXJyb3IiLCJkZWZlciIsInVwZGF0ZSIsIiRzZXQiLCJjaGVja1Bhc3N3b3JkIiwibXNnIiwidGhyb3dFcnJvciIsImFtYmlndW91c0Vycm9yTWVzc2FnZXMiLCJfZmluZFVzZXJCeVF1ZXJ5IiwicXVlcnkiLCJmaWVsZE5hbWUiLCJmaWVsZFZhbHVlIiwidXNlcm5hbWUiLCJlbWFpbCIsInNlbGVjdG9yIiwic2VsZWN0b3JGb3JGYXN0Q2FzZUluc2Vuc2l0aXZlTG9va3VwIiwiY2FuZGlkYXRlVXNlcnMiLCJmaW5kIiwiZmV0Y2giLCJmaW5kVXNlckJ5VXNlcm5hbWUiLCJmaW5kVXNlckJ5RW1haWwiLCJzdHJpbmciLCJwcmVmaXgiLCJzdWJzdHJpbmciLCJNYXRoIiwibWluIiwib3JDbGF1c2UiLCJnZW5lcmF0ZUNhc2VQZXJtdXRhdGlvbnNGb3JTdHJpbmciLCJtYXAiLCJwcmVmaXhQZXJtdXRhdGlvbiIsIlJlZ0V4cCIsIl9lc2NhcGVSZWdFeHAiLCJjYXNlSW5zZW5zaXRpdmVDbGF1c2UiLCIkYW5kIiwiJG9yIiwicGVybXV0YXRpb25zIiwiaSIsImNoIiwiY2hhckF0IiwiY29uY2F0IiwibG93ZXJDYXNlQ2hhciIsInRvTG93ZXJDYXNlIiwidXBwZXJDYXNlQ2hhciIsInRvVXBwZXJDYXNlIiwiY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzIiwiZGlzcGxheU5hbWUiLCJvd25Vc2VySWQiLCJza2lwQ2hlY2siLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJfc2tpcENhc2VJbnNlbnNpdGl2ZUNoZWNrc0ZvclRlc3QiLCJtYXRjaGVkVXNlcnMiLCJOb25FbXB0eVN0cmluZyIsIk1hdGNoIiwiV2hlcmUiLCJ4IiwiY2hlY2siLCJTdHJpbmciLCJ1c2VyUXVlcnlWYWxpZGF0b3IiLCJPcHRpb25hbCIsImtleXMiLCJwYXNzd29yZFZhbGlkYXRvciIsIk9uZU9mIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJvcHRpb25zIiwic3JwIiwidW5kZWZpbmVkIiwidmVyaWZpZXIiLCJuZXdWZXJpZmllciIsIlNSUCIsImdlbmVyYXRlVmVyaWZpZXIiLCJpZGVudGl0eSIsInNhbHQiLCJFSlNPTiIsInN0cmluZ2lmeSIsImZvcm1hdCIsInYxIiwidjIiLCJoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkIiwic2FsdGVkIiwiJHVuc2V0Iiwic2V0VXNlcm5hbWUiLCJuZXdVc2VybmFtZSIsIm9sZFVzZXJuYW1lIiwiZXgiLCJtZXRob2RzIiwiY2hhbmdlUGFzc3dvcmQiLCJvbGRQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwiaGFzaGVkIiwiY3VycmVudFRva2VuIiwiX2dldExvZ2luVG9rZW4iLCJjb25uZWN0aW9uIiwiJHB1bGwiLCJoYXNoZWRUb2tlbiIsIiRuZSIsInBhc3N3b3JkQ2hhbmdlZCIsInNldFBhc3N3b3JkIiwibmV3UGxhaW50ZXh0UGFzc3dvcmQiLCJsb2dvdXQiLCJwbHVja0FkZHJlc3NlcyIsImVtYWlscyIsImFkZHJlc3MiLCJmb3Jnb3RQYXNzd29yZCIsImNhc2VTZW5zaXRpdmVFbWFpbCIsInNlbmRSZXNldFBhc3N3b3JkRW1haWwiLCJnZW5lcmF0ZVJlc2V0VG9rZW4iLCJyZWFzb24iLCJleHRyYVRva2VuRGF0YSIsImluY2x1ZGVzIiwidG9rZW4iLCJSYW5kb20iLCJzZWNyZXQiLCJ0b2tlblJlY29yZCIsIndoZW4iLCJEYXRlIiwiYXNzaWduIiwiX2Vuc3VyZSIsInJlc2V0IiwiZ2VuZXJhdGVWZXJpZmljYXRpb25Ub2tlbiIsImVtYWlsUmVjb3JkIiwiZSIsInZlcmlmaWVkIiwiJHB1c2giLCJ2ZXJpZmljYXRpb25Ub2tlbnMiLCJwdXNoIiwiZ2VuZXJhdGVPcHRpb25zRm9yRW1haWwiLCJ0byIsImh0bWwiLCJoZWFkZXJzIiwicmVhbEVtYWlsIiwidXJscyIsIkVtYWlsIiwic2VuZCIsInNlbmRFbnJvbGxtZW50RW1haWwiLCJhcmdzIiwiX2xvZ2luTWV0aG9kIiwidG9rZW5MaWZldGltZU1zIiwiX2dldFBhc3N3b3JkUmVzZXRUb2tlbkxpZmV0aW1lTXMiLCJfZ2V0UGFzc3dvcmRFbnJvbGxUb2tlbkxpZmV0aW1lTXMiLCJjdXJyZW50VGltZU1zIiwibm93Iiwib2xkVG9rZW4iLCJfc2V0TG9naW5Ub2tlbiIsInJlc2V0VG9PbGRUb2tlbiIsImFmZmVjdGVkUmVjb3JkcyIsImVyciIsIl9jbGVhckFsbExvZ2luVG9rZW5zIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidCIsImVtYWlsc1JlY29yZCIsImFkZEVtYWlsIiwibmV3RW1haWwiLCJCb29sZWFuIiwiY2FzZUluc2Vuc2l0aXZlUmVnRXhwIiwiZGlkVXBkYXRlT3duRW1haWwiLCJyZWR1Y2UiLCJwcmV2IiwidGVzdCIsIiRhZGRUb1NldCIsInJlbW92ZUVtYWlsIiwiY3JlYXRlVXNlciIsIk9iamVjdEluY2x1ZGluZyIsImluc2VydFVzZXJEb2MiLCJyZW1vdmUiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJjYWxsYmFjayIsIl9lbnN1cmVJbmRleCIsInVuaXF1ZSIsInNwYXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsS0FBSyxHQUFHQyxVQUFVLElBQUksQ0FBQ0MsSUFBRCxFQUFPQyxHQUFQLEtBQWU7QUFDckMsUUFBTUMsUUFBUSxHQUFJRixJQUFJLENBQUNHLE9BQUwsSUFBZ0JILElBQUksQ0FBQ0csT0FBTCxDQUFhQyxJQUE5QixtQkFDREosSUFBSSxDQUFDRyxPQUFMLENBQWFDLElBRFosU0FDdUIsUUFEeEM7QUFFQSxtQkFBVUYsUUFBVixpQkFFSkgsVUFGSSwrQ0FJSkUsR0FKSTtBQVFMLENBWEQ7QUFhQTs7Ozs7OztBQUtBSSxRQUFRLENBQUNDLGNBQVQsR0FBMEI7QUFDeEJDLE1BQUksRUFBRSx5Q0FEa0I7QUFFeEJDLFVBQVEsRUFBRUMsTUFBTSxDQUFDQyxXQUFQLEdBQXFCQyxPQUFyQixDQUE2QixjQUE3QixFQUE2QyxFQUE3QyxFQUFpREEsT0FBakQsQ0FBeUQsS0FBekQsRUFBZ0UsRUFBaEUsQ0FGYztBQUl4QkMsZUFBYSxFQUFFO0FBQ2JDLFdBQU8sRUFBRSw4Q0FBdUNSLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QkUsUUFBL0QsQ0FESTtBQUViTSxRQUFJLEVBQUVoQixLQUFLLENBQUMsd0JBQUQ7QUFGRSxHQUpTO0FBUXhCaUIsYUFBVyxFQUFFO0FBQ1hGLFdBQU8sRUFBRSwrQ0FBd0NSLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QkUsUUFBaEUsQ0FERTtBQUVYTSxRQUFJLEVBQUVoQixLQUFLLENBQUMsOEJBQUQ7QUFGQSxHQVJXO0FBWXhCa0IsZUFBYSxFQUFFO0FBQ2JILFdBQU8sRUFBRSx1REFBZ0RSLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QkUsUUFBeEUsQ0FESTtBQUViTSxRQUFJLEVBQUVoQixLQUFLLENBQUMsNEJBQUQ7QUFGRTtBQVpTLENBQTFCLEM7Ozs7Ozs7Ozs7O0FDbEJBLElBQUltQixhQUFKOztBQUFrQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0NBQVosRUFBbUQ7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osaUJBQWEsR0FBQ0ksQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBbkQsRUFBaUYsQ0FBakY7QUFBbEI7QUFFQSxNQUFNQyxNQUFNLEdBQUdDLGVBQWY7QUFDQSxNQUFNQyxVQUFVLEdBQUdmLE1BQU0sQ0FBQ2dCLFNBQVAsQ0FBaUJILE1BQU0sQ0FBQ0ksSUFBeEIsQ0FBbkI7QUFDQSxNQUFNQyxhQUFhLEdBQUdsQixNQUFNLENBQUNnQixTQUFQLENBQWlCSCxNQUFNLENBQUNNLE9BQXhCLENBQXRCLEMsQ0FFQTs7QUFDQSxNQUFNQyxXQUFXLEdBQUdDLEVBQUUsSUFBSXJCLE1BQU0sQ0FBQ3NCLEtBQVAsQ0FBYUMsT0FBYixDQUFxQkYsRUFBckIsQ0FBMUIsQyxDQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQXpCLFFBQVEsQ0FBQzRCLGFBQVQsR0FBeUIsTUFBTTVCLFFBQVEsQ0FBQzZCLFFBQVQsQ0FBa0JDLFlBQWxCLElBQWtDLEVBQWpFLEMsQ0FFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFNQyxpQkFBaUIsR0FBR0MsUUFBUSxJQUFJO0FBQ3BDLE1BQUksT0FBT0EsUUFBUCxLQUFvQixRQUF4QixFQUFrQztBQUNoQ0EsWUFBUSxHQUFHQyxNQUFNLENBQUNELFFBQUQsQ0FBakI7QUFDRCxHQUZELE1BRU87QUFBRTtBQUNQLFFBQUlBLFFBQVEsQ0FBQ0UsU0FBVCxLQUF1QixTQUEzQixFQUFzQztBQUNwQyxZQUFNLElBQUlDLEtBQUosQ0FBVSxzQ0FDQSw0QkFEVixDQUFOO0FBRUQ7O0FBQ0RILFlBQVEsR0FBR0EsUUFBUSxDQUFDSSxNQUFwQjtBQUNEOztBQUNELFNBQU9KLFFBQVA7QUFDRCxDQVhELEMsQ0FhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFNSyxZQUFZLEdBQUdMLFFBQVEsSUFBSTtBQUMvQkEsVUFBUSxHQUFHRCxpQkFBaUIsQ0FBQ0MsUUFBRCxDQUE1QjtBQUNBLFNBQU9iLFVBQVUsQ0FBQ2EsUUFBRCxFQUFXaEMsUUFBUSxDQUFDNEIsYUFBVCxFQUFYLENBQWpCO0FBQ0QsQ0FIRCxDLENBS0E7OztBQUNBLE1BQU1VLHVCQUF1QixHQUFHakIsSUFBSSxJQUFJO0FBQ3RDLE1BQUlrQixNQUFKOztBQUNBLE1BQUlsQixJQUFKLEVBQVU7QUFDUixVQUFNbUIsWUFBWSxHQUFHbkIsSUFBSSxDQUFDb0IsS0FBTCxDQUFXLEdBQVgsQ0FBckI7O0FBQ0EsUUFBSUQsWUFBWSxDQUFDRSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCSCxZQUFNLEdBQUdJLFFBQVEsQ0FBQ0gsWUFBWSxDQUFDLENBQUQsQ0FBYixFQUFrQixFQUFsQixDQUFqQjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBT0QsTUFBUDtBQUNELENBVEQsQyxDQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0F2QyxRQUFRLENBQUM0QyxjQUFULEdBQTBCLENBQUNqRCxJQUFELEVBQU9xQyxRQUFQLEtBQW9CO0FBQzVDLFFBQU1hLE1BQU0sR0FBRztBQUNiQyxVQUFNLEVBQUVuRCxJQUFJLENBQUNvRDtBQURBLEdBQWY7QUFJQSxRQUFNQyxpQkFBaUIsR0FBR2pCLGlCQUFpQixDQUFDQyxRQUFELENBQTNDO0FBQ0EsUUFBTVgsSUFBSSxHQUFHMUIsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBZCxDQUF1QmYsTUFBcEM7QUFDQSxRQUFNaUMsVUFBVSxHQUFHWix1QkFBdUIsQ0FBQ2pCLElBQUQsQ0FBMUM7O0FBRUEsTUFBSSxDQUFFQyxhQUFhLENBQUMwQixpQkFBRCxFQUFvQjNCLElBQXBCLENBQW5CLEVBQThDO0FBQzVDd0IsVUFBTSxDQUFDTSxLQUFQLEdBQWVDLFdBQVcsQ0FBQyxvQkFBRCxFQUF1QixLQUF2QixDQUExQjtBQUNELEdBRkQsTUFFTyxJQUFJL0IsSUFBSSxJQUFJckIsUUFBUSxDQUFDNEIsYUFBVCxNQUE0QnNCLFVBQXhDLEVBQW9EO0FBQ3pEO0FBQ0E5QyxVQUFNLENBQUNpRCxLQUFQLENBQWEsTUFBTTtBQUNqQmpELFlBQU0sQ0FBQ3NCLEtBQVAsQ0FBYTRCLE1BQWIsQ0FBb0I7QUFBRVAsV0FBRyxFQUFFcEQsSUFBSSxDQUFDb0Q7QUFBWixPQUFwQixFQUF1QztBQUNyQ1EsWUFBSSxFQUFFO0FBQ0osc0NBQ0VwQyxVQUFVLENBQUM2QixpQkFBRCxFQUFvQmhELFFBQVEsQ0FBQzRCLGFBQVQsRUFBcEI7QUFGUjtBQUQrQixPQUF2QztBQU1ELEtBUEQ7QUFRRDs7QUFFRCxTQUFPaUIsTUFBUDtBQUNELENBeEJEOztBQXlCQSxNQUFNVyxhQUFhLEdBQUd4RCxRQUFRLENBQUM0QyxjQUEvQixDLENBRUE7QUFDQTtBQUNBOztBQUNBLE1BQU1RLFdBQVcsR0FBRyxVQUFDSyxHQUFELEVBQTRCO0FBQUEsTUFBdEJDLFVBQXNCLHVFQUFULElBQVM7QUFDOUMsUUFBTVAsS0FBSyxHQUFHLElBQUkvQyxNQUFNLENBQUMrQixLQUFYLENBQ1osR0FEWSxFQUVabkMsUUFBUSxDQUFDNkIsUUFBVCxDQUFrQjhCLHNCQUFsQixHQUNJLHNEQURKLEdBRUlGLEdBSlEsQ0FBZDs7QUFNQSxNQUFJQyxVQUFKLEVBQWdCO0FBQ2QsVUFBTVAsS0FBTjtBQUNEOztBQUNELFNBQU9BLEtBQVA7QUFDRCxDQVhELEMsQ0FhQTtBQUNBO0FBQ0E7OztBQUVBbkQsUUFBUSxDQUFDNEQsZ0JBQVQsR0FBNEJDLEtBQUssSUFBSTtBQUNuQyxNQUFJbEUsSUFBSSxHQUFHLElBQVg7O0FBRUEsTUFBSWtFLEtBQUssQ0FBQ3BDLEVBQVYsRUFBYztBQUNaOUIsUUFBSSxHQUFHNkIsV0FBVyxDQUFDcUMsS0FBSyxDQUFDcEMsRUFBUCxDQUFsQjtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUlxQyxTQUFKO0FBQ0EsUUFBSUMsVUFBSjs7QUFDQSxRQUFJRixLQUFLLENBQUNHLFFBQVYsRUFBb0I7QUFDbEJGLGVBQVMsR0FBRyxVQUFaO0FBQ0FDLGdCQUFVLEdBQUdGLEtBQUssQ0FBQ0csUUFBbkI7QUFDRCxLQUhELE1BR08sSUFBSUgsS0FBSyxDQUFDSSxLQUFWLEVBQWlCO0FBQ3RCSCxlQUFTLEdBQUcsZ0JBQVo7QUFDQUMsZ0JBQVUsR0FBR0YsS0FBSyxDQUFDSSxLQUFuQjtBQUNELEtBSE0sTUFHQTtBQUNMLFlBQU0sSUFBSTlCLEtBQUosQ0FBVSxnREFBVixDQUFOO0FBQ0Q7O0FBQ0QsUUFBSStCLFFBQVEsR0FBRyxFQUFmO0FBQ0FBLFlBQVEsQ0FBQ0osU0FBRCxDQUFSLEdBQXNCQyxVQUF0QjtBQUNBcEUsUUFBSSxHQUFHUyxNQUFNLENBQUNzQixLQUFQLENBQWFDLE9BQWIsQ0FBcUJ1QyxRQUFyQixDQUFQLENBZEssQ0FlTDs7QUFDQSxRQUFJLENBQUN2RSxJQUFMLEVBQVc7QUFDVHVFLGNBQVEsR0FBR0Msb0NBQW9DLENBQUNMLFNBQUQsRUFBWUMsVUFBWixDQUEvQztBQUNBLFlBQU1LLGNBQWMsR0FBR2hFLE1BQU0sQ0FBQ3NCLEtBQVAsQ0FBYTJDLElBQWIsQ0FBa0JILFFBQWxCLEVBQTRCSSxLQUE1QixFQUF2QixDQUZTLENBR1Q7O0FBQ0EsVUFBSUYsY0FBYyxDQUFDMUIsTUFBZixLQUEwQixDQUE5QixFQUFpQztBQUMvQi9DLFlBQUksR0FBR3lFLGNBQWMsQ0FBQyxDQUFELENBQXJCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQU96RSxJQUFQO0FBQ0QsQ0FoQ0Q7QUFrQ0E7Ozs7Ozs7Ozs7OztBQVVBSyxRQUFRLENBQUN1RSxrQkFBVCxHQUNFUCxRQUFRLElBQUloRSxRQUFRLENBQUM0RCxnQkFBVCxDQUEwQjtBQUFFSTtBQUFGLENBQTFCLENBRGQ7QUFHQTs7Ozs7Ozs7Ozs7O0FBVUFoRSxRQUFRLENBQUN3RSxlQUFULEdBQTJCUCxLQUFLLElBQUlqRSxRQUFRLENBQUM0RCxnQkFBVCxDQUEwQjtBQUFFSztBQUFGLENBQTFCLENBQXBDLEMsQ0FFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU1FLG9DQUFvQyxHQUFHLENBQUNMLFNBQUQsRUFBWVcsTUFBWixLQUF1QjtBQUNsRTtBQUNBLFFBQU1DLE1BQU0sR0FBR0QsTUFBTSxDQUFDRSxTQUFQLENBQWlCLENBQWpCLEVBQW9CQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0osTUFBTSxDQUFDL0IsTUFBaEIsRUFBd0IsQ0FBeEIsQ0FBcEIsQ0FBZjtBQUNBLFFBQU1vQyxRQUFRLEdBQUdDLGlDQUFpQyxDQUFDTCxNQUFELENBQWpDLENBQTBDTSxHQUExQyxDQUNmQyxpQkFBaUIsSUFBSTtBQUNuQixVQUFNZixRQUFRLEdBQUcsRUFBakI7QUFDQUEsWUFBUSxDQUFDSixTQUFELENBQVIsR0FDRSxJQUFJb0IsTUFBSixZQUFlOUUsTUFBTSxDQUFDK0UsYUFBUCxDQUFxQkYsaUJBQXJCLENBQWYsRUFERjtBQUVBLFdBQU9mLFFBQVA7QUFDRCxHQU5jLENBQWpCO0FBT0EsUUFBTWtCLHFCQUFxQixHQUFHLEVBQTlCO0FBQ0FBLHVCQUFxQixDQUFDdEIsU0FBRCxDQUFyQixHQUNFLElBQUlvQixNQUFKLFlBQWU5RSxNQUFNLENBQUMrRSxhQUFQLENBQXFCVixNQUFyQixDQUFmLFFBQWdELEdBQWhELENBREY7QUFFQSxTQUFPO0FBQUNZLFFBQUksRUFBRSxDQUFDO0FBQUNDLFNBQUcsRUFBRVI7QUFBTixLQUFELEVBQWtCTSxxQkFBbEI7QUFBUCxHQUFQO0FBQ0QsQ0FkRCxDLENBZ0JBOzs7QUFDQSxNQUFNTCxpQ0FBaUMsR0FBR04sTUFBTSxJQUFJO0FBQ2xELE1BQUljLFlBQVksR0FBRyxDQUFDLEVBQUQsQ0FBbkI7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHZixNQUFNLENBQUMvQixNQUEzQixFQUFtQzhDLENBQUMsRUFBcEMsRUFBd0M7QUFDdEMsVUFBTUMsRUFBRSxHQUFHaEIsTUFBTSxDQUFDaUIsTUFBUCxDQUFjRixDQUFkLENBQVg7QUFDQUQsZ0JBQVksR0FBRyxHQUFHSSxNQUFILENBQVUsR0FBSUosWUFBWSxDQUFDUCxHQUFiLENBQWlCTixNQUFNLElBQUk7QUFDdEQsWUFBTWtCLGFBQWEsR0FBR0gsRUFBRSxDQUFDSSxXQUFILEVBQXRCO0FBQ0EsWUFBTUMsYUFBYSxHQUFHTCxFQUFFLENBQUNNLFdBQUgsRUFBdEIsQ0FGc0QsQ0FHdEQ7O0FBQ0EsVUFBSUgsYUFBYSxLQUFLRSxhQUF0QixFQUFxQztBQUNuQyxlQUFPLENBQUNwQixNQUFNLEdBQUdlLEVBQVYsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sQ0FBQ2YsTUFBTSxHQUFHa0IsYUFBVixFQUF5QmxCLE1BQU0sR0FBR29CLGFBQWxDLENBQVA7QUFDRDtBQUNGLEtBVDRCLENBQWQsQ0FBZjtBQVVEOztBQUNELFNBQU9QLFlBQVA7QUFDRCxDQWhCRDs7QUFrQkEsTUFBTVMsaUNBQWlDLEdBQUcsQ0FBQ2xDLFNBQUQsRUFBWW1DLFdBQVosRUFBeUJsQyxVQUF6QixFQUFxQ21DLFNBQXJDLEtBQW1EO0FBQzNGO0FBQ0E7QUFDQSxRQUFNQyxTQUFTLEdBQUdDLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkMsY0FBakIsQ0FBZ0NDLElBQWhDLENBQXFDdkcsUUFBUSxDQUFDd0csaUNBQTlDLEVBQWlGekMsVUFBakYsQ0FBbEI7O0FBRUEsTUFBSUEsVUFBVSxJQUFJLENBQUNvQyxTQUFuQixFQUE4QjtBQUM1QixVQUFNTSxZQUFZLEdBQUdyRyxNQUFNLENBQUNzQixLQUFQLENBQWEyQyxJQUFiLENBQ25CRixvQ0FBb0MsQ0FBQ0wsU0FBRCxFQUFZQyxVQUFaLENBRGpCLEVBQzBDTyxLQUQxQyxFQUFyQjs7QUFHQSxRQUFJbUMsWUFBWSxDQUFDL0QsTUFBYixHQUFzQixDQUF0QixNQUNBO0FBQ0MsS0FBQ3dELFNBQUQsSUFDRDtBQUNBO0FBQ0NPLGdCQUFZLENBQUMvRCxNQUFiLEdBQXNCLENBQXRCLElBQTJCK0QsWUFBWSxDQUFDLENBQUQsQ0FBWixDQUFnQjFELEdBQWhCLEtBQXdCbUQsU0FMcEQsQ0FBSixFQUtxRTtBQUNuRTlDLGlCQUFXLFdBQUk2QyxXQUFKLHNCQUFYO0FBQ0Q7QUFDRjtBQUNGLENBbEJELEMsQ0FvQkE7OztBQUNBLE1BQU1TLGNBQWMsR0FBR0MsS0FBSyxDQUFDQyxLQUFOLENBQVlDLENBQUMsSUFBSTtBQUN0Q0MsT0FBSyxDQUFDRCxDQUFELEVBQUlFLE1BQUosQ0FBTDtBQUNBLFNBQU9GLENBQUMsQ0FBQ25FLE1BQUYsR0FBVyxDQUFsQjtBQUNELENBSHNCLENBQXZCO0FBS0EsTUFBTXNFLGtCQUFrQixHQUFHTCxLQUFLLENBQUNDLEtBQU4sQ0FBWWpILElBQUksSUFBSTtBQUM3Q21ILE9BQUssQ0FBQ25ILElBQUQsRUFBTztBQUNWOEIsTUFBRSxFQUFFa0YsS0FBSyxDQUFDTSxRQUFOLENBQWVQLGNBQWYsQ0FETTtBQUVWMUMsWUFBUSxFQUFFMkMsS0FBSyxDQUFDTSxRQUFOLENBQWVQLGNBQWYsQ0FGQTtBQUdWekMsU0FBSyxFQUFFMEMsS0FBSyxDQUFDTSxRQUFOLENBQWVQLGNBQWY7QUFIRyxHQUFQLENBQUw7QUFLQSxNQUFJTixNQUFNLENBQUNjLElBQVAsQ0FBWXZILElBQVosRUFBa0IrQyxNQUFsQixLQUE2QixDQUFqQyxFQUNFLE1BQU0sSUFBSWlFLEtBQUssQ0FBQ3hFLEtBQVYsQ0FBZ0IsMkNBQWhCLENBQU47QUFDRixTQUFPLElBQVA7QUFDRCxDQVQwQixDQUEzQjtBQVdBLE1BQU1nRixpQkFBaUIsR0FBR1IsS0FBSyxDQUFDUyxLQUFOLENBQ3hCTCxNQUR3QixFQUV4QjtBQUFFM0UsUUFBTSxFQUFFMkUsTUFBVjtBQUFrQjdFLFdBQVMsRUFBRTZFO0FBQTdCLENBRndCLENBQTFCLEMsQ0FLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBL0csUUFBUSxDQUFDcUgsb0JBQVQsQ0FBOEIsVUFBOUIsRUFBMENDLE9BQU8sSUFBSTtBQUNuRCxNQUFJLENBQUVBLE9BQU8sQ0FBQ3RGLFFBQVYsSUFBc0JzRixPQUFPLENBQUNDLEdBQWxDLEVBQ0UsT0FBT0MsU0FBUCxDQUZpRCxDQUUvQjs7QUFFcEJWLE9BQUssQ0FBQ1EsT0FBRCxFQUFVO0FBQ2IzSCxRQUFJLEVBQUVxSCxrQkFETztBQUViaEYsWUFBUSxFQUFFbUY7QUFGRyxHQUFWLENBQUw7O0FBTUEsUUFBTXhILElBQUksR0FBR0ssUUFBUSxDQUFDNEQsZ0JBQVQsQ0FBMEIwRCxPQUFPLENBQUMzSCxJQUFsQyxDQUFiOztBQUNBLE1BQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1R5RCxlQUFXLENBQUMsZ0JBQUQsQ0FBWDtBQUNEOztBQUVELE1BQUksQ0FBQ3pELElBQUksQ0FBQ3NELFFBQU4sSUFBa0IsQ0FBQ3RELElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWpDLElBQ0EsRUFBRXJDLElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWQsQ0FBdUJmLE1BQXZCLElBQWlDdEIsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBZCxDQUF1QnVGLEdBQTFELENBREosRUFDb0U7QUFDbEVuRSxlQUFXLENBQUMsMEJBQUQsQ0FBWDtBQUNEOztBQUVELE1BQUksQ0FBQ3pELElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWQsQ0FBdUJmLE1BQTVCLEVBQW9DO0FBQ2xDLFFBQUksT0FBT3FHLE9BQU8sQ0FBQ3RGLFFBQWYsS0FBNEIsUUFBaEMsRUFBMEM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFNeUYsUUFBUSxHQUFHOUgsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBZCxDQUF1QnVGLEdBQXhDO0FBQ0EsWUFBTUcsV0FBVyxHQUFHQyxHQUFHLENBQUNDLGdCQUFKLENBQXFCTixPQUFPLENBQUN0RixRQUE3QixFQUF1QztBQUN6RDZGLGdCQUFRLEVBQUVKLFFBQVEsQ0FBQ0ksUUFEc0M7QUFDNUJDLFlBQUksRUFBRUwsUUFBUSxDQUFDSztBQURhLE9BQXZDLENBQXBCOztBQUdBLFVBQUlMLFFBQVEsQ0FBQ0EsUUFBVCxLQUFzQkMsV0FBVyxDQUFDRCxRQUF0QyxFQUFnRDtBQUM5QyxlQUFPO0FBQ0wzRSxnQkFBTSxFQUFFOUMsUUFBUSxDQUFDNkIsUUFBVCxDQUFrQjhCLHNCQUFsQixHQUEyQyxJQUEzQyxHQUFrRGhFLElBQUksQ0FBQ29ELEdBRDFEO0FBRUxJLGVBQUssRUFBRUMsV0FBVyxDQUFDLG9CQUFELEVBQXVCLEtBQXZCO0FBRmIsU0FBUDtBQUlEOztBQUVELGFBQU87QUFBQ04sY0FBTSxFQUFFbkQsSUFBSSxDQUFDb0Q7QUFBZCxPQUFQO0FBQ0QsS0FqQkQsTUFpQk87QUFDTDtBQUNBLFlBQU0sSUFBSTNDLE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IscUJBQXRCLEVBQTZDNEYsS0FBSyxDQUFDQyxTQUFOLENBQWdCO0FBQ2pFQyxjQUFNLEVBQUUsS0FEeUQ7QUFFakVKLGdCQUFRLEVBQUVsSSxJQUFJLENBQUNzRCxRQUFMLENBQWNqQixRQUFkLENBQXVCdUYsR0FBdkIsQ0FBMkJNO0FBRjRCLE9BQWhCLENBQTdDLENBQU47QUFJRDtBQUNGOztBQUVELFNBQU9yRSxhQUFhLENBQ2xCN0QsSUFEa0IsRUFFbEIySCxPQUFPLENBQUN0RixRQUZVLENBQXBCO0FBSUQsQ0FuREQsRSxDQXFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FoQyxRQUFRLENBQUNxSCxvQkFBVCxDQUE4QixVQUE5QixFQUEwQ0MsT0FBTyxJQUFJO0FBQ25ELE1BQUksQ0FBQ0EsT0FBTyxDQUFDQyxHQUFULElBQWdCLENBQUNELE9BQU8sQ0FBQ3RGLFFBQTdCLEVBQXVDO0FBQ3JDLFdBQU93RixTQUFQLENBRHFDLENBQ25CO0FBQ25COztBQUVEVixPQUFLLENBQUNRLE9BQUQsRUFBVTtBQUNiM0gsUUFBSSxFQUFFcUgsa0JBRE87QUFFYk8sT0FBRyxFQUFFUixNQUZRO0FBR2IvRSxZQUFRLEVBQUVtRjtBQUhHLEdBQVYsQ0FBTDs7QUFNQSxRQUFNeEgsSUFBSSxHQUFHSyxRQUFRLENBQUM0RCxnQkFBVCxDQUEwQjBELE9BQU8sQ0FBQzNILElBQWxDLENBQWI7O0FBQ0EsTUFBSSxDQUFDQSxJQUFMLEVBQVc7QUFDVHlELGVBQVcsQ0FBQyxnQkFBRCxDQUFYO0FBQ0QsR0Fka0QsQ0FnQm5EO0FBQ0E7OztBQUNBLE1BQUl6RCxJQUFJLENBQUNzRCxRQUFMLElBQWlCdEQsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBL0IsSUFBMkNyQyxJQUFJLENBQUNzRCxRQUFMLENBQWNqQixRQUFkLENBQXVCZixNQUF0RSxFQUE4RTtBQUM1RSxXQUFPdUMsYUFBYSxDQUFDN0QsSUFBRCxFQUFPMkgsT0FBTyxDQUFDdEYsUUFBZixDQUFwQjtBQUNEOztBQUVELE1BQUksRUFBRXJDLElBQUksQ0FBQ3NELFFBQUwsSUFBaUJ0RCxJQUFJLENBQUNzRCxRQUFMLENBQWNqQixRQUEvQixJQUEyQ3JDLElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWQsQ0FBdUJ1RixHQUFwRSxDQUFKLEVBQThFO0FBQzVFbkUsZUFBVyxDQUFDLDBCQUFELENBQVg7QUFDRDs7QUFFRCxRQUFNOEUsRUFBRSxHQUFHdkksSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBZCxDQUF1QnVGLEdBQXZCLENBQTJCRSxRQUF0QztBQUNBLFFBQU1VLEVBQUUsR0FBR1IsR0FBRyxDQUFDQyxnQkFBSixDQUNULElBRFMsRUFFVDtBQUNFUSw2QkFBeUIsRUFBRWQsT0FBTyxDQUFDQyxHQURyQztBQUVFTyxRQUFJLEVBQUVuSSxJQUFJLENBQUNzRCxRQUFMLENBQWNqQixRQUFkLENBQXVCdUYsR0FBdkIsQ0FBMkJPO0FBRm5DLEdBRlMsRUFNVEwsUUFORjs7QUFPQSxNQUFJUyxFQUFFLEtBQUtDLEVBQVgsRUFBZTtBQUNiLFdBQU87QUFDTHJGLFlBQU0sRUFBRTlDLFFBQVEsQ0FBQzZCLFFBQVQsQ0FBa0I4QixzQkFBbEIsR0FBMkMsSUFBM0MsR0FBa0RoRSxJQUFJLENBQUNvRCxHQUQxRDtBQUVMSSxXQUFLLEVBQUVDLFdBQVcsQ0FBQyxvQkFBRCxFQUF1QixLQUF2QjtBQUZiLEtBQVA7QUFJRCxHQXZDa0QsQ0F5Q25EOzs7QUFDQSxRQUFNaUYsTUFBTSxHQUFHaEcsWUFBWSxDQUFDaUYsT0FBTyxDQUFDdEYsUUFBVCxDQUEzQjtBQUNBNUIsUUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUNFM0QsSUFBSSxDQUFDb0QsR0FEUCxFQUVFO0FBQ0V1RixVQUFNLEVBQUU7QUFBRSwrQkFBeUI7QUFBM0IsS0FEVjtBQUVFL0UsUUFBSSxFQUFFO0FBQUUsa0NBQTRCOEU7QUFBOUI7QUFGUixHQUZGO0FBUUEsU0FBTztBQUFDdkYsVUFBTSxFQUFFbkQsSUFBSSxDQUFDb0Q7QUFBZCxHQUFQO0FBQ0QsQ0FwREQsRSxDQXVEQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFTQS9DLFFBQVEsQ0FBQ3VJLFdBQVQsR0FBdUIsQ0FBQ3pGLE1BQUQsRUFBUzBGLFdBQVQsS0FBeUI7QUFDOUMxQixPQUFLLENBQUNoRSxNQUFELEVBQVM0RCxjQUFULENBQUw7QUFDQUksT0FBSyxDQUFDMEIsV0FBRCxFQUFjOUIsY0FBZCxDQUFMO0FBRUEsUUFBTS9HLElBQUksR0FBRzZCLFdBQVcsQ0FBQ3NCLE1BQUQsQ0FBeEI7O0FBQ0EsTUFBSSxDQUFDbkQsSUFBTCxFQUFXO0FBQ1R5RCxlQUFXLENBQUMsZ0JBQUQsQ0FBWDtBQUNEOztBQUVELFFBQU1xRixXQUFXLEdBQUc5SSxJQUFJLENBQUNxRSxRQUF6QixDQVQ4QyxDQVc5Qzs7QUFDQWdDLG1DQUFpQyxDQUFDLFVBQUQsRUFBYSxVQUFiLEVBQXlCd0MsV0FBekIsRUFBc0M3SSxJQUFJLENBQUNvRCxHQUEzQyxDQUFqQztBQUVBM0MsUUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUFvQjtBQUFDUCxPQUFHLEVBQUVwRCxJQUFJLENBQUNvRDtBQUFYLEdBQXBCLEVBQXFDO0FBQUNRLFFBQUksRUFBRTtBQUFDUyxjQUFRLEVBQUV3RTtBQUFYO0FBQVAsR0FBckMsRUFkOEMsQ0FnQjlDO0FBQ0E7O0FBQ0EsTUFBSTtBQUNGeEMscUNBQWlDLENBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUJ3QyxXQUF6QixFQUFzQzdJLElBQUksQ0FBQ29ELEdBQTNDLENBQWpDO0FBQ0QsR0FGRCxDQUVFLE9BQU8yRixFQUFQLEVBQVc7QUFDWDtBQUNBdEksVUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUFvQjtBQUFDUCxTQUFHLEVBQUVwRCxJQUFJLENBQUNvRDtBQUFYLEtBQXBCLEVBQXFDO0FBQUNRLFVBQUksRUFBRTtBQUFDUyxnQkFBUSxFQUFFeUU7QUFBWDtBQUFQLEtBQXJDO0FBQ0EsVUFBTUMsRUFBTjtBQUNEO0FBQ0YsQ0F6QkQsQyxDQTJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBdEksTUFBTSxDQUFDdUksT0FBUCxDQUFlO0FBQUNDLGdCQUFjLEVBQUUsVUFBVUMsV0FBVixFQUF1QkMsV0FBdkIsRUFBb0M7QUFDbEVoQyxTQUFLLENBQUMrQixXQUFELEVBQWMxQixpQkFBZCxDQUFMO0FBQ0FMLFNBQUssQ0FBQ2dDLFdBQUQsRUFBYzNCLGlCQUFkLENBQUw7O0FBRUEsUUFBSSxDQUFDLEtBQUtyRSxNQUFWLEVBQWtCO0FBQ2hCLFlBQU0sSUFBSTFDLE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsbUJBQXRCLENBQU47QUFDRDs7QUFFRCxVQUFNeEMsSUFBSSxHQUFHNkIsV0FBVyxDQUFDLEtBQUtzQixNQUFOLENBQXhCOztBQUNBLFFBQUksQ0FBQ25ELElBQUwsRUFBVztBQUNUeUQsaUJBQVcsQ0FBQyxnQkFBRCxDQUFYO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDekQsSUFBSSxDQUFDc0QsUUFBTixJQUFrQixDQUFDdEQsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBakMsSUFDQyxDQUFDckMsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBZCxDQUF1QmYsTUFBeEIsSUFBa0MsQ0FBQ3RCLElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWQsQ0FBdUJ1RixHQUQvRCxFQUNxRTtBQUNuRW5FLGlCQUFXLENBQUMsMEJBQUQsQ0FBWDtBQUNEOztBQUVELFFBQUksQ0FBRXpELElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWQsQ0FBdUJmLE1BQTdCLEVBQXFDO0FBQ25DLFlBQU0sSUFBSWIsTUFBTSxDQUFDK0IsS0FBWCxDQUFpQixHQUFqQixFQUFzQixxQkFBdEIsRUFBNkM0RixLQUFLLENBQUNDLFNBQU4sQ0FBZ0I7QUFDakVDLGNBQU0sRUFBRSxLQUR5RDtBQUVqRUosZ0JBQVEsRUFBRWxJLElBQUksQ0FBQ3NELFFBQUwsQ0FBY2pCLFFBQWQsQ0FBdUJ1RixHQUF2QixDQUEyQk07QUFGNEIsT0FBaEIsQ0FBN0MsQ0FBTjtBQUlEOztBQUVELFVBQU1oRixNQUFNLEdBQUdXLGFBQWEsQ0FBQzdELElBQUQsRUFBT2tKLFdBQVAsQ0FBNUI7O0FBQ0EsUUFBSWhHLE1BQU0sQ0FBQ00sS0FBWCxFQUFrQjtBQUNoQixZQUFNTixNQUFNLENBQUNNLEtBQWI7QUFDRDs7QUFFRCxVQUFNNEYsTUFBTSxHQUFHMUcsWUFBWSxDQUFDeUcsV0FBRCxDQUEzQixDQTlCa0UsQ0FnQ2xFO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFVBQU1FLFlBQVksR0FBR2hKLFFBQVEsQ0FBQ2lKLGNBQVQsQ0FBd0IsS0FBS0MsVUFBTCxDQUFnQnpILEVBQXhDLENBQXJCOztBQUNBckIsVUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUNFO0FBQUVQLFNBQUcsRUFBRSxLQUFLRDtBQUFaLEtBREYsRUFFRTtBQUNFUyxVQUFJLEVBQUU7QUFBRSxvQ0FBNEJ3RjtBQUE5QixPQURSO0FBRUVJLFdBQUssRUFBRTtBQUNMLHVDQUErQjtBQUFFQyxxQkFBVyxFQUFFO0FBQUVDLGVBQUcsRUFBRUw7QUFBUDtBQUFmO0FBRDFCLE9BRlQ7QUFLRVYsWUFBTSxFQUFFO0FBQUUsbUNBQTJCO0FBQTdCO0FBTFYsS0FGRjtBQVdBLFdBQU87QUFBQ2dCLHFCQUFlLEVBQUU7QUFBbEIsS0FBUDtBQUNEO0FBakRjLENBQWYsRSxDQW9EQTs7QUFFQTs7Ozs7Ozs7OztBQVNBdEosUUFBUSxDQUFDdUosV0FBVCxHQUF1QixDQUFDekcsTUFBRCxFQUFTMEcsb0JBQVQsRUFBK0JsQyxPQUEvQixLQUEyQztBQUNoRUEsU0FBTztBQUFLbUMsVUFBTSxFQUFFO0FBQWIsS0FBdUJuQyxPQUF2QixDQUFQO0FBRUEsUUFBTTNILElBQUksR0FBRzZCLFdBQVcsQ0FBQ3NCLE1BQUQsQ0FBeEI7O0FBQ0EsTUFBSSxDQUFDbkQsSUFBTCxFQUFXO0FBQ1QsVUFBTSxJQUFJUyxNQUFNLENBQUMrQixLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGdCQUF0QixDQUFOO0FBQ0Q7O0FBRUQsUUFBTW1CLE1BQU0sR0FBRztBQUNiZ0YsVUFBTSxFQUFFO0FBQ04sK0JBQXlCLENBRG5CO0FBQ3NCO0FBQzVCLGlDQUEyQjtBQUZyQixLQURLO0FBS2IvRSxRQUFJLEVBQUU7QUFBQyxrQ0FBNEJsQixZQUFZLENBQUNtSCxvQkFBRDtBQUF6QztBQUxPLEdBQWY7O0FBUUEsTUFBSWxDLE9BQU8sQ0FBQ21DLE1BQVosRUFBb0I7QUFDbEJuRyxVQUFNLENBQUNnRixNQUFQLENBQWMsNkJBQWQsSUFBK0MsQ0FBL0M7QUFDRDs7QUFFRGxJLFFBQU0sQ0FBQ3NCLEtBQVAsQ0FBYTRCLE1BQWIsQ0FBb0I7QUFBQ1AsT0FBRyxFQUFFcEQsSUFBSSxDQUFDb0Q7QUFBWCxHQUFwQixFQUFxQ08sTUFBckM7QUFDRCxDQXJCRCxDLENBd0JBO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQSxNQUFNb0csY0FBYyxHQUFHO0FBQUEsTUFBQ0MsTUFBRCx1RUFBVSxFQUFWO0FBQUEsU0FBaUJBLE1BQU0sQ0FBQzNFLEdBQVAsQ0FBV2YsS0FBSyxJQUFJQSxLQUFLLENBQUMyRixPQUExQixDQUFqQjtBQUFBLENBQXZCLEMsQ0FFQTtBQUNBOzs7QUFDQXhKLE1BQU0sQ0FBQ3VJLE9BQVAsQ0FBZTtBQUFDa0IsZ0JBQWMsRUFBRXZDLE9BQU8sSUFBSTtBQUN6Q1IsU0FBSyxDQUFDUSxPQUFELEVBQVU7QUFBQ3JELFdBQUssRUFBRThDO0FBQVIsS0FBVixDQUFMO0FBRUEsVUFBTXBILElBQUksR0FBR0ssUUFBUSxDQUFDd0UsZUFBVCxDQUF5QjhDLE9BQU8sQ0FBQ3JELEtBQWpDLENBQWI7O0FBQ0EsUUFBSSxDQUFDdEUsSUFBTCxFQUFXO0FBQ1R5RCxpQkFBVyxDQUFDLGdCQUFELENBQVg7QUFDRDs7QUFFRCxVQUFNdUcsTUFBTSxHQUFHRCxjQUFjLENBQUMvSixJQUFJLENBQUNnSyxNQUFOLENBQTdCO0FBQ0EsVUFBTUcsa0JBQWtCLEdBQUdILE1BQU0sQ0FBQ3RGLElBQVAsQ0FDekJKLEtBQUssSUFBSUEsS0FBSyxDQUFDNEIsV0FBTixPQUF3QnlCLE9BQU8sQ0FBQ3JELEtBQVIsQ0FBYzRCLFdBQWQsRUFEUixDQUEzQjtBQUlBN0YsWUFBUSxDQUFDK0osc0JBQVQsQ0FBZ0NwSyxJQUFJLENBQUNvRCxHQUFyQyxFQUEwQytHLGtCQUExQztBQUNEO0FBZGMsQ0FBZjtBQWdCQTs7Ozs7Ozs7Ozs7QUFVQTlKLFFBQVEsQ0FBQ2dLLGtCQUFULEdBQThCLENBQUNsSCxNQUFELEVBQVNtQixLQUFULEVBQWdCZ0csTUFBaEIsRUFBd0JDLGNBQXhCLEtBQTJDO0FBQ3ZFO0FBQ0EsUUFBTXZLLElBQUksR0FBRzZCLFdBQVcsQ0FBQ3NCLE1BQUQsQ0FBeEI7O0FBQ0EsTUFBSSxDQUFDbkQsSUFBTCxFQUFXO0FBQ1R5RCxlQUFXLENBQUMsaUJBQUQsQ0FBWDtBQUNELEdBTHNFLENBT3ZFOzs7QUFDQSxNQUFJLENBQUNhLEtBQUQsSUFBVXRFLElBQUksQ0FBQ2dLLE1BQWYsSUFBeUJoSyxJQUFJLENBQUNnSyxNQUFMLENBQVksQ0FBWixDQUE3QixFQUE2QztBQUMzQzFGLFNBQUssR0FBR3RFLElBQUksQ0FBQ2dLLE1BQUwsQ0FBWSxDQUFaLEVBQWVDLE9BQXZCO0FBQ0QsR0FWc0UsQ0FZdkU7OztBQUNBLE1BQUksQ0FBQzNGLEtBQUQsSUFDRixDQUFFeUYsY0FBYyxDQUFDL0osSUFBSSxDQUFDZ0ssTUFBTixDQUFkLENBQTRCUSxRQUE1QixDQUFxQ2xHLEtBQXJDLENBREosRUFDa0Q7QUFDaERiLGVBQVcsQ0FBQyx5QkFBRCxDQUFYO0FBQ0Q7O0FBRUQsUUFBTWdILEtBQUssR0FBR0MsTUFBTSxDQUFDQyxNQUFQLEVBQWQ7QUFDQSxRQUFNQyxXQUFXLEdBQUc7QUFDbEJILFNBRGtCO0FBRWxCbkcsU0FGa0I7QUFHbEJ1RyxRQUFJLEVBQUUsSUFBSUMsSUFBSjtBQUhZLEdBQXBCOztBQU1BLE1BQUlSLE1BQU0sS0FBSyxlQUFmLEVBQWdDO0FBQzlCTSxlQUFXLENBQUNOLE1BQVosR0FBcUIsT0FBckI7QUFDRCxHQUZELE1BRU8sSUFBSUEsTUFBTSxLQUFLLGVBQWYsRUFBZ0M7QUFDckNNLGVBQVcsQ0FBQ04sTUFBWixHQUFxQixRQUFyQjtBQUNELEdBRk0sTUFFQSxJQUFJQSxNQUFKLEVBQVk7QUFDakI7QUFDQU0sZUFBVyxDQUFDTixNQUFaLEdBQXFCQSxNQUFyQjtBQUNEOztBQUVELE1BQUlDLGNBQUosRUFBb0I7QUFDbEI5RCxVQUFNLENBQUNzRSxNQUFQLENBQWNILFdBQWQsRUFBMkJMLGNBQTNCO0FBQ0Q7O0FBRUQ5SixRQUFNLENBQUNzQixLQUFQLENBQWE0QixNQUFiLENBQW9CO0FBQUNQLE9BQUcsRUFBRXBELElBQUksQ0FBQ29EO0FBQVgsR0FBcEIsRUFBcUM7QUFBQ1EsUUFBSSxFQUFFO0FBQzFDLGlDQUEyQmdIO0FBRGU7QUFBUCxHQUFyQyxFQXRDdUUsQ0EwQ3ZFOztBQUNBbkssUUFBTSxDQUFDdUssT0FBUCxDQUFlaEwsSUFBZixFQUFxQixVQUFyQixFQUFpQyxVQUFqQyxFQUE2Q2lMLEtBQTdDLEdBQXFETCxXQUFyRDtBQUVBLFNBQU87QUFBQ3RHLFNBQUQ7QUFBUXRFLFFBQVI7QUFBY3lLO0FBQWQsR0FBUDtBQUNELENBOUNEO0FBZ0RBOzs7Ozs7Ozs7OztBQVNBcEssUUFBUSxDQUFDNksseUJBQVQsR0FBcUMsQ0FBQy9ILE1BQUQsRUFBU21CLEtBQVQsRUFBZ0JpRyxjQUFoQixLQUFtQztBQUN0RTtBQUNBLFFBQU12SyxJQUFJLEdBQUc2QixXQUFXLENBQUNzQixNQUFELENBQXhCOztBQUNBLE1BQUksQ0FBQ25ELElBQUwsRUFBVztBQUNUeUQsZUFBVyxDQUFDLGlCQUFELENBQVg7QUFDRCxHQUxxRSxDQU90RTs7O0FBQ0EsTUFBSSxDQUFDYSxLQUFMLEVBQVk7QUFDVixVQUFNNkcsV0FBVyxHQUFHLENBQUNuTCxJQUFJLENBQUNnSyxNQUFMLElBQWUsRUFBaEIsRUFBb0J0RixJQUFwQixDQUF5QjBHLENBQUMsSUFBSSxDQUFDQSxDQUFDLENBQUNDLFFBQWpDLENBQXBCO0FBQ0EvRyxTQUFLLEdBQUcsQ0FBQzZHLFdBQVcsSUFBSSxFQUFoQixFQUFvQmxCLE9BQTVCOztBQUVBLFFBQUksQ0FBQzNGLEtBQUwsRUFBWTtBQUNWYixpQkFBVyxDQUFDLDhDQUFELENBQVg7QUFDRDtBQUNGLEdBZnFFLENBaUJ0RTs7O0FBQ0EsTUFBSSxDQUFDYSxLQUFELElBQ0YsQ0FBRXlGLGNBQWMsQ0FBQy9KLElBQUksQ0FBQ2dLLE1BQU4sQ0FBZCxDQUE0QlEsUUFBNUIsQ0FBcUNsRyxLQUFyQyxDQURKLEVBQ2tEO0FBQ2hEYixlQUFXLENBQUMseUJBQUQsQ0FBWDtBQUNEOztBQUVELFFBQU1nSCxLQUFLLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxFQUFkO0FBQ0EsUUFBTUMsV0FBVyxHQUFHO0FBQ2xCSCxTQURrQjtBQUVsQjtBQUNBUixXQUFPLEVBQUUzRixLQUhTO0FBSWxCdUcsUUFBSSxFQUFFLElBQUlDLElBQUo7QUFKWSxHQUFwQjs7QUFPQSxNQUFJUCxjQUFKLEVBQW9CO0FBQ2xCOUQsVUFBTSxDQUFDc0UsTUFBUCxDQUFjSCxXQUFkLEVBQTJCTCxjQUEzQjtBQUNEOztBQUVEOUosUUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUFvQjtBQUFDUCxPQUFHLEVBQUVwRCxJQUFJLENBQUNvRDtBQUFYLEdBQXBCLEVBQXFDO0FBQUNrSSxTQUFLLEVBQUU7QUFDM0MsMkNBQXFDVjtBQURNO0FBQVIsR0FBckMsRUFuQ3NFLENBdUN0RTs7QUFDQW5LLFFBQU0sQ0FBQ3VLLE9BQVAsQ0FBZWhMLElBQWYsRUFBcUIsVUFBckIsRUFBaUMsT0FBakM7O0FBQ0EsTUFBSSxDQUFDQSxJQUFJLENBQUNzRCxRQUFMLENBQWNnQixLQUFkLENBQW9CaUgsa0JBQXpCLEVBQTZDO0FBQzNDdkwsUUFBSSxDQUFDc0QsUUFBTCxDQUFjZ0IsS0FBZCxDQUFvQmlILGtCQUFwQixHQUF5QyxFQUF6QztBQUNEOztBQUNEdkwsTUFBSSxDQUFDc0QsUUFBTCxDQUFjZ0IsS0FBZCxDQUFvQmlILGtCQUFwQixDQUF1Q0MsSUFBdkMsQ0FBNENaLFdBQTVDO0FBRUEsU0FBTztBQUFDdEcsU0FBRDtBQUFRdEUsUUFBUjtBQUFjeUs7QUFBZCxHQUFQO0FBQ0QsQ0EvQ0Q7QUFpREE7Ozs7Ozs7Ozs7Ozs7QUFXQXBLLFFBQVEsQ0FBQ29MLHVCQUFULEdBQW1DLENBQUNuSCxLQUFELEVBQVF0RSxJQUFSLEVBQWNDLEdBQWQsRUFBbUJxSyxNQUFuQixLQUE4QjtBQUMvRCxRQUFNM0MsT0FBTyxHQUFHO0FBQ2QrRCxNQUFFLEVBQUVwSCxLQURVO0FBRWQvRCxRQUFJLEVBQUVGLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QmdLLE1BQXhCLEVBQWdDL0osSUFBaEMsR0FDRkYsUUFBUSxDQUFDQyxjQUFULENBQXdCZ0ssTUFBeEIsRUFBZ0MvSixJQUFoQyxDQUFxQ1AsSUFBckMsQ0FERSxHQUVGSyxRQUFRLENBQUNDLGNBQVQsQ0FBd0JDLElBSmQ7QUFLZE0sV0FBTyxFQUFFUixRQUFRLENBQUNDLGNBQVQsQ0FBd0JnSyxNQUF4QixFQUFnQ3pKLE9BQWhDLENBQXdDYixJQUF4QztBQUxLLEdBQWhCOztBQVFBLE1BQUksT0FBT0ssUUFBUSxDQUFDQyxjQUFULENBQXdCZ0ssTUFBeEIsRUFBZ0N4SixJQUF2QyxLQUFnRCxVQUFwRCxFQUFnRTtBQUM5RDZHLFdBQU8sQ0FBQzdHLElBQVIsR0FBZVQsUUFBUSxDQUFDQyxjQUFULENBQXdCZ0ssTUFBeEIsRUFBZ0N4SixJQUFoQyxDQUFxQ2QsSUFBckMsRUFBMkNDLEdBQTNDLENBQWY7QUFDRDs7QUFFRCxNQUFJLE9BQU9JLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QmdLLE1BQXhCLEVBQWdDcUIsSUFBdkMsS0FBZ0QsVUFBcEQsRUFBZ0U7QUFDOURoRSxXQUFPLENBQUNnRSxJQUFSLEdBQWV0TCxRQUFRLENBQUNDLGNBQVQsQ0FBd0JnSyxNQUF4QixFQUFnQ3FCLElBQWhDLENBQXFDM0wsSUFBckMsRUFBMkNDLEdBQTNDLENBQWY7QUFDRDs7QUFFRCxNQUFJLE9BQU9JLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QnNMLE9BQS9CLEtBQTJDLFFBQS9DLEVBQXlEO0FBQ3ZEakUsV0FBTyxDQUFDaUUsT0FBUixHQUFrQnZMLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QnNMLE9BQTFDO0FBQ0Q7O0FBRUQsU0FBT2pFLE9BQVA7QUFDRCxDQXRCRCxDLENBd0JBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FBU0F0SCxRQUFRLENBQUMrSixzQkFBVCxHQUFrQyxDQUFDakgsTUFBRCxFQUFTbUIsS0FBVCxFQUFnQmlHLGNBQWhCLEtBQW1DO0FBQ25FLFFBQU07QUFBQ2pHLFNBQUssRUFBRXVILFNBQVI7QUFBbUI3TCxRQUFuQjtBQUF5QnlLO0FBQXpCLE1BQ0pwSyxRQUFRLENBQUNnSyxrQkFBVCxDQUE0QmxILE1BQTVCLEVBQW9DbUIsS0FBcEMsRUFBMkMsZUFBM0MsRUFBNERpRyxjQUE1RCxDQURGO0FBRUEsUUFBTXRLLEdBQUcsR0FBR0ksUUFBUSxDQUFDeUwsSUFBVCxDQUFjbEwsYUFBZCxDQUE0QjZKLEtBQTVCLENBQVo7QUFDQSxRQUFNOUMsT0FBTyxHQUFHdEgsUUFBUSxDQUFDb0wsdUJBQVQsQ0FBaUNJLFNBQWpDLEVBQTRDN0wsSUFBNUMsRUFBa0RDLEdBQWxELEVBQXVELGVBQXZELENBQWhCO0FBQ0E4TCxPQUFLLENBQUNDLElBQU4sQ0FBV3JFLE9BQVg7QUFDQSxTQUFPO0FBQUNyRCxTQUFLLEVBQUV1SCxTQUFSO0FBQW1CN0wsUUFBbkI7QUFBeUJ5SyxTQUF6QjtBQUFnQ3hLLE9BQWhDO0FBQXFDMEg7QUFBckMsR0FBUDtBQUNELENBUEQsQyxDQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQVNBdEgsUUFBUSxDQUFDNEwsbUJBQVQsR0FBK0IsQ0FBQzlJLE1BQUQsRUFBU21CLEtBQVQsRUFBZ0JpRyxjQUFoQixLQUFtQztBQUNoRSxRQUFNO0FBQUNqRyxTQUFLLEVBQUV1SCxTQUFSO0FBQW1CN0wsUUFBbkI7QUFBeUJ5SztBQUF6QixNQUNKcEssUUFBUSxDQUFDZ0ssa0JBQVQsQ0FBNEJsSCxNQUE1QixFQUFvQ21CLEtBQXBDLEVBQTJDLGVBQTNDLEVBQTREaUcsY0FBNUQsQ0FERjtBQUVBLFFBQU10SyxHQUFHLEdBQUdJLFFBQVEsQ0FBQ3lMLElBQVQsQ0FBYzlLLGFBQWQsQ0FBNEJ5SixLQUE1QixDQUFaO0FBQ0EsUUFBTTlDLE9BQU8sR0FBR3RILFFBQVEsQ0FBQ29MLHVCQUFULENBQWlDSSxTQUFqQyxFQUE0QzdMLElBQTVDLEVBQWtEQyxHQUFsRCxFQUF1RCxlQUF2RCxDQUFoQjtBQUNBOEwsT0FBSyxDQUFDQyxJQUFOLENBQVdyRSxPQUFYO0FBQ0EsU0FBTztBQUFDckQsU0FBSyxFQUFFdUgsU0FBUjtBQUFtQjdMLFFBQW5CO0FBQXlCeUssU0FBekI7QUFBZ0N4SyxPQUFoQztBQUFxQzBIO0FBQXJDLEdBQVA7QUFDRCxDQVBELEMsQ0FVQTtBQUNBOzs7QUFDQWxILE1BQU0sQ0FBQ3VJLE9BQVAsQ0FBZTtBQUFDcEksZUFBYSxFQUFFLFlBQW1CO0FBQUEsc0NBQU5zTCxJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDaEQsVUFBTXpCLEtBQUssR0FBR3lCLElBQUksQ0FBQyxDQUFELENBQWxCO0FBQ0EsVUFBTS9DLFdBQVcsR0FBRytDLElBQUksQ0FBQyxDQUFELENBQXhCO0FBQ0EsV0FBTzdMLFFBQVEsQ0FBQzhMLFlBQVQsQ0FDTCxJQURLLEVBRUwsZUFGSyxFQUdMRCxJQUhLLEVBSUwsVUFKSyxFQUtMLE1BQU07QUFDSi9FLFdBQUssQ0FBQ3NELEtBQUQsRUFBUXJELE1BQVIsQ0FBTDtBQUNBRCxXQUFLLENBQUNnQyxXQUFELEVBQWMzQixpQkFBZCxDQUFMO0FBRUEsWUFBTXhILElBQUksR0FBR1MsTUFBTSxDQUFDc0IsS0FBUCxDQUFhQyxPQUFiLENBQXFCO0FBQ2hDLHlDQUFpQ3lJO0FBREQsT0FBckIsQ0FBYjs7QUFFQSxVQUFJLENBQUN6SyxJQUFMLEVBQVc7QUFDVCxjQUFNLElBQUlTLE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsZUFBdEIsQ0FBTjtBQUNEOztBQUNELFlBQU07QUFBRXFJLFlBQUY7QUFBUVAsY0FBUjtBQUFnQmhHO0FBQWhCLFVBQTBCdEUsSUFBSSxDQUFDc0QsUUFBTCxDQUFjakIsUUFBZCxDQUF1QjRJLEtBQXZEOztBQUNBLFVBQUltQixlQUFlLEdBQUcvTCxRQUFRLENBQUNnTSxnQ0FBVCxFQUF0Qjs7QUFDQSxVQUFJL0IsTUFBTSxLQUFLLFFBQWYsRUFBeUI7QUFDdkI4Qix1QkFBZSxHQUFHL0wsUUFBUSxDQUFDaU0saUNBQVQsRUFBbEI7QUFDRDs7QUFDRCxZQUFNQyxhQUFhLEdBQUd6QixJQUFJLENBQUMwQixHQUFMLEVBQXRCO0FBQ0EsVUFBS0QsYUFBYSxHQUFHMUIsSUFBakIsR0FBeUJ1QixlQUE3QixFQUNFLE1BQU0sSUFBSTNMLE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsZUFBdEIsQ0FBTjtBQUNGLFVBQUksQ0FBRXVILGNBQWMsQ0FBQy9KLElBQUksQ0FBQ2dLLE1BQU4sQ0FBZCxDQUE0QlEsUUFBNUIsQ0FBcUNsRyxLQUFyQyxDQUFOLEVBQ0UsT0FBTztBQUNMbkIsY0FBTSxFQUFFbkQsSUFBSSxDQUFDb0QsR0FEUjtBQUVMSSxhQUFLLEVBQUUsSUFBSS9DLE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUNBQXRCO0FBRkYsT0FBUDtBQUtGLFlBQU00RyxNQUFNLEdBQUcxRyxZQUFZLENBQUN5RyxXQUFELENBQTNCLENBdkJJLENBeUJKO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFlBQU1zRCxRQUFRLEdBQUdwTSxRQUFRLENBQUNpSixjQUFULENBQXdCLEtBQUtDLFVBQUwsQ0FBZ0J6SCxFQUF4QyxDQUFqQjs7QUFDQXpCLGNBQVEsQ0FBQ3FNLGNBQVQsQ0FBd0IxTSxJQUFJLENBQUNvRCxHQUE3QixFQUFrQyxLQUFLbUcsVUFBdkMsRUFBbUQsSUFBbkQ7O0FBQ0EsWUFBTW9ELGVBQWUsR0FBRyxNQUN0QnRNLFFBQVEsQ0FBQ3FNLGNBQVQsQ0FBd0IxTSxJQUFJLENBQUNvRCxHQUE3QixFQUFrQyxLQUFLbUcsVUFBdkMsRUFBbURrRCxRQUFuRCxDQURGOztBQUdBLFVBQUk7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU1HLGVBQWUsR0FBR25NLE1BQU0sQ0FBQ3NCLEtBQVAsQ0FBYTRCLE1BQWIsQ0FDdEI7QUFDRVAsYUFBRyxFQUFFcEQsSUFBSSxDQUFDb0QsR0FEWjtBQUVFLDRCQUFrQmtCLEtBRnBCO0FBR0UsMkNBQWlDbUc7QUFIbkMsU0FEc0IsRUFNdEI7QUFBQzdHLGNBQUksRUFBRTtBQUFDLHdDQUE0QndGLE1BQTdCO0FBQ0MsaUNBQXFCO0FBRHRCLFdBQVA7QUFFQ1QsZ0JBQU0sRUFBRTtBQUFDLHVDQUEyQixDQUE1QjtBQUNDLHFDQUF5QjtBQUQxQjtBQUZULFNBTnNCLENBQXhCO0FBVUEsWUFBSWlFLGVBQWUsS0FBSyxDQUF4QixFQUNFLE9BQU87QUFDTHpKLGdCQUFNLEVBQUVuRCxJQUFJLENBQUNvRCxHQURSO0FBRUxJLGVBQUssRUFBRSxJQUFJL0MsTUFBTSxDQUFDK0IsS0FBWCxDQUFpQixHQUFqQixFQUFzQixlQUF0QjtBQUZGLFNBQVA7QUFJSCxPQXBCRCxDQW9CRSxPQUFPcUssR0FBUCxFQUFZO0FBQ1pGLHVCQUFlO0FBQ2YsY0FBTUUsR0FBTjtBQUNELE9BekRHLENBMkRKO0FBQ0E7OztBQUNBeE0sY0FBUSxDQUFDeU0sb0JBQVQsQ0FBOEI5TSxJQUFJLENBQUNvRCxHQUFuQzs7QUFFQSxhQUFPO0FBQUNELGNBQU0sRUFBRW5ELElBQUksQ0FBQ29EO0FBQWQsT0FBUDtBQUNELEtBckVJLENBQVA7QUF1RUQ7QUExRWMsQ0FBZixFLENBNEVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFTQS9DLFFBQVEsQ0FBQzBNLHFCQUFULEdBQWlDLENBQUM1SixNQUFELEVBQVNtQixLQUFULEVBQWdCaUcsY0FBaEIsS0FBbUM7QUFDbEU7QUFDQTtBQUNBO0FBRUEsUUFBTTtBQUFDakcsU0FBSyxFQUFFdUgsU0FBUjtBQUFtQjdMLFFBQW5CO0FBQXlCeUs7QUFBekIsTUFDSnBLLFFBQVEsQ0FBQzZLLHlCQUFULENBQW1DL0gsTUFBbkMsRUFBMkNtQixLQUEzQyxFQUFrRGlHLGNBQWxELENBREY7QUFFQSxRQUFNdEssR0FBRyxHQUFHSSxRQUFRLENBQUN5TCxJQUFULENBQWMvSyxXQUFkLENBQTBCMEosS0FBMUIsQ0FBWjtBQUNBLFFBQU05QyxPQUFPLEdBQUd0SCxRQUFRLENBQUNvTCx1QkFBVCxDQUFpQ0ksU0FBakMsRUFBNEM3TCxJQUE1QyxFQUFrREMsR0FBbEQsRUFBdUQsYUFBdkQsQ0FBaEI7QUFDQThMLE9BQUssQ0FBQ0MsSUFBTixDQUFXckUsT0FBWDtBQUNBLFNBQU87QUFBQ3JELFNBQUssRUFBRXVILFNBQVI7QUFBbUI3TCxRQUFuQjtBQUF5QnlLLFNBQXpCO0FBQWdDeEssT0FBaEM7QUFBcUMwSDtBQUFyQyxHQUFQO0FBQ0QsQ0FYRCxDLENBYUE7QUFDQTs7O0FBQ0FsSCxNQUFNLENBQUN1SSxPQUFQLENBQWU7QUFBQ2pJLGFBQVcsRUFBRSxZQUFtQjtBQUFBLHVDQUFObUwsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQzlDLFVBQU16QixLQUFLLEdBQUd5QixJQUFJLENBQUMsQ0FBRCxDQUFsQjtBQUNBLFdBQU83TCxRQUFRLENBQUM4TCxZQUFULENBQ0wsSUFESyxFQUVMLGFBRkssRUFHTEQsSUFISyxFQUlMLFVBSkssRUFLTCxNQUFNO0FBQ0ovRSxXQUFLLENBQUNzRCxLQUFELEVBQVFyRCxNQUFSLENBQUw7QUFFQSxZQUFNcEgsSUFBSSxHQUFHUyxNQUFNLENBQUNzQixLQUFQLENBQWFDLE9BQWIsQ0FDWDtBQUFDLG1EQUEyQ3lJO0FBQTVDLE9BRFcsQ0FBYjtBQUVBLFVBQUksQ0FBQ3pLLElBQUwsRUFDRSxNQUFNLElBQUlTLE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsMkJBQXRCLENBQU47QUFFQSxZQUFNb0ksV0FBVyxHQUFHNUssSUFBSSxDQUFDc0QsUUFBTCxDQUFjZ0IsS0FBZCxDQUFvQmlILGtCQUFwQixDQUF1QzdHLElBQXZDLENBQ2xCc0ksQ0FBQyxJQUFJQSxDQUFDLENBQUN2QyxLQUFGLElBQVdBLEtBREUsQ0FBcEI7QUFHRixVQUFJLENBQUNHLFdBQUwsRUFDRSxPQUFPO0FBQ0x6SCxjQUFNLEVBQUVuRCxJQUFJLENBQUNvRCxHQURSO0FBRUxJLGFBQUssRUFBRSxJQUFJL0MsTUFBTSxDQUFDK0IsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwyQkFBdEI7QUFGRixPQUFQO0FBS0YsWUFBTXlLLFlBQVksR0FBR2pOLElBQUksQ0FBQ2dLLE1BQUwsQ0FBWXRGLElBQVosQ0FDbkIwRyxDQUFDLElBQUlBLENBQUMsQ0FBQ25CLE9BQUYsSUFBYVcsV0FBVyxDQUFDWCxPQURYLENBQXJCO0FBR0EsVUFBSSxDQUFDZ0QsWUFBTCxFQUNFLE9BQU87QUFDTDlKLGNBQU0sRUFBRW5ELElBQUksQ0FBQ29ELEdBRFI7QUFFTEksYUFBSyxFQUFFLElBQUkvQyxNQUFNLENBQUMrQixLQUFYLENBQWlCLEdBQWpCLEVBQXNCLDBDQUF0QjtBQUZGLE9BQVAsQ0FyQkUsQ0EwQko7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQS9CLFlBQU0sQ0FBQ3NCLEtBQVAsQ0FBYTRCLE1BQWIsQ0FDRTtBQUFDUCxXQUFHLEVBQUVwRCxJQUFJLENBQUNvRCxHQUFYO0FBQ0MsMEJBQWtCd0gsV0FBVyxDQUFDWDtBQUQvQixPQURGLEVBR0U7QUFBQ3JHLFlBQUksRUFBRTtBQUFDLCtCQUFxQjtBQUF0QixTQUFQO0FBQ0M0RixhQUFLLEVBQUU7QUFBQywrQ0FBcUM7QUFBQ1MsbUJBQU8sRUFBRVcsV0FBVyxDQUFDWDtBQUF0QjtBQUF0QztBQURSLE9BSEY7QUFNQSxhQUFPO0FBQUM5RyxjQUFNLEVBQUVuRCxJQUFJLENBQUNvRDtBQUFkLE9BQVA7QUFDRCxLQTNDSSxDQUFQO0FBNkNEO0FBL0NjLENBQWY7QUFpREE7Ozs7Ozs7Ozs7Ozs7QUFZQS9DLFFBQVEsQ0FBQzZNLFFBQVQsR0FBb0IsQ0FBQy9KLE1BQUQsRUFBU2dLLFFBQVQsRUFBbUI5QixRQUFuQixLQUFnQztBQUNsRGxFLE9BQUssQ0FBQ2hFLE1BQUQsRUFBUzRELGNBQVQsQ0FBTDtBQUNBSSxPQUFLLENBQUNnRyxRQUFELEVBQVdwRyxjQUFYLENBQUw7QUFDQUksT0FBSyxDQUFDa0UsUUFBRCxFQUFXckUsS0FBSyxDQUFDTSxRQUFOLENBQWU4RixPQUFmLENBQVgsQ0FBTDs7QUFFQSxNQUFJL0IsUUFBUSxLQUFLLEtBQUssQ0FBdEIsRUFBeUI7QUFDdkJBLFlBQVEsR0FBRyxLQUFYO0FBQ0Q7O0FBRUQsUUFBTXJMLElBQUksR0FBRzZCLFdBQVcsQ0FBQ3NCLE1BQUQsQ0FBeEI7QUFDQSxNQUFJLENBQUNuRCxJQUFMLEVBQ0UsTUFBTSxJQUFJUyxNQUFNLENBQUMrQixLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGdCQUF0QixDQUFOLENBWGdELENBYWxEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQU02SyxxQkFBcUIsR0FDekIsSUFBSTlILE1BQUosWUFBZTlFLE1BQU0sQ0FBQytFLGFBQVAsQ0FBcUIySCxRQUFyQixDQUFmLFFBQWtELEdBQWxELENBREY7QUFHQSxRQUFNRyxpQkFBaUIsR0FBR3ROLElBQUksQ0FBQ2dLLE1BQUwsQ0FBWXVELE1BQVosQ0FDeEIsQ0FBQ0MsSUFBRCxFQUFPbEosS0FBUCxLQUFpQjtBQUNmLFFBQUkrSSxxQkFBcUIsQ0FBQ0ksSUFBdEIsQ0FBMkJuSixLQUFLLENBQUMyRixPQUFqQyxDQUFKLEVBQStDO0FBQzdDeEosWUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUFvQjtBQUNsQlAsV0FBRyxFQUFFcEQsSUFBSSxDQUFDb0QsR0FEUTtBQUVsQiwwQkFBa0JrQixLQUFLLENBQUMyRjtBQUZOLE9BQXBCLEVBR0c7QUFBQ3JHLFlBQUksRUFBRTtBQUNSLDhCQUFvQnVKLFFBRFo7QUFFUiwrQkFBcUI5QjtBQUZiO0FBQVAsT0FISDtBQU9BLGFBQU8sSUFBUDtBQUNELEtBVEQsTUFTTztBQUNMLGFBQU9tQyxJQUFQO0FBQ0Q7QUFDRixHQWR1QixFQWV4QixLQWZ3QixDQUExQixDQXhCa0QsQ0EwQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFJRixpQkFBSixFQUF1QjtBQUNyQjtBQUNELEdBbkRpRCxDQXFEbEQ7OztBQUNBakgsbUNBQWlDLENBQUMsZ0JBQUQsRUFBbUIsT0FBbkIsRUFBNEI4RyxRQUE1QixFQUFzQ25OLElBQUksQ0FBQ29ELEdBQTNDLENBQWpDO0FBRUEzQyxRQUFNLENBQUNzQixLQUFQLENBQWE0QixNQUFiLENBQW9CO0FBQ2xCUCxPQUFHLEVBQUVwRCxJQUFJLENBQUNvRDtBQURRLEdBQXBCLEVBRUc7QUFDRHNLLGFBQVMsRUFBRTtBQUNUMUQsWUFBTSxFQUFFO0FBQ05DLGVBQU8sRUFBRWtELFFBREg7QUFFTjlCLGdCQUFRLEVBQUVBO0FBRko7QUFEQztBQURWLEdBRkgsRUF4RGtELENBbUVsRDtBQUNBOztBQUNBLE1BQUk7QUFDRmhGLHFDQUFpQyxDQUFDLGdCQUFELEVBQW1CLE9BQW5CLEVBQTRCOEcsUUFBNUIsRUFBc0NuTixJQUFJLENBQUNvRCxHQUEzQyxDQUFqQztBQUNELEdBRkQsQ0FFRSxPQUFPMkYsRUFBUCxFQUFXO0FBQ1g7QUFDQXRJLFVBQU0sQ0FBQ3NCLEtBQVAsQ0FBYTRCLE1BQWIsQ0FBb0I7QUFBQ1AsU0FBRyxFQUFFcEQsSUFBSSxDQUFDb0Q7QUFBWCxLQUFwQixFQUNFO0FBQUNvRyxXQUFLLEVBQUU7QUFBQ1EsY0FBTSxFQUFFO0FBQUNDLGlCQUFPLEVBQUVrRDtBQUFWO0FBQVQ7QUFBUixLQURGO0FBRUEsVUFBTXBFLEVBQU47QUFDRDtBQUNGLENBN0VEO0FBK0VBOzs7Ozs7Ozs7O0FBUUExSSxRQUFRLENBQUNzTixXQUFULEdBQXVCLENBQUN4SyxNQUFELEVBQVNtQixLQUFULEtBQW1CO0FBQ3hDNkMsT0FBSyxDQUFDaEUsTUFBRCxFQUFTNEQsY0FBVCxDQUFMO0FBQ0FJLE9BQUssQ0FBQzdDLEtBQUQsRUFBUXlDLGNBQVIsQ0FBTDtBQUVBLFFBQU0vRyxJQUFJLEdBQUc2QixXQUFXLENBQUNzQixNQUFELENBQXhCO0FBQ0EsTUFBSSxDQUFDbkQsSUFBTCxFQUNFLE1BQU0sSUFBSVMsTUFBTSxDQUFDK0IsS0FBWCxDQUFpQixHQUFqQixFQUFzQixnQkFBdEIsQ0FBTjtBQUVGL0IsUUFBTSxDQUFDc0IsS0FBUCxDQUFhNEIsTUFBYixDQUFvQjtBQUFDUCxPQUFHLEVBQUVwRCxJQUFJLENBQUNvRDtBQUFYLEdBQXBCLEVBQ0U7QUFBQ29HLFNBQUssRUFBRTtBQUFDUSxZQUFNLEVBQUU7QUFBQ0MsZUFBTyxFQUFFM0Y7QUFBVjtBQUFUO0FBQVIsR0FERjtBQUVELENBVkQsQyxDQVlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU1zSixVQUFVLEdBQUdqRyxPQUFPLElBQUk7QUFDNUI7QUFDQTtBQUNBUixPQUFLLENBQUNRLE9BQUQsRUFBVVgsS0FBSyxDQUFDNkcsZUFBTixDQUFzQjtBQUNuQ3hKLFlBQVEsRUFBRTJDLEtBQUssQ0FBQ00sUUFBTixDQUFlRixNQUFmLENBRHlCO0FBRW5DOUMsU0FBSyxFQUFFMEMsS0FBSyxDQUFDTSxRQUFOLENBQWVGLE1BQWYsQ0FGNEI7QUFHbkMvRSxZQUFRLEVBQUUyRSxLQUFLLENBQUNNLFFBQU4sQ0FBZUUsaUJBQWY7QUFIeUIsR0FBdEIsQ0FBVixDQUFMO0FBTUEsUUFBTTtBQUFFbkQsWUFBRjtBQUFZQyxTQUFaO0FBQW1CakM7QUFBbkIsTUFBZ0NzRixPQUF0QztBQUNBLE1BQUksQ0FBQ3RELFFBQUQsSUFBYSxDQUFDQyxLQUFsQixFQUNFLE1BQU0sSUFBSTdELE1BQU0sQ0FBQytCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUNBQXRCLENBQU47QUFFRixRQUFNeEMsSUFBSSxHQUFHO0FBQUNzRCxZQUFRLEVBQUU7QUFBWCxHQUFiOztBQUNBLE1BQUlqQixRQUFKLEVBQWM7QUFDWixVQUFNK0csTUFBTSxHQUFHMUcsWUFBWSxDQUFDTCxRQUFELENBQTNCO0FBQ0FyQyxRQUFJLENBQUNzRCxRQUFMLENBQWNqQixRQUFkLEdBQXlCO0FBQUVmLFlBQU0sRUFBRThIO0FBQVYsS0FBekI7QUFDRDs7QUFFRCxNQUFJL0UsUUFBSixFQUNFckUsSUFBSSxDQUFDcUUsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRixNQUFJQyxLQUFKLEVBQ0V0RSxJQUFJLENBQUNnSyxNQUFMLEdBQWMsQ0FBQztBQUFDQyxXQUFPLEVBQUUzRixLQUFWO0FBQWlCK0csWUFBUSxFQUFFO0FBQTNCLEdBQUQsQ0FBZCxDQXRCMEIsQ0F3QjVCOztBQUNBaEYsbUNBQWlDLENBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUJoQyxRQUF6QixDQUFqQztBQUNBZ0MsbUNBQWlDLENBQUMsZ0JBQUQsRUFBbUIsT0FBbkIsRUFBNEIvQixLQUE1QixDQUFqQztBQUVBLFFBQU1uQixNQUFNLEdBQUc5QyxRQUFRLENBQUN5TixhQUFULENBQXVCbkcsT0FBdkIsRUFBZ0MzSCxJQUFoQyxDQUFmLENBNUI0QixDQTZCNUI7QUFDQTs7QUFDQSxNQUFJO0FBQ0ZxRyxxQ0FBaUMsQ0FBQyxVQUFELEVBQWEsVUFBYixFQUF5QmhDLFFBQXpCLEVBQW1DbEIsTUFBbkMsQ0FBakM7QUFDQWtELHFDQUFpQyxDQUFDLGdCQUFELEVBQW1CLE9BQW5CLEVBQTRCL0IsS0FBNUIsRUFBbUNuQixNQUFuQyxDQUFqQztBQUNELEdBSEQsQ0FHRSxPQUFPNEYsRUFBUCxFQUFXO0FBQ1g7QUFDQXRJLFVBQU0sQ0FBQ3NCLEtBQVAsQ0FBYWdNLE1BQWIsQ0FBb0I1SyxNQUFwQjtBQUNBLFVBQU00RixFQUFOO0FBQ0Q7O0FBQ0QsU0FBTzVGLE1BQVA7QUFDRCxDQXhDRCxDLENBMENBOzs7QUFDQTFDLE1BQU0sQ0FBQ3VJLE9BQVAsQ0FBZTtBQUFDNEUsWUFBVSxFQUFFLFlBQW1CO0FBQUEsdUNBQU4xQixJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDN0MsVUFBTXZFLE9BQU8sR0FBR3VFLElBQUksQ0FBQyxDQUFELENBQXBCO0FBQ0EsV0FBTzdMLFFBQVEsQ0FBQzhMLFlBQVQsQ0FDTCxJQURLLEVBRUwsWUFGSyxFQUdMRCxJQUhLLEVBSUwsVUFKSyxFQUtMLE1BQU07QUFDSjtBQUNBL0UsV0FBSyxDQUFDUSxPQUFELEVBQVVsQixNQUFWLENBQUw7QUFDQSxVQUFJcEcsUUFBUSxDQUFDNkIsUUFBVCxDQUFrQjhMLDJCQUF0QixFQUNFLE9BQU87QUFDTHhLLGFBQUssRUFBRSxJQUFJL0MsTUFBTSxDQUFDK0IsS0FBWCxDQUFpQixHQUFqQixFQUFzQixtQkFBdEI7QUFERixPQUFQLENBSkUsQ0FRSjs7QUFDQSxZQUFNVyxNQUFNLEdBQUd5SyxVQUFVLENBQUNqRyxPQUFELENBQXpCLENBVEksQ0FVSjtBQUNBOztBQUNBLFVBQUksQ0FBRXhFLE1BQU4sRUFDRSxNQUFNLElBQUlYLEtBQUosQ0FBVSxzQ0FBVixDQUFOLENBYkUsQ0FlSjtBQUNBO0FBQ0E7O0FBQ0EsVUFBSW1GLE9BQU8sQ0FBQ3JELEtBQVIsSUFBaUJqRSxRQUFRLENBQUM2QixRQUFULENBQWtCNksscUJBQXZDLEVBQ0UxTSxRQUFRLENBQUMwTSxxQkFBVCxDQUErQjVKLE1BQS9CLEVBQXVDd0UsT0FBTyxDQUFDckQsS0FBL0MsRUFuQkUsQ0FxQko7O0FBQ0EsYUFBTztBQUFDbkIsY0FBTSxFQUFFQTtBQUFULE9BQVA7QUFDRCxLQTVCSSxDQUFQO0FBOEJEO0FBaENjLENBQWYsRSxDQWtDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E5QyxRQUFRLENBQUN1TixVQUFULEdBQXNCLENBQUNqRyxPQUFELEVBQVVzRyxRQUFWLEtBQXVCO0FBQzNDdEcsU0FBTyxxQkFBUUEsT0FBUixDQUFQLENBRDJDLENBRzNDOztBQUNBLE1BQUlzRyxRQUFKLEVBQWM7QUFDWixVQUFNLElBQUl6TCxLQUFKLENBQVUsb0VBQVYsQ0FBTjtBQUNEOztBQUVELFNBQU9vTCxVQUFVLENBQUNqRyxPQUFELENBQWpCO0FBQ0QsQ0FURCxDLENBV0E7QUFDQTtBQUNBOzs7QUFDQWxILE1BQU0sQ0FBQ3NCLEtBQVAsQ0FBYW1NLFlBQWIsQ0FBMEIseUNBQTFCLEVBQzBCO0FBQUNDLFFBQU0sRUFBRSxDQUFUO0FBQVlDLFFBQU0sRUFBRTtBQUFwQixDQUQxQjs7QUFFQTNOLE1BQU0sQ0FBQ3NCLEtBQVAsQ0FBYW1NLFlBQWIsQ0FBMEIsK0JBQTFCLEVBQzBCO0FBQUNDLFFBQU0sRUFBRSxDQUFUO0FBQVlDLFFBQU0sRUFBRTtBQUFwQixDQUQxQixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9hY2NvdW50cy1wYXNzd29yZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdyZWV0ID0gd2VsY29tZU1zZyA9PiAodXNlciwgdXJsKSA9PiB7XG4gICAgICBjb25zdCBncmVldGluZyA9ICh1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUpID9cbiAgICAgICAgICAgIChgSGVsbG8gJHt1c2VyLnByb2ZpbGUubmFtZX0sYCkgOiBcIkhlbGxvLFwiO1xuICAgICAgcmV0dXJuIGAke2dyZWV0aW5nfVxuXG4ke3dlbGNvbWVNc2d9LCBzaW1wbHkgY2xpY2sgdGhlIGxpbmsgYmVsb3cuXG5cbiR7dXJsfVxuXG5UaGFua3MuXG5gO1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBPcHRpb25zIHRvIGN1c3RvbWl6ZSBlbWFpbHMgc2VudCBmcm9tIHRoZSBBY2NvdW50cyBzeXN0ZW0uXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5lbWFpbFRlbXBsYXRlcyA9IHtcbiAgZnJvbTogXCJBY2NvdW50cyBFeGFtcGxlIDxuby1yZXBseUBleGFtcGxlLmNvbT5cIixcbiAgc2l0ZU5hbWU6IE1ldGVvci5hYnNvbHV0ZVVybCgpLnJlcGxhY2UoL15odHRwcz86XFwvXFwvLywgJycpLnJlcGxhY2UoL1xcLyQvLCAnJyksXG5cbiAgcmVzZXRQYXNzd29yZDoge1xuICAgIHN1YmplY3Q6ICgpID0+IGBIb3cgdG8gcmVzZXQgeW91ciBwYXNzd29yZCBvbiAke0FjY291bnRzLmVtYWlsVGVtcGxhdGVzLnNpdGVOYW1lfWAsXG4gICAgdGV4dDogZ3JlZXQoXCJUbyByZXNldCB5b3VyIHBhc3N3b3JkXCIpLFxuICB9LFxuICB2ZXJpZnlFbWFpbDoge1xuICAgIHN1YmplY3Q6ICgpID0+IGBIb3cgdG8gdmVyaWZ5IGVtYWlsIGFkZHJlc3Mgb24gJHtBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5zaXRlTmFtZX1gLFxuICAgIHRleHQ6IGdyZWV0KFwiVG8gdmVyaWZ5IHlvdXIgYWNjb3VudCBlbWFpbFwiKSxcbiAgfSxcbiAgZW5yb2xsQWNjb3VudDoge1xuICAgIHN1YmplY3Q6ICgpID0+IGBBbiBhY2NvdW50IGhhcyBiZWVuIGNyZWF0ZWQgZm9yIHlvdSBvbiAke0FjY291bnRzLmVtYWlsVGVtcGxhdGVzLnNpdGVOYW1lfWAsXG4gICAgdGV4dDogZ3JlZXQoXCJUbyBzdGFydCB1c2luZyB0aGUgc2VydmljZVwiKSxcbiAgfSxcbn07XG4iLCIvLy8gQkNSWVBUXG5cbmNvbnN0IGJjcnlwdCA9IE5wbU1vZHVsZUJjcnlwdDtcbmNvbnN0IGJjcnlwdEhhc2ggPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5oYXNoKTtcbmNvbnN0IGJjcnlwdENvbXBhcmUgPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5jb21wYXJlKTtcblxuLy8gVXRpbGl0eSBmb3IgZ3JhYmJpbmcgdXNlclxuY29uc3QgZ2V0VXNlckJ5SWQgPSBpZCA9PiBNZXRlb3IudXNlcnMuZmluZE9uZShpZCk7XG5cbi8vIFVzZXIgcmVjb3JkcyBoYXZlIGEgJ3NlcnZpY2VzLnBhc3N3b3JkLmJjcnlwdCcgZmllbGQgb24gdGhlbSB0byBob2xkXG4vLyB0aGVpciBoYXNoZWQgcGFzc3dvcmRzICh1bmxlc3MgdGhleSBoYXZlIGEgJ3NlcnZpY2VzLnBhc3N3b3JkLnNycCdcbi8vIGZpZWxkLCBpbiB3aGljaCBjYXNlIHRoZXkgd2lsbCBiZSB1cGdyYWRlZCB0byBiY3J5cHQgdGhlIG5leHQgdGltZVxuLy8gdGhleSBsb2cgaW4pLlxuLy9cbi8vIFdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIHBhc3N3b3JkIHRvIHRoZSBzZXJ2ZXIsIGl0IGNhbiBlaXRoZXIgYmUgYVxuLy8gc3RyaW5nICh0aGUgcGxhaW50ZXh0IHBhc3N3b3JkKSBvciBhbiBvYmplY3Qgd2l0aCBrZXlzICdkaWdlc3QnIGFuZFxuLy8gJ2FsZ29yaXRobScgKG11c3QgYmUgXCJzaGEtMjU2XCIgZm9yIG5vdykuIFRoZSBNZXRlb3IgY2xpZW50IGFsd2F5cyBzZW5kc1xuLy8gcGFzc3dvcmQgb2JqZWN0cyB7IGRpZ2VzdDogKiwgYWxnb3JpdGhtOiBcInNoYS0yNTZcIiB9LCBidXQgRERQIGNsaWVudHNcbi8vIHRoYXQgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gU0hBIGNhbiBqdXN0IHNlbmQgcGxhaW50ZXh0IHBhc3N3b3JkcyBhc1xuLy8gc3RyaW5ncy5cbi8vXG4vLyBXaGVuIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgYSBwbGFpbnRleHQgcGFzc3dvcmQgYXMgYSBzdHJpbmcsIGl0IGFsd2F5c1xuLy8gaGFzaGVzIGl0IHdpdGggU0hBMjU2IGJlZm9yZSBwYXNzaW5nIGl0IGludG8gYmNyeXB0LiBXaGVuIHRoZSBzZXJ2ZXJcbi8vIHJlY2VpdmVzIGEgcGFzc3dvcmQgYXMgYW4gb2JqZWN0LCBpdCBhc3NlcnRzIHRoYXQgdGhlIGFsZ29yaXRobSBpc1xuLy8gXCJzaGEtMjU2XCIgYW5kIHRoZW4gcGFzc2VzIHRoZSBkaWdlc3QgdG8gYmNyeXB0LlxuXG5cbkFjY291bnRzLl9iY3J5cHRSb3VuZHMgPSAoKSA9PiBBY2NvdW50cy5fb3B0aW9ucy5iY3J5cHRSb3VuZHMgfHwgMTA7XG5cbi8vIEdpdmVuIGEgJ3Bhc3N3b3JkJyBmcm9tIHRoZSBjbGllbnQsIGV4dHJhY3QgdGhlIHN0cmluZyB0aGF0IHdlIHNob3VsZFxuLy8gYmNyeXB0LiAncGFzc3dvcmQnIGNhbiBiZSBvbmUgb2Y6XG4vLyAgLSBTdHJpbmcgKHRoZSBwbGFpbnRleHQgcGFzc3dvcmQpXG4vLyAgLSBPYmplY3Qgd2l0aCAnZGlnZXN0JyBhbmQgJ2FsZ29yaXRobScga2V5cy4gJ2FsZ29yaXRobScgbXVzdCBiZSBcInNoYS0yNTZcIi5cbi8vXG5jb25zdCBnZXRQYXNzd29yZFN0cmluZyA9IHBhc3N3b3JkID0+IHtcbiAgaWYgKHR5cGVvZiBwYXNzd29yZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHBhc3N3b3JkID0gU0hBMjU2KHBhc3N3b3JkKTtcbiAgfSBlbHNlIHsgLy8gJ3Bhc3N3b3JkJyBpcyBhbiBvYmplY3RcbiAgICBpZiAocGFzc3dvcmQuYWxnb3JpdGhtICE9PSBcInNoYS0yNTZcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXNzd29yZCBoYXNoIGFsZ29yaXRobS4gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiT25seSAnc2hhLTI1NicgaXMgYWxsb3dlZC5cIik7XG4gICAgfVxuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQuZGlnZXN0O1xuICB9XG4gIHJldHVybiBwYXNzd29yZDtcbn07XG5cbi8vIFVzZSBiY3J5cHQgdG8gaGFzaCB0aGUgcGFzc3dvcmQgZm9yIHN0b3JhZ2UgaW4gdGhlIGRhdGFiYXNlLlxuLy8gYHBhc3N3b3JkYCBjYW4gYmUgYSBzdHJpbmcgKGluIHdoaWNoIGNhc2UgaXQgd2lsbCBiZSBydW4gdGhyb3VnaFxuLy8gU0hBMjU2IGJlZm9yZSBiY3J5cHQpIG9yIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgYGRpZ2VzdGAgYW5kXG4vLyBgYWxnb3JpdGhtYCAoaW4gd2hpY2ggY2FzZSB3ZSBiY3J5cHQgYHBhc3N3b3JkLmRpZ2VzdGApLlxuLy9cbmNvbnN0IGhhc2hQYXNzd29yZCA9IHBhc3N3b3JkID0+IHtcbiAgcGFzc3dvcmQgPSBnZXRQYXNzd29yZFN0cmluZyhwYXNzd29yZCk7XG4gIHJldHVybiBiY3J5cHRIYXNoKHBhc3N3b3JkLCBBY2NvdW50cy5fYmNyeXB0Um91bmRzKCkpO1xufTtcblxuLy8gRXh0cmFjdCB0aGUgbnVtYmVyIG9mIHJvdW5kcyB1c2VkIGluIHRoZSBzcGVjaWZpZWQgYmNyeXB0IGhhc2guXG5jb25zdCBnZXRSb3VuZHNGcm9tQmNyeXB0SGFzaCA9IGhhc2ggPT4ge1xuICBsZXQgcm91bmRzO1xuICBpZiAoaGFzaCkge1xuICAgIGNvbnN0IGhhc2hTZWdtZW50cyA9IGhhc2guc3BsaXQoJyQnKTtcbiAgICBpZiAoaGFzaFNlZ21lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHJvdW5kcyA9IHBhcnNlSW50KGhhc2hTZWdtZW50c1syXSwgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcm91bmRzO1xufTtcblxuLy8gQ2hlY2sgd2hldGhlciB0aGUgcHJvdmlkZWQgcGFzc3dvcmQgbWF0Y2hlcyB0aGUgYmNyeXB0J2VkIHBhc3N3b3JkIGluXG4vLyB0aGUgZGF0YWJhc2UgdXNlciByZWNvcmQuIGBwYXNzd29yZGAgY2FuIGJlIGEgc3RyaW5nIChpbiB3aGljaCBjYXNlXG4vLyBpdCB3aWxsIGJlIHJ1biB0aHJvdWdoIFNIQTI1NiBiZWZvcmUgYmNyeXB0KSBvciBhbiBvYmplY3Qgd2l0aFxuLy8gcHJvcGVydGllcyBgZGlnZXN0YCBhbmQgYGFsZ29yaXRobWAgKGluIHdoaWNoIGNhc2Ugd2UgYmNyeXB0XG4vLyBgcGFzc3dvcmQuZGlnZXN0YCkuXG4vL1xuQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgPSAodXNlciwgcGFzc3dvcmQpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0ge1xuICAgIHVzZXJJZDogdXNlci5faWRcbiAgfTtcblxuICBjb25zdCBmb3JtYXR0ZWRQYXNzd29yZCA9IGdldFBhc3N3b3JkU3RyaW5nKHBhc3N3b3JkKTtcbiAgY29uc3QgaGFzaCA9IHVzZXIuc2VydmljZXMucGFzc3dvcmQuYmNyeXB0O1xuICBjb25zdCBoYXNoUm91bmRzID0gZ2V0Um91bmRzRnJvbUJjcnlwdEhhc2goaGFzaCk7XG5cbiAgaWYgKCEgYmNyeXB0Q29tcGFyZShmb3JtYXR0ZWRQYXNzd29yZCwgaGFzaCkpIHtcbiAgICByZXN1bHQuZXJyb3IgPSBoYW5kbGVFcnJvcihcIkluY29ycmVjdCBwYXNzd29yZFwiLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAoaGFzaCAmJiBBY2NvdW50cy5fYmNyeXB0Um91bmRzKCkgIT0gaGFzaFJvdW5kcykge1xuICAgIC8vIFRoZSBwYXNzd29yZCBjaGVja3Mgb3V0LCBidXQgdGhlIHVzZXIncyBiY3J5cHQgaGFzaCBuZWVkcyB0byBiZSB1cGRhdGVkLlxuICAgIE1ldGVvci5kZWZlcigoKSA9PiB7XG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHsgX2lkOiB1c2VyLl9pZCB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAnc2VydmljZXMucGFzc3dvcmQuYmNyeXB0JzpcbiAgICAgICAgICAgIGJjcnlwdEhhc2goZm9ybWF0dGVkUGFzc3dvcmQsIEFjY291bnRzLl9iY3J5cHRSb3VuZHMoKSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcbmNvbnN0IGNoZWNrUGFzc3dvcmQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZDtcblxuLy8vXG4vLy8gRVJST1IgSEFORExFUlxuLy8vXG5jb25zdCBoYW5kbGVFcnJvciA9IChtc2csIHRocm93RXJyb3IgPSB0cnVlKSA9PiB7XG4gIGNvbnN0IGVycm9yID0gbmV3IE1ldGVvci5FcnJvcihcbiAgICA0MDMsXG4gICAgQWNjb3VudHMuX29wdGlvbnMuYW1iaWd1b3VzRXJyb3JNZXNzYWdlc1xuICAgICAgPyBcIlNvbWV0aGluZyB3ZW50IHdyb25nLiBQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscy5cIlxuICAgICAgOiBtc2dcbiAgKTtcbiAgaWYgKHRocm93RXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59O1xuXG4vLy9cbi8vLyBMT0dJTlxuLy8vXG5cbkFjY291bnRzLl9maW5kVXNlckJ5UXVlcnkgPSBxdWVyeSA9PiB7XG4gIGxldCB1c2VyID0gbnVsbDtcblxuICBpZiAocXVlcnkuaWQpIHtcbiAgICB1c2VyID0gZ2V0VXNlckJ5SWQocXVlcnkuaWQpO1xuICB9IGVsc2Uge1xuICAgIGxldCBmaWVsZE5hbWU7XG4gICAgbGV0IGZpZWxkVmFsdWU7XG4gICAgaWYgKHF1ZXJ5LnVzZXJuYW1lKSB7XG4gICAgICBmaWVsZE5hbWUgPSAndXNlcm5hbWUnO1xuICAgICAgZmllbGRWYWx1ZSA9IHF1ZXJ5LnVzZXJuYW1lO1xuICAgIH0gZWxzZSBpZiAocXVlcnkuZW1haWwpIHtcbiAgICAgIGZpZWxkTmFtZSA9ICdlbWFpbHMuYWRkcmVzcyc7XG4gICAgICBmaWVsZFZhbHVlID0gcXVlcnkuZW1haWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZG4ndCBoYXBwZW4gKHZhbGlkYXRpb24gbWlzc2VkIHNvbWV0aGluZylcIik7XG4gICAgfVxuICAgIGxldCBzZWxlY3RvciA9IHt9O1xuICAgIHNlbGVjdG9yW2ZpZWxkTmFtZV0gPSBmaWVsZFZhbHVlO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShzZWxlY3Rvcik7XG4gICAgLy8gSWYgdXNlciBpcyBub3QgZm91bmQsIHRyeSBhIGNhc2UgaW5zZW5zaXRpdmUgbG9va3VwXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yRm9yRmFzdENhc2VJbnNlbnNpdGl2ZUxvb2t1cChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgY29uc3QgY2FuZGlkYXRlVXNlcnMgPSBNZXRlb3IudXNlcnMuZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgIC8vIE5vIG1hdGNoIGlmIG11bHRpcGxlIGNhbmRpZGF0ZXMgYXJlIGZvdW5kXG4gICAgICBpZiAoY2FuZGlkYXRlVXNlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHVzZXIgPSBjYW5kaWRhdGVVc2Vyc1swXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdXNlcjtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgRmluZHMgdGhlIHVzZXIgd2l0aCB0aGUgc3BlY2lmaWVkIHVzZXJuYW1lLlxuICogRmlyc3QgdHJpZXMgdG8gbWF0Y2ggdXNlcm5hbWUgY2FzZSBzZW5zaXRpdmVseTsgaWYgdGhhdCBmYWlscywgaXRcbiAqIHRyaWVzIGNhc2UgaW5zZW5zaXRpdmVseTsgYnV0IGlmIG1vcmUgdGhhbiBvbmUgdXNlciBtYXRjaGVzIHRoZSBjYXNlXG4gKiBpbnNlbnNpdGl2ZSBzZWFyY2gsIGl0IHJldHVybnMgbnVsbC5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VybmFtZSBUaGUgdXNlcm5hbWUgdG8gbG9vayBmb3JcbiAqIEByZXR1cm5zIHtPYmplY3R9IEEgdXNlciBpZiBmb3VuZCwgZWxzZSBudWxsXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5maW5kVXNlckJ5VXNlcm5hbWUgPSBcbiAgdXNlcm5hbWUgPT4gQWNjb3VudHMuX2ZpbmRVc2VyQnlRdWVyeSh7IHVzZXJuYW1lIH0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEZpbmRzIHRoZSB1c2VyIHdpdGggdGhlIHNwZWNpZmllZCBlbWFpbC5cbiAqIEZpcnN0IHRyaWVzIHRvIG1hdGNoIGVtYWlsIGNhc2Ugc2Vuc2l0aXZlbHk7IGlmIHRoYXQgZmFpbHMsIGl0XG4gKiB0cmllcyBjYXNlIGluc2Vuc2l0aXZlbHk7IGJ1dCBpZiBtb3JlIHRoYW4gb25lIHVzZXIgbWF0Y2hlcyB0aGUgY2FzZVxuICogaW5zZW5zaXRpdmUgc2VhcmNoLCBpdCByZXR1cm5zIG51bGwuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgVGhlIGVtYWlsIGFkZHJlc3MgdG8gbG9vayBmb3JcbiAqIEByZXR1cm5zIHtPYmplY3R9IEEgdXNlciBpZiBmb3VuZCwgZWxzZSBudWxsXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5maW5kVXNlckJ5RW1haWwgPSBlbWFpbCA9PiBBY2NvdW50cy5fZmluZFVzZXJCeVF1ZXJ5KHsgZW1haWwgfSk7XG5cbi8vIEdlbmVyYXRlcyBhIE1vbmdvREIgc2VsZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBwZXJmb3JtIGEgZmFzdCBjYXNlXG4vLyBpbnNlbnNpdGl2ZSBsb29rdXAgZm9yIHRoZSBnaXZlbiBmaWVsZE5hbWUgYW5kIHN0cmluZy4gU2luY2UgTW9uZ29EQiBkb2VzXG4vLyBub3Qgc3VwcG9ydCBjYXNlIGluc2Vuc2l0aXZlIGluZGV4ZXMsIGFuZCBjYXNlIGluc2Vuc2l0aXZlIHJlZ2V4IHF1ZXJpZXNcbi8vIGFyZSBzbG93LCB3ZSBjb25zdHJ1Y3QgYSBzZXQgb2YgcHJlZml4IHNlbGVjdG9ycyBmb3IgYWxsIHBlcm11dGF0aW9ucyBvZlxuLy8gdGhlIGZpcnN0IDQgY2hhcmFjdGVycyBvdXJzZWx2ZXMuIFdlIGZpcnN0IGF0dGVtcHQgdG8gbWF0Y2hpbmcgYWdhaW5zdFxuLy8gdGhlc2UsIGFuZCBiZWNhdXNlICdwcmVmaXggZXhwcmVzc2lvbicgcmVnZXggcXVlcmllcyBkbyB1c2UgaW5kZXhlcyAoc2VlXG4vLyBodHRwOi8vZG9jcy5tb25nb2RiLm9yZy92Mi42L3JlZmVyZW5jZS9vcGVyYXRvci9xdWVyeS9yZWdleC8jaW5kZXgtdXNlKSxcbi8vIHRoaXMgaGFzIGJlZW4gZm91bmQgdG8gZ3JlYXRseSBpbXByb3ZlIHBlcmZvcm1hbmNlIChmcm9tIDEyMDBtcyB0byA1bXMgaW4gYVxuLy8gdGVzdCB3aXRoIDEuMDAwLjAwMCB1c2VycykuXG5jb25zdCBzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAgPSAoZmllbGROYW1lLCBzdHJpbmcpID0+IHtcbiAgLy8gUGVyZm9ybWFuY2Ugc2VlbXMgdG8gaW1wcm92ZSB1cCB0byA0IHByZWZpeCBjaGFyYWN0ZXJzXG4gIGNvbnN0IHByZWZpeCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgTWF0aC5taW4oc3RyaW5nLmxlbmd0aCwgNCkpO1xuICBjb25zdCBvckNsYXVzZSA9IGdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyhwcmVmaXgpLm1hcChcbiAgICBwcmVmaXhQZXJtdXRhdGlvbiA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3JbZmllbGROYW1lXSA9XG4gICAgICAgIG5ldyBSZWdFeHAoYF4ke01ldGVvci5fZXNjYXBlUmVnRXhwKHByZWZpeFBlcm11dGF0aW9uKX1gKTtcbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9KTtcbiAgY29uc3QgY2FzZUluc2Vuc2l0aXZlQ2xhdXNlID0ge307XG4gIGNhc2VJbnNlbnNpdGl2ZUNsYXVzZVtmaWVsZE5hbWVdID1cbiAgICBuZXcgUmVnRXhwKGBeJHtNZXRlb3IuX2VzY2FwZVJlZ0V4cChzdHJpbmcpfSRgLCAnaScpXG4gIHJldHVybiB7JGFuZDogW3skb3I6IG9yQ2xhdXNlfSwgY2FzZUluc2Vuc2l0aXZlQ2xhdXNlXX07XG59XG5cbi8vIEdlbmVyYXRlcyBwZXJtdXRhdGlvbnMgb2YgYWxsIGNhc2UgdmFyaWF0aW9ucyBvZiBhIGdpdmVuIHN0cmluZy5cbmNvbnN0IGdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyA9IHN0cmluZyA9PiB7XG4gIGxldCBwZXJtdXRhdGlvbnMgPSBbJyddO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoID0gc3RyaW5nLmNoYXJBdChpKTtcbiAgICBwZXJtdXRhdGlvbnMgPSBbXS5jb25jYXQoLi4uKHBlcm11dGF0aW9ucy5tYXAocHJlZml4ID0+IHtcbiAgICAgIGNvbnN0IGxvd2VyQ2FzZUNoYXIgPSBjaC50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3QgdXBwZXJDYXNlQ2hhciA9IGNoLnRvVXBwZXJDYXNlKCk7XG4gICAgICAvLyBEb24ndCBhZGQgdW5uZWNjZXNhcnkgcGVybXV0YXRpb25zIHdoZW4gY2ggaXMgbm90IGEgbGV0dGVyXG4gICAgICBpZiAobG93ZXJDYXNlQ2hhciA9PT0gdXBwZXJDYXNlQ2hhcikge1xuICAgICAgICByZXR1cm4gW3ByZWZpeCArIGNoXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbcHJlZml4ICsgbG93ZXJDYXNlQ2hhciwgcHJlZml4ICsgdXBwZXJDYXNlQ2hhcl07XG4gICAgICB9XG4gICAgfSkpKTtcbiAgfVxuICByZXR1cm4gcGVybXV0YXRpb25zO1xufVxuXG5jb25zdCBjaGVja0ZvckNhc2VJbnNlbnNpdGl2ZUR1cGxpY2F0ZXMgPSAoZmllbGROYW1lLCBkaXNwbGF5TmFtZSwgZmllbGRWYWx1ZSwgb3duVXNlcklkKSA9PiB7XG4gIC8vIFNvbWUgdGVzdHMgbmVlZCB0aGUgYWJpbGl0eSB0byBhZGQgdXNlcnMgd2l0aCB0aGUgc2FtZSBjYXNlIGluc2Vuc2l0aXZlXG4gIC8vIHZhbHVlLCBoZW5jZSB0aGUgX3NraXBDYXNlSW5zZW5zaXRpdmVDaGVja3NGb3JUZXN0IGNoZWNrXG4gIGNvbnN0IHNraXBDaGVjayA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChBY2NvdW50cy5fc2tpcENhc2VJbnNlbnNpdGl2ZUNoZWNrc0ZvclRlc3QsIGZpZWxkVmFsdWUpO1xuXG4gIGlmIChmaWVsZFZhbHVlICYmICFza2lwQ2hlY2spIHtcbiAgICBjb25zdCBtYXRjaGVkVXNlcnMgPSBNZXRlb3IudXNlcnMuZmluZChcbiAgICAgIHNlbGVjdG9yRm9yRmFzdENhc2VJbnNlbnNpdGl2ZUxvb2t1cChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpKS5mZXRjaCgpO1xuXG4gICAgaWYgKG1hdGNoZWRVc2Vycy5sZW5ndGggPiAwICYmXG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSB1c2VySWQgeWV0LCBhbnkgbWF0Y2ggd2UgZmluZCBpcyBhIGR1cGxpY2F0ZVxuICAgICAgICAoIW93blVzZXJJZCB8fFxuICAgICAgICAvLyBPdGhlcndpc2UsIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbWF0Y2hlcyBvciBhIG1hdGNoXG4gICAgICAgIC8vIHRoYXQgaXMgbm90IHVzXG4gICAgICAgIChtYXRjaGVkVXNlcnMubGVuZ3RoID4gMSB8fCBtYXRjaGVkVXNlcnNbMF0uX2lkICE9PSBvd25Vc2VySWQpKSkge1xuICAgICAgaGFuZGxlRXJyb3IoYCR7ZGlzcGxheU5hbWV9IGFscmVhZHkgZXhpc3RzLmApO1xuICAgIH1cbiAgfVxufTtcblxuLy8gWFhYIG1heWJlIHRoaXMgYmVsb25ncyBpbiB0aGUgY2hlY2sgcGFja2FnZVxuY29uc3QgTm9uRW1wdHlTdHJpbmcgPSBNYXRjaC5XaGVyZSh4ID0+IHtcbiAgY2hlY2soeCwgU3RyaW5nKTtcbiAgcmV0dXJuIHgubGVuZ3RoID4gMDtcbn0pO1xuXG5jb25zdCB1c2VyUXVlcnlWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZSh1c2VyID0+IHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChOb25FbXB0eVN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoTm9uRW1wdHlTdHJpbmcpXG4gIH0pO1xuICBpZiAoT2JqZWN0LmtleXModXNlcikubGVuZ3RoICE9PSAxKVxuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcihcIlVzZXIgcHJvcGVydHkgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGZpZWxkXCIpO1xuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5jb25zdCBwYXNzd29yZFZhbGlkYXRvciA9IE1hdGNoLk9uZU9mKFxuICBTdHJpbmcsXG4gIHsgZGlnZXN0OiBTdHJpbmcsIGFsZ29yaXRobTogU3RyaW5nIH1cbik7XG5cbi8vIEhhbmRsZXIgdG8gbG9naW4gd2l0aCBhIHBhc3N3b3JkLlxuLy9cbi8vIFRoZSBNZXRlb3IgY2xpZW50IHNldHMgb3B0aW9ucy5wYXNzd29yZCB0byBhbiBvYmplY3Qgd2l0aCBrZXlzXG4vLyAnZGlnZXN0JyAoc2V0IHRvIFNIQTI1NihwYXNzd29yZCkpIGFuZCAnYWxnb3JpdGhtJyAoXCJzaGEtMjU2XCIpLlxuLy9cbi8vIEZvciBvdGhlciBERFAgY2xpZW50cyB3aGljaCBkb24ndCBoYXZlIGFjY2VzcyB0byBTSEEsIHRoZSBoYW5kbGVyXG4vLyBhbHNvIGFjY2VwdHMgdGhlIHBsYWludGV4dCBwYXNzd29yZCBpbiBvcHRpb25zLnBhc3N3b3JkIGFzIGEgc3RyaW5nLlxuLy9cbi8vIChJdCBtaWdodCBiZSBuaWNlIGlmIHNlcnZlcnMgY291bGQgdHVybiB0aGUgcGxhaW50ZXh0IHBhc3N3b3JkXG4vLyBvcHRpb24gb2ZmLiBPciBtYXliZSBpdCBzaG91bGQgYmUgb3B0LWluLCBub3Qgb3B0LW91dD9cbi8vIEFjY291bnRzLmNvbmZpZyBvcHRpb24/KVxuLy9cbi8vIE5vdGUgdGhhdCBuZWl0aGVyIHBhc3N3b3JkIG9wdGlvbiBpcyBzZWN1cmUgd2l0aG91dCBTU0wuXG4vL1xuQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIoXCJwYXNzd29yZFwiLCBvcHRpb25zID0+IHtcbiAgaWYgKCEgb3B0aW9ucy5wYXNzd29yZCB8fCBvcHRpb25zLnNycClcbiAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBkb24ndCBoYW5kbGVcblxuICBjaGVjayhvcHRpb25zLCB7XG4gICAgdXNlcjogdXNlclF1ZXJ5VmFsaWRhdG9yLFxuICAgIHBhc3N3b3JkOiBwYXNzd29yZFZhbGlkYXRvclxuICB9KTtcblxuXG4gIGNvbnN0IHVzZXIgPSBBY2NvdW50cy5fZmluZFVzZXJCeVF1ZXJ5KG9wdGlvbnMudXNlcik7XG4gIGlmICghdXNlcikge1xuICAgIGhhbmRsZUVycm9yKFwiVXNlciBub3QgZm91bmRcIik7XG4gIH1cblxuICBpZiAoIXVzZXIuc2VydmljZXMgfHwgIXVzZXIuc2VydmljZXMucGFzc3dvcmQgfHxcbiAgICAgICEodXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQgfHwgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnApKSB7XG4gICAgaGFuZGxlRXJyb3IoXCJVc2VyIGhhcyBubyBwYXNzd29yZCBzZXRcIik7XG4gIH1cblxuICBpZiAoIXVzZXIuc2VydmljZXMucGFzc3dvcmQuYmNyeXB0KSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnBhc3N3b3JkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAvLyBUaGUgY2xpZW50IGhhcyBwcmVzZW50ZWQgYSBwbGFpbnRleHQgcGFzc3dvcmQsIGFuZCB0aGUgdXNlciBpc1xuICAgICAgLy8gbm90IHVwZ3JhZGVkIHRvIGJjcnlwdCB5ZXQuIFdlIGRvbid0IGF0dGVtcHQgdG8gdGVsbCB0aGUgY2xpZW50XG4gICAgICAvLyB0byB1cGdyYWRlIHRvIGJjcnlwdCwgYmVjYXVzZSBpdCBtaWdodCBiZSBhIHN0YW5kYWxvbmUgRERQXG4gICAgICAvLyBjbGllbnQgZG9lc24ndCBrbm93IGhvdyB0byBkbyBzdWNoIGEgdGhpbmcuXG4gICAgICBjb25zdCB2ZXJpZmllciA9IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwO1xuICAgICAgY29uc3QgbmV3VmVyaWZpZXIgPSBTUlAuZ2VuZXJhdGVWZXJpZmllcihvcHRpb25zLnBhc3N3b3JkLCB7XG4gICAgICAgIGlkZW50aXR5OiB2ZXJpZmllci5pZGVudGl0eSwgc2FsdDogdmVyaWZpZXIuc2FsdH0pO1xuXG4gICAgICBpZiAodmVyaWZpZXIudmVyaWZpZXIgIT09IG5ld1ZlcmlmaWVyLnZlcmlmaWVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcklkOiBBY2NvdW50cy5fb3B0aW9ucy5hbWJpZ3VvdXNFcnJvck1lc3NhZ2VzID8gbnVsbCA6IHVzZXIuX2lkLFxuICAgICAgICAgIGVycm9yOiBoYW5kbGVFcnJvcihcIkluY29ycmVjdCBwYXNzd29yZFwiLCBmYWxzZSlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHt1c2VySWQ6IHVzZXIuX2lkfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGVsbCB0aGUgY2xpZW50IHRvIHVzZSB0aGUgU1JQIHVwZ3JhZGUgcHJvY2Vzcy5cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIm9sZCBwYXNzd29yZCBmb3JtYXRcIiwgRUpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZm9ybWF0OiAnc3JwJyxcbiAgICAgICAgaWRlbnRpdHk6IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwLmlkZW50aXR5XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoZWNrUGFzc3dvcmQoXG4gICAgdXNlcixcbiAgICBvcHRpb25zLnBhc3N3b3JkXG4gICk7XG59KTtcblxuLy8gSGFuZGxlciB0byBsb2dpbiB1c2luZyB0aGUgU1JQIHVwZ3JhZGUgcGF0aC4gVG8gdXNlIHRoaXMgbG9naW5cbi8vIGhhbmRsZXIsIHRoZSBjbGllbnQgbXVzdCBwcm92aWRlOlxuLy8gICAtIHNycDogSChpZGVudGl0eSArIFwiOlwiICsgcGFzc3dvcmQpXG4vLyAgIC0gcGFzc3dvcmQ6IGEgc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgJ2RpZ2VzdCcgYW5kICdhbGdvcml0aG0nXG4vL1xuLy8gV2UgdXNlIGBvcHRpb25zLnNycGAgdG8gdmVyaWZ5IHRoYXQgdGhlIGNsaWVudCBrbm93cyB0aGUgY29ycmVjdFxuLy8gcGFzc3dvcmQgd2l0aG91dCBkb2luZyBhIGZ1bGwgU1JQIGZsb3cuIE9uY2Ugd2UndmUgY2hlY2tlZCB0aGF0LCB3ZVxuLy8gdXBncmFkZSB0aGUgdXNlciB0byBiY3J5cHQgYW5kIHJlbW92ZSB0aGUgU1JQIGluZm9ybWF0aW9uIGZyb20gdGhlXG4vLyB1c2VyIGRvY3VtZW50LlxuLy9cbi8vIFRoZSBjbGllbnQgZW5kcyB1cCB1c2luZyB0aGlzIGxvZ2luIGhhbmRsZXIgYWZ0ZXIgdHJ5aW5nIHRoZSBub3JtYWxcbi8vIGxvZ2luIGhhbmRsZXIgKGFib3ZlKSwgd2hpY2ggdGhyb3dzIGFuIGVycm9yIHRlbGxpbmcgdGhlIGNsaWVudCB0b1xuLy8gdHJ5IHRoZSBTUlAgdXBncmFkZSBwYXRoLlxuLy9cbi8vIFhYWCBDT01QQVQgV0lUSCAwLjguMS4zXG5BY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInBhc3N3b3JkXCIsIG9wdGlvbnMgPT4ge1xuICBpZiAoIW9wdGlvbnMuc3JwIHx8ICFvcHRpb25zLnBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZG9uJ3QgaGFuZGxlXG4gIH1cblxuICBjaGVjayhvcHRpb25zLCB7XG4gICAgdXNlcjogdXNlclF1ZXJ5VmFsaWRhdG9yLFxuICAgIHNycDogU3RyaW5nLFxuICAgIHBhc3N3b3JkOiBwYXNzd29yZFZhbGlkYXRvclxuICB9KTtcblxuICBjb25zdCB1c2VyID0gQWNjb3VudHMuX2ZpbmRVc2VyQnlRdWVyeShvcHRpb25zLnVzZXIpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgbm90IGZvdW5kXCIpO1xuICB9XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIGFub3RoZXIgc2ltdWx0YW5lb3VzIGxvZ2luIGhhcyBhbHJlYWR5IHVwZ3JhZGVkXG4gIC8vIHRoZSB1c2VyIHJlY29yZCB0byBiY3J5cHQuXG4gIGlmICh1c2VyLnNlcnZpY2VzICYmIHVzZXIuc2VydmljZXMucGFzc3dvcmQgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQpIHtcbiAgICByZXR1cm4gY2hlY2tQYXNzd29yZCh1c2VyLCBvcHRpb25zLnBhc3N3b3JkKTtcbiAgfVxuXG4gIGlmICghKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZCAmJiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycCkpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcbiAgfVxuXG4gIGNvbnN0IHYxID0gdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnAudmVyaWZpZXI7XG4gIGNvbnN0IHYyID0gU1JQLmdlbmVyYXRlVmVyaWZpZXIoXG4gICAgbnVsbCxcbiAgICB7XG4gICAgICBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkOiBvcHRpb25zLnNycCxcbiAgICAgIHNhbHQ6IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwLnNhbHRcbiAgICB9XG4gICkudmVyaWZpZXI7XG4gIGlmICh2MSAhPT0gdjIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlcklkOiBBY2NvdW50cy5fb3B0aW9ucy5hbWJpZ3VvdXNFcnJvck1lc3NhZ2VzID8gbnVsbCA6IHVzZXIuX2lkLFxuICAgICAgZXJyb3I6IGhhbmRsZUVycm9yKFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIsIGZhbHNlKVxuICAgIH07XG4gIH1cblxuICAvLyBVcGdyYWRlIHRvIGJjcnlwdCBvbiBzdWNjZXNzZnVsIGxvZ2luLlxuICBjb25zdCBzYWx0ZWQgPSBoYXNoUGFzc3dvcmQob3B0aW9ucy5wYXNzd29yZCk7XG4gIE1ldGVvci51c2Vycy51cGRhdGUoXG4gICAgdXNlci5faWQsXG4gICAge1xuICAgICAgJHVuc2V0OiB7ICdzZXJ2aWNlcy5wYXNzd29yZC5zcnAnOiAxIH0sXG4gICAgICAkc2V0OiB7ICdzZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQnOiBzYWx0ZWQgfVxuICAgIH1cbiAgKTtcblxuICByZXR1cm4ge3VzZXJJZDogdXNlci5faWR9O1xufSk7XG5cblxuLy8vXG4vLy8gQ0hBTkdJTkdcbi8vL1xuXG4vKipcbiAqIEBzdW1tYXJ5IENoYW5nZSBhIHVzZXIncyB1c2VybmFtZS4gVXNlIHRoaXMgaW5zdGVhZCBvZiB1cGRhdGluZyB0aGVcbiAqIGRhdGFiYXNlIGRpcmVjdGx5LiBUaGUgb3BlcmF0aW9uIHdpbGwgZmFpbCBpZiB0aGVyZSBpcyBhbiBleGlzdGluZyB1c2VyXG4gKiB3aXRoIGEgdXNlcm5hbWUgb25seSBkaWZmZXJpbmcgaW4gY2FzZS5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIElEIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuZXdVc2VybmFtZSBBIG5ldyB1c2VybmFtZSBmb3IgdGhlIHVzZXIuXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5zZXRVc2VybmFtZSA9ICh1c2VySWQsIG5ld1VzZXJuYW1lKSA9PiB7XG4gIGNoZWNrKHVzZXJJZCwgTm9uRW1wdHlTdHJpbmcpO1xuICBjaGVjayhuZXdVc2VybmFtZSwgTm9uRW1wdHlTdHJpbmcpO1xuXG4gIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlJZCh1c2VySWQpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgbm90IGZvdW5kXCIpO1xuICB9XG5cbiAgY29uc3Qgb2xkVXNlcm5hbWUgPSB1c2VyLnVzZXJuYW1lO1xuXG4gIC8vIFBlcmZvcm0gYSBjYXNlIGluc2Vuc2l0aXZlIGNoZWNrIGZvciBkdXBsaWNhdGVzIGJlZm9yZSB1cGRhdGVcbiAgY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzKCd1c2VybmFtZScsICdVc2VybmFtZScsIG5ld1VzZXJuYW1lLCB1c2VyLl9pZCk7XG5cbiAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyLl9pZH0sIHskc2V0OiB7dXNlcm5hbWU6IG5ld1VzZXJuYW1lfX0pO1xuXG4gIC8vIFBlcmZvcm0gYW5vdGhlciBjaGVjayBhZnRlciB1cGRhdGUsIGluIGNhc2UgYSBtYXRjaGluZyB1c2VyIGhhcyBiZWVuXG4gIC8vIGluc2VydGVkIGluIHRoZSBtZWFudGltZVxuICB0cnkge1xuICAgIGNoZWNrRm9yQ2FzZUluc2Vuc2l0aXZlRHVwbGljYXRlcygndXNlcm5hbWUnLCAnVXNlcm5hbWUnLCBuZXdVc2VybmFtZSwgdXNlci5faWQpO1xuICB9IGNhdGNoIChleCkge1xuICAgIC8vIFVuZG8gdXBkYXRlIGlmIHRoZSBjaGVjayBmYWlsc1xuICAgIE1ldGVvci51c2Vycy51cGRhdGUoe19pZDogdXNlci5faWR9LCB7JHNldDoge3VzZXJuYW1lOiBvbGRVc2VybmFtZX19KTtcbiAgICB0aHJvdyBleDtcbiAgfVxufTtcblxuLy8gTGV0IHRoZSB1c2VyIGNoYW5nZSB0aGVpciBvd24gcGFzc3dvcmQgaWYgdGhleSBrbm93IHRoZSBvbGRcbi8vIHBhc3N3b3JkLiBgb2xkUGFzc3dvcmRgIGFuZCBgbmV3UGFzc3dvcmRgIHNob3VsZCBiZSBvYmplY3RzIHdpdGgga2V5c1xuLy8gYGRpZ2VzdGAgYW5kIGBhbGdvcml0aG1gIChyZXByZXNlbnRpbmcgdGhlIFNIQTI1NiBvZiB0aGUgcGFzc3dvcmQpLlxuLy9cbi8vIFhYWCBDT01QQVQgV0lUSCAwLjguMS4zXG4vLyBMaWtlIHRoZSBsb2dpbiBtZXRob2QsIGlmIHRoZSB1c2VyIGhhc24ndCBiZWVuIHVwZ3JhZGVkIGZyb20gU1JQIHRvXG4vLyBiY3J5cHQgeWV0LCB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgdGhyb3cgYW4gJ29sZCBwYXNzd29yZCBmb3JtYXQnXG4vLyBlcnJvci4gVGhlIGNsaWVudCBzaG91bGQgY2FsbCB0aGUgU1JQIHVwZ3JhZGUgbG9naW4gaGFuZGxlciBhbmQgdGhlblxuLy8gcmV0cnkgdGhpcyBtZXRob2QgYWdhaW4uXG4vL1xuLy8gVU5MSUtFIHRoZSBsb2dpbiBtZXRob2QsIHRoZXJlIGlzIG5vIHdheSB0byBhdm9pZCBnZXR0aW5nIFNSUCB1cGdyYWRlXG4vLyBlcnJvcnMgdGhyb3duLiBUaGUgcmVhc29uaW5nIGZvciB0aGlzIGlzIHRoYXQgY2xpZW50cyB1c2luZyB0aGlzXG4vLyBtZXRob2QgZGlyZWN0bHkgd2lsbCBuZWVkIHRvIGJlIHVwZGF0ZWQgYW55d2F5IGJlY2F1c2Ugd2Ugbm8gbG9uZ2VyXG4vLyBzdXBwb3J0IHRoZSBTUlAgZmxvdyB0aGF0IHRoZXkgd291bGQgaGF2ZSBiZWVuIGRvaW5nIHRvIHVzZSB0aGlzXG4vLyBtZXRob2QgcHJldmlvdXNseS5cbk1ldGVvci5tZXRob2RzKHtjaGFuZ2VQYXNzd29yZDogZnVuY3Rpb24gKG9sZFBhc3N3b3JkLCBuZXdQYXNzd29yZCkge1xuICBjaGVjayhvbGRQYXNzd29yZCwgcGFzc3dvcmRWYWxpZGF0b3IpO1xuICBjaGVjayhuZXdQYXNzd29yZCwgcGFzc3dvcmRWYWxpZGF0b3IpO1xuXG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCJNdXN0IGJlIGxvZ2dlZCBpblwiKTtcbiAgfVxuXG4gIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlJZCh0aGlzLnVzZXJJZCk7XG4gIGlmICghdXNlcikge1xuICAgIGhhbmRsZUVycm9yKFwiVXNlciBub3QgZm91bmRcIik7XG4gIH1cblxuICBpZiAoIXVzZXIuc2VydmljZXMgfHwgIXVzZXIuc2VydmljZXMucGFzc3dvcmQgfHxcbiAgICAgICghdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQgJiYgIXVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwKSkge1xuICAgIGhhbmRsZUVycm9yKFwiVXNlciBoYXMgbm8gcGFzc3dvcmQgc2V0XCIpO1xuICB9XG5cbiAgaWYgKCEgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJvbGQgcGFzc3dvcmQgZm9ybWF0XCIsIEVKU09OLnN0cmluZ2lmeSh7XG4gICAgICBmb3JtYXQ6ICdzcnAnLFxuICAgICAgaWRlbnRpdHk6IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwLmlkZW50aXR5XG4gICAgfSkpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gY2hlY2tQYXNzd29yZCh1c2VyLCBvbGRQYXNzd29yZCk7XG4gIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gIH1cblxuICBjb25zdCBoYXNoZWQgPSBoYXNoUGFzc3dvcmQobmV3UGFzc3dvcmQpO1xuXG4gIC8vIEl0IHdvdWxkIGJlIGJldHRlciBpZiB0aGlzIHJlbW92ZWQgQUxMIGV4aXN0aW5nIHRva2VucyBhbmQgcmVwbGFjZWRcbiAgLy8gdGhlIHRva2VuIGZvciB0aGUgY3VycmVudCBjb25uZWN0aW9uIHdpdGggYSBuZXcgb25lLCBidXQgdGhhdCB3b3VsZFxuICAvLyBiZSB0cmlja3ksIHNvIHdlJ2xsIHNldHRsZSBmb3IganVzdCByZXBsYWNpbmcgYWxsIHRva2VucyBvdGhlciB0aGFuXG4gIC8vIHRoZSBvbmUgZm9yIHRoZSBjdXJyZW50IGNvbm5lY3Rpb24uXG4gIGNvbnN0IGN1cnJlbnRUb2tlbiA9IEFjY291bnRzLl9nZXRMb2dpblRva2VuKHRoaXMuY29ubmVjdGlvbi5pZCk7XG4gIE1ldGVvci51c2Vycy51cGRhdGUoXG4gICAgeyBfaWQ6IHRoaXMudXNlcklkIH0sXG4gICAge1xuICAgICAgJHNldDogeyAnc2VydmljZXMucGFzc3dvcmQuYmNyeXB0JzogaGFzaGVkIH0sXG4gICAgICAkcHVsbDoge1xuICAgICAgICAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zJzogeyBoYXNoZWRUb2tlbjogeyAkbmU6IGN1cnJlbnRUb2tlbiB9IH1cbiAgICAgIH0sXG4gICAgICAkdW5zZXQ6IHsgJ3NlcnZpY2VzLnBhc3N3b3JkLnJlc2V0JzogMSB9XG4gICAgfVxuICApO1xuXG4gIHJldHVybiB7cGFzc3dvcmRDaGFuZ2VkOiB0cnVlfTtcbn19KTtcblxuXG4vLyBGb3JjZSBjaGFuZ2UgdGhlIHVzZXJzIHBhc3N3b3JkLlxuXG4vKipcbiAqIEBzdW1tYXJ5IEZvcmNpYmx5IGNoYW5nZSB0aGUgcGFzc3dvcmQgZm9yIGEgdXNlci5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuZXdQYXNzd29yZCBBIG5ldyBwYXNzd29yZCBmb3IgdGhlIHVzZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5sb2dvdXQgTG9nb3V0IGFsbCBjdXJyZW50IGNvbm5lY3Rpb25zIHdpdGggdGhpcyB1c2VySWQgKGRlZmF1bHQ6IHRydWUpXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5zZXRQYXNzd29yZCA9ICh1c2VySWQsIG5ld1BsYWludGV4dFBhc3N3b3JkLCBvcHRpb25zKSA9PiB7XG4gIG9wdGlvbnMgPSB7IGxvZ291dDogdHJ1ZSAsIC4uLm9wdGlvbnMgfTtcblxuICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5SWQodXNlcklkKTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBub3QgZm91bmRcIik7XG4gIH1cblxuICBjb25zdCB1cGRhdGUgPSB7XG4gICAgJHVuc2V0OiB7XG4gICAgICAnc2VydmljZXMucGFzc3dvcmQuc3JwJzogMSwgLy8gWFhYIENPTVBBVCBXSVRIIDAuOC4xLjNcbiAgICAgICdzZXJ2aWNlcy5wYXNzd29yZC5yZXNldCc6IDFcbiAgICB9LFxuICAgICRzZXQ6IHsnc2VydmljZXMucGFzc3dvcmQuYmNyeXB0JzogaGFzaFBhc3N3b3JkKG5ld1BsYWludGV4dFBhc3N3b3JkKX1cbiAgfTtcblxuICBpZiAob3B0aW9ucy5sb2dvdXQpIHtcbiAgICB1cGRhdGUuJHVuc2V0WydzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMnXSA9IDE7XG4gIH1cblxuICBNZXRlb3IudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXIuX2lkfSwgdXBkYXRlKTtcbn07XG5cblxuLy8vXG4vLy8gUkVTRVRUSU5HIFZJQSBFTUFJTFxuLy8vXG5cbi8vIFV0aWxpdHkgZm9yIHBsdWNraW5nIGFkZHJlc3NlcyBmcm9tIGVtYWlsc1xuY29uc3QgcGx1Y2tBZGRyZXNzZXMgPSAoZW1haWxzID0gW10pID0+IGVtYWlscy5tYXAoZW1haWwgPT4gZW1haWwuYWRkcmVzcyk7XG5cbi8vIE1ldGhvZCBjYWxsZWQgYnkgYSB1c2VyIHRvIHJlcXVlc3QgYSBwYXNzd29yZCByZXNldCBlbWFpbC4gVGhpcyBpc1xuLy8gdGhlIHN0YXJ0IG9mIHRoZSByZXNldCBwcm9jZXNzLlxuTWV0ZW9yLm1ldGhvZHMoe2ZvcmdvdFBhc3N3b3JkOiBvcHRpb25zID0+IHtcbiAgY2hlY2sob3B0aW9ucywge2VtYWlsOiBTdHJpbmd9KTtcblxuICBjb25zdCB1c2VyID0gQWNjb3VudHMuZmluZFVzZXJCeUVtYWlsKG9wdGlvbnMuZW1haWwpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgbm90IGZvdW5kXCIpO1xuICB9XG5cbiAgY29uc3QgZW1haWxzID0gcGx1Y2tBZGRyZXNzZXModXNlci5lbWFpbHMpO1xuICBjb25zdCBjYXNlU2Vuc2l0aXZlRW1haWwgPSBlbWFpbHMuZmluZChcbiAgICBlbWFpbCA9PiBlbWFpbC50b0xvd2VyQ2FzZSgpID09PSBvcHRpb25zLmVtYWlsLnRvTG93ZXJDYXNlKClcbiAgKTtcblxuICBBY2NvdW50cy5zZW5kUmVzZXRQYXNzd29yZEVtYWlsKHVzZXIuX2lkLCBjYXNlU2Vuc2l0aXZlRW1haWwpO1xufX0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEdlbmVyYXRlcyBhIHJlc2V0IHRva2VuIGFuZCBzYXZlcyBpdCBpbnRvIHRoZSBkYXRhYmFzZS5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyIHRvIGdlbmVyYXRlIHRoZSByZXNldCB0b2tlbiBmb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgV2hpY2ggYWRkcmVzcyBvZiB0aGUgdXNlciB0byBnZW5lcmF0ZSB0aGUgcmVzZXQgdG9rZW4gZm9yLiBUaGlzIGFkZHJlc3MgbXVzdCBiZSBpbiB0aGUgdXNlcidzIGBlbWFpbHNgIGxpc3QuIElmIGBudWxsYCwgZGVmYXVsdHMgdG8gdGhlIGZpcnN0IGVtYWlsIGluIHRoZSBsaXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHJlYXNvbiBgcmVzZXRQYXNzd29yZGAgb3IgYGVucm9sbEFjY291bnRgLlxuICogQHBhcmFtIHtPYmplY3R9IFtleHRyYVRva2VuRGF0YV0gT3B0aW9uYWwgYWRkaXRpb25hbCBkYXRhIHRvIGJlIGFkZGVkIGludG8gdGhlIHRva2VuIHJlY29yZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB3aXRoIHtlbWFpbCwgdXNlciwgdG9rZW59IHZhbHVlcy5cbiAqIEBpbXBvcnRGcm9tUGFja2FnZSBhY2NvdW50cy1iYXNlXG4gKi9cbkFjY291bnRzLmdlbmVyYXRlUmVzZXRUb2tlbiA9ICh1c2VySWQsIGVtYWlsLCByZWFzb24sIGV4dHJhVG9rZW5EYXRhKSA9PiB7XG4gIC8vIE1ha2Ugc3VyZSB0aGUgdXNlciBleGlzdHMsIGFuZCBlbWFpbCBpcyBvbmUgb2YgdGhlaXIgYWRkcmVzc2VzLlxuICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5SWQodXNlcklkKTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgaGFuZGxlRXJyb3IoXCJDYW4ndCBmaW5kIHVzZXJcIik7XG4gIH1cblxuICAvLyBwaWNrIHRoZSBmaXJzdCBlbWFpbCBpZiB3ZSB3ZXJlbid0IHBhc3NlZCBhbiBlbWFpbC5cbiAgaWYgKCFlbWFpbCAmJiB1c2VyLmVtYWlscyAmJiB1c2VyLmVtYWlsc1swXSkge1xuICAgIGVtYWlsID0gdXNlci5lbWFpbHNbMF0uYWRkcmVzcztcbiAgfVxuXG4gIC8vIG1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgZW1haWxcbiAgaWYgKCFlbWFpbCB8fCBcbiAgICAhKHBsdWNrQWRkcmVzc2VzKHVzZXIuZW1haWxzKS5pbmNsdWRlcyhlbWFpbCkpKSB7XG4gICAgaGFuZGxlRXJyb3IoXCJObyBzdWNoIGVtYWlsIGZvciB1c2VyLlwiKTtcbiAgfVxuXG4gIGNvbnN0IHRva2VuID0gUmFuZG9tLnNlY3JldCgpO1xuICBjb25zdCB0b2tlblJlY29yZCA9IHtcbiAgICB0b2tlbixcbiAgICBlbWFpbCxcbiAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gIH07XG5cbiAgaWYgKHJlYXNvbiA9PT0gJ3Jlc2V0UGFzc3dvcmQnKSB7XG4gICAgdG9rZW5SZWNvcmQucmVhc29uID0gJ3Jlc2V0JztcbiAgfSBlbHNlIGlmIChyZWFzb24gPT09ICdlbnJvbGxBY2NvdW50Jykge1xuICAgIHRva2VuUmVjb3JkLnJlYXNvbiA9ICdlbnJvbGwnO1xuICB9IGVsc2UgaWYgKHJlYXNvbikge1xuICAgIC8vIGZhbGxiYWNrIHNvIHRoYXQgdGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCBmb3IgdW5rbm93biByZWFzb25zIGFzIHdlbGxcbiAgICB0b2tlblJlY29yZC5yZWFzb24gPSByZWFzb247XG4gIH1cblxuICBpZiAoZXh0cmFUb2tlbkRhdGEpIHtcbiAgICBPYmplY3QuYXNzaWduKHRva2VuUmVjb3JkLCBleHRyYVRva2VuRGF0YSk7XG4gIH1cblxuICBNZXRlb3IudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXIuX2lkfSwgeyRzZXQ6IHtcbiAgICAnc2VydmljZXMucGFzc3dvcmQucmVzZXQnOiB0b2tlblJlY29yZFxuICB9fSk7XG5cbiAgLy8gYmVmb3JlIHBhc3NpbmcgdG8gdGVtcGxhdGUsIHVwZGF0ZSB1c2VyIG9iamVjdCB3aXRoIG5ldyB0b2tlblxuICBNZXRlb3IuX2Vuc3VyZSh1c2VyLCAnc2VydmljZXMnLCAncGFzc3dvcmQnKS5yZXNldCA9IHRva2VuUmVjb3JkO1xuXG4gIHJldHVybiB7ZW1haWwsIHVzZXIsIHRva2VufTtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgR2VuZXJhdGVzIGFuIGUtbWFpbCB2ZXJpZmljYXRpb24gdG9rZW4gYW5kIHNhdmVzIGl0IGludG8gdGhlIGRhdGFiYXNlLlxuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCBUaGUgaWQgb2YgdGhlIHVzZXIgdG8gZ2VuZXJhdGUgdGhlICBlLW1haWwgdmVyaWZpY2F0aW9uIHRva2VuIGZvci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbCBXaGljaCBhZGRyZXNzIG9mIHRoZSB1c2VyIHRvIGdlbmVyYXRlIHRoZSBlLW1haWwgdmVyaWZpY2F0aW9uIHRva2VuIGZvci4gVGhpcyBhZGRyZXNzIG11c3QgYmUgaW4gdGhlIHVzZXIncyBgZW1haWxzYCBsaXN0LiBJZiBgbnVsbGAsIGRlZmF1bHRzIHRvIHRoZSBmaXJzdCB1bnZlcmlmaWVkIGVtYWlsIGluIHRoZSBsaXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtleHRyYVRva2VuRGF0YV0gT3B0aW9uYWwgYWRkaXRpb25hbCBkYXRhIHRvIGJlIGFkZGVkIGludG8gdGhlIHRva2VuIHJlY29yZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB3aXRoIHtlbWFpbCwgdXNlciwgdG9rZW59IHZhbHVlcy5cbiAqIEBpbXBvcnRGcm9tUGFja2FnZSBhY2NvdW50cy1iYXNlXG4gKi9cbkFjY291bnRzLmdlbmVyYXRlVmVyaWZpY2F0aW9uVG9rZW4gPSAodXNlcklkLCBlbWFpbCwgZXh0cmFUb2tlbkRhdGEpID0+IHtcbiAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGV4aXN0cywgYW5kIGVtYWlsIGlzIG9uZSBvZiB0aGVpciBhZGRyZXNzZXMuXG4gIGNvbnN0IHVzZXIgPSBnZXRVc2VyQnlJZCh1c2VySWQpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBoYW5kbGVFcnJvcihcIkNhbid0IGZpbmQgdXNlclwiKTtcbiAgfVxuXG4gIC8vIHBpY2sgdGhlIGZpcnN0IHVudmVyaWZpZWQgZW1haWwgaWYgd2Ugd2VyZW4ndCBwYXNzZWQgYW4gZW1haWwuXG4gIGlmICghZW1haWwpIHtcbiAgICBjb25zdCBlbWFpbFJlY29yZCA9ICh1c2VyLmVtYWlscyB8fCBbXSkuZmluZChlID0+ICFlLnZlcmlmaWVkKTtcbiAgICBlbWFpbCA9IChlbWFpbFJlY29yZCB8fCB7fSkuYWRkcmVzcztcblxuICAgIGlmICghZW1haWwpIHtcbiAgICAgIGhhbmRsZUVycm9yKFwiVGhhdCB1c2VyIGhhcyBubyB1bnZlcmlmaWVkIGVtYWlsIGFkZHJlc3Nlcy5cIik7XG4gICAgfVxuICB9XG5cbiAgLy8gbWFrZSBzdXJlIHdlIGhhdmUgYSB2YWxpZCBlbWFpbFxuICBpZiAoIWVtYWlsIHx8IFxuICAgICEocGx1Y2tBZGRyZXNzZXModXNlci5lbWFpbHMpLmluY2x1ZGVzKGVtYWlsKSkpIHtcbiAgICBoYW5kbGVFcnJvcihcIk5vIHN1Y2ggZW1haWwgZm9yIHVzZXIuXCIpO1xuICB9XG5cbiAgY29uc3QgdG9rZW4gPSBSYW5kb20uc2VjcmV0KCk7XG4gIGNvbnN0IHRva2VuUmVjb3JkID0ge1xuICAgIHRva2VuLFxuICAgIC8vIFRPRE86IFRoaXMgc2hvdWxkIHByb2JhYmx5IGJlIHJlbmFtZWQgdG8gXCJlbWFpbFwiIHRvIG1hdGNoIHJlc2V0IHRva2VuIHJlY29yZC5cbiAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gIH07XG5cbiAgaWYgKGV4dHJhVG9rZW5EYXRhKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0b2tlblJlY29yZCwgZXh0cmFUb2tlbkRhdGEpO1xuICB9XG5cbiAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyLl9pZH0sIHskcHVzaDoge1xuICAgICdzZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMnOiB0b2tlblJlY29yZFxuICB9fSk7XG5cbiAgLy8gYmVmb3JlIHBhc3NpbmcgdG8gdGVtcGxhdGUsIHVwZGF0ZSB1c2VyIG9iamVjdCB3aXRoIG5ldyB0b2tlblxuICBNZXRlb3IuX2Vuc3VyZSh1c2VyLCAnc2VydmljZXMnLCAnZW1haWwnKTtcbiAgaWYgKCF1c2VyLnNlcnZpY2VzLmVtYWlsLnZlcmlmaWNhdGlvblRva2Vucykge1xuICAgIHVzZXIuc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zID0gW107XG4gIH1cbiAgdXNlci5zZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMucHVzaCh0b2tlblJlY29yZCk7XG5cbiAgcmV0dXJuIHtlbWFpbCwgdXNlciwgdG9rZW59O1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBDcmVhdGVzIG9wdGlvbnMgZm9yIGVtYWlsIHNlbmRpbmcgZm9yIHJlc2V0IHBhc3N3b3JkIGFuZCBlbnJvbGwgYWNjb3VudCBlbWFpbHMuXG4gKiBZb3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHdoZW4gY3VzdG9taXppbmcgYSByZXNldCBwYXNzd29yZCBvciBlbnJvbGwgYWNjb3VudCBlbWFpbCBzZW5kaW5nLlxuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtPYmplY3R9IGVtYWlsIFdoaWNoIGFkZHJlc3Mgb2YgdGhlIHVzZXIncyB0byBzZW5kIHRoZSBlbWFpbCB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyIFRoZSB1c2VyIG9iamVjdCB0byBnZW5lcmF0ZSBvcHRpb25zIGZvci5cbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJMIHRvIHdoaWNoIHVzZXIgaXMgZGlyZWN0ZWQgdG8gY29uZmlybSB0aGUgZW1haWwuXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVhc29uIGByZXNldFBhc3N3b3JkYCBvciBgZW5yb2xsQWNjb3VudGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBPcHRpb25zIHdoaWNoIGNhbiBiZSBwYXNzZWQgdG8gYEVtYWlsLnNlbmRgLlxuICogQGltcG9ydEZyb21QYWNrYWdlIGFjY291bnRzLWJhc2VcbiAqL1xuQWNjb3VudHMuZ2VuZXJhdGVPcHRpb25zRm9yRW1haWwgPSAoZW1haWwsIHVzZXIsIHVybCwgcmVhc29uKSA9PiB7XG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgdG86IGVtYWlsLFxuICAgIGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzW3JlYXNvbl0uZnJvbVxuICAgICAgPyBBY2NvdW50cy5lbWFpbFRlbXBsYXRlc1tyZWFzb25dLmZyb20odXNlcilcbiAgICAgIDogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICBzdWJqZWN0OiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlc1tyZWFzb25dLnN1YmplY3QodXNlcilcbiAgfTtcblxuICBpZiAodHlwZW9mIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzW3JlYXNvbl0udGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMudGV4dCA9IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzW3JlYXNvbl0udGV4dCh1c2VyLCB1cmwpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlc1tyZWFzb25dLmh0bWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvcHRpb25zLmh0bWwgPSBBY2NvdW50cy5lbWFpbFRlbXBsYXRlc1tyZWFzb25dLmh0bWwodXNlciwgdXJsKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuaGVhZGVycyA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zLmhlYWRlcnMgPSBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5oZWFkZXJzO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG4vLyBzZW5kIHRoZSB1c2VyIGFuIGVtYWlsIHdpdGggYSBsaW5rIHRoYXQgd2hlbiBvcGVuZWQgYWxsb3dzIHRoZSB1c2VyXG4vLyB0byBzZXQgYSBuZXcgcGFzc3dvcmQsIHdpdGhvdXQgdGhlIG9sZCBwYXNzd29yZC5cblxuLyoqXG4gKiBAc3VtbWFyeSBTZW5kIGFuIGVtYWlsIHdpdGggYSBsaW5rIHRoZSB1c2VyIGNhbiB1c2UgdG8gcmVzZXQgdGhlaXIgcGFzc3dvcmQuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBpZCBvZiB0aGUgdXNlciB0byBzZW5kIGVtYWlsIHRvLlxuICogQHBhcmFtIHtTdHJpbmd9IFtlbWFpbF0gT3B0aW9uYWwuIFdoaWNoIGFkZHJlc3Mgb2YgdGhlIHVzZXIncyB0byBzZW5kIHRoZSBlbWFpbCB0by4gVGhpcyBhZGRyZXNzIG11c3QgYmUgaW4gdGhlIHVzZXIncyBgZW1haWxzYCBsaXN0LiBEZWZhdWx0cyB0byB0aGUgZmlyc3QgZW1haWwgaW4gdGhlIGxpc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW2V4dHJhVG9rZW5EYXRhXSBPcHRpb25hbCBhZGRpdGlvbmFsIGRhdGEgdG8gYmUgYWRkZWQgaW50byB0aGUgdG9rZW4gcmVjb3JkLlxuICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IHdpdGgge2VtYWlsLCB1c2VyLCB0b2tlbiwgdXJsLCBvcHRpb25zfSB2YWx1ZXMuXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5zZW5kUmVzZXRQYXNzd29yZEVtYWlsID0gKHVzZXJJZCwgZW1haWwsIGV4dHJhVG9rZW5EYXRhKSA9PiB7XG4gIGNvbnN0IHtlbWFpbDogcmVhbEVtYWlsLCB1c2VyLCB0b2tlbn0gPVxuICAgIEFjY291bnRzLmdlbmVyYXRlUmVzZXRUb2tlbih1c2VySWQsIGVtYWlsLCAncmVzZXRQYXNzd29yZCcsIGV4dHJhVG9rZW5EYXRhKTtcbiAgY29uc3QgdXJsID0gQWNjb3VudHMudXJscy5yZXNldFBhc3N3b3JkKHRva2VuKTtcbiAgY29uc3Qgb3B0aW9ucyA9IEFjY291bnRzLmdlbmVyYXRlT3B0aW9uc0ZvckVtYWlsKHJlYWxFbWFpbCwgdXNlciwgdXJsLCAncmVzZXRQYXNzd29yZCcpO1xuICBFbWFpbC5zZW5kKG9wdGlvbnMpO1xuICByZXR1cm4ge2VtYWlsOiByZWFsRW1haWwsIHVzZXIsIHRva2VuLCB1cmwsIG9wdGlvbnN9O1xufTtcblxuLy8gc2VuZCB0aGUgdXNlciBhbiBlbWFpbCBpbmZvcm1pbmcgdGhlbSB0aGF0IHRoZWlyIGFjY291bnQgd2FzIGNyZWF0ZWQsIHdpdGhcbi8vIGEgbGluayB0aGF0IHdoZW4gb3BlbmVkIGJvdGggbWFya3MgdGhlaXIgZW1haWwgYXMgdmVyaWZpZWQgYW5kIGZvcmNlcyB0aGVtXG4vLyB0byBjaG9vc2UgdGhlaXIgcGFzc3dvcmQuIFRoZSBlbWFpbCBtdXN0IGJlIG9uZSBvZiB0aGUgYWRkcmVzc2VzIGluIHRoZVxuLy8gdXNlcidzIGVtYWlscyBmaWVsZCwgb3IgdW5kZWZpbmVkIHRvIHBpY2sgdGhlIGZpcnN0IGVtYWlsIGF1dG9tYXRpY2FsbHkuXG4vL1xuLy8gVGhpcyBpcyBub3QgY2FsbGVkIGF1dG9tYXRpY2FsbHkuIEl0IG11c3QgYmUgY2FsbGVkIG1hbnVhbGx5IGlmIHlvdVxuLy8gd2FudCB0byB1c2UgZW5yb2xsbWVudCBlbWFpbHMuXG5cbi8qKlxuICogQHN1bW1hcnkgU2VuZCBhbiBlbWFpbCB3aXRoIGEgbGluayB0aGUgdXNlciBjYW4gdXNlIHRvIHNldCB0aGVpciBpbml0aWFsIHBhc3N3b3JkLlxuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCBUaGUgaWQgb2YgdGhlIHVzZXIgdG8gc2VuZCBlbWFpbCB0by5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbZW1haWxdIE9wdGlvbmFsLiBXaGljaCBhZGRyZXNzIG9mIHRoZSB1c2VyJ3MgdG8gc2VuZCB0aGUgZW1haWwgdG8uIFRoaXMgYWRkcmVzcyBtdXN0IGJlIGluIHRoZSB1c2VyJ3MgYGVtYWlsc2AgbGlzdC4gRGVmYXVsdHMgdG8gdGhlIGZpcnN0IGVtYWlsIGluIHRoZSBsaXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtleHRyYVRva2VuRGF0YV0gT3B0aW9uYWwgYWRkaXRpb25hbCBkYXRhIHRvIGJlIGFkZGVkIGludG8gdGhlIHRva2VuIHJlY29yZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB3aXRoIHtlbWFpbCwgdXNlciwgdG9rZW4sIHVybCwgb3B0aW9uc30gdmFsdWVzLlxuICogQGltcG9ydEZyb21QYWNrYWdlIGFjY291bnRzLWJhc2VcbiAqL1xuQWNjb3VudHMuc2VuZEVucm9sbG1lbnRFbWFpbCA9ICh1c2VySWQsIGVtYWlsLCBleHRyYVRva2VuRGF0YSkgPT4ge1xuICBjb25zdCB7ZW1haWw6IHJlYWxFbWFpbCwgdXNlciwgdG9rZW59ID1cbiAgICBBY2NvdW50cy5nZW5lcmF0ZVJlc2V0VG9rZW4odXNlcklkLCBlbWFpbCwgJ2Vucm9sbEFjY291bnQnLCBleHRyYVRva2VuRGF0YSk7XG4gIGNvbnN0IHVybCA9IEFjY291bnRzLnVybHMuZW5yb2xsQWNjb3VudCh0b2tlbik7XG4gIGNvbnN0IG9wdGlvbnMgPSBBY2NvdW50cy5nZW5lcmF0ZU9wdGlvbnNGb3JFbWFpbChyZWFsRW1haWwsIHVzZXIsIHVybCwgJ2Vucm9sbEFjY291bnQnKTtcbiAgRW1haWwuc2VuZChvcHRpb25zKTtcbiAgcmV0dXJuIHtlbWFpbDogcmVhbEVtYWlsLCB1c2VyLCB0b2tlbiwgdXJsLCBvcHRpb25zfTtcbn07XG5cblxuLy8gVGFrZSB0b2tlbiBmcm9tIHNlbmRSZXNldFBhc3N3b3JkRW1haWwgb3Igc2VuZEVucm9sbG1lbnRFbWFpbCwgY2hhbmdlXG4vLyB0aGUgdXNlcnMgcGFzc3dvcmQsIGFuZCBsb2cgdGhlbSBpbi5cbk1ldGVvci5tZXRob2RzKHtyZXNldFBhc3N3b3JkOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICBjb25zdCB0b2tlbiA9IGFyZ3NbMF07XG4gIGNvbnN0IG5ld1Bhc3N3b3JkID0gYXJnc1sxXTtcbiAgcmV0dXJuIEFjY291bnRzLl9sb2dpbk1ldGhvZChcbiAgICB0aGlzLFxuICAgIFwicmVzZXRQYXNzd29yZFwiLFxuICAgIGFyZ3MsXG4gICAgXCJwYXNzd29yZFwiLFxuICAgICgpID0+IHtcbiAgICAgIGNoZWNrKHRva2VuLCBTdHJpbmcpO1xuICAgICAgY2hlY2sobmV3UGFzc3dvcmQsIHBhc3N3b3JkVmFsaWRhdG9yKTtcblxuICAgICAgY29uc3QgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgXCJzZXJ2aWNlcy5wYXNzd29yZC5yZXNldC50b2tlblwiOiB0b2tlbn0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlRva2VuIGV4cGlyZWRcIik7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHdoZW4sIHJlYXNvbiwgZW1haWwgfSA9IHVzZXIuc2VydmljZXMucGFzc3dvcmQucmVzZXQ7XG4gICAgICBsZXQgdG9rZW5MaWZldGltZU1zID0gQWNjb3VudHMuX2dldFBhc3N3b3JkUmVzZXRUb2tlbkxpZmV0aW1lTXMoKTtcbiAgICAgIGlmIChyZWFzb24gPT09IFwiZW5yb2xsXCIpIHtcbiAgICAgICAgdG9rZW5MaWZldGltZU1zID0gQWNjb3VudHMuX2dldFBhc3N3b3JkRW5yb2xsVG9rZW5MaWZldGltZU1zKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjdXJyZW50VGltZU1zID0gRGF0ZS5ub3coKTtcbiAgICAgIGlmICgoY3VycmVudFRpbWVNcyAtIHdoZW4pID4gdG9rZW5MaWZldGltZU1zKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJUb2tlbiBleHBpcmVkXCIpO1xuICAgICAgaWYgKCEocGx1Y2tBZGRyZXNzZXModXNlci5lbWFpbHMpLmluY2x1ZGVzKGVtYWlsKSkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcklkOiB1c2VyLl9pZCxcbiAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVG9rZW4gaGFzIGludmFsaWQgZW1haWwgYWRkcmVzc1wiKVxuICAgICAgICB9O1xuXG4gICAgICBjb25zdCBoYXNoZWQgPSBoYXNoUGFzc3dvcmQobmV3UGFzc3dvcmQpO1xuXG4gICAgICAvLyBOT1RFOiBXZSdyZSBhYm91dCB0byBpbnZhbGlkYXRlIHRva2VucyBvbiB0aGUgdXNlciwgd2hvIHdlIG1pZ2h0IGJlXG4gICAgICAvLyBsb2dnZWQgaW4gYXMuIE1ha2Ugc3VyZSB0byBhdm9pZCBsb2dnaW5nIG91cnNlbHZlcyBvdXQgaWYgdGhpc1xuICAgICAgLy8gaGFwcGVucy4gQnV0IGFsc28gbWFrZSBzdXJlIG5vdCB0byBsZWF2ZSB0aGUgY29ubmVjdGlvbiBpbiBhIHN0YXRlXG4gICAgICAvLyBvZiBoYXZpbmcgYSBiYWQgdG9rZW4gc2V0IGlmIHRoaW5ncyBmYWlsLlxuICAgICAgY29uc3Qgb2xkVG9rZW4gPSBBY2NvdW50cy5fZ2V0TG9naW5Ub2tlbih0aGlzLmNvbm5lY3Rpb24uaWQpO1xuICAgICAgQWNjb3VudHMuX3NldExvZ2luVG9rZW4odXNlci5faWQsIHRoaXMuY29ubmVjdGlvbiwgbnVsbCk7XG4gICAgICBjb25zdCByZXNldFRvT2xkVG9rZW4gPSAoKSA9PlxuICAgICAgICBBY2NvdW50cy5fc2V0TG9naW5Ub2tlbih1c2VyLl9pZCwgdGhpcy5jb25uZWN0aW9uLCBvbGRUb2tlbik7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdXNlciByZWNvcmQgYnk6XG4gICAgICAgIC8vIC0gQ2hhbmdpbmcgdGhlIHBhc3N3b3JkIHRvIHRoZSBuZXcgb25lXG4gICAgICAgIC8vIC0gRm9yZ2V0dGluZyBhYm91dCB0aGUgcmVzZXQgdG9rZW4gdGhhdCB3YXMganVzdCB1c2VkXG4gICAgICAgIC8vIC0gVmVyaWZ5aW5nIHRoZWlyIGVtYWlsLCBzaW5jZSB0aGV5IGdvdCB0aGUgcGFzc3dvcmQgcmVzZXQgdmlhIGVtYWlsLlxuICAgICAgICBjb25zdCBhZmZlY3RlZFJlY29yZHMgPSBNZXRlb3IudXNlcnMudXBkYXRlKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIF9pZDogdXNlci5faWQsXG4gICAgICAgICAgICAnZW1haWxzLmFkZHJlc3MnOiBlbWFpbCxcbiAgICAgICAgICAgICdzZXJ2aWNlcy5wYXNzd29yZC5yZXNldC50b2tlbic6IHRva2VuXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7JHNldDogeydzZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQnOiBoYXNoZWQsXG4gICAgICAgICAgICAgICAgICAnZW1haWxzLiQudmVyaWZpZWQnOiB0cnVlfSxcbiAgICAgICAgICAgJHVuc2V0OiB7J3NlcnZpY2VzLnBhc3N3b3JkLnJlc2V0JzogMSxcbiAgICAgICAgICAgICAgICAgICAgJ3NlcnZpY2VzLnBhc3N3b3JkLnNycCc6IDF9fSk7XG4gICAgICAgIGlmIChhZmZlY3RlZFJlY29yZHMgIT09IDEpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXG4gICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW52YWxpZCBlbWFpbFwiKVxuICAgICAgICAgIH07XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzZXRUb09sZFRva2VuKCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cblxuICAgICAgLy8gUmVwbGFjZSBhbGwgdmFsaWQgbG9naW4gdG9rZW5zIHdpdGggbmV3IG9uZXMgKGNoYW5naW5nXG4gICAgICAvLyBwYXNzd29yZCBzaG91bGQgaW52YWxpZGF0ZSBleGlzdGluZyBzZXNzaW9ucykuXG4gICAgICBBY2NvdW50cy5fY2xlYXJBbGxMb2dpblRva2Vucyh1c2VyLl9pZCk7XG5cbiAgICAgIHJldHVybiB7dXNlcklkOiB1c2VyLl9pZH07XG4gICAgfVxuICApO1xufX0pO1xuXG4vLy9cbi8vLyBFTUFJTCBWRVJJRklDQVRJT05cbi8vL1xuXG5cbi8vIHNlbmQgdGhlIHVzZXIgYW4gZW1haWwgd2l0aCBhIGxpbmsgdGhhdCB3aGVuIG9wZW5lZCBtYXJrcyB0aGF0XG4vLyBhZGRyZXNzIGFzIHZlcmlmaWVkXG5cbi8qKlxuICogQHN1bW1hcnkgU2VuZCBhbiBlbWFpbCB3aXRoIGEgbGluayB0aGUgdXNlciBjYW4gdXNlIHZlcmlmeSB0aGVpciBlbWFpbCBhZGRyZXNzLlxuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCBUaGUgaWQgb2YgdGhlIHVzZXIgdG8gc2VuZCBlbWFpbCB0by5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbZW1haWxdIE9wdGlvbmFsLiBXaGljaCBhZGRyZXNzIG9mIHRoZSB1c2VyJ3MgdG8gc2VuZCB0aGUgZW1haWwgdG8uIFRoaXMgYWRkcmVzcyBtdXN0IGJlIGluIHRoZSB1c2VyJ3MgYGVtYWlsc2AgbGlzdC4gRGVmYXVsdHMgdG8gdGhlIGZpcnN0IHVudmVyaWZpZWQgZW1haWwgaW4gdGhlIGxpc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW2V4dHJhVG9rZW5EYXRhXSBPcHRpb25hbCBhZGRpdGlvbmFsIGRhdGEgdG8gYmUgYWRkZWQgaW50byB0aGUgdG9rZW4gcmVjb3JkLlxuICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IHdpdGgge2VtYWlsLCB1c2VyLCB0b2tlbiwgdXJsLCBvcHRpb25zfSB2YWx1ZXMuXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwgPSAodXNlcklkLCBlbWFpbCwgZXh0cmFUb2tlbkRhdGEpID0+IHtcbiAgLy8gWFhYIEFsc28gZ2VuZXJhdGUgYSBsaW5rIHVzaW5nIHdoaWNoIHNvbWVvbmUgY2FuIGRlbGV0ZSB0aGlzXG4gIC8vIGFjY291bnQgaWYgdGhleSBvd24gc2FpZCBhZGRyZXNzIGJ1dCB3ZXJlbid0IHRob3NlIHdobyBjcmVhdGVkXG4gIC8vIHRoaXMgYWNjb3VudC5cblxuICBjb25zdCB7ZW1haWw6IHJlYWxFbWFpbCwgdXNlciwgdG9rZW59ID1cbiAgICBBY2NvdW50cy5nZW5lcmF0ZVZlcmlmaWNhdGlvblRva2VuKHVzZXJJZCwgZW1haWwsIGV4dHJhVG9rZW5EYXRhKTtcbiAgY29uc3QgdXJsID0gQWNjb3VudHMudXJscy52ZXJpZnlFbWFpbCh0b2tlbik7XG4gIGNvbnN0IG9wdGlvbnMgPSBBY2NvdW50cy5nZW5lcmF0ZU9wdGlvbnNGb3JFbWFpbChyZWFsRW1haWwsIHVzZXIsIHVybCwgJ3ZlcmlmeUVtYWlsJyk7XG4gIEVtYWlsLnNlbmQob3B0aW9ucyk7XG4gIHJldHVybiB7ZW1haWw6IHJlYWxFbWFpbCwgdXNlciwgdG9rZW4sIHVybCwgb3B0aW9uc307XG59O1xuXG4vLyBUYWtlIHRva2VuIGZyb20gc2VuZFZlcmlmaWNhdGlvbkVtYWlsLCBtYXJrIHRoZSBlbWFpbCBhcyB2ZXJpZmllZCxcbi8vIGFuZCBsb2cgdGhlbSBpbi5cbk1ldGVvci5tZXRob2RzKHt2ZXJpZnlFbWFpbDogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgY29uc3QgdG9rZW4gPSBhcmdzWzBdO1xuICByZXR1cm4gQWNjb3VudHMuX2xvZ2luTWV0aG9kKFxuICAgIHRoaXMsXG4gICAgXCJ2ZXJpZnlFbWFpbFwiLFxuICAgIGFyZ3MsXG4gICAgXCJwYXNzd29yZFwiLFxuICAgICgpID0+IHtcbiAgICAgIGNoZWNrKHRva2VuLCBTdHJpbmcpO1xuXG4gICAgICBjb25zdCB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoXG4gICAgICAgIHsnc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zLnRva2VuJzogdG9rZW59KTtcbiAgICAgIGlmICghdXNlcilcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVmVyaWZ5IGVtYWlsIGxpbmsgZXhwaXJlZFwiKTtcblxuICAgICAgICBjb25zdCB0b2tlblJlY29yZCA9IHVzZXIuc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zLmZpbmQoXG4gICAgICAgICAgdCA9PiB0LnRva2VuID09IHRva2VuXG4gICAgICAgICk7XG4gICAgICBpZiAoIXRva2VuUmVjb3JkKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXG4gICAgICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlZlcmlmeSBlbWFpbCBsaW5rIGV4cGlyZWRcIilcbiAgICAgICAgfTtcblxuICAgICAgY29uc3QgZW1haWxzUmVjb3JkID0gdXNlci5lbWFpbHMuZmluZChcbiAgICAgICAgZSA9PiBlLmFkZHJlc3MgPT0gdG9rZW5SZWNvcmQuYWRkcmVzc1xuICAgICAgKTtcbiAgICAgIGlmICghZW1haWxzUmVjb3JkKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXG4gICAgICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlZlcmlmeSBlbWFpbCBsaW5rIGlzIGZvciB1bmtub3duIGFkZHJlc3NcIilcbiAgICAgICAgfTtcblxuICAgICAgLy8gQnkgaW5jbHVkaW5nIHRoZSBhZGRyZXNzIGluIHRoZSBxdWVyeSwgd2UgY2FuIHVzZSAnZW1haWxzLiQnIGluIHRoZVxuICAgICAgLy8gbW9kaWZpZXIgdG8gZ2V0IGEgcmVmZXJlbmNlIHRvIHRoZSBzcGVjaWZpYyBvYmplY3QgaW4gdGhlIGVtYWlsc1xuICAgICAgLy8gYXJyYXkuIFNlZVxuICAgICAgLy8gaHR0cDovL3d3dy5tb25nb2RiLm9yZy9kaXNwbGF5L0RPQ1MvVXBkYXRpbmcvI1VwZGF0aW5nLVRoZSUyNHBvc2l0aW9uYWxvcGVyYXRvcilcbiAgICAgIC8vIGh0dHA6Ly93d3cubW9uZ29kYi5vcmcvZGlzcGxheS9ET0NTL1VwZGF0aW5nI1VwZGF0aW5nLSUyNHB1bGxcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoXG4gICAgICAgIHtfaWQ6IHVzZXIuX2lkLFxuICAgICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdG9rZW5SZWNvcmQuYWRkcmVzc30sXG4gICAgICAgIHskc2V0OiB7J2VtYWlscy4kLnZlcmlmaWVkJzogdHJ1ZX0sXG4gICAgICAgICAkcHVsbDogeydzZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMnOiB7YWRkcmVzczogdG9rZW5SZWNvcmQuYWRkcmVzc319fSk7XG5cbiAgICAgIHJldHVybiB7dXNlcklkOiB1c2VyLl9pZH07XG4gICAgfVxuICApO1xufX0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEFkZCBhbiBlbWFpbCBhZGRyZXNzIGZvciBhIHVzZXIuIFVzZSB0aGlzIGluc3RlYWQgb2YgZGlyZWN0bHlcbiAqIHVwZGF0aW5nIHRoZSBkYXRhYmFzZS4gVGhlIG9wZXJhdGlvbiB3aWxsIGZhaWwgaWYgdGhlcmUgaXMgYSBkaWZmZXJlbnQgdXNlclxuICogd2l0aCBhbiBlbWFpbCBvbmx5IGRpZmZlcmluZyBpbiBjYXNlLiBJZiB0aGUgc3BlY2lmaWVkIHVzZXIgaGFzIGFuIGV4aXN0aW5nXG4gKiBlbWFpbCBvbmx5IGRpZmZlcmluZyBpbiBjYXNlIGhvd2V2ZXIsIHdlIHJlcGxhY2UgaXQuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBJRCBvZiB0aGUgdXNlciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmV3RW1haWwgQSBuZXcgZW1haWwgYWRkcmVzcyBmb3IgdGhlIHVzZXIuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt2ZXJpZmllZF0gT3B0aW9uYWwgLSB3aGV0aGVyIHRoZSBuZXcgZW1haWwgYWRkcmVzcyBzaG91bGRcbiAqIGJlIG1hcmtlZCBhcyB2ZXJpZmllZC4gRGVmYXVsdHMgdG8gZmFsc2UuXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgYWNjb3VudHMtYmFzZVxuICovXG5BY2NvdW50cy5hZGRFbWFpbCA9ICh1c2VySWQsIG5ld0VtYWlsLCB2ZXJpZmllZCkgPT4ge1xuICBjaGVjayh1c2VySWQsIE5vbkVtcHR5U3RyaW5nKTtcbiAgY2hlY2sobmV3RW1haWwsIE5vbkVtcHR5U3RyaW5nKTtcbiAgY2hlY2sodmVyaWZpZWQsIE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pKTtcblxuICBpZiAodmVyaWZpZWQgPT09IHZvaWQgMCkge1xuICAgIHZlcmlmaWVkID0gZmFsc2U7XG4gIH1cblxuICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5SWQodXNlcklkKTtcbiAgaWYgKCF1c2VyKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgbm90IGZvdW5kXCIpO1xuXG4gIC8vIEFsbG93IHVzZXJzIHRvIGNoYW5nZSB0aGVpciBvd24gZW1haWwgdG8gYSB2ZXJzaW9uIHdpdGggYSBkaWZmZXJlbnQgY2FzZVxuXG4gIC8vIFdlIGRvbid0IGhhdmUgdG8gY2FsbCBjaGVja0ZvckNhc2VJbnNlbnNpdGl2ZUR1cGxpY2F0ZXMgdG8gZG8gYSBjYXNlXG4gIC8vIGluc2Vuc2l0aXZlIGNoZWNrIGFjcm9zcyBhbGwgZW1haWxzIGluIHRoZSBkYXRhYmFzZSBoZXJlIGJlY2F1c2U6ICgxKSBpZlxuICAvLyB0aGVyZSBpcyBubyBjYXNlLWluc2Vuc2l0aXZlIGR1cGxpY2F0ZSBiZXR3ZWVuIHRoaXMgdXNlciBhbmQgb3RoZXIgdXNlcnMsXG4gIC8vIHRoZW4gd2UgYXJlIE9LIGFuZCAoMikgaWYgdGhpcyB3b3VsZCBjcmVhdGUgYSBjb25mbGljdCB3aXRoIG90aGVyIHVzZXJzXG4gIC8vIHRoZW4gdGhlcmUgd291bGQgYWxyZWFkeSBiZSBhIGNhc2UtaW5zZW5zaXRpdmUgZHVwbGljYXRlIGFuZCB3ZSBjYW4ndCBmaXhcbiAgLy8gdGhhdCBpbiB0aGlzIGNvZGUgYW55d2F5LlxuICBjb25zdCBjYXNlSW5zZW5zaXRpdmVSZWdFeHAgPVxuICAgIG5ldyBSZWdFeHAoYF4ke01ldGVvci5fZXNjYXBlUmVnRXhwKG5ld0VtYWlsKX0kYCwgJ2knKTtcblxuICBjb25zdCBkaWRVcGRhdGVPd25FbWFpbCA9IHVzZXIuZW1haWxzLnJlZHVjZShcbiAgICAocHJldiwgZW1haWwpID0+IHtcbiAgICAgIGlmIChjYXNlSW5zZW5zaXRpdmVSZWdFeHAudGVzdChlbWFpbC5hZGRyZXNzKSkge1xuICAgICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHVzZXIuX2lkLFxuICAgICAgICAgICdlbWFpbHMuYWRkcmVzcyc6IGVtYWlsLmFkZHJlc3NcbiAgICAgICAgfSwgeyRzZXQ6IHtcbiAgICAgICAgICAnZW1haWxzLiQuYWRkcmVzcyc6IG5ld0VtYWlsLFxuICAgICAgICAgICdlbWFpbHMuJC52ZXJpZmllZCc6IHZlcmlmaWVkXG4gICAgICAgIH19KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgIH1cbiAgICB9LCBcbiAgICBmYWxzZVxuICApO1xuXG4gIC8vIEluIHRoZSBvdGhlciB1cGRhdGVzIGJlbG93LCB3ZSBoYXZlIHRvIGRvIGFub3RoZXIgY2FsbCB0b1xuICAvLyBjaGVja0ZvckNhc2VJbnNlbnNpdGl2ZUR1cGxpY2F0ZXMgdG8gbWFrZSBzdXJlIHRoYXQgbm8gY29uZmxpY3RpbmcgdmFsdWVzXG4gIC8vIHdlcmUgYWRkZWQgdG8gdGhlIGRhdGFiYXNlIGluIHRoZSBtZWFudGltZS4gV2UgZG9uJ3QgaGF2ZSB0byBkbyB0aGlzIGZvclxuICAvLyB0aGUgY2FzZSB3aGVyZSB0aGUgdXNlciBpcyB1cGRhdGluZyB0aGVpciBlbWFpbCBhZGRyZXNzIHRvIG9uZSB0aGF0IGlzIHRoZVxuICAvLyBzYW1lIGFzIGJlZm9yZSwgYnV0IG9ubHkgZGlmZmVyZW50IGJlY2F1c2Ugb2YgY2FwaXRhbGl6YXRpb24uIFJlYWQgdGhlXG4gIC8vIGJpZyBjb21tZW50IGFib3ZlIHRvIHVuZGVyc3RhbmQgd2h5LlxuXG4gIGlmIChkaWRVcGRhdGVPd25FbWFpbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFBlcmZvcm0gYSBjYXNlIGluc2Vuc2l0aXZlIGNoZWNrIGZvciBkdXBsaWNhdGVzIGJlZm9yZSB1cGRhdGVcbiAgY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzKCdlbWFpbHMuYWRkcmVzcycsICdFbWFpbCcsIG5ld0VtYWlsLCB1c2VyLl9pZCk7XG5cbiAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7XG4gICAgX2lkOiB1c2VyLl9pZFxuICB9LCB7XG4gICAgJGFkZFRvU2V0OiB7XG4gICAgICBlbWFpbHM6IHtcbiAgICAgICAgYWRkcmVzczogbmV3RW1haWwsXG4gICAgICAgIHZlcmlmaWVkOiB2ZXJpZmllZFxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gUGVyZm9ybSBhbm90aGVyIGNoZWNrIGFmdGVyIHVwZGF0ZSwgaW4gY2FzZSBhIG1hdGNoaW5nIHVzZXIgaGFzIGJlZW5cbiAgLy8gaW5zZXJ0ZWQgaW4gdGhlIG1lYW50aW1lXG4gIHRyeSB7XG4gICAgY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzKCdlbWFpbHMuYWRkcmVzcycsICdFbWFpbCcsIG5ld0VtYWlsLCB1c2VyLl9pZCk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgLy8gVW5kbyB1cGRhdGUgaWYgdGhlIGNoZWNrIGZhaWxzXG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyLl9pZH0sXG4gICAgICB7JHB1bGw6IHtlbWFpbHM6IHthZGRyZXNzOiBuZXdFbWFpbH19fSk7XG4gICAgdGhyb3cgZXg7XG4gIH1cbn1cblxuLyoqXG4gKiBAc3VtbWFyeSBSZW1vdmUgYW4gZW1haWwgYWRkcmVzcyBmb3IgYSB1c2VyLiBVc2UgdGhpcyBpbnN0ZWFkIG9mIHVwZGF0aW5nXG4gKiB0aGUgZGF0YWJhc2UgZGlyZWN0bHkuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBJRCBvZiB0aGUgdXNlciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gZW1haWwgVGhlIGVtYWlsIGFkZHJlc3MgdG8gcmVtb3ZlLlxuICogQGltcG9ydEZyb21QYWNrYWdlIGFjY291bnRzLWJhc2VcbiAqL1xuQWNjb3VudHMucmVtb3ZlRW1haWwgPSAodXNlcklkLCBlbWFpbCkgPT4ge1xuICBjaGVjayh1c2VySWQsIE5vbkVtcHR5U3RyaW5nKTtcbiAgY2hlY2soZW1haWwsIE5vbkVtcHR5U3RyaW5nKTtcblxuICBjb25zdCB1c2VyID0gZ2V0VXNlckJ5SWQodXNlcklkKTtcbiAgaWYgKCF1c2VyKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgbm90IGZvdW5kXCIpO1xuXG4gIE1ldGVvci51c2Vycy51cGRhdGUoe19pZDogdXNlci5faWR9LFxuICAgIHskcHVsbDoge2VtYWlsczoge2FkZHJlc3M6IGVtYWlsfX19KTtcbn1cblxuLy8vXG4vLy8gQ1JFQVRJTkcgVVNFUlNcbi8vL1xuXG4vLyBTaGFyZWQgY3JlYXRlVXNlciBmdW5jdGlvbiBjYWxsZWQgZnJvbSB0aGUgY3JlYXRlVXNlciBtZXRob2QsIGJvdGhcbi8vIGlmIG9yaWdpbmF0ZXMgaW4gY2xpZW50IG9yIHNlcnZlciBjb2RlLiBDYWxscyB1c2VyIHByb3ZpZGVkIGhvb2tzLFxuLy8gZG9lcyB0aGUgYWN0dWFsIHVzZXIgaW5zZXJ0aW9uLlxuLy9cbi8vIHJldHVybnMgdGhlIHVzZXIgaWRcbmNvbnN0IGNyZWF0ZVVzZXIgPSBvcHRpb25zID0+IHtcbiAgLy8gVW5rbm93biBrZXlzIGFsbG93ZWQsIGJlY2F1c2UgYSBvbkNyZWF0ZVVzZXJIb29rIGNhbiB0YWtlIGFyYml0cmFyeVxuICAvLyBvcHRpb25zLlxuICBjaGVjayhvcHRpb25zLCBNYXRjaC5PYmplY3RJbmNsdWRpbmcoe1xuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHBhc3N3b3JkOiBNYXRjaC5PcHRpb25hbChwYXNzd29yZFZhbGlkYXRvcilcbiAgfSkpO1xuXG4gIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCB9ID0gb3B0aW9ucztcbiAgaWYgKCF1c2VybmFtZSAmJiAhZW1haWwpXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiTmVlZCB0byBzZXQgYSB1c2VybmFtZSBvciBlbWFpbFwiKTtcblxuICBjb25zdCB1c2VyID0ge3NlcnZpY2VzOiB7fX07XG4gIGlmIChwYXNzd29yZCkge1xuICAgIGNvbnN0IGhhc2hlZCA9IGhhc2hQYXNzd29yZChwYXNzd29yZCk7XG4gICAgdXNlci5zZXJ2aWNlcy5wYXNzd29yZCA9IHsgYmNyeXB0OiBoYXNoZWQgfTtcbiAgfVxuXG4gIGlmICh1c2VybmFtZSlcbiAgICB1c2VyLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gIGlmIChlbWFpbClcbiAgICB1c2VyLmVtYWlscyA9IFt7YWRkcmVzczogZW1haWwsIHZlcmlmaWVkOiBmYWxzZX1dO1xuXG4gIC8vIFBlcmZvcm0gYSBjYXNlIGluc2Vuc2l0aXZlIGNoZWNrIGJlZm9yZSBpbnNlcnRcbiAgY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzKCd1c2VybmFtZScsICdVc2VybmFtZScsIHVzZXJuYW1lKTtcbiAgY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzKCdlbWFpbHMuYWRkcmVzcycsICdFbWFpbCcsIGVtYWlsKTtcblxuICBjb25zdCB1c2VySWQgPSBBY2NvdW50cy5pbnNlcnRVc2VyRG9jKG9wdGlvbnMsIHVzZXIpO1xuICAvLyBQZXJmb3JtIGFub3RoZXIgY2hlY2sgYWZ0ZXIgaW5zZXJ0LCBpbiBjYXNlIGEgbWF0Y2hpbmcgdXNlciBoYXMgYmVlblxuICAvLyBpbnNlcnRlZCBpbiB0aGUgbWVhbnRpbWVcbiAgdHJ5IHtcbiAgICBjaGVja0ZvckNhc2VJbnNlbnNpdGl2ZUR1cGxpY2F0ZXMoJ3VzZXJuYW1lJywgJ1VzZXJuYW1lJywgdXNlcm5hbWUsIHVzZXJJZCk7XG4gICAgY2hlY2tGb3JDYXNlSW5zZW5zaXRpdmVEdXBsaWNhdGVzKCdlbWFpbHMuYWRkcmVzcycsICdFbWFpbCcsIGVtYWlsLCB1c2VySWQpO1xuICB9IGNhdGNoIChleCkge1xuICAgIC8vIFJlbW92ZSBpbnNlcnRlZCB1c2VyIGlmIHRoZSBjaGVjayBmYWlsc1xuICAgIE1ldGVvci51c2Vycy5yZW1vdmUodXNlcklkKTtcbiAgICB0aHJvdyBleDtcbiAgfVxuICByZXR1cm4gdXNlcklkO1xufTtcblxuLy8gbWV0aG9kIGZvciBjcmVhdGUgdXNlci4gUmVxdWVzdHMgY29tZSBmcm9tIHRoZSBjbGllbnQuXG5NZXRlb3IubWV0aG9kcyh7Y3JlYXRlVXNlcjogZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGFyZ3NbMF07XG4gIHJldHVybiBBY2NvdW50cy5fbG9naW5NZXRob2QoXG4gICAgdGhpcyxcbiAgICBcImNyZWF0ZVVzZXJcIixcbiAgICBhcmdzLFxuICAgIFwicGFzc3dvcmRcIixcbiAgICAoKSA9PiB7XG4gICAgICAvLyBjcmVhdGVVc2VyKCkgYWJvdmUgZG9lcyBtb3JlIGNoZWNraW5nLlxuICAgICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICAgIGlmIChBY2NvdW50cy5fb3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlNpZ251cHMgZm9yYmlkZGVuXCIpXG4gICAgICAgIH07XG5cbiAgICAgIC8vIENyZWF0ZSB1c2VyLiByZXN1bHQgY29udGFpbnMgaWQgYW5kIHRva2VuLlxuICAgICAgY29uc3QgdXNlcklkID0gY3JlYXRlVXNlcihvcHRpb25zKTtcbiAgICAgIC8vIHNhZmV0eSBiZWx0LiBjcmVhdGVVc2VyIGlzIHN1cHBvc2VkIHRvIHRocm93IG9uIGVycm9yLiBzZW5kIDUwMCBlcnJvclxuICAgICAgLy8gaW5zdGVhZCBvZiBzZW5kaW5nIGEgdmVyaWZpY2F0aW9uIGVtYWlsIHdpdGggZW1wdHkgdXNlcmlkLlxuICAgICAgaWYgKCEgdXNlcklkKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjcmVhdGVVc2VyIGZhaWxlZCB0byBpbnNlcnQgbmV3IHVzZXJcIik7XG5cbiAgICAgIC8vIElmIGBBY2NvdW50cy5fb3B0aW9ucy5zZW5kVmVyaWZpY2F0aW9uRW1haWxgIGlzIHNldCwgcmVnaXN0ZXJcbiAgICAgIC8vIGEgdG9rZW4gdG8gdmVyaWZ5IHRoZSB1c2VyJ3MgcHJpbWFyeSBlbWFpbCwgYW5kIHNlbmQgaXQgdG9cbiAgICAgIC8vIHRoYXQgYWRkcmVzcy5cbiAgICAgIGlmIChvcHRpb25zLmVtYWlsICYmIEFjY291bnRzLl9vcHRpb25zLnNlbmRWZXJpZmljYXRpb25FbWFpbClcbiAgICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHVzZXJJZCwgb3B0aW9ucy5lbWFpbCk7XG5cbiAgICAgIC8vIGNsaWVudCBnZXRzIGxvZ2dlZCBpbiBhcyB0aGUgbmV3IHVzZXIgYWZ0ZXJ3YXJkcy5cbiAgICAgIHJldHVybiB7dXNlcklkOiB1c2VySWR9O1xuICAgIH1cbiAgKTtcbn19KTtcblxuLy8gQ3JlYXRlIHVzZXIgZGlyZWN0bHkgb24gdGhlIHNlcnZlci5cbi8vXG4vLyBVbmxpa2UgdGhlIGNsaWVudCB2ZXJzaW9uLCB0aGlzIGRvZXMgbm90IGxvZyB5b3UgaW4gYXMgdGhpcyB1c2VyXG4vLyBhZnRlciBjcmVhdGlvbi5cbi8vXG4vLyByZXR1cm5zIHVzZXJJZCBvciB0aHJvd3MgYW4gZXJyb3IgaWYgaXQgY2FuJ3QgY3JlYXRlXG4vL1xuLy8gWFhYIGFkZCBhbm90aGVyIGFyZ3VtZW50IChcInNlcnZlciBvcHRpb25zXCIpIHRoYXQgZ2V0cyBzZW50IHRvIG9uQ3JlYXRlVXNlcixcbi8vIHdoaWNoIGlzIGFsd2F5cyBlbXB0eSB3aGVuIGNhbGxlZCBmcm9tIHRoZSBjcmVhdGVVc2VyIG1ldGhvZD8gZWcsIFwiYWRtaW46XG4vLyB0cnVlXCIsIHdoaWNoIHdlIHdhbnQgdG8gcHJldmVudCB0aGUgY2xpZW50IGZyb20gc2V0dGluZywgYnV0IHdoaWNoIGEgY3VzdG9tXG4vLyBtZXRob2QgY2FsbGluZyBBY2NvdW50cy5jcmVhdGVVc2VyIGNvdWxkIHNldD9cbi8vXG5BY2NvdW50cy5jcmVhdGVVc2VyID0gKG9wdGlvbnMsIGNhbGxiYWNrKSA9PiB7XG4gIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMgfTtcblxuICAvLyBYWFggYWxsb3cgYW4gb3B0aW9uYWwgY2FsbGJhY2s/XG4gIGlmIChjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLmNyZWF0ZVVzZXIgd2l0aCBjYWxsYmFjayBub3Qgc3VwcG9ydGVkIG9uIHRoZSBzZXJ2ZXIgeWV0LlwiKTtcbiAgfVxuXG4gIHJldHVybiBjcmVhdGVVc2VyKG9wdGlvbnMpO1xufTtcblxuLy8vXG4vLy8gUEFTU1dPUkQtU1BFQ0lGSUMgSU5ERVhFUyBPTiBVU0VSU1xuLy8vXG5NZXRlb3IudXNlcnMuX2Vuc3VyZUluZGV4KCdzZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMudG9rZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dW5pcXVlOiAxLCBzcGFyc2U6IDF9KTtcbk1ldGVvci51c2Vycy5fZW5zdXJlSW5kZXgoJ3NlcnZpY2VzLnBhc3N3b3JkLnJlc2V0LnRva2VuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3VuaXF1ZTogMSwgc3BhcnNlOiAxfSk7XG4iXX0=
